"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import ServerSideComponent from "@/app/(components)/ServerSideComponent";
import { redirect } from "next/navigation";
import { useSession } from '@/app/(components)/SessionProvider'
const PostPage = () => {
  const postId = 100;
  // const { data: session } = useSession({
  //   required: true,
  //   onUnauthenticated() {
  //     redirect("/api/auth/signin?callbackUrl=/posts");
  //   },
  // });
  const {session,request}=useSession();
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState();
  useEffect(() => {
    if(session){
     // console.log("this is lll:",session.db_id)
     // console.log("request is:",request);
     setUserId(session.db_id);
    }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http:localhost:3000/api/posts`
        );
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
      {/* PostPage
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
      </div> */}
      <ServerSideComponent />
      <p>
        {userId?.email}
        <br />
        {userId?.role}
      </p>
    </div>
  );
});

}
export default PostPage;
