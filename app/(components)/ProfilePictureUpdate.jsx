import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { MdCameraAlt } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import Image from "next/image";

const ProfilePictureUpdate = ({ user, setUser, setUser1 }) => {
  const [selectedImage, setSelectedImage] = useState(user?.profilePic);
  const [loading, setLoading] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const formData = new FormData();

  const handleImageViewDialog = (e) => {
    const file = e.target.files[0];
    const maxSize = 2 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.info("File size should not exceed 2MB.");
      return;
    }

    setUploadFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageViewDialogClose = async () => {
    if (!uploadFile) {
      toast.error("Please upload a picture");
      return;
    }
    setLoading(true);
    formData.append("profilePic", uploadFile);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/profile/profilePic`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (res.ok) {
        const data = await res.json();
        setUser((prevUser) => ({
          ...prevUser,
          profilePic: data.result.profilePic,
        }));
        setUser1((prevUser) => ({
          ...prevUser,
          profilePic: data.result.profilePic,
        }));
        setIsProfileUpdateOpen(false);
        setLoading(false);
        toast.success("Profile updated successfully");
      } else {
        toast.error("Profile update failed");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setUploadFile(null);
      setSelectedImage(user?.profilePic);
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger>
          {" "}
          <MdCameraAlt className=" cursor-pointer absolute bottom-[-3px] drop-shadow-lg p-1 bg-white rounded-full right-1 h-[26px] w-[26px]  " />
        </DialogTrigger>
        <DialogContent className=" md:w-[22%] sm:w-[70%] w-[80%] p-2 rounded-md">
          <div className="flex justify-center flex-col gap-3">
            <h3 className="text-lg font-semibold ">Update Profile Picture</h3>
            <Image
              src={selectedImage}
              width={200}
              height={200}
              alt="User"
              className="w-full h-[300px]"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageViewDialog}
              className="w-full"
            />
            <Button
              className="w-full py-1 focus:outline-none"
              disabled={uploadFile === null || loading}
              onClick={handleImageViewDialogClose}
            >
              Update
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfilePictureUpdate;
