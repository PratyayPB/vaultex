import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "100MB",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
      },
      {
        protocol: "https",
        hostname: "cloud.appwrite.io",
      },
      {
        protocol: "https",
        hostname: "cdn-icons-png.flaticon.com",
      },
      {
        protocol: "https",
        hostname: "sgp.cloud.appwrite.io",
      },
    ],
  },
};

export default nextConfig;
