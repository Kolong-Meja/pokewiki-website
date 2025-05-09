import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("https://raw.githubusercontent.com/**")],
  },
  /* config options here */
  reactStrictMode: true,
};

export default nextConfig;
