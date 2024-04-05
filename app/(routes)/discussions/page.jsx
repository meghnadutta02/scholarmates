"use client";
import React, { useEffect, useState, useRef } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import DiscussionList from "@/app/(components)/DiscussionList";
import { IoIosCreate } from "react-icons/io";
import DiscussionFilter from "@/app/(components)/DiscussionFilter";
import { Button } from "@/components/ui/button";
import { FaFilter } from "react-icons/fa6";
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
  const [reloadList, setReloadList] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false); // New state variable
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const suggestionsRef = useRef(null);

  const handleFilterApplication = (filters) => {
    setSelectedFilters(filters);
    setReloadList(true);
  };
  const toggleFilter = () => {
    setIsFilterOpen((prevState) => !prevState);
  };
  const handleSearch = () => {
    setReloadList(true);
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
      <div className="flex p-4 gap-4 md:p-6 justify-center relative">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <IoIosCreate className="h-12 w-12 text-gray-600 absolute top-14  right-14   cursor-pointer p-2 text-center" />
          </DialogTrigger>
          <DialogContent className="sm:max-w-[720px]">
            <DialogHeader>
              <DialogTitle>New Discussion</DialogTitle>
              <DialogDescription>
                Start a new discussion and interact with your peers.
              </DialogDescription>
            </DialogHeader>
            <CreateDiscussion />
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex">
        {/* filter section */}

        {isFilterOpen && (
          <DiscussionFilter applyFilters={handleFilterApplication} />
        )}
        {/* discussion list */}
        <div className="flex-1 pt-5 px-6 ">
          {/* search button */}
          <div className="flex mb-10 justify-center">
            <div className=" relative w-[50%]">
              <input
                type="text"
                placeholder="looking for a cloud engineer?"
                className="w-full pl-10 pr-4 py-2 rounded border"
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

            <Button className="ml-4" onClick={handleSearch}>
              Search
            </Button>
            <Button
              className="ml-4 flex items-center"
              variant="secondary"
              onClick={toggleFilter}
            >
              <FaFilter className="mr-1" />
              Filter
            </Button>
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
