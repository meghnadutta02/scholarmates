import { Server } from "socket.io";
import cors from "cors";
import express from 'express';
import {createServer} from 'http';

const app=express();
const httpServer=createServer();
// Enable CORS
 app.use(cors(
  {origin:'http://localhost:3000'}
 ));

const io=new Server(httpServer,{
cors:{
  origin:'http://localhost:3000',
  methods:["GET","POST"]
}
})
io.on("connection", (socket) => {
  
  console.log("A client connected");
  

  // Event handler for receiving messages from the client
  socket.on("message",(data)=>{
    console.log("message received:",data);
  })
});
io.engine.on("connection_error", (err) => {
  console.log(err.req);      // the request object
  console.log(err.code);     // the error code, for example 1
  console.log(err.message);  // the error message, for example "Session ID unknown"
  console.log(err.context);  // some additional error context
});

httpServer.listen(5000, () => {
  console.log('Server is running on port 5000');
});