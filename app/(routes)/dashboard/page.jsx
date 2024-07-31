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
                <div className="flex w-full pt-6 pb-8">
                    <TabsContent value="userRequest" className="md:w-[80%] w-full m-auto">
                        <UserRequest />
                    </TabsContent>

                    <TabsContent value="userDetails" className="md:w-[100%] w-full">
                        <UserDetails />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    )
}
export default page;