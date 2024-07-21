import { NextResponse } from "next/server";
import connect from "@/app/config/db";
import groupRequest from "@/app/(models)/groupRequestModel";
import User from "@/app/(models)/userModel";
import Group from "@/app/(models)/groupModel";
import { getServerSession } from "next-auth/next";
import { ObjectId } from "mongodb";
import { options } from "@/app/api/auth/[...nextauth]/options";

export async function PUT(req, { params }) {
  try {
    await connect();
    const requestId = params.requestId;
    const action = req.nextUrl.searchParams.get("action");
    const session = await getServerSession(options);

    const request = await groupRequest.findById(requestId);
    if (!request) {
      throw new Error("Request not found");
    }
    if (request.status !== "pending") {
      throw new Error("Request is already processed");
    }
    if (!request.toUsers.includes(new ObjectId(session?.user?.db_id))) {
      throw new Error("You are not authorized to perform this action");
    }

    const userId = request.fromUser;
    const user = await User.findById(userId);
    const groupId = request.groupId;
    const group = await Group.findById(groupId);
    if (!group) {
      throw new Error("Group not found");
    }

    if (action === "accept") {
      group.participants.push(userId);
      user.groupsJoined.push(groupId);
      request.status = "accepted";
    } else {
      request.status = "rejected";
    }

    await group.save();
    await user.save();

    const savedRequest = await request.save();

    // Delete the request from the database
    await request.deleteOne();

    return NextResponse.json({ result: savedRequest }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
