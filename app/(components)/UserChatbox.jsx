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
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { VscSend } from "react-icons/vsc";
import { Interweave } from "interweave";
import { UrlMatcher } from "interweave-autolink";

const UserChatbox = ({ selectedUser }) => {
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

  useEffect(() => {
    const fetchInboxMessages = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/chats/user/${selectedUser._id}`
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
  }, [selectedUser]);

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
        `${process.env.NEXT_PUBLIC_API_URL}/api/chats/user/${selectedUser._id}`,
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

      setMessage({
        text: "",
        attachments: [],
      });
      setFilePreviews([]);
    } else {
      toast.error("Message empty");
    }
  };

  useEffect(() => {
    if (socket) {
      const messageHandler = (msg) => {
        setInboxMessages((prevMessages) => {
          // Check if the message already exists to avoid duplicates
          if (prevMessages.some((m) => m._id === msg._id)) {
            return prevMessages;
          }
          return [...prevMessages, msg];
        });
      };
      socket.emit("userchat-setup", {
        sender: session.db_id,
        receiver: selectedUser._id,
      });
      socket.on("userchat-receive", messageHandler);

      return () => {
        socket.off("userchat-receive", messageHandler);
      };
    }
  }, [socket, inboxMessages, session.db_id, selectedUser._id]);

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
        <div className="flex justify-center items-center h-[30rem]">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900" />
        </div>
      ) : (
        <div className="flex flex-col h-[100%] justify-between p-4">
          <div>
            {/* chat info header */}
            <div className="flex px-2 mb-4 items-center gap-4 justify-between">
              <div className="flex items-center gap-4">
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
                <div className="flex flex-col">
                  <h1 className="text-lg font-semibold">{selectedUser.name}</h1>
                </div>
              </div>

              <div className="border p-1 rounded-lg">
                <Popover>
                  <PopoverTrigger>info</PopoverTrigger>
                  <PopoverContent>
                    <p>Name : {selectedUser.name}</p>
                    <p>College : {selectedUser.collegeName}</p>
                    <p>Course : {selectedUser.degree}</p>
                    <p>Year : {selectedUser.yearInCollege}</p>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="flex flex-col border rounded-md  h-[30rem] overflow-y-auto">
              <div className="p-4 ">
                {inboxMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.sender === selectedUser._id
                        ? "justify-start"
                        : "justify-end"
                    }`}
                  >
                    <div className="py-1 px-2 mt-1 min-w-[10rem] border rounded-lg bg-gray-100">
                      {msg.sender != selectedUser._id && (
                        <p className="text-sm font-medium">{msg.senderName}</p>
                      )}
                      {msg.attachments != null && (
                        <div className="flex flex-wrap justify-evenly max-w-lg gap-2">
                          {msg.attachments.map((attachment, index) => (
                            <Dialog key={index}>
                              <DialogTrigger>
                                <Image
                                  className="rounded-md"
                                  src={attachment}
                                  alt="attachment"
                                  height={200}
                                  width={200}
                                  objectFit="cover"
                                />
                              </DialogTrigger>
                              <DialogContent className="fixed top-1/2 left-1/2 w-screen flex items-center justify-center">
                                <Image
                                  className="rounded-md w-[100vw]"
                                  height={2000}
                                  width={2000}
                                  src={attachment}
                                  alt="attachment"
                                />
                              </DialogContent>
                            </Dialog>
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
          </div>

          <div className="flex-shrink-0">
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
