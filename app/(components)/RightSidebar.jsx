import Link from "next/link";
import React from "react";
import { Lightbulb, TrendingUp } from "lucide-react";
import About from "./About";

const RightSidebar = async () => {
  return (
    <div className="hidden lg:flex lg:flex-col items-end rounded-ss-lg bg-gray-100 dark:bg-gray-800 w-[15%]">
      <div className="fixed right-0 py-4">
        <nav className="flex flex-col gap-y-4 text-gray-500 items-start px-4 text-md lg:text-lg font-medium">
          <Link
            className="flex gap-2 transition-all hover:text-gray-900  dark:text-gray-50 dark:hover:text-gray-50"
            href="/discussions/trending"
          >
            <TrendingUp className="mt-1" size={22} />
            Trending
          </Link>
          <Link
            className="flex gap-2 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            href="/chats"
          >
            <Lightbulb className="mt-1" size={22} />
            Suggestions
          </Link>
          <Link
            className="flex gap-2 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            href="/discussions"
          >
            More links to be added
          </Link>
        </nav>
      </div>
      <div className="fixed right-0 bottom-0 w-[15%] pb-4">
        <About />
      </div>
    </div>
  );
};

export default RightSidebar;
