//create a socket server using node express
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import connection from "./db.js"
import dotenv from  "dotenv";
import bodyParser from "body-parser";
import sendConnection from "./route/sendConnectionRoute.js";
//CONFIG ENV

console.log(process.env.MONGO_URI);
const app=express();
app.use(cors());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(express.json());
app.use('/sendconnection',sendConnection)
const socketServer = http.createServer(app);


connection();
const io = new Server(socketServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection",async (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData);
    console.log("user id is:",userData)
    socket.emit("connected");
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  
});

socketServer.listen(5001, () => {
  console.log("Socket server listening on PORT:5000...");
});

export {io};