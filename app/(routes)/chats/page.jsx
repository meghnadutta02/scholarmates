"use client";
import UserChatbox from "@/app/(components)/UserChatbox";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { useState, useEffect } from "react";
import DiscussionChatsSection from "@/app/(components)/DiscussionChatsSection";
import UserInboxSearch from "@/app/(components)/UserInboxSearch";
import Link from "next/link";
import Loading from "@/app/(components)/Loading";

export default function Chats() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggleChatView, setToggleChatView] = useState(true);

  const fetchConnections = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chats/user`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch connections");
      }
      const data = await response.json();
      setConnections(data.messages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
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

  const handleUserSelection = async (user) => {
    setSelectedUser(user);
    setToggleChatView(false);
    setConnections((prevConnections) =>
      prevConnections.map((connection) =>
        connection.userId === user.userId
          ? { ...connection, unreadMessagesCount: 0, unreadMessages: [] }
          : connection
      )
    );
    markMessagesAsRead(user.userId);
  };

  const updateLastMessage = (userId, message) => {
    setConnections((prevConnections) =>
      prevConnections.map((connection) =>
        connection.userId === userId
          ? { ...connection, lastMessageText: message }
          : connection
      )
    );
  };

  useEffect(() => {
    fetchConnections();
    updateLastMessage();
  }, []);

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <Tabs defaultValue="c" className="mt-6 flex flex-col items-center">
          <TabsList>
            <TabsTrigger value="c">Connections</TabsTrigger>
            <TabsTrigger value="g">Groups</TabsTrigger>
          </TabsList>
          <TabsContent value="c">
            <div className="relative">
              <div className="absolute top-0 left-0 right-0 z-10">
                <UserInboxSearch
                  setSelectedUser={setSelectedUser}
                  setToggleChatView={setToggleChatView}
                />
              </div>
              <div className="pt-12">
                {connections.length > 0 ? (
                  <div className="flex flex-col min-h-[32rem] rounded-b-lg border my-4">
                    <div className="flex flex-1 max-h-[32rem] min-w-[300px]">
                      {toggleChatView ? (
                        <div className="min-w-[320px] sm:min-w-[480px] md:min-w-[720px] px-1 flex flex-col overflow-y-auto scrollbar-thin">
                          {connections.map((connection) => (
                            <div
                              key={connection.userId}
                              className="border-b py-2 hover:bg-gray-100"
                            >
                              <Button
                                onClick={() => handleUserSelection(connection)}
                                variant="icon"
                                className="flex h-12 w-full justify-between gap-4"
                              >
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
                                <div className="flex flex-wrap w-full items-center justify-between">
                                  <h2 className="font-semibold lg:text-base">
                                    {connection.userName}
                                  </h2>
                                  <div className="flex w-full items-center justify-between">
                                    <div>
                                      <>{connection.lastMessageText}</>
                                    </div>

                                    <div className="font-normal text-xs ">
                                      {connection.unreadMessagesCount > 0 && (
                                        <span className="font-bold mr-2 text-white rounded-full shadow-sm py-1 mt-1 px-2 shadow-blue-300  bg-blue-800">
                                          {connection.unreadMessagesCount}
                                        </span>
                                      )}
                                      {new Date(
                                        connection.lastMessageTime
                                      ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </div>
                                  </div>
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
                                key={selectedUser.userId}
                                selectedUser={selectedUser}
                                setToggleChatView={setToggleChatView}
                                updateLastMessage={updateLastMessage}
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
              </div>
            </div>
          </TabsContent>

          <TabsContent value="g" className="w-full">
            <DiscussionChatsSection />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
