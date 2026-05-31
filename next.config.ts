import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        hostname: "images.unsplash.com",
        protocol: "https",
        port: "",
      },
      {
        hostname: "ceaseless-pig-377.eu-west-1.convex.cloud",
        protocol: "https",
        port: "",
      },
    ],
  },
};

export default nextConfig;
