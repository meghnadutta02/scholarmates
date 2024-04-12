"use client";
import UserChatbox from "@/app/(components)/UserChatbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Chats() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchConnections = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/connection`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch connections");
      }
      const data = await response.json();
      setConnections(data.connections);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-[30rem]">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900" />
        </div>
      ) : (
        <div className="flex flex-col h-[80%] rounded-lg border my-4">
          <div className="flex flex-1 overflow-hidden">
            <div className="w-1/3 border-r py-4 px-1 flex flex-col gap-2 overflow-hidden">
              {connections.map((connection) => (
                <Button
                  onClick={() => setSelectedUser(connection)}
                  variant="ghost"
                  key={connection._id}
                  className="flex h-14 justify-start gap-4"
                >
                  <div className="hidden md:block w-10 h-10 relative">
                    <Image
                      alt="User avatar"
                      className="rounded-full"
                      height="48"
                      src={connection.profilePic}
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

            {selectedUser ? (
              <div className="min-w-[240px] md:min-w-[750px]">
                <UserChatbox selectedUser={selectedUser} />
              </div>
            ) : (
              <div className="flex flex-wrap justify-center py-16 min-w-[240px] md:min-w-[750px]">
                <p>Click to start conversation</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
