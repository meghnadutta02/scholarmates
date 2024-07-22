"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function Component({ id }) {
  const [showList, setShowList] = useState(false);
  const [connections, setConnections] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const componentRef = useRef(null);

  useEffect(() => {
    const fetchConnections = async (q) => {
      if (q.length >= 2) {
        const response = await fetch(
          `/api/users?searchQuery=${encodeURIComponent(q)}&id=${id}`
        );
        const data = await response.json();
        setConnections(data.result);
        setShowList(true);
      }
    };
    fetchConnections(searchQuery);
  }, [searchQuery, id]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.trim());
  };

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

  return (
    <Card className="w-full rounded-lg shadow-none z-50">
      <div className="flex mx-auto py-3 px-3 w-[90%] justify-center items-center">
        <Input
          type="search"
          placeholder="Search contacts..."
          className="pl-10 pr-4 py-2 rounded-full bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
          onChange={handleSearch}
        />
      </div>
      {showList && searchQuery.length > 0 && connections && (
        <div ref={componentRef}>
          <CardContent className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 shadow-inner bg-gray-50 max-h-[300px] z-50">
            {connections.length > 0 ? (
              <div>
                {connections.map((connection, index) => (
                  <Link
                    href={`/profile/${connection._id}`}
                    key={connection._id}
                    onClick={() => {
                      setShowList(false);
                    }}
                    className={`flex items-center justify-start gap-4 px-2 h-13 w-full hover:bg-gray-200 py-2 z-50 ${
                      index === connections.length - 1
                        ? "border-b-0"
                        : "border-b border-1"
                    }`}
                  >
                    <div>
                      <Avatar className="w-10 h-10 border">
                        <AvatarImage src={connection.profilePic} />
                        <AvatarFallback>AB</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="">
                      <p className="text-sm font-medium leading-none">
                        {connection.name}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-2 items-center justify-center flex  text-gray-500 dark:text-gray-400">
                <p>No matching profiles</p>
              </div>
            )}
          </CardContent>
        </div>
      )}
    </Card>
  );
}
