"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const connections = [
  {
    id: 1,
    name: "John Doe",
    image:
      "https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg",
    last_message: "Hello there!",
  },
  {
    id: 2,
    name: "Alice Smith",
    image:
      "https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg",
    last_message: "How are you doing?",
  },
  {
    id: 3,
    name: "Bob Johnson",
    image:
      "https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg",
    last_message: "See you later!",
  },
  {
    id: 4,
    name: "Emily Brown",
    image:
      "https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg",
    last_message: "Can you send me the file?",
  },
  {
    id: 5,
    name: "Michael Wilson",
    image:
      "https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg",
    last_message: "I'll be there in 5 minutes.",
  },
];

export default function Chats() {
  const [selectedUser, setSelectedUser] = useState(null);
  const handleConnectionClick = (userName) => {
    setSelectedUser(userName);
  };

  return (
    <div className="flex flex-col h-[90%] rounded-lg border my-4">
      <div className="flex flex-1 overflow-hidden">
        {/*CHATS LIST ---- for both connections and discussions */}
        <div className="w-1/3 border-r py-4 px-1 flex flex-col gap-2 overflow-hidden">
          {connections.map((connection, index) => (
            <Button
              onClick={() => handleConnectionClick(`${connection.name}`)}
              variant="ghost"
              key={connection.id}
              className="flex h-14 justify-start gap-4"
            >
              <div className="hidden md:block w-10 h-10 relative">
                <Image
                  alt="User avatar"
                  className="rounded-full"
                  height="48"
                  src={connection.image}
                  style={{
                    aspectRatio: "48/48",
                    objectFit: "cover",
                  }}
                  width="48"
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-md md:text-lg font-semibold">
                  {connection.name}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Last message{" "}
                </p>
              </div>
            </Button>
          ))}
          <Link href="/chats/discussions" className="border-t-2">
            <Button className="my-4 ml-8">See Discussions</Button>
          </Link>
        </div>

        {/*CHAT AREA ----- fetch the specific chat messages for the selected user */}
        {selectedUser ? (
          <div className="flex flex-col h-[100%] justify-between p-4">
            <div>
              {/* chat info header */}
              <div className="flex border-b px-2 pb-2 mb-4 items-center gap-4">
                <div className="w-12 h-12 relative">
                  <Image
                    alt="User avatar"
                    className="rounded-full"
                    height="48"
                    src="/placeholder.svg"
                    style={{
                      aspectRatio: "48/48",
                      objectFit: "cover",
                    }}
                    width="48"
                  />
                  <span className="absolute bottom-0 right-0 flex w-3 h-3 rounded-full border-[4px] border-white bg-green-500 translate-x-1 translate-y-1" />
                </div>
                <div className="flex flex-col">
                  <h1 className="text-lg font-semibold">{selectedUser}</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Typing...
                  </p>
                </div>
                <Button className="ml-auto" size="sm" variant="outline">
                  info
                </Button>
              </div>
              <div className="flex flex-col gap-2">
                {/* senders message */}
                <div className="flex items-center gap-2 max-w-[70%]">
                  <div className="w-8 h-8 relative">
                    <Image
                      alt="User avatar"
                      className="rounded-full"
                      height="32"
                      src="/placeholder.svg"
                      style={{
                        aspectRatio: "32/32",
                        objectFit: "cover",
                      }}
                      width="32"
                    />
                    <span className="absolute bottom-0 right-0 flex w-2 h-2 rounded-full border-[4px] border-white bg-green-500 translate-x-1 translate-y-1" />
                  </div>
                  <div className="rounded-lg bg-gray-100 dark:bg-gray-900 p-4">
                    <p className="text-sm leading-[20px]">
                      Hey! I just wanted to follow up on the proposal we sent
                      last week. Let me know if you have any questions.
                    </p>
                    <time className="text-xs block mt-2 peer-muted-when:after/">
                      2 minutes ago
                    </time>
                  </div>
                </div>
                {/* your message */}
                <div className="flex items-center gap-2 ml-auto max-w-[70%]">
                  <div className="rounded-lg bg-gray-100 dark:bg-gray-900 p-4">
                    <p className="text-sm leading-[20px]">
                      Thanks for reaching out! Ill take a look at the proposal
                      and get back to you by the end of the day.
                    </p>
                    <time className="text-xs block mt-2 peer-muted-when:after/">
                      1 minute ago
                    </time>
                  </div>
                  <div className="w-8 h-8 relative">
                    <Image
                      alt="User avatar"
                      className="rounded-full"
                      height="32"
                      src="/placeholder.svg"
                      style={{
                        aspectRatio: "32/32",
                        objectFit: "cover",
                      }}
                      width="32"
                    />
                    <span className="absolute bottom-0 right-0 flex w-2 h-2 rounded-full border-[4px] border-white bg-green-500 translate-x-1 translate-y-1" />
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t flex-shrink-0">
              <form className="flex items-center p-2 gap-2">
                <Button className="h-8" variant="outline">
                  <PaperclipIcon className="w-4 h-4" />
                  Attach
                </Button>
                <Input className="flex-1" placeholder="Type a message" />
                <Button className="h-8" type="submit">
                  Send
                </Button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center py-16 min-w-[240px] md:min-w-[750px]">
            <p>Click to start conversation</p>
          </div>
        )}
      </div>
    </div>
  );
}

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
