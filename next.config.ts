import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      // Next defaults to 1 MB, which rejects the request before the action runs
      // and surfaces as a bare 500. This covers server actions only — media
      // uploads go through the /api/admin/media route handler, which enforces
      // its own limits from lib/uploads.ts.
      bodySizeLimit: "20mb",
    },
  },
};

export default nextConfig;
