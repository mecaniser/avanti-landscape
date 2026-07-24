"use server";

import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export type ChangePwState = { ok?: boolean; error?: string };

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
