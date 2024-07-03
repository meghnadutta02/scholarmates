import React, { useState, useEffect, useRef } from "react";
import Loading from "../(routes)/discussions/loading";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import Link from "next/link";
import { InfoIcon } from "lucide-react";

const getDiscussions = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
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
        let accepted = [];
        let pending = [];
        let rejected = [];

        if (discussionsResult.status === "fulfilled") {
          result = discussionsResult.value.result;
        }
        console.log("Join Requests:", { accepted, pending, rejected });
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

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/discussion/${id}/like`,
      { method: "PUT" }
    );

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

  return (
    <div>
      {loading ? (
        <Loading />
      ) : discussions.length === 0 ? (
        <p className="md:mt-7 mt-4">
          You have no discussions. Create a discussion..
        </p>
      ) : (
        <div className="md:mt-7 mt-4">
          <h2 className="text-xl font-semibold">
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
                  <div className="flex justify-between my-1">
                    <div className="prose max-w-[80%] md:block hidden ">
                      <p className="cursor-pointer pr-2">
                        <Link href={`/discussions/${discussion._id}`}>
                          {discussion.content}
                        </Link>
                      </p>
                    </div>
                    <div className="grid grid-cols-2 items-center text-center">
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
