//create a socket server using node express
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import connection from "./db.js";
import Group from "./model/groupModel.js";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import notification from "./route/notification.js";
import sendConnection from "./route/sendConnectionRoute.js";
import joinRequest from "./route/joinRequestRoute.js";
import User from "./model/userModel.js";
import Request from "./model/requestModel.js";
import { handleNotificationFunction } from "./controller/handleNotificationFunction.js"
import { discussionNotification } from './controller/discussionNotification.js'
import ActiveUsers from './activeUser.js'
dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use("/sendconnection", sendConnection);
app.use("/joinrequest", joinRequest);
app.use("/notification", notification);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "success", message: "Service is running" });
});

const socketServer = http.createServer(app);

connection();
const io = new Server(socketServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const activeUserChatrooms = new Map();


// GROUP CREATION AND SEND NOTIFICATION STARTED

io.on("connection", async (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", async (userData) => {
    const user = await User.findById(userData);
    if (user) {
      socket.join(userData);
      ActiveUsers.setActiveUser(userData, socket.id);
      socket.emit("connected");

      await handleNotificationFunction(user, socket);
      await discussionNotification(user,socket)
    }

  });
  // ========END============

  // ==========CHAT SYSTEM STARTED==========

  socket.on("groupchat-setup", async (groupId) => {
    if (groupId) {
      socket.join(groupId);
      console.log(`Socket ${socket.id} joined group ${groupId}`);
    } else console.log(`Group ${groupId} not found`);
  });

  socket.on("userchat-setup", async (data) => {
    if (!data || !data.sender || !data.receiver) {
      console.error("Invalid data received:", data);
      return;
    }
    function generateRoomId(userId1, userId2) {
      const combinedIds = [userId1, userId2].sort().join("_");
      return combinedIds;
    }
    const roomId = generateRoomId(data.sender, data.receiver);

    if (!socket.rooms.has(roomId)) {
      socket.join(roomId);
      activeUserChatrooms.set(socket.id, roomId);
    }
  });

  socket.on("send-message", (data) => {
    if (data.roomID) {
      io.to(data.roomID).emit("receive-message", data.message);
    } else {
      io.emit("receive-message", data);
    }
  });

  socket.on("userchat-send", (data) => {
    if (data.message && activeUserChatrooms.has(socket.id)) {
      const roomId = activeUserChatrooms.get(socket.id);
      io.to(roomId).emit("userchat-receive", data.message);
    }
  });

  socket.on("disconnect", () => {
    activeUserChatrooms.delete(socket.id);
    ActiveUsers.removeActiveUser(socket.id);
    console.log("User from activeUser disconnected");
    console.log("user disconnected");
  });
});

// ==========CHAT SYSTEM ENDED==========

socketServer.listen(5001, () => {
  console.log("Socket server listening on PORT:5001...");
});

export { io};