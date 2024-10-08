"use client";
import { MdOutlineInfo } from "react-icons/md";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { RiShareForwardLine } from "react-icons/ri";
import { IoChatboxOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { Drawer } from "vaul";
import { IoStatsChart } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import Loading from "@/app/(components)/Loading";
import LikedBy from "@/app/(components)/LikedBy";
import TimeAgo from "javascript-time-ago";
import EditDiscussion from "@/app/(components)/EditDiscussion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import en from "javascript-time-ago/locale/en";
import ReactTimeAgo from "react-time-ago";
import { useSession } from "@/app/(components)/SessionProvider";
import linkifyContent from "@/app/utils/Linkify";

TimeAgo.addLocale(en);
const DiscussionDetails = ({ params }) => {
  const router = useRouter();
  const { session, socket } = useSession();
  const { id } = params;
  const [open, setOpen] = useState(false);
  const [discussion, setDiscussion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [animationState, setAnimationState] = useState({});
  const [status, setStatus] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [likedByUsers, setLikedByUsers] = useState([]);
  const [isLikedByUser, setIsLikedByUser] = useState(false);
  const [isDislikedByUser, setIsDislikedByUser] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteDiscussionId, setDeleteDiscussionId] = useState("");

  const handleDelete = async () => {
    try {
      setDisabled(true);
      const res = await fetch(`/api/discussion/${deleteDiscussionId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        const data = await res.json();
        toast.success("Discussion deleted successfully", {
          autoClose: 4000,
          closeOnClick: true,
        });
        router.push("/my-engagements?tab=discussions");
        socket.emit("discussionDeleted", {
          discussionId: deleteDiscussionId,
          groupId: data.groupId,
        });
      }
    } catch (error) {
      console.error("Failed to delete discussion:", error);
      toast.error(error.message, {
        autoClose: 4000,
        closeOnClick: true,
      });
    } finally {
      setDisabled(false);
      setShowConfirmDelete(false);
    }
  };

  const handleGetDiscussionId = (id) => {
    setShowConfirmDelete(true);
    setDeleteDiscussionId(id);
  };

  useEffect(() => {
    if (id) {
      const fetchDiscussion = async () => {
        const res = await fetch(`/api/discussion/${id}`, {
          method: "GET",
        });
        const data = await res.json();

        setDiscussion(data.discussion);
        setLikedByUsers(data.discussion.likedBy);
        setStatus(data.status);
        setIsLikedByUser(data.isLikedByUser);
        setIsDislikedByUser(data.isDislikedByUser);
        setLoading(false);
      };

      fetchDiscussion();
    }
  }, [id]);

  const toggleLike = async (discussionId) => {
    setAnimationState((prev) => ({ ...prev, [discussionId]: "like" }));

    setDiscussion((prevDiscussion) => ({
      ...prevDiscussion,
      likes: isLikedByUser
        ? prevDiscussion.likes - 1
        : prevDiscussion.likes + 1,

      dislikes: isDislikedByUser
        ? prevDiscussion.dislikes - 1
        : prevDiscussion.dislikes,
    }));

    if (!isLikedByUser === true) {
      // user liked the discussion
      setLikedByUsers((prev) => {
        const isAlreadyLiked = prev.some((user) => user._id === session?.db_id);
        if (!isAlreadyLiked) {
          return [
            ...prev,
            {
              _id: session?.db_id,
              name: session?.name,
              profilePic: session?.profilePic,
            },
          ];
        }
        return prev;
      });
    } else if (!isLikedByUser === false) {
      //like is removed
      setLikedByUsers((prev) =>
        prev.filter((user) => user._id != session?.db_id)
      );
    }
    setIsLikedByUser(!isLikedByUser);
    if (isDislikedByUser) {
      setIsDislikedByUser(false);
    }

    await fetch(`/api/discussion/${discussionId}/like`, { method: "PUT" });

    setTimeout(() => {
      setAnimationState((prev) => ({ ...prev, [discussionId]: null }));
    }, 300);
  };

  const toggleDislike = async (discussionId) => {
    setAnimationState((prev) => ({ ...prev, [discussionId]: "dislike" }));

    setDiscussion((prevDiscussion) => ({
      ...prevDiscussion,
      dislikes: isDislikedByUser
        ? prevDiscussion.dislikes - 1
        : prevDiscussion.dislikes + 1,

      likes: isLikedByUser ? prevDiscussion.likes - 1 : prevDiscussion.likes,
    }));
    setIsDislikedByUser(!isDislikedByUser);
    if (isLikedByUser) {
      setIsLikedByUser(false);
      setLikedByUsers((prev) =>
        prev.filter((user) => user._id != session?.db_id)
      );
    }

    await fetch(`/api/discussion/${discussionId}/dislike`, {
      method: "PUT",
    });

    setTimeout(() => {
      setAnimationState((prev) => ({ ...prev, [discussionId]: null }));
    }, 300);
  };

  const handleButtonClick = async (id) => {
    const toastId = toast.loading("Sending request...", {
      autoClose: 4000,
      closeOnClick: true,
    });
    try {
      const res = await fetch(`/api/join-group?groupId=${id}`, {
        method: "GET",
      });

      //if the group is private and request is sent to moderators
      if (res.status === 200) {
        const data = await res.json();
        toast.update(toastId, {
          render: "Request sent successfully",
          type: "success",
          isLoading: false,
          autoClose: 5000,
          closeOnClick: true,
        });
        socket.emit("joinRequest", { request: data.result, user: session });
        setStatus("pending");
      } else if (res.status === 201) {
        //if the group is public and user is added to group

        toast.update(toastId, {
          render: "Joined group successfully",
          type: "success",
          isLoading: false,
          autoClose: 5000,
          closeOnClick: true,
        });

        setStatus("accepted");
      }
    } catch (error) {
      console.error(error);
      toast.update(toastId, {
        render: "Error sending request",
        type: "error",
        isLoading: false,
        autoClose: 5000,
        closeOnClick: true,
      });
    }
  };

  const handleShare = (discussion) => {
    if (navigator.share) {
      navigator
        .share({
          title: discussion.title,
          text: discussion.title,
          url: `${window.location.origin}/discussions/${discussion._id}`,
        })
        .catch(console.error);
    } else {
      navigator.clipboard.writeText(
        `${window.location.origin}/discussions/${discussion._id}`
      );
      toast.success("Link copied to clipboard!", {
        autoClose: 4000,
        closeOnClick: true,
      });
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!discussion) {
    return (
      <div className="flex   justify-center  mt-5">
        <p className="text-lg text-gray-500 dark:text-gray-400 mb-4">
          The discussion you are looking for may have been deleted or does not
          exist.
        </p>
      </div>
    );
  }

  return (
    <>
      <div
        className={`w-full lg:w-[80%] p-4 sm:mt-5 mt-3 ${
          showConfirmDelete ? "blur-md" : ""
        }`}
      >
        <div className="flex flex-col gap-2 md:gap-4 w-full rounded-lg discussion-card">
          <div className="flex justify-between border-b rounded-t-lg p-2 md:pt-3 md:px-4 ">
            <div className="flex">
              <Link href={`/profile/${discussion.creator._id}`}>
                <Image
                  alt="Avatar"
                  className="w-10 h-10 rounded-full md:w-[54px] md:h-[54px]"
                  height="48"
                  src={discussion.creator.profilePic}
                  style={{ aspectRatio: "54/54", objectFit: "cover" }}
                  width="54"
                />
              </Link>

              <div className="flex flex-col items-start ml-3">
                <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 dark:text-gray-400">
                  {discussion.creator.name}
                </p>
                <p className="text-xs sm:text-sm">
                  <ReactTimeAgo
                    date={new Date(discussion.createdAt)}
                    locale="en-US"
                  />
                </p>
              </div>
            </div>
            {/* discussion controls */}
            {session?.db_id == discussion.creator._id && (
              <div className="flex items-center gap-2">
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <MdEdit className="h-6 w-6 cursor-pointer" />
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[720px]">
                    <DialogHeader>
                      <DialogTitle>Edit Discussion</DialogTitle>
                      <DialogDescription>
                        Update your discussion.
                      </DialogDescription>
                    </DialogHeader>
                    <EditDiscussion
                      discussion={discussion}
                      setDiscussion={setDiscussion}
                    />
                  </DialogContent>
                </Dialog>
                <button
                  className="p-0"
                  onClick={() => handleGetDiscussionId(discussion._id)}
                >
                  <MdDeleteOutline className="w-6 h-6 text-red-500" />
                </button>
              </div>
            )}
          </div>

          <div
            className={`grid grid-cols-1 justify-between gap-6 w-full px-1 sm:px-4 pl-4 ${
              discussion.coverImage != "" ? "md:grid-cols-2" : ""
            }`}
          >
            {discussion.coverImage != "" && (
              <Image
                alt="Cover"
                className="w-full h-[270px] md:w-[520px] md:h-[370px] rounded-md mb-4"
                src={discussion.coverImage}
                // style={{ aspectRatio: "1", objectFit: "cover" }}
                width={280}
                height={200}
              />
            )}
            <div className="flex flex-col md:justify-between h-full gap-3">
              <div className="flex flex-col gap-2 md:gap-4 py-2">
                <h4 className=" text-md font-semibold">{discussion.title}</h4>
                <div className="prose max-w-none">
                  <p
                    dangerouslySetInnerHTML={{
                      __html: linkifyContent(discussion.content),
                    }}
                  ></p>
                </div>
              </div>

              <div className="flex justify-between items-center gap-4 pt-2 pb-4">
                <Button className="h-10" size="icon" variant="icon">
                  <ThumbsUpIcon
                    className={`w-4 h-4 cursor-pointer ${
                      isLikedByUser && "text-blue-400"
                    } ${
                      animationState[discussion._id] === "like" &&
                      "pop text-blue-400"
                    }`}
                    onClick={() => toggleLike(discussion._id)}
                  />
                  <span className="sr-only">Like</span>
                  <span className="ml-2">{discussion.likes}</span>
                </Button>
                <Button className="h-10" size="icon" variant="icon">
                  <ThumbsDownIcon
                    className={`w-4 h-4 cursor-pointer ${
                      isDislikedByUser && "text-red-400"
                    } ${
                      animationState[discussion._id] === "dislike" &&
                      "pop text-red-400"
                    }`}
                    onClick={() => toggleDislike(discussion._id)}
                  />
                  <span className="sr-only">Dislike</span>
                  <span className="ml-2">{discussion.dislikes}</span>
                </Button>

                {status === "accepted" ? (
                  <Link href={`/chats?discussionId=${discussion._id}`}>
                    <Button variant="icon" className="flex md:ml-4">
                      <IoChatboxOutline className="h-6 w-6" />
                    </Button>
                  </Link>
                ) : (
                  <Button
                    className={`${
                      status === "pending" ? "w-20" : "w-16 "
                    } h-8 md:h-10 md:w-20`}
                    variant="secondary"
                    disabled={status === "accepted" || status === "pending"}
                    onClick={() => handleButtonClick(discussion.groupId)}
                  >
                    {status === "pending" ? "Requested" : "Join"}
                  </Button>
                )}
                <Button
                  className="h-10"
                  size="icon"
                  variant="icon"
                  onClick={() => handleShare(discussion)}
                >
                  <RiShareForwardLine className="w-5 h-5 cursor-pointer text-gray-800" />
                </Button>
                {likedByUsers.length > 0 && (
                  <Drawer.Root direction="right">
                    <Drawer.Trigger asChild>
                      <Button className="h-10" size="icon" variant="icon">
                        <IoStatsChart className="w-5 h-5 cursor-pointer text-gray-800" />
                      </Button>
                    </Drawer.Trigger>
                    <Drawer.Portal>
                      <Drawer.Overlay className="fixed inset-0 " />
                      <Drawer.Content className="rounded-se-lg bg-gray-100 dark:bg-gray-800  h-full max-w-[80%] w-[380px] fixed bottom-0 right-0  overflow-y-auto overflow-x-hidden scrollbar pb-5 mt-24 z-50 scrollbar-thumb-gray-300 scrollbar-thumb-rounded-full shadow-lg shadow-gray-600">
                        <Drawer.Title className="sr-only">
                          Liked By
                        </Drawer.Title>
                        <Drawer.Description className="sr-only">
                          All user that liked the discussion
                        </Drawer.Description>
                        <LikedBy likedByUsers={likedByUsers} />
                      </Drawer.Content>
                    </Drawer.Portal>
                  </Drawer.Root>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showConfirmDelete && (
        <div className="fixed inset-0 flex font-sans items-center justify-center z-50 bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm">
          <div className="p-4 bg-white rounded-lg dark:bg-gray-800 max-w-lg w-full">
            <h2 className="text-lg font-semibold">Confirm Deletion</h2>
            <p className="mt-1">
              Are you sure you want to delete this discussion?
            </p>
            <span className=" mt-2 text-sm text-red-500 ">
              <MdOutlineInfo className="text-red-500 mr-1 inline" />
              Deleting this discussion will also permanently delete the
              associated group.
            </span>
            <div className="flex justify-end mt-4">
              <Button
                variant="secondary"
                onClick={() => setShowConfirmDelete(false)}
              >
                Cancel
              </Button>
              <Button
                className="ml-2"
                variant="destructive"
                onClick={handleDelete}
                disabled={disabled}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DiscussionDetails;

function ThumbsDownIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 14V2" />
      <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
    </svg>
  );
}

function ThumbsUpIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 10v12" />
      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
    </svg>
  );
}
