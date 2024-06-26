"use client";
import UserChatbox from "@/app/(components)/UserChatbox";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { useState, useEffect } from "react";
import DiscussionChatsSection from "@/app/(components)/DiscussionChatsSection";
import Link from "next/link"; // Import Link for navigation

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
        <Tabs defaultValue="c" className="mt-6 flex flex-col items-center">
          <TabsList>
            <TabsTrigger value="c">Connections</TabsTrigger>
            <TabsTrigger value="g">Groups</TabsTrigger>
          </TabsList>
          <TabsContent value="c">
            {connections.length > 0 ? (
              <div className="flex flex-col min-h-[30rem] rounded-lg border my-4">
                <div className="flex flex-1">
                  <div className="w-1/3 border-r py-4 px-1 flex flex-col gap-2 overflow-hidden">
                    {connections.map((connection) => (
                      <div key={connection._id} className="border-b pb-1">
                        <Button
                          onClick={() => setSelectedUser(connection)}
                          variant="ghost"
                          className="flex h-12 w-full justify-start gap-4"
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
                      </div>
                    ))}
                  </div>

                  {selectedUser ? (
                    <div className="min-w-[240px] md:min-w-[790px]">
                      <UserChatbox
                        key={selectedUser._id}
                        selectedUser={selectedUser}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-wrap justify-center py-16 min-w-[240px] md:min-w-[790px]">
                      <p>Choose conversation</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full mt-5">
                <p className="text-lg text-gray-500 dark:text-gray-400 mb-4">
                  You have no connections.
                </p>
                <Link
                  href="/connect"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 bg-gray-700 transition-all hover:bg-gray-900 dark:bg-gray-400 dark:hover:bg-gray-50 text-white "
                >
                  Find Connections
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="g" className="w-full ">
            <DiscussionChatsSection />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
