import React from "react";

// export const generateMetadata=async({params,searchParams})=>
// {
//   const post=await getPost(params.id)
//   return {
//     title:post.title
//   }
// }

export const SinglePost = ({ params }) => {
  return <div>SinglePost {params.postId}</div>;
};
