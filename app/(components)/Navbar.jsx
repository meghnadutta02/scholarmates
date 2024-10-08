"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { Button } from "@/components/ui/button";

import profilePic from "@/public/pfp.png";
import MenuDrawer from "@/app/(components)/MenuDrawer";
import NavbarSearch from "./NavbarSearch";
import { useSession as useCustomSession } from "@/app/(components)/SessionProvider";
import logo from "@/public/logo.png";
import { useSession } from "next-auth/react";
import Image from "next/image";
import ProfileProgress from "./ProfileProgress";

const NavbarClient = () => {
  const { unreadCount } = useCustomSession();
  const { data: session } = useSession();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const componentRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target)
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen]);

  return (
    <>
      <div className="flex justify-between">
        <header className="fixed z-10 top-0 left-1/2 transform -translate-x-1/2 flex flex-col gap-[5px] pt-1">
          <div className="flex flex-row md:justify-center">
            <div className="flex items-center px-2 rounded-s-xl border-2 border-zinc-700 border-r-0 bg-white">
              <Link
                href="/discussions"
                className="flex items-center gap-2 font-semibold md:mr-0 mr-10"
              >
                <Image src={logo} alt="ScholarMates" className="h-10 w-10" />
                <span>ScholarMates</span>
              </Link>
            </div>
            <div className="flex h-14 px-3 items-center justify-between gap-3 md:gap-5 rounded-e-xl bg-zinc-700 dark:bg-gray-800/40">
              <Link href="/notification">
                <div className="relative">
                  <BellIcon className="relative h-5 w-5 text-white cursor-pointer" />
                  {unreadCount > 0 && (
                    <span className="z-10 md:block text-center p-[2px] w-4 h-4 text-[11px] font-bold leading-none top-[-9px] text-red-100 bg-red-600 rounded-full right-[-5px] absolute">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </div>
              </Link>

              <AiOutlineSearch
                className="h-5 w-5 text-white cursor-pointer"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              />
              <span className="lg:hidden">
                <MenuDrawer />
              </span>
              <Button
                className="rounded-full border border-gray-200 w-8 h-8 dark:border-gray-800"
                id="menu-button"
                size="icon"
                variant="ghost"
              >
                <Link href={`/profile/${session?.user?.db_id}`}>
                  <Image
                    alt="Avatar"
                    className="rounded-full"
                    height="32"
                    src={session?.user?.profilePic || profilePic}
                    style={{
                      aspectRatio: "32/32",
                      objectFit: "cover",
                    }}
                    width="32"
                  />
                </Link>

                <span className="sr-only">Toggle user menu</span>
              </Button>
            </div>
          </div>
          <ProfileProgress />
          {isSearchOpen && session?.user && (
            <div ref={componentRef}>
              <NavbarSearch id={session.user.db_id} />
            </div>
          )}
        </header>
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
