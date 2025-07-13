import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL("https://cdn.jackpot.bet/thumbnails/**")],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
