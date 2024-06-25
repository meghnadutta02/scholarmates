"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { RiShareForwardLine } from "react-icons/ri";
import Loading from "../loading";
import TimeAgo from "javascript-time-ago";

import en from "javascript-time-ago/locale/en";
import ru from "javascript-time-ago/locale/ru";
import ReactTimeAgo from "react-time-ago";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);
const DiscussionDetails = ({ params }) => {
  const { id } = params;
  const [discussion, setDiscussion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [animationState, setAnimationState] = useState({});
  const [status, setStatus] = useState("");
  const [isLikedByUser, setIsLikedByUser] = useState(false);
  const [isDislikedByUser, setIsDislikedByUser] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchDiscussion = async () => {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/discussion/${id}`,
          {
            method: "GET",
          }
        );
        const data = await res.json();
        console.log(data);
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

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/discussion/${discussionId}/like`,
      { method: "PUT" }
    );

    if (response.ok) {
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
    } else {
      toast.error("Action failed due to server error");
    }

    setTimeout(() => {
      setAnimationState((prev) => ({ ...prev, [discussionId]: null }));
    }, 300);
  };

  const toggleDislike = async (discussionId) => {
    setAnimationState((prev) => ({ ...prev, [discussionId]: "dislike" }));

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/discussion/${discussionId}/dislike`,
      { method: "PUT" }
    );

    if (response.ok) {
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
    } else {
      toast.error("Action failed due to server error");
    }

    setTimeout(() => {
      setAnimationState((prev) => ({ ...prev, [discussionId]: null }));
    }, 300);
  };

  const handleButtonClick = async (discussion) => {
    try {
      const toastId = toast.loading("Sending request...");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/join-group?discussionId=${discussion._id}`,
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
    return <div>Discussion not found</div>;
  }

  return (
    <>
      {discussion.coverImage !== "" ? (
        <div className="container mx-auto p-4 flex flex-col md:gap-4 gap-2    ">
          <div className="flex justify-between md:py-[10px] md:px-4 px-2 py-1 shadow-sm rounded-md">
            <div className="flex items-center gap-2 rounded-md ">
              <Image
                alt="Avatar"
                className="rounded-full w-10 h-10 md:w-[54px] md:h-[54px]"
                height="48"
                src={discussion.creator.profilePic}
                style={{ aspectRatio: "54/54", objectFit: "cover" }}
                width="54"
              />

              <span className=" text-gray-500 dark:text-gray-400">
                {discussion.creator.name}
              </span>
            </div>
            <div className="text-gray-500 dark:text-gray-400 flex items-center">
              <span>
                <ReactTimeAgo
                  date={new Date(discussion.createdAt)}
                  locale="en-US"
                />
              </span>
            </div>
          </div>

          <div className="flex md:flex-row flex-col justify-center  gap-6 mt-3">
            <Image
              alt="Avatar"
              className="w-full"
              src={discussion.coverImage}
              style={{
                aspectRatio: "1",
                objectFit: "cover",
              }}
              width={390}
              height={150}
            />

            <div className="flex flex-col items-start justify-between rounded-lg   bg-white dark:bg-gray-800">
              <div className="flex flex-col md:gap-5 gap-2">
                <h4 className="font-semibold text-base">{discussion.title}</h4>

                <div className="prose max-w-none">
                  <p>{discussion.content}</p>
                </div>
              </div>
              <div className="grid w-full grid-cols-4  gap-4  md:gap-8   ">
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
                  className="w-24"
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
                  <RiShareForwardLine className="w-5 h-5 cursor-pointer text-gray-800 " />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="container mx-auto p-4">
          <div className="flex items-start gap-4  md:p-4 p-2 bg-white dark:bg-gray-800">
            <Image
              alt="Avatar"
              className="rounded-full w-12 h-12 md:w-[54px] md:h-[54px]"
              height="48"
              src={discussion.creator.profilePic}
              style={{ aspectRatio: "48/48", objectFit: "cover" }}
              width="48"
            />
            <div className="flex-1 grid gap-2">
              <div className="flex justify-between ">
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {discussion.creator.name}
                  </span>
                  <h4 className="font-semibold text-base">
                    {discussion.title}
                  </h4>
                </div>
                <div className="text-gray-500 dark:text-gray-400 flex items-center justify-self-start">
                  <span>
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
              <div className="grid w-full grid-cols-4 items-center gap-4 text-center md:gap-8 mb-2">
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
                  <RiShareForwardLine className="w-5 h-5 cursor-pointer text-gray-800 " />
                </Button>
              </div>
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
