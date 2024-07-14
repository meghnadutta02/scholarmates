import User from "../model/userModel.js";
import Request from "../model/requestModel.js";
// import { io } from "../path/to/socketServer";
import { io } from "../server.js";
import ActiveUsers from "../activeUser.js";
export const sendConnectionController = async (req, resp) => {
  try {
    const { recipientId } = req.body;
    console.log(req.params.senderconnections);

    const senderId = req.params.senderconnections;
    console.log(senderId, recipientId);
    const senderUser = await User.findById(senderId);
    console.log("sender result:", senderUser);
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
        message: "Friendship request already sent or accepted",
      });
    }

    // Create a new friendship request
    const friendshipRequest = new Request({
      participants: [senderId, recipientId],
      requestTo: recipientId,
      user: senderId,
    });

    const requestdata = await friendshipRequest.save();

    // / Send a notification to the recipient using Socket.io
    if (requestdata) {
      senderUser.requestPending.push(recipientId);
      receiverUser.requestReceived.push(senderId);
      await receiverUser.save();
      await senderUser.save();
    }

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
        friendRequest: requestdata._id,
        interest: senderUser.interest,
      });
    } else {
      requestdata.notificationSend = true;
      await requestdata.save();
      // Handle case where recipient is not connected
      // This could involve queuing the notification or other logic based on your app's needs
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
    console.log(userId, friendshipId, action);

    const friendshipRequest = await Request.findById(friendshipId);
    console.log("request friend", friendshipRequest);

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

        console.log(user, sender);

        // await friendshipRequest.deleteOne();

        const senderSocketId = ActiveUsers.getActiveUsers(
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
            message: "accept your connection request",
          });
          await friendshipRequest.deleteOne();
        } else {
          friendshipRequest.notificationRecipt = true;
          await friendshipRequest.save();
          // Handle case where recipient is not connected
          // This could involve queuing the notification or other logic based on your app's needs
        }

        return resp.status(200).send({
          message: "accepted",
          success: true,
        });
      } else {
        return resp.status(404).json({ message: "User or sender not found" });
      }
    } else if (action === "decline") {
      await user.updateOne({ $pull: { requestReceived: sender._id } });
      await sender.updateOne({ $pull: { requestPending: user._id } });
      console.log("friend id", friendshipRequest.user.toString());
      const senderSocketId = ActiveUsers.getUserSocketId(
        friendshipRequest.user.toString()
      );

      console.log("active user", senderSocketId);
      if (senderSocketId) {
        // Emit a notification event only to the recipient's socket
        io.to(senderSocketId).emit("receiveRequest", {
          timestamp: new Date(),
          senderId: userId,
          sendername: user.name,
          status: "requestaccept",
          profilePic: user.profilePic,
          message: "decline your connection request",
        });
        await friendshipRequest.deleteOne();
      } else {
        friendshipRequest.notificationRecipt = true;
        await friendshipRequest.save();
        // Handle case where recipient is not connected
        // This could involve queuing the notification or other logic based on your app's needs
      }

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
