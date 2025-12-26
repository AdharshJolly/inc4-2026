/**
 * Activity Log System
 * Tracks all admin actions with timestamps
 */

export type ChangeRecord = Record<string, { old: unknown; new: unknown }>;

export interface ActivityLogEntry {
  id: string;
  action: string;
  type: "member" | "speaker" | "date" | "category";
  targetName: string;
  changes?: ChangeRecord;
  timestamp: number;
  status: "success" | "error" | "warning";
}

const STORAGE_KEY = "admin_activity_log";
const MAX_ENTRIES = 500; // Keep last 500 entries
export const ActivityLogger = {
  /**
   * Log an action to activity log
   * Handles localStorage quota errors gracefully with retry logic
   */
  log(entry: Omit<ActivityLogEntry, "id" | "timestamp">): ActivityLogEntry {
    const newEntry: ActivityLogEntry = {
      ...entry,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
      timestamp: Date.now(),
    };

    if (typeof window === "undefined") return newEntry;

    const logs = ActivityLogger.getAll();

    // Add to beginning (newest first)
    logs.unshift(newEntry);

    // Keep only last MAX_ENTRIES
    let trimmed = logs.slice(0, MAX_ENTRIES);

    // Attempt to save with retry logic for quota errors
    let retries = 0;
    const maxRetries = 3;

    while (retries < maxRetries) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
        return newEntry;
      } catch (error) {
        // Check if it's a quota exceeded error
        const isQuotaError =
          error instanceof DOMException &&
          (error.name === "QuotaExceededError" ||
            error.code === 22 ||
            error.name === "NS_ERROR_DOM_QUOTA_REACHED");

        if (!isQuotaError) {
          // If it's not a quota error, log and fail gracefully
          console.error("Error saving activity log:", error);
          return newEntry; // Return entry anyway, best effort
        }

        // Try to free up space by removing older entries
        retries++;
        if (retries < maxRetries) {
          // Remove oldest 50 entries (or more aggressively on later retries)
          const removeCount =
            retries === 1 ? 50 : Math.min(100 * retries, trimmed.length);
          trimmed = trimmed.slice(0, Math.max(1, trimmed.length - removeCount));

          if (trimmed.length <= 1) {
            // Only the newest entry remains; nothing else to trim
            console.warn(
              "Activity log quota exceeded - could not free up additional space"
            );
            return newEntry;
          }
        } else {
          // Out of retries - fail gracefully
          console.error("Activity log quota exceeded after retry attempts");
          return newEntry;
        }
      }
    }

    return newEntry;
  },

  /**
   * Get all activity logs
   */
  getAll(): ActivityLogEntry[] {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? (JSON.parse(data) as ActivityLogEntry[]) : [];
    } catch (error) {
      console.error("Error reading activity log:", error);
      return [];
    }
  },

  /**
   * Get logs for a specific type
   */
  getByType(type: ActivityLogEntry["type"]): ActivityLogEntry[] {
    return ActivityLogger.getAll().filter((log) => log.type === type);
  },

  /**
   * Get logs from last N hours
   */
  getRecent(hours: number = 24): ActivityLogEntry[] {
    const cutoff = Date.now() - hours * 60 * 60 * 1000;
    return ActivityLogger.getAll().filter((log) => log.timestamp > cutoff);
  },

  /**
   * Clear all logs
   */
  clear(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
  },

  /**
   * Export logs as JSON
   */
  export(): void {
    const logs = ActivityLogger.getAll();
    const json = JSON.stringify(logs, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `admin-activity-log-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
};

/**
 * Log helper functions
 */
export const logAction = {
  addMember: (name: string): ActivityLogEntry =>
    ActivityLogger.log({
      action: "Added new committee member",
      type: "member",
      targetName: name,
      status: "success",
    }),

  editMember: (name: string, changes: ChangeRecord): ActivityLogEntry =>
    ActivityLogger.log({
      action: "Edited committee member",
      type: "member",
      targetName: name,
      changes,
      status: "success",
    }),

  deleteMember: (name: string): ActivityLogEntry =>
    ActivityLogger.log({
      action: "Deleted committee member",
      type: "member",
      targetName: name,
      status: "warning",
    }),

  addSpeaker: (name: string): ActivityLogEntry =>
    ActivityLogger.log({
      action: "Added new keynote speaker",
      type: "speaker",
      targetName: name,
      status: "success",
    }),

  editSpeaker: (name: string, changes: ChangeRecord): ActivityLogEntry =>
    ActivityLogger.log({
      action: "Edited keynote speaker",
      type: "speaker",
      targetName: name,
      changes,
      status: "success",
    }),

  deleteSpeaker: (name: string): ActivityLogEntry =>
    ActivityLogger.log({
      action: "Deleted keynote speaker",
      type: "speaker",
      targetName: name,
      status: "warning",
    }),

  bulkAction: (
    action: string,
    count: number,
    type: ActivityLogEntry["type"]
  ): ActivityLogEntry =>
    ActivityLogger.log({
      action: `Performed bulk action: ${action} (${count} items)`,
      type,
      targetName: `${count} items`,
      status: "success",
    }),

  exportData: (type: string): ActivityLogEntry => {
    // Validate and map the type parameter to allowed enum values
    const validTypes: ActivityLogEntry["type"][] = [
      "member",
      "speaker",
      "date",
      "category",
    ];
    const mappedType: ActivityLogEntry["type"] = validTypes.includes(
      type as ActivityLogEntry["type"]
    )
      ? (type as ActivityLogEntry["type"])
      : "member"; // Fallback to "member" if invalid

    return ActivityLogger.log({
      action: `Exported ${mappedType} data`,
      type: mappedType,
      targetName: mappedType,
      status: "success",
    });
  },
};
