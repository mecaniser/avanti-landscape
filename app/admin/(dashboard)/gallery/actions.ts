"use server";

import { revalidatePath, updateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { TAGS } from "@/lib/content";
import { uploadImageBuffer, isCloudinaryConfigured } from "@/lib/cloudinary";

export async function addGalleryImage(formData: FormData) {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Choose an image to upload.");
  }
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary isn't configured yet: set CLOUDINARY_* env vars to enable uploads.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const url = await uploadImageBuffer(buffer, "avanti/gallery");

  // Derive from the current maximum, not the row count: after a delete from the
  // middle, count would collide with an existing sortOrder and the public
  // ordering becomes nondeterministic.
  const { _max } = await prisma.galleryImage.aggregate({ _max: { sortOrder: true } });
  await prisma.galleryImage.create({
    data: {
      url,
      caption: String(formData.get("caption") || "") || null,
      category: String(formData.get("category") || "project") || null,
      sortOrder: (_max.sortOrder ?? -1) + 1,
    },
  });

  updateTag(TAGS.gallery);
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}

export async function deleteGalleryImage(id: string) {
  await prisma.galleryImage.delete({ where: { id } });
  updateTag(TAGS.gallery);
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
    throw new Error("Cloudinary isn't configured yet: add the CLOUDINARY_* keys to upload photos.");
  }

  const [beforeUrl, afterUrl] = await Promise.all([
    uploadImageBuffer(Buffer.from(await beforeFile.arrayBuffer()), "avanti/before-after"),
    uploadImageBuffer(Buffer.from(await afterFile.arrayBuffer()), "avanti/before-after"),
  ]);

  // See addGalleryImage: max + 1 so deleting a project can't make the next one
  // collide with an existing sortOrder.
  const { _max } = await prisma.beforeAfterProject.aggregate({ _max: { sortOrder: true } });
  await prisma.beforeAfterProject.create({
    data: {
      beforeUrl,
      afterUrl,
      caption: String(formData.get("caption") || "") || "Project",
      subtext: String(formData.get("subtext") || "") || null,
      sortOrder: (_max.sortOrder ?? -1) + 1,
    },
  });

  updateTag(TAGS.gallery);
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  revalidatePath("/");
}

export async function updateBeforeAfterProject(id: string, formData: FormData) {
  const caption = String(formData.get("caption") || "").trim();
  if (!caption) {
    throw new Error("A caption is required.");
  }

  const beforeFile = formData.get("before_file");
  const afterFile = formData.get("after_file");
  const newBefore = beforeFile instanceof File && beforeFile.size > 0 ? beforeFile : null;
  const newAfter = afterFile instanceof File && afterFile.size > 0 ? afterFile : null;

  // Only replacing a photo needs Cloudinary. Text stays editable without it, so
  // a caption typo is always fixable even if the keys are missing.
  if ((newBefore || newAfter) && !isCloudinaryConfigured()) {
    throw new Error("Cloudinary isn't configured yet: add the CLOUDINARY_* keys to replace photos.");
  }

  const [beforeUrl, afterUrl] = await Promise.all([
    newBefore ? uploadImageBuffer(Buffer.from(await newBefore.arrayBuffer()), "avanti/before-after") : null,
    newAfter ? uploadImageBuffer(Buffer.from(await newAfter.arrayBuffer()), "avanti/before-after") : null,
  ]);

  await prisma.beforeAfterProject.update({
    where: { id },
    data: {
      caption,
      subtext: String(formData.get("subtext") || "").trim() || null,
      // Leaving a file input empty keeps the existing photo.
      ...(beforeUrl ? { beforeUrl } : {}),
      ...(afterUrl ? { afterUrl } : {}),
    },
  });

  updateTag(TAGS.gallery);
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  revalidatePath("/");
}

export async function deleteBeforeAfterProject(id: string) {
  await prisma.beforeAfterProject.delete({ where: { id } });
  updateTag(TAGS.gallery);
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  revalidatePath("/");
}
