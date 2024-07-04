"use client";
import React, { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { useSession } from "./SessionProvider";

const ProfileProgress = () => {
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useSession();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/profile/currentUser`
        );

        if (response.ok) {
          const data = await response.json();

          setUser(data.result);
        } else {
          console.error("Error fetching user details:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [setUser]);

  useEffect(() => {
    if (user) {
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

      if (user.yearInCollege) {
        filledFields.push("yearInCollege");
      }

      const percentage = Math.round(
        (filledFields.length / (fields.length + 1)) * 100
      );

      setCompletionPercentage(percentage);
    }
  }, [user]);

  if (completionPercentage === 100 || loading) {
    return null;
  }

  return (
    <div className="z-50 relative w-full">
      <Progress value={completionPercentage} className="h-4" />
      <span className="absolute transform top-0 left-[76px] text-red-400 text-[11.5px]">
        {completionPercentage}% profile completed
      </span>
    </div>
  );
};

export default ProfileProgress;
