import Link from "next/link";
import React from "react";
import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";
const navLinks = [
  { href: "/", label: "Home" },
  { href: "/posts", label: "Posts" },
  { href: "/reels", label: "Reels" },
  { href: "/CreateUser", label: "Admin" },
];

const Navbar = async () => {
  const session = await getServerSession(options);
  return (
    <header className="flex text-white justify-between py-2 px-4 items-center left-0 right-0 top-0  bg-gray-600">
      MySite
      <div className="flex justify-between gap-9 font-semibold">
        {navLinks.map((link) => (
          <span key={link.label}>
            <Link href={link.href}>{link.label}</Link>
          </span>
        ))}
        {session ? (
          <Link href="/api/auth/signout?callbackUrl=/">Sign Out</Link>
        ) : (
          <Link href="/api/auth/signin">Sign In</Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
