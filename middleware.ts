import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "vl_session";
const PROTECTED_PREFIXES = ["/home", "/evening", "/settings", "/profile", "/history"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const hasSession = request.cookies.has(SESSION_COOKIE);
  if (!hasSession) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/home/:path*",
    "/evening/:path*",
    "/settings/:path*",
    "/profile/:path*",
    "/history/:path*",
  ],
};
