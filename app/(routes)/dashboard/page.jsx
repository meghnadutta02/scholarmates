import Analytics from "@/app/(components)/Dashboard/Analytics";
import UserRequest from "@/app/(components)/Dashboard/UserRequest";
import UserTable from "@/app/(components)/Dashboard/UserTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const page = () => {
  return (
    <div className="mt-4">
      <Tabs className="w-full" defaultValue="userRequest">
        <TabsList className="flex mx-auto w-min">
          <TabsTrigger value="userRequest">Support Request</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="userDetails">User Details</TabsTrigger>
        </TabsList>
        <div className="flex w-full py-6">
          <TabsContent value="userRequest" className="w-full">
            <UserRequest />
          </TabsContent>

          <TabsContent value="analytics" className="w-full">
            <Analytics />
          </TabsContent>

          <TabsContent value="userDetails" className="w-full">
            <UserTable />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
export default page;
