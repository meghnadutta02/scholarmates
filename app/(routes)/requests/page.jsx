"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useEffect, useState } from "react";

import Notification from "@/app/(components)/Notification";

import { useSession } from "@/app/(components)/SessionProvider";
import GroupRequests from "@/app/(components)/GroupRequests";
import Loading from "./loading";
const Request = () => {
  const { session, request, setRequest, notification } = useSession();
  const [userId, setUserId] = useState();
  const [requestdata, setRequestData] = useState([]);
  const [data, setData] = useState([]);
  const [requestnot, setRequestNot] = useState([]);
  const [check, setCheck] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      setUserId(session.db_id);
    }
  }, [userId]);

  useEffect(() => {
    const storedData = localStorage.getItem("request");
    const parsedData = storedData ? JSON.parse(storedData) : null;
    console.log("pasr:", parsedData);
    if (parsedData) {
      setData(parsedData);
      setLoading(false);
    }
  }, [check]);

  // notification call
  const dataExistsInLocalStorage = (id) => {
    const storedData = localStorage.getItem("request");
    const parsedData = storedData ? JSON.parse(storedData) : [];
    return parsedData.some((item) => item.id === id);
  };

  const requestnoti = async () => {
    try {
      const response = await fetch(
        `http://localhost:5001/notification/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();

        const newData = data.data.filter(
          (item) => !dataExistsInLocalStorage(item.id)
        );
        setRequestNot((prevData) => [...prevData, ...newData]);
      } else {
        console.log("Error:", response.statusText);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      requestnoti();
    }
  }, [userId]);

  useEffect(() => {
    if (requestnot.length > 0) {
      localStorage.setItem("request", JSON.stringify(requestnot));
      setCheck(true);
    }
  }, [requestnot]);

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
            ) : data.length == 0 ? (
              <div className="flex justify-center">
                You have no connection requests.
              </div>
            ) : (
              <div class="items-center flex-col gap-4 w-full">
                {data?.map((item, index) => (
                  <Notification
                    key={index}
                    data={item.requestData}
                    sender={item.requestData.user}
                    receive={item.requestData.requestTo}
                    frndId={item.requestData._id}
                    user={item.userData}
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
