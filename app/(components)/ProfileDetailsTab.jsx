"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import DetailSection from "./DetailSection";
import DiscussionSection from "./DiscussionSection";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import ProfilePictureView from "./ProfilePictureView";
import { useRouter } from "next/navigation";
import { useSession } from "./SessionProvider";
import { Button } from "@/components/ui/button";
import { FaTimes, FaCheck } from "react-icons/fa";

const ProfileDetailsTab = ({ user: initialUser }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(initialUser);

  const { session } = useSession();

  useEffect(() => {
    const fetchCurrentUser = async (id) => {
      try {
        const res = await fetch(`/api/users/profile?id=${id}`);
        if (res.ok) {
          const currentUser = await res.json();

          const isConnected = currentUser.result.connection.includes(
            initialUser._id
          );
          const isRequestReceived = currentUser.result.requestReceived.includes(
            initialUser._id
          );
          const isRequestPending = currentUser.result.requestPending.includes(
            initialUser._id
          );

          let requestId = null;

          if (isRequestReceived) {
            const requestRes = await fetch(
              `${process.env.NEXT_PUBLIC_NODE_SERVER}/notification/requests/${session.db_id}/${initialUser._id}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            if (requestRes.ok) {
              const requestData = await requestRes.json();

              requestId = requestData.data[0]?._id;
            }
          }

          setUser((prevUser) => ({
            ...prevUser,
            isConnected,
            isRequestReceived,
            isRequestPending,
            requestId,
          }));
          setLoading(false);
        } else {
          toast.error("Failed to fetch updated user data");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching updated user data:", error);
        toast.error("An error occurred while fetching updated user data");
        setLoading(false);
      }
    };
    fetchCurrentUser(session.db_id);
  }, [session.db_id, initialUser._id]);

  const handleremoveClick = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/profile?seconduserId=${id}`, {
        method: "POST",
      });

      if (res.ok) {
        toast.success("Connection removed", {
          autoClose: 4000,
          closeOnClick: true,
        });
        setUser((prevUser) => ({
          ...prevUser,
          isConnected: false,
          connection: prevUser.connection.filter(
            (conn) => conn !== session?.db_id
          ),
        }));
      } else {
        toast.error("Failed to remove connection");
      }
    } catch (error) {
      toast.error("An error occurred while removing connection");
    } finally {
      setLoading(false);
    }
  };

  const handleConnectClick = async (profileId) => {
    setLoading(true);
    try {
      if (profileId && session) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_NODE_SERVER}/sendconnection/${session.db_id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ recipientId: profileId }),
          }
        );

        if (res.ok) {
          toast.success("Connection request sent", {
            autoClose: 4000,
            closeOnClick: true,
          });
          setUser((prevUser) => ({ ...prevUser, isRequestPending: true }));
        } else {
          toast.error("Failed to send connection request");
        }
      } else {
        toast.error("Profile ID is missing");
      }
    } catch (error) {
      toast.error("An error occurred while sending connection request");
    } finally {
      setLoading(false);
    }
  };

  const acceptHandle = async (action) => {
    setLoading(true);
    try {
      if (session.db_id && user.requestId) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_NODE_SERVER}/sendconnection/receive`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              friendshipId: user.requestId,
              userId: session.db_id,
              action: action,
            }),
            cache: "no-cache",
          }
        );

        if (res.status === 200) {
          toast.success(
            action === "accept" ? "Request accepted" : "Request declined"
          );

          if (action === "accept") {
            setUser((prevUser) => ({
              ...prevUser,
              isConnected: true,
              isRequestReceived: false,
              connection: [...prevUser.connection, session.db_id],
            }));
          } else {
            setUser((prevUser) => ({
              ...prevUser,
              isRequestPending: false,
              isRequestReceived: false,
            }));
          }
        } else {
          throw new Error("Failed to update request");
        }
      } else {
        console.log("No session or request id found");
      }
    } catch (error) {
      console.error(error.message);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="md:px-8 px-4 py-[14px] md:w-[85%] w-full mx-auto font-sans">
      <div>
        {user.isRequestReceived && (
          <div className="flex w-full justify-between items-center rounded-md shadow md:px-3 px-[6px]  md:py-4 py-2 md:text-base text-[14px] mb-4">
            <span>
              <span className="font-semibold">{user.name}</span> has sent you a
              connection request.
            </span>
            <div className="flex items-center md:gap-2 gap-1">
              <button
                onClick={() => acceptHandle("accept")}
                className=" p-1 transform transition-transform hover:scale-125"
                disabled={loading}
              >
                <FaCheck className="h-4 w-4" />
              </button>
              <button
                onClick={() => acceptHandle("decline")}
                className="p-1 transform transition-transform hover:scale-125"
                disabled={loading}
              >
                <FaTimes className="h-[17px] w-[17px]" />
              </button>
            </div>
          </div>
        )}
      </div>
      <section className="bg-white rounded-lg shadow-lg md:p-6 p-4 w-full relative">
        <h3 className="mt-1 font-semibold text-gray-700 text-base justify-end flex">
          {user.connection.length}{" "}
          {user.connection.length > 1 ? "connections" : "connection"}
        </h3>
        <div className="flex flex-col items-center text-center">
          <div className="relative max-h-[97px] ">
            <Avatar className="w-24 h-24">
              <AvatarImage alt={user.name} src={user?.profilePic} />
            </Avatar>
            <ProfilePictureView user={user} />
          </div>

          <h1 className="mt-4 font-bold text-2xl">{user.name}</h1>

          {user.bio && <p className="mt-2 text-gray-600 italic">{user.bio}</p>}
          <div className="flex justify-between gap-4 mt-4">
            {user.isConnected ? (
              <Button
                onClick={() => handleremoveClick(user._id)}
                disabled={loading}
              >
                Remove Connection
              </Button>
            ) : user.isRequestPending ? (
              <Button disabled={true}>Requested</Button>
            ) : !user.isRequestReceived ? (
              <Button
                onClick={() => handleConnectClick(user._id)}
                disabled={loading}
              >
                Connect
              </Button>
            ) : (
              ""
            )}

            {user.isConnected ? (
              <Button
                className="bg-blue-600"
                onClick={() => router.push("/chats")}
                disabled={loading}
              >
                Message
              </Button>
            ) : (
              ""
            )}
          </div>
        </div>
      </section>
      <Tabs defaultValue="c" className="w-full mt-4">
        <TabsList className="flex mx-auto w-min">
          <TabsTrigger value="c" className="text-md">
            Details
          </TabsTrigger>
          <TabsTrigger value="d" className="text-md">
            Discussions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="c" className=" w-full ">
          <DetailSection user={user} />
        </TabsContent>

        <TabsContent value="d" className=" w-full">
          <DiscussionSection user={user} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileDetailsTab;
