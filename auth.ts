import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { encode as defaultEncode } from "next-auth/jwt";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

// "Remember me" controls how long a session survives. The session cookie's own
// lifetime is fixed by Auth.js at the global session.maxAge, so instead we vary
// the JWT's expiry: an unchecked login gets a short-lived token that the server
// stops honouring after REMEMBER_OFF_MAX_AGE even though the cookie lingers.
const REMEMBER_ON_MAX_AGE = 30 * 24 * 60 * 60; // 30 days
const REMEMBER_OFF_MAX_AGE = 12 * 60 * 60; // 12 hours

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
        remember: { label: "Remember me", type: "checkbox" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;
        const remember = credentials?.remember === "true";

        // Checked before the DB so break-glass access works even when the
        // AdminUser table is empty or the database is down.
        const master = masterAdmin(email, password);
        if (master) return { ...master, remember };

        const user = await prisma.adminUser.findUnique({ where: { email } });
        if (!user) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return { id: user.id, email: user.email, remember };
      },
    }),
  ],
  pages: { signIn: "/admin/login" },
  session: { strategy: "jwt", maxAge: REMEMBER_ON_MAX_AGE },
  jwt: {
    // Choose the token's lifetime from the remember flag carried on the token.
    // Auth.js passes the global maxAge here; we override it per session.
    encode: (params) => {
      const remember = (params.token as { remember?: boolean } | undefined)?.remember;
      return defaultEncode({
        ...params,
        maxAge: remember ? REMEMBER_ON_MAX_AGE : REMEMBER_OFF_MAX_AGE,
      });
    },
  },
  callbacks: {
    // Persist the remember flag from authorize() onto the token so encode() can
    // read it on this sign-in and on every later rolling refresh.
    jwt: ({ token, user }) => {
      if (user) token.remember = (user as { remember?: boolean }).remember ?? false;
      return token;
    },
  },
  trustHost: true,
});
