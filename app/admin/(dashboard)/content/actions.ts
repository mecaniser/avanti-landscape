"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { uploadImageBuffer, isCloudinaryConfigured } from "@/lib/cloudinary";

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
