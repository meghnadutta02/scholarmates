import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import GroupRequests from "@/app/(components)/GroupRequests";

const Request = () => {
  return (
    <div className="mt-7 w-full px-2">
      <Tabs
        defaultValue="c"
        className=" flex flex-col justify-centre items-center  "
      >
        <TabsList>
          <TabsTrigger value="c">Connections</TabsTrigger>
          <TabsTrigger value="g">Groups</TabsTrigger>
        </TabsList>
        <TabsContent value="c">Make changes to your account here.</TabsContent>

        <TabsContent value="g" className="w-full ">
          <GroupRequests />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Request;
