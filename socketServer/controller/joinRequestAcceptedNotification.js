import Group from "../model/groupModel.js";
import { io } from "../server.js";
import ActiveUsers from "../activeUser.js";
import Notification from "../model/notificationModel.js";

export const handleJoinRequestAcceptedNotification = async (data) => {
  try {
    const { request, user } = data;
    const { fromUser, groupId } = request;
    const { name, profilePic, db_id } = user;
    const group = await Group.findById(groupId).select("name");
    console.log("Here accepted");

    // Delete existing notification if it exists
    await Notification.deleteOne({
      groupId,
      recipientId: fromUser,
      status: "joinRequestAccepted",
    });

    // Create and save new notification
    const newNotification = new Notification({
      recipientId: fromUser,
      senderId: db_id,
      sendername: name,
      profilePic: profilePic,
      status: "joinRequestAccepted",
      message: `has accepted your request to join "${group.name}"`,
      timestamp: new Date(),
      groupId,
    });

    await newNotification.save();

    const socketId = ActiveUsers.getUserSocketId(fromUser.toString());
    if (socketId) {
      io.to(socketId).emit("joinRequestAcceptedNotification", {
        timestamp: new Date(),
        message: `has accepted your request to join "${group.name}"`,
        sendername: name,
        profilePic: profilePic,
        status: "joinRequestAccepted",
        recipientId: fromUser,
        senderId: db_id,
        notificationId: newNotification._id,
      });

      console.log(`Notified user: ${fromUser}`);
    }
  } catch (error) {
    console.error("Error handling join request accepted notification:", error);
  }
};
