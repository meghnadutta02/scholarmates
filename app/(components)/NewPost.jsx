"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import React, { useState,useEffect } from "react";
import { useSession } from '@/app/(components)/SessionProvider';
import { toast } from "react-toastify";

function NewPost() {
  // const { data: session, status } = useSession();
  const session=useSession();
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [userId,setUserId]=useState();

  useEffect(() => {
if(session){
  console.log("data",session)
}
    // if (session) {
    //   const { user } = session;
    //   console.log("User:", user);
    //   setUserId(user.db_id);
    // }
  }, []);

  const handlePostContentChange = (event) => {
    setDescription(event.target.value);
  };

  const handleImageChange = (event) => {
    setImageURL(URL.createObjectURL(event.target.files?.[0]));
    setSelectedImage(event.target.files?.[0]);
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("description", description);
    formData.append("image", selectedImage);

    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    let result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${userId}`, {
      method: "POST",
      body: formData,
    });
    result = await result.json();
    console.log(result);
    if (result.success) {
      toast.success("Post uploaded");
    }

    setDescription("");
    setSelectedImage(null);
  };

  return (
    <div className="md:w-2/3 flex flex-col  bg-white p-4 shadow rounded-lg">
      <form action="" method="post" onSubmit={handlePostSubmit}>
        <div>
          <Textarea
            placeholder="Post an update"
            value={description}
            name="content"
            onChange={handlePostContentChange}
          />
        </div>
        <div className="flex flex-row justify-between mt-4">
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            name="image"
            className="w-1/2"
          />

          <Button type="submit">Post</Button>
        </div>
        <div>
          {selectedImage && (
            <Image
              src={imageURL}
              alt="Preview"
              height={100}
              width={100}
              className="mt-2"
            />
          )}
        </div>
      </form>
    </div>
  );
}

export default NewPost;
