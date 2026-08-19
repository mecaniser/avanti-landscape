"use server";

import crypto from "node:crypto";
import { prisma } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";
import { SITE_URL } from "@/lib/site";

export type ForgotState = { ok?: boolean; error?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function requestPasswordReset(
  _prev: ForgotState,
  formData: FormData
): Promise<ForgotState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) return { error: "Enter a valid email address." };

  const user = await prisma.adminUser.findUnique({ where: { email } });

  // Only act when the account exists, but always return the same success state
  // so this endpoint can't be used to discover which emails have accounts.
  if (user) {
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.adminUser.update({
      where: { id: user.id },
      data: { resetTokenHash: tokenHash, resetTokenExpiresAt: expiresAt },
    });

    // Built from the configured site URL, never the request Host header, so a
    // forged host can't redirect the reset link to an attacker's domain.
    const resetUrl = `${SITE_URL}/admin/reset-password?token=${rawToken}`;
    try {
      await sendPasswordResetEmail(user.email, resetUrl);
    } catch (err) {
      // Don't surface delivery failures to the requester (avoids enumeration);
      // log so a genuinely missed reset can be traced.
      console.error("Failed to send password reset email:", err);
    }
  }

  return { ok: true };
}
