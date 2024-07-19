"use client";
import TimeAgo from "javascript-time-ago";
import Image from "next/image";
import ReactTimeAgo from "react-time-ago";
import React, { useEffect } from "react";
import Link from "next/link";
import en from "javascript-time-ago/locale/en";
import ru from "javascript-time-ago/locale/ru";
import { useSession } from "@/app/(components)/SessionProvider";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

const Page = () => {
  const { notification, clearUnreadCount, setNotification } = useSession();

  const sortByTimestamp = (array) => {
    return array.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  useEffect(() => {
    clearUnreadCount();

    const sortedNotifications = sortByTimestamp(notification);
    setNotification(sortedNotifications);
  }, [notification, clearUnreadCount, setNotification]);

  const handleClose = (index) => {
    setNotification((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="md:mt-7 mt-4 w-full mx-auto md:w-[85%]">
      {notification.length === 0 ? (
        <div className="flex items-center justify-center">
          <p className="text-lg text-gray-500 dark:text-gray-400">
            You have caught up with everything!
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {notification.map((item, index) => (
            <div
              key={index}
              className="md:p-2 p-1 bg-white border font-sans border-gray-200 rounded-md shadow dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 my-auto"
            >
              <div className="flex flex-row items-center justify-between">
                <Link
                  href={
                    item.status === "discussNotify"
                      ? `/discussions/${item.discussionId}`
                      : "/requests"
                  }
                  className="flex items-center"
                >
                  <Image
                    src={item.profilePic}
                    alt={item.sendername}
                    width={36}
                    height={36}
                    style={{
                      aspectRatio: "32/32",
                      objectFit: "cover",
                    }}
                    className="rounded-full mr-2"
                  />
                  <span className="font-semibold text-gray-900 mr-1 dark:text-white">
                    {item.sendername}{" "}
                  </span>
                  {item.status === "requestSend" && (
                    <span>sent a connection request.</span>
                  )}
                  {["requestaccept", "discussNotify", "joinRequest"].includes(
                    item.status
                  ) && <span> {item.message}.</span>}
                </Link>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white"
                  aria-label="Close"
                  onClick={() => handleClose(index)}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <span className="text-xs text-gray-700 flex justify-end">
                {item.timestamp ? (
                  <ReactTimeAgo
                    date={new Date(item.timestamp)}
                    locale="en-US"
                  />
                ) : (
                  "Invalid date"
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;
