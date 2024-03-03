// server.js
import { Server } from "socket.io";
import cors from "cors";
import express from 'express';
import { createServer } from 'http';

const setupServer = () => {
  const app = express();
  const httpServer = createServer();

  // Enable CORS
  app.use(cors());

  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("A client connected");

    // Event handler for receiving messages from the client
    socket.on("message", (data) => {
      console.log("message received:", data);
    });
  });

  // io.engine.on("connection_error", (err) => {
  //   console.log(err.req);      // the request object
  //   console.log(err.code);     // the error code, for example 1
  //   console.log(err.message);  // the error message, for example "Session ID unknown"
  //   console.log(err.context);  // some additional error context
  // });

  httpServer.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
};

export default setupServer;
