import Link from "next/link";
import React from "react";
import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";

import logo from "@/public/logo.png";
import Image from "next/image";

const Header = async () => {
  const session = await getServerSession(options);

  return (
    <header className="fixed z-10 top-0 left-1/2 transform -translate-x-1/2 flex flex-row justify-center pt-1 md:w-2/5 w-full ">
      <div className="flex  items-center px-4 rounded-s-xl border-2 border-zinc-600 bg-white ">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Image
            src={logo}
            alt="Likeminds"
            className="md:h-16 md:w-16 h-10 w-10"
          />
          <span className="text-lg md:text-md">AlikeHub</span>
        </Link>
      </div>
      <div className="flex  px-6 items-center gap-4 rounded-e-xl bg-zinc-700 dark:bg-gray-800/40">
        <nav className="flex flex-row items-center gap-4 ml-auto flex-1  justify-end">
          <Link
            href={session ? "" : "/api/auth/signin"}
            className=" text-white font-semibold md:text-lg text-md "
          >
            Sign In
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
