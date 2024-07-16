"use client";
import { MdEdit } from "react-icons/md";
import React, { useEffect, useState } from "react";
import Loading from "@/app/(components)/Loading";

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

export default function DrawerDialogDemo({ params }) {
  const { id } = params;
  const { session } = useSession();
  const [open, setOpen] = useState(false);
  const isDesktop = true;
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

  if (isDesktop) {
    return (
      <div className="flex flex-col w-full relative">
        <ProfileDetails user={user} setUser={setUser} />
        {user && session.db_id == user._id && (
          <div className="mt-8 mx-auto">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <MdEdit className="h-10 w-10 text-gray-600  absolute top-6 right-7 shadow-xl rounded-full cursor-pointer p-2 text-center" />
              </DialogTrigger>
              <DialogContent className="sm:max-w-[720px] overflow-y-auto max-h-[95%]">
                <DialogHeader>
                  <DialogTitle>Edit profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when done.
                  </DialogDescription>
                </DialogHeader>
                <ProfileEdit user={user} setUser={setUser} />
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <ProfileDetails user={user} />
      {user && session.db_id == user._id && (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button variant="outline">
              <MdEdit className="h-6 w-6 text-gray-600 absolute top-6 right-7 cursor-pointer" />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>Edit profile</DrawerTitle>
              <DrawerDescription>
                Make changes to your profile here. Click save
              </DrawerDescription>
            </DrawerHeader>
            <ProfileEdit user={user} />
            <DrawerFooter className="pt-2">
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}
