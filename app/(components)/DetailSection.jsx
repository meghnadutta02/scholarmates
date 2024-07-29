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
      {user.interestSubcategories.length === 0 &&
      user.collegeName.length === 0 &&
      user.department.length === 0 &&
      user.degree.length === 0 ? (
        <div className="flex justify-center md:text-lg text-md font-semibold font-sans mt-3">
          This user has not added any information.
        </div>
      ) : (
        <section className="bg-white rounded-lg shadow-lg p-4 md:p-6 w-full mt-4">
          {user.interestSubcategories &&
            user.interestSubcategories.length > 0 && (
              <div className="space-y-4 mb-4 md:mb-8">
                <h2 className="text-xl font-bold mb-4">Interests</h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  {user.interestSubcategories.map((interest, index) => (
                    <Badge key={index}>{interest}</Badge>
                  ))}
                </div>
              </div>
            )}
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
              <h3 className="text-lg font-semibold">Pursuing</h3>

              <p className="text-md font-semibold text-gray-600">
                {user.degree} in {user.department} (
                {getYearWithSuffix(user.yearInCollege)} year)
              </p>
            </div>
          )}
        </section>
      )}
    </>
  );
};

export default DetailSection;
