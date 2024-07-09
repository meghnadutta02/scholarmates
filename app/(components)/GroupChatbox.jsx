"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect, useRef } from "react";
import GroupDetails from "@/app/(components)/GroupDetails";
import DisplayMedia from "./DisplayMedia";
import Spinnersvg from "@/public/Spinner.svg";
import { toast } from "react-toastify";

import { VscSend } from "react-icons/vsc";

import { Interweave } from "interweave";
import { UrlMatcher } from "interweave-autolink";
import { useSession } from "./SessionProvider";
import Image from "next/image";
import { IoArrowBackCircleOutline } from "react-icons/io5";

const GroupChatbox = ({
  roomID,
  setGroups,
  setIsRoomSelected,
  setRoomID,
  setToggleChatView,
  updateLastMessage,
}) => {
  const { socket, session } = useSession();
  const [loading, setLoading] = useState(true);

  const [showGroupDetails, setShowGroupDetails] = useState(false);
  const [message, setMessage] = useState({
    text: "",
    groupId: roomID,
    attachments: [],
  });
  const [groupId, setGroupId] = useState(roomID);
  const [inboxMessages, setInboxMessages] = useState([]);
  const [groupDetails, setGroupDetails] = useState({});
  const messagesEndRef = useRef(null);
  const [filePreviews, setFilePreviews] = useState([]);

  const updateReadStatus = async (gid) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chats/group/${gid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to mark messages as read");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getGroupMessages = async (groupId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chats/group/${groupId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }
      const data = await response.json();
      setGroupDetails(data.groupDetails);
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
    if (message.text.trim() !== "" || message.attachments.length > 0) {
      const tempMessage = {
        ...message,
        tempId: Date.now(), // Generate a temporary ID
        sending: true,
      };
      // Add the temporary message to the state to ensure the messages get updated only once
      setInboxMessages((prevMessages) => [...prevMessages, tempMessage]);

      const formData = new FormData();
      formData.append("text", message.text);
      formData.append("sender", session.db_id);
      formData.append("groupId", groupId);
      formData.append("senderName", session.name);

      if (message.attachments != null) {
        message.attachments.forEach((file, index) => {
          formData.append(`attachments`, file);
        });
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chats/group/${groupId}`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (res.ok) {
        const data = await res.json();
        // console.log(data);
        setInboxMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.tempId === tempMessage.tempId ? data.result : msg
          )
        );
        socket.emit("send-message", {
          message: data.result,
          roomID: roomID,
        });
      } else {
        toast.error("Message not sent");
        // Remove the temporary message if the API call fails
        setInboxMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.tempId !== tempMessage.tempId)
        );
      }
      updateLastMessage(groupId, message.text, session.name);
      setMessage({
        text: "",
        groupId: roomID,
        attachments: [],
      });
      setFilePreviews([]);
      updateReadStatus(groupId);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const groupMessages = await getGroupMessages(groupId);
      setInboxMessages(groupMessages.messagesWithSenderName);
    };

    fetchData();
    updateReadStatus(groupId);
  }, [groupId]);

  useEffect(() => {
    if (socket) {
      const messageHandler = (msg) => {
        updateLastMessage(groupId, msg.text, session.name);
        setInboxMessages((prevMessages) => {
          // Check if the message already exists to avoid duplicates
          if (prevMessages.some((m) => m._id === msg._id)) {
            return prevMessages;
          }
          return [...prevMessages, msg];
        });
        updateReadStatus(groupId);
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

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setMessage((prevMessage) => ({
      ...prevMessage,
      attachments: files,
    }));

    const previews = files.map((file) => URL.createObjectURL(file));
    setFilePreviews(previews);
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center z-50">
          <Image src={Spinnersvg} alt="Loading..." className="h-28" />
        </div>
      ) : showGroupDetails ? (
        <GroupDetails
          groupDetails={groupDetails}
          setShowGroupDetails={setShowGroupDetails}
          setGroups={setGroups}
          setIsRoomSelected={setIsRoomSelected}
          setRoomID={setRoomID}
        />
      ) : (
        <div className="flex flex-col h-[100%] justify-between bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center justify-between px-4">
            <h2
              className="text-center font-semibold text-xl py-4 cursor-pointer"
              onClick={() => setShowGroupDetails(true)}
            >
              {groupDetails?.name}
            </h2>
            <div className=" p-1 rounded-lg">
              <IoArrowBackCircleOutline
                className="cursor-pointer hover:text-gray-500 transition-colors duration-200 ease-in-out"
                onClick={() => setToggleChatView(true)}
                size={30}
              />
            </div>
          </div>

          <div className="p-4 mx-2 border h-[32rem] rounded-md overflow-y-auto bg-white scrollbar-none">
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
                  {msg.attachments != null && (
                    <div className="flex flex-wrap justify-evenly max-w-lg gap-2">
                      {msg.attachments.map((attachment, index) => (
                        <DisplayMedia key={index} fileUrl={attachment} />
                      ))}
                    </div>
                  )}
                  <Interweave
                    content={msg.text}
                    matchers={[new UrlMatcher("url")]}
                  />
                  <p className="text-xs flex justify-end font-light">
                    {msg.sending ? (
                      <>Sending...</>
                    ) : (
                      <>
                        {new Date(msg.updatedAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </>
                    )}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div>
            {filePreviews.length > 0 && (
              <div className="flex gap-2 mb-2">
                {filePreviews.map((preview, index) => (
                  <div key={index} className="relative w-16 h-16">
                    <Image
                      src={preview}
                      alt={`preview-${index}`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                    <button
                      className="absolute top-0 right-0 bg-white rounded-full p-1"
                      onClick={() => {
                        const newPreviews = filePreviews.filter(
                          (_, i) => i !== index
                        );
                        setFilePreviews(newPreviews);
                        setMessage((prevMessage) => ({
                          ...prevMessage,
                          attachments: prevMessage.attachments.filter(
                            (_, i) => i !== index
                          ),
                        }));
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
            <form
              onSubmit={sendMessageHandler}
              className="flex items-center p-2 gap-2"
            >
              <Input
                type="text"
                className="flex-1"
                value={message.text}
                onChange={(e) =>
                  setMessage((prevMessage) => ({
                    ...prevMessage,
                    text: e.target.value,
                    senderName: session?.name,
                    sender: session?.db_id,
                  }))
                }
                placeholder="Type a message"
              />
              <div>
                <label className="relative cursor-pointer m-2">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <PaperclipIcon className="w-5 h-5 mx-2 cursor-pointer" />
                </label>
              </div>

              <Button className="h-8" type="submit">
                <VscSend height={50} />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default GroupChatbox;

function PaperclipIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}
