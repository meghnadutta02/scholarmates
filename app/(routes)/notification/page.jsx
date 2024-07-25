"use client";
import TimeAgo from "javascript-time-ago";
import Image from "next/image";
import ReactTimeAgo from "react-time-ago";
import React, { useEffect } from "react";
import Link from "next/link";
import en from "javascript-time-ago/locale/en";
import { toast } from "react-toastify";
import ru from "javascript-time-ago/locale/ru";
import { useSession } from "@/app/(components)/SessionProvider";
import { Button } from "@/components/ui/button";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

const Page = () => {
  const {
    session,
    notifications,
    clearUnreadCount,
    setNotifications,
    allNotificationsSeen,
    setAllNotificationsSeen,
  } = useSession();

  const deleteAllNotifications = async () => {
    if (session?.db_id && notifications.length > 0) {
      const notificationIds = notifications.map((n) =>
        n._id ? n._id : n.notificationId
      );

      try {
        const resp = await fetch(
          `${process.env.NEXT_PUBLIC_NODE_SERVER}/notification/delete-notifications/${session.db_id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ notificationIds }),
          }
        );
        if (resp.ok) {
          clearUnreadCount();
          setNotifications([]);
          toast.success("All notifications cleared successfully", {
            autoClose: 4000,
            closeOnClick: true,
          });
        }
      } catch (error) {
        console.error("Failed to mark notifications as seen", error);
      }
    }
  };

  useEffect(() => {
    const markAllAsSeen = async () => {
      if (session?.db_id && notifications.length > 0) {
        const notificationIds = notifications
          .filter((n) => n.isSeen === false || typeof n.isSeen === "undefined")
          .map((n) => (n._id ? n._id : n.notificationId));
        try {
          const resp = await fetch(
            `${process.env.NEXT_PUBLIC_NODE_SERVER}/notification/mark-as-seen/${session.db_id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ notificationIds }),
            }
          );
          if (resp.ok) {
            clearUnreadCount();
            setNotifications((prev) =>
              prev.map((n) => ({ ...n, isSeen: true }))
            );
          }
        } catch (error) {
          console.error("Failed to mark notifications as seen", error);
        }
      }
    };

    if (!allNotificationsSeen) {
      markAllAsSeen();
      setAllNotificationsSeen(true);
    }
  }, [
    session?.db_id,
    notifications,
    setNotifications,
    clearUnreadCount,
    allNotificationsSeen,
    setAllNotificationsSeen,
  ]);

  const handleClose = async (index, item) => {
    try {
      const id = item.notificationId || item._id;
      if (!id) {
        console.log("No Id present");
      }
      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_NODE_SERVER}/notification/remove/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (resp.ok) {
        setNotifications((prev) => prev.filter((_, i) => i !== index));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="md:mt-7 mt-4 w-full mx-auto md:w-[85%]">
      {notifications.length === 0 ? (
        <div className="flex items-center justify-center">
          <p className="sm:text-lg text-md text-gray-500 dark:text-gray-400">
            You have caught up with everything!
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex justify-end gap-2 items-center md:mt-4 mt-3 ">
            <Button
              className="rounded-md accent-zinc-700"
              onClick={deleteAllNotifications}
            >
              Clear All
            </Button>
          </div>

          {notifications.map((item, index) => (
            <div
              key={index}
              className="md:p-2 p-1 bg-white border font-sans border-gray-200 rounded-md shadow dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 my-auto "
            >
              <div className="inline my-auto ">
                <div className="flex flex-row items-start gap-2 justify-between">
                  <Link
                    href={
                      item.status === "discussNotify"
                        ? `/discussions/${item.discussionId}`
                        : item.status === "joinRequestAccepted"
                        ? "/chats"
                        : "/requests"
                    }
                    className="flex gap-2 justify-start items-center"
                  >
                    <div className="text-center mt-1">
                      <Image
                        src={item.profilePic}
                        alt={item.sendername}
                        width={36}
                        height={36}
                        style={{
                          aspectRatio: "36/36",
                          objectFit: "cover",
                        }}
                        className="rounded-full"
                      />
                    </div>
                    <p className="text-xs sm:text-sm lg:text-lg font-semibold text-gray-900 dark:text-white">
                      {item.sendername}{" "}
                      {[
                        "requestSend",
                        "requestaccept",
                        "discussNotify",
                        "joinRequest",
                        "joinRequestAccepted",
                      ].includes(item.status) && <span> {item.message}.</span>}
                    </p>
                  </Link>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white"
                    aria-label="Close"
                    onClick={() => handleClose(index, item)}
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
