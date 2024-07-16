"use client";
import React, { useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useSession } from "./SessionProvider";
import ProfileDetailsTab from "./ProfileDetailsTab";
import ProfilePictureUpdate from "./ProfilePictureUpdate";

const getYearWithSuffix = (year) => {
  const suffixes = ["th", "st", "nd", "rd"];
  const lastDigit = year % 10;
  const suffix = suffixes[lastDigit] || suffixes[0];
  return `${year}${suffix}`;
};

const ProfileDetails = ({ user, setUser }) => {
  const { session } = useSession();

  return (
    <>
      {session.db_id === user._id ? (
        <div className="md:px-8 px-3 py-4 md:w-[85%] w-full mx-auto">
          <div className="flex flex-col justify-evenly gap-4">
            <section className="bg-white rounded-lg shadow-lg md:p-6 p-4 w-full ">
              <h3 className="mt-1 font-semibold text-gray-700 text-base justify-end flex">
                {user.connection.length}{" "}
                {user.connection.length > 1 ? "connections" : "connection"}
              </h3>
              <div className="flex flex-col items-center text-center ">
                <div className="relative max-h-[97px] ">
                  <Avatar className="w-24 h-24">
                    <AvatarImage alt={user.name} src={user?.profilePic} />
                  </Avatar>
                  <ProfilePictureUpdate user={user} setUser={setUser} />
                </div>
                <h1 className="font-bold text-2xl mt-4">{user.name}</h1>
                {user.bio ? (
                  <p className="mt-2 text-gray-600 italic">{user.bio}</p>
                ) : (
                  <div className="flex items-center justify-center text-gray-600">
                    <p>Add a bio.</p>
                  </div>
                )}
              </div>
            </section>
            <section className="bg-white rounded-lg shadow-lg md:p-6 p-4 w-full">
              <h2 className="text-xl font-bold md:mb-6 mb-4">Interests</h2>
              <div className="space-y-4">
                {user.interestSubcategories &&
                user.interestSubcategories.length > 0 ? (
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
            <section className="bg-white rounded-lg shadow-lg p-4 md:p-6 w-full">
              <h2 className="text-xl font-bold md:mb-6 mb-4">Details</h2>
              <div className="my-4">
                <h3 className="text-lg font-semibold">Email</h3>
                <p className="text-md font-semibold text-gray-600">
                  {user.email}
                </p>
              </div>
              <div className="my-4">
                <h3 className="text-lg font-semibold">College</h3>
                {user.collegeName ? (
                  <p className="text-md font-semibold text-gray-600">
                    {user.collegeName}
                  </p>
                ) : (
                  <div className="text-gray-600">
                    <p>Enter college name</p>
                  </div>
                )}
              </div>
              <div className="my-4">
                <h3 className="text-lg font-semibold">Degree</h3>
                {user.degree ? (
                  <p className="text-md font-semibold text-gray-600">
                    {user.degree}{" "}
                    {user.department ? `in ${user.department}` : ""} (
                    {getYearWithSuffix(user.yearInCollege)} year)
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
      ) : (
        <ProfileDetailsTab user={user} />
      )}
    </>
  );
};

export default ProfileDetails;
