import Request from "../model/requestModel.js";
import User from "../model/userModel.js";
import { io } from "../server.js";
import Notification from "../model/notificationModel.js";
import ActiveUsers from "../activeUser.js";
export const requestNotificationController = async (req, resp) => {
  try {
    const user = req.params.userId;

    if (user) {
      // Find requests directed to the user
      const data = await Request.find({ requestTo: user });

      if (data && data.length > 0) {
        // Extract unique user ids from the requests
        const userIds = [...new Set(data.map((item) => item.user))];

        // Find user data for the extracted ids
        const userData = await User.find({ _id: { $in: userIds } });

        // Construct an object to map user ids to user data for easy access
        const userDataMap = userData.reduce((acc, user) => {
          acc[user._id] = user;
          return acc;
        }, {});

        // Combine request data with user data
        const requestData = data.map((item) => ({
          requestData: item,
          userData: userDataMap[item.user],
        }));

        resp.status(200).send({
          success: true,
          message: "Data retrieved successfully",
          data: requestData,
        });
      } else {
        resp.status(204).send({
          success: false,
          message: "No data found for the user",
        });
      }
    } else {
      resp.status(400).send({
        success: false,
        message: "Invalid user ID",
      });
    }
  } catch (error) {
    resp.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

export const userRequestsController = async (req, res) => {
  try {
    const { userId, recipientId } = req.params;

    if (!userId || !recipientId) {
      return res.status(400).send({
        success: false,
        message: "Invalid user ID or recipient ID",
      });
    }

    // Find requests made by the user to the recipient
    const requests = await Request.find({
      user: recipientId,
      requestTo: userId,
    }).populate("requestTo", "_id name profilePic");

    if (!requests.length) {
      return res.status(204).send({
        success: false,
        message: "No requests found for the user to the recipient",
      });
    }

    res.status(200).send({
      success: true,
      message: "Requests retrieved successfully",
      data: requests,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

export const checkIsSeenController = async (req, resp) => {
  try {
    const { userId } = req.params;
    const { notificationIds } = req.body;

    if (!notificationIds || !Array.isArray(notificationIds)) {
      return resp.status(400).send({
        success: false,
        message: "Invalid notification IDs",
      });
    }
    // Update isSeen to true for the given notification IDs

    const updateResult = await Notification.updateMany(
      {
        _id: { $in: notificationIds },
        recipientId: userId,
      },
      { $set: { isSeen: true } }
    );

    // Check if any documents were modified
    if (updateResult.modifiedCount >= 0) {
      resp.status(200).send({
        success: true,
        message: "Notifications marked as seen",
      });
    } else {
      resp.status(204).send({
        success: false,
        message: "No notifications found to update",
      });
    }
  } catch (error) {
    resp.status(500).send({
      success: false,
      message: error.message,
    });
  }
};
export const deleteBatchNotification = async (req, resp) => {
  try {
    const { userId } = req.params;

    const { notificationIds } = req.body;

    if (!notificationIds || !Array.isArray(notificationIds)) {
      return resp.status(400).send({
        success: false,
        message: "Invalid notification IDs",
      });
    }

    // Delete notifications with the given IDs
    const deleteResult = await Notification.deleteMany({
      _id: { $in: notificationIds },
      recipientId: userId,
    });

    // Check if any documents were deleted
    if (deleteResult.deletedCount > 0) {
      resp.status(200).send({
        success: true,
        message: "Notifications deleted successfully",
      });
    } else {
      resp.status(204).send({
        success: false,
        message: "No notifications found to delete",
      });
    }
  } catch (error) {
    resp.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

export const getAllNotificationController = async (req, resp) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({
      recipientId: userId,
    }).sort({ timestamp: -1 });

    resp.status(200).send({
      success: true,
      notifications,
    });
  } catch (error) {
    resp.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

export const DeleteNotificationController = async (req, resp) => {
  try {
    const { notification_Id } = req.params;
    if (!notification_Id) {
      resp.status(400).send({
        success: false,
        message: "notification id is required",
      });
    }
    const notification = await Notification.findByIdAndDelete(notification_Id);
    if (notification) {
      resp.status(200).send({
        success: true,
        message: "Remove notification Successfully",
      });
    }
  } catch (error) {
    resp.status(500).send({
      success: false,
      message: error.message,
    });
  }
};
export const handleUnfollowNotification = async (data) => {
  try {
    const { secondUserId, userId } = data;
    const notifications = await Notification.find({
      $or: [
        { senderId: userId, recipientId: secondUserId },
        { senderId: secondUserId, recipientId: userId },
      ],
      status: { $in: ["requestSend", "requestaccept"] },
    });
    const notificationIds = notifications.map(
      (notification) => notification._id
    );
    for (let notification of notifications) {
      const socketId = ActiveUsers.getUserSocketId(
        notification.recipientId.toString()
      );
      if (socketId) {
        io.to(socketId).emit("removeConnectionRequestNotification", {
          notificationId: notification._id,
        });
      }
    }
    await Notification.deleteMany({ _id: { $in: notificationIds } });
  } catch (error) {
    console.error("Error handling unfollow notification:", error);
  }
};
