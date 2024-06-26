"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MdEdit } from "react-icons/md";
import { toast } from "react-toastify";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";

const GroupDetails = ({ groupDetails, setShowGroupDetails }) => {
  const [description, setDescription] = useState(groupDetails.description);
  const [isPrivate, setIsPrivate] = useState(groupDetails.isPrivate);
  const [group, setGroup] = useState(groupDetails);

  const handleKickMember = async (memberId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/groups/${group._id}/${memberId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setGroup((prevGroup) => ({
          ...prevGroup,
          participants: prevGroup.participants.filter(
            (participant) => participant._id !== memberId
          ),
        }));
        toast.success("Member removed successfully", { autoClose: 5000 });
      }
    } catch (error) {
      toast.error("Failed to kick member");
      console.error(error);
    }
  };

  const handleModeratorStatus = async (memberId, action) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/groups/${group._id}/${memberId}?action=${action}`,
        {
          method: "PUT",
        }
      );

      if (response.ok) {
        if (action === "make") {
          setGroup((prevGroup) => ({
            ...prevGroup,
            moderators: [...prevGroup.moderators, memberId],
          }));
          toast.success("Member is now a moderator", { autoClose: 5000 });
        } else {
          setGroup((prevGroup) => ({
            ...prevGroup,
            moderators: prevGroup.moderators.filter(
              (moderator) => moderator !== memberId
            ),
          }));
          toast.success("Moderator is no longer a moderator", {
            autoClose: 5000,
          });
        }
      }
    } catch (error) {
      toast.error("Error updating moderator status");
      console.error(error);
    }
  };

  const handleUpdateDescription = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/groups/${group._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ description }),
        }
      );

      if (response.ok) {
        setGroup((prevGroup) => ({ ...prevGroup, description }));
        toast.success("Group description updated successfully", {
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating group description:");
    }
  };

  const togglePrivacy = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/groups/${group._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isPrivate: !isPrivate }),
        }
      );

      if (response.ok) {
        setGroup((prevGroup) => ({ ...prevGroup, isPrivate: !isPrivate }));
        setIsPrivate(!isPrivate);
        toast.success(`Group is now ${!isPrivate ? "Private" : "Public"}`, {
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating group privacy:");
    }
  };

  const currentUser = group.currentUser;

  const isCurrentUserCreator = group.creator === currentUser;
  const isCurrentUserModerator = group.moderators.includes(currentUser);

  return (
    <div className="flex flex-col justify-between bg-gray-100   dark:bg-gray-800 pb-2 relative">
      <h2 className="text-center font-semibold text-xl py-4">{group.name}</h2>

      <IoArrowBackCircleOutline
        className="w-6 h-6 left-[7px] cursor-pointer top-5 absolute"
        onClick={() => setShowGroupDetails(false)}
      />

      <div className="p-4 mx-2 border-2 h-[30rem] rounded-sm overflow-y-scroll bg-white">
        {isCurrentUserCreator && (
          <div className="flex items-center justify-end">
            <Label htmlFor="privacy-switch" className="mr-2 text-sm">
              {isPrivate ? "Private" : "Public"}
            </Label>
            <Switch
              id="privacy-switch"
              checked={isPrivate}
              onCheckedChange={togglePrivacy}
            />
          </div>
        )}
        <div className="my-4    ">
          <div className="flex justify-between items-center">
            {" "}
            <p className="font-medium mb-2">Group Description:</p>{" "}
            {(isCurrentUserCreator || isCurrentUserModerator) && (
              <Dialog>
                <DialogTrigger asChild>
                  <MdEdit className="cursor-pointer" />
                </DialogTrigger>
                <DialogContent className="w-[45%]">
                  <DialogHeader>
                    <DialogTitle>Edit Group Description</DialogTitle>
                    <DialogDescription>
                      Update the group description below:
                    </DialogDescription>
                  </DialogHeader>
                  <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-4"
                  />
                  <DialogFooter>
                    <Button onClick={handleUpdateDescription}>Save</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <p className="text-sm shadow-md px-2 font-sans py-3 rounded-lg bg-gray-100">
            {group.description}
          </p>
        </div>
        <div className="my-3 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Created on{" "}
            {new Date(group.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
        <div className="text-sm font-semibold">
          {group.participants.length === 1
            ? "1 Member"
            : `${group.participants.length} Members`}
        </div>

        <div className="my-3">
          <ul className="list-none mt-2 space-y-2">
            {group.participants.map((participant) => (
              <li
                key={participant._id}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <Image
                    alt="Participant Avatar"
                    src={participant.profilePic}
                    className="rounded-full"
                    width={32}
                    height={32}
                  />
                  <span>
                    {participant.name}{" "}
                    {group.creator === participant._id && (
                      <span className="text-xs text-gray-500 ml-3">
                        Creator
                      </span>
                    )}
                    {group.creator !== participant._id &&
                      group.moderators.includes(participant._id) && (
                        <span className="text-xs text-gray-500 ml-3">
                          Moderator
                        </span>
                      )}
                  </span>
                </div>
                {(isCurrentUserCreator || isCurrentUserModerator) &&
                  participant._id !== currentUser &&
                  group.creator !== participant._id && (
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button variant="ghost" size="sm">
                          •••
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {isCurrentUserCreator && (
                          <>
                            {group.moderators.includes(participant._id) ? (
                              <DropdownMenuItem
                                onSelect={() =>
                                  handleModeratorStatus(
                                    participant._id,
                                    "remove"
                                  )
                                }
                              >
                                Remove Moderator
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onSelect={() =>
                                  handleModeratorStatus(participant._id, "make")
                                }
                              >
                                Make Moderator
                              </DropdownMenuItem>
                            )}
                          </>
                        )}

                        <DropdownMenuItem
                          onSelect={() => handleKickMember(participant._id)}
                        >
                          Kick Member
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GroupDetails;
