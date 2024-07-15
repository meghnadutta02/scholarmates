import connect from "@/app/config/db";
import { NextResponse } from "next/server";
import UserMessage from "@/app/(models)/userMessageModel";
import { ObjectId } from "mongodb";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

// GET the inbox details for a user with recent and unread messages
export async function GET() {
  try {
    await connect();
    const session = await getServerSession(options);
    const currentUserId = new ObjectId(session.user.db_id);

    const messages = await UserMessage.aggregate([
      {
        $match: {
          $or: [{ recipient: currentUserId }, { sender: currentUserId }],
        },
      },
      {
        $addFields: {
          contactId: {
            $cond: {
              if: { $eq: ["$sender", currentUserId] },
              then: "$recipient",
              else: "$sender",
            },
          },
        },
      },
      {
        $group: {
          _id: "$contactId",
          unreadMessages: {
            $push: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$recipient", currentUserId] },
                    { $ne: ["$status", "read"] },
                  ],
                },
                "$$ROOT",
                null,
              ],
            },
          },
          lastMessageId: { $last: "$_id" },
          lastMessageTime: { $max: "$createdAt" },
        },
      },
      {
        $addFields: {
          unreadMessages: {
            $filter: {
              input: "$unreadMessages",
              as: "message",
              cond: { $ne: ["$$message", null] },
            },
          },
        },
      },
      {
        $lookup: {
          from: "usermessages",
          localField: "lastMessageId",
          foreignField: "_id",
          as: "lastMessageInfo",
        },
      },
      {
        $unwind: "$lastMessageInfo",
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "contactInfo",
        },
      },
      {
        $unwind: "$contactInfo",
      },
      {
        $project: {
          userId: "$contactInfo._id",
          userName: "$contactInfo.name",
          profilePic: "$contactInfo.profilePic",
          unreadMessagesCount: { $size: "$unreadMessages" },
          unreadMessages: 1,
          lastMessageText: "$lastMessageInfo.text",
          lastMessageTime: 1,
        },
      },
      {
        $sort: { lastMessageTime: -1 },
      },
    ]);

    const result = messages.map((message) => ({
      userId: message.userId,
      userName: message.userName,
      profilePic: message.profilePic,
      unreadMessagesCount: message.unreadMessagesCount,
      unreadMessages: message.unreadMessages,
      lastMessageText: message.lastMessageText,
      lastMessageTime: message.lastMessageTime,
    }));

    return NextResponse.json({ messages: result }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
