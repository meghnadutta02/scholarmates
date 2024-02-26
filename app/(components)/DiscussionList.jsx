"use client";
import React, { useState, useEffect } from "react";
import Loading from "../(routes)/discussions/loading";
import { Button } from "@/components/ui/button";
import Image from "next/image";
const getDiscussions = async (query = "") => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/discussion${query}`
  );
  return response.json();
};

const DiscussionList = ({ selectedFilters, searchQuery, reloadList }) => {
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
        console.log(query);
        const { result } = await getDiscussions(query);
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
                src="/placeholder.svg"
                style={{
                  aspectRatio: "48/48",
                  objectFit: "cover",
                }}
                width="48"
              />
              <div className="flex-1 grid gap-2">
                <div className="flex flex-col  gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    @alicej
                  </span>{" "}
                  <h4 className="font-semibold text-base">
                    {discussion.title}
                  </h4>
                </div>
                <div className="prose max-w-none">
                  <p>
                    {discussion.content}
                    Description : Lorem ipsum dolor sit amet, consectetur
                    adipisicing elit. Hic corporis sed, magnam minus quae nulla
                    omnis incidunt maxime consequatur amet praesentium assumenda
                    necessitatibus aut quam rem saepe. Iusto, eum cumque.
                  </p>
                </div>
                <div className="grid w-full grid-cols-4 items-center gap-4 text-center md:gap-8 mb-2">
                  <Button className="h-10" size="icon" variant="icon">
                    <ThumbsUpIcon className="w-4 h-4" />
                    <span className="sr-only">Like</span>
                    <span className="ml-2">12</span>
                  </Button>
                  <Button className="h-10" size="icon" variant="icon">
                    <ThumbsDownIcon className="w-4 h-4" />
                    <span className="sr-only">Dislike</span>
                    <span className="ml-2">3</span>
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
