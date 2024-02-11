import React, { Suspense } from "react";
import { getServerSession } from "next-auth";
import Loading from "./loading";
import { AiOutlineSearch } from "react-icons/ai";
import { options } from "@/app/api/auth/[...nextauth]/options";
import DiscussionList from "@/app/(components)/DiscussionList";
import DiscussionFilter from "@/app/(components)/DiscussionFilter";
const DiscussionsPage = async () => {
  return (
    <div>
      <div className="flex ">
        <div className="w-[23%]">
          <DiscussionFilter />
        </div>

        <div className="flex-1  pt-5 px-6 ">
          <div className="flex mb-10">
            <div className="relative w-[50%]">
              <input
                type="text"
                placeholder="cloud engineer"
                className="w-full pl-10 pr-4 py-2 rounded border"
              />
              <div className="absolute top-3 left-1 flex items-center pointer-events-none">
                <AiOutlineSearch className="h-5 w-5 text-gray-400" />{" "}
              </div>
            </div>
            <button className="w-[70px] ml-4  bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors duration-300">
              Search
            </button>
          </div>

          <Suspense fallback={<Loading />}>
            <DiscussionList />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default DiscussionsPage;
