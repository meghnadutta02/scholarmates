import React from "react";
import { motion } from "framer-motion";
import change from "@/public/change.mp4";
import { TypeAnimation } from "react-type-animation";
import puzzle from "@/public/puzzle.png";
import Image from "next/image";

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
      video: change,
      rotation: "rotate-12",
    },
    {
      title: ["", "Form", "Form Groups"],
      description:
        "Connect with like-minded individuals, share your views, and collaborate on projects. Whether it's a study group, a project team, or a club, find and form groups to work together, foster innovation, and achieve your goals.",
      video: change,
      rotation: "-rotate-6",
    },
    {
      title: ["", "Find", "Find Partners"],
      description:
        "Look for partners with the required skill sets for hackathons, study groups, or any other collaborative activities. Meet peers who complement your skills, inspire innovation, and collaborate on exciting, transformative projects.",
      video: change,
      rotation: "rotate-30",
    },
  ];

  return (
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
      <div className="md:mt-12 mt-8 flex flex-col md:gap-8 gap-7">
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
              className="w-[88%] md:w-2/5 mb-4 md:mb-0"
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
  );
};

export default Services;
