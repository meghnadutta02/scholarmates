'use client';
import { io } from "socket.io-client";
import { getSession } from "next-auth/react"; // Ensure correct import path

const setupSocket = async () => {
  try {
    const session = await getSession();

    // Check if session and session.user exist before using them
    if (!session || !session.user) {
      throw new Error("No session or session user found.");
    }

    const socket = io(`${process.env.NEXT_PUBLIC_NODE_SERVER}`);

    socket.on("connection", () => {
      console.log("Successfully connected!");
      const userData = { userId: session.user.db_id };
      socket.emit("setup", userData);
    });

    return socket;
  } catch (error) {
    console.error("Error setting up socket:", error);
    throw error;
  }
};

export default setupSocket;
