import { NextResponse } from "next/server";
import Discussion from "@/app/(models)/discussionModel";
import connect from "@/app/config/db";

const calculateTrendScore = (discussion) => {
  const likesWeight = 1.5;
  const dislikesWeight = -0.7;
  const timeWeight = -1.2;
  const groupMemberWeight = 0.8;

  const now = Date.now();
  const timeSinceCreation = now - new Date(discussion.createdAt).getTime();

  const score =
    discussion.likes * likesWeight +
    discussion.dislikes * dislikesWeight +
    Math.log(timeSinceCreation / (1000 * 3600 * 24)) * timeWeight +
    (discussion.groupId
      ? discussion.groupId.participants.length * groupMemberWeight
      : 0);

  return score;
};

export async function GET(req) {
  try {
    await connect();

    const college = req.nextUrl.searchParams.get("college");
    const aggregationPipeline = [
      {
        $match: { isActive: true },
      },
      {
        $lookup: {
          from: "users",
          localField: "creator",
          foreignField: "_id",
          as: "creator",
        },
      },
      {
        $unwind: "$creator",
      },
      {
        $project: {
          "creator.interestCategories": 0,
          "creator.interestSubcategories": 0,
          "creator.email": 0,
          "creator.createdAt": 0,
          "creator.updatedAt": 0,
          "creator.__v": 0,
          "creator.dob": 0,
          "creator.degree": 0,
          "creator.department": 0,
          "creator.yearInCollege": 0,
          "creator.posts": 0,
          "creator.connection": 0,
          "creator.bio": 0,
          "creator.isAdmin": 0,
          "creator.connection": 0,
          "creator.requestPending": 0,
          "creator.groupsJoined": 0,
        },
      },
      {
        $lookup: {
          from: "groups",
          localField: "groupId",
          foreignField: "_id",
          as: "groupId",
        },
      },
      {
        $unwind: "$groupId",
      },
      {
        $project: {
          "groupId.createdAt": 0,
          "groupId.updatedAt": 0,
          "groupId.__v": 0,
          "groupId.isPublic": 0,
          "groupId.description": 0,
          "groupId.moderators": 0,
          "groupId.creator": 0,
        },
      },
    ];

    if (college) {
      aggregationPipeline.push({
        $match: { "creator.collegeName": college },
      });
    }

    const discussions = await Discussion.aggregate(aggregationPipeline);

    const discussionsWithScores = discussions.map((discussion) => ({
      ...discussion,
      trendScore: calculateTrendScore(discussion),
    }));

    discussionsWithScores.sort((a, b) => b.trendScore - a.trendScore);

    const rankedDiscussions = discussionsWithScores.map((discussion, index) => {
      const previousRank = discussion.previousRank;
      const rankJump =
        Math.abs(previousRank - (index + 1)) === 0
          ? discussion.previousRankJump
          : Math.abs(previousRank - (index + 1));
      const rankChange =
        previousRank === index + 1
          ? discussion.previousRankChange
          : previousRank > index + 1
          ? "increase"
          : "decrease";

      return {
        ...discussion,
        rank: index + 1,
        rankJump,
        rankChange,
      };
    });

    const updatePromises = rankedDiscussions.map(async (discussion) => {
      const doc = await Discussion.findById(discussion._id);
      if (doc) {
        doc.previousRank = discussion.rank;
        doc.previousRankJump = discussion.rankJump;
        doc.previousRankChange = discussion.rankChange;
        await doc.save();
      }
      return doc;
    });

    await Promise.all(updatePromises);

    return NextResponse.json(
      { discussions: rankedDiscussions.slice(0, 20) },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
