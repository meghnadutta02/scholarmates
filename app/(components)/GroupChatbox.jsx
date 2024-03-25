"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const messages = [
  {
    id: 1,
    text: "Hello, everyone!",
    sender: "user1",
    timestamp: "2024-03-23T10:00:00",
    groupId: 1,
  },
  {
    id: 2,
    text: "Hi there!",
    sender: "user2",
    timestamp: "2024-03-23T10:05:00",
    groupId: 2,
  },
  {
    id: 3,
    text: "Welcome to the group!",
    sender: "user3",
    timestamp: "2024-03-23T10:10:00",
    groupId: 1,
  },
  {
    id: 4,
    text: "Good morning!",
    sender: "user1",
    timestamp: "2024-03-23T10:15:00",
    groupId: 3,
  },
  {
    id: 5,
    text: "How's everyone doing?",
    sender: "user2",
    timestamp: "2024-03-23T10:20:00",
    groupId: 2,
  },
  {
    id: 6,
    text: "What are your plans for today?",
    sender: "user3",
    timestamp: "2024-03-23T10:25:00",
    groupId: 1,
  },
  {
    id: 7,
    text: "I'm doing great, thanks!",
    sender: "user2",
    timestamp: "2024-03-23T10:30:00",
    groupId: 2,
  },
  {
    id: 8,
    text: "Let's meet at the park.",
    sender: "user1",
    timestamp: "2024-03-23T10:35:00",
    groupId: 3,
  },
  {
    id: 9,
    text: "Sure, I'll be there!",
    sender: "user3",
    timestamp: "2024-03-23T10:40:00",
    groupId: 3,
  },
  {
    id: 10,
    text: "Count me in!",
    sender: "user2",
    timestamp: "2024-03-23T10:45:00",
    groupId: 3,
  },
];

const getgroupMessages = (groupId) => {
  //GET the messages of this discussion by filtering
  return messages.filter((message) => message.groupId === groupId);
};

const GroupChatbox = ({ roomID }) => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState({
    text: "",
    sender: "",
    timestamp: "",
    groupId: roomID,
  });
  const [groupId, setGroupId] = useState(roomID);
  const [inboxMessages, setInboxMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const sendMessageHandler = (e) => {
    e.preventDefault();
    if (message.text.trim() !== "") {
      socket.emit("send-message", { message: message, roomID: roomID });
      setMessage({
        text: "",
        sender: "",
        timestamp: "",
        groupId: roomID,
      });
    }
  };

  useEffect(() => {
    if (!socket) {
      const newSocket = io("http://localhost:5001");
      newSocket.on("connect", () => {
        console.log("Successfully connected!");
      });
      setSocket(newSocket);
    }

    const groupMessages = getgroupMessages(groupId);
    setInboxMessages(groupMessages);

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [roomID, groupId, socket]);

  useEffect(() => {
    if (socket) {
      socket.emit("selectedRoomID", groupId);
      socket.on("receive-message", (msg) => {
        console.log(msg);
        setInboxMessages((inboxMessages) => [...inboxMessages, msg]);
      });
    }
  }, [groupId, socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [inboxMessages]);

  return (
    <div>
      <h2 className="text-center font-semibold text-xl">
        Group Chat {groupId}
      </h2>
      GET the specific group(discussion) details by ID
      <div className="flex flex-col justify-between">
        <div className="p-4 border h-[30rem] overflow-y-auto">
          {inboxMessages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "UserId" ? "justify-end" : "justify-start"
              }`}
            >
              <div className="py-1 px-2 mt-1 min-w-[10rem] border rounded-lg bg-gray-100">
                <p className="text-sm font-medium">{msg.sender}</p>
                <p className="">{msg.text}</p>
                <p className="text-xs flex justify-end font-light">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div>
          <form className="flex flex-row mx-8 my-4 justify-between">
            <div className="w-2/3">
              <Input
                required
                type="text"
                className="mt-2"
                value={message.text}
                onChange={(e) =>
                  setMessage({
                    text: e.target.value,
                    sender: "UserId",
                    timestamp: new Date().toISOString(),
                    groupId: groupId,
                  })
                }
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
    </div>
  );
};

export default GroupChatbox;
