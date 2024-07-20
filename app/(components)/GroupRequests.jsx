import React, { useEffect, useState } from "react";
import Loading from "@/app/(components)/Loading";
import Image from "next/image";
import { FaTimes, FaCheck } from "react-icons/fa";

import { toast } from "react-toastify";

const GroupRequests = () => {
  const [mergedRequests, setMergedRequests] = useState([]);
  const [requestsToAccept, setRequestsToAccept] = useState([]);
  const [requestsToJoin, setRequestsToJoin] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const response = await fetch(`/api/join-group/requests`);
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
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAcceptRequest = async (request) => {
    try {
      const response = await fetch(
        `/api/join-group/${request._id}?action=accept`,
        {
          method: "PUT",
        }
      );
      if (response.ok) {
        setMergedRequests((prevRequests) =>
          prevRequests.filter((r) => r._id !== request._id)
        );
        setRequestsToAccept((prevRequests) =>
          prevRequests.filter((r) => r._id !== request._id)
        );
        toast.success(
          <div>
            Request from {request?.fromUser?.name} to join group &quot;
            {request.groupId.name}&quot; is accepted
          </div>
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRejectRequest = async (request) => {
    try {
      const response = await fetch(
        `/api/join-group/${request._id}?action=reject`,
        {
          method: "PUT",
        }
      );
      if (response.ok) {
        setMergedRequests((prevRequests) =>
          prevRequests.filter((r) => r._id !== request._id)
        );
        setRequestsToAccept((prevRequests) =>
          prevRequests.filter((r) => r._id !== request._id)
        );
        toast.success(
          <div>
            Request from {request?.fromUser?.name} to join group &quot;
            {request?.groupId?.name}&quot; is rejected
          </div>
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteRequest = async (id) => {
    try {
      const response = await fetch(`/api/join-group/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setMergedRequests((prevRequests) =>
          prevRequests.filter((r) => r._id !== id)
        );
        setRequestsToJoin((prevRequests) =>
          prevRequests.filter((r) => r._id !== id)
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full">
      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-col gap-4 p-2 w-full">
          {mergedRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center">
              <p className="text-lg text-gray-500 dark:text-gray-400 ">
                You have no group requests.
              </p>
            </div>
          ) : (
            mergedRequests.map((request) => (
              <div key={request._id} className="md:text-base text-[14px]">
                {requestsToJoin.includes(request) && (
                  <div className="flex items-center justify-between rounded-md shadow md:px-3 px-[6px] md:py-4 py-2 font-sans my-auto">
                    <div className="flex">
                      Your request to join group &quot;{request.groupId.name}
                      &quot; is {request.status}.
                    </div>
                    <button
                      onClick={() => handleDeleteRequest(request._id)}
                      className="ml-2 text-zinc-700"
                    >
                      <FaTimes className="h-4 w-4 transform transition-transform hover:scale-125 text-zinc-700" />
                    </button>
                  </div>
                )}
                {requestsToAccept.includes(request) && (
                  <div className="flex w-full justify-between items-center rounded-md shadow md:px-3 px-[6px] md:py-4 py-2">
                    <div className="flex items-center">
                      <Image
                        src={request?.fromUser?.profilePic}
                        alt={request?.fromUser?.name}
                        width={36}
                        height={36}
                        className="rounded-full mr-2"
                      />
                      <div>
                        <span className="font-semibold ">
                          {request?.fromUser?.name}
                        </span>{" "}
                        has requested to join group &quot;
                        {request?.groupId?.name}&quot;.
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleAcceptRequest(request)}
                        className="bg-green-500 text-white flex items-center p-2 rounded-lg transform transition-transform hover:scale-125"
                      >
                        <FaCheck className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleRejectRequest(request)}
                        className="bg-red-500 text-white flex items-center p-2 rounded-lg transform transition-transform hover:scale-125"
                      >
                        <FaTimes className="h-[17px] w-[17px]" />
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
