import React from "react";
import logo from "@/public/logo.png";
import Image from "next/image";

import { IoMdInformationCircleOutline } from "react-icons/io";
import { BiSupport } from "react-icons/bi";
import Link from "next/link";

const About = () => {
  return (
    <section className="text-gray-800 flex flex-col justify-between h-full ">
      <nav className="flex-col mt-4 items-start  px-4 text-md lg:text-lg font-medium">
        <Link
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
          href="/about"
        >
          <IoMdInformationCircleOutline className="h-5 w-5 " />
          About
        </Link>
        <Link
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
          href="/support"
        >
          <BiSupport className="h-5 w-5" />
          Support
        </Link>
      </nav>

      <div className="flex flex-col items-center text-center mb-8 ">
        <p className="font-bold text-md"> ScholarMates</p>
        <Image src={logo} alt="ScholarMates Logo" className="w-24 h-auto" />
        <p className="">
          <i>&quot;Checkmate your goals. Together. &quot;</i>
        </p>
        <div className="border-t border-gray-500 my-2 text-center text-sm text-gray-500 ">
          &copy; 2024 ScholarMates. All rights reserved.
        </div>
      </div>
    </section>
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

export default About;
