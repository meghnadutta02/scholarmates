"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import puzzle from "@/public/puzzle.png";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <div className="px-5 md:mt-16 flex w-[80%] lg:w-2/3 justify-end flex-col-reverse md:flex-row ">
      <div>
        <div>
          <Image
            height={400}
            width={800}
            alt="404"
            src="https://i.ibb.co/G9DC8S0/404-2.png"
          />
        </div>
        <div className="relative mt-8 md:mt-16">
          <h1 className="my-2 text-gray-800 font-bold text-2xl">
            Looks like you&apos;ve found the doorway to the great nothing
          </h1>
          <p className="my-2 text-gray-800 md:text-lg">
            Sorry about that! Please visit our hompage to get where you need to
            go.
          </p>
          <Link href="/discussions">
            <button className="sm:w-full lg:w-auto my-2 border rounded md py-4 px-8 text-center bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-50">
              Take me there!
            </button>
          </Link>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{
              duration: 20,
              ease: "linear",
              repeat: Infinity,
            }}
            className="absolute -right-10 bottom-4 z-[-1]"
          >
            <Image
              src={puzzle}
              alt="Puzzle"
              className="w-12 hidden sm:block h-12 md:w-36 md:h-36 opacity-30 -rotate-30"
            />
          </motion.div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 20,
              ease: "linear",
              repeat: Infinity,
            }}
            className="absolute -right-44 -top-7 z-[-1]"
          >
            <Image
              src={puzzle}
              alt="Puzzle"
              className="w-12 hidden sm:block h-12 md:w-24 md:h-24 opacity-30 -rotate-45"
            />
          </motion.div>
        </div>
      </div>
      <div className="ml-[-3px]">
        <Image
          height={200}
          width={600}
          alt="Plugs"
          src="https://i.ibb.co/ck1SGFJ/Group.png"
        />
      </div>
    </div>
  );
};

export default NotFound;
