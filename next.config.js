const withVideos = require("next-videos");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  compiler: {
    removeConsole: process.env.NEXT_APP_ENVIRONMENT === "production",
  },
};

module.exports = withVideos(nextConfig);
