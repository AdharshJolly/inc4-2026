import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary (server-side)
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Upload folder prefix for the project
export const CLOUDINARY_FOLDER = "inc4-2026";

// Allowed image types
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

// Max file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Generate unique public_id for Cloudinary
export function generatePublicId(
  originalName: string,
  folder: string
): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  const cleanName = originalName
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9]/g, "-")
    .toLowerCase()
    .substring(0, 30);

  return `${CLOUDINARY_FOLDER}/${folder}/${timestamp}-${random}-${cleanName}`;
}

// Validate image file
function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "File must be JPEG, PNG, GIF, or WebP",
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: "File must be smaller than 5MB",
    };
  }

  return { valid: true };
}

// Generate Cloudinary URL with transformations
function getCloudinaryUrl(
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string | number;
    format?: string;
  }
): string {
  const transformations: Record<string, any> = {};

  if (options?.width) transformations.width = options.width;
  if (options?.height) transformations.height = options.height;
  if (options?.crop) transformations.crop = options.crop;
  if (options?.quality) transformations.quality = options.quality;
  if (options?.format) transformations.format = options.format;

  return cloudinary.url(publicId, {
    transformation: Object.keys(transformations).length > 0 ? transformations : undefined,
    secure: true,
  });
}

export default cloudinary;