"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useEffect, useState } from "react";
import Notification from "@/app/(components)/Notification";
import { useSession } from "@/app/(components)/SessionProvider";
import GroupRequests from "@/app/(components)/GroupRequests";
import Loading from "./loading";

const Request = () => {
  const { session } = useSession();
  const [userId, setUserId] = useState();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      setUserId(session.db_id);
    }
  }, [session]);

  const fetchRequests = async () => {
    if (!userId) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_NODE_SERVER}/notification/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setData(data.data);
      } else {
        console.log("Error:", response.statusText);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [userId]);

  return (
    <div className="md:mt-7 mt-4 flex md:px-2 px-0 w-full">
      <Tabs defaultValue="c" className="w-full">
        <TabsList className="flex mx-auto w-min">
          <TabsTrigger value="c">Connections</TabsTrigger>
          <TabsTrigger value="g">Groups</TabsTrigger>
        </TabsList>
        <div className="flex w-full justify-center pt-6 pb-8">
          <TabsContent value="c" className="md:w-[80%] w-full m-auto">
            {loading ? (
              <Loading />
            ) : data.length === 0 ? (
              <div className="flex items-center justify-center">
                <p className="text-lg text-gray-500 dark:text-gray-400 ">
                  You have no connection requests.
                </p>
              </div>
            ) : (
              <div className="items-center flex-col space-y-4 w-full">
                {data.map((item, index) => (
                  <Notification
                    key={index}
                    data={item?.requestData}
                    sender={item.requestData?.user}
                    receive={item.requestData?.requestTo}
                    frndId={item.requestData?._id}
                    user={item?.userData}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="g" className="md:w-[80%] w-full">
            <GroupRequests />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Request;
