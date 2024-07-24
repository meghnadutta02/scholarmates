import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import connection from "./db.js";
import userStatus from "./route/userStatus.js";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import notification from "./route/notification.js";
import sendConnection from "./route/sendConnectionRoute.js";
import joinRequest from "./route/joinRequestRoute.js";
import User from "./model/userModel.js";
import Notification from "./model/notificationModel.js";
import { handleJoinRequestNotification } from "./controller/joinRequestNotification.js";
import { handleDiscussionNotification } from "./controller/discussionNotification.js";
import { handleJoinRequestAcceptedNotification } from "./controller/joinRequestAcceptedNotification.js";
import ActiveUsers from "./activeUser.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use("/sendconnection", sendConnection);
app.use("/joinrequest", joinRequest);
app.use("/notification", notification);
app.use("/user-status", userStatus);
app.get("/delete-old-notifications", async (req, res) => {
  try {
    await Notification.deleteOldNotifications();
    res.status(200).send("Old notifications successfully deleted.");
  } catch (error) {
    console.error("Error deleting old notifications:", error);
    res.status(500).send("Failed to delete old notifications.");
  }
});
app.get("/health", (req, res) => {
  res.status(200).json({ status: "success", message: "Service is running" });
});

const socketServer = http.createServer(app);

connection();
const io = new Server(socketServer, {
  cors: {
    origin: ["https://scholar-mates.vercel.app", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "PATCH"],
  },
});

const activeUserChatrooms = new Map();
function generateRoomId(userId1, userId2) {
  const combinedIds = [userId1, userId2].sort().join("_");
  return combinedIds;
}
var userId = null;

io.on("connection", async (socket) => {
  // User socket connection setup and notification handler
  console.log("Connected to socket.io");
  socket.on("setup", async (userData) => {
    const user = await User.findById(userData);
    if (user) {
      userId = userData;
      socket.join(userData);
      ActiveUsers.setActiveUser(userData, socket.id);
    }
  });

  socket.on("discussionCreated", async (data) => {
    await handleDiscussionNotification(data);
  });

  socket.on("joinRequest", async (data) => {
    await handleJoinRequestNotification(data);
  });
  socket.on("joinRequestAccepted", async (data) => {
    console.log("joinRequestAccepted", data);
    await handleJoinRequestAcceptedNotification(data);
  });

  // ---------------------Group chat events ----------------------------

  socket.on("groupchat-setup", async (groupId) => {
    if (groupId) {
      socket.join(groupId);
      console.log(`User ${socket.id} joined group ${groupId}`);
    } else console.log(`Group ${groupId} not found`);
  });

  socket.on("send-message", (data) => {
    if (data.roomID) {
      io.to(data.roomID).emit("receive-message", data.message);
    } else {
      io.emit("receive-message", data);
    }
  });

  // ---------------------User chat events ----------------------------

  socket.on("userchat-setup", async (data) => {
    if (!data || !data.sender || !data.receiver) {
      console.error("Invalid data received:", data);
      return;
    }

    const roomId = generateRoomId(data.sender, data.receiver);

    if (!socket.rooms.has(roomId)) {
      socket.join(roomId);
      activeUserChatrooms.set(socket.id, roomId);
    }

    if (
      activeUserChatrooms.get(socket.id) ===
      activeUserChatrooms.get(ActiveUsers.getUserSocketId(data.receiver))
    ) {
      io.to(roomId).emit("userchat-update-read");
    }
  });

  socket.on("userchat-close", async (data) => {
    if (!data || !data.sender || !data.receiver) {
      console.error("Invalid data received:", data);
      return;
    }

    const roomId = generateRoomId(data.sender, data.receiver);

    if (socket.rooms.has(roomId)) {
      socket.leave(roomId);
      activeUserChatrooms.delete(socket.id);
    }
  });

  socket.on("userchat-send", (data) => {
    if (
      data.message &&
      activeUserChatrooms.get(socket.id) ===
        activeUserChatrooms.get(ActiveUsers.getUserSocketId(data.receiver))
    ) {
      const roomId = activeUserChatrooms.get(socket.id);
      io.to(roomId).emit("userchat-receive", data.message);
    } else if (ActiveUsers.getActiveUsers().has(data.receiver)) {
      io.to(ActiveUsers.getUserSocketId(data.receiver)).emit(
        "userchat-inbox",
        data.message
      );
    }
  });

  socket.on("disconnect", () => {
    activeUserChatrooms.delete(socket.id);
    ActiveUsers.removeActiveUser(socket.id);

    console.log("user disconnected");
  });
});

// ==========CHAT SYSTEM ENDED==========

socketServer.listen(5001, () => {
  console.log("Socket server listening on PORT:5001...");
});

export { io };
