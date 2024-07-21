import React from "react";
import Image from "next/image";
import Link from "next/link";
const LikedBy = ({ likedByUsers }) => {
  return (
    <div className="p-4 font-sans">
      <h2 className="text-lg font-semibold mb-4">Liked by</h2>
      <div className="flex flex-col gap-3">
        {likedByUsers.map((user) => (
          <Link href={`/profile/${user._id}`} key={user._id}>
            <div key={user._id} className="flex items-center gap-3">
              <Image
                src={user.profilePic}
                alt={user.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="font-medium">{user.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LikedBy;
