"use client";
import React, { useState, useEffect } from "react";
import { FaTimes, FaCheck } from "react-icons/fa";
import { toast } from "react-toastify";
import Image from "next/image";

const Notification = ({ sender, receive, name, frndId, user, data }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(false);

  const [isConnected, setIsConnected] = useState(false);

  const acceptHandle = async (action) => {
    setLoading(true);
    try {
      if (sender && receive) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_NODE_SERVER}/sendconnection/receive`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              friendshipId: data?._id,
              userId: data?.requestTo,
              action: action,
            }),
            cache: "no-cache",
          }
        );

        if (res.status === 200) {
          toast.success(
            action === "accept" ? "Request accepted" : "Request declined"
          );

          setIsVisible(false);
          if (action === "accept") {
            setIsConnected(true);
          }
        } else {
          throw new Error("Failed to update request");
        }
      } else {
        console.log("NO SENDER AND RECEIVER ID'S PRESENT");
      }
    } catch (error) {
      console.error(error.message);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const profile = (id) => {
    alert(id);
  };

  return (
    <>
      {isVisible && (
        <div className="flex w-full justify-between items-center rounded-md shadow md:px-3 px-[6px]  md:py-4 py-2 md:text-base text-[14px]">
          <div className="flex items-center font-sans">
            <Image
              src={user?.profilePic}
              alt={user?.name}
              width={36}
              height={36}
              style={{
                        aspectRatio: "32/32",
                        objectFit: "cover",
                      }}
              className="rounded-full mr-2"
            />
            <div className="cursor-pointer" onClick={() => profile(user?._id)}>
              <span className="font-semibold">{user?.name}</span> has sent you a
              connection request.
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => acceptHandle("accept")}
              className=" p-1 transform transition-transform hover:scale-125"
              disabled={loading}
            >
              <FaCheck className="h-4 w-4" />
            </button>
            <button
              onClick={() => acceptHandle("decline")}
              className="p-1 transform transition-transform hover:scale-125"
              disabled={loading}
            >
              <FaTimes className="h-[17px] w-[17px]" />
            </button>
          </div>
        </div>
      )}
      {isConnected && (
        <div className="flex w-full justify-between items-center rounded-md shadow md:px-3 px-[6px]  md:py-4 py-2 md:text-base text-[14px]">
          <div className="flex items-center font-sans">
            <Image
              src={user?.profilePic}
              alt={user?.name}
              width={36}
              height={36}
              className="rounded-full mr-2"
            />
            <div>
              <span className="font-semibold">{user?.name}</span> is now a
              connection.
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Notification;
