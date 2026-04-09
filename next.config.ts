import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: ".next_temp",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "webbookpro.com",
      },
    ],
  },
};

export default nextConfig;
