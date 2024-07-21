"use client";
import React, { useState } from "react";
import { FaTimes, FaCheck } from "react-icons/fa";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

const Notification = ({
  sender,
  receive,
  name,
  frndId,
  user,
  data,
  status,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(false);

  const [isConnected, setIsConnected] = useState(false);
  const { data: session, update } = useSession();

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
            update({
              connection: [...session.user.connection, sender],
            });
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

  return (
    <>
      {isVisible && status == false && (
        <div className="flex w-full justify-between items-center rounded-md shadow md:px-3 px-[6px]  md:py-4 py-2 sm:text-base text-[14px]">
          <Link href={`/profile/${user?._id}`}>
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
              <div className="cursor-pointer">
                <span className="font-semibold">{user?.name}</span> has sent you
                a connection request.
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => acceptHandle("accept")}
              className="flex items-center p-1"
              disabled={loading}
            >
              <FaCheck className="h-4 w-4 text-green-500 transform transition-transform hover:scale-125" />
            </button>
            <button
              onClick={() => acceptHandle("decline")}
              className="flex items-center p-1"
              disabled={loading}
            >
              <FaTimes className="h-[17px] w-[17px] text-red-500 transform transition-transform hover:scale-125" />
            </button>
          </div>
        </div>
      )}
      {isConnected && (
        <div className="flex w-full justify-between items-center rounded-md shadow md:px-3 px-[6px]  md:py-4 py-2 sm:text-base text-[14px]">
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
