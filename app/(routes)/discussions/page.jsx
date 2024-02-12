"use client";
import React, { useEffect, useState } from "react";

import { AiOutlineSearch } from "react-icons/ai";

import DiscussionList from "@/app/(components)/DiscussionList";
import DiscussionFilter from "@/app/(components)/DiscussionFilter";

const getSuggestions = async (q) => {
  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_URL
    }/api/discussion/autocomplete?searchQuery=${encodeURIComponent(q)}`
  );
  return response.json();
};

const DiscussionsPage = () => {
  const [selectedFilters, setSelectedFilters] = useState({
    category: [],
    subcategory: [],
    college: false,
    type: [],
  });
  const [reloadList, setReloadList] = useState(false);

  const [suggestions, setSuggestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleFilterApplication = (filters) => {
    setSelectedFilters(filters);
    setReloadList(true);
  };

  const handleSearch = () => {
    setSuggestions([]);
    setReloadList(true);
  };

  useEffect(() => {
    if (reloadList) {
      setReloadList(false);
    }
  }, [reloadList]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (searchQuery && searchQuery.length > 1) {
          const { result } = await getSuggestions(searchQuery);
          setSuggestions(result);
          console.log(result);
        } else if (searchQuery.length === 0) {
          setReloadList(true);
        }
      } catch (error) {
        console.error("Error fetching discussions:", error);
      }
    };
    fetchData();
  }, [searchQuery]);

  return (
    <div>
      <div className="flex">
        {/* filter section */}
        <div className="w-[24%]">
          <DiscussionFilter applyFilters={handleFilterApplication} />
        </div>
        {/* discussion list */}
        <div className="flex-1 pt-5 px-6">
          {/* search button */}
          <div className="flex mb-10">
            <div className="relative w-[50%]">
              <input
                type="text"
                placeholder="looking for a cloud engineer?"
                className="w-full pl-10 pr-4 py-2 rounded border"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute top-3 left-1 flex items-center pointer-events-none">
                <AiOutlineSearch className="h-5 w-5 text-gray-400" />{" "}
              </div>
              {/* search suggestions */}
              {suggestions && suggestions.length > 0 && (
                <div className="absolute top-11 w-full bg-gray-200 rounded shadow-lg ">
                  {suggestions.map((suggestion, index) => (
                    <div key={index} className="p-2 truncate">
                      {suggestion.title}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              className="w-[70px] ml-4  bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors duration-300"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>

          <DiscussionList
            selectedFilters={selectedFilters}
            searchQuery={searchQuery}
            reloadList={reloadList}
          />
        </div>
      </div>
    </div>
  );
};

export default DiscussionsPage;
