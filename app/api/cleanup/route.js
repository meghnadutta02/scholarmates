import mongoose from "mongoose";
import Group from "@/app/(models)/groupModel";
import GroupRequest from "@/app/(models)/groupRequestModel";
import Message from "@/app/(models)/messageModel";
import Discussion from "@/app/(models)/discussionModel";
import Notification from "@/app/(models)/notificationModel";
import User from "@/app/(models)/userModel";
import connect from "@/app/config/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { options } from "@/app/api/auth/[...nextauth]/options";

async function cleanupOrphanedDocuments(session) {
  const transactionSession = await mongoose.startSession();
  transactionSession.startTransaction();

  try {
    // Cleanup orphaned Groups
    const allGroups = await Group.find();
    const orphanedGroups = [];
    const orphanedNotifications = [];
    const allDiscussionNotifications = await Notification.find();

    for (const notification of allDiscussionNotifications) {
      if (!notification.discussionId) {
        continue;
      }
      const discussion = await Discussion.findOne({
        _id: notification.discussionId,
      }).session(transactionSession);
      if (!discussion) {
        orphanedNotifications.push(notification._id);
      }
    }
    for (const group of allGroups) {
      const discussion = await Discussion.findOne({
        groupId: group._id,
      }).session(transactionSession);
      if (!discussion) {
        orphanedGroups.push(group._id);
      }
    }
    if (orphanedNotifications.length > 0) {
      await Notification.deleteMany(
        { _id: { $in: orphanedNotifications } },
        { session: transactionSession }
      );
    }
    if (orphanedGroups.length > 0) {
      await Group.deleteMany(
        { _id: { $in: orphanedGroups } },
        { session: transactionSession }
      );
    }

    // Cleanup orphaned GroupRequests
    const orphanedGroupRequests = await GroupRequest.find().populate("groupId");
    const orphanedGroupRequestsToDelete = orphanedGroupRequests.filter(
      (req) =>
        !req.groupId._id ||
        req.status === "accepted" ||
        req.status === "rejected"
    );
    if (orphanedGroupRequestsToDelete.length > 0) {
      const ids = orphanedGroupRequestsToDelete.map((req) => req._id);
      await GroupRequest.deleteMany(
        { _id: { $in: ids } },
        { session: transactionSession }
      );
    }

    // Cleanup orphaned Messages
    const orphanedMessages = await Message.find().populate("conversationId");
    const orphanedMessagesToDelete = orphanedMessages.filter(
      (msg) => !msg.conversationId
    );
    if (orphanedMessagesToDelete.length > 0) {
      const ids = orphanedMessagesToDelete.map((msg) => msg._id);
      await Message.deleteMany(
        { _id: { $in: ids } },
        { session: transactionSession }
      );
    }

    // Cleanup orphaned group references from User documents
    if (orphanedGroups.length > 0) {
      const users = await User.find({ groupsJoined: { $in: orphanedGroups } });
      for (const user of users) {
        user.groupsJoined = user.groupsJoined.filter(
          (groupId) => !orphanedGroups.includes(groupId)
        );
        await user.save({ session: transactionSession });
      }
    }

    // Commit the transaction
    await transactionSession.commitTransaction();
    transactionSession.endSession();

    console.log("Orphaned documents cleanup completed.");
  } catch (error) {
    await transactionSession.abortTransaction();
    transactionSession.endSession();
    throw error;
  }
}

export async function GET(req) {
  try {
    await connect();
    const session = await getServerSession(options);

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await cleanupOrphanedDocuments(session);

    return NextResponse.json(
      { result: "Orphaned documents cleanup completed" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in cleaning up orphaned documents:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    mongoose.connection.close();
  }
}
