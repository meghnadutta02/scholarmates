import React from "react";
import { getServerSession } from "next-auth";
import { options } from "../../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
const ReelsPage = async () => {
  const session = await getServerSession(options);
  // if (!session) {
  //   redirect("/api/auth/signin?callbackUrl=/reels");
  // }
  return (
    <div>
      ReelsPage
      <p>
        {session?.user?.email}
        <br />
        {session?.user?.role}
      </p>
    </div>
  );
};

export default ReelsPage;
