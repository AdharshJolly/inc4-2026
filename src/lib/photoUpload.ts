/**
 * Photo Upload Utility
 * Handles converting photo files to base64 for persistence in JSON
 */

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


