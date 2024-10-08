"use client";
import React, { useEffect, useState } from "react";
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
import { useRouter } from "next/navigation";
import linkifyContent from "../utils/Linkify";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";

const GroupDetails = ({
  groupDetails,
  setShowGroupDetails,
  setGroups,
  setSelectedGroup,
  setToggleChatView,
}) => {
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [group, setGroup] = useState(null);
  const [name, setName] = useState("");

  useEffect(() => {
    if (groupDetails) {
      setDescription(groupDetails.description);
      setIsPublic(groupDetails.isPublic);
      setGroup(groupDetails);
      setName(groupDetails.name);
    }
  }, [groupDetails]);
  const handleShare = (id) => {
    if (navigator.share) {
      navigator
        .share({
          title: groupDetails.name,
          url: `${window.location.origin}/discussions/${id}`,
        })
        .catch(console.error);
    } else {
      navigator.clipboard.writeText(
        `${window.location.origin}/discussions/${id}`
      );
      toast.success("Link copied to clipboard!", {
        autoClose: 4000,
        closeOnClick: true,
      });
    }
  };
  const handleKickMember = async (memberId) => {
    try {
      const response = await fetch(`/api/groups/${group._id}/${memberId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setGroup((prevGroup) => ({
          ...prevGroup,
          participants: prevGroup.participants.filter(
            (participant) => participant._id !== memberId
          ),
        }));
        toast.success("Member removed successfully", {
          autoClose: 5000,
          closeOnClick: true,
        });
      }
    } catch (error) {
      toast.error("Failed to remove member", {
        autoClose: 4000,
        closeOnClick: true,
      });
      console.error(error);
    }
  };
  const router = useRouter();

  const handleExitGroup = async () => {
    try {
      const response = await fetch(`/api/groups/${group._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setGroups((prevGroups) =>
          prevGroups.filter((g) => g._id !== group._id)
        );
        setSelectedGroup(null);
        setToggleChatView(true);
        router.replace("/chats");
        window.location.reload();
        toast.success("You are no longer a member", {
          autoClose: 5000,
          closeOnClick: true,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error exiting group", {
        autoClose: 4000,
        closeOnClick: true,
      });
    }
  };
  const handleModeratorStatus = async (memberId, action) => {
    try {
      const response = await fetch(
        `/api/groups/${group._id}/${memberId}?action=${action}`,
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
          toast.success("Member is now a moderator", {
            autoClose: 5000,
            closeOnClick: true,
          });
        } else {
          setGroup((prevGroup) => ({
            ...prevGroup,
            moderators: prevGroup.moderators.filter(
              (moderator) => moderator !== memberId
            ),
          }));
          toast.success("Moderator is no longer a moderator", {
            autoClose: 5000,
            closeOnClick: true,
          });
        }
      }
    } catch (error) {
      toast.error("Error updating moderator status", {
        autoClose: 4000,
        closeOnClick: true,
      });
      console.error(error);
    }
  };
  const handleUpdateName = async () => {
    try {
      const response = await fetch(`/api/groups/${group._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        setGroup((prevGroup) => ({ ...prevGroup, name }));
        toast.success("Group name updated successfully", {
          autoClose: 5000,
          closeOnClick: true,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating group name", {
        autoClose: 4000,
        closeOnClick: true,
      });
    }
  };
  const handleUpdateDescription = async () => {
    try {
      const response = await fetch(`/api/groups/${group._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description }),
      });

      if (response.ok) {
        setGroup((prevGroup) => ({ ...prevGroup, description }));
        toast.success("Group description updated successfully", {
          autoClose: 5000,
          closeOnClick: true,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating group description", {
        autoClose: 4000,
        closeOnClick: true,
      });
    }
  };

  const togglePrivacy = async () => {
    try {
      const response = await fetch(`/api/groups/${group._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isPublic: !isPublic }),
      });

      if (response.ok) {
        setIsPublic(!isPublic);
        setGroup((prevGroup) => ({ ...prevGroup, isPublic: !isPublic }));
        toast.success(`Group is now ${isPublic ? "Private" : "Public"}`, {
          //reversed value of toast because state variable doesn't change immediately
          autoClose: 5000,
          closeOnClick: true,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating group privacy", {
        autoClose: 4000,
        closeOnClick: true,
      });
    }
  };

  const currentUser = group?.currentUser;

  const isCurrentUserCreator = group?.creator === currentUser;
  const isCurrentUserModerator = group?.moderators?.includes(currentUser);

  return (
    <>
      <div className="flex flex-col justify-between bg-gray-100 dark:bg-gray-800 pb-2 relative">
        <div className="flex justify-between p-6 items-center gap-1 ">
          <IoArrowBackCircleOutline
            className="cursor-pointer"
            size={30}
            onClick={() => setShowGroupDetails(false)}
          />
          <div className="flex justify-center gap-4 ml-[-10px] w-[95%] items-center ">
            <span className="font-semibold text-base md:text-xl ">
              {group?.name}
            </span>
            {(isCurrentUserCreator || isCurrentUserModerator) && (
              <Dialog>
                <DialogTrigger asChild>
                  <MdEdit className="cursor-pointer" />
                </DialogTrigger>
                <DialogContent className="w-[67%]">
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
                    maxLength={30}
                  />
                  <DialogFooter>
                    <Button onClick={handleUpdateName}>Save</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
          {!isCurrentUserCreator && (
            <AlertDialog>
              <AlertDialogTrigger>
                <IoMdExit
                  size={24}
                  className="cursor-pointer font-extralight"
                />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to leave the group?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Once you leave the group, you will no longer have access to
                    its content.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-500"
                    onClick={handleExitGroup}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        <div className="p-4 mx-2 border-2 h-[34rem] rounded-sm overflow-y-auto bg-white">
          {isCurrentUserCreator && (
            <div className="flex items-center justify-end">
              <Label htmlFor="privacy-switch" className="mr-2 text-sm">
                {isPublic ? "Public" : "Private"}
              </Label>
              <Switch
                id="privacy-switch"
                checked={!isPublic}
                onCheckedChange={togglePrivacy}
              />
            </div>
          )}
          <div className="my-4">
            <div className="flex justify-between items-center">
              <p className="font-medium mb-2">Description :</p>{" "}
              {(isCurrentUserCreator || isCurrentUserModerator) && (
                <Dialog>
                  <DialogTrigger asChild>
                    <MdEdit className="cursor-pointer" />
                  </DialogTrigger>
                  <DialogContent className="w-[70%]">
                    <DialogHeader>
                      <DialogTitle>Edit Group Description</DialogTitle>
                      <DialogDescription>
                        Update the group description below:
                      </DialogDescription>
                    </DialogHeader>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="mt-4"
                      maxLength={150}
                      rows={3}
                    />
                    <DialogFooter>
                      <Button onClick={handleUpdateDescription}>Save</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            <p className="text-sm shadow-md px-2 font-sans py-3 rounded-lg bg-gray-100">
              {group?.description}
            </p>
          </div>
          <div className="my-3 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {" "}
              <Button
                size="icon"
                variant="icon"
                onClick={() => handleShare(groupDetails.discussionId)}
              >
                Invite
              </Button>
            </div>
            <div className="text-sm text-gray-500">
              Created on{" "}
              {new Date(group?.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
          <div className="text-sm font-semibold">
            {group?.participants?.length === 1
              ? "1 Member"
              : `${group?.participants?.length} Members`}
          </div>

          <div className="my-3">
            <ul className="list-none mt-2 space-y-2">
              {group?.participants?.map((participant) => (
                <li
                  key={participant._id}
                  className="flex items-center justify-between text-sm"
                >
                  <Link
                    href={`/profile/${participant._id}`}
                    className="flex items-center gap-2"
                  >
                    <Image
                      alt="Participant Avatar"
                      src={participant.profilePic}
                      className="rounded-full"
                      width={32}
                      height={32}
                    />
                    <span>
                      {participant.name}{" "}
                      {group?.creator === participant._id && (
                        <span className="text-xs text-gray-500 ml-3">
                          Creator
                        </span>
                      )}
                      {group?.creator !== participant._id &&
                        group?.moderators?.includes(participant._id) && (
                          <span className="text-xs text-gray-500 ml-3">
                            Moderator
                          </span>
                        )}
                    </span>
                  </Link>
                  {(isCurrentUserCreator || isCurrentUserModerator) &&
                    participant._id !== currentUser &&
                    group?.creator !== participant._id && (
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          {/* <Button variant="ghost" size="sm"> */}
                          •••
                          {/* </Button> */}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {isCurrentUserCreator && (
                            <>
                              {group?.moderators?.includes(participant._id) ? (
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
                                    handleModeratorStatus(
                                      participant._id,
                                      "make"
                                    )
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
    </>
  );
};

export default GroupDetails;
