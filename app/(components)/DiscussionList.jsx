import React from "react";
import { getServerSession } from "next-auth";

import { options } from "@/app/api/auth/[...nextauth]/options";

const getDiscussions = async () => {
  await new Promise((resolve) => setTimeout(resolve, 4000));
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/discussion`
  );
  return response.json();
};

const DiscussionList = async () => {
  const session = await getServerSession(options);
  const { result: discussions } = await getDiscussions();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
      {discussions.map((discussion) => (
        <div
          key={discussion._id}
          className="bg-white shadow-lg rounded-lg overflow-hidden"
        >
          <div className="px-6 py-4">
            <h3 className="text-xl font-bold mb-2">{discussion.title}</h3>
            <p className="text-gray-700 text-base">{discussion.content}</p>
          </div>
        </div>
      ))}
      {discussions.map((discussion) => (
        <div
          key={discussion._id}
          className="bg-white shadow-lg rounded-lg overflow-hidden"
        >
          <div className="px-6 py-4">
            <h3 className="text-xl font-bold mb-2">{discussion.title}</h3>
            <p className="text-gray-700 text-base">{discussion.content}</p>
          </div>
        </div>
      ))}
      {discussions.map((discussion) => (
        <div
          key={discussion._id}
          className="bg-white shadow-lg rounded-lg overflow-hidden"
        >
          <div className="px-6 py-4">
            <h3 className="text-xl font-bold mb-2">{discussion.title}</h3>
            <p className="text-gray-700 text-base">{discussion.content}</p>
          </div>
        </div>
      ))}
      {discussions.map((discussion) => (
        <div
          key={discussion._id}
          className="bg-white shadow-lg rounded-lg overflow-hidden"
        >
          <div className="px-6 py-4">
            <h3 className="text-xl font-bold mb-2">{discussion.title}</h3>
            <p className="text-gray-700 text-base">{discussion.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DiscussionList;
