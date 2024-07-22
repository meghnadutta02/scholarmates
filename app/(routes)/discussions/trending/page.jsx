"use client";
import React, { useState, useEffect } from "react";
import Loading from "@/app/(components)/Loading";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { InfoIcon } from "lucide-react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { LuTrendingDown } from "react-icons/lu";
import { IoChatboxOutline } from "react-icons/io5";
import { useSession as useCustomSession } from "@/app/(components)/SessionProvider";
const getDiscussions = async (college, c) => {
  let url = `/api/discussion/trending`;
  if (college) {
    url += `?college=${c}`;
  }
  const response = await fetch(url, { next: { revalidate: 1800 } });

  return response.json();
};
const getJoinRequests = async () => {
  const response1 = await fetch(`/api/join-group/status`);
  return response1.json();
};

const Trending = () => {
  const { data: session } = useSession();
  const [expandedDiscussion, setExpandedDiscussion] = useState([]);
  const [animationState, setAnimationState] = useState({});
  const [college, setCollege] = useState(false);
  const { socket, session: userData } = useCustomSession();
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

    await fetch(`/api/discussion/${id}/like`, {
      method: "PUT",
    });

    setTimeout(() => {
      setAnimationState((prev) => ({ ...prev, [id]: null }));
    }, 300);
  };

  const toggleDislike = async (id) => {
    setAnimationState((prev) => ({ ...prev, [id]: "dislike" }));

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

    await fetch(`/api/discussion/${id}/dislike`, {
      method: "PUT",
    });

    setTimeout(() => {
      setAnimationState((prev) => ({ ...prev, [id]: undefined }));
    }, 300);
  };
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const collegeName = session?.user?.collegeName;
        const [joinRequestsResult, discussionsResult] =
          await Promise.allSettled([
            getJoinRequests(),
            getDiscussions(college, collegeName),
          ]);
        let result = [];
        let accepted = [];
        let pending = [];

        if (joinRequestsResult.status === "fulfilled") {
          ({ accepted, pending } = joinRequestsResult.value);
        }

        if (discussionsResult.status === "fulfilled") {
          result = discussionsResult.value.discussions;
        }

        const userId = session?.user?.db_id;

        const updatedResult = result.map((discussion) => {
          const isLiked = discussion.likedBy?.includes(userId);
          const isDisliked = discussion.dislikedBy?.includes(userId);
          let isMember = false;
          let isRequested = false;

          if (accepted.includes(discussion?.groupId?._id)) {
            isMember = true;
          }
          if (pending.includes(discussion?.groupId?._id)) {
            isRequested = true;
          }

          return {
            ...discussion,
            isLiked,
            isDisliked,
            isMember,
            isRequested,
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
  }, [session, college]);

  const handleButtonClick = async (discussionId, id) => {
    try {
      const toastId = toast.loading("Sending request...");

      const res = await fetch(`/api/join-group?groupId=${id}`, {
        method: "GET",
      });

      if (!res.ok) {
        toast.update(toastId, {
          render: "Error sending request",
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
        throw new Error("Error sending request");
      }

      //if the group is private and request is sent to moderators
      if (res.status === 200) {
        const data = await res.json();
        toast.update(toastId, {
          render: "Request sent successfully",
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });
        socket.emit("joinRequest", { request: data.result, user: userData });
        setDiscussions((prevDiscussions) =>
          prevDiscussions.map((d) => {
            if (d._id === discussionId) {
              return { ...d, isRequested: true, isMember: false };
            }
            return d;
          })
        );
      } else if (res.status === 201) {
        //if the group is public and user is added to group

        toast.update(toastId, {
          render: "Joined group successfully",
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });

        setDiscussions((prevDiscussions) =>
          prevDiscussions.map((d) => {
            if (d._id === discussionId) {
              return { ...d, isMember: true, isRequested: false };
            }
            return d;
          })
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Error sending request");
    }
  };
  if (loading) return <Loading />;
  return (
    <div className="md:pt-5 pt-2  md:px-6 px-1 relative w-full">
      <div className="flex justify-end gap-2 items-center md:mt-4 mt-3 mr-4">
        <input
          type="checkbox"
          id="college"
          name="college"
          className="rounded-md h-[14px] w-[14px] accent-zinc-700"
          onChange={(e) =>
            session?.user?.collegeName
              ? setCollege(e.target.checked)
              : toast.info(
                  "Please update your college in profile settings to filter discussions by college."
                )
          }
        />
        <label htmlFor="college" className="text-md font-medium ">
          My college
        </label>
      </div>
      {discussions.length === 0 ? (
        <div className="flex   justify-center  ">
          <p className="text-lg text-gray-500 dark:text-gray-400 ">
            No discussions found.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1  gap-6 ">
          {discussions.map((discussion) => (
            <div key={discussion._id} className="rounded-lg shadow-sm p-2">
              <div className="flex items-start gap-4 ">
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

                <div className="flex-1 grid gap-2">
                  <div className="flex flex-col  gap-2">
                    <div className="flex justify-between items-center w-full ">
                      <div className="mr-3 mt-1 sm:hidden block">
                        <Image
                          alt="Avatar"
                          className="rounded-full bg-cover"
                          height="48"
                          width="48"
                          style={{
                            aspectRatio: "48/48",
                            objectFit: "cover",
                          }}
                          src={discussion.creator.profilePic}
                        />
                      </div>
                      <div className="flex md:flex-row flex-col justify-between md:items-center items-start w-full">
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
                  {/* buttons here */}
                  <DiscussionActions
                    {...{
                      discussion,
                      toggleLike,
                      toggleDislike,
                      handleButtonClick,

                      animationState,
                    }}
                  />
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
const DiscussionActions = ({
  discussion,
  toggleLike,
  toggleDislike,
  handleButtonClick,
  animationState,
}) => {
  return (
    <div className="grid w-full grid-cols-4 items-center sm:place-items-start gap-5 text-center md:gap-8 mb-2 pl-2">
      <Button
        onClick={() => toggleLike(discussion._id)}
        className="h-10"
        size="icon"
        variant="icon"
      >
        <ThumbsUpIcon
          className={`w-4 h-4 cursor-pointer ${
            discussion.isLiked && "text-blue-400"
          } ${
            animationState[discussion._id] === "like" && "pop text-blue-400"
          }`}
        />
        <span className="sr-only">Like</span>
        <span className="ml-2">{discussion.likes}</span>
      </Button>
      <Button
        onClick={() => toggleDislike(discussion._id)}
        className="h-10 "
        size="icon"
        variant="icon"
      >
        <ThumbsDownIcon
          className={`w-4 h-4 cursor-pointer ${
            discussion.isDisliked && "text-red-400"
          } ${
            animationState[discussion._id] === "dislike" && "pop text-red-400"
          }`}
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
        <Link href={`/chats?discussionId=${discussion._id}`}>
          <Button variant="icon" className="flex ml-4">
            <IoChatboxOutline className="h-6 w-6" />
          </Button>
        </Link>
      ) : (
        <Button
          className={`${
            discussion.isRequested ? "w-20" : "w-16"
          } h-8 md:h-10  md:w-20`}
          variant="secondary"
          disabled={discussion.isRequested}
          onClick={() =>
            handleButtonClick(discussion._id, discussion.groupId._id)
          }
        >
          {discussion.isRequested ? "Requested" : "Join"}
        </Button>
      )}
    </div>
  );
};
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
