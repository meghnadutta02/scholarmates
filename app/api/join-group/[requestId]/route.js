import { NextResponse } from "next/server";
import connect from "@/app/config/db";
import groupRequest from "@/app/(models)/groupRequestModel";
import User from "@/app/(models)/userModel";
import Notification from "@/app/(models)/notificationModel";
import Group from "@/app/(models)/groupModel";
import { getServerSession } from "next-auth/next";
import { ObjectId } from "mongodb";
import { options } from "@/app/api/auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function PUT(req, { params }) {
  let session;

  try {
    await connect();
    session = await mongoose.startSession();
    session.startTransaction();

    const requestId = params.requestId;
    const action = req.nextUrl.searchParams.get("action");
    const serverSession = await getServerSession(options);

    const request = await groupRequest.findById(requestId).session(session);
    if (!request) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }
    if (request.status !== "pending") {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json(
        { error: "Request is already processed" },
        { status: 400 }
      );
    }
    if (!request.toUsers.includes(new ObjectId(serverSession?.user?.db_id))) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json(
        { error: "You are not authorized to perform this action" },
        { status: 403 }
      );
    }

    const userId = request.fromUser;
    const user = await User.findById(userId).session(session);
    const groupId = request.groupId;
    const group = await Group.findById(groupId).session(session);
    if (!group) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    if (action === "accept") {
      if (!group.participants.includes(userId)) {
        group.participants.push(userId);
      }
      if (!user.groupsJoined.includes(groupId)) {
        user.groupsJoined.push(groupId);
      }
    }

    // Find the notifications to be deleted
    const notificationsToDelete = await Notification.find({
      senderId: request.fromUser,
      status: "joinRequest",
      groupId: groupId,
    })
      .select("_id")
      .session(session);

    // Extract the IDs of the notifications to be deleted
    const deletedNotificationIds = notificationsToDelete.map(
      (notification) => notification._id
    );

    // Delete the notifications
    await Notification.deleteMany({
      _id: { $in: deletedNotificationIds },
    }).session(session);

    await group.save({ session });
    await user.save({ session });

    // Delete the request from the database if it is accepted or rejected
    await groupRequest
      .deleteMany({
        fromUser: userId,
        groupId: groupId,
      })
      .session(session);

    await session.commitTransaction();
    session.endSession();

    return NextResponse.json(
      { result: request, ids: deletedNotificationIds },
      { status: 200 }
    );
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
