"use server";

import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "admin_session";
// In production, this should be a secure, HTTP-only, SameSite cookie
// Max age: 30 minutes
const MAX_AGE = 30 * 60;

export async function loginAction(password: string) {
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

  if (!ADMIN_PASSWORD) {
    console.error("ADMIN_PASSWORD not configured");
    return { success: false, error: "Server configuration error" };
  }

  // Basic rate limiting could be added here if needed

  if (password === ADMIN_PASSWORD) {
    cookies().set(SESSION_COOKIE_NAME, "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: MAX_AGE,
      path: "/",
      sameSite: "lax",
    });
    return { success: true };
  }

  return { success: false, error: "Invalid password" };
}

export async function logoutAction() {
  cookies().delete(SESSION_COOKIE_NAME);
  return { success: true };
}

export async function isAuthenticatedAction() {
  const cookieStore = cookies();
  return cookieStore.has(SESSION_COOKIE_NAME);
}
