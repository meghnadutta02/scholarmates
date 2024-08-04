"use client";
import { Badge } from "@/components/ui/badge";
import { ReloadIcon } from "@radix-ui/react-icons";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";

export default function Component() {
  const [supportRequests, setSupportRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [resolve,setResolve]=useState(false);
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

      setSupportRequests(data.supportRequests);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const Resolve = async (sid,action) => {
    try {
      const response = await fetch("/api/admin/send-email", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          supportId: sid,
          status:action
        }),
      });
      if (!response.ok) {
        throw new Error("An error occurred while processing your request.");
      }
      toast.success("status update successfully");
      setReplyText("");
      setResolve(false);
      setSupportRequests((prevRequests) =>
        prevRequests.map((req) =>
          req._id === sid ? { ...req, status: action==="resolved"?"review":"resolved" } : req
        )
      );
    } catch (error) {
      console.error(error);
    }
  };


  const sendReply = async (email, sid) => {
    try {
      const response = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: email,
          message: replyText,
          supportId: sid,
        }),
      });
      if (!response.ok) {
        throw new Error("An error occurred while processing your request.");
      }
      toast.success("Email sent successfully");
      setReplyText("");
      setSendingReply(false);
      setSupportRequests((prevRequests) =>
        prevRequests.map((req) =>
          req._id === sid ? { ...req, status: "review" } : req
        )
      );
    } catch (error) {
      console.error(error);
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
                className={`text-xs text-white ${
                  request.status === "resolved" ? "bg-green-600":
                  request.status==="review"?"bg-yellow-500": "bg-red-500"
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
                        The user is asking for support regarding the following
                        matter
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
                       <div className="flex justify-between">
                       <Button
                          onClick={() => {
                            sendReply(request.userEmail, request._id);
                            setSendingReply(true);
                          }}
                          className="w-1/3 mx-auto"
                          type="submit"
                          disabled={sendingReply}
                        >
                          {sendingReply ? (
                            <>
                              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                              Please wait
                            </>
                          ) : (
                            <>Send</>
                          )}
                        </Button>
                        
                          <Button
                          onClick={() => {
                            Resolve(request._id,request.status);
                            setResolve(true);
                          }}
                          className={
                            `w-1/3 ${resolve? 'bg-gray-400'
                                        : request.status === 'resolved'
                                        ? 'bg-red-500'
                                        : 'bg-green-500'
                                    }`
                          }
                          type="submit"
                          disabled={resolve}
                        >
                          {resolve ? (
                            <>
                              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                              Please wait
                            </>
                          ) : (
                          request.status === "resolved" ? "Unresolve" : "Resolve"
                          )}
                        </Button>
                       
                       </div>
                      </div>
                      {request.status !== "resolved" && (
                        <div className="flex flex-col gap-4">
                          Reply
                          <Textarea
                            name="reply"
                            id="reply"
                            value={replyText}
                            placeholder="Type your message to the user here..."
                            rows="4"
                            onChange={(e) => setReplyText(e.target.value)}
                          />
                          <Button
                            onClick={() => {
                              sendReply(request.userEmail, request._id);
                              setSendingReply(true);
                            }}
                            className="w-1/2 mx-auto"
                            type="submit"
                            disabled={sendingReply}
                          >
                            {sendingReply ? (
                              <>
                                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                              </>
                            ) : (
                              <>Send</>
                            )}
                          </Button>
                        </div>
                      )}
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
                        className="bg-red-600 p-2 rounded-md text-white"
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
