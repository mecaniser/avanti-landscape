import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/site";

// Pages reachable without a session (sign-in and password recovery).
const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/forgot-password", "/admin/reset-password"];

// Redirects are built from the canonical origin rather than the incoming
// request's. Behind Railway's proxy the request origin is the internal
// *.up.railway.app host, so redirecting relative to it throws the browser
// cross-origin and RSC navigations fail CORS.
function redirectTo(path: string) {
  return NextResponse.redirect(new URL(path, SITE_URL));
}

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const path = req.nextUrl.pathname;

  if (!isLoggedIn && !PUBLIC_ADMIN_PATHS.includes(path)) {
    return redirectTo("/admin/login");
  }
  // A signed-in user following a reset link should still land on the form.
  if (isLoggedIn && (path === "/admin/login" || path === "/admin/forgot-password")) {
    return redirectTo("/admin");
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
