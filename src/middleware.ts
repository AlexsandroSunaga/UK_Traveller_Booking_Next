import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { LEGACY_REDIRECTS, TRANSFER_ALIASES } from "@/lib/redirects";

const COOKIE_NAME = "admin_session";

async function verifyToken(token: string) {
  const secret = process.env.JWT_SECRET;
  if (!secret) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.endsWith(".html")) {
    const clean = pathname.replace(/\.html$/i, "") || "/";
    return NextResponse.redirect(new URL(clean, request.url), 301);
  }

  const normalized = pathname.replace(/^\/+|\/+$/g, "").toLowerCase();
  const legacyTarget = LEGACY_REDIRECTS[normalized];
  if (legacyTarget) {
    return NextResponse.redirect(new URL(`/${legacyTarget}`, request.url), 301);
  }

  if (pathname.startsWith("/transfers/")) {
    const slug = pathname.slice("/transfers/".length).replace(/\/$/, "").toLowerCase();
    const canonical = TRANSFER_ALIASES[slug];
    if (canonical) {
      return NextResponse.redirect(new URL(`/transfers/${canonical}`, request.url), 301);
    }
  }

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token || !(await verifyToken(token))) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  if (pathname === "/admin/login") {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (token && (await verifyToken(token))) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/:path*.html", "/transfers/:slug", "/locations/:path*"],
};
