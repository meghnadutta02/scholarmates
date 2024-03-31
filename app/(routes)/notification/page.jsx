"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import io from "socket.io-client";
import Notification from "@/app/(components)/Notification";
import { useSession } from '@/app/(components)/SessionProvider'
var socket, selectedChatCompare;
const Page = () => {
  const { session, request, setRequest } = useSession();

  const [userId, setUserId] = useState();
  const [requestdata, setRequestData] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (session) {
      console.log("this is lll:", session.db_id);
      console.log("request is:", request);
      setUserId(session.db_id);
    }
  }, [userId]);

  // useEffect(() => {
  //     socket = io("http://localhost:5001");
  //     console.log(userId)
  //     socket.emit("setup", userId);

  //     socket.on('connectionRequest', (data) => {
  //         console.log(data);
  //         if (data != null) {
  //             setRequestData(prevData => [...prevData, data]);
  //         }

  //         setRequest(prevRequest => ({ ...prevRequest, ...data }));
  //         console.log("data we have:", data);
  //     });

  //     return () => {
  //         socket.disconnect();
  //     };
  // }, [userId])
  // useEffect(() => {
  //     if (requestdata.length > 0) {
  //         localStorage.setItem('request', JSON.stringify(requestdata));
  //         console.log("dataaaaa:", requestdata);
  //     }
  // }, [requestdata]);
  useEffect(() => {
    const storedData = localStorage.getItem("request");
    const parsedData = storedData ? JSON.parse(storedData) : null;
    setData(parsedData);
    console.log("pasr:", parsedData);
  }, []);

  return (
    <>
      <div>
        {data?.map((item, index) => (
          <Notification
            key={index}
            sender={item.senderId}
            receive={item.recipientId}
            name={item.sendername}
            frndId={item.friendRequest}
          />
        ))}
      </div>
    </>
  );
};

export default Page;
