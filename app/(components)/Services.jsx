"use client";
import React from "react";
import { motion } from "framer-motion";
import change from "@/public/change.mp4";
import createDiscussions from "@/public/create-discussions.mp4";
import groupChat from "@/public/group-chat.mp4";
import findFriends from "@/public/find-friends.mp4";
import { TypeAnimation } from "react-type-animation";
import puzzle from "@/public/puzzle.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const Services = () => {
  const item = {
    hidden: { opacity: 0, scale: 0.6 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
      },
    },
  };

  const services = [
    {
      title: ["", "Start", "Start Discussions"],
      description:
        "Create or join discussions to find opportunities, share opinions, seek advice and stay updated on what's happening around campus. Share your thoughts on various topics and connect with others who share your interests.",
      video: createDiscussions,
      rotation: "rotate-12",
    },
    {
      title: ["", "Find", "Find Partners"],
      description:
        "Update your profile to include your interests and then find like-minded individuals to connect with. Share your views, collaborate on projects, join study groups, project teams, or clubs. Work together, foster innovation, and achieve your goals.",
      video: findFriends,
      rotation: "-rotate-6",
    },
    {
      title: ["", "Join", "Join Groups"],
      description:
        "Join groups that match your interests and share your opinions on various topics. Engage in meaningful discussions, learn from diverse perspectives, and build a community of like-minded individuals. Collaborate, innovate, and grow together.",
      video: groupChat,
      rotation: "rotate-30",
    },
  ];

  return (
    <div className="flex flex-col space-y-7 md:space-y-12 items-center bg-blue-50 bg-opacity-85">
      <div className="flex gap-5 flex-col items-center">
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="font-semibold text-gray-700 text-xl sm:text-3xl md:mt-[-24px] font-serif dark:text-gray-400 text-center"
        >
          Sign up to explore!
        </motion.div>
        <Button className="py-2 px-4 md:py-6 md:px-8 max-w-[200px] text-md lg:text-lg bg-pink-700 transition-transform hover:scale-110 hover:bg-teal-700">
          Join Now
        </Button>
      </div>

      <div className="container mx-auto  px-4 sm:px-6 lg:px-8 font-serif md:mt-0 mt-7">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
          variants={{
            hidden: { opacity: 0, x: -60 },
            visible: { opacity: 1, x: 0 },
          }}
          className="font-semibold text-gray-600 text-xl sm:text-3xl font-serif dark:text-gray-400 text-center"
        >
          Discover, Connect, and Grow Together
        </motion.div>
        <div className="md:mt-12 mt-6 flex flex-col md:gap-8 gap-7">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className={`flex flex-col md:flex-row justify-between items-center dark:bg-gray-800 p-5 rounded-lg ${
                index % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={item}
            >
              <video
                src={service.video}
                alt={service.title}
                className="w-[88%] md:w-2/5 mb-4 md:mb-0 rounded-lg shadow-lg shadow-blue-600"
                loop
                muted
                autoPlay
              />
              <div className="flex flex-col justify-center md:gap-7  dark:bg-gray-700 w-[88%] md:w-2/4 rounded-md gap-0">
                <TypeAnimation
                  sequence={service.title}
                  wrapper="span"
                  speed={20}
                  className="font-semibold text-gray-700 text-lg md:text-3xl font-serif dark:text-gray-200 mb-4"
                  repeat={Infinity}
                />
                <p className="text-gray-600 dark:text-gray-400 font-serif text-base sm:text-lg md:text-xl relative">
                  {service.description}
                  <Image
                    src={puzzle}
                    alt="Puzzle"
                    className={`w-20 h-20 lg:w-24 lg:h-24 absolute right-4 md:right-16 top-[60px] opacity-30 hidden md:block transform ${service.rotation}`}
                  />
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
