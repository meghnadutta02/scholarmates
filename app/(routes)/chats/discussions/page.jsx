"use client";
import GroupChatbox from "@/app/(components)/GroupChatbox";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { IoArrowBackCircleSharp } from "react-icons/io5";

const groups = [
  {
    id: 1,
    name: "Group 1",
    image:
      "https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg",
    last_message: "Hello there!",
    creator: "john doe",
  },
  {
    id: 2,
    name: "Group 2",
    image:
      "https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg",
    last_message: "How are you doing?",
    creator: "alice",
  },
  {
    id: 3,
    name: "Group 3",
    image:
      "https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg",
    last_message: "See you later!",
    creator: "bob",
  },
  {
    id: 4,
    name: "Group 4",
    image:
      "https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg",
    last_message: "Can you send me the file?",
    creator: "jane doe",
  },
  {
    id: 5,
    name: "Group 5",
    image:
      "https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg",
    last_message: "I'll be there in 5 minutes.",
    creator: "james bond",
  },
];

const Page = () => {
  const [roomID, setRoomID] = useState("");
  const [isRoomSelected, setIsRoomSelected] = useState(false);

  return (
    <div className="flex flex-col  w-full">
      <h1 className="text-center mt-4 font-semibold text-3xl">
        Joined Discussion
      </h1>
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
            GET the users discussions (test 1, 2 or 3)
            {groups.map((group) => (
              <div key={group.id} className="my-2">
                <Button
                  onClick={() => {
                    setRoomID(group.id);
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
    </div>
  );
};

export default Page;
