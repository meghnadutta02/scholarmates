"use client";
import GroupChatbox from "@/app/(components)/GroupChatbox";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Spinnersvg from "@/public/Spinner.svg";

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
    <div className="flex flex-col  w-full">
      {loading ? (
        <div className="flex justify-center items-center  z-50">
          <Image src={Spinnersvg} alt="Loading..." className="h-28" />
        </div>
      ) : (
        <div className="flex flex-col min-h-[30rem] rounded-lg border my-4">
          <div className="flex flex-1">
            <div className="w-1/3 border-r py-2 px-1 flex flex-col gap-2 overflow-hidden">
              {groups.map((group) => (
                <div key={group._id} className=" border-b">
                  <Button
                    onClick={() => {
                      setRoomID(group._id);
                      setIsRoomSelected(true);
                    }}
                    variant="ghost"
                    className="flex h-12 w-full justify-start"
                  >
                    {group.name}
                  </Button>
                </div>
              ))}
            </div>

            {isRoomSelected ? (
              <div className="min-w-[240px] md:min-w-[750px]">
                <GroupChatbox key={roomID} roomID={roomID} />
              </div>
            ) : (
              <div className="flex flex-wrap justify-center py-16 min-w-[240px] md:min-w-[750px]">
                <p>Choose conversation</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
