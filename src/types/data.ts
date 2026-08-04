/**
 * Type definitions for JSON data files
 */

export interface ImportantDateItem {
  event: string;
  date: string;
  isHighlight?: boolean;
  description?: string;
  actionText?: string;
  actionUrl?: string;
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
  twitter?: string;
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
function hasRootProperty<T>(data: any): data is { root: T[] } {
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
function normalizeRootData<T>(data: T[] | { root: T[] }): { root: T[] } {
  if (Array.isArray(data)) {
    return { root: data };
  }
  return data;
}

export interface PartnerItem {
  name: string;
  country: string;
  link?: string;
  image: string;
  whiteLogo?: boolean;
}

export interface PartnersData {
  root: PartnerItem[];
}

// ── Schedule types ──

export interface ScheduleDay {
  id: string;
  day_number: number;
  date: string;
  label: string;
  sort_order: number;
}

export interface ScheduleEvent {
  id: string;
  day_id: string;
  time_start: string;
  time_end: string;
  title: string;
  event_type: "keynote" | "inauguration" | "valedictory" | "session" | "lunch" | "high_tea" | "break" | "other";
  location: string | null;
  session_chair: string[] | null;
  invited_speakers?: string[] | null;
  sort_order: number;
}

export interface SchedulePaper {
  id: string;
  event_id: string;
  title: string;
  presenter: string;
  sort_order: number;
}

// ── Site config / feature flags ──

export interface SiteConfig {
  key: string;
  value: boolean;
  description: string | null;
}

