import React from "react";

const Footer = () => {
  return (
    <div className="hidden md:flex rounded-ss-lg bg-gray-100 dark:bg-gray-800 w-[15%]">
      <div className="flex-col fixed items-start p-4 text-md lg:text-lg font-medium">
        <p>Trendings</p>
        <p>Suggestions</p>
        <p>Footer Details</p>
        <p>Quick links</p>
      </div>
    </div>
  );
};

export default Footer;
