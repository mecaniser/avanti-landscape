import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The admin dashboard and API routes have no business in an index.
        // /admin/login is also noindexed at the page level, because a
        // Disallow alone does not stop a linked URL from being indexed.
        disallow: ["/admin", "/api"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
