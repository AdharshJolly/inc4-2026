"use server";

import cloudinary, {
  CLOUDINARY_FOLDER,
  generatePublicId,
} from "@/lib/cloudinary";

export interface CloudinaryUploadResult {
  success: boolean;
  url?: string;
  publicId?: string;
  error?: string;
}

// Upload image buffer to Cloudinary (server-side)
export async function uploadToCloudinary(
  base64Data: string,
  folder: string,
  originalName: string
): Promise<CloudinaryUploadResult> {
  try {
    const publicId = generatePublicId(originalName, folder);

    // Upload to Cloudinary
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload(
        `data:image/jpeg;base64,${base64Data}`,
        {
          public_id: publicId,
          folder: `${CLOUDINARY_FOLDER}/${folder}`,
          resource_type: "image",
          overwrite: true,
          transformation: [
            {
              quality: "auto:good",
              fetch_format: "auto",
            },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    });

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

// Delete image from Cloudinary
export async function deleteFromCloudinary(
  publicId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await cloudinary.uploader.destroy(publicId);
    return { success: true };
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Delete failed",
    };
  }
}

// Get optimized URL for display
export function getOptimizedImageUrl(
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
  }
): string {
  const transformations: string[] = [];

  if (options?.width) transformations.push(`w_${options.width}`);
  if (options?.height) transformations.push(`h_${options.height}`);
  transformations.push("c_fill");
  if (options?.quality) transformations.push(`q_${options.quality}`);
  else transformations.push("q_auto:good");

  return cloudinary.url(publicId, {
    transformation: transformations.join(","),
    secure: true,
  });
}
