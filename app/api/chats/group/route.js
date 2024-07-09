import connect from "@/app/config/db";
import User from "@/app/(models)/userModel";
import Group from "@/app/(models)/groupModel";
import Message from "@/app/(models)/messageModel";
import ReadStatus from "@/app/(models)/readStatusModel"; // Import the ReadStatus model
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";
import { NextResponse } from "next/server";

export async function GET(req, res) {
  try {
    await connect();

    const session = await getServerSession(options);
    const userId = session?.user?.db_id;

    // Fetch the user's groups
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Finding existing group IDs
    const existingGroups = await Group.find({
      _id: { $in: user.groupsJoined },
    }).select("_id name");

    const existingGroupIds = existingGroups.map((group) =>
      group._id.toString()
    );

    const updatedGroupsJoined = user.groupsJoined.filter((id) =>
      existingGroupIds.includes(id.toString())
    );

    if (updatedGroupsJoined.length !== user.groupsJoined.length) {
      user.groupsJoined = updatedGroupsJoined;
      await user.save();
    }

    // Fetch the ReadStatus for the user
    const readStatus = await ReadStatus.findOne({ userId });

    // Fetch the latest message for each group and calculate unread messages
    const groupsWithMessages = await Promise.all(
      user.groupsJoined.map(async (groupId) => {
        const latestMessage = await Message.findOne({
          conversationId: groupId,
        })
          .sort({ createdAt: -1 })
          .limit(1)
          .populate("sender", "name");

        const groupReadStatus = readStatus?.groups.find(
          (status) => status.groupId.toString() === groupId.toString()
        );

        const lastReadAt = groupReadStatus
          ? groupReadStatus.lastReadAt
          : new Date(0);

        const unreadCount = await Message.countDocuments({
          conversationId: groupId,
          createdAt: { $gt: lastReadAt },
        });

        const group = await Group.findById(groupId).select("name");

        return {
          groupId,
          groupName: group.name,
          latestMessage,
          unreadCount,
        };
      })
    );

    // Sort groups based on the timestamp of the latest message
    groupsWithMessages.sort((a, b) => {
      if (!a.latestMessage) return 1;
      if (!b.latestMessage) return -1;
      return b.latestMessage.createdAt - a.latestMessage.createdAt;
    });

    const sortedGroups = groupsWithMessages.map((item) => ({
      groupId: item.groupId,
      groupName: item.groupName,
      unreadCount: item.unreadCount,
      latestMessage: {
        text: item.latestMessage?.text || "",
        senderName: item.latestMessage?.sender?.name || "",
        time: item.latestMessage?.createdAt || "",
      },
    }));

    return NextResponse.json({ groups: sortedGroups }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
