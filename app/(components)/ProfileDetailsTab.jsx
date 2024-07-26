"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import DetailSection from "./DetailSection";
import DiscussionSection from "./DiscussionSection";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import ProfilePictureView from "./ProfilePictureView";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { FaTimes, FaCheck } from "react-icons/fa";
import { useSession as useCustomSession } from "./SessionProvider";

const ProfileDetailsTab = ({ user: initialUser }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(initialUser);
  const { socket } = useCustomSession();
  const { data: session, update } = useSession();

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
              `${process.env.NEXT_PUBLIC_NODE_SERVER}/notification/requests/${session.user.db_id}/${initialUser._id}`,
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
          toast.error("Failed to fetch updated user data", {
            autoClose: 4000,
            closeOnClick: true,
          });
          setLoading(false);
        }
      } catch (error) {
        // console.error("Error fetching updated user data:", error);
        toast.error("An error occurred while fetching updated user data", {
          autoClose: 4000,
          closeOnClick: true,
        });
        setLoading(false);
      }
    };
    if (session?.user?.db_id) {
      fetchCurrentUser(session.user.db_id);
    }
  }, [session?.user?.db_id, initialUser._id]);

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
            (conn) => conn !== session?.user?.db_id
          ),
        }));

        update({
          connection: session.user.connection.filter((conn) => conn !== id),
        });

        socket.emit("unfollow", {
          secondUserId: id,
          userId: session.user.db_id,
        });
      } else {
        toast.error("Failed to remove connection", {
          autoClose: 4000,
          closeOnClick: true,
        });
      }
    } catch (error) {
      toast.error("An error occurred while removing connection", {
        autoClose: 4000,
        closeOnClick: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConnectClick = async (profileId) => {
    setLoading(true);
    try {
      if (profileId && session) {
        //========UNSEND CONNECTION REQUEST============
        if (user.isRequestPending) {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_NODE_SERVER}/sendconnection/unsendconnection/${session.user.db_id}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ recipientId: profileId }),
              cache: "no-cache",
            }
          );
          if (res.ok) {
            toast.success("Connection request removed", {
              autoClose: 4000,
              closeOnClick: true,
            });
            setUser((prevUser) => ({ ...prevUser, isRequestPending: false }));
          } else {
            toast.error("Failed to send connection request", {
              autoClose: 4000,
              closeOnClick: true,
            });
          }
        } else {
          // ===========SEND CONNECTION REQUEST=======
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_NODE_SERVER}/sendconnection/${session.user.db_id}`,
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
            toast.error("Failed to send connection request", {
              autoClose: 4000,
              closeOnClick: true,
            });
          }
        }
      } else {
        toast.error("Profile ID is missing", {
          autoClose: 4000,
          closeOnClick: true,
        });
      }
    } catch (error) {
      toast.error("An error occurred while sending connection request", {
        autoClose: 4000,
        closeOnClick: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const acceptHandle = async (action) => {
    setLoading(true);
    try {
      if (session.user.db_id && user.requestId) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_NODE_SERVER}/sendconnection/receive`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              friendshipId: user.requestId,
              userId: session.user.db_id,
              action: action,
            }),
            cache: "no-cache",
          }
        );

        if (res.status === 200) {
          toast.success(
            action === "accept" ? "Request accepted" : "Request declined",
            {
              autoClose: 4000,
              closeOnClick: true,
            }
          );

          if (action === "accept") {
            update({
              connection: [...session.user.connection, user._id],
            });
            setUser((prevUser) => ({
              ...prevUser,
              isConnected: true,
              isRequestReceived: false,
              connection: [...prevUser.connection, session.user.db_id],
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
      toast.error("An error occurred", {
        autoClose: 4000,
        closeOnClick: true,
      });
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
            <div className="flex items-center md:gap-3 gap-2">
              <button
                onClick={() => acceptHandle("accept")}
                className="flex items-center p-2 border hover:border-green-400 shadow-md rounded-md transform transition-transform hover:scale-125"
                disabled={loading}
              >
                <FaCheck className="h-4 w-4 text-green-500" />
              </button>
              <button
                onClick={() => acceptHandle("decline")}
                className="flex items-center p-2 border hover:border-red-400 shadow-md rounded-md transform transition-transform hover:scale-125"
                disabled={loading}
              >
                <FaTimes className="h-[17px] w-[17px] text-red-500" />
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

          <h1 className="sm:mt-4 mt-3 font-bold  text-2xl">{user.name}</h1>

          {user.bio && (
            <p className="sm:mt-2 mt-[6px] text-gray-600 italic ">{user.bio}</p>
          )}
          <div className="flex justify-between gap-4 sm:mt-4 mt-3">
            {user.isConnected ? (
              <Button
                onClick={() => handleremoveClick(user._id)}
                disabled={loading}
              >
                Remove
              </Button>
            ) : user.isRequestPending ? (
              <Button
                onClick={() => handleConnectClick(user._id)}
                disabled={loading}
                className={
                  user.isRequestPending
                    ? "bg-gray-500 text-white cursor-pointer"
                    : ""
                }
              >
                Requested
              </Button>
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
