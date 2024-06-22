import React, { useState, useEffect, useRef } from "react";
import Loading from "../(routes)/discussions/loading"; // Adjust path as per your project structure
import { Button } from "@/components/ui/button"; // Adjust path as per your UI library
import Image from "next/image";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

const getDiscussions = async (query = "", offset = 0, limit = 10) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/discussion?${query}&offset=${offset}&limit=${limit}`,
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
  const response1 = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/join-group/status`
  );
  return response1.json();
};

const DiscussionList = ({ selectedFilters, searchQuery, reloadList }) => {
  const [expandedDiscussion, setExpandedDiscussion] = useState([]);
  const { data: session } = useSession();
  const [animationState, setAnimationState] = useState({});
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0); // Pagination offset
  const limit = 10;

  const observer = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
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
          await Promise.allSettled([getJoinRequests(), getDiscussions(query, offset, limit)]);
        let result = [];
        let accepted = [];
        let pending = [];
        let rejected = [];
        if (joinRequestsResult.status === "fulfilled") {
          ({ accepted, pending, rejected } = joinRequestsResult.value);
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
          let isRejected = false;

          if (accepted.includes(discussion.groupId)) {
            isMember = true;
          }
          if (pending.includes(discussion.groupId)) {
            isRequested = true;
          }
          if (rejected.includes(discussion.groupId)) {
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

        setDiscussions((prevDiscussions) => {
          // Filter out duplicate discussions by _id
          const filteredDiscussions = updatedResult.filter((newDiscussion) =>
            prevDiscussions.every((existingDiscussion) => existingDiscussion._id !== newDiscussion._id)
          );
          return [...prevDiscussions, ...filteredDiscussions];
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching discussions:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedFilters, searchQuery, reloadList, session, offset]);

  // Intersection Observer for lazy loading more discussions
  const observerCallback = (entries) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setOffset((prevOffset) => prevOffset + limit);
    }
  };

  useEffect(() => {
    observer.current = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    });

    // if (observer.current && discussions.length > 0) {
    //   observer.current.observe(document.querySelector("#observer"));
    // }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [discussions]);

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

  const toggleDislike = async (id) => {
    setAnimationState((prev) => ({ ...prev, [id]: "dislike" }));

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/discussion/${id}/dislike`,
      { method: "PUT" }
    );

    if (response.ok) {
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
    }

    setTimeout(() => {
      setAnimationState((prev) => ({ ...prev, [id]: undefined }));
    }, 300);
  };

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

  return (
    // <div>
    //   {loading ? (
    //     <Loading />
    //   ) : discussions.length === 0 ? (
    //     <p>No discussions found for the selected filters.</p>
    //   ) : (
    //     <div className="grid grid-cols-1 gap-6">
    //       {discussions.map((discussion, index) => (
    //         <div
    //           key={discussion._id}
    //           className="flex items-start gap-4 rounded-lg shadow-sm p-2"
    //         >
    //           <Image
    //             alt="Avatar"
    //             className="rounded-full hidden sm:block"
    //             height="48"
    //             src={discussion.creatorData.profilePic}
    //             style={{
    //               aspectRatio: "48/48",
    //               objectFit: "cover",
    //             }}
    //             width="48"
    //           />
    //           <Image
    //             alt="Avatar"
    //             className="rounded-full sm:hidden block"
    //             height="38"
    //             src={discussion.creatorData.profilePic}
    //             style={{
    //               aspectRatio: "38/38",
    //               objectFit: "cover",
    //             }}
    //             width="38"
    //           />

    //           <div className="flex-1 grid gap-2">
    //             <div className="flex flex-col gap-2">
    //               <span className="text-sm text-gray-500 dark:text-gray-400">
    //                 {new Date(discussion.createdAt).toLocaleDateString("en-US", {
    //                   year: "numeric",
    //                   month: "short",
    //                   day: "numeric",
    //                 })}
    //               </span>
    //               <h2 className="text-lg font-semibold">{discussion.title}</h2>
    //             </div>
    //             <div className="flex flex-row justify-between items-center">
    //               <div
    //                 className="prose max-w-none md:hidden block"
    //                 dangerouslySetInnerHTML={{ __html: discussion.content }}
    //               />
    //               <div
    //                 className="prose max-w-none md:block hidden"
    //                 dangerouslySetInnerHTML={{ __html: discussion.content }}
    //               />
    //               <div className="flex items-center gap-4 text-center md:gap-8 mb-2">
    //                 <Button
    //                   className="flex items-center h-10"
    //                   size="icon"
    //                   variant="icon"
    //                   onClick={() => toggleLike(discussion._id)}
    //                 >
    //                   <ThumbsUpIcon
    //                     className={`w-4 h-4 cursor-pointer ${discussion.isLiked && "text-blue-400"
    //                       } ${animationState[discussion._id] === "like" &&
    //                       "pop text-blue-400"
    //                       }`}
    //                   />
    //                   <span className="ml-2">{discussion.likes}</span>
    //                 </Button>
    //                 <Button
    //                   className="flex items-center h-10"
    //                   size="icon"
    //                   variant="icon"
    //                   onClick={() => toggleDislike(discussion._id)}
    //                 >
    //                   <ThumbsDownIcon
    //                     className={`w-4 h-4 cursor-pointer ${discussion.isDisliked && "text-red-400"
    //                       } ${animationState[discussion._id] === "dislike" &&
    //                       "pop text-red-400"
    //                       }`}
    //                   />
    //                   <span className="ml-2">{discussion.dislikes}</span>
    //                 </Button>
    //                 <Button
    //                   className="flex items-center px-4 h-10"
    //                   variant="secondary"
    //                   disabled={
    //                     discussion.isMember ||
    //                     discussion.isRequested ||
    //                     discussion.isRejected
    //                   }
    //                   onClick={() => handleButtonClick(discussion)}
    //                 >
    //                   {discussion.isMember
    //                     ? "Member"
    //                     : discussion.isRequested
    //                       ? "Requested"
    //                       : discussion.isRejected
    //                         ? "Rejected"
    //                         : "Join"}
    //                 </Button>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       ))}
    //       <div id="observer" className="intersection-observer" />
    //     </div>
    //   )}
    // </div> 
    <div>
      {loading ? (
        <Loading />
      ) : discussions.length === 0 ? (
        <p>No discussions found for the selected filters.</p>
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
                src={discussion.creatorData.profilePic}
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
                src={discussion.creatorData.profilePic}
                style={{
                  aspectRatio: "38/38",
                  objectFit: "cover",
                }}
                width="38"
              />

              <div className="flex-1 grid gap-2">
                <div className="flex flex-col  gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {discussion.creatorData.name}
                  </span>{" "}
                  <h4 className="font-semibold text-base">
                    {discussion.title}
                  </h4>
                </div>
                <div
                  className={`prose max-w-none cursor-pointer md:hidden ${expandedDiscussion.includes(discussion._id)
                      ? ""
                      : "line-clamp-2"
                    }`}
                  onClick={() => toggleDiscussion(discussion._id)}
                >
                  <p>{discussion.content}</p>
                </div>
                <div className="prose max-w-none  md:block hidden">
                  <p>{discussion.content}</p>
                </div>
                <div className="grid w-full grid-cols-4 items-center gap-4 text-center md:gap-8 mb-2">
                  <Button className="h-10" size="icon" variant="icon">
                    <ThumbsUpIcon
                      className={`w-4 h-4 cursor-pointer ${discussion.isLiked && "text-blue-400"
                        } ${animationState[discussion._id] === "like" &&
                        "pop text-blue-400"
                        }`}
                      onClick={() => toggleLike(discussion._id)}
                    />
                    <span className="sr-only">Like</span>
                    <span className="ml-2">{discussion.likes}</span>
                  </Button>
                  <Button className="h-10 " size="icon" variant="icon">
                    <ThumbsDownIcon
                      className={`w-4 h-4 cursor-pointer ${discussion.isDisliked && "text-red-400"
                        } ${animationState[discussion._id] === "dislike" &&
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
                    disabled={
                      discussion.isMember ||
                      discussion.isRequested ||
                      discussion.isRejected
                    }
                    onClick={() => handleButtonClick(discussion)}
                  >
                    {discussion.isMember
                      ? "Member"
                      : discussion.isRequested
                        ? "Requested"
                        : discussion.isRejected
                          ? "Rejected"
                          : "Join"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
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
