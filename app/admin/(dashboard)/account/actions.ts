"use server";

import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { revalidatePath, updateTag } from "next/cache";
import { TAGS } from "@/lib/content";
import { formatUsPhone, isValidUsPhone, phoneDigits } from "@/lib/phone";

export type ChangePwState = { ok?: boolean; error?: string };
export type BusinessSettingsState = { ok?: boolean; error?: string };

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Your session has expired. Please sign in again.");
}

function isValidOptionalUrl(value: string) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function refreshPublicBusinessDetails() {
  updateTag(TAGS.content);
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/gallery");
  revalidatePath("/about");
  revalidatePath("/areas");
  revalidatePath("/services");
}

export async function changePassword(
  _prev: ChangePwState,
  formData: FormData
): Promise<ChangePwState> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return { error: "Your session has expired. Please sign in again." };

  const current = String(formData.get("current") || "");
  const next = String(formData.get("next") || "");
  const confirm = String(formData.get("confirm") || "");

  if (!current || !next || !confirm) return { error: "Please fill in all fields." };
  if (next.length < 8) return { error: "New password must be at least 8 characters." };
  if (next === current) return { error: "New password must be different from your current one." };
  if (next !== confirm) return { error: "The new passwords don't match." };

  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user) return { error: "Account not found." };

  const valid = await bcrypt.compare(current, user.passwordHash);
  if (!valid) return { error: "Your current password is incorrect." };

  const passwordHash = await bcrypt.hash(next, 10);
  await prisma.adminUser.update({ where: { email }, data: { passwordHash } });

  return { ok: true };
}

export async function updateBusinessSettings(
  _prev: BusinessSettingsState,
  formData: FormData
): Promise<BusinessSettingsState> {
  try {
    await requireAdmin();
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Your session has expired. Please sign in again." };
  }

  const phone = String(formData.get("phone") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const hours = String(formData.get("hours") || "").trim();
  const facebookUrl = String(formData.get("facebookUrl") || "").trim();
  const instagramUrl = String(formData.get("instagramUrl") || "").trim();

  if (!isValidUsPhone(phone)) return { error: "Enter a valid 10-digit public phone number." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Enter a valid public email address." };
  if (!hours || hours.length > 120) return { error: "Enter operating hours in 120 characters or fewer." };
  if (!isValidOptionalUrl(facebookUrl) || !isValidOptionalUrl(instagramUrl)) {
    return { error: "Social links must be complete http:// or https:// URLs." };
  }

  const entries = [
    ["phone", formatUsPhone(phone)],
    ["phone_tel", phoneDigits(phone)],
    ["email", email],
    ["hours", hours],
    ["facebook_url", facebookUrl],
    ["instagram_url", instagramUrl],
  ] as const;

  await prisma.$transaction(entries.map(([key, value]) => prisma.contentBlock.upsert({
    where: { page_key: { page: "global", key } },
    update: { value, type: "text" },
    create: { page: "global", key, value, type: "text" },
  })));
  refreshPublicBusinessDetails();

  return { ok: true };
}
