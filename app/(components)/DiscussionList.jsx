"use client";
import React, { useState, useEffect } from "react";
import Loading from "../(routes)/discussions/loading";
const getDiscussions = async (query = "") => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/discussion${query}`
  );
  return response.json();
};

const DiscussionList = ({ selectedFilters, searchQuery, reloadList }) => {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);

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
  }, [reloadList]);

  return (
    <div>
      {loading ? (
        <Loading />
      ) : discussions.length === 0 ? (
        <p>No discussions found for the selected filters.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {discussions.map((discussion) => (
            <div
              key={discussion._id}
              className="bg-white shadow-lg rounded-lg overflow-hidden"
            >
              <div className="px-6 py-4">
                <h3 className="text-xl font-bold mb-2">{discussion.title}</h3>
                <p className="text-gray-700 text-base">{discussion.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiscussionList;
