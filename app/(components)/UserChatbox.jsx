import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { useSession as useCustomSession } from "./SessionProvider";
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
import Link from "next/link";
import Loading from "./Loading";

const UserChatbox = ({
  selectedUser,
  setToggleChatView,
  updateLastMessage,
}) => {
  const { data: session } = useSession();
  const { socket } = useCustomSession();
  const [message, setMessage] = useState({
    text: "",
    attachments: [],
    sender: session?.user?.db_id,
  });

  const userID = selectedUser._id || selectedUser.userId;

  const [loading, setLoading] = useState(true);
  const [inboxMessages, setInboxMessages] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [page, setPage] = useState(0);

  const messagesEndRef = useRef(null);
  const observerRef = useRef(null);
  const lastMessageRef = useRef(null);

  const fetchInboxMessages = useCallback(
    async (page) => {
      try {
        const limit = 20;
        const skip = page * limit;
        const response = await fetch(
          `/api/chats/user/${userID}?limit=${limit}&skip=${skip}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }
        const data = await response.json();
        if (data.messages.length < limit) {
          setHasMoreMessages(false);
        }
        // Reverse only the new fetched messages
        const newMessages = data.messages.reverse();
        setInboxMessages((prevMessages) => {
          // Avoid duplicate messages
          const newMessageIds = newMessages.map((msg) => msg._id);
          const filteredMessages = prevMessages.filter(
            (msg) => !newMessageIds.includes(msg._id)
          );
          return [...newMessages, ...filteredMessages];
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [userID]
  );

  useEffect(() => {
    if (userID) {
      setPage(0);
      setHasMoreMessages(true);
      setInboxMessages([]);
      fetchInboxMessages(0);
    }
  }, [selectedUser, userID, fetchInboxMessages]);

  useEffect(() => {
    if (page > 0) {
      fetchInboxMessages(page);
    }
  }, [page, fetchInboxMessages]);

  const sendMessageHandler = async (e) => {
    e.preventDefault();

    if (message.text.trim() !== "" || message.attachments.length > 0) {
      const tempMessage = {
        ...message,
        tempId: Date.now(),
        sending: true,
      };

      setInboxMessages((prevMessages) => [...prevMessages, tempMessage]);

      const formData = new FormData();
      formData.append("text", message.text);
      formData.append("sender", session?.user?.db_id);

      if (message.attachments != null) {
        message.attachments.forEach((file) => {
          formData.append(`attachments`, file);
        });
      }

      const res = await fetch(`/api/chats/user/${userID}`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setInboxMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.tempId === tempMessage.tempId ? data.result : msg
          )
        );
        socket.emit("userchat-send", {
          message: data.result,
          receiver: selectedUser,
          sender: session?.user?.db_id,
        });
      } else {
        toast.error("Message not sent");
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
      const response = await fetch(`/api/chats/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
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
          if (prevMessages.some((m) => m._id === msg._id)) {
            return prevMessages;
          }
          return [...prevMessages, msg];
        });
        markMessagesAsRead(userID);
      };
      socket.emit("userchat-setup", {
        sender: session?.user?.db_id,
        receiver: userID,
      });
      socket.on("userchat-receive", messageHandler);

      return () => {
        socket.off("userchat-receive", messageHandler);
      };
    }
  }, [socket, inboxMessages, session?.user?.db_id, updateLastMessage, userID]);

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

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prevPage) => prevPage + 1);
      }
    });

    if (lastMessageRef.current) {
      observerRef.current.observe(lastMessageRef.current);
    }

    return () => {
      if (observerRef.current && lastMessageRef.current) {
        observerRef.current.unobserve(lastMessageRef.current);
      }
    };
  }, [lastMessageRef.current, hasMoreMessages]);
  // Don't remove the above lastmessageRef.current dependency to remove the warning

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-col h-[100%] bg-gray-50 justify-between p-4">
          <div>
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
                      {/* <span className="absolute bottom-0 right-0 flex w-3 h-3 rounded-full border-[4px] border-white bg-green-500 translate-x-1 translate-y-1" /> */}
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="max-w-[132px]">
                    <Link
                      href={`/profile/${userID}`}
                      className="text-blue-600 "
                    >
                      View Profile
                    </Link>
                  </PopoverContent>
                </Popover>

                <div className="flex flex-col">
                  <h1 className="text-lg font-semibold">
                    {selectedUser.userName}
                  </h1>
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

            <div className="flex flex-col h-[32rem] border rounded-md bg-white overflow-y-auto scrollbar-none p-1">
              {inboxMessages.map((msg, index) => {
                const currentDate = new Date(msg.createdAt).toLocaleDateString(
                  [],
                  {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  }
                );

                const previousDate =
                  index > 0
                    ? new Date(
                        inboxMessages[index - 1].createdAt
                      ).toLocaleDateString([], {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : null;

                const showDateSeparator = currentDate !== previousDate;

                return (
                  <div key={index}>
                    {showDateSeparator && (
                      <div className="text-center text-sm my-4 text-gray-500">
                        {currentDate}
                      </div>
                    )}
                    <div
                      id={`msg-${index}`}
                      data-date={msg.createdAt}
                      className={`flex ${
                        msg.sender === userID ? "justify-start" : "justify-end"
                      }`}
                      ref={
                        index === 0
                          ? (el) => {
                              lastMessageRef.current = el;
                            }
                          : null
                      }
                    >
                      <div
                        className={`py-1 px-2 mt-1 min-w-[10rem] border rounded-lg ${
                          msg.sender === userID ? "bg-gray-100" : "bg-blue-100"
                        }`}
                      >
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
                              {new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

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
            {session?.user?.connection.includes(userID) ? (
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
            ) : (
              <div className="p-2 text-center mb-2 mt-[-4px] rounded-b-lg bg-red-100">
                <p> You are not connected with this user anymore</p>
                <p className="text-sm">
                  <Link
                    href={`/profile/${userID}`}
                    className="font-semibold text-blue-700"
                  >
                    Send a request{" "}
                  </Link>
                  to start chatting again
                </p>
              </div>
            )}
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
