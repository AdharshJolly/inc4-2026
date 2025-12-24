/**
 * File upload utility using GitHub API
 * Uploads image files to public/images/ folders and returns the filename
 * Files are committed to GitHub, making them version-controlled and deployable
 */

import { fetchWithRetry } from "./githubSync";

export interface UploadResult {
  success: boolean;
  filename?: string;
  path?: string;
  message?: string;
  error?: string;
}

/**
 * Convert File to base64 string for GitHub API
 */
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Extract base64 part without data:image/...;base64, prefix
      const base64String = result.split(",")[1];
      resolve(base64String);
    };
    reader.onerror = reject;
  });
}

/**
 * Generate unique filename to avoid collisions
 */
function generateFilename(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  const extension = originalName.split(".").pop();
  return `${timestamp}-${random}.${extension}`;
}

/**
 * Validate image file
 */
function validateImageFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "File must be JPEG, PNG, GIF, or WebP" };
  }

  if (file.size > maxSize) {
    return { valid: false, error: "File must be smaller than 5MB" };
  }

  return { valid: true };
}

/**
 * Upload image to GitHub public folder
 * @param file - Image file to upload
 * @param folder - Subfolder in public/images/ (e.g., "committee", "speakers")
 * @returns UploadResult with filename or error
 */
export async function uploadImageToGitHub(
  file: File,
  folder: "committee" | "speakers"
): Promise<UploadResult> {
  try {
    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Generate unique filename
    const filename = generateFilename(file.name);
    const filePath = `public/images/${folder}/${filename}`;

    // Convert to base64
    const base64Content = await fileToBase64(file);

    // Get GitHub config from environment
    const token = import.meta.env.VITE_TINA_TOKEN;
    const owner = "AdharshJolly";
    const repo = "inc4-2026";
    // Use development branch for now (can be updated to detect production later)
    const branch = "development";

    if (!token) {
      return {
        success: false,
        error: "GitHub token not configured",
      };
    }

    // Upload to GitHub using API
    const response = await fetchWithRetry(
      `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
      {
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
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error:
          errorData.message || `GitHub upload failed: ${response.statusText}`,
      };
    }

    return {
      success: true,
      filename: filename,
      path: `/images/${folder}/${filename}`,
      message: `Successfully uploaded ${filename}`,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Unknown error during upload",
    };
  }
}

/**
 * Get image URL from filename
 */
export function getImageUrl(
  filename: string | undefined,
  folder: "committee" | "speakers"
): string {
  if (!filename) return "";
  return `/images/${folder}/${filename}`;
}
