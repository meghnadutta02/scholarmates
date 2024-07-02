import React from "react";
import { Badge } from "@/components/ui/badge";

const getYearWithSuffix = (year) => {
  const suffixes = ["th", "st", "nd", "rd"];
  const lastDigit = year % 10;
  const suffix = suffixes[lastDigit] || suffixes[0];
  return `${year}${suffix}`;
};

const DetailSection = ({ user }) => {
  return (
    <>
      {user.interestSubcategories && user.interestSubcategories.length > 0 && (
        <section className="bg-white rounded-lg shadow-lg p-4 md:p-6 w-full mt-4">
          <h2 className="text-xl font-bold md:mb-6 mb-4">Interests</h2>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 mt-2">
              {user.interestSubcategories.map((interest, index) => (
                <Badge key={index}>{interest}</Badge>
              ))}
            </div>
          </div>
        </section>
      )}
      <section className="bg-white rounded-lg shadow-lg p-4 md:p-6 w-full mt-4">
        <h2 className="text-xl font-bold md:mb-6 mb-4">Details</h2>
        <div className="my-4">
          <h3 className="text-lg font-semibold">Email</h3>
          <p className="text-md font-semibold text-gray-600">{user.email}</p>
        </div>
        {user.collegeName && (
          <div className="my-4">
            <h3 className="text-lg font-semibold">College</h3>

            <p className="text-md font-semibold text-gray-600">
              {user.collegeName}
            </p>
          </div>
        )}
        {user.department && user.degree && (
          <div className="my-4">
            <h3 className="text-lg font-semibold">Degree</h3>

            <p className="text-md font-semibold text-gray-600">
              {user.degree} in {user.department} (
              {getYearWithSuffix(user.yearInCollege)} year)
            </p>
          </div>
        )}
        {user.dob && (
          <div className="my-4">
            <h3 className="text-lg font-semibold">Date of Birth</h3>
            <p className="text-md text-gray-600">
              <span className="font-semibold">
                {new Date(user.dob).toLocaleDateString("en-UK", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </p>
          </div>
        )}
      </section>
    </>
  );
};

export default DetailSection;
