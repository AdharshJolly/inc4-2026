/**
 * Photo Upload Utility
 * Handles converting photo files to base64 for persistence in JSON
 */

export interface PhotoData {
  url?: string;
  base64?: string;
  mimeType?: string;
}

/**
 * Convert a File object to base64 data URL
 * @param file - The File object to convert
 * @returns Promise resolving to base64 data URL
 * @throws Error if file reading fails
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        resolve(result);
      } else {
        reject(new Error("Failed to convert file to base64"));
      }
    };

    reader.onerror = () => {
      reject(new Error("Error reading file"));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Convert base64 string back to Blob
 * @param base64String - The base64 data URL
 * @returns Blob object
 */
export function base64ToBlob(base64String: string): Blob {
  // Split the data URL to get the base64 content and mime type
  const parts = base64String.split(",");
  const mimeMatch = parts[0].match(/:(.*?);/);
  const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
  const bstr = atob(parts[1]);
  const n = bstr.length;
  const u8arr = new Uint8Array(n);

  for (let i = 0; i < n; i++) {
    u8arr[i] = bstr.charCodeAt(i);
  }

  return new Blob([u8arr], { type: mimeType });
}

/**
 * Validate if a photo field contains actual photo data
 * @param photo - The photo object to validate
 * @returns true if photo has either URL or base64 data
 */
export function isValidPhotoData(
  photo: any
): photo is { url?: string; base64?: string } {
  return photo && (photo.url || photo.base64);
}

/**
 * Get displayable photo URL (handles both URLs and base64 data)
 * @param photo - The photo object
 * @returns The URL or base64 string to use in img src
 */
export function getPhotoDisplayUrl(photo: any): string {
  if (!photo) return "";
  // Prefer base64 (actual stored data) over URL
  if (photo.base64) {
    return photo.base64;
  }
  return photo.url || "";
}
