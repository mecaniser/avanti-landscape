import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { absoluteUrl } from "@/lib/site";
import { SERVICE_CATEGORIES } from "@/lib/services";

// Generated per request rather than at build time, for two reasons: a post
// published through the admin must appear immediately without a redeploy, and
// Railway runs `prisma migrate deploy` at start, after the build, so the
// build itself must not depend on the database being reachable.
export const dynamic = "force-dynamic";

// Blog posts live in the database and are published through the admin, so the
// sitemap is generated rather than hardcoded: a new post appears here the
// moment it is published, with no deploy.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await prisma.blogPost.findMany({
    where: { publishedAt: { not: null } },
    select: { slug: true, updatedAt: true },
    orderBy: { publishedAt: "desc" },
  });

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/") },
    { url: absoluteUrl("/services") },
    ...SERVICE_CATEGORIES.map((cat) => ({
      url: absoluteUrl(`/services/${cat.slug}`),
    })),
    { url: absoluteUrl("/areas") },
    { url: absoluteUrl("/gallery") },
    { url: absoluteUrl("/about") },
    { url: absoluteUrl("/contact") },
    { url: absoluteUrl("/blog") },
    { url: absoluteUrl("/privacy") },
    { url: absoluteUrl("/terms") },
  ];

  return [
    ...staticRoutes,
    ...posts.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: post.updatedAt,
    })),
  ];
}
