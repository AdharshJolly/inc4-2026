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
 * @throws Error if the input is not a valid data URL with base64 content
 */
export function base64ToBlob(base64String: string): Blob {
  // Guard against missing/invalid input early to avoid confusing DOMExceptions from atob
  if (!base64String || typeof base64String !== "string") {
    throw new Error("Invalid base64 input: expected non-empty string");
  }

  const commaIndex = base64String.indexOf(",");
  if (commaIndex === -1) {
    throw new Error("Invalid base64 input: missing comma delimiter");
  }

  const header = base64String.slice(0, commaIndex);
  const dataPart = base64String.slice(commaIndex + 1);
  if (!dataPart) {
    throw new Error("Invalid base64 input: missing data segment");
  }

  const mimeMatch = header.match(/^data:(.*?);base64$/);
  const mimeType = mimeMatch && mimeMatch[1] ? mimeMatch[1] : "image/jpeg";

  let binaryString: string;
  try {
    binaryString = atob(dataPart);
  } catch (error) {
    throw new Error("Invalid base64 input: failed to decode");
  }

  const byteLength = binaryString.length;
  const u8arr = new Uint8Array(byteLength);

  for (let i = 0; i < byteLength; i++) {
    u8arr[i] = binaryString.charCodeAt(i);
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
