import connect from "@/app/config/db";
import User from "@/app/(models)/userModel";
import { NextResponse } from "next/server";
import UserMessage from "@/app/(models)/userMessageModel";
import { ObjectId } from "mongodb";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

//GET all the messages with a specific user
export async function GET(req, { params }) {
  try {
    await connect();
    const session = await getServerSession(options);
    const senderID = session.user.db_id;
    const recipientID = params.userID;
    const messages = await UserMessage.find({
      $or: [
        { sender: senderID, recipient: recipientID },
        { sender: recipientID, recipient: senderID },
      ],
    });
    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

//send a message to a user
export async function POST(req, { params }) {
  try {
    await connect();

    const receiverID = params.userID;
    const session = await getServerSession(options);
    const payload = await req.json();
    console.log(payload);

    const newMessage = await UserMessage.create({
      sender: new ObjectId(session?.user?.db_id),
      recipient: new ObjectId(receiverID),
      text: payload.message.text,
      status: "delivered",
      attachments: payload.message.attachments,
    });

    await newMessage.save();

    return NextResponse.json({ result: newMessage }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
