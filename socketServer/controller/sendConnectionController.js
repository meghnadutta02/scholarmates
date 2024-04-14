import User from "../model/userModel.js";
import Request from "../model/requestModel.js";
// import { io } from "../path/to/socketServer";
import { io } from "../server.js";

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
    console.log("requestdata:", requestdata._id);

    // / Send a notification to the recipient using Socket.io
    if(requestdata){
     senderUser.requestPending.push(recipientId);
     await senderUser.save();
     console.log("first",senderUser)
    }

    io.to(recipientId).emit("connectionRequest", {
      recipientId: recipientId,
      senderId: senderId,
      sendername: senderUser.name,
      friendRequest: requestdata._id,
      interest: senderUser.interest,
    });

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
    // const userId = params.receiverconnection;
    const { userId, friendshipId } = req.body;
    console.log(userId, friendshipId);

    const friendshipRequest = await Request.findById(friendshipId);
    console.log(friendshipRequest);

    if (!friendshipRequest) {
      return resp.status(404).json({ message: "Friendship request not found" });
    }

    if (!userId || !friendshipRequest.participants.includes(userId)) {
      return res
        .status(403)
        .json({ message: "You do not have permission to accept this request" });
    }
    const user = await User.findById(friendshipRequest.requestTo);
    const sender = await User.findById(friendshipRequest.user);
    if (user || sender) {
      user.connection.push(sender._id);
      await user.updateOne({$pull:{requestPending:sender._id}});
      await user.save();

      sender.connection.push(user._id);
     await sender.updateOne({$pull:{requestPending:user._id}});
      await sender.save();
    }
    console.log(user, sender);
    // Use remove() or deleteOne() to delete the friendshipRequest
    await friendshipRequest.deleteOne(); //

    return resp.status(200).send({
      message: "accepted",
      sucess: true,
    });
  } catch (error) {
    console.error(error);

    return resp.status(500).send({
      success: false,
      message: error.message,
    });
  }
};