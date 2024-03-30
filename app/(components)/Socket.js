import { io } from "socket.io-client";
import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";

const setupSocket = async () => {
  try {
    const session = await getServerSession(options);
    const socket = io("http://localhost:5001");

    socket.on("connect", () => {
      console.log("Successfully connected!");
      const userData = { userId: session?.user?.db_id };
      socket.emit("setup", userData);
    });

    return socket;
  } catch (error) {
    console.error("Error setting up socket:", error);
    throw error;
  }
};

export default setupSocket;
