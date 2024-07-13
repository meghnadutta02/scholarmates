"use client";
import React, { useState, useEffect } from "react";
import Loading from "@/app/(components)/Loading";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { InfoIcon } from "lucide-react";
import { toast } from "react-toastify";
import { useSession } from "@/app/(components)/SessionProvider";
import { LuTrendingDown } from "react-icons/lu";
import { IoChatboxOutline } from "react-icons/io5";
const getDiscussions = async (college, c) => {
  let url = `${process.env.NEXT_PUBLIC_API_URL}/api/discussion/trending`;
  if (college) {
    url += `?college=${c}`;
  }
  const response = await fetch(url, { next: { revalidate: 1800 } });

  return response.json();
};
const getJoinRequests = async () => {
  const response1 = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/join-group/status`
  );
  return response1.json();
};

const Trending = () => {
  const { user, session } = useSession();
  const [expandedDiscussion, setExpandedDiscussion] = useState([]);
  const [animationState, setAnimationState] = useState({});
  const [college, setCollege] = useState(false);
  const toggleDiscussion = (id) => {
    setExpandedDiscussion((prev) => {
      const isIdPresent = prev.includes(id);
      if (isIdPresent) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const toggleLike = async (id) => {
    setAnimationState((prev) => ({ ...prev, [id]: "like" }));

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/discussion/${id}/like`,
      { method: "PUT" }
    );

    if (response.ok)
      setDiscussions((prevDiscussions) =>
        prevDiscussions.map((discussion) =>
          discussion._id === id
            ? {
                ...discussion,
                likes: discussion.isLiked
                  ? discussion.likes - 1
                  : discussion.likes + 1,
                isLiked: !discussion.isLiked,
                dislikes: discussion.isDisliked
                  ? discussion.dislikes - 1
                  : discussion.dislikes,
                isDisliked: false,
              }
            : discussion
        )
      );
    setTimeout(() => {
      setAnimationState((prev) => ({ ...prev, [id]: null }));
    }, 300);
  };

  const toggleDislike = async (id) => {
    setAnimationState((prev) => ({ ...prev, [id]: "dislike" }));

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/discussion/${id}/dislike`,
      { method: "PUT" }
    );

    if (response.ok)
      setDiscussions((prevDiscussions) =>
        prevDiscussions.map((discussion) =>
          discussion._id === id
            ? {
                ...discussion,
                dislikes: discussion.isDisliked
                  ? discussion.dislikes - 1
                  : discussion.dislikes + 1,
                isDisliked: !discussion.isDisliked,
                likes: discussion.isLiked
                  ? discussion.likes - 1
                  : discussion.likes,
                isLiked: false,
              }
            : discussion
        )
      );
    setTimeout(() => {
      setAnimationState((prev) => ({ ...prev, [id]: undefined }));
    }, 300);
  };
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const collegeName = session?.collegeName;
        const [joinRequestsResult, discussionsResult] =
          await Promise.allSettled([
            getJoinRequests(),
            getDiscussions(college, collegeName),
          ]);
        let result = [];
        let accepted = [];
        let pending = [];
        let rejected = [];
        if (joinRequestsResult.status === "fulfilled") {
          ({ accepted, pending, rejected } = joinRequestsResult.value);
        }

        if (discussionsResult.status === "fulfilled") {
          result = discussionsResult.value.discussions;
        }

        const userId = session?.db_id;

        const updatedResult = result.map((discussion) => {
          const isLiked = discussion.likedBy?.includes(userId);
          const isDisliked = discussion.dislikedBy?.includes(userId);
          let isMember = false;
          let isRequested = false;
          let isRejected = false;

          if (accepted.includes(discussion?.groupId?._id)) {
            isMember = true;
          }
          if (pending.includes(discussion?.groupId?._id)) {
            isRequested = true;
          }
          if (rejected.includes(discussion?.groupId?._id)) {
            isRejected = true;
          }
          return {
            ...discussion,
            isLiked,
            isDisliked,
            isMember,
            isRequested,
            isRejected,
          };
        });
        setDiscussions(updatedResult);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching discussions:", error);

        setLoading(false);
      }
    };

    fetchData();
  }, [session, user, college]);

  const handleButtonClick = async (discussion) => {
    try {
      const promise = new Promise(async (resolve, reject) => {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/join-group?discussionId=${discussion._id}`,
          {
            method: "GET",
          }
        );
        if (!res.ok) {
          reject(new Error("Error sending request"));
        } else {
          resolve(await res.json());
        }
      });

      toast.promise(promise, {
        loading: "Sending request...",
        success: "Request sent successfully",
        error: "Error sending request",
      });

      setDiscussions((prevDiscussions) =>
        prevDiscussions.map((d) => {
          if (d._id === discussion._id) {
            return { ...d, isRequested: true };
          }
          return d;
        })
      );
    } catch (error) {
      console.error(error);
      toast.error("Error sending request");
    }
  };
  if (loading) return <Loading />;
  return (
    <div className="pt-5 md:px-6 px-1 relative w-full">
      {user?.collegeName !== "" ? (
        <div className="flex justify-end gap-2 items-center mt-6">
          <input
            type="checkbox"
            id="college"
            name="college"
            className="rounded-md h-[14px] w-[14px] accent-zinc-700"
            onChange={(e) => setCollege(e.target.checked)}
          />
          <label htmlFor="college" className="text-md font-medium ">
            My college
          </label>
        </div>
      ) : (
        toast.info("Please provide your college name to complete your profile.")
      )}
      {discussions.length === 0 ? (
        <div className="flex   justify-center  ">
          <p className="text-lg text-gray-500 dark:text-gray-400 ">
            No discussions found.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1  gap-6 ">
          {discussions.map((discussion) => (
            <div
              key={discussion._id}
              className="flex items-start gap-4 rounded-lg shadow-sm p-2"
            >
              <Image
                alt="Avatar"
                className="rounded-full hidden sm:block"
                height="48"
                src={discussion.creator.profilePic}
                style={{
                  aspectRatio: "48/48",
                  objectFit: "cover",
                }}
                width="48"
              />
              <Image
                alt="Avatar"
                className="rounded-full sm:hidden block"
                height="38"
                src={discussion.creator.profilePic}
                style={{
                  aspectRatio: "38/38",
                  objectFit: "cover",
                }}
                width="38"
              />

              <div className="flex-1 grid gap-2">
                <div className="flex flex-col  gap-2">
                  <div className="flex justify-between items-center w-full ">
                    <div className="flex md:flex-row flex-col justify-between md:items-center items-start md:w-full">
                      <Link href={`/profile/${discussion.creator._id}`}>
                        <span className="text-sm text-gray-500 font-medium dark:text-gray-400">
                          {discussion.creator.name}
                        </span>{" "}
                      </Link>
                      <span className="md:text-sm text-[13px] text-gray-500 dark:text-gray-400">
                        {discussion.creator.collegeName}
                      </span>
                    </div>
                    <Link href={`/discussions/${discussion._id}`}>
                      <Button className=" md:hidden p-0 " variant="icon">
                        <InfoIcon className="w-5 h-5" />
                      </Button>
                    </Link>
                  </div>
                  <h4 className="font-semibold text-base cursor-pointer">
                    <Link href={`/discussions/${discussion._id}`}>
                      {discussion.title}
                    </Link>
                  </h4>
                </div>
                <div
                  className={`prose max-w-none cursor-pointer md:hidden ${
                    expandedDiscussion.includes(discussion._id)
                      ? ""
                      : "line-clamp-2"
                  }`}
                  onClick={() => toggleDiscussion(discussion._id)}
                >
                  <p className="cursor-pointer">{discussion.content}</p>
                </div>
                <div className="prose max-w-none  md:block hidden ">
                  <p className="cursor-pointer">
                    {" "}
                    <Link href={`/discussions/${discussion._id}`}>
                      {discussion.content}
                    </Link>
                  </p>
                </div>
                <div className="grid w-full grid-cols-4 items-center gap-4 text-center md:gap-8 mb-2">
                  <Button className="h-10" size="icon" variant="icon">
                    <ThumbsUpIcon
                      className={`w-4 h-4 cursor-pointer ${
                        discussion.isLiked && "text-blue-400"
                      } ${
                        animationState[discussion._id] === "like" &&
                        "pop text-blue-400"
                      }`}
                      onClick={() => toggleLike(discussion._id)}
                    />
                    <span className="sr-only">Like</span>
                    <span className="ml-2">{discussion.likes}</span>
                  </Button>
                  <Button className="h-10 " size="icon" variant="icon">
                    <ThumbsDownIcon
                      className={`w-4 h-4 cursor-pointer ${
                        discussion.isDisliked && "text-red-400"
                      } ${
                        animationState[discussion._id] === "dislike" &&
                        "pop text-red-400"
                      }`}
                      onClick={() => toggleDislike(discussion._id)}
                    />
                    <span className="sr-only">Dislike</span>
                    <span className="ml-2">{discussion.dislikes}</span>
                  </Button>

                  <Button className="h-10" size="icon" variant="icon">
                    <span className="sr-only">Popularity</span>
                    <span className="ml-2 flex">
                      {discussion.rankChange === "decrease" ? (
                        <LuTrendingDown className="w-5 h-5 text-red-400" />
                      ) : (
                        <TrendingUpIcon className="w-5 h-5 text-green-400" />
                      )}

                      <p className="font-normal ml-2"> {discussion.rankJump}</p>
                    </span>
                  </Button>
                  {discussion.isMember ? (
                    <Link href={`/chats/?discussionId=${discussion._id}`}>
                      <Button variant="icon" className="flex ml-4">
                        <IoChatboxOutline className="h-6 w-6" />
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      className="w-16 md:w-20 h-8 md:h-10"
                      variant="secondary"
                      disabled={discussion.isRequested || discussion.isRejected}
                      onClick={() => handleButtonClick(discussion)}
                    >
                      {discussion.isRequested
                        ? "Requested"
                        : discussion.isRejected
                        ? "Rejected"
                        : "Join"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Trending;
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

function TrendingUpIcon(props) {
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
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}
