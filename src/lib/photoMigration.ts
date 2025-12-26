/**
 * Photo data migration and compatibility layer
 *
 * MIGRATION HISTORY:
 * - Old format: "image": "https://example.com/photo.jpg" (string)
 * - Transitional format: "photo": { "url": "https://...", "file": "..." }
 * - Current format: "photo": { "url"?: string } (no file property)
 */

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

/**
 * Get photo URL from supported or legacy formats without throwing
 * @param photo - Photo data in string, object, or legacy file-bearing shape
 * @returns Photo URL string or empty string if unavailable
 */
export const getPhotoUrl = (photo: any): string => {
  if (!photo) return "";

  // Old format: direct string (backward compatibility)
  if (typeof photo === "string") {
    return isNonEmptyString(photo) ? photo : "";
  }

  if (typeof photo === "object") {
    const url = isNonEmptyString((photo as any).url) ? (photo as any).url : "";
    const legacyFile = isNonEmptyString((photo as any).file)
      ? (photo as any).file
      : "";

    return url || legacyFile || "";
  }

  return "";
};

/**
 * Normalize speaker/committee data to ensure photo field exists and legacy
 * file-based data migrates into the current url-only shape.
 */
export const normalizePhotoField = <T extends { photo?: any; image?: any }>(
  item: T
): (T & { photo: { url?: string } }) | null | undefined => {
  // Preserve null/undefined inputs to avoid inventing shapes
  if (!item) return item as null | undefined;

  const normalizedUrl = getPhotoUrl(item.photo ?? item.image);

  return {
    ...item,
    photo: normalizedUrl ? { url: normalizedUrl } : {},
  } as T & { photo: { url?: string } };
};

/**
 * Batch normalize an array of items
 */
export const normalizePhotoFields = <T extends { photo?: any; image?: any }>(
  items: T[]
): Array<T & { photo: { url?: string } }> => {
  const normalized = items.map((item) => normalizePhotoField(item));
  return normalized.filter(Boolean) as Array<T & { photo: { url?: string } }>;
};
