import { z } from "zod";

/**
 * Schema for Server-side Environment Variables
 * These should NEVER be exposed to the client
 */
const serverSchema = z.object({
  ADMIN_PASSWORD: z.string().min(1, "ADMIN_PASSWORD is required for authentication"),
  NEXT_GITHUB_TOKEN: z.string().min(1, "NEXT_GITHUB_TOKEN is required for admin features if provided").optional(),
  NEXT_GITHUB_BRANCH: z.string().default("development"),
  NEXT_ERROR_LOG_ENDPOINT: z.string().url().optional(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

/**
 * Schema for Public Environment Variables (prefixed with NEXT_PUBLIC_)
 * These are safe to expose to the client
 */
const clientSchema = z.object({
  // Add public variables here if any
  // NEXT_PUBLIC_EXAMPLE: z.string(),
});

const processEnv = {
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  NEXT_GITHUB_TOKEN: process.env.NEXT_GITHUB_TOKEN,
  NEXT_GITHUB_BRANCH: process.env.NEXT_GITHUB_BRANCH,
  NEXT_ERROR_LOG_ENDPOINT: process.env.NEXT_ERROR_LOG_ENDPOINT,
  NODE_ENV: process.env.NODE_ENV,
};

// Validate Server Env
const parsedServer = serverSchema.safeParse(processEnv);

if (!parsedServer.success) {
  console.error(
    "❌ Invalid environment variables:",
    JSON.stringify(parsedServer.error.format(), null, 4)
  );
  throw new Error(
    "Invalid environment variables. Please check your .env file and ensure all required variables are set correctly."
  );
}

export const env = parsedServer.data;
