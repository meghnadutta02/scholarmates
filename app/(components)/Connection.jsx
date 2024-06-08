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
  }, [userId, session]);
  const acceptHandle = async () => {
    try {
      const res = await fetch(`/api/users/connection/${userId}`, {
        method: "GET",
        cache: "no-cache",
      });
      if (res) {
        const data = await res.json();
        const dattaa = data.result;
        setData((prevdata) => [...prevdata, ...dattaa]);

        setDataFetched(true);
        console.log(data.result);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (userId && !dataFetched) {
      // Only fetch data if userId is set and data is not fetched
      acceptHandle();
    }
  }),
    [userId, dataFetched];

  return (
    <div className="flex flex-col px-8">
      {data?.map((user) => {
        return (
          <div className="my-2" key={user.index}>
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
        );
      })}
    </div>
  );
};

export default Connection;
