"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import MyConnectionsList from "@/app/(components)/MyConnectionsList";
import MyDiscussionList from "@/app/(components)/MyDiscussionList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Page = () => {
  const tabParams = useSearchParams();
  const [defaultTab, setDefaultTab] = useState("connections");

  useEffect(() => {
    const tab = tabParams.get("tab");
    if (tab === "connections" || tab === "discussions") {
      setDefaultTab(tab);
    } else {
      setDefaultTab("connections");
    }
  }, [tabParams]);

  return (
    <div className="md:mt-7 mt-4 flex flex-col md:px-2 px-0 w-full">
      <Tabs value={defaultTab} className="w-full" onValueChange={setDefaultTab}>
        <TabsList className="flex mx-auto w-min">
          <TabsTrigger value="connections">Connections</TabsTrigger>
          <TabsTrigger value="discussions">Discussions</TabsTrigger>
        </TabsList>
        <div className="flex w-full justify-center">
          <TabsContent value="connections" className="lg:w-[80%] w-full">
            <MyConnectionsList />
          </TabsContent>

          <TabsContent value="discussions" className="lg:w-[80%] w-full">
            <MyDiscussionList />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Page;
