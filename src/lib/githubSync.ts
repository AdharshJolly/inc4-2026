/**
 * GitHub Sync Utility (Client-side)
 * Handles managing pending changes in session storage.
 * The actual sync to GitHub is performed via server actions.
 */

interface FileChange {
  path: string;
  content: string;
  message: string;
}

/**
 * Store pending changes in session storage to batch commit
 */
export function storePendingChange(change: FileChange) {
  const pending = getPendingChanges();
  pending.push(change);
  sessionStorage.setItem("pendingGitHubChanges", JSON.stringify(pending));
}

/**
 * Get all pending changes
 */
export function getPendingChanges(): FileChange[] {
  if (typeof window === "undefined") return [];
  const pending = sessionStorage.getItem("pendingGitHubChanges");
  return pending ? JSON.parse(pending) : [];
}

/**
 * Clear pending changes after successful commit
 */
export function clearPendingChanges() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem("pendingGitHubChanges");
}

/**
 * Check if there are pending changes
 */
export function hasPendingChanges(): boolean {
  return getPendingChanges().length > 0;
}