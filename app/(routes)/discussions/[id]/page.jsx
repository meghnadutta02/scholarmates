"use client";
import { MdOutlineInfo } from "react-icons/md";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { RiShareForwardLine } from "react-icons/ri";
import { MdDeleteOutline } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import Loading from "@/app/(components)/Loading";
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
import ru from "javascript-time-ago/locale/ru";
import ReactTimeAgo from "react-time-ago";
import { useSession } from "@/app/(components)/SessionProvider";
import Link from "next/link";
TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);
const DiscussionDetails = ({ params }) => {
  const router = useRouter();
  const { session } = useSession();
  const { id } = params;
  const [open, setOpen] = useState(false);
  const [discussion, setDiscussion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [animationState, setAnimationState] = useState({});
  const [status, setStatus] = useState("");
  const [disabled, setDisabled] = useState(false);
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
        toast.success("Discussion deleted successfully", {
          autoClose: 4000,
          closeOnClick: true,
        });
        router.push("/my-engagements");
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
    }

    await fetch(`/api/discussion/${discussionId}/dislike`, {
      method: "PUT",
    });

    setTimeout(() => {
      setAnimationState((prev) => ({ ...prev, [discussionId]: null }));
    }, 300);
  };

  const handleButtonClick = async (discussion) => {
    try {
      const toastId = toast.loading("Sending request...");

      const res = await fetch(
        `/api/join-group?discussionId=${discussion._id}`,
        {
          method: "GET",
        }
      );

      if (!res.ok) {
        toast.update(toastId, {
          render: "Error sending request",
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
        throw new Error("Error sending request");
      }

      const r = await res.json();
      toast.update(toastId, {
        render: r.message,
        type: r.status === 200 ? "success" : "error",
        isLoading: false,
        autoClose: 5000,
      });

      setStatus(r.status === 200 ? "pending" : "");
    } catch (error) {
      console.error(error);
      toast.error("Error sending request");
    }
  };

  const handleShare = (discussion) => {
    if (navigator.share) {
      navigator
        .share({
          title: discussion.title,
          text: discussion.content,
          url: `${window.location.origin}/discussions/${discussion._id}`,
        })
        .catch(console.error);
    } else {
      navigator.clipboard.writeText(
        `${window.location.origin}/discussions/${discussion._id}`
      );
      toast.success("Link copied to clipboard!");
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!discussion) {
    return (
      <div className="flex   justify-center  mt-5">
        <p className="text-lg text-gray-500 dark:text-gray-400 mb-4">
          Discussion not found
        </p>
      </div>
    );
  }

  return (
    <>
      <div
        className={`container mx-auto p-4 ${
          showConfirmDelete ? "blur-md" : ""
        }`}
      >
        {discussion.coverImage !== "" ? (
          <div className="flex flex-col gap-2 md:gap-4">
            <div className="flex justify-between py-1 px-2 shadow-sm rounded-md md:py-[10px] md:px-8">
              <Link href={`/profile/${discussion.creator._id}`}>
                <div className="flex items-center gap-2 rounded-md">
                  <Image
                    alt="Avatar"
                    className="w-10 h-10 rounded-full md:w-[54px] md:h-[54px]"
                    height="48"
                    src={discussion.creator.profilePic}
                    style={{ aspectRatio: "54/54", objectFit: "cover" }}
                    width="54"
                  />
                  <span className="text-gray-700 dark:text-gray-400">
                    {discussion.creator.name}
                  </span>
                </div>
              </Link>
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <span>
                  <ReactTimeAgo
                    date={new Date(discussion.createdAt)}
                    locale="en-US"
                  />
                </span>
              </div>
            </div>

            <div className="flex flex-col justify-center gap-6 mt-3 md:flex-row ">
              <Image
                alt="Cover"
                className="w-full h-[200px] md:w-[520px] md:h-[358px]"
                src={discussion.coverImage}
                style={{ aspectRatio: "1", objectFit: "cover" }}
                width={280}
                height={200}
              />

              <div className=" flex flex-col gap-7  ">
                {/* discussion controls */}
                {session?.db_id == discussion.creator._id && (
                  <div className="  flex justify-end gap-2 ">
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
                      <MdDeleteOutline className="w-6 h-6" />
                    </button>
                  </div>
                )}
                <div className="flex flex-col md:justify-between h-full  gap-3">
                  <div className="flex flex-col gap-2 md:gap-4  ">
                    <h4 className=" text-md font-semibold">
                      {discussion.title}
                    </h4>
                    <div className="prose max-w-none">
                      <p>{discussion.content}</p>
                    </div>
                  </div>

                  <div className="grid w-full gap-4 md:gap-8 grid-cols-4 ">
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
                    <Button
                      className="w-16 md:w-20 h-8 md:h-10"
                      variant="secondary"
                      disabled={status === "accepted" || status === "pending"}
                      onClick={() => handleButtonClick(discussion)}
                    >
                      {status === "accepted"
                        ? "Member"
                        : status === "pending"
                        ? "Requested"
                        : "Join"}
                    </Button>
                    <Button
                      className="h-10"
                      size="icon"
                      variant="icon"
                      onClick={() => handleShare(discussion)}
                    >
                      <RiShareForwardLine className="w-5 h-5 cursor-pointer text-gray-800" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="container mx-auto p-4">
            <div className="flex items-start gap-4 p-2 bg-white dark:bg-gray-800 md:p-4">
              <Image
                alt="Avatar"
                className="w-12 h-12 rounded-full md:w-[54px] md:h-[54px]"
                height="48"
                src={discussion.creator.profilePic}
                style={{ aspectRatio: "48/48", objectFit: "cover" }}
                width="48"
              />
              <div className="flex-1 grid gap-2">
                <div className="flex justify-between">
                  <div className="flex flex-col gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {discussion.creator.name}
                    </span>
                    <h4 className="text-md font-semibold">
                      {discussion.title}
                    </h4>
                  </div>

                  <div className="flex flex-col items-center gap-2 ">
                    {session?.db_id == discussion.creator._id && (
                      <div className="  flex justify-end gap-2">
                        <Dialog open={open} onOpenChange={setOpen}>
                          <DialogTrigger asChild>
                            <MdEdit className="h-6 w-6  cursor-pointer" />
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
                          className=" "
                          onClick={() => handleGetDiscussionId(discussion._id)}
                        >
                          <MdDeleteOutline className="w-6 h-6" />
                        </button>
                      </div>
                    )}
                    <span className="text-gray-500 dark:text-gray-400 ">
                      <ReactTimeAgo
                        date={new Date(discussion.createdAt)}
                        locale="en-US"
                      />
                    </span>
                  </div>
                </div>
                <div className="prose max-w-none">
                  <p>{discussion.content}</p>
                </div>
                <div className="grid items-center w-full gap-4 mb-2 text-center md:gap-8 grid-cols-4">
                  <Button
                    onClick={() => toggleLike(discussion._id)}
                    className="h-10"
                    size="icon"
                    variant="icon"
                  >
                    <ThumbsUpIcon
                      className={`w-4 h-4 cursor-pointer ${
                        isLikedByUser && "text-blue-400"
                      } ${
                        animationState[discussion._id] === "like" &&
                        "pop text-blue-400"
                      }`}
                    />
                    <span className="sr-only">Like</span>
                    <span className="ml-2">{discussion.likes}</span>
                  </Button>
                  <Button
                    onClick={() => toggleDislike(discussion._id)}
                    className="h-10"
                    size="icon"
                    variant="icon"
                  >
                    <ThumbsDownIcon
                      className={`w-4 h-4 cursor-pointer ${
                        isDislikedByUser && "text-red-400"
                      } ${
                        animationState[discussion._id] === "dislike" &&
                        "pop text-red-400"
                      }`}
                    />
                    <span className="sr-only">Dislike</span>
                    <span className="ml-2">{discussion.dislikes}</span>
                  </Button>
                  <Button
                    className="md:w-24 w-[70px]"
                    variant="secondary"
                    disabled={status === "accepted" || status === "pending"}
                    onClick={() => handleButtonClick(discussion)}
                  >
                    {status === "accepted"
                      ? "Member"
                      : status === "pending"
                      ? "Requested"
                      : "Join"}
                  </Button>
                  <Button
                    className="h-10"
                    size="icon"
                    variant="icon"
                    onClick={() => handleShare(discussion)}
                  >
                    <RiShareForwardLine className="w-5 h-5 cursor-pointer text-gray-800" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showConfirmDelete && (
        <div className="fixed inset-0 flex font-sans items-center justify-center z-50 bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm">
          <div className="p-4 bg-white rounded-lg dark:bg-gray-800 max-w-lg w-full">
            <h2 className="text-lg font-semibold">Confirm Deletion</h2>
            <p className="mt-1">
              Are you sure you want to delete this discussion?
            </p>
            <p className="flex gap-1 items-center mt-2 ">
              <MdOutlineInfo className="text-red-500" />
              <span className="text-sm text-red-500">
                Deleting this discussion will also permanently delete the
                associated group.
              </span>
            </p>
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
