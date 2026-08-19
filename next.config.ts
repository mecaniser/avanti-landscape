import type { NextConfig } from "next";

// Applied to every response. Kept deliberately conservative: nothing here
// changes what the site can load, only what a browser is allowed to do with it.
const SECURITY_HEADERS = [
  // Force HTTPS for a year. Railway already 301s http to https; this stops the
  // first request going over http at all on repeat visits.
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // The site asks for no device permissions, so deny the common ones outright.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
];

const nextConfig: NextConfig = {
  // Do not advertise the framework and version.
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: SECURITY_HEADERS,
      },
      {
        // Static assets are content-addressed by filename here, not hashed, so
        // an immutable year would strand an owner-replaced image behind a stale
        // cache. A day of browser caching plus a week of CDN caching that can
        // be revalidated is the balance: repeat visitors stop re-downloading
        // the hero video, and a replaced asset still turns over quickly.
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
    // Next defaults this to [75] only — any other `quality` prop silently
    // snaps back to 75 (via findClosestQuality) unless explicitly allowed
    // here. 60 is what the large photo components ask for.
    qualities: [60, 75],
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
