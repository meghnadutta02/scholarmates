import Link from "next/link";
import React from "react";
import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";
import { Button } from "@/components/ui/button";
import { MdOutlineConnectWithoutContact } from "react-icons/md";
import { MdGroupAdd } from "react-icons/md";

import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const Navbar = async () => {
  const session = await getServerSession(options);

  return (
    <header className="fixed z-10 top-0 left-1/2 transform -translate-x-1/2 flex flex-row justify-center pt-1">
      <div className="flex  items-center px-4 rounded-s-xl border-2 border-zinc-600 bg-white">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Package2Icon className="h-6 w-6" />
          <span>Likeminds</span>
        </Link>
        {session && (
          <Link href="/notification">
            <Button className="ml-auto h-8 w-8" size="icon" variant="icon">
              <BellIcon className="h-5 w-5" />
            </Button>
          </Link>
        )}
      </div>
      <div className="flex h-14 px-6 items-center gap-4 rounded-e-xl bg-zinc-700 dark:bg-gray-800/40">
        <nav className="flex flex-row items-center gap-4 ml-auto flex-1 text-sm justify-end">
          {session ? (
            <>
              <Link
                href="/chats"
                className="flex items-center gap-2 rounded-lg px-2 py-2 text-gray-100 transition-all hover:text-pink-500 dark:text-gray-400 dark:hover:text-gray-50"
              >
                <MessageSquareIcon className="h-4 w-4" />
              </Link>
              <Link
                href="/discussions"
                className="flex items-center gap-2 rounded-lg px-2 py-2 text-gray-100 transition-all hover:text-pink-500 dark:text-gray-400 dark:hover:text-gray-50"
              >
                <UsersIcon className="h-4 w-4" />
              </Link>

              <Link
                className="flex items-center gap-3 rounded-lg px-2 py-2 text-gray-100 transition-all hover:text-pink-500 dark:text-gray-400 dark:hover:text-gray-50"
                href="/find-match"
              >
                <MdOutlineConnectWithoutContact className="h-4 w-4" />
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg px-2 py-2 text-gray-100 transition-all hover:text-pink-500 dark:text-gray-400 dark:hover:text-gray-50"
                href="/requests"
              >
                <MdGroupAdd className="h-4 w-4" />
              </Link>
            </>
          ) : (
            <Link
              href={session ? "" : "/api/auth/signin"}
              className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-900  transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50"
            >
              {/* <HomeIcon className="h-4 w-4" /> */}
              Sign In
            </Link>
          )}
        </nav>
        {session && (
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
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/profile">Profile</Link>
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
        )}
      </div>
    </header>
  );
};

export default Navbar;

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

function HomeIcon(props) {
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
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function MessageSquareIcon(props) {
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
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function Package2Icon(props) {
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
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
      <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
      <path d="M12 3v6" />
    </svg>
  );
}

function UsersIcon(props) {
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
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
