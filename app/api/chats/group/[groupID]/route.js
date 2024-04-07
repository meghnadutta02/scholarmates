import connect from "@/app/config/db";
import User from "@/app/(models)/userModel";
import { NextResponse } from "next/server";
import Message from "@/app/(models)/messageModel";
import Discussion from "@/app/(models)/discussionModel";
import { ObjectId } from "mongodb";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

//Get all the messages of a group
export async function GET(req, { params }) {
  try {
    await connect();

    const groupID = params.groupID;

    const messages = await Message.find({ conversationId: groupID });
    const messagesWithSenderName = await Promise.all(
      messages.map(async (message) => {
        const sender = await User.findById(message.sender);
        const messageObj = message.toObject();
        messageObj.senderName = sender.name;
        return messageObj;
      })
    );
    const groupDetails = await Discussion.find({ groupId: groupID });
    return NextResponse.json(
      { messagesWithSenderName, groupDetails },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

//send a message to a group
export async function POST(req, { params }) {
  try {
    await connect();

    const groupID = params.groupID;
    const session = await getServerSession(options);
    const payload = await req.json();
    console.log(payload);

    const newMessage = await Message.create({
      conversationId: new ObjectId(groupID),
      sender: new ObjectId(session?.user?.db_id),
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
