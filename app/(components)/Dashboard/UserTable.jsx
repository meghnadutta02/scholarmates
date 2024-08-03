"use client";
import React, { useState, useEffect } from "react";
import { ViewIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { AiOutlineSearch } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MdDeleteOutline } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const UserTable = ({
  users,
  currentPage,
  totalPages,
  totalUsers,
  setCurrentPage,
  setSearchQuery,
}) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const openDialog = (user) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleSearchClick = () => {
    setCurrentPage(1);

    setSearchQuery(event.target.value);
  };

  return (
    <div>
      <Card x-chunk="dashboard-05-chunk-3" className="mt-4">
        <CardHeader className="px-7 flex justify-between">
          <>
            <CardTitle>Users ({totalUsers})</CardTitle>
            <CardDescription>
              Details of all the users in the system
            </CardDescription>
          </>
          <div className="flex items-center relative sm:w-[50%] w-[80%]">
            <input
              type="text"
              placeholder="Search by name or email"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 w-full"
            />
            <AiOutlineSearch
              className="w-6 h-6 text-gray-500 absolute right-2 cursor-pointer"
              onClick={handleSearchClick}
            />
          </div>
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
                    {new Date(user.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right flex items-center gap-2 mt-2">
                    <ViewIcon
                      className="w-6 h-6 text-blue-800 cursor-pointer"
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
                <strong>Discussions Created:</strong>{" "}
                {selectedUser.numberOfDiscussions}
              </p>
              <p>
                <strong>Connections:</strong> {selectedUser.numberOfConnections}
              </p>
              <p>
                <strong>Date of Joining:</strong>{" "}
                {new Date(selectedUser.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default UserTable;
