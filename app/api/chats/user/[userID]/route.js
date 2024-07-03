import connect from "@/app/config/db";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import UserMessage from "@/app/(models)/userMessageModel";
import { ObjectId } from "mongodb";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { postObject } from "@/app/config/s3";

//GET all the messages with a specific user
export async function GET(req, { params }) {
  try {
    await connect();
    const session = await getServerSession(options);
    const currentUserID = session.user.db_id;
    const recipientID = params.userID;
    const messages = await UserMessage.find({
      $or: [
        { sender: currentUserID, recipient: recipientID },
        { sender: recipientID, recipient: currentUserID },
      ],
    });

    await UserMessage.updateMany(
      {
        sender: recipientID,
        recipient: currentUserID,
        status: "delivered",
      },
      { $set: { status: "read" } }
    );

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
    const data = await req.formData();
    const formDataArray = Array.from(data.values());
    const text = formDataArray[0];
    const files = formDataArray.filter((value) => value instanceof File);
    const attachments = [];

    for (const file of files) {
      const byteData = await file.arrayBuffer();
      const buffer = Buffer.from(byteData);
      const path = `public/media/user-chat/${uuidv4()}-${file.name}`;
      const attachmentURL = await postObject(path, buffer);

      attachments.push(attachmentURL);
    }
    const newMessage = await UserMessage.create({
      sender: new ObjectId(session?.user?.db_id),
      recipient: new ObjectId(receiverID),
      text: text,
      status: "delivered",
      attachments: attachments,
    });

    await newMessage.save();

    return NextResponse.json({ result: newMessage }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
