/**
 * File upload utility using GitHub API
 * Uploads image files to public/images/ folders and returns the filename
 * Files are committed to GitHub, making them version-controlled and deployable
 */

import { fetchWithRetry } from "./githubSync";
import { logError, addBreadcrumb } from "./errorLogger";

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
      const result = reader.result;
      // Validate result is not null and is a string
      if (!result || typeof result !== "string") {
        reject(new Error("Failed to read file: invalid result"));
        return;
      }
      // Extract base64 part without data:image/...;base64, prefix
      const base64String = result.split(",")[1];
      if (!base64String) {
        reject(new Error("Failed to extract base64 from file"));
        return;
      }
      resolve(base64String);
    };
    reader.onerror = () => {
      reject(
        new Error(
          `File read error: ${reader.error?.message || "Unknown error"}`
        )
      );
    };
    // Start reading the file
    reader.readAsDataURL(file);
  });
}

/**
 * Generate unique filename to avoid collisions
 * Derives extension from filename if available, otherwise from MIME type
 */
function generateFilename(originalName: string, mimeType?: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);

  // Try to extract extension from filename
  let extension = "";
  const lastDotIndex = originalName.lastIndexOf(".");

  if (lastDotIndex > 0 && lastDotIndex < originalName.length - 1) {
    // Extension exists and is not empty
    extension = originalName.substring(lastDotIndex + 1).toLowerCase();
  } else if (mimeType) {
    // Fall back to MIME type mapping
    const mimeToExt: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/gif": "gif",
      "image/webp": "webp",
    };
    extension = mimeToExt[mimeType] || "bin";
  } else {
    // Default fallback
    extension = "bin";
  }

  // Sanitize extension: remove path separators and ensure it's a valid identifier
  extension = extension.replace(/[\/\\]/g, "").replace(/^\.+/, "");

  // Ensure extension is not empty after sanitization
  if (!extension) {
    extension = "bin";
  }

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

    // Generate unique filename with proper extension handling
    const filename = generateFilename(file.name, file.type);
    const filePath = `public/images/${folder}/${filename}`;

    // Convert to base64
    const base64Content = await fileToBase64(file);

    // Get GitHub config from environment
    const token = process.env.NEXT_GITHUB_TOKEN;
    const owner = "AdharshJolly";
    const repo = "inc4-2026";
    // Use development branch for now (can be updated to detect production later)
    const branch = process.env.NEXT_GITHUB_BRANCH;

    if (!token) {
      return {
        success: false,
        error:
          "GitHub token not configured. Please set NEXT_GITHUB_TOKEN in your .env file.",
      };
    }

    // GitHub API expects the path without URL encoding
    const uploadUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

    // Upload to GitHub using API
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
    const errorMsg =
      error instanceof Error ? error.message : "Unknown error during upload";
    logError("Image upload to GitHub failed", {
      filename: file.name,
      folder,
      fileSize: file.size,
      fileType: file.type,
      error: errorMsg,
    });
    addBreadcrumb("file_upload", `Upload failed: ${errorMsg}`, "error");
    return {
      success: false,
      error: errorMsg,
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
