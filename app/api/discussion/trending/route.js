import { NextResponse } from "next/server";
import Discussion from "@/app/(models)/discussionModel";
import connect from "@/app/config/db";

const calculateTrendScore = (discussion) => {
  const likesWeight = 1.5;
  const dislikesWeight = -0.7;
  const timeWeight = 1.2;
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
    const discussions = await Discussion.find({ isActive: true }).populate(
      "groupId creator",
      "participants name profilePic _id"
    );

    const discussionsWithScores = discussions.map((discussion) => ({
      ...discussion.toObject(),
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
      { discussions: rankedDiscussions.slice(0, 10) },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
