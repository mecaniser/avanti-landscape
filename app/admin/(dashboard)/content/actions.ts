"use server";

import { revalidatePath, updateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { TAGS } from "@/lib/content";
import { uploadImageBuffer, uploadVideoBuffer, isCloudinaryConfigured } from "@/lib/cloudinary";

export type ContentActionState = { ok?: boolean; error?: string; message?: string };

function revalidateHome() {
  updateTag(TAGS.content);
  revalidatePath("/admin/content/home");
  revalidatePath("/");
}

export async function uploadHeroVideo(formData: FormData) {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Choose a video file to upload.");
  }
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary isn't configured yet: add the CLOUDINARY_* keys to enable video uploads.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const url = await uploadVideoBuffer(buffer, "avanti/hero");

  await prisma.contentBlock.upsert({
    where: { page_key: { page: "home", key: "hero_video" } },
    update: { value: url, type: "text" },
    create: { page: "home", key: "hero_video", type: "text", value: url },
  });

  revalidateHome();
}

export async function clearHeroVideo() {
  await prisma.contentBlock.deleteMany({ where: { page: "home", key: "hero_video" } });
  revalidateHome();
}

export async function clearHeroImage() {
  await prisma.contentBlock.deleteMany({ where: { page: "home", key: "hero_image" } });
  revalidateHome();
}

// A row (any value) means "photo only"; no row is the default, video-if-present
// behavior. This has to be independent of hero_video itself: clearing an
// uploaded video falls back to the committed default clip, not to no video at
// all, so silencing the default requires its own flag rather than reusing
// hero_video's presence.
export async function disableHeroVideo() {
  await prisma.contentBlock.upsert({
    where: { page_key: { page: "home", key: "hero_video_disabled" } },
    update: { value: "true" },
    create: { page: "home", key: "hero_video_disabled", type: "text", value: "true" },
  });
  revalidateHome();
}

export async function enableHeroVideo() {
  await prisma.contentBlock.deleteMany({ where: { page: "home", key: "hero_video_disabled" } });
  revalidateHome();
}

export async function updateContentBlock(
  page: string,
  key: string,
  _previousState: ContentActionState,
  formData: FormData,
): Promise<ContentActionState> {
  const type = String(formData.get("type") || "text");
  let value = String(formData.get("value") || "").trim();
  if (!value) return { error: "This field cannot be empty." };

  try {
    if (type === "image") {
      const file = formData.get("file");
      if (file instanceof File && file.size > 0) {
        if (!isCloudinaryConfigured()) {
          return { error: "Cloudinary isn't configured yet, so images cannot be replaced." };
        }
        const buffer = Buffer.from(await file.arrayBuffer());
        value = await uploadImageBuffer(buffer);
      }
    }

    await prisma.contentBlock.update({
      where: { page_key: { page, key } },
      data: { value },
    });

    updateTag(TAGS.content);
    revalidatePath(`/admin/content/${page}`);
    revalidatePath("/");
    revalidatePath(`/${page === "home" ? "" : page}`);
    return { ok: true, message: "Changes saved." };
  } catch {
    return { error: "The changes could not be saved. Please try again." };
  }
}

export async function updateContentSection(
  page: string,
  keys: string[],
  _previousState: ContentActionState,
  formData: FormData,
): Promise<ContentActionState> {
  const updates = keys.map((key) => ({ key, value: String(formData.get(`value-${key}`) || "").trim() }));
  if (updates.some((update) => !update.value)) return { error: "Complete every field in this section before saving." };

  try {
    await prisma.$transaction(updates.map((update) => prisma.contentBlock.update({
      where: { page_key: { page, key: update.key } },
      data: { value: update.value },
    })));
    updateTag(TAGS.content);
    revalidatePath(`/admin/content/${page}`);
    revalidatePath("/");
    revalidatePath(`/${page === "home" ? "" : page}`);
    return { ok: true, message: "Section saved." };
  } catch {
    return { error: "The section could not be saved. Please try again." };
  }
}

export async function updateServiceAreaList(_previousState: ContentActionState, formData: FormData): Promise<ContentActionState> {
  const lines = String(formData.get("areas") || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const areas = lines.map((line) => {
    const match = line.match(/^(.+?),\s*(NC|SC|North Carolina|South Carolina)$/i);
    if (!match) return null;
    const state = match[2].toLowerCase().startsWith("n") ? "North Carolina" : "South Carolina";
    return { name: match[1].trim(), state };
  });
  if (!areas.length || areas.some((area) => !area?.name)) {
    return { error: "Add at least one service area as City, NC or City, SC." };
  }
  if (areas.some((area) => area === null)) {
    return { error: "Each service area must use City, NC or City, SC." };
  }

  try {
    await prisma.contentBlock.upsert({
      where: { page_key: { page: "global", key: "area_list" } },
      update: { value: JSON.stringify(areas), type: "text" },
      create: { page: "global", key: "area_list", value: JSON.stringify(areas), type: "text" },
    });
    updateTag(TAGS.content);
    revalidatePath("/admin/content/global");
    revalidatePath("/");
    revalidatePath("/areas");
    return { ok: true, message: "Service areas saved." };
  } catch {
    return { error: "The service areas could not be saved. Please try again." };
  }
}
