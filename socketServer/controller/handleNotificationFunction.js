import User from "../model/userModel.js";
import Request from "../model/requestModel.js";
import { io, activeUsers } from "../server.js";

export const handleNotificationFunction = async (user, socket) => {
  try {
    console.log("get data", user)
    if (user) {
      const pendingRequests = await Request.find({
        requestTo: user._id,
        notificationSend: true,
        
      });
      for (let request of pendingRequests) {
        const sender = await User.findById(request.user);
        io.to(socket.id).emit("connectionRequest", {
          recipientId: request.requestTo,
          timestamp: request.createdAt,
          senderId: request.user,
          sendername: sender.name,
          profilePic: sender.profilePic,
          status: "requestSend",
          friendRequest: request._id,
          interest: sender.interest,
        });
        request.notificationSend = false;
        await request.save();
      }

      const pendingResponses = await Request.find({
        user: user._id,
        notificationRecipt: true,
        notificationSend:false
      });
      for (let response of pendingResponses) {
        const sender = await User.findById(response.requestTo);
        io.to(socket.id).emit("receiveRequest", {
          timestamp: response.updatedAt,
          senderId: sender._id,
          sendername: sender.name,
          status: "requestaccept",
          profilePic: sender.profilePic,
          message: response.accepted ? "accept your connection request" : "decline your connection request",
        });
        response.notificationRecipt = false;
        await response.deleteOne();
      }
    }
  } catch (error) {
    console.error("Error handling user connection:", error);
  }
};
