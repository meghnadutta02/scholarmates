import mongoose from "mongoose";
import User from "../model/userModel.js";
import Group from "../model/groupModel.js";
import { io } from "../server.js";
import ActiveUsers from "../activeUser.js";
import Notifications from "../model/notificationModel.js";

export const handleJoinRequestNotification = async (data) => {
  try {
    const { toUsers, fromUser, groupId, createdAt } = data;
    const group = await Group.findById(groupId).select("name");
    const sender = await User.findById(fromUser).select("name profilePic");

    for (let moderatorId of toUsers) {
      // Delete existing notification if it exists
      await Notifications.deleteOne({
        recipientId: moderatorId,
        senderId: fromUser,
        message: `has requested to join "${group.name}"`,
      });

      // Create and save new notification
      const newNotification = new Notifications({
        recipientId: moderatorId,
        senderId: fromUser,
        sendername: sender.name,
        profilePic: sender.profilePic,
        status: "joinRequest",
        groupId: groupId,
        message: `has requested to join "${group.name}"`,
        timestamp: createdAt,
      });

      await newNotification.save();
      console.log(`Saved new notification: ${newNotification._id}`);

      const socketId = ActiveUsers.getUserSocketId(moderatorId.toString());
      if (socketId) {
        io.to(socketId).emit("joinRequestNotification", {
          groupId: groupId.toString(),
          timestamp: createdAt,
          message: `has requested to join "${group.name}"`,
          sendername: sender.name,
          profilePic: sender.profilePic,
          status: "joinRequest",
          notificationId: newNotification._id,
        });

        console.log(`Notified user: ${moderatorId}`);
      }
    }
  } catch (error) {
    console.error("Error handling join request notification:", error);
  }
};
