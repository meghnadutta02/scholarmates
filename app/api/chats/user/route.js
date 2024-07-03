import connect from "@/app/config/db";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import UserMessage from "@/app/(models)/userMessageModel";
import { ObjectId } from "mongodb";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

//GET unread messages for a user
export async function GET() {
  try {
    await connect();
    const session = await getServerSession(options);
    const currentUserId = session.user.db_id;
    console.log(currentUserId);

    const unreadMessages = await UserMessage.aggregate([
      {
        $match: {
          recipient: new ObjectId(currentUserId),
          status: { $ne: "read" },
        },
      },
      {
        $group: {
          _id: "$sender",
          unreadMessages: { $push: "$$ROOT" },
        },
      },
    ]);

    return NextResponse.json({ unreadMessages }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
