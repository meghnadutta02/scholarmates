import React from "react";
import logo from "@/public/logo.png";
import Image from "next/image";
import Link from "next/link";
import { LinkedInLogoIcon } from "@radix-ui/react-icons";

const Footer = () => {
  return (
    <footer className="bg-zinc-700 text-gray-300 py-6 min-w-full">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center md:items-start mb-8 md:mb-0 text-center md:text-left">
          <Image
            src={logo}
            alt="ScholarMates Logo"
            className="w-32 h-auto mb-4"
          />
          <p className="text-lg">
            &quot;ScholarMates - Checkmate your goals. Together. &quot;
          </p>
        </div>
        <div className="flex flex-col items-center md:items-start">
          <h4 className="text-xl font-semibold mb-4">Creators</h4>
          {authors.map((user, index) => (
            <Link key={index} href={user.linkedIn} target="_blank">
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
    linkedIn: "https://www.linkedin.com/in/meghna-dutta-a44060266/",
  },
  {
    name: "Ankush Roy",
    linkedIn: "https://www.linkedin.com/in/ankush-roy-b141b2224/",
  },
  {
    name: "Jyotiraditya Mishra",
    linkedIn: "https://www.linkedin.com/in/jyotiraditya-mishra-090047204/",
  },
];

export default Footer;
