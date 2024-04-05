"use client";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { io } from "socket.io-client";
import Image from "next/image";
var socket, selectedChatCompare;
import { useSession } from '@/app/(components)/SessionProvider'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
export default function Component() {
  // use session
  const { session, request } = useSession();

  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState([]);
  const [userId, setUserId] = useState();
  const [requestdata, setRequestData] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
   if(session){
    console.log("this is lll:",session)
    // console.log("request is:",request);
     setUserId(session.db_id);
   }

  }, [userId]);

  useEffect(() => {
    socket = io("http://localhost:5001");
    console.log("userid:",userId)
    socket.emit("setup", userId);

    socket.on('connectionRequest', (data) => {
        console.log("data:",data);
        if (data != null) {
            setRequestData(prevData => [...prevData, data]);
        }

        setRequestData(prevRequest => ({ ...prevRequest, ...data }));
        console.log("data we have:", data);
    });


  //   return () => {
  //     socket.disconnect();
  //   };
  // }, [userId])
  // useEffect(() => {
  //   if (requestdata.length > 0) {
  //     localStorage.setItem('request', JSON.stringify(requestdata));
  //     console.log("dataaaaa:", requestdata);
  //   }
  // }, [requestdata]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userId) {
          const res = await fetch(`/api/users/${userId}`, {
            cache: "no-cache",
          });
          if (!res.ok) {
            throw new Error("Failed to fetch data");
          }
          const data = await res.json();
          console.log(data.result);
          setProfiles(data.result);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  // connect user

  const handleConnectClick = async (profileId) => {
    try {
      if (profileId && userId) {
        const data = await fetch(
          `http://localhost:5001/sendconnection/${userId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ recipientId: profileId }),
            cache: "no-cache"
          }
        );
        if (data) {
          console.log(data);
        }
      } else {
        console.log("not get profileid");
      }
    } catch (error) {
      console.log("error: =", error.message);
    }
  };

  return (
    // <div className="w-full px-4 mx-auto grid grid-rows-[auto_1fr_auto] gap-4 md:gap-6 pb-10">
    //   <main className="grid br md:grid-cols-6 gap-10 items-center">
    <div className="justify-center">
      <h2 className="my-4 text-center font-semibold text-2xl">
        Connect with people
      </h2>
      <Carousel className="border-2 border-gray-300 rounded-lg p-4 w-full max-w-xs md:max-w-md lg:max-w-2xl ">
        <CarouselContent>
          {profiles.map((profile) => (
            <CarouselItem key={profile._id}>
              <div className="grid gap-2">
                <div className="rounded-xl border ">
                  <Image
                    alt="Profile Picture"
                    className="mx-auto"
                    height={300}
                    src="https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-859.jpg?size=338&ext=jpg&ga=GA1.1.1269040533.1708732800&semt=ais"
                    width={300}
                  />
                </div>
                <div className="p-2  grid gap-2">
                  <h1 className="text-2xl font-semibold line-clamp-2">
                    {profile.name}
                  </h1>
                  <div className="flex gap-2 items-center">
                    <div className="flex gap-2 items-center">
                      <Image
                        alt="Thumbnail"
                        className="rounded-full object-cover aspect-square"
                        height={40}
                        src="/placeholder.svg"
                        width={40}
                      />
                      <div className="text-sm">
                        <div className="font-semibold">Software Engineer</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {profile.collegeName}
                        </div>
                      </div>
                    </div>
                    <div className="flex ml-auto gap-4">
                      <Button onClick={() => handleConnectClick(profile._id)}>
                        Connect
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-100 rounded-xl p-4 text-sm dark:bg-gray-800">
                  <p>
                    Im a full-stack developer with a passion for React and
                    Node.js. In my free time, I love contributing to open-source
                    projects and exploring new technologies.
                  </p>
                </div>
                <div className="bg-gray-100 rounded-xl p-4 text-sm dark:bg-gray-800">
                  <h2 className="font-semibold text-lg">Interests</h2>
                  <ul className="list-disc list-inside">
                    {profile.interests?.map((interest) => (
                      <div key={interest._id}>
                        <li>{interest.category}</li>
                      </div>
                    ))}
                  </ul>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
    //   </main>
    // </div>
  );
}

function HeartIcon(props) {
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
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}