"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const PostPage = () => {
  const postId = 100;

  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("api/posts");
        const data = await response.json();

        if (data && data.result && data.result.length > 0) {
          console.log(data.result);
          setPosts(data.result);
        } else {
          console.error("No posts found");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      PostPage
      <br />
      <Link href={`/posts/${postId}`}>Go to 100th Post</Link>
      <div>
        {posts.map((post) => (
          <div key={post._id}>
            <br />
            <h1>{post.content}</h1>
            <p>{post.likes}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostPage;
