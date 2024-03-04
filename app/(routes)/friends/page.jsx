"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import io from "socket.io-client";

const Page = () => {
    const [message, setMessage] = useState("");
    const [username, setUsername] = useState("");

  const selectRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("selectedRoomID", roomID);
    setIsRoomSelected(true);
  };

  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("connect", () => {
      console.log("Successfully connected!");
    });

    socket.on("receive-message", (msg) => {
      console.log(msg);
      setInboxMessages((inboxMessages) => [...inboxMessages, msg]);
    });
    setSocket(socket);
  }, []);

  return (
    <div className="flex flex-col  w-full">
      <h1 className="text-center my-4 font-semibold text-3xl">Chat inbox</h1>
      <div className="px-16">
        {isRoomSelected ? (
          <div className="flex flex-col justify-between">
            <div className="p-4 border min-h-[25rem]">
              {inboxMessages.map((msg, index) => (
                <div key={index}>
                  <p className="border p-2 mt-1">{msg}</p>
                </div>
              ))}
            </div>
            <div>
              <form className="flex flex-row  my-4 justify-between">
                <div className="w-2/3">
                  <Input
                    type="text"
                    className="mt-2"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter message"
                  />
                </div>
                <div>
                  <Button className="my-2" onClick={sendMessageHandler}>
                    Send
                  </Button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <form>
            <div className="mt-2 flex flex-row justify-between">
              <Input
                type="text"
                className="w-1/2"
                value={roomID}
                onChange={(e) => setRoomID(e.target.value)}
                placeholder="Enter roomId..."
              />
              <Button onClick={selectRoomHandler}>Select</Button>
              this id will be selected automatically when user clicks on a
              friend/discussion(input only for test purposes)
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Page;
