/**
 * Activity Log System
 * Tracks all admin actions with timestamps
 */

export interface ActivityLogEntry {
  id: string;
  action: string;
  type: "member" | "speaker" | "date" | "category";
  targetName: string;
  changes?: Record<string, { old: any; new: any }>;
  timestamp: number;
  status: "success" | "error" | "warning";
}

const STORAGE_KEY = "admin_activity_log";
const MAX_ENTRIES = 500; // Keep last 500 entries

export const ActivityLogger = {
  /**
   * Log an action to activity log
   */
  log(entry: Omit<ActivityLogEntry, "id" | "timestamp">) {
    const logs = ActivityLogger.getAll();

    const newEntry: ActivityLogEntry = {
      ...entry,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };

    // Add to beginning (newest first)
    logs.unshift(newEntry);

    // Keep only last MAX_ENTRIES
    const trimmed = logs.slice(0, MAX_ENTRIES);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    return newEntry;
  },

  /**
   * Get all activity logs
   */
  getAll(): ActivityLogEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
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
  clear() {
    localStorage.removeItem(STORAGE_KEY);
  },

  /**
   * Export logs as JSON
   */
  export() {
    const logs = ActivityLogger.getAll();
    const json = JSON.stringify(logs, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `admin-activity-log-${
      new Date().toISOString().split("T")[0]
    }.json`;
    a.click();
  },
};

/**
 * Log helper functions
 */
export const logAction = {
  addMember: (name: string) =>
    ActivityLogger.log({
      action: "Added new committee member",
      type: "member",
      targetName: name,
      status: "success",
    }),

  editMember: (name: string, changes: Record<string, { old: any; new: any }>) =>
    ActivityLogger.log({
      action: "Edited committee member",
      type: "member",
      targetName: name,
      changes,
      status: "success",
    }),

  deleteMember: (name: string) =>
    ActivityLogger.log({
      action: "Deleted committee member",
      type: "member",
      targetName: name,
      status: "warning",
    }),

  addSpeaker: (name: string) =>
    ActivityLogger.log({
      action: "Added new keynote speaker",
      type: "speaker",
      targetName: name,
      status: "success",
    }),

  editSpeaker: (
    name: string,
    changes: Record<string, { old: any; new: any }>
  ) =>
    ActivityLogger.log({
      action: "Edited keynote speaker",
      type: "speaker",
      targetName: name,
      changes,
      status: "success",
    }),

  deleteSpeaker: (name: string) =>
    ActivityLogger.log({
      action: "Deleted keynote speaker",
      type: "speaker",
      targetName: name,
      status: "warning",
    }),

  bulkAction: (action: string, count: number) =>
    ActivityLogger.log({
      action: `Performed bulk action: ${action} (${count} items)`,
      type: "member",
      targetName: `${count} items`,
      status: "success",
    }),

  exportData: (type: string) =>
    ActivityLogger.log({
      action: `Exported ${type} data`,
      type: "member",
      targetName: type,
      status: "success",
    }),
};
