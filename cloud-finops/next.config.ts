import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  transpilePackages: ["recharts"],
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
