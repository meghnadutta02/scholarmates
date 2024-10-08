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
import { MdOutlineInfo } from "react-icons/md";
import Link from "next/link";
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
import { toast } from "react-toastify";
import Loading from "../Loading";
import { BiLeftArrow, BiRightArrow } from "react-icons/bi";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [usersLoading, setUsersLoading] = useState(true);

  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState("");
  const [disabled, setDisabled] = useState(false);

  const fetchUsers = async (page = 1, query = "") => {
    try {
      if (query && query.length < 4) return;
      const response = await fetch(
        `/api/admin/users?page=${page}&query=${query}`
      );
      const data = await response.json();

      setUsers(data.users);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
      setTotalUsers(data.totalUsers);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setUsersLoading(false);
    }
  };

  const openDialog = (user) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleGetUserId = (id) => {
    setShowConfirmDelete(true);
    setDeleteUserId(id);
  };
  const handleDelete = async () => {
    try {
      setDisabled(true);
      const response = await fetch(`/api/admin/users/${deleteUserId}`);

      if (response.ok) {
        toast.success("User deleted successfully");
        setUsers((prev) => prev.filter((user) => user._id !== deleteUserId));
      } else {
        toast.error("User deletion failed");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setDisabled(false);
      setShowConfirmDelete(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  if (usersLoading) return <Loading />;

  return (
    <div>
      <Card x-chunk="dashboard-05-chunk-3" className="mt-4">
        <CardHeader className="flex flex-row justify-between px-8 items-center">
          <div>
            <CardTitle>Users ({totalUsers})</CardTitle>
            <CardDescription>
              Details of all the users in the system
            </CardDescription>
          </div>
          <div className="flex items-center relative w-1/2">
            <input
              type="text"
              placeholder="Search by name or email"
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 w-full"
            />
            <AiOutlineSearch className="w-6 h-6 text-gray-500 absolute right-2 cursor-pointer" />
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
                <TableHead className="table-cell">Date of Joining</TableHead>
                <TableHead className="table-cell">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id} className="bg-accent">
                  <TableCell>
                    <Link href={`/profile/${user._id}`}>
                      <div className="font-medium">{user.name}</div>
                      <div className="hidden text-sm text-muted-foreground md:inline">
                        {user.email}
                      </div>
                    </Link>
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
                    <MdDeleteOutline
                      className="w-6 h-6 text-red-500 cursor-pointer"
                      onClick={() => handleGetUserId(user._id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-end mt-4">
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="mr-2 p-[10px]"
            >
              <BiLeftArrow className="w-5 h-5" />
            </Button>
            <Button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="p-[10px]"
            >
              <BiRightArrow className="w-5 h-5" />
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

      {showConfirmDelete && (
        <div className="fixed inset-0 flex font-sans items-center justify-center z-50 bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm">
          <div className="p-4 bg-white rounded-lg dark:bg-gray-800 max-w-lg w-full">
            <h2 className="text-lg font-semibold">Confirm Deletion</h2>
            <p className="mt-1">Are you sure you want to delete this user?</p>
            <span className=" mt-2 text-sm text-red-500 ">
              <MdOutlineInfo className="text-red-500 mr-1 inline" />
              Deleting this user will also permanently delete all associated
              data.
            </span>
            <div className="flex justify-end mt-4">
              <Button
                variant="secondary"
                onClick={() => setShowConfirmDelete(false)}
              >
                Cancel
              </Button>
              <Button
                className="ml-2"
                variant="destructive"
                onClick={handleDelete}
                disabled={disabled}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;
