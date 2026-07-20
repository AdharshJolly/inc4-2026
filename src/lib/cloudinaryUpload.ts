import { uploadToCloudinary, type CloudinaryUploadResult } from "@/app/actions/cloudinary-upload";

// Convert File to base64 string
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        // Remove data URL prefix
        const base64 = result.split(",")[1];
        if (base64) {
          resolve(base64);
        } else {
          reject(new Error("Failed to extract base64 data"));
        }
      } else {
        reject(new Error("Failed to convert file to base64"));
      }
    };
    reader.onerror = () => reject(new Error("Error reading file"));
    reader.readAsDataURL(file);
  });
}

// Upload image to Cloudinary (client-side wrapper)
export async function uploadImageToCloudinary(
  file: File,
  folder: "committee" | "speakers" | "partners"
): Promise<CloudinaryUploadResult> {
  try {
    // Convert to base64
    const base64Data = await fileToBase64(file);

    // Call server action
    const result = await uploadToCloudinary(base64Data, folder, file.name, file.type);

    return result;
  } catch (error) {
    console.error("Client upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

// Get image URL with optional transformations
export function getImageUrl(
  publicId: string | null | undefined,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
  }
): string {
  if (!publicId) return "";

  // If it's already a full URL (legacy), return as-is
  if (publicId.startsWith("http")) {
    return publicId;
  }

  // Build Cloudinary URL
  const transformations: string[] = [];
  if (options?.width) transformations.push(`w_${options.width}`);
  if (options?.height) transformations.push(`h_${options.height}`);
  transformations.push("c_fill");
  if (options?.quality) transformations.push(`q_${options.quality}`);
  else transformations.push("q_auto:good");

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations.join("/")}/${publicId}`;
}
