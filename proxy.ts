import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnLogin = req.nextUrl.pathname === "/admin/login";

  if (!isLoggedIn && !isOnLogin) {
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
  }
  if (isLoggedIn && isOnLogin) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl));
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
