import Group from "../model/groupModel.js";
import { io } from "../server.js";
import ActiveUsers from "../activeUser.js";
import Notification from "../model/notificationModel.js";

export const handleJoinRequestNotification = async (data) => {
  try {
    const { request, user } = data;
    const { toUsers, fromUser, groupId, createdAt } = request;
    const group = await Group.findById(groupId).select("name");
    const { name, profilePic } = user;

    for (let moderatorId of toUsers) {
      // Delete existing notification if it exists
      await Notification.deleteOne({
        recipientId: moderatorId,
        senderId: fromUser,
        status: "joinRequest",
        groupId,
      });

      // Create and save new notification
      const newNotification = new Notification({
        recipientId: moderatorId,
        senderId: fromUser,
        sendername: name,
        profilePic: profilePic,
        status: "joinRequest",
        message: `has requested to join "${group.name}"`,
        timestamp: createdAt,
        groupId,
      });

      await newNotification.save();

      const socketId = ActiveUsers.getUserSocketId(moderatorId.toString());
      if (socketId) {
        io.to(socketId).emit("joinRequestNotification", {
          timestamp: createdAt,
          message: `has requested to join "${group.name}"`,
          sendername: name,
          profilePic: profilePic,
          status: "joinRequest",
          notificationId: newNotification._id,
        });

        console.log(
          `Notified user: ${moderatorId} about join request for group: ${group.name}`
        );
      }
    }
  } catch (error) {
    console.error("Error handling join request notification:", error);
  }
};
