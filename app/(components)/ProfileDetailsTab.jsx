"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";

import { Avatar, AvatarImage } from "@/components/ui/avatar";

import { useSession } from "./SessionProvider";
import { Button } from "@/components/ui/button";

const ProfileDetailsTab = ({ user }) => {
  const [loading, setLoading] = useState(true);

  const { session } = useSession();
  const [isConnected, setIsConnected] = useState({
    connection: [],
    requestPending: [],
  });
  const [check, setCheck] = useState(false);

  useEffect(() => {
    const fetchUpdatedUser = async (id) => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/profile?id=${id}`
        );
        if (res.ok) {
          const updatedUser = await res.json();
          setIsConnected(updatedUser.result);
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
    fetchUpdatedUser(session.db_id);
  }, [session.db_id, check]);

  const handleremoveClick = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/profile?seconduserId=${id}`,
        {
          method: "POST",
        }
      );

      if (res.ok) {
        toast.success("Connection removed", {
          autoClose: 4000,
          closeOnClick: true,
        });
        setCheck((prevCheck) => !prevCheck);
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
          `http://localhost:5001/sendconnection/${session.db_id}`,
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
          setCheck((prevCheck) => !prevCheck);
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

  // Memoize isConnected for optimized rendering
  const memoizedIsConnected = useMemo(() => isConnected, [isConnected]);
  return (
    <div className="md:px-8 px-4 py-4 md:w-[85%] w-full mx-auto">
      <section className="bg-white rounded-lg shadow-lg p-6 w-full relative">
        <div className="flex flex-col items-center text-center">
          <Avatar>
            <AvatarImage alt={user.name} src={user.profilePic} />
          </Avatar>
          <h1 className="mt-4 font-bold text-2xl">{user.name}</h1>
          {user.bio && <p className="mt-2 text-gray-600 italic">{user.bio}</p>}
          <div className="gap-4 mt-7">
            {session?.db_id !== user._id && (
              <>
                {memoizedIsConnected.connection.includes(user._id) ? (
                  <Button
                    onClick={() => handleremoveClick(user._id)}
                    disabled={loading}
                  >
                    Remove Connection
                  </Button>
                ) : memoizedIsConnected.requestPending.includes(user._id) ? (
                  <Button disabled={true}>Requested</Button>
                ) : (
                  <Button
                    onClick={() => handleConnectClick(user._id)}
                    disabled={loading}
                  >
                    Connect
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </section>
      <Tabs defaultValue="c" className="w-full">
        <TabsList className="flex mx-auto w-min">
          <TabsTrigger value="c">Details</TabsTrigger>
          <TabsTrigger value="d">Discussions</TabsTrigger>
        </TabsList>

        <TabsContent value="c" className=" w-full ">
          hi
        </TabsContent>

        <TabsContent value="g" className=" w-full">
          bye
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileDetailsTab;
