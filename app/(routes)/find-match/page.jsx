"use client";
import Spinnersvg from "@/public/Spinner.svg";
import { Button } from "@/components/ui/button";
import { io } from "socket.io-client";
import Image from "next/image";
import { useSession } from "@/app/(components)/SessionProvider";
const getYearWithSuffix = (year) => {
  const suffixes = ["th", "st", "nd", "rd"];
  const lastDigit = year % 10;
  const suffix = suffixes[lastDigit] || suffixes[0];
  return `${year}${suffix}`;
};
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { useState, useEffect } from "react";
export default function Component() {
  // use session
  const { session, request } = useSession();

  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState([]);
  const [userId, setUserId] = useState();
  const [requestdata, setRequestData] = useState([]);
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(true);
  const [requestPend, setRequestPen] = useState([]);

  useEffect(() => {
    if (session) {
      setUserId(session);
    }
  }, [userId, session]);

  const userdata = async () => {
    try {
      const res = await fetch(`/api/users/profile?id=${userId.db_id}`, {
        cache: "no-cache",
      });
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await res.json();

      setData(data.result);
      setRequestPen(data.result.requestPending);
      setVisible(true);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    userdata();
  }, [visible]);
  // useEffect(() => {
  //   socket = io("http://localhost:5001");
  //   console.log(userId)
  //   socket.emit("setup", userId);

  //   socket.on('connectionRequest', (data) => {
  //     console.log(data);
  //     if (data != null) {
  //       setRequestData(prevData => [...prevData, data]);
  //     }

  //     setRequest(prevRequest => ({ ...prevRequest, ...data }));
  //     console.log("data we have:", data);
  //   });

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
          setLoading(true);
          const res = await fetch(`/api/users/matching`, {
            cache: "no-cache",
          });
          if (!res.ok) {
            throw new Error("Failed to fetch data");
          }
          const data = await res.json();

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

  const handleConnectClick = async (profileId) => {
    try {
      console.log("profile", profileId);
      console.log(userId.db_id);
      if (profileId && userId) {
        const data = await fetch(
          `http://localhost:5001/sendconnection/${userId.db_id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ recipientId: profileId }),
            cache: "no-cache",
          }
        );
        if (data) {
          setVisible(false);
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
    <div className="justify-center">
      <h2 className="my-4 text-center font-semibold text-2xl">
        Connect with people
      </h2>
      {loading ? (
        <div className="flex justify-center items-center  z-50">
          <Image src={Spinnersvg} alt="Loading..." className="h-28" />
        </div>
      ) : (
        <div>
          <Carousel className="border-2 border-gray-300 rounded-lg p-4 w-full max-w-xs md:max-w-md lg:max-w-2xl ">
            <CarouselContent>
              {profiles.map((profile) =>
                !data?.connection?.includes(profile._id) ? (
                  <CarouselItem key={profile._id}>
                    <div className="grid gap-2">
                      <div className="p-2  grid gap-2">
                        <div className="flex gap-2 items-center">
                          <div className="flex gap-2 items-center">
                            <Image
                              alt="Thumbnail"
                              className="rounded-full object-cover aspect-square"
                              height={80}
                              src={profile.profilePic}
                              width={80}
                            />
                            <div className="text-sm flex flex-col gap-2">
                              <div className="font-semibold">
                                {profile.name}
                              </div>
                              <div className="flex flex-col">
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  {profile.collegeName}
                                </div>
                                {profile.department && profile.degree && (
                                  <>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                      {profile.degree} in {profile.department}{" "}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                      {" "}
                                      {getYearWithSuffix(
                                        profile.yearInCollege
                                      )}{" "}
                                      year{" "}
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex ml-auto gap-4">
                            {requestPend?.includes(profile._id) ? (
                              <Button disabled>Requested</Button>
                            ) : (
                              <Button
                                onClick={() => handleConnectClick(profile._id)}
                              >
                                Connect
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-100 rounded-xl p-4 text-sm dark:bg-gray-800">
                        <p>{profile.bio}</p>
                      </div>
                      <div className="bg-gray-100 rounded-xl p-4 text-sm dark:bg-gray-800">
                        <h2 className="font-semibold text-lg">Interests</h2>
                        <ul className="list-disc list-inside">
                          {profile.interestCategories.map((interest) => (
                            <div key={interest._id}>
                              <li>{interest}</li>
                            </div>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CarouselItem>
                ) : null
              )}
            </CarouselContent>

            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      )}
    </div>
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
