import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

import Group from "@/app/(models)/groupModel";
import User from "@/app/(models)/userModel";
import connect from "@/app/config/db";
import groupRequest from "@/app/(models)/groupRequestModel";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";

// to create a request to join a group
export async function GET(req) {
  try {
    await connect();
    const groupId = req.nextUrl.searchParams.get("groupId");
    const session = await getServerSession(options);

    const userId = new ObjectId(session?.user?.db_id);
    const user = await User.findById(userId);

    const group = await Group.findById(groupId);
    if (!group) {
      throw new Error("Group not found");
    }

    if (group.isPublic && !group.participants.includes(userId)) {
      console.log("Public group");
      group.participants.push(userId);
      user.groupsJoined.push(groupId);
      await group.save();
      await user.save();
      console.log("User added to group");
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
      console.log("Request created");
      return NextResponse.json({ result: createRequest }, { status: 200 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
