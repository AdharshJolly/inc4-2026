import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  // Update Supabase session to keep user logged in
  const supabaseResponse = createClient(request);
  
  // Only protect /admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Exclude /admin/login from protection to avoid loop
    if (request.nextUrl.pathname === "/admin/login") {
      return supabaseResponse;
    }

    const authCookie = request.cookies.get("admin_session");

    if (!authCookie) {
      const loginUrl = new URL("/admin/login", request.url);
      // Optional: Add return URL logic here
      return NextResponse.redirect(loginUrl);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
