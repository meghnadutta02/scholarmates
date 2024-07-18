import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import User from "@/app/(models)/userModel";

import connect from "@/app/config/db";
import groupRequest from "@/app/(models)/groupRequestModel";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";

// to get the status of all the group requests for a user
export async function GET(req) {
  try {
    await connect();
    const session = await getServerSession(options);
    const groups = await groupRequest.find({
      fromUser: session?.user?.db_id,
    });
    const user = await User.findById(session?.user?.db_id);
    let accepted = [];
    const pending = groups
      .filter((group) => group.status === "pending")
      .map((group) => group.groupId);
    user.groupsJoined.map((group) => accepted.push(group._id));
    return NextResponse.json({ accepted, pending }, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
