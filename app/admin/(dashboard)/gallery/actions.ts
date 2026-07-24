"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { uploadImageBuffer, isCloudinaryConfigured } from "@/lib/cloudinary";

export async function addGalleryImage(formData: FormData) {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Choose an image to upload.");
  }
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary isn't configured yet — set CLOUDINARY_* env vars to enable uploads.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const url = await uploadImageBuffer(buffer, "avanti/gallery");

  const count = await prisma.galleryImage.count();
  await prisma.galleryImage.create({
    data: {
      url,
      caption: String(formData.get("caption") || "") || null,
      category: String(formData.get("category") || "project") || null,
      sortOrder: count,
    },
  });

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}

export async function deleteGalleryImage(id: string) {
  await prisma.galleryImage.delete({ where: { id } });
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}

export async function addBeforeAfterProject(formData: FormData) {
  const beforeFile = formData.get("before_file");
  const afterFile = formData.get("after_file");
  if (
    !(beforeFile instanceof File) || beforeFile.size === 0 ||
    !(afterFile instanceof File) || afterFile.size === 0
  ) {
    throw new Error("Choose both a before and an after photo.");
  }
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary isn't configured yet — add the CLOUDINARY_* keys to upload photos.");
  }

  const [beforeUrl, afterUrl] = await Promise.all([
    uploadImageBuffer(Buffer.from(await beforeFile.arrayBuffer()), "avanti/before-after"),
    uploadImageBuffer(Buffer.from(await afterFile.arrayBuffer()), "avanti/before-after"),
  ]);

  const count = await prisma.beforeAfterProject.count();
  await prisma.beforeAfterProject.create({
    data: {
      beforeUrl,
      afterUrl,
      caption: String(formData.get("caption") || "") || "Project",
      subtext: String(formData.get("subtext") || "") || null,
      sortOrder: count,
    },
  });

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  revalidatePath("/");
}

export async function deleteBeforeAfterProject(id: string) {
  await prisma.beforeAfterProject.delete({ where: { id } });
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  revalidatePath("/");
}
