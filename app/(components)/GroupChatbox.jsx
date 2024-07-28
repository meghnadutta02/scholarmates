"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect, useRef, useCallback } from "react";
import GroupDetails from "@/app/(components)/GroupDetails";
import DisplayMedia from "./DisplayMedia";
import Loading from "@/app/(components)/Loading";
import { toast } from "react-toastify";

import { VscSend } from "react-icons/vsc";

import { Interweave } from "interweave";
import { UrlMatcher } from "interweave-autolink";
import { useSession as useCustomSession } from "./SessionProvider";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { Clock12Icon } from "lucide-react";

const GroupChatbox = ({
  selectedGroup,
  setGroups,
  setSelectedGroup,
  setToggleChatView,
  updateLastMessage,
}) => {
  const { socket } = useCustomSession();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const groupId = selectedGroup.groupId || selectedGroup._id;
  const [showGroupDetails, setShowGroupDetails] = useState(false);
  const [message, setMessage] = useState({
    text: "",
    groupId: groupId,
    attachments: [],
  });
  const [inboxMessages, setInboxMessages] = useState(new Map());
  const [groupDetails, setGroupDetails] = useState(null);
  const messagesEndRef = useRef(null);
  const [filePreviews, setFilePreviews] = useState([]);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [page, setPage] = useState(0);
  const observerRef = useRef(null);
  const lastMessageRef = useRef(null);
  const limit = 20;

  const updateReadStatus = async (gid) => {
    try {
      const response = await fetch(`/api/chats/group/${gid}`, {
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

  const getGroupMessages = useCallback(async (groupId, page) => {
    try {
      const skip = page * limit;
      const response = await fetch(
        `/api/chats/group/${groupId}?limit=${limit}&skip=${skip}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }
      const data = await response.json();
      setGroupDetails(data.groupDetails);
      console.log(data.groupDetails);
      setInboxMessages((prevMessages) => {
        const newMessages = new Map(prevMessages);
        data.messagesWithSenderName.forEach((message) => {
          newMessages.set(message._id, message);
        });
        return newMessages;
      });

      setHasMoreMessages(data.messagesWithSenderName.length === limit);
    } catch (error) {
      console.error(error);
      setHasMoreMessages(false);
    } finally {
      setLoading(false);
      if (page === 0) {
        scrollDown();
      }
    }
  }, []);

  const sendMessageHandler = async (e) => {
    e.preventDefault();
    if (message.text.trim() !== "" || message.attachments.length > 0) {
      const tempMessage = {
        ...message,
        tempId: Date.now(), // Generate a temporary ID
        sending: true,
      };
      // Add the temporary message to the state to ensure the messages get updated only once
      setInboxMessages((prevMessages) => {
        const newMessages = new Map(prevMessages);
        newMessages.set(tempMessage.tempId, tempMessage);
        return newMessages;
      });

      const formData = new FormData();
      formData.append("text", message.text);
      formData.append("sender", session?.user.db_id);
      formData.append("groupId", groupId);
      formData.append("senderName", session?.user.name);

      if (message.attachments != null) {
        message.attachments.forEach((file) => {
          formData.append("attachments", file);
        });
      }

      const res = await fetch(`/api/chats/group/${groupId}`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setInboxMessages((prevMessages) => {
          const newMessages = new Map(prevMessages);
          newMessages.delete(tempMessage.tempId); // Remove the temporary message
          newMessages.set(data.result._id, data.result); // Add the new message
          return newMessages;
        });
        socket.emit("send-message", {
          message: data.result,
          roomID: groupId,
          groupMembers: groupDetails.participants,
        });
        scrollDown();
      } else {
        toast.error("Message not sent", {
          autoClose: 4000,
          closeOnClick: true,
        });
        // Remove the temporary message if the API call fails
        setInboxMessages((prevMessages) => {
          const newMessages = new Map(prevMessages);
          newMessages.delete(tempMessage.tempId);
          return newMessages;
        });
      }
      updateLastMessage(groupId, message.text, session.user.name);
      setMessage({
        text: "",
        groupId: groupId,
        attachments: [],
      });
      setFilePreviews([]);
      // updateReadStatus(groupId);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setPage(0);
      await getGroupMessages(groupId, 0);
    };

    fetchData();
    updateReadStatus(groupId);
  }, [groupId, getGroupMessages]);

  useEffect(() => {
    if (socket) {
      const messageHandler = (msg) => {
        updateLastMessage(groupId, msg.text, msg.senderName);
        setInboxMessages((prevMessages) => {
          const newMessages = new Map(prevMessages);
          newMessages.set(msg._id, msg);
          return newMessages;
        });
        updateReadStatus(groupId);
      };
      socket.on("receive-message", messageHandler);

      return () => {
        socket.off("receive-message", messageHandler);
      };
    }
  }, [groupId, socket, session?.user.name, updateLastMessage]);

  const scrollDown = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
      if (entries[0].isIntersecting && hasMoreMessages) {
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

  useEffect(() => {
    if (page > 0) {
      getGroupMessages(groupId, page);
    }
  }, [page, groupId, getGroupMessages]);

  const sortedMessages = Array.from(inboxMessages.values()).sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  const [showScrollButton, setShowScrollButton] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        chatContainerRef.current;
      const isScrolledToBottom = scrollTop + clientHeight >= scrollHeight - 10;
      setShowScrollButton(!isScrolledToBottom);
    };

    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (chatContainer) {
        chatContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const closeChatHandler = () => {
    socket.emit("groupchat-close", {
      roomID: groupId,
    });
    setToggleChatView(true);
    setInboxMessages([]);
  };

  return (
    <>
      {showGroupDetails && groupDetails ? (
        <GroupDetails
          groupDetails={groupDetails}
          setShowGroupDetails={setShowGroupDetails}
          setGroups={setGroups}
          setSelectedGroup={setSelectedGroup}
          setToggleChatView={setToggleChatView}
        />
      ) : (
        <div className="flex flex-col justify-between bg-gray-50 p-2 dark:bg-gray-800">
          <div className="relative">
            {showScrollButton && (
              <button
                onClick={scrollDown}
                className="absolute bottom-8 right-8 bg-zinc-800 text-white py-1 px-2 rounded-full shadow-md hover:bg-zinc-600 transition-colors"
              >
                ↓
              </button>
            )}
            <div className="flex items-center justify-between p-3">
              <h2
                className="text-left w-[80%] font-semibold text-xl py-2 cursor-pointer"
                onClick={() => setShowGroupDetails(true)}
              >
                {selectedGroup.groupName || selectedGroup.name}
              </h2>
              <div className=" p-1 rounded-lg">
                <IoArrowBackCircleOutline
                  className="cursor-pointer hover:text-gray-500 transition-colors duration-200 ease-in-out"
                  onClick={closeChatHandler}
                  size={30}
                />
              </div>
            </div>

            <div
              ref={chatContainerRef}
              className="p-1 mx-2 border h-[32rem] rounded-md overflow-y-auto bg-white scrollbar-none"
            >
              {loading ? (
                <Loading />
              ) : (
                <>
                  {sortedMessages.map((msg, index) => {
                    const currentDate = new Date(msg.createdAt);
                    const currentDateString = !isNaN(currentDate)
                      ? currentDate.toLocaleDateString([], {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "";

                    const previousDate =
                      index > 0 && sortedMessages[index - 1]
                        ? new Date(sortedMessages[index - 1].createdAt)
                        : null;

                    const previousDateString =
                      previousDate && !isNaN(previousDate)
                        ? previousDate.toLocaleDateString([], {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "";

                    const showDateSeparator =
                      currentDateString !== previousDateString;

                    return (
                      <div key={index}>
                        {showDateSeparator && currentDateString && (
                          <div className="text-center text-sm my-4 text-gray-500">
                            {currentDateString}
                          </div>
                        )}
                        <div
                          key={index}
                          className={`flex ${
                            msg.sender === session?.user?.db_id
                              ? "justify-end"
                              : "justify-start"
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
                            className={`py-1 px-2 mt-1 min-w-[10rem] max-w-[16rem] md:max-w-[24rem] rounded-lg ${
                              msg.sender === session?.user?.db_id
                                ? "bg-blue-100"
                                : "bg-gray-100"
                            }`}
                          >
                            {msg.sender != session?.user?.db_id && (
                              <p className="text-sm font-semibold">
                                {msg.senderName}
                              </p>
                            )}
                            {msg.attachments.length !== 0 && (
                              <div className="flex flex-wrap justify-evenly max-w-lg gap-2 my-1 py-1 rounded-md bg-white">
                                {msg.attachments.map((attachment, index) => (
                                  <DisplayMedia
                                    key={index}
                                    fileUrl={attachment}
                                  />
                                ))}
                              </div>
                            )}
                            <Interweave
                              content={msg.text}
                              matchers={[new UrlMatcher("url")]}
                            />
                            <p className="text-xs flex justify-end font-light">
                              {msg.sending ? (
                                <Clock12Icon className="w-4 h-4" />
                              ) : (
                                <p className="text-[9px]">
                                  {new Date(msg.updatedAt).toLocaleTimeString(
                                    [],
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </p>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>
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
                    senderName: session?.user?.name,
                    sender: session?.user?.db_id,
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
