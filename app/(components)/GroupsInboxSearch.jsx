"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Component({ setRoomID, setToggleChatView }) {
  const [showList, setShowList] = useState(false);
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const componentRef = useRef(null);

  useEffect(() => {
    const fetchGroups = async () => {
      const response = await fetch("/api/groups");
      const data = await response.json();
      setGroups(data.groups);
      setFilteredGroups(data.groups);
    };
    fetchGroups();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target)
      ) {
        setShowList(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    const searchTerm = e.target.value.trim();
    setShowList(searchTerm !== "");

    const filtered = groups.filter((group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredGroups(filtered);
  };

  return (
    <Card className="relative w-full rounded-t-lg rounded-b-none border-b-0 shadow-none">
      <div className="flex mx-auto py-3 px-4 w-3/4 justify-center items-center">
        <Input
          type="search"
          placeholder="Search groups..."
          className="pl-10 pr-4 py-2 rounded-full bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
          onChange={handleSearch}
        />
      </div>
      {showList && (
        <CardContent
          ref={componentRef}
          className="absolute w-full pt-4 overflow-y-auto scrollbar-none bg-gray-100 max-h-[400px]"
        >
          {filteredGroups.length === 0 ? (
            <p className="text-red-400 mt-4 text-center">
              No discussion matched your search
            </p>
          ) : (
            <>
              {filteredGroups.map((group) => (
                <Button
                  variant="icon"
                  key={group._id}
                  href="#"
                  onClick={(e) => {
                    console.log(group);
                    setRoomID(group._id);

                    setToggleChatView(false);
                    setShowList(false);
                  }}
                  className="flex items-center justify-start gap-4 px-2 h-14 w-full rounded-md hover:bg-red-200"
                >
                  <div className="">
                    <p className="text-sm font-medium leading-none">
                      {group.name}
                    </p>
                  </div>
                </Button>
              ))}
            </>
          )}
        </CardContent>
      )}
    </Card>
  );
}
