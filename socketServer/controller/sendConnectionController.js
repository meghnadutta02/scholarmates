import User from "../model/userModel.js";
import Request from "../model/requestModel.js";
import { io } from "../server.js";
import ActiveUsers from "../activeUser.js";
import Notification from "../model/notificationModel.js";
export const sendConnectionController = async (req, resp) => {
  try {
    const { recipientId } = req.body;
    const senderId = req.params.senderconnections;
    const senderUser = await User.findById(senderId);
    const receiverUser = await User.findById(recipientId);

    if (!senderUser || !receiverUser) {
      return resp.status(500).send({
        message: "user Not Found",
      });
    }

    // Check if friendship already exists
    const existingFriendship = await Request.findOne({
      participants: { $all: [senderId, recipientId] },
    });

    if (existingFriendship) {
      return resp.send({
        message: "Connection request already sent or accepted",
      });
    }

    // Create a new friendship request
    const friendshipRequest = new Request({
      participants: [senderId, recipientId],
      requestTo: recipientId,
      user: senderId,
    });

    await Notification.deleteOne({
      recipientId: recipientId,
      senderId: senderId,
      status: "requestSend",
    });

    const requestdata = await friendshipRequest.save();
    // / Send a notification to the recipient using Socket.io
    if (requestdata) {
      senderUser.requestPending.push(recipientId);
      receiverUser.requestReceived.push(senderId);
      await receiverUser.save();
      await senderUser.save();
    }

    const notification = new Notification({
      recipientId: recipientId,
      senderId: senderId,
      sendername: senderUser.name,
      profilePic: senderUser.profilePic,
      status: "requestSend",
      message: "has sent you a connection request",

      timestamp: new Date(),
    });
    await notification.save();

    const recipientSocketId = ActiveUsers.getUserSocketId(recipientId);

    if (recipientSocketId) {
      // Emit a notification event only to the recipient's socket
      io.to(recipientSocketId).emit("connectionRequest", {
        recipientId: recipientId,
        timestamp: new Date(),
        senderId: senderId,
        sendername: senderUser.name,
        profilePic: senderUser.profilePic,
        status: "requestSend",
        message: "has sent you a connection request",
        friendRequest: requestdata._id,
        interest: senderUser.interest,
        notificationId: notification._id,
      });
    } else {
      requestdata.notificationSend = true;
      requestdata.sendnotificationId = notification._id;
      await requestdata.save();
      // Handle case where recipient is not connected
    }

    return resp.status(200).send({
      sucess: true,
      message: "request send",
    });
  } catch (error) {
    return resp.status(500).send({
      sucess: false,
      message: error.message,
    });
  }
};

export const receiveConnectionController = async (req, resp) => {
  try {
    const { userId, friendshipId, action } = req.body;
    const friendshipRequest = await Request.findById(friendshipId);

    if (!friendshipRequest) {
      return resp.status(404).json({ message: "Friendship request not found" });
    }

    if (!userId || !friendshipRequest.participants.includes(userId)) {
      return resp
        .status(403)
        .json({ message: "You do not have permission to accept this request" });
    }
    const user = await User.findById(friendshipRequest.requestTo);
    const sender = await User.findById(friendshipRequest.user);

    // IF USER ACCEPT CONNECTION REQUEST

    if (action === "accept") {
      if (user && sender) {
        if (!user.connection.includes(sender._id)) {
          user.connection.push(sender._id);
        }

        if (!sender.connection.includes(user._id)) {
          sender.connection.push(user._id);
        }
        await user.updateOne({ $pull: { requestReceived: sender._id } });
        await sender.updateOne({ $pull: { requestPending: user._id } });
        await user.save();
        await sender.save();

        await Notification.deleteOne({
          recipientId: user._id,
          senderId: sender._id,
          status: "requestaccept",
        });

        const notification = new Notification({
          recipientId: sender._id,
          senderId: userId,
          sendername: user.name,
          profilePic: user.profilePic,
          status: "requestaccept",
          timestamp: new Date(),
          message: "accepted your connection request",
        });
        await notification.save();

        const senderSocketId = ActiveUsers.getUserSocketId(
          friendshipRequest.user.toString()
        );
        if (senderSocketId) {
          // Emit a notification event only to the recipient's socket
          io.to(senderSocketId).emit("receiveRequest", {
            timestamp: new Date(),
            senderId: userId,
            sendername: user.name,
            status: "requestaccept",
            profilePic: user.profilePic,
            message: "accepted your connection request",
            notificationId: notification._id,
          });
        }

        await friendshipRequest.deleteOne();

        return resp.status(200).send({
          message: "accepted",
          success: true,
        });
      } else {
        return resp.status(404).json({ message: "User or sender not found" });
      }

      // IF USER DECLINE CONNECTION REQUEST
    } else if (action === "decline") {
      await user.updateOne({ $pull: { requestReceived: sender._id } });
      await sender.updateOne({ $pull: { requestPending: user._id } });

      await friendshipRequest.deleteOne();

      return resp.status(200).send({
        message: "declined",
        success: true,
      });
    } else {
      return resp.status(400).send({
        message: "Invalid action",
        success: false,
      });
    }
  } catch (error) {
    console.error(error);

    return resp.status(500).send({
      success: false,
      message: error.message,
    });
  }
};


// REMOVE CONNECTION

export const removeConnectionController = async (req, resp) => {
  try {
   
    const { recipientId } = req.body;
    const senderId = req.params.senderId;

    // Find the friendship request
    const friendshipRequest = await Request.findOne({
      participants: { $all: [senderId, recipientId] },
      user: senderId,
      requestTo: recipientId,
    });

    if (!friendshipRequest) {
      return resp.status(404).json({ message: "Friendship request not found" });
    }

    // Remove the request from the users' pending and received lists
    await User.updateOne({ _id: senderId }, { $pull: { requestPending: recipientId } });
    await User.updateOne({ _id: recipientId }, { $pull: { requestReceived: senderId } });

    // Delete the friendship request
    await friendshipRequest.deleteOne();

    // Delete the corresponding notification
    await Notification.deleteOne({
      recipientId: recipientId,
      senderId: senderId,
      status: "requestSend",
    });

    return resp.status(200).send({
      success: true,
      message: "Connection request removed",
    });
  } catch (error) {
    return resp.status(500).send({
      success: false,
      message: error.message,
    });
  }
};