"use client";
import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, ViewIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Loading from "../Loading";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Component() {
  const [supportRequests, setSupportRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/support-request", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log(data);
      setSupportRequests(data.supportRequests);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const deleteSupportRequest = async (id) => {
    try {
      const res = await fetch(`/api/admin/support-request?supportId=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) return <Loading />;

  return (
    <Table className="md:min-w-[50rem]">
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead className="table-cell text-center">Status</TableHead>
          <TableHead className="table-cell text-center">Date</TableHead>
          <TableHead className="table-cell text-center">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {supportRequests.map((request) => (
          <TableRow key={request._id}>
            <TableCell>
              <div className="font-medium">{request.userName}</div>
              <div className="text-sm text-muted-foreground">
                {request.userEmail}
              </div>
            </TableCell>
            <TableCell className="table-cell text-center">
              <Badge
                className={`text-xs text-white  ${
                  request.status === "resolved" ? "bg-green-600" : "bg-red-500"
                }`}
              >
                {request.status}
              </Badge>
            </TableCell>
            <TableCell className="table-cell text-center">
              {new Date(request.createdAt).toLocaleString("en-UK")}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-center">
                <Dialog>
                  <DialogTrigger>
                    <Button variant="icon">
                      <ViewIcon size={22} className="mt-0.5" color="blue" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Message details</DialogTitle>
                      <DialogDescription>
                        The user is asking help support for the following matter
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 justify-between mt-4">
                      <div className="flex flex-col gap-3 pr-2">
                        <p>
                          <b> Name </b>: {request.userName}
                        </p>
                        <p>
                          <b> Email </b> : {request.userEmail}
                        </p>
                        <p>
                          <b> Subject </b> : {request.subject}
                        </p>
                        <p>
                          <b> Message </b> : {request.message}
                        </p>
                      </div>
                      <div className="flex flex-col gap-4">
                        Reply
                        <Textarea
                          name="reply"
                          id="reply"
                          value={replyText}
                          placeholder="Write message here to user's email"
                          rows="4"
                          onChange={(e) => setReplyText(e.target.value)}
                        />
                        <Button className="w-1/2 mx-auto" type="submit">
                          Send
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="icon">
                      <Trash2 size={22} color="crimson" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Delete Support Request</DialogTitle>
                      <DialogDescription className="text-red-600">
                        This support request data will be permanently deleted.
                      </DialogDescription>
                    </DialogHeader>

                    <DialogClose>
                      <button
                        className="bg-red-600 p-2 rounded-md"
                        onClick={() => {
                          deleteSupportRequest(request._id);
                          setSupportRequests(
                            supportRequests.filter(
                              (req) => req._id !== request._id
                            )
                          );
                        }}
                      >
                        Confirm
                      </button>
                    </DialogClose>
                  </DialogContent>
                </Dialog>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
