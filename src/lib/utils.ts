import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isExternalUrl = (url: string | null | undefined) => {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://');
};
