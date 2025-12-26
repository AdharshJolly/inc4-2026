import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Only protect /admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Exclude /admin/login from protection to avoid loop
    if (request.nextUrl.pathname === "/admin/login") {
      return NextResponse.next();
    }

    const authCookie = request.cookies.get("admin_session");

    if (!authCookie) {
      const loginUrl = new URL("/admin/login", request.url);
      // Optional: Add return URL logic here
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
