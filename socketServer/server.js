//create a socket server using node express
const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors);
const socketServer = http.createServer(app);

const io = new Server(socketServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`A user connected ${socket.id}`);

  socket.on("send-message", (data) => {
    console.log(data);
    if (data.roomID) {
      io.to(data.roomID).emit("receive-message", data.message);
    } else {
      io.emit("receive-message", data);
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("selectedRoomID", (roomID) => {
    console.log(roomID);
    socket.join(roomID);
  });
});

socketServer.listen(5000, () => {
  console.log("Socket server listening on PORT:3000...");
});
