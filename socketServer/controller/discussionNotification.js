import Notification from "../model/notificationModel.js";
import ActiveUsers from "../activeUser.js";
import { io } from "../server.js";

export const handleDiscussionNotification = async (data) => {
  try {
    const { discussion, user } = data;
    const { db_id, name, profilePic, connection: connections } = user;
    const { _id: discussionId, title, createdAt } = discussion;
    if (connections.length === 0) return;

    for (let connectionId of connections) {
      // Create and save new notification
      const newNotification = new Notification({
        recipientId: connectionId,
        senderId: db_id,
        sendername: name,
        profilePic: profilePic,
        status: "discussNotify",
        message: `has started a new discussion "${
          title.length > 15 ? title.substring(0, 15) + ".." : title
        }"`,
        timestamp: createdAt,
        discussionId: discussionId,
      });

      await newNotification.save();

      const socketId = ActiveUsers.getUserSocketId(connectionId.toString());
      if (socketId) {
        io.to(socketId).emit("discussionNotification", {
          timestamp: createdAt,
          message: `has started a new discussion "${
            title.length > 15 ? title.substring(0, 15) + ".." : title
          }"`,
          sendername: name,
          profilePic: profilePic,
          status: "discussNotify",
          discussionId: discussionId,
          notificationId: newNotification._id,
          recipientId: connectionId,
          senderId: db_id,
        });

        console.log(`Notified user: ${connectionId}`);
      }
    }
  } catch (error) {
    console.error("Error handling discussion notification:", error);
  }
};

export const handleDeletedDiscussionNotification = async (data) => {
  try {
    const { discussionId, groupId } = data;

    const notifications = await Notification.find({
      $or: [{ discussionId }, { groupId }],
    });

    const notificationIds = notifications.map(
      (notification) => notification._id
    );

    for (let notification of notifications) {
      const socketId = ActiveUsers.getUserSocketId(
        notification.recipientId.toString()
      );

      if (socketId) {
        io.to(socketId).emit("deletedDiscussionNotification", {
          notificationId: notification._id,
        });
      }
    }

    await Notification.deleteMany({ _id: { $in: notificationIds } });
  } catch (error) {
    console.error("Error handling deleted discussion notification:", error);
  }
};
