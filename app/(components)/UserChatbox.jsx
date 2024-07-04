import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useSession } from "./SessionProvider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { VscSend } from "react-icons/vsc";
import { Interweave } from "interweave";
import { UrlMatcher } from "interweave-autolink";
import DisplayMedia from "./DisplayMedia";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import Link from "next/link";

const UserChatbox = ({
  selectedUser,
  setToggleChatView,
  updateLastMessage,
}) => {
  const { socket, session } = useSession();
  const [message, setMessage] = useState({
    text: "",
    attachments: [],
    sender: session.db_id,
  });
  const [loading, setLoading] = useState(true);

  const [inboxMessages, setInboxMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [filePreviews, setFilePreviews] = useState([]);
  const userID = selectedUser._id || selectedUser.userId;

  useEffect(() => {
    console.log(userID);

    if (userID) {
      const fetchInboxMessages = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/chats/user/${userID}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch messages");
          }
          const data = await response.json();
          setInboxMessages(data.messages);
          return data;
        } catch (error) {
          console.error(error);
          return [];
        } finally {
          setLoading(false);
          scrollToLastMessage();
        }
      };
      fetchInboxMessages();
    }
  }, [selectedUser, userID]);

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

      if (message.attachments != null) {
        message.attachments.forEach((file, index) => {
          formData.append(`attachments`, file);
        });
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chats/user/${userID}`,
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
        socket.emit("userchat-send", {
          message: data.result,
          receiver: selectedUser,
          sender: session.db_id,
        });
      } else {
        toast.error("Message not sent");
        // Remove the temporary message if the API call fails
        setInboxMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.tempId !== tempMessage.tempId)
        );
      }
      updateLastMessage(userID, message.text);
      setMessage({
        text: "",
        attachments: [],
      });
      setFilePreviews([]);
    } else {
      toast.error("Message empty");
    }
  };

  const markMessagesAsRead = async (userId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chats/user/${userId}`,
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

  useEffect(() => {
    if (socket) {
      const messageHandler = (msg) => {
        updateLastMessage(msg.sender, msg.text);
        setInboxMessages((prevMessages) => {
          // Check if the message already exists to avoid duplicates
          if (prevMessages.some((m) => m._id === msg._id)) {
            return prevMessages;
          }
          return [...prevMessages, msg];
        });
        markMessagesAsRead(userID);
      };
      socket.emit("userchat-setup", {
        sender: session.db_id,
        receiver: userID,
      });
      socket.on("userchat-receive", messageHandler);

      return () => {
        socket.off("userchat-receive", messageHandler);
      };
    }
  }, [socket, inboxMessages, session.db_id, updateLastMessage, userID]);

  const scrollToLastMessage = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToLastMessage();
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
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-[32rem]">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900" />
        </div>
      ) : (
        <div className="flex flex-col h-[100%] bg-gray-50 justify-between p-4">
          <div>
            {/* chat info header */}
            <div className="flex px-2 mb-4 items-center gap-4 justify-between">
              <div className="flex items-center justify-start gap-2">
                <Popover>
                  <PopoverTrigger>
                    <div className="w-12 h-12 relative">
                      <Image
                        alt="User avatar"
                        className="rounded-full"
                        height="36"
                        src={selectedUser.profilePic}
                        style={{
                          aspectRatio: "48/48",
                          objectFit: "cover",
                        }}
                        width="48"
                      />
                      <span className="absolute bottom-0 right-0 flex w-3 h-3 rounded-full border-[4px] border-white bg-green-500 translate-x-1 translate-y-1" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Link href={`/profile/${userID}`} className="text-blue-600">
                      View Profile
                    </Link>
                    {/* <p>Name : {selectedUser.name}</p>
                    <p>College : {selectedUser.collegeName}</p>
                    <p>Course : {selectedUser.degree}</p>
                    <p>Year : {selectedUser.yearInCollege}</p> */}
                  </PopoverContent>
                </Popover>

                <div className="flex flex-col">
                  <h1 className="text-lg font-semibold">{selectedUser.name}</h1>
                </div>
              </div>

              <div className=" p-1 rounded-lg">
                <IoArrowBackCircleOutline
                  className="cursor-pointer hover:text-gray-500 transition-colors duration-200 ease-in-out"
                  onClick={() => setToggleChatView(true)}
                  size={30}
                />
              </div>
            </div>

            <div className="flex flex-col border rounded-md bg-white h-[32rem] overflow-y-auto scrollbar-none p-1">
              {inboxMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender === userID ? "justify-start" : "justify-end"
                  }`}
                >
                  <div className="py-1 px-2 mt-1 min-w-[10rem] border rounded-lg bg-gray-100">
                    {msg.sender != userID && (
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
                    <p className="text-[10px] flex justify-end font-light">
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
          </div>

          <div className="flex-shrink-0">
            {filePreviews.length > 0 && (
              <div className="flex gap-2 mb-2">
                {filePreviews.map((preview, index) => (
                  <div key={index} className="relative w-16 h-16">
                    <Image
                      src={preview}
                      alt="preview"
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
                className="flex-1"
                placeholder="Type a message"
                value={message.text}
                onChange={(e) =>
                  setMessage((prevMessage) => ({
                    ...prevMessage,
                    text: e.target.value,
                  }))
                }
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
    </div>
  );
};

export default UserChatbox;

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
