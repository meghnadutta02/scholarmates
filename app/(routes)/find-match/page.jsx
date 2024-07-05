"use client";
import Spinnersvg from "@/public/Spinner.svg";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "@/app/(components)/SessionProvider";
import { useState, useEffect } from "react";
import ProfileCarousel from "@/app/(components)/ProfileCarousel";
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
  const { session, user } = useSession();
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
    <>
      {user &&
      user.interestCategories.length > 0 &&
      user.interestSubcategories.length > 0 ? (
        <div className="">
          {loading ? (
            <div className="flex justify-center items-center z-50">
              <Image src={Spinnersvg} alt="Loading..." className="h-28" />
            </div>
          ) : profiles.length === 0 ? (
            <div className=" md:my-8 my-6 font-sans gap-2 flex flex-col justify-center">
              <div className=" text-md italic text-gray-600 mb-2 text-center">
                Our website is growing, and while there are no matches with your
                interests yet, you can still connect with others.
              </div>
              <ProfileCarousel />
            </div>
          ) : (
            <div>
              <Carousel className="border-2 border-gray-300 rounded-lg p-4 w-full max-w-xs md:max-w-md lg:max-w-2xl md:my-8 my-6">
                <CarouselContent>
                  {profiles.map((profile) => (
                    <CarouselItem key={profile._id}>
                      <div className="grid gap-2">
                        <div className="p-2 ">
                          <div className="flex md:flex-row flex-col justify-between items-center">
                            <Link href={`/profile/${profile._id}`} asChild>
                              <div className="flex gap-2  cursor-pointer items-center ">
                                <Image
                                  alt="Thumbnail"
                                  className="rounded-full object-cover aspect-square md:h-20 md:w-20 h-16 w-16"
                                  height={80}
                                  src={profile.profilePic}
                                  width={80}
                                />
                                <div className=" flex flex-col ">
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
                                          {profile.degree} in{" "}
                                          {profile.department}{" "}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                          {getYearWithSuffix(
                                            profile.yearInCollege
                                          )}{" "}
                                          year{" "}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </Link>
                            <div className="sm:flex  gap-2    flex-col  hidden items-center">
                              <p className="text-sm text-gray-600">
                                {profile.connection.length} connection
                                {profile.connection.length > 1 ? "s" : ""}
                              </p>
                              {requestPend.includes(profile._id) ? (
                                <Button disabled>Requested</Button>
                              ) : (
                                <Button
                                  onClick={() =>
                                    handleConnectClick(profile._id)
                                  }
                                  disabled={connectingProfile === profile._id}
                                >
                                  {connectingProfile === profile._id
                                    ? "Sending.."
                                    : "Connect"}
                                </Button>
                              )}
                            </div>
                            <div className="flex  w-full justify-between    flex-row sm:hidden items-center">
                              <p className="text-sm text-gray-600">
                                {profile.connection.length} connection
                                {profile.connection.length > 1 ? "s" : ""}
                              </p>
                              {requestPend.includes(profile._id) ? (
                                <Button disabled>Requested</Button>
                              ) : (
                                <Button
                                  onClick={() =>
                                    handleConnectClick(profile._id)
                                  }
                                  disabled={connectingProfile === profile._id}
                                >
                                  {connectingProfile === profile._id
                                    ? "Sending.."
                                    : "Connect"}
                                </Button>
                              )}
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
      ) : (
        <div className="text-center my-8 font-sans">
          <div className="font-semibold text-2xl mb-2">
            Please complete your profile to find matches.
          </div>
          <Link
            href={`/profile/${session.db_id}`}
            asChild
            className="flex justify-center"
          >
            <span className="text-gray-600 font-xl">Go to Profile</span>
          </Link>
        </div>
      )}
    </>
  );
}
