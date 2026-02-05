import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  reactStrictMode: true,
  experimental: {
    // @ts-expect-error appDir هنوز در types تعریف نشده
    appDir: true, // 🔹 این مهمه
  },
};

export default nextConfig;
