"use client";
import GroupChatbox from "@/app/(components)/GroupChatbox";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { IoArrowBackCircleSharp } from "react-icons/io5";
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
      console.log(data.groups);
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
        <div className="px-16">
          {isRoomSelected ? (
            <>
              <IoArrowBackCircleSharp
                className="h-10 w-10"
                onClick={() => setIsRoomSelected(false)}
              />
              <GroupChatbox roomID={roomID} />
            </>
          ) : (
            <div>
              <h1 className="text-center mt-4 font-semibold text-3xl">
                Joined Discussion
              </h1>

              {groups.map((group) => (
                <div key={group._id} className="my-2">
                  <Button
                    onClick={() => {
                      setRoomID(group._id);
                      setIsRoomSelected(true);
                    }}
                  >
                    {group.name}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Page;
