import { NextResponse } from "next/server";

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

    const id = session?.user?.db_id;

    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      throw new Error("Discussion not found");
    }
    const groupId = discussion.groupId;

    const group = await Group.findById(groupId);
    if (!group) {
      throw new Error("Group not found");
    }

    const moderators = group.moderators;
    const createRequest = await groupRequest.create({
      fromUser: id,
      groupId: groupId,
      toUsers: moderators,
    });
    return NextResponse.json({ result: createRequest }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
