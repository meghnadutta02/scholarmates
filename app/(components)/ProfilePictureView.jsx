"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MdCameraAlt } from "react-icons/md";
import Image from "next/image";

const ProfilePictureUpdate = ({ user }) => {
  const [selectedImage, setSelectedImage] = useState(user?.profilePic);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Dialog
        open={dialogOpen}
        onOpenChange={(isOpen) => {
          setDialogOpen(isOpen);
        }}
      >
        <DialogTrigger>
          <MdCameraAlt className="cursor-pointer absolute bottom-[-3px] drop-shadow-lg p-1 bg-white rounded-full right-1 h-[26px] w-[26px]" />
        </DialogTrigger>
        <DialogContent className="md:w-[22%] sm:w-[70%] w-[80%] p-2 rounded-md">
          <div className="flex justify-center flex-col gap-3 items-center">
            <h3 className="text-lg font-semibold text-center">
              Profile Picture
            </h3>
            {selectedImage && (
              <Image
                src={selectedImage}
                alt="Profile"
                width={250}
                height={250}
                className="rounded-full"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfilePictureUpdate;
