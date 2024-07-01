import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import Loading from "../(routes)/connection/loading";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useSession } from "./SessionProvider";
import { Button } from "@/components/ui/button";

const getYearWithSuffix = (year) => {
  const suffixes = ["th", "st", "nd", "rd"];
  const lastDigit = year % 10;
  const suffix = suffixes[lastDigit] || suffixes[0];
  return `${year}${suffix}`;
};

const ProfileDetails = ({ initialUser }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(initialUser);
  const { session } = useSession();
  const [isConnected, setIsConnected] = useState({ connection: [], requestPending: [] });
  const [check, setCheck] = useState(false);

  useEffect(() => {
    const fetchUpdatedUser = async (id) => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile?id=${id}`);
        if (res.ok) {
          const updatedUser = await res.json();
          setIsConnected(updatedUser.result);
          setLoading(false);
        } else {
          toast.error("Failed to fetch updated user data");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching updated user data:", error);
        toast.error("An error occurred while fetching updated user data");
        setLoading(false);
      }
    };
    fetchUpdatedUser(session.db_id);
  }, [session.db_id, check]);

  const handleremoveClick = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile?seconduserId=${id}`, {
        method: "POST",
      });

      if (res.ok) {
        toast.success("Connection removed", {
          autoClose: 4000,
          closeOnClick: true,
        });
        setCheck(prevCheck => !prevCheck);
      } else {
        toast.error("Failed to remove connection");
      }
    } catch (error) {
      toast.error("An error occurred while removing connection");
    } finally {
      setLoading(false);
    }
  };

  const handleConnectClick = async (profileId) => {
    setLoading(true);
    try {
      if (profileId && session) {
        const res = await fetch(`http://localhost:5001/sendconnection/${session.db_id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ recipientId: profileId }),
        });

        if (res.ok) {
          toast.success("Connection request sent", {
            autoClose: 4000,
            closeOnClick: true,
          });
          setCheck(prevCheck => !prevCheck);
        } else {
          toast.error("Failed to send connection request");
        }
      } else {
        toast.error("Profile ID is missing");
      }
    } catch (error) {
      toast.error("An error occurred while sending connection request");
    } finally {
      setLoading(false);
    }
  };

  // Memoize isConnected for optimized rendering
  const memoizedIsConnected = useMemo(() => isConnected, [isConnected]);

  return loading ? (
    <Loading />
  ) : (
    <div className="px-8 py-4">
      <h2 className="font-bold text-3xl text-center mb-8">Profile</h2>
      <div className="flex flex-col justify-evenly gap-4">
        <section className="bg-white rounded-lg shadow-lg p-6 w-full relative">
          <div className="flex flex-col items-center text-center">
            <Avatar>
              <AvatarImage alt={user.name} src={user.profilePic} />
            </Avatar>
            <h1 className="mt-4 font-bold text-2xl">{user.name}</h1>
            {user.bio ? (
              <p className="mt-2 text-gray-600 italic">{user.bio}</p>
            ) : (
              <div className="flex items-center justify-center text-gray-600">
                <p>Add a bio.</p>
              </div>
            )}
            <div className="gap-4 mt-7">
              {session?.db_id !== user._id && (
                <>
                  {memoizedIsConnected.connection.includes(user._id) ? (
                    <Button onClick={() => handleremoveClick(user._id)} disabled={loading}>
                      Remove Connection
                    </Button>
                  ) : memoizedIsConnected.requestPending.includes(user._id) ? (
                    <Button disabled={true}>Requested</Button>
                  ) : (
                    <Button onClick={() => handleConnectClick(user._id)} disabled={loading}>
                      Connect
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </section>
        <section className="bg-white rounded-lg shadow-lg p-6 w-full">
          <h2 className="text-xl font-bold mb-6">Interests</h2>
          <div className="space-y-4">
            {user.interestSubcategories && user.interestSubcategories.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {user.interestSubcategories.map((interest, index) => (
                  <Badge key={index}>{interest}</Badge>
                ))}
              </div>
            ) : (
              <div className="text-gray-600">
                <p>No interests added.</p>
              </div>
            )}
          </div>
        </section>
        <section className="bg-white rounded-lg shadow-lg p-6 w-full">
          <h2 className="text-xl font-bold mb-6">Details</h2>
          <div className="my-4">
            <h3 className="text-lg font-semibold">Email</h3>
            <p className="text-md font-semibold text-gray-600">{user.email}</p>
          </div>
          <div className="my-4">
            <h3 className="text-lg font-semibold">College</h3>
            {user.collegeName ? (
              <p className="text-md font-semibold text-gray-600">{user.collegeName}</p>
            ) : (
              <div className="text-gray-600">
                <p>Enter college name</p>
              </div>
            )}
          </div>
          <div className="my-4">
            <h3 className="text-lg font-semibold">Degree</h3>
            {user.department && user.degree ? (
              <p className="text-md font-semibold text-gray-600">
                {user.degree} in {user.department} ({getYearWithSuffix(user.yearInCollege)} year)
              </p>
            ) : (
              <div className="text-gray-600">
                <p>Enter degree details</p>
              </div>
            )}
          </div>
          <div className="my-4">
            <h3 className="text-lg font-semibold">Date of Birth</h3>
            <p className="text-md text-gray-600">
              {user.dob ? (
                <span className="font-semibold">
                  {new Date(user.dob).toLocaleDateString("en-UK", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              ) : (
                <div className="text-gray-600">
                  <p>Enter date of birth</p>
                </div>
              )}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfileDetails;
