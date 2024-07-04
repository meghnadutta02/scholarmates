// NavbarClient.js
"use client";

import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import MenuDrawer from "@/app/(components)/MenuDrawer";
import { useSession } from "@/app/(components)/SessionProvider";
import logo from "@/public/logo.png";
import Image from "next/image";
import ProfileProgress from "./ProfileProgress";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const NavbarClient = () => {
  const { session, unreadCount } = useSession();

  return (
    <>
      <div className=" flex justify-between ">
        <span className="md:hidden">
          <MenuDrawer />
        </span>
        <header className="fixed z-10 top-0 left-1/2 transform -translate-x-1/2  flex flex-col gap-[5px] pt-1 ">
          <div className="flex flex-row md:justify-center justify ">
            <div className="flex  items-center  px-4 rounded-s-xl border-2 border-zinc-600 bg-white">
              <Link
                href="#"
                className="flex items-center gap-2 font-semibold md:mr-0 mr-10"
              >
                <Image src={logo} alt="Likeminds" className="h-10 w-10" />
                <span>AlikeHub</span>
              </Link>
            </div>
            <div className="flex h-14 px-6 items-center justify-between gap-4 rounded-e-xl bg-zinc-700 dark:bg-gray-800/40">
              <Link href="/notification">
                <Button
                  className=" h-8 w-8 md:block hidden "
                  size="icon"
                  variant="icon"
                >
                  {unreadCount > 0 && (
                    <span className="absolute z-10 inline-flex items-center justify-center p-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                  <BellIcon className="relative  h-5 w-5 text-white" />
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="rounded-full border border-gray-200 w-8 h-8 dark:border-gray-800"
                    id="menu-button"
                    size="icon"
                    variant="ghost"
                  >
                    <Image
                      alt="Avatar"
                      className="rounded-full"
                      height="32"
                      src={session?.profilePic}
                      style={{
                        aspectRatio: "32/32",
                        objectFit: "cover",
                      }}
                      width="32"
                    />
                    <span className="sr-only">Toggle user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{session?.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem>
                    <Link href={`/profile/${session?.db_id}`}>Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem>
                    <Link
                      href={`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signout?callbackUrl=/`}
                    >
                      Sign Out
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <ProfileProgress />
        </header>
        <Link className="  md:hidden mt-5 mr-2" href="/discussions/trending">
          <BellIcon className="h-6 w-6" />
        </Link>
      </div>
    </>
  );
};

export default NavbarClient;

function BellIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}
