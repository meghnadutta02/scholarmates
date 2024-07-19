import DiscussionNotification from "../model/discussionNotification.js";
import User from "../model/userModel.js";
import { io } from "../server.js";
import ActiveUsers from "../activeUser.js";
import Notifications from "../model/notificationModel.js";

export const discussionNotification = async (user, socket) => {
  try {
    const notifiedUsers = new Set();
    
    console.log(`Fetching notifications for user: ${user._id}`);
    const notifications = await DiscussionNotification.find({
      connection: user._id,
      status: true,
    });

    for (const notification of notifications) {
      console.log(`Processing notification: ${notification._id}`);

      // Find the creator of the notification
      const creator = await User.findById(notification.creator);
      if (!creator) {
        console.error(`Creator not found for notification: ${notification._id}`);
        continue;
      }

      // Check if the notification already exists
      const existingNotification = await Notifications.findOne({
        recipientId: user._id,
        senderId: creator._id,
        discussionId: notification.discussionId,
        message: notification.content,
      });

      const newNotification = new Notifications({
        recipientId: user._id,
        senderId: creator._id,
        sendername: creator.name,
        profilePic: creator.profilePic,
        status: "discussNotify",
        discussionId: notification.discussionId,
        message: notification.content,
        timestamp: notification.createdAt,
      });

      if (!existingNotification) {
       

        await newNotification.save();
        console.log(`Saved new notification: ${newNotification._id}`);
      } else {
        console.log(`Notification already exists: ${existingNotification._id}`);
      }

      // Notify the user if they are active
      if (ActiveUsers.getActiveUsers().has(user._id.toString())) {
        const socketId = ActiveUsers.getUserSocketId(user._id.toString());
        console.log("socketid",socketId);
        io.to(socketId).emit("discussionNotification", {
          discussionId: notification.discussionId.toString(),
          timestamp: notification.createdAt,
          message: notification.content,
          creatorId: notification.creator,
          sendername: creator.name,
          profilePic: creator.profilePic,
          status: "discussNotify",
          notificationId: newNotification._id,
        });

        console.log(`Notified user: ${user._id}`);

        // Remove the user from the connection array
        notifiedUsers.add(user._id.toString());
        notification.connection.pull(user._id);

        if (notification.connection.length === 0) {
          notification.status = false;
          await notification.deleteOne();
          console.log(`Deleted notification: ${notification._id}`);
        } else {
          await notification.save();
          console.log(`Updated notification: ${notification._id}`);
        }
      }
    }
  } catch (error) {
    console.error("Error in discussionNotification:", error);
  }
};
