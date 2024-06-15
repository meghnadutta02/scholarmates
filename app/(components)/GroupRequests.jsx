"use client";
import React, { useEffect, useState } from "react";
import Spinnersvg from "@/public/Spinner.svg";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "react-toastify";

const GroupRequests = () => {
  const [mergedRequests, setMergedRequests] = useState([]);
  const [requestsToAccept, setRequestsToAccept] = useState([]);
  const [requestsToJoin, setRequestsToJoin] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showButton, setShowButton] = useState(true);

  const fetchRequests = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/join-group/requests`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch requests");
      }
      const data = await response.json();
      setRequestsToAccept(data.requestsToAccept);
      setRequestsToJoin(data.requestsToJoin);
      const merged = [...data.requestsToAccept, ...data.requestsToJoin];
      const sortedMerged = merged.sort((a, b) => {
        const dateA = new Date(a.updatedAt);
        const dateB = new Date(b.updatedAt);
        return dateB - dateA;
      });
      setMergedRequests(sortedMerged);
      console.log(sortedMerged);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="">
      {loading ? (
        <div className="flex justify-center items-center  z-50">
          <Image src={Spinnersvg} alt="Loading..." className="h-28" />
        </div>
      ) : (
        <div className="flex flex-col gap-4 p-2">
          {mergedRequests.length === 0 ? (
            <p>No requests to display</p>
          ) : (
            mergedRequests.map((request) => (
              <div key={request._id} className="">
                {requestsToJoin.includes(request) && (
                  <div className="bg-gray-100 rounded-md shadow-lg px-3 py-2">
                    Your request to join group -{" "}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          #
                          {request.groupId._id.substring(
                            request.groupId._id.length - 4
                          )}
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{request.groupId.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>{" "}
                    is {request.status}
                  </div>
                )}
                {requestsToAccept.includes(request) && (
                  <div className="flex w-full justify-between items-center bg-gray-100 rounded-md shadow-lg px-3 py-2">
                    <div className="">
                      {showButton && (
                        <div className="flex items-center">
                          <Image
                            src={request?.fromUser?.profilePic}
                            alt={request?.fromUser?.name}
                            width={36}
                            height={36}
                            className="rounded-full mr-2"
                          />

                          <div>
                            {request?.fromUser?.name} has requested to join
                            group -{" "}
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  #
                                  {request.groupId._id.substring(
                                    request.groupId._id.length - 4
                                  )}
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{request?.groupId?.name}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>{" "}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="">
                      <button
                        onClick={async () => {
                          try {
                            const response = await fetch(
                              `${process.env.NEXT_PUBLIC_API_URL}/api/join-group/${request._id}?action=accept`,
                              {
                                method: "PUT",
                              }
                            );
                            if (response.ok) {
                              setShowButton(false);
                              toast.success(
                                <div>
                                  Request from {request?.fromUser?.name} to join
                                  group - #
                                  {request.groupId._id.substring(
                                    request.groupId._id.length - 4
                                  )}{" "}
                                  is accepted
                                </div>
                              );
                            }
                          } catch (error) {
                            console.error(error);
                          }
                        }}
                        className="mr-2 p-1 transform transition-transform hover:scale-125 text-zinc-700"
                      >
                        {showButton && <FaCheck className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={async () => {
                          try {
                            const response = await fetch(
                              `${process.env.NEXT_PUBLIC_API_URL}/api/join-group/${request._id}?action=reject`,
                              {
                                method: "PUT",
                              }
                            );
                            if (response.ok) {
                              setShowButton(false);

                              toast.success(
                                <div>
                                  Request from {request?.fromUser?.name} to join
                                  group - #
                                  {request.groupId._id.substring(
                                    request.groupId._id.length - 4
                                  )}{" "}
                                  is rejected
                                </div>
                              );
                            }
                          } catch (error) {
                            console.error(error);
                          }
                        }}
                        className=" transform transition-transform hover:scale-125 p-1 text-zinc-700"
                      >
                        {showButton && (
                          <FaTimes className="h-[17px] w-[17px]" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default GroupRequests;
