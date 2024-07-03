"use client";
import TimeAgo from "javascript-time-ago";
import ReactTimeAgo from "react-time-ago";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import en from "javascript-time-ago/locale/en";
import ru from "javascript-time-ago/locale/ru";
import { useSession } from "@/app/(components)/SessionProvider";
TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

const Page = () => {
  const { notification, clearUnreadCount } = useSession();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    clearUnreadCount();
    setNotifications(notification);
  }, [notification, clearUnreadCount]);

  const handleClose = (index) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="md:mt-7 mt-4 w-full mx-auto md:w-[85%]">
      {notifications.length === 0 ? (
        <p className="flex justify-center md:text-lg text-md font-semibold font-sans">
          You have caught up with everything.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {notifications.map((item, index) => (
            <div
              key={index}
              className="md:p-3 p-1  bg-white border font-sans border-gray-200 rounded-md shadow dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
            >
              <div className="flex items-center justify-between mb-1">
                <Link href="/requests">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {item.sendername}{" "}
                  </span>
                  <span>sent a connection request.</span>
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

              <span className="text-xs text-gray-700 ">
                <ReactTimeAgo date={item.timestamp} locale="en-US" />
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;
