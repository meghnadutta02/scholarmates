"use client";
import TimeAgo from "javascript-time-ago";
import Image from "next/image";
import ReactTimeAgo from "react-time-ago";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import en from "javascript-time-ago/locale/en";
import ru from "javascript-time-ago/locale/ru";
import { useSession } from "@/app/(components)/SessionProvider";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

const Page = () => {
  const { session, notification, clearUnreadCount, setNotification } = useSession();
  const [notifications, setNotifications] = useState([]);

  const removeDuplicates = (array) => {
    const uniqueSet = new Map();
    array.forEach(item => {
      const id = item.notificationId || item._id;
      uniqueSet.set(id, item);
    });
    return Array.from(uniqueSet.values());
  };

// ALL THE NOTIFICATION CAME FROM BACKEND ALLREADY SORTED ,THIS ONLY SORT THE NOTIFICATION 
//CAME FROM SOCKET

  const sortByTimestamp = (array) => {
    return array.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  useEffect(() => {
    const markAllAsSeen = async () => {
      if (session?.db_id && notification.length > 0) {
        const notificationIds = notification.map(n => n.notificationId);
        try {
          const resp = await fetch(`${process.env.NEXT_PUBLIC_NODE_SERVER}/notification/markaseen/${session.db_id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ notificationIds }),
          });
          if (resp.ok) {
            const data = await resp.json();
            console.log("Marked as seen:", data);
            clearUnreadCount();
          }
        } catch (error) {
          console.error('Failed to mark notifications as seen', error);
        }
      }
    };

    markAllAsSeen();
  }, [session?.db_id, notification, clearUnreadCount]);

  useEffect(() => {
    const getAllNotifications = async () => {
      if (session?.db_id) {
        try {
          const resp = await fetch(`${process.env.NEXT_PUBLIC_NODE_SERVER}/notification/getnotification/${session.db_id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          });
          if (resp.ok) {
            const data = await resp.json();
            console.log("Fetched notifications:", data.notifications);
            setNotifications((prev) => removeDuplicates([...prev, ...data.notifications]));
          }
        } catch (error) {
          console.error('Failed to fetch notifications', error);
        }
      }
    };

    getAllNotifications();
  }, [session?.db_id]);

  useEffect(() => {
    if (notification.length > 0) {
      setNotifications((prev) => sortByTimestamp(removeDuplicates([...prev, ...notification])));
     console.log("djjdfkjfjdj",notification)
      setNotification([]);
    }
  }, [notification, setNotification]);

  const handleClose = async(index,item) => {
   
   
    try{
      const id = item.notificationId || item._id;
      if(!id){
        console.log("no id");
         }
         const resp=await fetch(`${process.env.NEXT_PUBLIC_NODE_SERVER}/notification/remove/${id}`,{
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
         })
         if(resp.ok){
          console.log("okkk")
          setNotifications((prev) => prev.filter((_, i) => i !== index));
         }
      
    }catch(error){
      console.log(error.message);
    }
   
  };

  return (
    <div className="md:mt-7 mt-4 w-full mx-auto md:w-[85%]">
      {notifications.length === 0 ? (
        <div className="flex items-center justify-center">
          <p className="text-lg text-gray-500 dark:text-gray-400">
            You have caught up with everything!
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {notifications.map((item, index) => (
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
                  {item.status === "requestaccept" && (
                    <span> {item.message}.</span>
                  )}
                  {item.status === "discussNotify" && (
                    <span> {item.message}.</span>
                  )}
                </Link>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white"
                  aria-label="Close"
                  onClick={() => handleClose(index,item)}
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
