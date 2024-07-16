"use client";
import React, { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { useSession } from "next-auth/react";

const ProfileProgress = () => {
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      console.log(session.user);
      const user = session.user;
      const fields = [
        "name",
        "collegeName",
        "degree",
        "bio",
        "interestSubcategories",
        "dob",
      ];

      const filledFields = fields.filter(
        (field) => user[field] && user[field].length > 0
      );

      if (user.yearInCollege !== null) {
        filledFields.push("yearInCollege");
      }

      const percentage = Math.round(
        (filledFields.length / (fields.length + 1)) * 100
      );
      console.log(percentage);
      setCompletionPercentage(percentage);
    }
  }, [session]);
  if (!session) return null;
  if (completionPercentage === 100) {
    return null;
  }

  return (
    <div className="z-50 relative w-full">
      <Progress value={completionPercentage} className="h-4" />
      <span className="absolute transform top-0 left-[76px] text-white text-[11.5px]">
        {completionPercentage}% profile completed
      </span>
    </div>
  );
};

export default ProfileProgress;
