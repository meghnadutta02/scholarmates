"use client";
import React, { useState, useEffect } from "react";
import Loading from "../(routes)/discussions/loading";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useSession } from "next-auth/react";
const getDiscussions = async (query = "") => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/discussion${query}`
  );
  return response.json();
};

const DiscussionList = ({ selectedFilters, searchQuery, reloadList }) => {
  const { data: session } = useSession();

  const toggleLike = async (id) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/discussion/${id}/like`,
      { method: "PUT" }
    );
    const data = await response.json();
    console.log(data);
    if (data.ok)
      setDiscussions((prevDiscussions) =>
        prevDiscussions.map((discussion) => {
          if (discussion._id === id) {
            if (discussion.isLiked) {
              discussion.likes += 1;
            } else {
              discussion.likes -= 1;
            }
            discussion.isLiked = !discussion.isLiked;
          }
          return discussion;
        })
      );
  };

  const toggleDislike = async (id) => {
    console.log("Dislike");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/discussion/${id}/dislike`,
      { method: "PUT" }
    );
    const data = await response.json();
    console.log(data);
    if (data.ok)
      setDiscussions((prevDiscussions) =>
        prevDiscussions.map((discussion) => {
          if (discussion._id === id) {
            if (discussion.isDisliked) {
              discussion.dislikes += 1;
            } else {
              discussion.dislikes -= 1;
            }
            discussion.isDisliked = !discussion.isDisliked;
          }
          return discussion;
        })
      );
  };
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buttonState, setButtonState] = useState("Join");
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

        const { result } = await getDiscussions(query);

        result.forEach((discussion) => {
          if (
            discussion.likedBy &&
            discussion.likedBy.length > 0 &&
            discussion.likedBy.includes(session?.user?.db_id)
          ) {
            console.log("liked");
            discussion.isLiked = true;
          }
          if (
            discussion.dislikedBy &&
            discussion.dislikedBy.length > 0 &&
            discussion.dislikedBy.includes(session?.user?.db_id)
          ) {
            discussion.isDisliked = true;
          }
        });
        setDiscussions(result);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching discussions:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedFilters, searchQuery, reloadList]);

  const handleButtonClick = () => {
    if (buttonState === "Join") {
      setButtonState("Requested");
      // Send a join request here
    } else if (buttonState === "Requested") {
      // Do nothing or show a message that a request has already been sent
    } else if (buttonState === "Member") {
      // Do nothing or show a message that the user is already a member
    }
  };

  return (
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
                className="rounded-full"
                height="48"
                src={discussion.creatorData.profilePic}
                style={{
                  aspectRatio: "48/48",
                  objectFit: "cover",
                }}
                width="48"
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
                <div className="prose max-w-none">
                  <p>{discussion.content}</p>
                </div>
                <div className="grid w-full grid-cols-4 items-center gap-4 text-center md:gap-8 mb-2">
                  <Button className="h-10" size="icon" variant="icon">
                    <ThumbsUpIcon
                      className={`w-4 h-4 transition-colors duration-500 ease-in-out cursor-pointer ${
                        discussion.isLiked ? "text-blue-400" : "inherit"
                      }`}
                      onClick={() => toggleLike(discussion._id)}
                    />
                    <span className="sr-only">Like</span>
                    <span className="ml-2">{discussion.likes}</span>
                  </Button>
                  <Button className="h-10 " size="icon" variant="icon">
                    <ThumbsDownIcon
                      className={`w-4 h-4 transition-colors duration-500 ease-in-out cursor-pointer ${
                        discussion.isDisliked ? "text-red-400" : "inherit"
                      }`}
                      onClick={() => toggleDislike(discussion._id)}
                    />
                    <span className="sr-only">Dislike</span>
                    <span className="ml-2">{discussion.dislikes}</span>
                  </Button>
                  <Button className="h-10" size="icon" variant="icon">
                    <TrendingUpIcon className="w-4 h-4" />
                    <span className="sr-only">Popularity</span>
                    <span className="ml-2">High</span>
                  </Button>
                  <Button
                    className="w-24"
                    variant="secondary"
                    onClick={handleButtonClick}
                  >
                    {buttonState}
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
