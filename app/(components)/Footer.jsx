import React from "react";
import logo from "@/public/logo.png";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-zinc-700 text-gray-300 py-6 min-w-full">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center md:items-start mb-8 md:mb-0 text-center md:text-left">
          <Image src={logo} alt="AlikeHub Logo" className="w-32 h-auto mb-4" />
          <p className="text-lg">
            "AlikeHub - Made for the students, by the students."
          </p>
        </div>
        <div className="flex flex-col items-center md:items-start">
          <h4 className="text-xl font-semibold mb-4">Creators</h4>
          <p className="mb-2">Meghna Dutta</p>
          <p className="mb-2">Ankush Roy</p>
          <p className="mb-2">Jyotiraditya Mishra</p>
        </div>
      </div>
      <div className="border-t border-gray-500 mt-8 pt-4 text-center text-sm text-gray-400">
        &copy; 2024 AlikeHub. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
