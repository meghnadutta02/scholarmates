import React from "react";
import UserTable from "@/app/(components)/Dashboard/UserTable";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const UserDetails = () => {
  return (
    <div className="p-4">
      {/* Grid container with 2 columns and gap between items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
        <Card x-chunk="dashboard-05-chunk-1" className="bg-slate-100">
          <CardHeader className="pb-2">
            <CardDescription>Total User</CardDescription>
            <CardTitle className="text-4xl">1,329</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              This week new 200 user
            </div>
          </CardContent>
          <CardFooter>
            {/* <Progress value={25} aria-label="25% increase" /> */}
          </CardFooter>
        </Card>
        <Card x-chunk="dashboard-05-chunk-2" className="bg-slate-100">
          <CardHeader className="pb-2">
            <CardDescription>Total last week discussion</CardDescription>
            <CardTitle className="text-4xl">1,329</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              total today discussion
            </div>
          </CardContent>
          <CardFooter>
            {/* <Progress value={25} aria-label="25% increase" /> */}
          </CardFooter>
        </Card>
      </div>

      <UserTable />
    </div>
  );
};

export default UserDetails;
