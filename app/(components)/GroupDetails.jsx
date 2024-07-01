"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MdEdit } from "react-icons/md";
import { IoMdExit } from "react-icons/io";
import { toast } from "react-toastify";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

const GroupDetails = ({
  groupDetails,
  setShowGroupDetails,
  setGroups,
  setIsRoomSelected,
  setRoomID,
}) => {
  const [description, setDescription] = useState(groupDetails.description);
  const [isPrivate, setIsPrivate] = useState(groupDetails.isPrivate);
  const [group, setGroup] = useState(groupDetails);
  const [name, setName] = useState(groupDetails.name);
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
      toast.error("Failed to remove member");
      console.error(error);
    }
  };
  const handleExitGroup = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/groups/${group._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setGroups((prevGroups) =>
          prevGroups.filter((g) => g._id !== group._id)
        );
        setIsRoomSelected(false);
        setRoomID(null);
        toast.success("You are no longer a member", {
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error exiting group");
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
  const handleUpdateName = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/groups/${group._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name }),
        }
      );

      if (response.ok) {
        setGroup((prevGroup) => ({ ...prevGroup, name }));
        toast.success("Group name updated successfully", {
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating group name");
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
      toast.error("Error updating group description");
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
      toast.error("Error updating group privacy");
    }
  };

  const currentUser = group.currentUser;

  const isCurrentUserCreator = group.creator === currentUser;
  const isCurrentUserModerator = group.moderators.includes(currentUser);

  return (
    <div className="flex flex-col justify-between bg-gray-100 max-h-[32rem]  dark:bg-gray-800 pb-2 relative">
      <div className="flex justify-center py-4 items-center gap-1">
        <span className=" font-semibold text-xl ">{group.name}</span>
        {(isCurrentUserCreator || isCurrentUserModerator) && (
          <Dialog>
            <DialogTrigger asChild>
              <MdEdit className="cursor-pointer" />
            </DialogTrigger>
            <DialogContent className="w-[45%]">
              <DialogHeader>
                <DialogTitle>Edit Group Name</DialogTitle>
                <DialogDescription>
                  Update the group name below:
                </DialogDescription>
              </DialogHeader>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-4"
              />
              <DialogFooter>
                <Button onClick={handleUpdateName}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <IoArrowBackCircleOutline
        className="w-6 h-6 left-[7px] cursor-pointer top-5 absolute"
        onClick={() => setShowGroupDetails(false)}
      />

      {!isCurrentUserCreator && (
        <AlertDialog>
          <AlertDialogTrigger>
            <IoMdExit className="w-[22px] h-[22px] right-[7px] cursor-pointer top-5 absolute font-extralight" />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to leave the group?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Once you leave the group, you will no longer have access to its
                discussions and content.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleExitGroup}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <div className="p-4 mx-2 border-2 h-[32rem] rounded-sm overflow-y-auto bg-white">
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
                          Remove Member
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
