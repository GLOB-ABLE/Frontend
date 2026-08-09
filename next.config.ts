import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: "/",
        destination: "/intro/student",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
