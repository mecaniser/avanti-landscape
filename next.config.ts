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
      // and surfaces as a bare 500. The gallery forms post two photos at once
      // and phone photos are several MB each, so raise the ceiling. 20 MB also
      // matches Cloudinary's 10 MB-per-image limit on the free plan.
      bodySizeLimit: "20mb",
    },
  },
};

export default nextConfig;
