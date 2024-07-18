"use client";
import React, { useEffect, useState, useRef } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import DiscussionList from "@/app/(components)/DiscussionList";

import { Button } from "@/components/ui/button";
import Link from "next/link";
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
import { CgPlayListAdd } from "react-icons/cg";

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
  const [showSuggestions, setShowSuggestions] = useState(false);
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
          setShowSuggestions(true);
        } else if (searchQuery.length === 0) {
          setReloadList(true);
          setOffset(0);
          setHasMore(true);
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error("Error fetching discussions:", error);
      }
    };
    fetchData();
  }, [searchQuery]);

  return (
    <div className="flex-1 md:pt-3 pt-0 md:px-6 px-3 ">
      {/* search button */}
      <div className="flex mb-8 md:mt-5 mt-2 md:justify-center md:flex-row flex-col gap-4 w-full ">
        <div className="flex gap-2 md:gap-0 md:justify-between border-2 rounded-full pl-6 items-center  relative">
          <div className=" w-[85%]">
            <input
              type="text"
              placeholder="Looking for a ml engineer?"
              className="w-full bg-transparent py-3 rounded-lg outline-none"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {/* search suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute top-13 left-2 right-2  bg-gray-200 rounded shadow-lg "
              >
                {suggestions.map((suggestion, index) => (
                  <Link
                    key={index}
                    href={`/discussions/${suggestion._id}`}
                    className="hover:bg-gray-400"
                  >
                    <div key={index} className="p-2 truncate cursor-pointer">
                      {suggestion.title}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Button
            variant="icon"
            onClick={handleSearch}
            className="h-8 w-8 bg-slate-900 rounded-full p-2 mr-[10px]"
          >
            <AiOutlineSearch className="h-full w-full  text-white " />
          </Button>
        </div>
        <div className="flex justify-between px-4 md:px-0">
          <FilterDrawer applyFilters={handleFilterApplication} />

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <CgPlayListAdd className="h-9 w-9 ml-4 mt-2 cursor-pointer" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[720px] overflow-y-auto max-h-[95%]">
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
  );
};

export default DiscussionsPage;
