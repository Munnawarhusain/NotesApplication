import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["192.168.137.1", "localhost:3000"],
  
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb", // Set this to the maximum PDF size you expect
    },
  },
};

export default nextConfig;
