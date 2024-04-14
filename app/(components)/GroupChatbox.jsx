"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { toast } from "react-toastify";
// import { useSession } from "next-auth/react";
import { VscSend } from "react-icons/vsc";
// import Linkify from "react-linkify";
import { Interweave } from "interweave";
import { UrlMatcher } from "interweave-autolink";
import { useSession } from "./SessionProvider";

const GroupChatbox = ({ roomID }) => {
  const { socket, session } = useSession();
  const [loading, setLoading] = useState(true);
  // const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState({
    text: "",
    groupId: roomID,
    attachments: [],
  });
  const [groupId, setGroupId] = useState(roomID);
  const [inboxMessages, setInboxMessages] = useState([]);
  const [groupDetails, setGroupDetails] = useState({});
  const messagesEndRef = useRef(null);

  const getGroupMessages = async (groupId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chats/group/${groupId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }
      const data = await response.json();
      setGroupDetails(data.groupDetails[0]);
      return data;
    } catch (error) {
      console.error(error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const sendMessageHandler = async (e) => {
    e.preventDefault();
    if (message.text.trim() !== "") {
      socket.emit("send-message", {
        message: message,
        roomID: roomID,
      });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chats/group/${groupId}`,
        {
          method: "POST",
          body: JSON.stringify({ message }),
          headers: { "Content-Type": "application/json" },
        }
      );
      if (res.ok) {
        // toast.success("Message sent");
      } else {
        toast.error("Message not sent");
      }
      setMessage({
        text: "",
        groupId: roomID,
        attachments: [],
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const groupMessages = await getGroupMessages(groupId);
      setInboxMessages(groupMessages.messagesWithSenderName);
    };

    fetchData();
  }, [groupId]);

  useEffect(() => {
    if (socket) {
      const messageHandler = (msg) => {
        setInboxMessages((prevMessages) => [...prevMessages, msg]);
      };
      socket.emit("groupchat-setup", groupId);
      socket.on("receive-message", messageHandler);

      return () => {
        socket.off("receive-message", messageHandler);
      };
    }
  }, [groupId, socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [inboxMessages]);

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-[30rem]">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900" />
        </div>
      ) : (
        <div className="flex flex-col justify-between ">
          <h2 className="text-center font-semibold text-xl py-4">
            {groupDetails?.title}
          </h2>

          <div className="p-4 mx-2 border h-[30rem] rounded-sm overflow-y-auto">
            {inboxMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === session?.db_id
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div className="py-1 px-2 mt-1 min-w-[10rem] border rounded-lg bg-gray-100">
                  {msg.sender != session?.db_id && (
                    <p className="text-sm font-medium">{msg.senderName}</p>
                  )}
                  {/* <Linkify
                    options={{
                      target: "_blank",
                      style: { color: "red", fontWeight: "bold" },
                    }}
                  >
                    {msg.text}
                  </Linkify> */}
                  <Interweave
                    content={msg.text}
                    matchers={[new UrlMatcher("url")]}
                  />
                  <p className="text-xs flex justify-end font-light">
                    {new Date(msg.updatedAt).toLocaleTimeString([], {
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
                      sender: session?.db_id,
                      updatedAt: new Date().toISOString(),
                      groupId: groupId,
                      senderName: session?.name,
                    })
                  }
                  placeholder="Enter message"
                />
              </div>
              <div>
                <Button className="my-2" onClick={sendMessageHandler}>
                  <VscSend height={50} />
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupChatbox;
