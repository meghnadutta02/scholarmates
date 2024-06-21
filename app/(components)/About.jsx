import React from "react";
import logo from "@/public/logo.png";
import Image from "next/image";

const About = () => {
  return (
    <section className="text-gray-800 flex flex-col space-y-[70%]">
      <div className="   p-4">
        <div className="flex flex-col items-center text-center mb-8">
          <p className="font-bold text-lg"> AlikeHub</p>
          <Image src={logo} alt="AlikeHub Logo" className="w-32 h-auto mb-4" />
          <p className="text-md">
            <i>&quot;Made for the students, by the students.&quot;</i>
          </p>
        </div>
      </div>
      <div className="flex flex-col ">
        <div className="flex text-sm flex-col justify-start p-4">
          <h4 className="text-base font-semibold">Creators</h4>
          <p>Meghna Dutta</p>
          <p>Ankush Roy</p>
          <p>Jyotiraditya Mishra</p>
        </div>
        <div className="border-t border-gray-500 mt-2 pt-4 text-center text-sm text-gray-500">
          &copy; 2024 AlikeHub. All rights reserved.
        </div>
      </div>
    </section>
  );
};

export default About;
