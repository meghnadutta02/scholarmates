import { NextResponse } from "next/server";

import connect from "@/app/config/db";
import groupRequest from "@/app/(models)/groupRequestModel";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";

// to get all the requests to join a group and requests to accept a user to a group for a user
export async function GET(req) {
  try {
    await connect();
    const session = await getServerSession(options);
    const userId = session?.user?.db_id;

    const requestsToAccept =
      (await groupRequest
        .find({ toUsers: userId, status: "pending" })
        .sort({ createdAt: -1 })
        .populate("groupId", "name description")
        .populate("fromUser", "name profilePic")) || [];
    return NextResponse.json({ requestsToAccept }, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
