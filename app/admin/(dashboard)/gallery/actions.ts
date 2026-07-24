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
