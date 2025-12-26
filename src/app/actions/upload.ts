"use server";

import { env } from "@/lib/env";
import { logError } from "@/lib/errorLogger";

export interface UploadResult {
  success: boolean;
  filename?: string;
  path?: string;
  message?: string;
  error?: string;
}

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries: number = 3
): Promise<Response> {
  let lastError: Error | null = null;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      if (response.status === 429) {
        const retryAfter = response.headers.get("retry-after");
        const waitTime = (parseInt(retryAfter || "60") + 1) * 1000;
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        continue;
      }
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt - 1) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError || new Error("GitHub API request failed after retries");
}

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

    const uploadUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

    const response = await fetchWithRetry(uploadUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify({
        message: `Upload image: ${filename}`,
        content: base64Content,
        branch: branch,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || `GitHub upload failed: ${response.statusText}`,
      };
    }

    return {
      success: true,
      filename: filename,
      path: `/images/${folder}/${filename}`,
      message: `Successfully uploaded ${filename}`,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error during upload";
    console.error("Upload action failed:", errorMsg);
    return { success: false, error: errorMsg };
  }
}