"use client";
import React from "react";
import main from "@/public/main.png";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import Image from "next/image";
import puzzle from "@/public/puzzle.png";

const Hero = () => {
  const subtitle = "Your Network of Like-Minded Individuals".split(" ");

  return (
    <div className="mt-8 px-4">
      <div className="flex flex-col lg:flex-row md:gap-8 gap-6 w-full px-4 md:px-8 mt-8">
        <div className="w-full lg:w-1/2 flex justify-center mx-auto md:mt-8 pt-8">
          <Image src={main} alt="jumbotron" height={420} width={420} />
        </div>
        <div className="w-full lg:w-1/2 flex flex-col justify-center">
          <div className="justify-start mr-4 mb-4 flex">
            <TypeAnimation
              sequence={[
                "",
                "Welcome",
                "Welcome to",
                "Welcome to ScholarMates",
              ]}
              wrapper="span"
              speed={2}
              className="font-bold  md:pt-16 pt-6  text-blue-800 text-2xl md:text-5xl font-serif dark:text-gray-200"
              repeat={2}
            />
          </div>
          <div className="flex flex-col md:gap-4 gap-2 ">
            <motion.div
              className="mb-4"
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
                  className="font-semibold text-gray-600 text-md md:text-2xl dark:text-gray-400"
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
            className="text-md md:hidden relative text-gray-600 dark:text-gray-400  mt-1"
          >
            At ScholarMates, we harness the power of connection. Our platform
            unites individuals with shared interests and goals. Whether for
            professional networking, study groups, or making new friends,
            ScholarMates is your go-to. Join today, connect with like-minded
            individuals, at the speed of a 4 moves scholar&apos;s-mate
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, delay: 1.4 }}
            variants={{
              hidden: { opacity: 0, x: -60 },
              visible: { opacity: 1, x: 0 },
            }}
            className="text-md md:text-xl relative hidden md:block text-gray-600 dark:text-gray-400 md:mt-2 mt-4 md:pr-16"
          >
            At ScholarMates, we believe in the power of connection. Our platform
            is designed to bring together people who share similar interests,
            passions, and goals. Whether you&apos;re looking to network
            professionally, find a study group, or simply make new friends who
            understand your hobbies, ScholarMates is your go-to destination.
            Join today, connect with like-minded individuals, at the speed of a
            4 moves scholar&apos;s-mate
            <Image
              src={puzzle}
              alt="Puzzle"
              className=" w-16 h-16 md:w-28 md:h-28 absolute right-4 md:right-16 top-20 md:top-36 opacity-30 transform rotate-12"
            />
            <Image
              src={puzzle}
              alt="Puzzle"
              className=" w-12 h-12 md:w-20 md:h-20 absolute left-[-26px] top-[-31px] opacity-30 -rotate-45"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
