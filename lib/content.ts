import { prisma } from "@/lib/db";

export async function getContent(page: string) {
  const blocks = await prisma.contentBlock.findMany({ where: { page } });
  const map: Record<string, string> = {};
  for (const b of blocks) map[b.key] = b.value;
  return map;
}

export async function getGlobalContent() {
  return getContent("global");
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
