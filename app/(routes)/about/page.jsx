"use client";
import React from "react";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import Image from "next/image";
import logo from "@/public/logo.png";
import puzzle from "@/public/puzzle.png";
import meghna from "@/public/meghna.png";
import ankush from "@/public/ankush.png";
import jyoti from "@/public/jyoti.png";
import { MdInsertLink } from "react-icons/md";

import Link from "next/link";

const About = () => {
  const subtitle = "Your Network of Like-Minded Individuals".split(" ");

  const authors = [
    {
      name: "Meghna Dutta",
      linktree: "https://linktr.ee/Meghna_Dutta/",
      scholarMates: "/profile/65fe90e020c7bb4be1dd9cbb",
      photo: meghna,
    },
    {
      name: "Ankush Roy",
      linktree: "https://linktr.ee/ankushroy08",
      photo: ankush,
      scholarMates: "/profile/66009e2a6502b612dac63e1f",
    },
    {
      name: "Jyotiraditya Mishra",
      linktree: "https://linktr.ee/Jrmishra",
      photo: jyoti,
      scholarMates: "/profile/661ada431f11963a2b1b3cff",
    },
  ];

  return (
    <div className="md:mt-6 sm:mt-3 mt-1 md:px-4 px-[2px]">
      <div className="flex flex-col lg:flex-row md:gap-10 sm:gap-3 gap-1  w-full px-4 md:px-8 ">
        <div className="flex justify-center md:block">
          <Image
            src={logo}
            alt="jumbotron"
            height={320}
            width={320}
            className="md:w-[320px] md:h-[290px] w-[205px] h-[205px] "
          />
        </div>

        <div className="md:w-[85%] w-full flex flex-col md:pt-[28px] ">
          <div className="mb-2">
            <TypeAnimation
              sequence={[
                "S",
                "Sc",
                "Sch",
                "Scho",
                "Schol",
                "Schola",
                "Scholar",
                "ScholarM",
                "ScholarMa",
                "ScholarMat",
                "ScholarMate",
                "ScholarMates",
              ]}
              wrapper="span"
              speed={2}
              className="font-bold text-blue-800 text-2xl md:text-5xl sm:text-3xl font-sans dark:text-gray-200"
              repeat={1}
            />
          </div>
          <div className="">
            <motion.div
              className="mb-2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, delay: 0.7 }}
              variants={{
                hidden: { opacity: 0, x: -60 },
                visible: { opacity: 1, x: 0 },
              }}
            >
              {subtitle.map((el, i) => (
                <span
                  key={i}
                  className="font-semibold text-gray-600 text-md sm:text-lg md:text-2xl dark:text-gray-400"
                >
                  {el}{" "}
                </span>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, delay: 1.4 }}
            variants={{
              hidden: { opacity: 0, x: -60 },
              visible: { opacity: 1, x: 0 },
            }}
            className="text-md md:text-xl relative text-gray-600 dark:text-gray-400 mt-2 "
          >
            At ScholarMates, we harness the power of connection. Our platform
            unites individuals with shared interests and goals. Whether for
            professional networking, study groups, or making new friends,
            ScholarMates is your go-to. Join today, connect with like-minded
            individuals, at the speed of a 4 moves scholar&apos;s-mate
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 20,
                ease: "linear",
                repeat: Infinity,
                delay: 2.4,
              }}
              className="absolute right-4 md:right-12 top-[64px] md:top-18 "
            >
              <Image
                src={puzzle}
                alt="Puzzle"
                className="w-16 h-16 md:w-28 md:h-28 opacity-30 transform rotate-12 sm:block hidden"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="my-10 px-4 md:px-8 w-full">
        <h2 className="font-bold text-2xl md:text-3xl text-blue-800 text-center dark:text-gray-200 mb-10">
          Meet the Creators
        </h2>
        <div className="flex flex-col md:flex-row md:gap-10 gap-6 justify-center items-center w-full">
          {authors.map((user, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center bg-white p-4 rounded-lg shadow-lg w-[300px] h-[280px] gap-2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, delay: index * 0.5 }}
              variants={{
                hidden: { opacity: 0, y: -30 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1.085, transition: { duration: 0.25 } }}
            >
              <Image
                src={user.photo}
                alt={user.name}
                height={150}
                width={150}
                className="shadow-inset mb-4 bg-blue-50 bg-opacity-85 rounded-full"
              />

              <p className="text-lg text-blue-800 dark:text-gray-200">
                {user.name}
              </p>
              <div className="flex gap-2 items-center">
                <Link
                  href={user.scholarMates}
                  target="_blank"
                  className="transform transition-transform hover:scale-125"
                >
                  <Image
                    alt="Scholarmates"
                    src={logo}
                    className="md:w-10 md:h-10 w-8 h-8"
                    width={40}
                    height={40}
                  />
                </Link>
                <Link
                  href={user.linktree}
                  target="_blank"
                  className="transform transition-transform hover:scale-125"
                >
                  <MdInsertLink className=" w-7 h-7 -rotate-45" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
