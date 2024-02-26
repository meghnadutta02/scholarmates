"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "react-toastify";

function NewPost() {
  const [postContent, setPostContent] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageURL, setImageURL] = useState(null);

  const handlePostContentChange = (event) => {
    setPostContent(event.target.value);
  };

  const handleImageChange = (event) => {
    setImageURL(URL.createObjectURL(event.target.files?.[0]));
    setSelectedImage(event.target.files?.[0]);
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("content", postContent);
    formData.append("image", selectedImage);

    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    let result = await fetch("/api/posts", { method: "POST", body: formData });
    result = await result.json();
    console.log(result);
    if (result.success) {
      toast.success("Post uploaded");
    }

    setPostContent("");
    setSelectedImage(null);
  };

  return (
    <div className="md:w-2/3 flex flex-col  bg-white p-4 shadow rounded-lg">
      <form action="" method="post" onSubmit={handlePostSubmit}>
        <div>
          <Textarea
            placeholder="Post an update"
            value={postContent}
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
