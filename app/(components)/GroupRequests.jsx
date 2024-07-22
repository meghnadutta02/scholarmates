import React, { useEffect, useState } from "react";
import Loading from "@/app/(components)/Loading";
import Image from "next/image";
import { FaTimes, FaCheck } from "react-icons/fa";
import { useSession } from "./SessionProvider";
import { toast } from "react-toastify";

const GroupRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { socket, session } = useSession();

  const fetchRequests = async () => {
    try {
      const response = await fetch(`/api/join-group/requests`);
      if (!response.ok) {
        throw new Error("Failed to fetch requests");
      }
      const data = await response.json();
      setRequests(data.requestsToAccept);
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
        const data = await response.json();

        socket.emit("joinRequestAccepted", {
          request: data.result,
          user: session,
        });
        setRequests((prevRequests) =>
          prevRequests.filter((r) => r._id !== request._id)
        );

        toast.success(
          <div>
            Request from {request?.fromUser?.name} to join group is accepted
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
        setRequests((prevRequests) =>
          prevRequests.filter((r) => r._id !== request._id)
        );

        toast.success(
          <div>
            Request from {request?.fromUser?.name} to join group is rejected
          </div>
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
          {requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center">
              <p className="text-lg text-gray-500 dark:text-gray-400">
                You have no group requests.
              </p>
            </div>
          ) : (
            requests.map((request) => (
              <div key={request._id} className="sm:text-base text-[14px]">
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
                      <span className="font-semibold">
                        {request?.fromUser?.name}
                      </span>{" "}
                      has requested to join group &quot;
                      {request?.groupId?.name}&quot;.
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAcceptRequest(request)}
                      className="flex items-center p-2 border hover:border-green-400 shadow-md rounded-md transform transition-transform hover:scale-125"
                    >
                      <FaCheck className="h-4 w-4 text-green-500" />
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request)}
                      className="flex items-center p-2 border hover:border-red-400 shadow-md rounded-md transform transition-transform hover:scale-125"
                    >
                      <FaTimes className="h-[17px] w-[17px] text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default GroupRequests;
