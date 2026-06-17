import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "drive.google.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_IMAGE_URL || "default-host.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
      }

    ],
  },
};

export default nextConfig;
