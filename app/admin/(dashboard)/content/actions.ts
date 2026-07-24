"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { uploadImageBuffer, uploadVideoBuffer, isCloudinaryConfigured } from "@/lib/cloudinary";

function revalidateHome() {
  revalidatePath("/admin/content/home");
  revalidatePath("/");
}

export async function uploadHeroVideo(formData: FormData) {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Choose a video file to upload.");
  }
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary isn't configured yet — add the CLOUDINARY_* keys to enable video uploads.");
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

export async function updateBeforeAfter(formData: FormData) {
  const captionTitle = String(formData.get("caption_title") || "");
  const captionSub = String(formData.get("caption_sub") || "");
  const beforeFile = formData.get("before_file");
  const afterFile = formData.get("after_file");

  const wantsUpload =
    (beforeFile instanceof File && beforeFile.size > 0) ||
    (afterFile instanceof File && afterFile.size > 0);
  if (wantsUpload && !isCloudinaryConfigured()) {
    throw new Error("Cloudinary isn't configured yet — add the CLOUDINARY_* keys to upload photos.");
  }

  // Text always saves.
  await prisma.contentBlock.update({
    where: { page_key: { page: "gallery", key: "ba_caption_title" } },
    data: { value: captionTitle },
  });
  await prisma.contentBlock.update({
    where: { page_key: { page: "gallery", key: "ba_caption_sub" } },
    data: { value: captionSub },
  });

  // Images only save when a new file is chosen.
  if (beforeFile instanceof File && beforeFile.size > 0) {
    const url = await uploadImageBuffer(Buffer.from(await beforeFile.arrayBuffer()), "avanti/gallery");
    await prisma.contentBlock.update({
      where: { page_key: { page: "gallery", key: "ba_before_image" } },
      data: { value: url },
    });
  }
  if (afterFile instanceof File && afterFile.size > 0) {
    const url = await uploadImageBuffer(Buffer.from(await afterFile.arrayBuffer()), "avanti/gallery");
    await prisma.contentBlock.update({
      where: { page_key: { page: "gallery", key: "ba_after_image" } },
      data: { value: url },
    });
  }

  revalidatePath("/admin/content/gallery");
  revalidatePath("/gallery");
}

export async function updateContentBlock(page: string, key: string, formData: FormData) {
  const type = String(formData.get("type") || "text");
  let value = String(formData.get("value") || "");

  if (type === "image") {
    const file = formData.get("file");
    if (file instanceof File && file.size > 0) {
      if (!isCloudinaryConfigured()) {
        throw new Error("Cloudinary isn't configured yet — set CLOUDINARY_* env vars to enable uploads.");
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      value = await uploadImageBuffer(buffer);
    }
  }

  await prisma.contentBlock.update({
    where: { page_key: { page, key } },
    data: { value },
  });

  revalidatePath(`/admin/content/${page}`);
  revalidatePath("/");
  revalidatePath(`/${page === "home" ? "" : page}`);
}
