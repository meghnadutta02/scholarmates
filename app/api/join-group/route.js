import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import Discussion from "@/app/(models)/discussionModel";
import Group from "@/app/(models)/groupModel";
import connect from "@/app/config/db";
import groupRequest from "@/app/(models)/groupRequestModel";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";

// to create a request to join a group
export async function GET(req) {
  try {
    await connect();
    const discussionId = req.nextUrl.searchParams.get("discussionId");
    const session = await getServerSession(options);

    const userId = new ObjectId(session?.user?.db_id);
    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      throw new Error("Discussion not found");
    }
    const groupId = discussion.groupId;

    const group = await Group.findById(groupId);
    if (!group) {
      throw new Error("Group not found");
    }

    if (group.isPublic) {
      group.participants.push(userId);
      await group.save();

      return NextResponse.json(
        { result: "User added to group" },
        { status: 201 }
      );
    } else {
      const moderators = group.moderators;
      const createRequest = await groupRequest.create({
        fromUser: userId,
        groupId: groupId,
        toUsers: moderators,
      });
      return NextResponse.json({ result: createRequest }, { status: 200 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
