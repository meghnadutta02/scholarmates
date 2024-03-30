import { NextResponse } from "next/server";

import Discussion from "@/app/(models)/discussionModel";
import Group from "@/app/(models)/groupModel";
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
        .find({ toUsers: userId })
        .populate("groupId", "name description")) || [];
    const requestsToJoin =
      (await groupRequest
        .find({ fromUser: userId })
        .populate("groupId", "name description")) || [];
    return NextResponse.json(
      { requestsToAccept, requestsToJoin },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
