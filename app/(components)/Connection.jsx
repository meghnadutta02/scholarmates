"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Flex, Text, Box } from "@radix-ui/themes";
import { useSession } from "./SessionProvider";

const Connection = () => {
  const session = useSession();
  const [isVisible, setIsVisible] = useState(true);
  const [userId, setUserId] = useState();
  const [data, setData] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    if (session) {
      setUserId(session.session.db_id);
    }
  }, [session]);

  const acceptHandle = async () => {
    try {
      const res = await fetch(`/api/users/connection/${userId}`, {
        method: "GET",
        cache: "no-cache",
      });
      if (res.ok) {
        const responseData = await res.json();
        const dattaa = responseData.result;
        setData((prevData) => [...prevData, ...dattaa]);
        setDataFetched(true);
        console.log(responseData.result);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (userId && !dataFetched) {
      acceptHandle();
    }
  }, [userId, dataFetched]);

  return (
    <div className="flex flex-col px-8">
      {data?.map((user, index) => (
        <div className="my-2" key={index}>
          <Flex gap="4" align="center" className="flex">
            <Image
              alt="ProfilePic"
              height={10}
              width={60}
              src={user.profilePic}
              className="mr-2 rounded-full border"
              fallback="T"
            />
            <Box>
              <p
                className="text-md font-semibold cursor-pointer hover:color-blue"
                onClick={() => profile(user._id)}
              >
                {user.name}
              </p>
              <p className="text-sm">{user.collegeName}</p>
              <p className="text-sm">{user.degree}</p>
            </Box>
          </Flex>
        </div>
      ))}
    </div>
  );
};

export default Connection;
