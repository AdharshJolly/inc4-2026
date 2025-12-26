/**
 * Type definitions for JSON data files
 * These match the TinaCMS schema structure
 */

export interface ImportantDateItem {
  event: string;
  date: string;
  status: "upcoming" | "completed" | "highlight";
  description?: string;
}

export interface ImportantDatesData {
  root: ImportantDateItem[];
}

export interface PhotoField {
  url?: string;
}

export interface SpeakerItem {
  name: string;
  role: string;
  affiliation: string;
  photo: PhotoField;
  topic?: string;
  linkedin?: string;
}

export interface SpeakersData {
  root: SpeakerItem[];
}

export interface CommitteeMember {
  name: string;
  role: string;
  affiliation: string;
  photo: PhotoField;
}

export interface CommitteeCategory {
  id: string;
  label: string;
  members: CommitteeMember[];
}

export interface CommitteeData {
  root: CommitteeCategory[];
}

/**
 * Type guard to check if data has root property
 */
export function hasRootProperty<T>(data: any): data is { root: T[] } {
  return (
    data &&
    typeof data === "object" &&
    "root" in data &&
    Array.isArray(data.root)
  );
}

/**
 * Normalize data to ensure it has root property
 * Provides backward compatibility with old array format
 */
export function normalizeRootData<T>(data: T[] | { root: T[] }): { root: T[] } {
  if (Array.isArray(data)) {
    return { root: data };
  }
  return data;
}
