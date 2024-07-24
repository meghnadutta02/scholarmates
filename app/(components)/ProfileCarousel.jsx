"use client";
import Loading from "@/app/(components)/Loading";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";
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

export default function ProfileCarousel({ user }) {
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState([]);
  const [requestedProfiles, setRequestedProfiles] = useState(new Set());
  const [connectingProfile, setConnectingProfile] = useState(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        if (user) {
          const res = await fetch(`/api/users/find-people?id=${user.db_id}`, {
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
  }, [user]);

  const handleConnectClick = async (profileId) => {
    try {
      setConnectingProfile(profileId);
      if (profileId && user) {
        if (requestedProfiles.has(profileId)) {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_NODE_SERVER}/sendconnection/unsendconnection/${user.db_id}`,
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
            toast.success("Connection request removed", {
              autoClose: 4000,
              closeOnClick: true,
            });
            setRequestedProfiles((prev) => {
              const newSet = new Set(prev);
              newSet.delete(profileId);
              return newSet;
            });
          }
        } else {

          const res = await fetch(
            `${process.env.NEXT_PUBLIC_NODE_SERVER}/sendconnection/${user.db_id}`,
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
            setRequestedProfiles((prev) => new Set(prev).add(profileId));
          }
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
    <>
      {loading ? (
        <Loading />
      ) : profiles && profiles.length === 0 && !loading ? (
        <div className="md:my-8 my-6 font-sans gap-2 flex flex-col items-center w-full">
          <p className="sm:text-lg text-md text-gray-500 dark:text-gray-400">
            No profiles left to show.
          </p>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center w-full">
          <div className="text-md italic text-gray-600 text-center">
            Our website is growing, and while there are no matches with your
            interests yet, you can still connect with others.
          </div>
          <Carousel className="relative border-2 border-gray-300 rounded-lg p-4 w-full max-w-xs md:max-w-md lg:max-w-2xl md:my-8 my-6 min-h-[28rem]">
            <CarouselContent>
              {profiles.map((profile, index) => (
                <CarouselItem key={profile._id}>
                  <div className="grid gap-2">
                    <div className="p-2">
                      <div className="flex md:flex-row flex-col justify-between items-stretch">
                        <Link href={`/profile/${profile._id}`}>
                          <div className="flex gap-4 cursor-pointer items-center">
                            <Image
                              alt="Thumbnail"
                              className="rounded-full object-cover aspect-square md:h-20 md:w-20 h-16 w-16"
                              height={80}
                              src={profile.profilePic}
                              width={80}
                            />
                            <div className="flex flex-col">
                              <div className="font-semibold">
                                {profile.name}
                              </div>
                              <div className="flex flex-col">
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  {profile.collegeName}
                                </div>
                                {profile.department && profile.degree && (
                                  <div className="hidden sm:block">
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                      {profile.degree} in {profile.department}{" "}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                      {getYearWithSuffix(profile.yearInCollege)}{" "}
                                      year{" "}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>

                        <div className="flex flex-row md:flex-col w-full md:w-[24%] justify-between items-center">
                          <p className="text-sm text-gray-600">
                            {profile.connection.length} connection
                            {profile.connection.length > 1 ? "s" : ""}
                          </p>
                          <div className="mt-2">
                            <Button
                              className={`h-8 sm:h-10 ${requestedProfiles.has(profile._id)
                                ? "bg-gray-500 text-white cursor-pointer"
                                : ""
                                }`}
                              onClick={() => handleConnectClick(profile._id)}
                              disabled={
                                connectingProfile === profile._id

                              }

                            >
                              {requestedProfiles.has(profile._id)
                                ? "Requested"
                                : connectingProfile === profile._id
                                  ? "Sending.."
                                  : "Connect"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {profile.bio && (
                      <div className="bg-gray-100 rounded-xl p-4 text-sm dark:bg-gray-800">
                        <p>{profile.bio}</p>
                      </div>
                    )}
                    <div className="bg-gray-100 rounded-xl p-4 text-sm dark:bg-gray-800">
                      <h2 className="font-semibold text-lg">Interests</h2>
                      <ul
                        className={`list-disc list-inside ${profile.interestCategories.length > 5
                            ? "grid grid-cols-2 gap-x-4"
                            : ""
                          }`}
                      >
                        {profile.interestCategories.map((interest, index) => (
                          <li key={index}>{interest}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex absolute left-0 right-0 translate-x-0 bottom-2 justify-between w-full px-4">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </Carousel>
        </div>
      )}
    </>
  );
}
