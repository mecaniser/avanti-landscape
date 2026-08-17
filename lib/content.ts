import { cache } from "react";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";

/**
 * Cache tags. Admin mutations call revalidateTag with these, so an edit is
 * visible immediately rather than waiting for a TTL.
 */
export const TAGS = {
  content: "content",
  services: "services",
  gallery: "gallery",
  blog: "blog",
} as const;

/**
 * One hour TTL as a safety net. Admin edits invalidate by tag immediately, so
 * this is not the path the owner ever waits on. It exists so that a write made
 * *outside* the app, a seed, a migration, or a one-off script, surfaces on its
 * own instead of being served stale indefinitely, which is what `unstable_cache`
 * does by default.
 */
export const CACHE_TTL_SECONDS = 3600;

/**
 * Two layers of caching, which do different jobs:
 *
 * - `unstable_cache` persists across requests, so page renders stop hitting
 *   Postgres on every visit and crawl.
 * - React `cache` dedupes within a single render. getGlobalContent runs in
 *   both SiteHeader and SiteFooter on every page, so without this each page
 *   would still make two identical calls.
 */
const loadContent = cache(
  unstable_cache(
    async (page: string) => {
      const blocks = await prisma.contentBlock.findMany({ where: { page } });
      const map: Record<string, string> = {};
      for (const b of blocks) map[b.key] = b.value;
      return map;
    },
    ["content-blocks"],
    { tags: [TAGS.content], revalidate: CACHE_TTL_SECONDS }
  )
);

export async function getContent(page: string) {
  return loadContent(page);
}

export async function getGlobalContent() {
  return loadContent("global");
}

export type AreaEntry = { name: string; state: string };

export function parseAreaList(json: string | undefined): AreaEntry[] {
  if (!json) return [];
  try {
    return JSON.parse(json) as AreaEntry[];
  } catch {
    return [];
  }
}
