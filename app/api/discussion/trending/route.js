// api/discussions/trending.js
import { NextResponse } from "next/server";
import Discussion from "@/app/(models)/discussionModel";
import connect from "@/app/config/db";

const calculateTrendScore = (discussion) => {
  const likesWeight = 1.5;
  const timeWeight = 1.2;

  const groupMemberWeight = 0.8;

  const now = Date.now();
  const timeSinceCreation = now - new Date(discussion.createdAt).getTime();

  const score =
    discussion.likes * likesWeight +
    Math.log(timeSinceCreation / (1000 * 3600 * 24)) * timeWeight + // logarithmic decay for time
    discussion.groupId
      ? discussion.groupId.participants.length * groupMemberWeight
      : 0;

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

    discussionsWithScores
      .sort((a, b) => b.trendScore - a.trendScore)
      .slice(0, 10);

    return NextResponse.json(
      { discussions: discussionsWithScores },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
