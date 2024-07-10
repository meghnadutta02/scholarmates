import React, { useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ProfileUpdate, ProfileUpdateTrigger, ProfileUpdateContentData, ProfileUpdateArrow } from "@/components/ui/profileupdate";
import { Badge } from "@/components/ui/badge";
import { useSession } from "./SessionProvider";
import ProfileDetailsTab from "./ProfileDetailsTab";
import { Separator } from "@/components/ui/separator";
import { toast } from "react-toastify";
import Image from "next/image";
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Button } from "@/components/ui/button";



const getYearWithSuffix = (year) => {
  const suffixes = ["th", "st", "nd", "rd"];
  const lastDigit = year % 10;
  const suffix = suffixes[lastDigit] || suffixes[0];
  return `${year}${suffix}`;
};

const ProfileDetails = ({ initialUser }) => {
  const [user,setUser] = useState(initialUser);
  const { session,setSession } = useSession();
  const [isProfileUpdateOpen, setIsProfileUpdateOpen] = useState(false);
  const [isImageViewOpen, setIsImageViewOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(user?.profilePic);
  const [uploadFile, setUploadFile] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const formData = new FormData();

  const handleViewProfileClick = () => {
    setIsImageViewOpen(true);
  };
  const handleUpdateProfileClick = () => {
    setIsProfileUpdateOpen(true);
  }
  const handleProfileUpdateDialogClose = () => {
    setIsImageViewOpen(false);
   
  };

  const handleImageViewDialog = (e) => {
    const file = e.target.files[0];
    setUploadFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }

  };

  const handleImageViewDialogClose = async (e) => {
    if (!uploadFile) {
      toast.error("Please upload a picture");
      return;
    }
    setIsLoading(true); // Start loading indicator
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
        setSession((prevUser)=>({
          ...prevUser,
          profilePic: data.result.profilePic,
        }))
        setIsProfileUpdateOpen(false);
        toast.success("Profile updated successfully");
      } else {
        toast.error("Profile update failed");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false); // Stop loading indicator
    }
  };
  

  return (
    <>
      {
      session.db_id === user._id?(
        <div className="md:px-8 px-3 py-4 md:w-[85%] w-full mx-auto">
          <div className="flex flex-col justify-evenly gap-4">
            <section className="bg-white rounded-lg shadow-lg md:p-6 p-4 w-full relative">
              <div className="flex flex-col items-center text-center">
                <Avatar>
                  <AvatarImage alt={user.name} src={user.profilePic} />
                </Avatar>
                <div className=" text-md italic text-gray-600 mb-2 text-center">
                Default profile, please update
              </div>
                <ProfileUpdate>
                  <ProfileUpdateTrigger>
                    <div className="cursor-pointer absolute top-20 bg-white p-1 rounded-full">
                      <ImageUpdateIcon />
                    </div>
                  </ProfileUpdateTrigger>
                  <ProfileUpdateContentData>
                    <ProfileUpdateArrow />
                    <div className="flex flex-col">
                      <p className="m-auto m-2 p-2 cursor-pointer" onClick={handleUpdateProfileClick}>Update Profile</p>
                      <Separator />
                      <p className="m-auto m-2 p-2 cursor-pointer" onClick={handleViewProfileClick}>View Profile</p>
                    </div>
                  </ProfileUpdateContentData>
                </ProfileUpdate>
                <h1 className="mt-4 font-bold text-2xl">{user.name}</h1>
                {user.bio ? (
                  <p className="mt-2 text-gray-600 italic">{user.bio}</p>
                ) : (
                  <div className="flex items-center justify-center text-gray-600">
                    <p>Add a bio.</p>
                  </div>
                )}
              </div>
            </section>
            <section className="bg-white rounded-lg shadow-lg md:p-6 p-4 w-full">
              <h2 className="text-xl font-bold md:mb-6 mb-4">Interests</h2>
              <div className="space-y-4">
                {user.interestSubcategories && user.interestSubcategories.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user.interestSubcategories.map((interest, index) => (
                      <Badge key={index}>{interest}</Badge>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-600">
                    <p>No interests added.</p>
                  </div>
                )}
              </div>
            </section>
            <section className="bg-white rounded-lg shadow-lg p-4 md:p-6 w-full">
              <h2 className="text-xl font-bold md:mb-6 mb-4">Details</h2>
              <div className="my-4">
                <h3 className="text-lg font-semibold">Email</h3>
                <p className="text-md font-semibold text-gray-600">{user.email}</p>
              </div>
              <div className="my-4">
                <h3 className="text-lg font-semibold">College</h3>
                {user.collegeName ? (
                  <p className="text-md font-semibold text-gray-600">{user.collegeName}</p>
                ) : (
                  <div className="text-gray-600">
                    <p>Enter college name</p>
                  </div>
                )}
              </div>
              <div className="my-4">
                <h3 className="text-lg font-semibold">Degree</h3>
                {user.degree ? (
                  <p className="text-md font-semibold text-gray-600">
                    {user.degree} {user.department ? `in ${user.department}` : ""} ({getYearWithSuffix(user.yearInCollege)} year)
                  </p>
                ) : (
                  <div className="text-gray-600">
                    <p>Enter degree details</p>
                  </div>
                )}
              </div>
              <div className="my-4">
                <h3 className="text-lg font-semibold">Date of Birth</h3>
                <p className="text-md text-gray-600">
                  {user.dob ? (
                    <span className="font-semibold">
                      {new Date(user.dob).toLocaleDateString("en-UK", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  ) : (
                    <div className="text-gray-600">
                      <p>Enter date of birth</p>
                    </div>
                  )}
                </p>
              </div>
            </section>
          </div>
        </div>
      ) : (
        <ProfileDetailsTab user={user} />
      )}
      {/* Update Profile Dialog */}
      <Dialog.Root open={isProfileUpdateOpen} onOpenChange={setIsProfileUpdateOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded shadow-lg" style={{ maxWidth: "32rem", paddingBottom: "54px" }}>
            <Dialog.Description className="mt-2">
              <h3 className="text-lg font-semibold mb-2">Update Profile Picture</h3>
              <Image
                src={selectedImage}
                width={500}
                height={500}
                alt="Picture of user"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageViewDialog}
                className="mt-4"
              />
            </Dialog.Description>
           {isLoading?(
            <Button className="absolute bottom-2 w-11/12 py-1 focus:outline-none" disabled onClick={handleImageViewDialogClose}>
             loading  <Loading/>
            </Button>
           
           ):(
            <Button className="absolute bottom-2 w-11/12 py-1 focus:outline-none" onClick={handleImageViewDialogClose}>
              update
            </Button>
           )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* View Profile Dialog */}
      {!user?(<Loading/>):(
          <Dialog.Root open={isImageViewOpen} onOpenChange={setIsImageViewOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded shadow-lg" style={{ maxWidth: "32rem" }}>
            <Dialog.Description className="mt-2">
              <Image
                src={user.profilePic}
                width={500}
                height={500}
                alt="Picture of user"
              />
            </Dialog.Description>
            <Dialog.Close asChild>
              <button className="absolute top-2 right-2 p-1 focus:outline-none" onClick={handleProfileUpdateDialogClose}>
                <Cross2Icon />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
        )
      }
    </>
  
)};
function Loading (props){
  return (
    <svg
      className="animate-spin h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4z"
      ></path>
    </svg>
  );
}
function ImageUpdateIcon(props) {
  return (
    <svg
      {...props}
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 1C0.447715 1 0 1.44772 0 2V13C0 13.5523 0.447715 14 1 14H14C14.5523 14 15 13.5523 15 13V2C15 1.44772 14.5523 1 14 1H1ZM7.5 10.625C9.22589 10.625 10.625 9.22589 10.625 7.5C10.625 5.77411 9.22589 4.375 7.5 4.375C5.77411 4.375 4.375 5.77411 4.375 7.5C4.375 9.22589 5.77411 10.625 7.5 10.625Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}

export default ProfileDetails;
