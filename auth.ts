import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

// Break-glass admin: a credential that lives only in the environment, so the
// agency can always reach the portal even if the client's account is deleted,
// locked, or the AdminUser table is unreachable. It is a distinct identity —
// not a bypass of the password check — so its use is attributable in logs and a
// leak still can't authenticate as any other email. Both vars must be set for
// it to be active; MASTER_ADMIN_PASSWORD_HASH is a bcrypt hash, never a plaintext
// password.
function masterAdmin(email: string, password: string) {
  const masterEmail = process.env.MASTER_ADMIN_EMAIL?.trim().toLowerCase();
  const masterHash = process.env.MASTER_ADMIN_PASSWORD_HASH;
  if (!masterEmail || !masterHash) return null;
  if (email.trim().toLowerCase() !== masterEmail) return null;
  if (!bcrypt.compareSync(password, masterHash)) return null;
  return { id: `master:${masterEmail}`, email: masterEmail };
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        // Checked before the DB so break-glass access works even when the
        // AdminUser table is empty or the database is down.
        const master = masterAdmin(email, password);
        if (master) return master;

        const user = await prisma.adminUser.findUnique({ where: { email } });
        if (!user) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return { id: user.id, email: user.email };
      },
    }),
  ],
  pages: { signIn: "/admin/login" },
  session: { strategy: "jwt" },
  trustHost: true,
});
