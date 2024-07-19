import User from "../model/userModel.js";
import Group from "../model/groupModel.js";
import { io } from "../server.js";
import ActiveUsers from "../activeUser.js";

export const handleJoinRequestNotification = async (data) => {
  try {
    const { toUsers, fromUser, groupId } = data;
    const group = await Group.findById(groupId).select("name");
    const sender = await User.findById(fromUser).select("name profilePic");

    // Emit the notification to each moderator
    for (let moderatorId of toUsers) {
      const socketId = ActiveUsers.getUserSocketId(moderatorId.toString());

      if (socketId) {
        io.to(socketId).emit("joinRequestNotification", {
          message: `has requested to join "${group.name}"`,
          sendername: sender.name,
          profilePic: sender.profilePic,
          timestamp: data.createdAt,
          status: "joinRequest",
        });
      }
    }
  } catch (error) {
    console.error("Error handling join request notification:", error);
  }
};
