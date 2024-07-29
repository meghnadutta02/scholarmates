import React from "react";
import logo from "@/public/logo.png";
import Image from "next/image";

import { IoMdInformationCircleOutline } from "react-icons/io";
import { BiSupport } from "react-icons/bi";
import Link from "next/link";

const About = () => {
  return (
    <section className="text-gray-800 flex flex-col justify-between h-full">
      <div className="   p-4">
        <div className="flex flex-col items-center text-center mb-8 mt-4">
          <p className="font-bold text-md"> ScholarMates</p>
          <Image src={logo} alt="ScholarMates Logo" className="w-24 h-auto" />
          <p className="">
            <i>&quot;Checkmate your goals. Together. &quot;</i>
          </p>
        </div>
      </div>
      <div className="flex flex-col ">
        <div className="flex text-sm flex-col justify-start p-4">
          <h4 className="text-base font-semibold">Quick links</h4>
          <nav className="flex-col mt-4 items-start text-md lg:text-lg font-medium">
            <Link
              className="flex items-center gap-3 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              href="/about"
            >
              <IoMdInformationCircleOutline className="h-5 w-5 " />
              About
            </Link>
            <Link
              className="flex items-center gap-3 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              href="/support"
            >
              <BiSupport className="h-5 w-5" />
              Support
            </Link>
          </nav>
        </div>
        <p className="border-t border-gray-500 mb-10 py-2 text-center text-sm text-gray-500">
          &copy; 2024 ScholarMates <br /> All rights reserved.
        </p>
      </div>
    </section>
  );
};

export default About;
