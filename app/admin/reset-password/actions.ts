"use server";

import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export type ResetState = { ok?: boolean; error?: string };

export async function resetPassword(
  _prev: ResetState,
  formData: FormData
): Promise<ResetState> {
  const token = String(formData.get("token") || "");
  const next = String(formData.get("next") || "");
  const confirm = String(formData.get("confirm") || "");

  if (!token) return { error: "This reset link is invalid. Please request a new one." };
  if (next.length < 8) return { error: "New password must be at least 8 characters." };
  if (next !== confirm) return { error: "The passwords don't match." };

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const user = await prisma.adminUser.findFirst({
    where: { resetTokenHash: tokenHash, resetTokenExpiresAt: { gt: new Date() } },
  });
  if (!user) return { error: "This reset link is invalid or has expired. Please request a new one." };

  const passwordHash = await bcrypt.hash(next, 10);
  await prisma.adminUser.update({
    where: { id: user.id },
    // Clear the token so the link can't be reused.
    data: { passwordHash, resetTokenHash: null, resetTokenExpiresAt: null },
  });

  return { ok: true };
}
