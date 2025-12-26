"use server";

import { cookies, headers } from "next/headers";
import { randomBytes, timingSafeEqual } from "crypto";
import { env } from "@/lib/env";

const SESSION_COOKIE_NAME = "admin_session";
const MAX_AGE = 30 * 60;

/**
 * In-memory session store
 * NOTE: This will not persist across server restarts or share state across 
 * multiple instances (e.g., on Vercel). For production, use a durable store like Redis.
 */
const validSessions = new Set<string>();

// Rate Limiting Configuration
interface RateLimitEntry {
  count: number;
  expiresAt: number;
}
const loginRateLimit = new Map<string, RateLimitEntry>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

export async function loginAction(password: string) {
  const ADMIN_PASSWORD = env.ADMIN_PASSWORD;

  if (!ADMIN_PASSWORD) {
    console.error("ADMIN_PASSWORD not configured");
    return { success: false, error: "Server configuration error" };
  }

  // Get Client IP for Rate Limiting
  const headersList = headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0] || "unknown";
  
  const now = Date.now();
  const limitEntry = loginRateLimit.get(ip);
  if (limitEntry && now < limitEntry.expiresAt && limitEntry.count >= MAX_ATTEMPTS) {
    const waitSeconds = Math.ceil((limitEntry.expiresAt - now) / 1000);
    return { 
      success: false, 
      error: `Too many failed attempts. Please try again in ${waitSeconds} seconds.` 
    };
  }

  // Constant-time comparison to prevent timing attacks
  const passwordBuffer = Buffer.from(password);
  const adminBuffer = Buffer.from(ADMIN_PASSWORD);
  const isValid = passwordBuffer.length === adminBuffer.length &&
    timingSafeEqual(passwordBuffer, adminBuffer);

  if (isValid) {
    // Reset rate limit on success
    loginRateLimit.delete(ip);

    // Generate a cryptographically random session token
    const sessionToken = randomBytes(32).toString("hex");
    validSessions.add(sessionToken);

    cookies().set(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      maxAge: MAX_AGE,
      path: "/",
      sameSite: "lax",
    });
    return { success: true };
  }

  // Increment failure count
  if (!limitEntry || now > limitEntry.expiresAt) {
    loginRateLimit.set(ip, { count: 1, expiresAt: now + WINDOW_MS });
  } else {
    limitEntry.count += 1;
  }

  return { success: false, error: "Invalid password" };
}

export async function logoutAction() {
  const cookieStore = cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  if (session?.value) {
    validSessions.delete(session.value);
  }
  cookies().delete(SESSION_COOKIE_NAME);
  return { success: true };
}

export async function isAuthenticatedAction() {
  const cookieStore = cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  
  if (!session?.value) return false;

  // Validate the token against our known valid sessions
  return validSessions.has(session.value);
}