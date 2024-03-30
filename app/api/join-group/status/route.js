import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import Discussion from "@/app/(models)/discussionModel";
import Group from "@/app/(models)/groupModel";
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
    const groups1 = await groupRequest
      .find({
        toUsers: session?.user?.db_id,
      })
      .select("groupId -_id");
    const accepted = groups
      .filter((group) => group.status === "accepted")
      .map((group) => group.groupId);
    const pending = groups
      .filter((group) => group.status === "pending")
      .map((group) => group.groupId);
    const rejected = groups
      .filter((group) => group.status === "rejected")
      .map((group) => group.groupId);
    groups1.map((group) => accepted.push(group.groupId));
    return NextResponse.json({ accepted, pending, rejected }, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
