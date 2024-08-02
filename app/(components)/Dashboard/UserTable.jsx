"use client";
import { ListFilter, ViewIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { MdDeleteOutline } from "react-icons/md";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);

  const fetchUsers = async (page = 1) => {
    try {
      const response = await fetch(`/api/admin/users?page=${page}&limit=10`);
      const data = await response.json();
      setUsers(data.users);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
      setTotalUsers(data.totalUsers);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const openDialog = (user) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setSelectedUser(null);
    setDialogOpen(false);
  };
  return (
    <Tabs defaultValue="week">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="month">Month</TabsTrigger>
          <TabsTrigger value="year">Year</TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 gap-1 text-sm">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only">Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>
                connection
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>email</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <TabsContent value="week">
        <Card x-chunk="dashboard-05-chunk-3">
          <CardHeader className="px-7">
            <CardTitle>Users ({totalUsers})</CardTitle>
            <CardDescription>
              Details of all the users in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table className="min-w-[56vw]">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="table-cell">Connections</TableHead>
                  <TableHead className="table-cell">
                    Discussions created
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Date of Joining
                  </TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id} className="bg-accent">
                    <TableCell>
                      <div className="font-medium">{user.name}</div>
                      <div className="hidden text-sm text-muted-foreground md:inline">
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell className="table-cell text-center">
                      {user.numberOfConnections}
                    </TableCell>
                    <TableCell className="table-cell text-center">
                      <Badge className="text-xs" variant="secondary">
                        {user.numberOfDiscussions}
                      </Badge>
                    </TableCell>
                    <TableCell className="table-cell text-center">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right flex items-center gap-2 mt-2">
                      <ViewIcon
                        className="w-6 h-6  text-blue-800 cursor-pointer "
                        onClick={() => openDialog(user)}
                      />
                      <MdDeleteOutline className="w-6 h-6 text-red-500 cursor-pointer" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-end mt-4">
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="mr-2"
              >
                Previous
              </Button>
              <Button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      {selectedUser && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>
                <strong>Name:</strong> {selectedUser.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>College Name:</strong> {selectedUser.collegeName}
              </p>
              <p>
                <strong>Year in College:</strong> {selectedUser.yearInCollege}
              </p>
              <p>
                <strong>Department:</strong> {selectedUser.department}
              </p>
              <p>
                <strong>Degree:</strong> {selectedUser.degree}
              </p>
              <p>
                <strong>Number of Connections:</strong>{" "}
                {selectedUser.numberOfConnections}
              </p>
              <p>
                <strong>Number of Groups Joined:</strong>{" "}
                {selectedUser.numberOfGroupsJoined}
              </p>

              <p>
                <strong>Number of Discussions:</strong>{" "}
                {selectedUser.numberOfDiscussions}
              </p>
              <p>
                <strong>Date of Joining:</strong>{" "}
                {new Date(selectedUser.createdAt).toLocaleDateString()}
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Tabs>
  );
};

export default UserTable;
