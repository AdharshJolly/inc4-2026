/**
 * Preview Mode Utility
 * Allows previewing uncommitted changes from admin panel
 */

const PREVIEW_MODE_KEY = "inc4_preview_mode";
const PREVIEW_DATA_KEY = "inc4_preview_data";

export interface PreviewData {
  [filePath: string]: string; // filePath -> JSON content
}

/**
 * Enable preview mode and store pending changes data
 */
export function enablePreviewMode(data: PreviewData): void {
  localStorage.setItem(PREVIEW_MODE_KEY, "true");
  localStorage.setItem(PREVIEW_DATA_KEY, JSON.stringify(data));
}

/**
 * Disable preview mode and clear preview data
 */
export function disablePreviewMode(): void {
  localStorage.removeItem(PREVIEW_MODE_KEY);
  localStorage.removeItem(PREVIEW_DATA_KEY);
}

/**
 * Check if preview mode is active
 */
export function isPreviewMode(): boolean {
  return localStorage.getItem(PREVIEW_MODE_KEY) === "true";
}

/**
 * Get preview data for a specific file path (returns JSON string)
 */
export function getPreviewData(filePath: string): string | null {
  if (!isPreviewMode()) return null;
  
  try {
    const dataStr = localStorage.getItem(PREVIEW_DATA_KEY);
    if (!dataStr) return null;
    
    const data: PreviewData = JSON.parse(dataStr);
    const fileContent = data[filePath];
    
    // Return the raw content string (which is JSON)
    return fileContent || null;
  } catch (error) {
    console.error("Error reading preview data:", error);
    return null;
  }
}

/**
 * Get all preview data
 */
export function getAllPreviewData(): PreviewData | null {
  if (!isPreviewMode()) return null;
  
  try {
    const dataStr = localStorage.getItem(PREVIEW_DATA_KEY);
    if (!dataStr) return null;
    return JSON.parse(dataStr);
  } catch (error) {
    console.error("Error reading preview data:", error);
    return null;
  }
}
