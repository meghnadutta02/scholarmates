"use client";
import GroupChatbox from "@/app/(components)/GroupChatbox";
import GroupsInboxSearch from "@/app/(components)/GroupsInboxSearch";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import Loading from "@/app/(components)/Loading";
import Link from "next/link";

const Page = ({ selectDiscussion }) => {
  const [roomID, setRoomID] = useState("");
  const [isRoomSelected, setIsRoomSelected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const [toggleChatView, setToggleChatView] = useState(true);

  const fetchGroups = async () => {
    try {
      const response = await fetch(`/api/chats/group`);
      if (!response.ok) {
        throw new Error("Failed to fetch requests");
      }
      const data = await response.json();
      setGroups(data.groups);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleGroupSelection = async (gid) => {
    setRoomID(gid);
    setIsRoomSelected(true);
    setToggleChatView(false);
    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.groupId === gid ? { ...group, unreadCount: 0 } : group
      )
    );
    updateReadStatus(gid);
  };

  const updateLastMessage = (gid, message, name) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.groupId === gid
          ? {
              ...group,
              latestMessage: {
                ...group.latestMessage,
                text: message,
                senderName: name,
                time: new Date().getTime(),
              },
            }
          : group
      )
    );
  };

  useEffect(() => {
    fetchGroups();
    // if (selectDiscussion) {
    //   handleGroupSelection(selectDiscussion);
    // }
  }, []);

  return (
    <div className="flex flex-col">
      {loading ? (
        <Loading />
      ) : (
        <div>
          <GroupsInboxSearch
            setRoomID={setRoomID}
            setToggleChatView={setToggleChatView}
          />
          <div>
            {groups.length > 0 ? (
              <div className="flex flex-col rounded-b-lg border">
                <div className="flex flex-1">
                  {toggleChatView ? (
                    <div className="min-w-[340px] sm:min-w-[480px] md:min-w-[750px] h-[32rem] px-1 flex flex-col gap-2 overflow-y-auto scrollbar-thin">
                      {groups.map((group) => (
                        <div
                          key={group.groupId}
                          className="border-b py-2 hover:bg-gray-100"
                        >
                          <Button
                            onClick={() => handleGroupSelection(group.groupId)}
                            variant="icon"
                            className="flex h-12 w-full justify-between items-center truncate"
                          >
                            <div className="flex flex-col items-start">
                              <p className="text-base font-semibold">
                                {group.groupName}
                              </p>
                              {group.latestMessage && (
                                <p className="text-gray-800 text-[13px] max-w-[200px] md:max-w-[400px] truncate">
                                  {group.latestMessage?.senderName}
                                  {group.latestMessage.text && " : "}
                                  {group.latestMessage?.text}{" "}
                                </p>
                              )}
                            </div>

                            <div className="flex gap-3 text-xs font-normal">
                              {group.unreadCount > 0 && (
                                <div className="relative inline-block">
                                  <p
                                    className="font-bold text-white rounded-full shadow-sm shadow-blue-300 bg-blue-800 flex items-center justify-center"
                                    style={{
                                      width: "1.5rem",
                                      height: "1.5rem",
                                      lineHeight: "1.5rem",
                                    }}
                                  >
                                    {group.unreadCount}
                                  </p>
                                </div>
                              )}
                              {group.latestMessage.time && (
                                <p>
                                  {new Date(
                                    group.latestMessage?.time
                                  ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              )}
                            </div>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      {isRoomSelected ? (
                        <div className="min-h-[34rem] min-w-[340px] sm:min-w-[480px] md:min-w-[750px]">
                          <GroupChatbox
                            key={roomID}
                            roomID={roomID}
                            setGroups={setGroups}
                            setIsRoomSelected={setIsRoomSelected}
                            setRoomID={setRoomID}
                            setToggleChatView={setToggleChatView}
                            updateLastMessage={updateLastMessage}
                          />
                        </div>
                      ) : (
                        <div className="flex flex-wrap justify-center py-16 min-w-[240px] md:min-w-[750px]">
                          <p>Choose a conversation</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full py-16">
                <p className="text-lg text-gray-500 dark:text-gray-400 mb-4">
                  You haven&apos;t started any discussions yet.
                </p>
                <Link
                  href="/discussions"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 bg-gray-700 transition-all hover:bg-gray-900 dark:bg-gray-400 dark:hover:bg-gray-50 text-white "
                >
                  Start a discussion
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
