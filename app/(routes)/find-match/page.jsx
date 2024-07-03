"use client";
import Spinnersvg from "@/public/Spinner.svg";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import Image from "next/image";
import { useSession } from "@/app/(components)/SessionProvider";
import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const getYearWithSuffix = (year) => {
  const suffixes = ["th", "st", "nd", "rd"];
  const lastDigit = year % 10;
  const suffix = suffixes[lastDigit] || suffixes[0];
  return `${year}${suffix}`;
};

export default function Component() {
  const { session } = useSession();
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState([]);
  const [userId, setUserId] = useState();
  const [requestPend, setRequestPen] = useState([]);
  const [connectingProfile, setConnectingProfile] = useState(null);

  useEffect(() => {
    if (session) {
      setUserId(session);
    }
  }, [session]);

  const fetchUserData = async () => {
    try {
      const res = await fetch(`/api/users/profile?id=${userId.db_id}`, {
        cache: "no-cache",
      });
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await res.json();
      setRequestPen(data.result.requestPending);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  useEffect(() => {
    const fetchProfiles = async () => {
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
        console.error("Error fetching profiles:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, [userId]);

  const handleConnectClick = async (profileId) => {
    try {
      setConnectingProfile(profileId);
      if (profileId && userId) {
        const res = await fetch(
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
        if (res.ok) {
          toast.success("Connection request sent", {
            autoClose: 4000,
            closeOnClick: true,
          });
          setRequestPen((prev) => [...prev, profileId]);
        }
      } else {
        console.log("Profile ID not found");
      }
    } catch (error) {
      console.log("Error: ", error.message);
    } finally {
      setConnectingProfile(null);
    }
  };

  return (
    <div className="justify-center">
      <h2 className="my-4 text-center font-semibold text-2xl">
        Connect with people
      </h2>
      {loading ? (
        <div className="flex justify-center items-center z-50">
          <Image src={Spinnersvg} alt="Loading..." className="h-28" />
        </div>
      ) : (
        <div>
          <Carousel className="border-2 border-gray-300 rounded-lg p-4 w-full max-w-xs md:max-w-md lg:max-w-2xl">
            <CarouselContent>
              {profiles.map((profile) => (
                <CarouselItem key={profile._id}>
                  <div className="grid gap-2">
                    <div className="p-2 grid gap-2">
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
                                    {getYearWithSuffix(profile.yearInCollege)}{" "}
                                    year{" "}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex ml-auto gap-4">
                          {requestPend.includes(profile._id) ? (
                            <Button disabled>Requested</Button>
                          ) : (
                            <Button
                              onClick={() => handleConnectClick(profile._id)}
                              disabled={connectingProfile === profile._id}
                            >
                              {connectingProfile === profile._id ? (
                                <Image src={Spinnersvg} alt="Loading..." className="h-4 w-4" />
                              ) : (
                                "Connect"
                              )}
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
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      )}
    </div>
  );
}
