// NavbarClient.js
"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import MenuDrawer from "@/app/(components)/MenuDrawer";
import NavbarSearch from "./NavbarSearch";
import { useSession as useCustomSession } from "@/app/(components)/SessionProvider";
import logo from "@/public/logo.png";
import { useSession } from "next-auth/react";
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
  const {
    socket,
    seenNotifications,
    notification,
    setSeenNotifications,
    setNotification,
    setUnreadCount,
    unreadCount,
  } = useCustomSession();
  const { data: session } = useSession();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const removeDuplicates = (array) => {
    const uniqueSet = new Set(array.map((item) => JSON.stringify(item)));
    return Array.from(uniqueSet).map((item) => JSON.parse(item));
  };

  useEffect(() => {
    if (socket && session) {
      const data = session?.user?.user?.db_id;

      socket.emit("setup", data);

      socket.on("connectionRequest", (data) => {
        if (data) {
          setNotification((prev) => {
            const newNotifications = removeDuplicates([...prev, data]);
            setUnreadCount(newNotifications.length);
            return newNotifications;
          });
          const dataString = JSON.stringify(data);
          if (!seenNotifications.has(dataString)) {
            setSeenNotifications((prev) => new Set(prev).add(dataString));
          }
        }
      });

      socket.on("receiveRequest", (data) => {
        if (data) {
          console.log("receive noti:", data);
          setNotification((prev) => {
            const newNotifications = removeDuplicates([...prev, data]);
            setUnreadCount(newNotifications.length);
            return newNotifications;
          });
          const dataString = JSON.stringify(data);
          if (!seenNotifications.has(dataString)) {
            setSeenNotifications((prev) => new Set(prev).add(dataString));
          }
        }
      });

      socket.on("dicussionNotification", (data) => {
        if (data) {
          console.log("receive noti:", data);
          setNotification((prev) => {
            const newNotifications = removeDuplicates([...prev, data]);
            setUnreadCount(newNotifications.length);
            return newNotifications;
          });
          const dataString = JSON.stringify(data);
          if (!seenNotifications.has(dataString)) {
            setSeenNotifications((prev) => new Set(prev).add(dataString));
          }
        }
      });
    }
  }, [socket, notification, session, seenNotifications]);

  return (
    <>
      <div className=" flex justify-between ">
        <header className="fixed z-10 top-0 left-1/2 transform -translate-x-1/2  flex flex-col gap-[5px] pt-1 ">
          <div className="flex flex-row md:justify-center justify ">
            <div className="flex  items-center px-2 rounded-s-xl border-2 border-zinc-700 bg-white">
              <Link
                href="#"
                className="flex items-center gap-2 font-semibold md:mr-0 mr-10"
              >
                <Image src={logo} alt="Likeminds" className="h-10 w-10" />
                <span>ScholarMates</span>
              </Link>
            </div>
            <div className="flex h-14 px-3 items-center justify-between gap-3 md:gap-5 rounded-e-xl bg-zinc-700 dark:bg-gray-800/40">
              <Link href="/notification">
                {unreadCount > 0 && (
                  <span className="z-10  md:block  items-center justify-center p-1 w-4 h-4 text-[10px] font-bold leading-none top-[13px] text-red-100 bg-red-600 rounded-full right-[110px]">
                    {unreadCount}
                  </span>
                )}

                <BellIcon className="relative  h-5 w-5 text-white cursor-pointer" />
              </Link>

              <AiOutlineSearch
                className="h-5 w-5 text-white cursor-pointer"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              />
              <span className="md:hidden">
                <MenuDrawer />
              </span>

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
                      src={session?.user?.profilePic}
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
                  <DropdownMenuLabel>{session?.user?.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem>
                    <Link href={`/profile/${session?.user?.db_id}`}>
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem>
                    <Link href={`/api/auth/signout?callbackUrl=/`}>
                      Sign Out
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <ProfileProgress />
          {isSearchOpen && <NavbarSearch setIsSearchOpen={setIsSearchOpen} />}
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
