"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function Component({ setSelectedUser, setToggleChatView }) {
  const [showList, setShowList] = useState(false);
  const [connections, setConnections] = useState([]);
  const [filteredConnections, setFilteredConnections] = useState([]);
  const componentRef = useRef(null);

  useEffect(() => {
    const fetchConnections = async () => {
      const response = await fetch("/api/connection");
      const data = await response.json();
      setConnections(data.connections);
      setFilteredConnections(data.connections);
    };
    fetchConnections();
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
      // Step 4: Clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    const searchTerm = e.target.value.trim();
    setShowList(searchTerm !== "");

    const filtered = connections.filter((connection) =>
      connection.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredConnections(filtered);
  };

  return (
    <Card className="w-full rounded-t-lg rounded-b-none shadow-none">
      <div className="flex mx-auto py-3 px-4 w-3/4 justify-center items-center">
        {!showList && (
          <SearchIcon className="absolute left-2/3 md:left-3/4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        )}
        <Input
          type="search"
          placeholder="Search contacts..."
          className="pl-10 pr-4 py-2 rounded-full bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
          onChange={handleSearch}
        />
      </div>
      {showList && (
        <CardContent
          ref={componentRef}
          className="pt-4 overflow-y-auto scrollbar-none bg-gray-50 max-h-[400px]"
        >
          {connections.length > 0 ? (
            <div>
              {filteredConnections.map((connection) => (
                <Button
                  variant="icon"
                  key={connection._id}
                  href="#"
                  onClick={(e) => {
                    setSelectedUser(connection);
                    console.log(connection._id);
                    setToggleChatView(false);
                    setShowList(false);
                  }}
                  className="flex items-center justify-start gap-4 px-2 h-14 w-full rounded-md hover:bg-gray-200"
                >
                  <div>
                    <Avatar className="w-10 h-10 border">
                      <AvatarImage src={connection.profilePic} />
                      <AvatarFallback>SD</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="">
                    <p className="text-sm font-medium leading-none">
                      {connection.name}
                    </p>
                  </div>
                </Button>
              ))}
            </div>
          ) : (
            <>
              <div className="p-4 text-center">
                <p>You have no connections right now</p>
                Head to{" "}
                <Link className="text-blue-600" href="/find-match">
                  <u> Find people</u>
                </Link>{" "}
                to add some.
              </div>
            </>
          )}
        </CardContent>
      )}
    </Card>
  );
}

function SearchIcon(props) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
