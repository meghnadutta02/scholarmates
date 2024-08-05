import React from "react";
import logo from "@/public/logo.png";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-zinc-700 text-gray-300 md:py-6 py-4 min-w-full">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center md:items-start mb-6 md:mb-0 text-center md:text-left">
          <Image
            src={logo}
            alt="ScholarMates Logo"
            className="md:w-32 h-auto mb-4 w-28"
          />
          <p className="text-lg">
            &quot;ScholarMates - Checkmate your goals. Together. &quot;
          </p>
        </div>
        <div className="flex flex-col items-center md:items-start">
          <h4 className="text-xl font-semibold md:mb-4 mb-[9px]">Creators</h4>
          {authors.map((user, index) => (
            <Link key={index} href={user.linktree} target="_blank">
              <p className="my-1">{user.name}</p>
            </Link>
          ))}
        </div>
      </div>
      <div className="border-t border-gray-500 mt-8 pt-4 text-center text-sm text-gray-400">
        &copy; 2024 ScholarMates. All rights reserved.
      </div>
    </footer>
  );
};

const authors = [
  {
    name: "Meghna Dutta",
    linktree: "https://linktr.ee/Meghna_Dutta/",
  },
  {
    name: "Ankush Roy",
    linktree: "https://linktr.ee/ankushroy08",
  },
  {
    name: "Jyotiraditya Mishra",
    linktree: "https://linktr.ee/Jrmishra",
  },
];

export default Footer;
