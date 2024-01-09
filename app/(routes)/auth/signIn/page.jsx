"use client";
import { signIn } from "next-auth/react";

import React from "react";

import { FaGoogle, FaGithub } from "react-icons/fa";

const login = () => {
  return (
    <div className=" flex  justify-center">
      <div className="max-w-md h-[70%] w-[80%] mx-auto p-6 bg-white shadow-lg rounded-lg">
        <button
          className="bg-red-500 w-full hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 ease-in-out mb-3 flex items-center justify-center gap-3"
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          <FaGoogle className=" text-center" />
          Sign in with Google
        </button>
        <button
          className="bg-gray-800 w-full hover:bg-gray-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 ease-in-out flex items-center justify-center gap-3"
          type="button"
          onClick={() => signIn("github", { callbackUrl: "/" })}
        >
          <FaGithub className="text-lg" />
          Sign in with GitHub
        </button>
      </div>
    </div>
  );
};

export default login;
