"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

import { useSession } from "@/app/(components)/SessionProvider";
import Link from "next/link";
import Loading from "./loading";
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
      {loading ? (
        <Loading />
      ) : data.length == 0 ? (
        "You have no connections."
      ) : (
        <div className="md:w-[80%] w-full   mt-7 font-sans">
          <h2 className="text-xl font-semibold">
            {data.length} connection{data.length !== 1 ? "s" : ""}
          </h2>

          <div className="flex flex-col mt-4 m-auto rounded-lg  bg-white md:py-3 py-2 md:px-[10px] px-2 transition-colors duration-300 shadow hover:bg-gray-100  dark:bg-gray-800 dark:hover:bg-gray-400 gap-4">
            {data?.map((user, index) => (
              <Link href={`/profile/${user._id}`}>
                <div
                  className=" flex cursor-pointer justify-between items-center"
                  key={index}
                >
                  <div className="flex items-center">
                    <Image
                      alt="ProfilePic"
                      height={50}
                      width={50}
                      src={user.profilePic}
                      className="mr-2 rounded-full border md:w-16 md:h-16 w-10 h-10"
                      fallback="T"
                    />
                    <div>
                      <p className="text-md font-semibold ">{user.name}</p>
                      <p className="text-sm">{user.collegeName}</p>
                      <p className="text-sm text-gray-600">{user.degree}</p>
                    </div>
                  </div>
                  {user.connection.length > 0 && (
                    <p className="text-sm text-gray-600">
                      {user.connection.length} connection
                      {user.connection.length > 1 ? "s" : ""}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Connection;
