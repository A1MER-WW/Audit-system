import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Disable webpack caching to prevent ENOSPC errors
    config.cache = false;
    return config;
  },
};

export default nextConfig;
