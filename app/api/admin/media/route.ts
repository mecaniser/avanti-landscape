import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { TAGS } from "@/lib/content";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { isCloudinaryConfigured, uploadImageBuffer, uploadVideoBuffer } from "@/lib/cloudinary";

export const runtime = "nodejs";

const MAX_IMAGE_BYTES = 15 * 1024 * 1024;
const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

class UploadError extends Error {}

function getRequiredText(formData: FormData, name: string) {
  const value = String(formData.get(name) ?? "").trim();
  if (!value) throw new UploadError(`Missing ${name.replace(/_/g, " ")}.`);
  return value;
}

function getOptionalText(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim() || null;
}

function getFile(formData: FormData, name: string, required: boolean, kind: "image" | "video") {
  const value = formData.get(name);
  if (!(value instanceof File) || value.size === 0) {
    if (required) throw new UploadError(`Choose ${kind === "image" ? "an image" : "a video"} first.`);
    return null;
  }
  if (!value.type.startsWith(`${kind}/`)) {
    throw new UploadError(`Choose a valid ${kind} file.`);
  }
  const limit = kind === "image" ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES;
  if (value.size > limit) {
    throw new UploadError(`${kind === "image" ? "Images" : "Videos"} must be ${limit / 1024 / 1024} MB or smaller.`);
  }
  return value;
}

async function storeImage(file: File, folder: string) {
  return uploadImageBuffer(Buffer.from(await file.arrayBuffer()), folder);
}

function requireCloudinary() {
  if (!isCloudinaryConfigured()) {
    throw new UploadError("Cloudinary is not configured yet. Add the CLOUDINARY_* keys and try again.");
  }
}

function refreshGallery() {
  revalidateTag(TAGS.gallery, "max");
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  revalidatePath("/");
}

async function addGalleryImage(formData: FormData) {
  requireCloudinary();
  const file = getFile(formData, "file", true, "image")!;
  const url = await storeImage(file, "avanti/gallery");
  const { _max } = await prisma.galleryImage.aggregate({ _max: { sortOrder: true } });
  await prisma.galleryImage.create({
    data: {
      url,
      caption: getOptionalText(formData, "caption"),
      category: getOptionalText(formData, "category") ?? "project",
      sortOrder: (_max.sortOrder ?? -1) + 1,
    },
  });
  refreshGallery();
}

async function addBeforeAfterProject(formData: FormData) {
  requireCloudinary();
  const before = getFile(formData, "before_file", true, "image")!;
  const after = getFile(formData, "after_file", true, "image")!;
  const [beforeUrl, afterUrl] = await Promise.all([
    storeImage(before, "avanti/before-after"),
    storeImage(after, "avanti/before-after"),
  ]);
  const { _max } = await prisma.beforeAfterProject.aggregate({ _max: { sortOrder: true } });
  await prisma.beforeAfterProject.create({
    data: {
      beforeUrl,
      afterUrl,
      caption: getRequiredText(formData, "caption"),
      subtext: getOptionalText(formData, "subtext"),
      sortOrder: (_max.sortOrder ?? -1) + 1,
    },
  });
  refreshGallery();
}

async function updateBeforeAfterProject(formData: FormData) {
  const id = getRequiredText(formData, "id");
  const before = getFile(formData, "before_file", false, "image");
  const after = getFile(formData, "after_file", false, "image");
  if ((before || after) && !isCloudinaryConfigured()) requireCloudinary();
  const [beforeUrl, afterUrl] = await Promise.all([
    before ? storeImage(before, "avanti/before-after") : null,
    after ? storeImage(after, "avanti/before-after") : null,
  ]);
  await prisma.beforeAfterProject.update({
    where: { id },
    data: {
      caption: getRequiredText(formData, "caption"),
      subtext: getOptionalText(formData, "subtext"),
      ...(beforeUrl ? { beforeUrl } : {}),
      ...(afterUrl ? { afterUrl } : {}),
    },
  });
  refreshGallery();
}

async function updateGalleryImage(formData: FormData) {
  const id = getRequiredText(formData, "id");
  const existing = await prisma.galleryImage.findUnique({ where: { id } });
  if (!existing) throw new UploadError("That gallery photo no longer exists.");

  const file = getFile(formData, "file", false, "image");
  if (file && !isCloudinaryConfigured()) requireCloudinary();
  const url = file ? await storeImage(file, "avanti/gallery") : null;

  await prisma.galleryImage.update({
    where: { id },
    data: {
      caption: getOptionalText(formData, "caption"),
      ...(url ? { url } : {}),
    },
  });
  refreshGallery();
}

async function updateContentImage(formData: FormData) {
  requireCloudinary();
  const page = getRequiredText(formData, "page");
  const key = getRequiredText(formData, "key");
  const file = getFile(formData, "file", true, "image")!;
  const block = await prisma.contentBlock.findUnique({ where: { page_key: { page, key } } });
  if (!block || block.type !== "image") throw new UploadError("That image field no longer exists.");
  const url = await storeImage(file, "avanti/content");
  await prisma.contentBlock.update({ where: { id: block.id }, data: { value: url } });
  revalidateTag(TAGS.content, "max");
  revalidatePath(`/admin/content/${page}`);
  revalidatePath("/");
  revalidatePath(page === "home" ? "/" : `/${page}`);
}

async function uploadHeroVideo(formData: FormData) {
  requireCloudinary();
  const file = getFile(formData, "file", true, "video")!;
  const url = await uploadVideoBuffer(Buffer.from(await file.arrayBuffer()), "avanti/hero");
  await prisma.contentBlock.upsert({
    where: { page_key: { page: "home", key: "hero_video" } },
    update: { value: url, type: "text" },
    create: { page: "home", key: "hero_video", type: "text", value: url },
  });
  revalidateTag(TAGS.content, "max");
  revalidatePath("/admin/content/home");
  revalidatePath("/");
}

async function createBlogPost(formData: FormData) {
  const slug = getRequiredText(formData, "slug");
  const cover = getFile(formData, "coverImageFile", false, "image");
  if (cover) requireCloudinary();
  const coverImage = cover ? await storeImage(cover, "avanti/blog") : null;
  await prisma.blogPost.create({
    data: {
      slug,
      title: getRequiredText(formData, "title"),
      excerpt: getOptionalText(formData, "excerpt"),
      tag: getOptionalText(formData, "tag"),
      body: getRequiredText(formData, "body"),
      coverImage,
      publishedAt: formData.get("publish") === "on" ? new Date() : null,
    },
  });
  revalidateTag(TAGS.blog, "max");
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return "/admin/blog";
}

async function updateBlogPost(formData: FormData) {
  const id = getRequiredText(formData, "id");
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) throw new UploadError("That blog post no longer exists.");
  const cover = getFile(formData, "coverImageFile", false, "image");
  if (cover) requireCloudinary();
  const coverImage = cover ? await storeImage(cover, "avanti/blog") : existing.coverImage;
  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      title: getRequiredText(formData, "title"),
      excerpt: getOptionalText(formData, "excerpt"),
      tag: getOptionalText(formData, "tag"),
      body: getRequiredText(formData, "body"),
      coverImage,
      publishedAt: formData.get("publish") === "on" ? existing.publishedAt ?? new Date() : null,
    },
  });
  revalidateTag(TAGS.blog, "max");
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  return "/admin/blog";
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Your session has expired. Sign in and try again." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const operation = getRequiredText(formData, "operation");
    let redirectTo: string | undefined;

    switch (operation) {
      case "gallery-image": await addGalleryImage(formData); break;
      case "gallery-image-update": await updateGalleryImage(formData); break;
      case "before-after-create": await addBeforeAfterProject(formData); break;
      case "before-after-update": await updateBeforeAfterProject(formData); break;
      case "content-image": await updateContentImage(formData); break;
      case "hero-video": await uploadHeroVideo(formData); break;
      case "blog-create": redirectTo = await createBlogPost(formData); break;
      case "blog-update": redirectTo = await updateBlogPost(formData); break;
      default: throw new UploadError("That upload action is not supported.");
    }

    return NextResponse.json({ ok: true, redirectTo });
  } catch (error) {
    const message = error instanceof UploadError
      ? error.message
      : "The upload could not be completed. Please try again.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
