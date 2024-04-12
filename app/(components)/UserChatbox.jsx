import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const UserChatbox = ({ selectedUser }) => {
  const [message, setMessage] = useState({
    text: "",
    attachments: [],
  });
  const [loading, setLoading] = useState(true);
  const [inboxMessages, setInboxMessages] = useState([]);

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
        console.log(data);
        setInboxMessages(data.messages);
        return data;
      } catch (error) {
        console.error(error);
        return [];
      } finally {
        setLoading(false);
      }
    };

    fetchInboxMessages();
  }, [selectedUser]);

  const sendMessageHandler = async (e) => {
    e.preventDefault();
    if (message.text.trim() !== "") {
      //   socket.emit("send-message", { message: message, roomID: roomID });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chats/user/${selectedUser._id}`,
        {
          method: "POST",
          body: JSON.stringify({ message }),
          headers: { "Content-Type": "application/json" },
        }
      );
      if (res.ok) {
        // toast.success("Message sent");
        setInboxMessages((prevMessages) => [...prevMessages, message]);
      } else {
        toast.error("Message not sent");
      }
      setMessage({
        text: "",
        attachments: [],
      });
    }
  };

  return (
    <div className="flex flex-col h-[100%] justify-between p-4">
      <div>
        {/* chat info header */}
        <div className="flex border-b px-2 pb-2 mb-4 items-center gap-4">
          <div className="w-12 h-12 relative">
            <Image
              alt="User avatar"
              className="rounded-full"
              height="48"
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
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Typing...
            </p>
          </div>
          <Button className="ml-auto" size="sm" variant="outline">
            info
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          <div>
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
                  <p className="">{msg.text}</p>
                  <p className="text-[10px] flex justify-end font-light">
                    {new Date(msg.updatedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t flex-shrink-0">
        <form className="flex items-center p-2 gap-2">
          <Button className="h-8" variant="outline">
            <PaperclipIcon className="w-4 h-4" />
            Attach
          </Button>
          <Input
            className="flex-1"
            placeholder="Type a message"
            value={message.text}
            onChange={(e) =>
              setMessage({
                text: e.target.value,
                updatedAt: new Date().toISOString(),
              })
            }
          />
          <Button className="h-8" type="submit" onClick={sendMessageHandler}>
            Send
          </Button>
        </form>
      </div>
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
