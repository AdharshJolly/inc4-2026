/**
 * File upload utility using GitHub API
 * Uploads image files to public/images/ folders and returns the filename
 * Files are committed to GitHub, making them version-controlled and deployable
 */

import { uploadImageToGitHubAction, type UploadResult } from "@/app/actions/upload";
import { logError, addBreadcrumb } from "./errorLogger";

/**
 * Convert File to base64 string for GitHub API
 */
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (!result || typeof result !== "string") {
        reject(new Error("Failed to read file: invalid result"));
        return;
      }
      const base64String = result.split(",")[1];
      if (!base64String) {
        reject(new Error("Failed to extract base64 from file"));
        return;
      }
      resolve(base64String);
    };
    reader.onerror = () => {
      reject(new Error(`File read error: ${reader.error?.message || "Unknown error"}`));
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Generate unique filename to avoid collisions
 */
function generateFilename(originalName: string, mimeType?: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  let extension = "";
  const lastDotIndex = originalName.lastIndexOf(".");

  if (lastDotIndex > 0 && lastDotIndex < originalName.length - 1) {
    extension = originalName.substring(lastDotIndex + 1).toLowerCase();
  } else if (mimeType) {
    const mimeToExt: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/gif": "gif",
      "image/webp": "webp",
    };
    extension = mimeToExt[mimeType] || "bin";
  } else {
    extension = "bin";
  }

  extension = extension.replace(/[/\\]/g, "").replace(/^\.+/, "");
  if (!extension) extension = "bin";

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
 * Upload image to GitHub public folder (Client-side helper)
 * This calls the server action to perform the actual upload securely
 */
export async function uploadImageToGitHub(
  file: File,
  folder: "committee" | "speakers"
): Promise<UploadResult> {
  try {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    const filename = generateFilename(file.name, file.type);
    const base64Content = await fileToBase64(file);

    // Call the server action
    return await uploadImageToGitHubAction(base64Content, filename, folder);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error during upload";
    logError("Image upload to GitHub failed", {
      filename: file.name,
      folder,
      error: errorMsg,
    });
    addBreadcrumb("file_upload", `Upload failed: ${errorMsg}`, "error");
    return { success: false, error: errorMsg };
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