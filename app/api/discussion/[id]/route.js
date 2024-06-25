import Discussion from "@/app/(models)/discussionModel";
import connect from "@/app/config/db";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import User from "@/app/(models)/userModel";
import groupRequest from "@/app/(models)/groupRequestModel";

export async function GET(req, { params }) {
  await connect();
  const id = params.id;
  const session = await getServerSession(options);

  try {
    const discussion = await Discussion.findById(id).populate(
      "creator",
      "name profilePic _id"
    );

    if (!discussion) {
      return NextResponse.json(
        { result: "Discussion not found." },
        { status: 500 }
      );
    }
    const userId = new ObjectId(session?.user?.db_id);
    let status = "";
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ result: "User not found." }, { status: 404 });
    }

    if (user.groupsJoined.includes(discussion.groupId)) {
      status = "accepted";
    } else {
      const groupRequests = await groupRequest.find({
        fromUser: userId,
        groupId: discussion.groupId,
      });
      if (groupRequests.length > 0) {
        status = groupRequests[0].status;
      }
    }
    const isLikedByUser = discussion.likedBy.includes(userId);
    const isDislikedByUser = discussion.dislikedBy.includes(userId);
    return NextResponse.json(
      { discussion, isLikedByUser, status, isDislikedByUser },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
