import { cache } from "react";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import { CACHE_TTL_SECONDS, TAGS } from "@/lib/content";

/**
 * Cached reads for the public pages. Every one of these is content the owner
 * edits occasionally and visitors read constantly, so it is cached across
 * requests and invalidated by tag when the admin saves.
 *
 * See lib/content.ts for why each read is wrapped in both `unstable_cache`
 * and React `cache`.
 */

export const getServices = cache(
  unstable_cache(
    () => prisma.service.findMany({ orderBy: { sortOrder: "asc" } }),
    ["services-all"],
    { tags: [TAGS.services], revalidate: CACHE_TTL_SECONDS }
  )
);

export const getServicesByCategory = cache(
  unstable_cache(
    (category: string) =>
      prisma.service.findMany({ where: { category }, orderBy: { sortOrder: "asc" } }),
    ["services-by-category"],
    { tags: [TAGS.services], revalidate: CACHE_TTL_SECONDS }
  )
);

export const getBeforeAfterProjects = cache(
  unstable_cache(
    () => prisma.beforeAfterProject.findMany({ orderBy: { sortOrder: "asc" } }),
    ["before-after-projects"],
    { tags: [TAGS.gallery], revalidate: CACHE_TTL_SECONDS }
  )
);

export const getGalleryImages = cache(
  unstable_cache(
    () => prisma.galleryImage.findMany({ orderBy: { sortOrder: "asc" } }),
    ["gallery-images"],
    { tags: [TAGS.gallery], revalidate: CACHE_TTL_SECONDS }
  )
);

export const getPublishedPosts = cache(
  unstable_cache(
    () =>
      prisma.blogPost.findMany({
        where: { publishedAt: { not: null } },
        orderBy: { publishedAt: "desc" },
      }),
    ["published-posts"],
    { tags: [TAGS.blog], revalidate: CACHE_TTL_SECONDS }
  )
);

/**
 * Blog post routes read the same row twice, once in generateMetadata and once
 * in the page body. The React `cache` wrapper collapses that into one query
 * per render, on top of the cross-request cache.
 */
export const getPostBySlug = cache(
  unstable_cache(
    (slug: string) => prisma.blogPost.findUnique({ where: { slug } }),
    ["post-by-slug"],
    { tags: [TAGS.blog], revalidate: CACHE_TTL_SECONDS }
  )
);
