import React, { useState, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import Loading from "./Loading";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import Link from "next/link";
import { InfoIcon } from "lucide-react";
import { useSession as useCustomSession } from "./SessionProvider";
import { IoChatboxOutline } from "react-icons/io5";
import { RiShareForwardLine } from "react-icons/ri";

const getDiscussions = async (query = "", offset = 0, limit = 10) => {
  const separator = query !== "" ? "&" : "?";
  const response = await fetch(
    `/api/discussion${query}${separator}offset=${offset}&limit=${limit}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
    }
  );
  return response.json();
};

const getJoinRequests = async () => {
  const response1 = await fetch(`/api/join-group/status`);
  return response1.json();
};

const DiscussionList = ({
  selectedFilters,
  searchQuery,
  reloadList,
  offset,
  setOffset,
  hasMore,
  setHasMore,
  discussions,
  setDiscussions,
}) => {
  const [expandedDiscussion, setExpandedDiscussion] = useState([]);

  const [animationState, setAnimationState] = useState({});
  const [loading, setLoading] = useState(true);
  const { socket } = useCustomSession();
  const { data: session } = useSession();
  const limit = 10;
  const observer = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      // setLoading(true);
      try {
        let query = "";
        let params = [];

        if (selectedFilters.category.length > 0) {
          const categoryString = selectedFilters.category.join(",");
          params.push(`category=${categoryString}`);
        }
        if (searchQuery.length > 0) {
          params.push(`searchQuery=${encodeURIComponent(searchQuery)}`);
        }
        if (selectedFilters.subcategory.length > 0) {
          const subcategoryString = selectedFilters.subcategory.join(",");
          params.push(`subcategory=${subcategoryString}`);
        }
        if (selectedFilters.type.length > 0) {
          const typeString = selectedFilters.type.join(",");
          params.push(`type=${typeString}`);
        }
        if (selectedFilters.college) {
          params.push("college=1");
        }
        if (params.length > 0) {
          query = "?" + params.join("&");
        }
        const [joinRequestsResult, discussionsResult] =
          await Promise.allSettled([
            getJoinRequests(),
            getDiscussions(query, offset, limit),
          ]);
        let result = [];
        let accepted = [];
        let pending = [];

        if (joinRequestsResult.status === "fulfilled") {
          ({ accepted, pending } = joinRequestsResult.value);
        }

        if (discussionsResult.status === "fulfilled") {
          result = discussionsResult.value.result;
        }

        const userId = session?.user?.db_id;

        const updatedResult = result.map((discussion) => {
          const isLiked = discussion.likedBy?.includes(userId);
          const isDisliked = discussion.dislikedBy?.includes(userId);
          let isMember = false;
          let isRequested = false;

          if (accepted.includes(discussion.groupId)) {
            isMember = true;
          }
          if (pending.includes(discussion.groupId)) {
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

        setDiscussions((prevDiscussions) => {
          if (offset === 0) {
            return updatedResult;
          }
          const filteredDiscussions = updatedResult.filter((newDiscussion) =>
            prevDiscussions.every(
              (existingDiscussion) =>
                existingDiscussion._id !== newDiscussion._id
            )
          );
          return [...prevDiscussions, ...filteredDiscussions];
        });
        setLoading(false);
        if (result.length < limit) {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching discussions:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [
    selectedFilters,

    reloadList,
    session,
    offset,
    setDiscussions,
    setHasMore,
  ]);

  useEffect(() => {
    // Intersection Observer for lazy loading more discussions
    const observerCallback = (entries) => {
      const target = entries[0];

      if (target.isIntersecting && hasMore) {
        console.log("Intersecting");
        setOffset((prevOffset) => prevOffset + limit);
      }
    };

    observer.current = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    });

    const observerTarget = document.querySelector("#observer");
    if (observer.current && observerTarget) {
      observer.current.observe(observerTarget);
    }

    return () => {
      if (observer.current && observerTarget) {
        observer.current.unobserve(observerTarget);
      }
    };
  }, [discussions, hasMore, setOffset]);

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
    await fetch(`/api/discussion/${id}/like`, { method: "PUT" });

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

    await fetch(`/api/discussion/${id}/dislike`, { method: "PUT" });

    setTimeout(() => {
      setAnimationState((prev) => ({ ...prev, [id]: undefined }));
    }, 300);
  };

  const handleButtonClick = async (discussionId, id) => {
    const toastId = toast.loading("Sending request...", {
      autoClose: 4000,
      closeOnClick: true,
    });
    try {
      const res = await fetch(`/api/join-group?groupId=${id}`, {
        method: "GET",
      });

      //if the group is private and request is sent to mod6,lrators
      if (res.status === 200) {
        const data = await res.json();
        toast.update(toastId, {
          render: "Request sent successfully",
          type: "success",
          isLoading: false,
          autoClose: 5000,
          closeOnClick: true,
        });

        socket.emit("joinRequest", {
          request: data.result,
          user: session?.user,
        });
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
          closeOnClick: true,
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
          text: discussion.content,
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

  return (
    <div className="lg:w-[85%] mx-auto">
      {loading ? (
        <Loading />
      ) : discussions.length === 0 ? (
        <div className="flex  items-center justify-center mt-2 ">
          <p className="text-lg text-gray-500 dark:text-gray-400 ">
            No discussions found for the selected filters.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {discussions.map((discussion) => (
            <div key={discussion._id} className="rounded-lg shadow-sm px-3">
              <div className="flex items-start gap-4 pt-4">
                <Link href={`/profile/${discussion.creatorData._id}`}>
                  <Image
                    alt="Avatar"
                    className="rounded-full hidden sm:block"
                    height="48"
                    src={discussion.creatorData.profilePic}
                    style={{
                      aspectRatio: "48/48",
                      objectFit: "cover",
                    }}
                    width="48"
                  />
                </Link>
                <div className="flex-1 grid gap-2">
                  <div className="flex flex-col  gap-2">
                    <div className="flex justify-between">
                      <div className="mr-3 mt-1 sm:hidden block">
                        <Link href={`/profile/${discussion.creatorData._id}`}>
                          <Image
                            alt="Avatar"
                            className="rounded-full bg-cover"
                            height="48"
                            width="48"
                            style={{
                              aspectRatio: "48/48",
                              objectFit: "cover",
                            }}
                            src={discussion.creatorData.profilePic}
                          />
                        </Link>
                      </div>
                      <div className="flex md:flex-row flex-col justify-between md:items-center w-full items-start">
                        <Link href={`/profile/${discussion.creatorData._id}`}>
                          <span className="text-sm text-gray-500 font-medium dark:text-gray-400">
                            {discussion.creatorData.name}
                          </span>{" "}
                        </Link>
                        <span className="md:text-sm text-[13px] line-clamp-1 text-gray-500 dark:text-gray-400">
                          {discussion.creatorData.collegeName}
                        </span>
                      </div>
                      <Link
                        href={`/discussions/${discussion._id}`}
                        className="md:hidden"
                      >
                        <Button className="p-0" variant="icon">
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
                      <Link href={`/discussions/${discussion._id}`}>
                        {discussion.content}
                      </Link>
                    </p>
                  </div>
                  <DiscussionActions
                    {...{
                      discussion,
                      toggleLike,
                      toggleDislike,
                      handleButtonClick,
                      handleShare,
                      animationState,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
          <div id="observer" className="h-4"></div>
        </div>
      )}
    </div>
  );
};

export default DiscussionList;
const DiscussionActions = ({
  discussion,
  toggleLike,
  toggleDislike,
  handleButtonClick,
  handleShare,
  animationState,
}) => {
  return (
    <div className="flex justify-between items-center gap-5 border-t text-center md:gap-8 py-3">
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
        className="h-10"
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

      {discussion.isMember ? (
        <Link href={`/chats?discussionId=${discussion._id}`}>
          <Button variant="icon" className="flex md:ml-4">
            <IoChatboxOutline className="h-6 w-6" />
          </Button>
        </Link>
      ) : (
        <Button
          className={`${
            discussion.isRequested ? "w-20" : "w-16 "
          } h-8 md:h-10 md:w-20`}
          variant="secondary"
          disabled={discussion.isRequested}
          onClick={() => handleButtonClick(discussion._id, discussion.groupId)}
        >
          {discussion.isRequested ? "Requested" : "Join"}
        </Button>
      )}
      <Button
        className="h-10 ml-4"
        size="icon"
        variant="icon"
        onClick={() => handleShare(discussion)}
      >
        <RiShareForwardLine className="w-5 h-5 cursor-pointer text-gray-800" />
      </Button>
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
