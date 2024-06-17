import Link from "next/link";
import React from "react";

import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
const RightSidebar = async () => {
  return (
    <div className="hidden lg:flex rounded-se-lg bg-gray-100 dark:bg-gray-800 w-[15%]">
      <nav className="flex-col items-start fixed px-4 text-md lg:text-lg font-medium">
        <Link
          className="flex items-center gap-3 rounded-lg  px-3 py-2 text-gray-900  transition-all hover:text-gray-900  dark:text-gray-50 dark:hover:text-gray-50"
          href="/"
        >
          Trending
        </Link>
        <Link
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
          href="/chats"
        >
          Suggestions
        </Link>
        <Link
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
          href="/discussions"
        >
          More links to be added
        </Link>
      </nav>
    </div>
  );
};

export default RightSidebar;
