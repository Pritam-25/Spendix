import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
