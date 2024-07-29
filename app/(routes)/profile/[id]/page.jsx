"use client";
import React, { useEffect, useState } from "react";
import Loading from "@/app/(components)/Loading";
import { MdEdit } from "react-icons/md";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import ProfileEdit from "@/app/(components)/ProfileEdit";
import ProfileDetails from "@/app/(components)/ProfileDetails";
import { useSession } from "@/app/(components)/SessionProvider";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { IoEllipsisHorizontal } from "react-icons/io5";

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
        <div className="mx-auto absolute top-0 right-6 lg:right-12">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <IoEllipsisHorizontal className="mt-4 h-10 w-10 text-gray-600 shadow-lg hover:shadow-xl rounded-full p-2 text-center" />{" "}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="mt-2">
              <Link href={`/support`}>
                <DropdownMenuItem className="md:text-lg">
                  Support
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <Link href={`/about`}>
                <DropdownMenuItem className="md:text-lg">
                  About
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <Link href={`/api/auth/signout?callbackUrl=/`}>
                <DropdownMenuItem className="md:text-lg">
                  Sign Out
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
