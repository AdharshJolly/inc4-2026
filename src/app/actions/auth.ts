"use server";

import { cookies, headers } from "next/headers";

import { env } from "@/lib/env";

const SESSION_COOKIE_NAME = "admin_session";
// In production, this should be a secure, HTTP-only, SameSite cookie
// Max age: 30 minutes
const MAX_AGE = 30 * 60;

// Rate Limiting Configuration
// NOTE: This in-memory store works for a single server instance.
// For multi-instance/serverless deployments (like Vercel), use Redis (e.g., @upstash/ratelimit)
// to share state across instances.
interface RateLimitEntry {
  count: number;
  expiresAt: number;
}

const loginRateLimit = new Map<string, RateLimitEntry>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export async function loginAction(password: string) {
  const ADMIN_PASSWORD = env.ADMIN_PASSWORD;

  if (!ADMIN_PASSWORD) {
    console.error("ADMIN_PASSWORD not configured");
    return { success: false, error: "Server configuration error" };
  }

  // Get Client IP
  const headersList = headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0] || "unknown";
  
  // Clean up expired entries (basic/lazy cleanup)
  const now = Date.now();
  if (loginRateLimit.has(ip)) {
    const entry = loginRateLimit.get(ip)!;
    if (now > entry.expiresAt) {
      loginRateLimit.delete(ip);
    }
  }

  // Check Rate Limit
  const entry = loginRateLimit.get(ip);
  if (entry && entry.count >= MAX_ATTEMPTS) {
    const waitSeconds = Math.ceil((entry.expiresAt - now) / 1000);
    return { 
      success: false, 
      error: `Too many failed attempts. Please try again in ${waitSeconds} seconds.` 
    };
  }

  if (password === ADMIN_PASSWORD) {
    // Reset rate limit on success
    loginRateLimit.delete(ip);

    cookies().set(SESSION_COOKIE_NAME, "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: MAX_AGE,
      path: "/",
      sameSite: "lax",
    });
    return { success: true };
  }

  // Increment failure count
  if (!entry) {
    loginRateLimit.set(ip, { count: 1, expiresAt: now + WINDOW_MS });
  } else {
    // Increment count but keep original expiration window
    entry.count += 1;
  }

  return { success: false, error: "Invalid password" };
}

export async function logoutAction() {
  cookies().delete(SESSION_COOKIE_NAME);
  return { success: true };
}

export async function isAuthenticatedAction() {
  const cookieStore = cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  return session?.value === "authenticated";
}
