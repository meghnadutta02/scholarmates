"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Flex, Text, Box } from "@radix-ui/themes";
import { useSession } from "@/app/(components)/SessionProvider";
import Link from "next/link";
import Loading from "./loading"
const Connection = () => {
  const session = useSession();
  const [isVisible, setIsVisible] = useState(true);
  const [userId, setUserId] = useState();
  const [data, setData] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const [loading, setLoading] = useState(true);
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
        setLoading(false);
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


    <>
      {loading ? <Loading /> : data.length == 0 ? "You Have No Connection.." : (
        <div class="block mt-3 h-full m-auto w-10/12 rounded-lg border border-gray-200 bg-white p-6 shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
          <div class="flex justify-between p-5">
            <h2 class="text-2xl font-bold">Connections : {data.length}</h2>
            {/* search box */}
          </div>
          <div class="h-px w-full bg-slate-200"></div>
          <div className="flex flex-col mt-3 m-auto rounded-lg border border-gray-200 bg-white p-6 shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
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

                    >
                      <Link href={`/profile/${user._id}`}>
                        {user.name}
                      </Link>
                    </p>
                    <p className="text-sm">{user.collegeName}</p>
                    <p className="text-sm">{user.degree}</p>
                  </Box>
                </Flex>
              </div>
            ))}
          </div>


        </div>
      )}
    </>
  );
};

export default Connection;
