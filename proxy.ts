import { auth } from "@/auth";
import { NextResponse } from "next/server";

// Pages reachable without a session (sign-in and password recovery).
const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/forgot-password", "/admin/reset-password"];

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const path = req.nextUrl.pathname;

  if (!isLoggedIn && !PUBLIC_ADMIN_PATHS.includes(path)) {
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
  }
  // A signed-in user following a reset link should still land on the form.
  if (isLoggedIn && (path === "/admin/login" || path === "/admin/forgot-password")) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl));
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
