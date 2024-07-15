import React, { useState, useEffect, useRef } from "react";
import Loading from "../(routes)/discussions/loading";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import Link from "next/link";
import { RiShareForwardLine } from "react-icons/ri";
import { InfoIcon } from "lucide-react";

const getDiscussions = async () => {
  const response = await fetch(`/api/users/my-discussions`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  });
  return response.json();
};

const DiscussionList = () => {
  const [expandedDiscussion, setExpandedDiscussion] = useState([]);
  const { data: session } = useSession();
  const [animationState, setAnimationState] = useState({});
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 5;
  const observer = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [discussionsResult] = await Promise.allSettled([
          getDiscussions(),
        ]);
        let result = [];

        if (discussionsResult.status === "fulfilled") {
          result = discussionsResult.value.result;
        }
        console.log("Discussions:", result);

        const userId = session?.user?.db_id;

        const updatedResult = result.map((discussion) => {
          const isLiked = discussion.likedBy?.includes(userId);
          const isDisliked = discussion.dislikedBy?.includes(userId);

          return {
            ...discussion,
            isLiked,
            isDisliked,
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
  }, [session, offset]);

  useEffect(() => {
    // Intersection Observer for lazy loading more discussions
    const observerCallback = (entries) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore) {
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
  }, [discussions, hasMore]);

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

    const response = await fetch(`/api/discussion/${id}/like`, {
      method: "PUT",
    });

    if (response.ok) {
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
    }

    setTimeout(() => {
      setAnimationState((prev) => ({ ...prev, [id]: null }));
    }, 300);
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

  return (
    <div>
      {loading ? (
        <Loading />
      ) : discussions.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full mt-4">
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-4">
            You have no discussions.
          </p>
          <Link
            href="/discussions"
            className="flex items-center gap-3 rounded-lg px-3 py-2 bg-gray-700 transition-all hover:bg-gray-900 dark:bg-gray-400 dark:hover:bg-gray-50 text-white "
          >
            Create Discussion
          </Link>
        </div>
      ) : (
        <div className="md:mt-7 mt-4">
          <h2 className="md:text-xl text-lg font-semibold">
            {discussions.length} discussion{discussions.length !== 1 ? "s" : ""}
          </h2>
          <div className="grid grid-cols-1 gap-6 mt-4">
            {discussions?.map((discussion) => (
              <div
                key={discussion._id}
                className="relative flex items-start gap-4 rounded-lg shadow p-2"
              >
                <div className="flex-1 gap-2">
                  <div className="flex flex-col  gap-2">
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
                  <div className="flex w-full justify-between my-1 ">
                    <div className="prose max-w-[80%] md:block hidden ">
                      <p className="cursor-pointer pr-2">
                        <Link href={`/discussions/${discussion._id}`}>
                          {discussion.content}
                        </Link>
                      </p>
                    </div>
                    <div className="w-full grid grid-cols-3 md:grid-cols-2  text-center  place-items-center">
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
                      </Button>{" "}
                      <Button
                        className="h-10"
                        size="icon"
                        variant="icon"
                        onClick={() => handleShare(discussion)}
                      >
                        <RiShareForwardLine className="w-5 h-5 cursor-pointer text-gray-800" />
                      </Button>
                      <Link
                        href={`/discussions/${discussion._id}`}
                        className="md:hidden "
                      >
                        <Button variant="icon">
                          <InfoIcon className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div id="observer" className="h-4"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscussionList;

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
