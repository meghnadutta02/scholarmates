"use client";
import React, { useEffect, useState } from "react";
import Loading from "@/app/(components)/Loading";

import ProfileDetails from "@/app/(components)/ProfileDetails";
import { useSession } from "@/app/(components)/SessionProvider";

export default function DrawerDialogDemo({ params }) {
  const { id } = params;
  const { session } = useSession();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});

  const fetchData = async () => {
    try {
      if (session) {
        const res = await fetch(`/api/users/profile?id=${id}`, {
          cache: "no-cache",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await res.json();

        setUser(data.result);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [session]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col w-full relative">
      <ProfileDetails
        user={user}
        setUser={setUser}
        open={open}
        setOpen={setOpen}
      />
      {user && session.db_id == user._id && (
        <div className="mx-auto absolute top-0 right-6 lg:right-12"></div>
      )}
    </div>
  );
}
