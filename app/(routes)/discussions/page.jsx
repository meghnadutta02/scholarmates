"use client";
import React, { useEffect, useState, useRef } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import DiscussionList from "@/app/(components)/DiscussionList";
import { IoIosCreate } from "react-icons/io";
import { Button } from "@/components/ui/button";
import FilterDrawer from "@/app/(components)/FilterDrawer";

import CreateDiscussion from "@/app/(components)/NewDiscussion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const getSuggestions = async (q) => {
  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_URL
    }/api/discussion/autocomplete?searchQuery=${encodeURIComponent(q)}`
  );
  return response.json();
};

const DiscussionsPage = () => {
  const [open, setOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    category: [],
    subcategory: [],
    college: false,
    type: [],
  });
  const [offset, setOffset] = useState(0);
  const [reloadList, setReloadList] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false); // New state variable
  const [hasMore, setHasMore] = useState(true);
  const [discussions, setDiscussions] = useState([]);
  const suggestionsRef = useRef(null);

  const handleFilterApplication = (filters) => {
    setSelectedFilters(filters);
    setReloadList(true);
    setOffset(0);
    setHasMore(true);
  };

  const handleSearch = () => {
    setReloadList(true);
    setOffset(0);
    setHasMore(true);
  };

  const handleClickOutside = (event) => {
    if (
      suggestionsRef.current &&
      !suggestionsRef.current.contains(event.target)
    ) {
      setShowSuggestions(false); // Hide suggestions when clicked outside
    } else if (
      suggestionsRef.current &&
      suggestionsRef.current.contains(event.target)
    ) {
      setShowSuggestions(true);
    }
  };

  useEffect(() => {
    if (reloadList) {
      setReloadList(false);
    }
  }, [reloadList]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (searchQuery && searchQuery.length > 1) {
          const { result } = await getSuggestions(searchQuery);
          setSuggestions(result);
          setShowSuggestions(true); // Show suggestions when available
        } else if (searchQuery.length === 0) {
          setReloadList(true);
          setShowSuggestions(false); // Hide suggestions when search query is empty
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

        {/* discussion list */}
        <div className="flex-1 md:pt-5 pt-0  md:px-6 px-4 ">
          {/* search button */}
          <div className="flex mb-8 d:mt-5 mt-2 md:justify-center md:flex-row flex-col gap-4 w-full ">
            <div className="flex gap-2 md:gap-0 md:justify-between">
              <div className=" relative  w-[85%]  ">
                <input
                  type="text"
                  placeholder="looking for a ml engineer?"
                  className="w-full pl-10 pr-4 md:py-2 py-[6px] rounded border"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    e.target.value.length > 3 && handleSearch();
                  }}
                />
                <div className="absolute top-3 left-1 flex items-center pointer-events-none">
                  <AiOutlineSearch className="h-5 w-5 text-gray-400" />{" "}
                </div>
                {/* search suggestions */}
                {showSuggestions && suggestions.length > 0 && (
                  <div
                    ref={suggestionsRef}
                    className="absolute top-11 w-full bg-gray-200 rounded shadow-lg "
                  >
                    {suggestions.map((suggestion, index) => (
                      <div key={index} className="p-2 truncate">
                        {suggestion.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button className="md:ml-4" onClick={handleSearch}>
                Search
              </Button>
            </div>
            <div className="flex justify-between ">
              <FilterDrawer applyFilters={handleFilterApplication} />

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <IoIosCreate className="h-8 w-8 ml-4 mt-1 cursor-pointer" />
                </DialogTrigger>
                <DialogContent className="sm:max-w-[720px]">
                  <DialogHeader>
                    <DialogTitle>New Discussion</DialogTitle>
                    <DialogDescription>
                      Start a new discussion and interact with your peers.
                    </DialogDescription>
                  </DialogHeader>
                  <CreateDiscussion setDiscussions={setDiscussions} />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <DiscussionList
            selectedFilters={selectedFilters}
            searchQuery={searchQuery}
            reloadList={reloadList}
            offset={offset}
            setOffset={setOffset}
            setHasMore={setHasMore}
            hasMore={hasMore}
            discussions={discussions}
            setDiscussions={setDiscussions}
          />
        </div>
      </div>
    </div>
  );
};

export default DiscussionsPage;
