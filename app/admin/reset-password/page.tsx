import crypto from "node:crypto";
import { prisma } from "@/lib/db";
import ResetPasswordForm from "./ResetPasswordForm";

export const dynamic = "force-dynamic";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  let valid = false;
  if (token) {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    valid = Boolean(
      await prisma.adminUser.findFirst({
        where: { resetTokenHash: tokenHash, resetTokenExpiresAt: { gt: new Date() } },
        select: { id: true },
      })
    );
  }

  return <ResetPasswordForm token={token ?? ""} valid={valid} />;
}
