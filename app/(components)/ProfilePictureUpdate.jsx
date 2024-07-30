"use client";
import React, { useState, useRef } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MdCameraAlt } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import AvatarEditor from "react-avatar-editor";
import Image from "next/image";
import { useSession } from "next-auth/react";

const ProfilePictureUpdate = ({ user, setUser }) => {
  const [selectedImage, setSelectedImage] = useState(user?.profilePic);
  const [loading, setLoading] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { update } = useSession();
  const editorRef = useRef(null);
  const [scale, setScale] = useState(1);

  const formData = new FormData();

  const handleImageViewDialog = (e) => {
    const file = e.target.files[0];
    const maxSize = 2 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.info("File size should not exceed 2MB.", {
        autoClose: 4000,
        closeOnClick: true,
      });
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
      toast.error("Please upload a picture", {
        autoClose: 4000,
        closeOnClick: true,
      });
      return;
    }
    setLoading(true);
    try {
      const img = await getCroppedImage();
      formData.append("profilePic", img);
      const res = await fetch(`/api/users/profile/profilePic`, {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        setUser((prevUser) => ({
          ...prevUser,
          profilePic: URL.createObjectURL(img),
        }));
        update({ profilePic: URL.createObjectURL(img) });

        toast.success("Profile updated successfully", {
          autoClose: 4000,
          closeOnClick: true,
        });
        setDialogOpen(false);
      } else {
        toast.error("Profile update failed", {
          autoClose: 4000,
          closeOnClick: true,
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile", {
        autoClose: 4000,
        closeOnClick: true,
      });
    } finally {
      resetState();
      setLoading(false);
    }
  };

  const resetState = () => {
    setUploadFile(null);
    setSelectedImage(user?.profilePic);
    setScale(1);
    setLoading(false);
  };

  const getCroppedImage = () => {
    return new Promise((resolve, reject) => {
      if (editorRef.current) {
        editorRef.current.getImageScaledToCanvas().toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to create cropped image"));
          }
        }, "image/jpeg");
      } else {
        reject(new Error("Editor not available"));
      }
    });
  };

  return (
    <>
      <Dialog
        open={dialogOpen}
        onOpenChange={(isOpen) => {
          setDialogOpen(isOpen);
          resetState();
        }}
      >
        <DialogTrigger>
          <MdCameraAlt className="cursor-pointer absolute bottom-[-3px] drop-shadow-lg p-1 bg-white rounded-full right-1 h-[26px] w-[26px]" />
        </DialogTrigger>
        <DialogContent className="lg:w-[25%] md:w-[50%] sm:w-[70%] w-[90%] p-2 rounded-md">
          <div className="flex justify-center flex-col gap-3 items-center">
            <h3 className="text-lg font-semibold text-center">
              Update Profile Picture
            </h3>
            {selectedImage && !uploadFile && (
              <Image
                src={selectedImage}
                alt="Profile"
                width={240}
                height={240}
                className="rounded-full"
              />
            )}
            {uploadFile && (
              <div className="w-full flex flex-col items-center">
                <div className="max-w-[250px] max-h-[250px] flex justify-center items-center overflow-hidden">
                  <AvatarEditor
                    ref={editorRef}
                    image={selectedImage}
                    width={240}
                    height={240}
                    border={20}
                    borderRadius={125}
                    color={[255, 255, 255, 0.6]}
                    scale={scale}
                    rotate={0}
                    className="mx-auto"
                  />
                </div>
                <input
                  type="range"
                  min="1"
                  max="2"
                  step="0.01"
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="w-full mt-2"
                />
              </div>
            )}
            <input
              type="file"
              accept="image/jpeg/png/heic"
              onChange={handleImageViewDialog}
              className="w-full mt-2"
            />
            <Button
              className="w-full py-1 mt-2 focus:outline-none"
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
