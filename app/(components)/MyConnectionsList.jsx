"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

import { useSession } from "@/app/(components)/SessionProvider";
import Link from "next/link";
import Loading from "@/app/(components)/Loading";
const Connection = () => {
  const { session } = useSession();

  const [userId, setUserId] = useState();
  const [data, setData] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (session) {
      setUserId(session.db_id);
    }
  }, [session]);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const res = await fetch(`/api/users/connection/${userId}`, {
          method: "GET",
          cache: "no-cache",
        });
        if (res.ok) {
          const responseData = await res.json();
          const data = responseData.result;
          setData((prevData) => [...prevData, ...data]);
          setLoading(false);
          setDataFetched(true);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (userId && !dataFetched) {
      fetchConnections();
    }
  }, [userId, dataFetched]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : data.length == 0 ? (
        <div className="flex flex-col items-center justify-center h-full mt-4">
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-4">
            You have no connections.
          </p>
          <Link
            href="/find-match"
            className="flex items-center gap-3 rounded-lg px-3 py-2 bg-gray-700 transition-all hover:bg-gray-900 dark:bg-gray-400 dark:hover:bg-gray-50 text-white "
          >
            Find Connections
          </Link>
        </div>
      ) : (
        <div className="w-full md:mt-7 mt-4 font-sans">
          <h2 className="md:text-xl sm:text-lg text-md font-semibold">
            {data.length} connection{data.length !== 1 ? "s" : ""}
          </h2>

          <div className="flex flex-col mt-4 m-auto rounded-lg  bg-white md:py-3 py-2 md:px-[10px] px-2 max-h-[32rem] transition-colors duration-300 shadow gap-4 overflow-y-auto scrollbar-thin">
            {data?.map((user, index) => (
              <Link key={index} href={`/profile/${user._id}`}>
                <div className=" flex cursor-pointer justify-between items-center hover:bg-gray-100  dark:bg-gray-800 dark:hover:bg-gray-400">
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
                      <div className="sm:block hidden">
                        <p className="text-sm">{user.collegeName}</p>
                        <p className="text-sm text-gray-600">{user.degree}</p>
                      </div>
                      {user.connection.length > 0 && (
                        <p className="text-sm text-gray-600 block sm:hidden">
                          {user.connection.length} connection
                          {user.connection.length > 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                  </div>
                  {user.connection.length > 0 && (
                    <p className="text-sm text-gray-600 sm:block hidden">
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
