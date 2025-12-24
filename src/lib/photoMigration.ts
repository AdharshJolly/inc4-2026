/**
 * Photo data migration and compatibility layer
 *
 * MIGRATION HISTORY:
 * - Old format: "image": "https://example.com/photo.jpg" (string)
 * - New format: "photo": { "url": "https://...", "file": null } (object)
 *
 * The `file` property is reserved for future TinaCMS file upload support.
 * When file uploads are implemented, uploaded files will be stored in the `file` property,
 * and we can prioritize showing the uploaded file over the URL.
 */

/**
 * Get photo URL from either old (string) or new (object) format
 * @param photo - Photo data in old string format or new { url } format
 * @returns The appropriate photo URL string, or empty string if none available
 */
export const getPhotoUrl = (photo: any): string => {
  if (!photo) return "";

  // New format: { url: string }
  if (typeof photo === "object") {
    return photo?.url || "";
  }

  // Old format: direct string (backward compatibility)
  if (typeof photo === "string") {
    return photo;
  }

  return "";
};

/**
 * Normalize speaker/committee data to ensure photo field exists
 * Converts old "image" string to new "photo" object format
 */
export const normalizePhotoField = (item: any) => {
  if (!item) return item;

  // If already in new format, return as-is
  if (item.photo && typeof item.photo === "object") {
    return item;
  }

  // If has old "image" field, migrate to new format
  if (item.image && typeof item.image === "string") {
    return {
      ...item,
      photo: {
        url: item.image,
        file: null,
      },
    };
  }

  // No image data, provide empty photo object
  if (!item.photo) {
    return {
      ...item,
      photo: {
        url: "",
        file: null,
      },
    };
  }

  return item;
};

/**
 * Batch normalize an array of items
 */
export const normalizePhotoFields = (items: any[]) => {
  return items.map(normalizePhotoField);
};
