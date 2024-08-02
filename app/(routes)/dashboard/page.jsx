import UserDetails from "@/app/(components)/Dashboard/UserDetails";
import UserRequest from "@/app/(components)/Dashboard/UserRequest";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const page = () => {
  return (
    <div>
      <Tabs className="w-full" defaultValue="userRequest">
        <TabsList className="flex mx-auto w-min">
          <TabsTrigger value="userRequest">User Request</TabsTrigger>
          <TabsTrigger value="userDetails">User Details</TabsTrigger>
        </TabsList>
        <div className="flex w-full py-6">
          <TabsContent value="userRequest" className="w-full">
            <UserRequest />
          </TabsContent>

          <TabsContent value="userDetails" className="w-full">
            <UserDetails />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
export default page;
