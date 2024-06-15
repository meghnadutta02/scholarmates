import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import React from "react";

const getYearWithSuffix = (year) => {
  const suffixes = ["th", "st", "nd", "rd"];
  const lastDigit = year % 10;
  const suffix = suffixes[lastDigit] || suffixes[0];
  return `${year}${suffix}`;
};
const ProfileDetails = ({ user }) => {
  return (
    <div className="px-8 py-4">
      <h2 className="font-bold text-3xl text-center mb-8">Profile</h2>
      <div className="flex flex-col justify-evenly gap-4 ">
        <section className="bg-white rounded-lg shadow-lg p-6 w-full relative">
          <div className="flex flex-col items-center text-center">
            <Avatar>
              <AvatarImage alt={user.name} src={user.profilePic} />
            </Avatar>
            <h1 className="mt-4 font-bold text-2xl">{user.name}</h1>

            {user.bio ? (
              <p className="mt-2  text-gray-600 italic">{user.bio}</p>
            ) : (
              <div className="flex items-center justify-center text-gray-600">
                <p>Add a bio. </p>
              </div>
            )}

            {/* <div className="flex space-x-3 mt-4">
              <MailIcon className="h-5 w-5 text-gray-600" />
              <PhoneIcon className="h-5 w-5 text-gray-600" />
              <GithubIcon className="h-5 w-5 text-gray-600" />
              <LinkedinIcon className="h-5 w-5 text-gray-600" />
              <TwitterIcon className="h-5 w-5 text-gray-600" />
            </div> */}
          </div>
        </section>
        <section className="bg-white rounded-lg shadow-lg p-6 w-full ">
          <h2 className="text-xl font-bold mb-6">Interests</h2>
          <div className="space-y-4">
            {user.interestSubcategories &&
            user.interestSubcategories.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {user.interestSubcategories.map((interest, index) => (
                  <Badge key={index}>{interest}</Badge>
                ))}
              </div>
            ) : (
              <div className=" text-gray-600">
                <p>No interests added. </p>
              </div>
            )}
          </div>
        </section>
        <section className="bg-white rounded-lg shadow-lg p-6 w-full ">
          <h2 className="text-xl font-bold mb-6">Details</h2>
          <div className="my-4">
            <h3 className="text-lg font-semibold">Email</h3>
            <p className="text-md font-semibold text-gray-600">{user.email}</p>
          </div>
          <div className="my-4">
            <h3 className="text-lg font-semibold">College</h3>
            {user.collegeName ? (
              <p className="text-md font-semibold text-gray-600">
                {user.collegeName}
              </p>
            ) : (
              <div className=" text-gray-600">
                <p>Enter college name </p>
              </div>
            )}
          </div>
          <div className="my-4">
            <h3 className="text-lg font-semibold">Degree</h3>
            {user.department && user.degree ? (
              <p className="text-md font-semibold text-gray-600">
                {user.degree} in {user.department} ({" "}
                {getYearWithSuffix(user.yearInCollege)} year )
              </p>
            ) : (
              <div className=" text-gray-600">
                <p>Enter degree details </p>
              </div>
            )}
          </div>

          <div className="my-4">
            <h3 className="text-lg font-semibold">Date of Birth</h3>
            <p className="text-md  text-gray-600">
              {user.dob ? (
                <span className="font-semibold">
                  {new Date(user.dob).toLocaleDateString("en-UK", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              ) : (
                <div className=" text-gray-600">
                  <p>Enter date of birth </p>
                </div>
              )}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
function FacebookIcon(props) {
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
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function FlagIcon(props) {
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
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" x2="4" y1="22" y2="15" />
    </svg>
  );
}

function GithubIcon(props) {
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
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function InstagramIcon(props) {
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
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon(props) {
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
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function MailIcon(props) {
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
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function PhoneIcon(props) {
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
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function TwitterIcon(props) {
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
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

export default ProfileDetails;
