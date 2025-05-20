import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  i18n: {
    locales: ["en", "id"],
    defaultLocale: "en",
    localeDetection: false,
  },
  images: {
    remotePatterns: [new URL("https://raw.githubusercontent.com/**")],
  },

  /* config options here */
  reactStrictMode: true,
};

export default nextConfig;
