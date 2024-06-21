import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import GroupRequests from "@/app/(components)/GroupRequests";
import Connection from "@/app/(components)/Connection";
const Request = () => {
  return (
    <div className="mt-7 flex px-2 w-full">
      <Tabs defaultValue="c" className="w-full">
        <TabsList className="flex mx-auto w-min">
          <TabsTrigger value="c">Connections</TabsTrigger>
          <TabsTrigger value="g">Groups</TabsTrigger>
        </TabsList>
        <div className="flex w-full  my-4 justify-center pt-4 pb-8">
          <TabsContent value="c">
            <Connection />
          </TabsContent>

          <TabsContent value="g">
            <GroupRequests />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Request;
