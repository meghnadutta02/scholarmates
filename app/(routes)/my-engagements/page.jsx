"use client";
import React from "react";
import MyConnectionsList from "@/app/(components)/MyConnectionsList";
import MyDiscussionList from "@/app/(components)/MyDiscussionList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const page = () => {
  return (
    <div className="md:mt-7 mt-4 flex flex-col md:px-2 px-0 w-full">
      <Tabs defaultValue="c" className="w-full">
        <TabsList className="flex mx-auto w-min">
          <TabsTrigger value="c">Connections</TabsTrigger>
          <TabsTrigger value="g">Discussions</TabsTrigger>
        </TabsList>
        <div className="flex w-full justify-center">
          <TabsContent value="c" className="lg:w-[80%] w-full">
            <MyConnectionsList />
          </TabsContent>

          <TabsContent value="g" className="lg:w-[80%] w-full">
            <MyDiscussionList />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default page;
