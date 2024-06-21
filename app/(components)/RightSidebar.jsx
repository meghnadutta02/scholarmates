import React from "react";

import About from "./About";

const RightSidebar = async () => {
  return (
    <div className="hidden lg:flex lg:flex-col items-end rounded-ss-lg bg-gray-100 dark:bg-gray-800 w-[15%]">
      <div className="fixed right-0  w-[15%] pb-4 ">
        <About />
      </div>
    </div>
  );
};

export default RightSidebar;
