"use client";

import Image from "next/image";
import { TypeAnimation } from "react-type-animation";
import Services from "./(components)/Services";
import main from "@/public/main.png";
import Footer from "./(components)/Footer";
import { Button } from "@/components/ui/button";
import puzzle from "@/public/puzzle.png";
import { motion } from "framer-motion";

const Home = () => {
  const subtitle = "Your Network of Like-Minded Innovators".split(" ");

  return (
    <div className="flex flex-col space-y-7 md:space-y-16 items-center bg-blue-50 bg-opacity-85">
      <div className="md:mt-32 mt-24  px-4">
        {/*  Hero section */}
        <div className="flex flex-col md:flex-row md:gap-16 gap-6  w-full md:max-h-[500px] px-4 md:px-8">
          <div className="w-full md:w-1/2 flex justify-center mx-auto md:justify-around">
            <Image
              src={main}
              alt="Main"
              className="w-[70%] md:w-[85%] mb-4 md:mb-0"
            />
          </div>
          <div className="w-full md:w-1/2 flex flex-col md:justify-evenly ">
            <div className="flex flex-col gap-3">
              <div className="">
                <TypeAnimation
                  sequence={[
                    "",
                    "Welcome",
                    "Welcome to",
                    "Welcome to AlikeHub",
                  ]}
                  wrapper="span"
                  speed={20}
                  className="font-semibold text-gray-700 text-2xl md:text-5xl font-serif dark:text-gray-200"
                  repeat={Infinity}
                />
              </div>
              <motion.div
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
                    className="font-semibold text-gray-600 text-md md:text-3xl font-serif dark:text-gray-400"
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
              className="text-md md:hidden relative font-serif text-gray-600 dark:text-gray-400  mt-4"
            >
              At AlikeHub, we harness the power of connection. Our platform
              unites individuals with shared interests and goals. Whether for
              professional networking, study groups, or making new friends,
              AlikeHub is your go-to. Join today, connect with like-minded
              individuals, and foster collaboration, inspiration, and growth.
              Welcome to your new hub!
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
              className="text-md md:text-xl relative font-serif hidden md:block text-gray-600 dark:text-gray-400 md:mt-0 mt-4"
            >
              At AlikeHub, we believe in the power of connection. Our platform
              is designed to bring together people who share similar interests,
              passions, and goals. Whether you're looking to network
              professionally, find a study group, or simply make new friends who
              understand your hobbies, AlikeHub is your go-to destination. Join
              our community today and discover the joy of connecting with others
              who truly get you. Together, we can build a network that fosters
              collaboration, inspiration, and growth. Welcome to your new hub of
              like-minded connections!
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
      {/* Services section */}
      <Services />
      {/* Call to action */}
      <div className="flex gap-5 flex-col items-center ">
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.17, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="font-semibold text-gray-600 text-xl sm:text-3xl font-serif dark:text-gray-400 text-center"
        >
          Sign up to explore!
        </motion.div>
        <Button className="py-4 px-6 md:py-6 md:px-8 max-w-[200px] text-lg bg-zinc-700 transition-transform hover:scale-110">
          Join Now
        </Button>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
