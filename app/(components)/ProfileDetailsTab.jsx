"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import DetailSection from "./DetailSection";
import DiscussionSection from "./DiscussionSection";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ProfileUpdate, ProfileUpdateTrigger, ProfileUpdateContentData, ProfileUpdateArrow } from "@/components/ui/profileupdate";
import { useSession } from "./SessionProvider";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Disc } from "lucide-react";
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';


const ProfileDetailsTab = ({ user: initialUser }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(initialUser);
  const [isProfileUpdateOpen, setIsProfileUpdateOpen] = useState(false);
  const [isImageViewOpen, setIsImageViewOpen] = useState(false);
  const { session } = useSession();

  const handleViewProfileClick = () => {
    setIsImageViewOpen(true);
  };
  const handleProfileUpdateDialogClose = () => {
    setIsImageViewOpen(false);
   
  };

  useEffect(() => {
    const fetchCurrentUser = async (id) => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/profile?id=${id}`
        );
        if (res.ok) {
          const currentUser = await res.json();
          const isConnected = currentUser.result.connection.includes(
            initialUser._id
          );
          const isRequestPending = currentUser.result.requestPending.includes(
            initialUser._id
          );
          setUser((prevUser) => ({
            ...prevUser,
            isConnected,
            isRequestPending,
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
        setUser((prevUser) => ({ ...prevUser, isConnected: false }));
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

  return (
    <div className="md:px-8 px-4 py-4 md:w-[85%] w-full mx-auto">
      <section className="bg-white rounded-lg shadow-lg md:p-6 p-4 w-full relative">
        <div className="flex flex-col items-center text-center">
          <Avatar>
            <AvatarImage alt={user.name} src={user.profilePic} />
          </Avatar>
          <ProfileUpdate>
                  <ProfileUpdateTrigger>
                    <div className="cursor-pointer absolute top-20 bg-white p-1 rounded-full">
                      <ImageUpdateIcon />
                    </div>
                  </ProfileUpdateTrigger>
                  <ProfileUpdateContentData>
                    <ProfileUpdateArrow />
                    <div className="flex flex-col">
                     
                      <p className="m-auto m-2 p-2 cursor-pointer" onClick={handleViewProfileClick}>View Profile</p>
                    </div>
                  </ProfileUpdateContentData>
                </ProfileUpdate>
          <h1 className="mt-4 font-bold text-2xl">{user.name}</h1>
          <h3 className="mt-1 font-semibold text-gray-700 text-base">
            {user.connection.length}{" "}
            {user.connection.length > 1 ? "connections" : "connection"}
          </h3>
          {user.bio && <p className="mt-2 text-gray-600 italic">{user.bio}</p>}
          <div className="gap-4 mt-4">
            {user.isConnected ? (
              <Button
                onClick={() => handleremoveClick(user._id)}
                disabled={loading}
              >
                Remove Connection
              </Button>
            ) : user.isRequestPending ? (
              <Button disabled={true}>Requested</Button>
            ) : (
              <Button
                onClick={() => handleConnectClick(user._id)}
                disabled={loading}
              >
                Connect
              </Button>
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

      <Dialog.Root open={isImageViewOpen} onOpenChange={setIsImageViewOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded shadow-lg" style={{ maxWidth: "32rem" }}>
            <Dialog.Description className="mt-2">
              <Image
                src={user.profilePic}
                width={500}
                height={500}
                alt="Picture of user"
              />
            </Dialog.Description>
            <Dialog.Close asChild>
              <button className="absolute top-2 right-2 p-1 focus:outline-none" onClick={handleProfileUpdateDialogClose}>
                <Cross2Icon />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

function ImageUpdateIcon(props) {
  return (
    <svg
      {...props}
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 1C0.447715 1 0 1.44772 0 2V13C0 13.5523 0.447715 14 1 14H14C14.5523 14 15 13.5523 15 13V2C15 1.44772 14.5523 1 14 1H1ZM7.5 10.625C9.22589 10.625 10.625 9.22589 10.625 7.5C10.625 5.77411 9.22589 4.375 7.5 4.375C5.77411 4.375 4.375 5.77411 4.375 7.5C4.375 9.22589 5.77411 10.625 7.5 10.625Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}

export default ProfileDetailsTab;
