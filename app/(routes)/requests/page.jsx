"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useCallback, useEffect, useState } from "react";
import Notification from "@/app/(components)/Notification";
import { useSession } from "@/app/(components)/SessionProvider";
import GroupRequests from "@/app/(components)/GroupRequests";
import Loading from "./loading";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

const Request = () => {
  const { session } = useSession();
  const [requestData, setRequestData] = useState([]);
  const [loading, setLoading] = useState(true);
  const tabParams = useSearchParams();
  const [defaultTab, setDefaultTab] = useState("connections");

  useEffect(() => {
    const tab = tabParams.get("tab");
    if (tab === "connections" || tab === "groups") {
      setDefaultTab(tab);
    } else {
      setDefaultTab("connections");
    }
  }, [tabParams]);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!session) return;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_NODE_SERVER}/notification/${session?.db_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok && response.status === 200) {
          const data = await response.json();
          setRequestData(data.data);
        }
      } catch (error) {
        toast.error("Failed to fetch connection requests", {
          autoClose: 4000,
          closeOnClick: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [session]);

  return (
    <div className="md:mt-7 mt-4 flex md:px-2 px-0 w-full">
      <Tabs value={defaultTab} className="w-full" onValueChange={setDefaultTab}>
        <TabsList className="flex mx-auto w-min">
          <TabsTrigger value="connections">Connections</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
        </TabsList>
        <div className="flex w-full justify-center pt-6 pb-8">
          <TabsContent value="connections" className="md:w-[80%] w-full m-auto">
            <div className="items-center flex-col space-y-4 w-full">
              {loading ? (
                <Loading />
              ) : (
                <Notification
                  requestData={requestData}
                  setRequestData={setRequestData}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="groups" className="md:w-[80%] w-full">
            <GroupRequests />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Request;
