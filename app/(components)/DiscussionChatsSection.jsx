"use client";
import GroupChatbox from "@/app/(components)/GroupChatbox";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Spinnersvg from "@/public/Spinner.svg";
import Link from "next/link";

const Page = () => {
  const [roomID, setRoomID] = useState("");
  const [isRoomSelected, setIsRoomSelected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);

  const fetchGroups = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/groups`
      );
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

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div className="flex flex-col w-full">
      {loading ? (
        <div className="flex justify-center items-center z-50">
          <Image src={Spinnersvg} alt="Loading..." className="h-28" />
        </div>
      ) : (
        <div className="flex flex-col min-h-[30rem] rounded-lg border-2 my-4 font-sans">
          <div className="flex flex-1">
            {groups.length > 0 ? (
              <div className="w-1/3 border-r-2 py-2 px-1 flex flex-col gap-2 overflow-hidden">
                {groups.map((group) => (
                  <div key={group._id} className="">
                    <Button
                      onClick={() => {
                        setRoomID(group._id);
                        setIsRoomSelected(true);
                      }}
                      variant="ghost"
                      className={`flex h-12 w-full justify-start bg-gray-100 dark:bg-gray-800 hover:bg-gray-300 truncate ${
                        roomID === group._id ? "bg-gray-300" : ""
                      }`}
                    >
                      {group.name}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full py-16">
                <p className="text-lg text-gray-500 dark:text-gray-400 mb-4">
                  You haven't started any discussions yet.
                </p>
                <Link
                  href="/discussions"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 bg-gray-700 transition-all hover:bg-gray-900 dark:bg-gray-400 dark:hover:bg-gray-50 text-white "
                >
                  Start a discussion
                </Link>
              </div>
            )}

            {isRoomSelected ? (
              <div className="min-w-[240px] md:w-[790px]">
                <GroupChatbox key={roomID} roomID={roomID} />
              </div>
            ) : (
              groups.length > 0 && (
                <div className="flex flex-wrap justify-center items-center py-16 min-w-[240px] md:w-[790px]">
                  <p>Choose a conversation</p>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
