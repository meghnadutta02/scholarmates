"use client";
import UserChatbox from "@/app/(components)/UserChatbox";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { useState, useEffect } from "react";
import DiscussionChatsSection from "@/app/(components)/DiscussionChatsSection";
import Link from "next/link";
import Spinnersvg from "@/public/Spinner.svg";

export default function Chats() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggleChatView, setToggleChatView] = useState(true);

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
        <div className="flex justify-center items-center z-50">
          <Image src={Spinnersvg} alt="Loading..." className="h-28" />
        </div>
      ) : (
        <Tabs defaultValue="c" className="mt-6 flex flex-col items-center">
          <TabsList>
            <TabsTrigger value="c">Connections</TabsTrigger>
            <TabsTrigger value="g">Groups</TabsTrigger>
          </TabsList>
          <TabsContent value="c">
            {connections.length > 0 ? (
              <div className="flex flex-col min-h-[32rem] rounded-lg border my-4">
                <div className="flex flex-1 max-h-[32rem] min-w-[300px]">
                  {toggleChatView ? (
                    <div className="min-w-[320px] sm:min-w-[480px]: md:min-w-[720px] px-1 flex flex-col overflow-y-auto scrollbar-thin">
                      {connections.map((connection) => (
                        <div
                          key={connection._id}
                          className="border-b py-2 hover:bg-gray-100"
                        >
                          <Button
                            onClick={() => {
                              setSelectedUser(connection);
                              setToggleChatView(false);
                            }}
                            variant="icon"
                            className="flex h-12 w-full justify-start gap-4"
                          >
                            <div className=" w-10 h-10 relative">
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
                              <h1 className="font-semibold">
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
                  ) : (
                    <>
                      {selectedUser ? (
                        <div className="min-w-[320px] sm:min-w-[480px]: md:min-w-[720px]">
                          <UserChatbox
                            key={selectedUser._id}
                            selectedUser={selectedUser}
                            setToggleChatView={setToggleChatView}
                          />
                        </div>
                      ) : (
                        <div className="flex flex-wrap justify-center py-16 min-w-[240px] md:min-w-[790px]">
                          <p>Choose conversation</p>
                        </div>
                      )}
                    </>
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
