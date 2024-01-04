import Link from "next/link";
import React from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/posts", label: "Posts" },
  { href: "/about", label: "About" },
  { href: "/profile", label: "Profile" },
];

const Navbar = () => {
  return (
    <div>
      Navbar
      {navLinks.map((link) => (
        <span key={link.label} className="mx-8 font-semibold">
          <Link href={link.href}>{link.label}</Link>
        </span>
      ))}
    </div>
  );
};

export default Navbar;
