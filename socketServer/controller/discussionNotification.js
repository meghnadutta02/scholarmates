import DiscussionNotification from "../model/discussionNotification.js";
import User from "../model/userModel.js";
import { io } from "../server.js";
import ActiveUsers from "../activeUser.js"

export const discussionNotification = async (user, socket) => {
  
        
  try {
    const notifiedUsers = new Set();
    // Find notifications for the user
    const notifications = await DiscussionNotification.find({
      connection: user._id,
      status: true
    });

    for (const notification of notifications) {
      // Notify the user
      const creator=await User.findById(notification.creator);
      if (ActiveUsers.getActiveUsers().has(user._id.toString())) {
        const socketId =ActiveUsers.getUserSocketId(user._id.toString());
        io.to(socketId).emit("dicussionNotification", {
            discussionId:notification.discussionId.toString(),
            timestamp: notification.createdAt,
            message:notification.content,
            creatorId:notification.creator,
            sendername:creator.name,
            profilePic:creator.profilePic,
            status:"discussNotify"
        });

        // Remove the user from the connection array
        
        notifiedUsers.add(user._id.toString());
       notification.connection.pull(user._id);

        // If all users have been notified, set status to false and delete the notification
        if (notification.connection.length === 0) {
          notification.status = false;
          await notification.deleteOne();
        } else {
          await notification.save();
        }
      }
    }
  } catch (error) {
    console.error("Error in discussionNotification:", error);
  }
};