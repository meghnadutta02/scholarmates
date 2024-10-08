"use client";
import React, { useCallback, useState } from "react";
import { FaTimes, FaCheck } from "react-icons/fa";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useSession as useCustomSession } from "./SessionProvider";

const Notification = ({ requestData, setRequestData }) => {
  const [loading, setLoading] = useState(false);
  const { data: session, update } = useSession();
  const { handleNotificationRemoval } = useCustomSession();

  const updateConnectionReqList = async (id, action) => {
    if (action === "accept") {
      setRequestData((prevData) =>
        prevData.map((item) =>
          item.requestData._id === id
            ? { ...item, requestData: { ...item.requestData, accepted: true } }
            : item
        )
      );
    } else {
      setRequestData((prevData) =>
        prevData.filter((item) => item.requestData._id !== id)
      );
    }
  };

  const actionHandler = async (action, data) => {
    setLoading(true);
    try {
      if (action && data) {
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
            action === "accept" ? "Request accepted" : "Request declined",
            {
              autoClose: 4000,
              closeOnClick: true,
            }
          );

          updateConnectionReqList(data._id, action);
          const result = await res.json();

          handleNotificationRemoval(result);
        } else {
          toast.error("Failed to update request");
        }
      } else {
        toast.error("Invalid request");
      }
    } catch (error) {
      console.error(error.message);
      toast.error("An error occurred", {
        autoClose: 4000,
        closeOnClick: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-2 w-full">
      {requestData.length === 0 ? (
        <div className="flex items-center justify-center">
          <p className="text-lg text-gray-500 dark:text-gray-400 ">
            You have no connection requests.
          </p>
        </div>
      ) : (
        requestData.map((item, index) => (
          <div key={index}>
            {!item.requestData.accepted && (
              <div className="flex w-full justify-between items-center rounded-md shadow md:px-3 px-[6px]  md:py-4 py-2 sm:text-base text-[14px]">
                <Link href={`/profile/${item?.userData?._id}`}>
                  <div className="flex items-center font-sans">
                    <Image
                      src={item?.userData?.profilePic}
                      alt={item?.userData?.name}
                      width={36}
                      height={36}
                      style={{
                        aspectRatio: "32/32",
                        objectFit: "cover",
                      }}
                      className="rounded-full mr-2"
                    />
                    <div className="cursor-pointer">
                      <span className="font-semibold">
                        {item?.userData?.name}
                      </span>{" "}
                      has sent you a connection request.
                    </div>
                  </div>
                </Link>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => actionHandler("accept", item.requestData)}
                    className="flex items-center p-2 border hover:border-green-400 shadow-md rounded-md transform transition-transform hover:scale-125"
                    disabled={loading}
                  >
                    <FaCheck className="h-4 w-4 text-green-500 " />
                  </button>
                  <button
                    onClick={() => actionHandler("decline", item.requestData)}
                    className="flex items-center p-2 border hover:border-red-400 shadow-md rounded-md transform transition-transform hover:scale-125"
                    disabled={loading}
                  >
                    <FaTimes className="h-[17px] w-[17px] text-red-500" />
                  </button>
                </div>
              </div>
            )}
            {item.requestData.accepted && (
              <div className="flex w-full justify-between items-center rounded-md shadow md:px-3 px-[6px]  md:py-4 py-2 sm:text-base text-[14px]">
                <div className="flex items-center font-sans">
                  <Image
                    src={item?.userData?.profilePic}
                    alt={item?.userData?.name}
                    width={36}
                    height={36}
                    className="rounded-full mr-2"
                  />
                  <div>
                    <span className="font-semibold">
                      {item?.userData?.name}
                    </span>{" "}
                    is now a connection.
                  </div>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Notification;
