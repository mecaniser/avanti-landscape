"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { TAGS } from "@/lib/content";
import { uploadImageBuffer, isCloudinaryConfigured } from "@/lib/cloudinary";
import { isServiceCategorySlug } from "@/lib/services";

function primaryServiceSlug(formData: FormData) {
  const value = String(formData.get("primaryServiceSlug") || "").trim();
  if (!value) return null;
  if (!isServiceCategorySlug(value)) {
    throw new Error("Choose a valid related service.");
  }
  return value;
}

function refresh(slug?: string) {
  // Tag invalidation clears the cached query in lib/queries.ts; the path
  // calls below clear the rendered route.
  updateTag(TAGS.blog);
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  if (slug) revalidatePath(`/blog/${slug}`);
}

async function resolveCoverImage(formData: FormData, existing?: string | null) {
  const file = formData.get("coverImageFile");
  if (file instanceof File && file.size > 0) {
    if (!isCloudinaryConfigured()) {
      throw new Error("Cloudinary isn't configured yet: set CLOUDINARY_* env vars to enable uploads.");
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    return uploadImageBuffer(buffer, "avanti/blog");
  }
  return existing ?? null;
}

export async function createBlogPost(formData: FormData) {
  const slug = String(formData.get("slug") || "").trim();
  const publish = formData.get("publish") === "on";
  const coverImage = await resolveCoverImage(formData);

  await prisma.blogPost.create({
    data: {
      slug,
      title: String(formData.get("title") || ""),
      excerpt: String(formData.get("excerpt") || "") || null,
      tag: String(formData.get("tag") || "") || null,
      primaryServiceSlug: primaryServiceSlug(formData),
      body: String(formData.get("body") || ""),
      coverImage,
      publishedAt: publish ? new Date() : null,
    },
  });

  refresh(slug);
  redirect("/admin/blog");
}

export async function updateBlogPost(id: string, formData: FormData) {
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  const publish = formData.get("publish") === "on";
  const coverImage = await resolveCoverImage(formData, existing?.coverImage);

  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      title: String(formData.get("title") || ""),
      excerpt: String(formData.get("excerpt") || "") || null,
      tag: String(formData.get("tag") || "") || null,
      primaryServiceSlug: primaryServiceSlug(formData),
      body: String(formData.get("body") || ""),
      coverImage,
      publishedAt: publish ? existing?.publishedAt ?? new Date() : null,
    },
  });

  refresh(post.slug);
  redirect("/admin/blog");
}

export async function deleteBlogPost(id: string) {
  const post = await prisma.blogPost.delete({ where: { id } });
  refresh(post.slug);
  redirect("/admin/blog");
}
