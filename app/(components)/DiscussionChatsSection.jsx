"use client";
import GroupChatbox from "@/app/(components)/GroupChatbox";
import GroupsInboxSearch from "@/app/(components)/GroupsInboxSearch";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Loading from "@/app/(components)/Loading";
import Link from "next/link";
import FormatDate from "../utils/FormatDate";

const Page = ({ selectDiscussion, socket }) => {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const [toggleChatView, setToggleChatView] = useState(true);
  const linktoChatRef = useRef("");

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

  const handleGroupSelection = useCallback(
    async (grp) => {
      setSelectedGroup(grp);
      if (socket && toggleChatView === true) {
        socket.emit("groupchat-setup", grp.groupId);
      }
      linktoChatRef.current = grp.groupId;
      setToggleChatView(false);
      setGroups((prevGroups) =>
        prevGroups.map((group) =>
          group.groupId === grp.groupId ? { ...group, unreadCount: 0 } : group
        )
      );
      // updateReadStatus(grp.groupId);
    },
    [socket, toggleChatView]
  );

  const updateLastMessage = (gid, message, name) => {
    setGroups((prevGroups) => {
      const updatedGroups = prevGroups.map((group) =>
        group.groupId === gid
          ? {
              ...group,
              latestMessage: {
                ...group.latestMessage,
                text: message,
                senderName: name,
                time: new Date().getTime(),
              },
              unreadCount: 0,
            }
          : group
      );
      updatedGroups.sort(
        (a, b) =>
          new Date(b.latestMessage.time) - new Date(a.latestMessage.time)
      );
      return updatedGroups;
    });
  };
  const handleNewMessage = (data) => {
    setGroups((prevGroups) => {
      const updatedGroups = prevGroups.map((group) =>
        group.groupId === data.roomID
          ? {
              ...group,
              latestMessage: {
                ...group.latestMessage,
                text: data.message.text,
                senderName: data.message.senderName,
                time: data.message.createdAt,
              },
              unreadCount: group.unreadCount + 1,
            }
          : group
      );

      updatedGroups.sort(
        (a, b) =>
          new Date(b.latestMessage.time) - new Date(a.latestMessage.time)
      );

      return updatedGroups;
    });
  };

  useEffect(() => {
    fetchGroups();
    updateLastMessage();
    if (socket) {
      socket.on("groupchat-inbox", handleNewMessage);
    }

    // if (selectDiscussion) {
    //   handleGroupSelection(selectDiscussion);
    // }
    return () => {
      if (socket) {
        socket.off("groupchat-inbox", handleNewMessage);
      }
    };
  }, [socket]);

  return (
    <div className="flex flex-col">
      {loading ? (
        <Loading />
      ) : (
        <div>
          {toggleChatView && (
            <GroupsInboxSearch
              setSelectedGroup={setSelectedGroup}
              setToggleChatView={setToggleChatView}
            />
          )}
          <div>
            {groups.length > 0 ? (
              <div className="flex flex-col rounded-b-lg border">
                <div className="flex flex-1">
                  {toggleChatView ? (
                    <div className="min-w-[372px] sm:min-w-[480px] md:min-w-[750px] h-[32rem] px-1 flex flex-col gap-2 overflow-y-auto scrollbar-thin">
                      {groups.map((group) => (
                        <div
                          key={group.groupId}
                          className="border-b py-2 hover:bg-gray-100"
                        >
                          <Button
                            onClick={() => handleGroupSelection(group)}
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

                            <div className="items-end font-normal text-xs flex flex-col gap-1">
                              {group.latestMessage.time && (
                                <span>
                                  <FormatDate
                                    lastMessageTime={group.latestMessage?.time}
                                  />
                                </span>
                              )}
                              {group.unreadCount > 0 && (
                                <div className="font-bold w-5 h-5 text-white rounded-full shadow-sm shadow-blue-300  bg-blue-600">
                                  <p className="mt-0.5">{group.unreadCount}</p>
                                </div>
                              )}
                            </div>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="min-h-[34rem] min-w-[372px] sm:min-w-[480px] md:min-w-[750px]">
                      <GroupChatbox
                        key={selectedGroup.groupId || linktoChatRef.current}
                        selectedGroup={selectedGroup || linktoChatRef.current}
                        setGroups={setGroups}
                        setSelectedGroup={setSelectedGroup}
                        setToggleChatView={setToggleChatView}
                        updateLastMessage={updateLastMessage}
                        updateReadStatus={updateReadStatus}
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-start w-full px-4 min-w-[372px] sm:min-w-[480px] md:min-w-[750px] h-[32rem] border">
                <p className="text-lg text-gray-500 dark:text-gray-400 my-12">
                  You haven&apos;t started or joined any discussions yet.
                </p>
                <Link
                  href="/discussions"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 bg-gray-700 transition-all hover:bg-gray-900 dark:bg-gray-400 dark:hover:bg-gray-50 text-white "
                >
                  Go to discussions
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
