"use server";

import { env } from "@/lib/env";
import { logError } from "@/lib/errorLogger";

export interface UploadResult {
// ...
export async function uploadImageToGitHubAction(
  base64Content: string,
  filename: string,
  folder: "committee" | "speakers"
): Promise<UploadResult> {
  try {
    const filePath = `public/images/${folder}/${filename}`;
    const token = env.NEXT_GITHUB_TOKEN;
    const owner = "AdharshJolly";
    const repo = "inc4-2026";
    const branch = env.NEXT_GITHUB_BRANCH;

    if (!token) {
      return { success: false, error: "GitHub token not configured." };
    }
// ...
