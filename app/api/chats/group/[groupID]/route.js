import connect from "@/app/config/db";
import User from "@/app/(models)/userModel";
import { NextResponse } from "next/server";
import Message from "@/app/(models)/messageModel";
import ReadStatus from "@/app/(models)/readStatusModel";
import { ObjectId } from "mongodb";
import Group from "@/app/(models)/groupModel";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { v4 as uuidv4 } from "uuid";
import { postObject } from "@/app/config/s3";

//Get all the messages of a group
export async function GET(req, { params }) {
  try {
    await connect();

    const groupID = params.groupID;
    const session = await getServerSession(options);
    const skip = parseInt(req.nextUrl.searchParams.get("skip")) || 0;
    const limit = parseInt(req.nextUrl.searchParams.get("limit")) || 10;

    const messages = await Message.find({ conversationId: groupID })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const messagesWithSenderName = await Promise.all(
      messages.map(async (message) => {
        const sender = await User.findById(message.sender);
        const messageObj = message.toObject();
        messageObj.senderName = sender.name;
        return messageObj;
      })
    );
    const group = await Group.findById(groupID)
      .populate("moderators", "_id")
      .populate("participants", "_id name profilePic");
    const userId = session?.user?.db_id;

    const groupDetails = {
      _id: group._id,
      name: group.name,
      description: group.description,
      isPublic: group.isPublic,
      createdAt: group.createdAt,
      creator: group.moderators[0]._id,
      participants: group.participants,
      moderators: group.moderators.map((mod) => mod._id),
      discussionId: group.discussionId,
      currentUser: userId,
    };

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
    const data = await req.formData();
    const formDataArray = Array.from(data.values());
    const senderName = data.get("senderName");
    const text = data.get("text");
    const files = formDataArray.filter((value) => value instanceof File);
    const attachments = [];

    for (const file of files) {
      const byteData = await file.arrayBuffer();
      const buffer = Buffer.from(byteData);
      const path = `public/media/group-chat/${uuidv4()}-${file.name}`;
      const attachmentURL = await postObject(path, buffer);

      attachments.push(attachmentURL);
    }
    const newMessage = await Message.create({
      conversationId: new ObjectId(groupID),
      sender: new ObjectId(session?.user?.db_id),
      senderName: senderName,
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

// Update the read status for a user for a specific group
export async function PUT(req, { params }) {
  try {
    await connect();

    const session = await getServerSession(options);
    const userId = session?.user?.db_id;
    const groupId = params.groupID;

    // Find the existing read status
    let readStatus = await ReadStatus.findOne({ userId });

    if (readStatus) {
      const groupStatusIndex = readStatus.groups.findIndex(
        (status) => status.groupId.toString() === groupId.toString()
      );

      if (groupStatusIndex > -1) {
        readStatus.groups[groupStatusIndex].lastReadAt = new Date();
      } else {
        // Add a new group read status entry
        readStatus.groups.push({ groupId, lastReadAt: new Date() });
      }
    } else {
      // Create a new read status entry
      readStatus = new ReadStatus({
        userId,
        groups: [{ groupId, lastReadAt: new Date() }],
      });
    }

    await readStatus.save();

    return NextResponse.json(
      { message: "Read status updated" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
