"use client";
import React, { useEffect, useState, useRef } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import DiscussionList from "@/app/(components)/DiscussionList";
import { useSession } from "next-auth/react";
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
import { toast } from "react-toastify";

const getSuggestions = async (q) => {
  const response = await fetch(
    `/api/discussion/autocomplete?searchQuery=${encodeURIComponent(q)}`
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
  const { data: session } = useSession();
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
    <div className="flex-1 md:pt-3 sm:pt-2 pt-0 md:px-6 px-2">
      {/* search button */}
      <div className="flex mb-8 md:mt-5 sm:mt-3 mt-2 md:justify-center md:flex-row flex-col w-full ">
        <div className="flex md:justify-between  md:pl-6 items-center relative">
          <div className="w-full">
            <input
              type="text"
              placeholder="Looking for a ml engineer?"
              className="w-full bg-transparent md:py-3 py-2 border-2 border-gray-300 rounded-full md:px-8 px-6"
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

          <div className="flex justify-between items-center sm:gap-4 pl-2">
            <Button
              variant="icon"
              onClick={handleSearch}
              className="h-7 w-7 bg-slate-900 rounded-full p-1.5 mr-1 sm:ml-3"
            >
              <AiOutlineSearch className="h-full w-full  text-white font-bold" />
            </Button>
            <FilterDrawer applyFilters={handleFilterApplication} />

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger>
                <CgPlayListAdd className="h-9 w-9 mt-1 cursor-pointer" />
              </DialogTrigger>

              <DialogContent className="sm:max-w-[720px] overflow-y-auto max-h-[95%]">
                <DialogHeader>
                  <DialogTitle>
                    {session?.user?.collegeName
                      ? "New Discussion"
                      : "Complete your profile"}
                  </DialogTitle>
                  <DialogDescription>
                    {session?.user?.collegeName
                      ? "Start a new discussion and interact with your peers."
                      : "Please provide your college name in your profile to start a new discussion."}
                  </DialogDescription>
                </DialogHeader>
                {session?.user?.collegeName && (
                  <CreateDiscussion setDiscussions={setDiscussions} />
                )}
              </DialogContent>
            </Dialog>
          </div>
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
