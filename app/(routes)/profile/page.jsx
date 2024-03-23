"use client";
import { MdEdit } from "react-icons/md";
import React, { useEffect, useState } from "react";

import Spinnersvg from "@/public/Spinner.svg";
import Image from "next/image";
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

export default function DrawerDialogDemo() {
  const [open, setOpen] = React.useState(false);
  // const isDesktop = useMediaQuery("(min-width: 768px)");
  const isDesktop = true;
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});

  const fetchData = async () => {
    try {
      const res = await fetch("api/users/profile", { cache: "no-cache" });
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await res.json();
      setUser(data.result);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  if (loading) {
    return (
      <div className="flex justify-center items-center  z-50">
        <Image src={Spinnersvg} alt="Loading..." className="h-28" />
      </div>
    );
  }
  if (isDesktop) {
    return (
      <div className="flex flex-col w-full relative">
        <ProfileDetails user={user} />
        <div className="mt-8 mx-auto  ">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <MdEdit className="h-10 w-10 text-gray-600 absolute top-6 right-7 shadow-xl rounded-full cursor-pointer p-2 text-center" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[720px]">
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when done.
                </DialogDescription>
              </DialogHeader>
              <ProfileEdit user={user} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  }

  return (
    <>
      <ProfileDetails user={user} />
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
          <ProfileEdit />
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
