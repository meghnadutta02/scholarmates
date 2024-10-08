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
    <Card className="relative w-full rounded-t-lg rounded-b-none border-b-0 shadow-none">
      <div className="flex mx-auto py-3 px-4 w-3/4 justify-center items-center">
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
          className="absolute w-full pt-4 overflow-y-auto scrollbar-none bg-gray-100 max-h-[400px]"
        >
          {connections.length > 0 ? (
            <div>
              {filteredConnections.length === 0 ? (
                <p className="text-red-400 mt-4 text-center">
                  No users matched your search
                </p>
              ) : (
                <>
                  {filteredConnections.map((connection) => (
                    <Button
                      variant="icon"
                      key={connection._id}
                      href="#"
                      onClick={(e) => {
                        setSelectedUser(connection);
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
                </>
              )}
            </div>
          ) : (
            <>
              <div className="p-4 text-center">
                <p>You have no connections right now</p>
                Head to{" "}
                <Link className="text-blue-600" href="/find-people">
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
