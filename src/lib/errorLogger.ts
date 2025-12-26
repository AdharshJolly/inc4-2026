/**
 * Centralized Error Logging Service
 * Captures errors, warnings, and diagnostic info for observability.
 * Falls back to localStorage if remote logging fails.
 */

export interface ErrorLog {
  id: string;
  timestamp: number;
  level: "error" | "warning" | "info";
  message: string;
  context?: Record<string, any>;
  stack?: string;
  userAgent?: string;
  url?: string;
  sessionId?: string;
  breadcrumbs?: Breadcrumb[];
}

export interface Breadcrumb {
  timestamp: number;
  category: string;
  message: string;
  level: "info" | "warning" | "error";
  data?: Record<string, any>;
}

const STORAGE_KEY = "inc4_error_logs";
const BREADCRUMB_KEY = "inc4_breadcrumbs";
const MAX_LOGS = 50;
const MAX_BREADCRUMBS = 100;
const SESSION_ID = `session_${Date.now()}_${Math.random()
  .toString(36)
  .slice(2, 9)}`;

let breadcrumbs: Breadcrumb[] = [];

/**
 * Initialize error logging (call once on app startup)
 */
export const initErrorLogger = () => {
  if (typeof window === "undefined") return;
  // Load breadcrumbs from localStorage
  try {
    const stored = localStorage.getItem(BREADCRUMB_KEY);
    if (stored) {
      breadcrumbs = JSON.parse(stored).slice(-MAX_BREADCRUMBS);
    }
  } catch {
    // Ignore parse errors
  }

  // Global error handler for uncaught exceptions
  window.addEventListener("error", (event) => {
    logError(
      event.message || "Uncaught error",
      {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
      event.error?.stack
    );
  });

  // Global handler for unhandled promise rejections
  window.addEventListener("unhandledrejection", (event) => {
    logError(
      event.reason?.message || "Unhandled promise rejection",
      {
        reason: event.reason,
      },
      event.reason?.stack
    );
  });

  logInfo("Error logger initialized", { sessionId: SESSION_ID });
};

/**
 * Add a breadcrumb (diagnostic event trace)
 */
export const addBreadcrumb = (
  category: string,
  message: string,
  level: "info" | "warning" | "error" = "info",
  data?: Record<string, any>
) => {
  if (typeof window === "undefined") return;
  const crumb: Breadcrumb = {
    timestamp: Date.now(),
    category,
    message,
    level,
    data,
  };

  breadcrumbs.push(crumb);
  if (breadcrumbs.length > MAX_BREADCRUMBS) {
    breadcrumbs = breadcrumbs.slice(-MAX_BREADCRUMBS);
  }

  // Persist breadcrumbs
  try {
    localStorage.setItem(BREADCRUMB_KEY, JSON.stringify(breadcrumbs));
  } catch {
    // Quota exceeded; trim oldest
    breadcrumbs = breadcrumbs.slice(-(MAX_BREADCRUMBS / 2));
    try {
      localStorage.setItem(BREADCRUMB_KEY, JSON.stringify(breadcrumbs));
    } catch {
      // Silent fail if still too large
    }
  }
};

/**
 * Log an error
 */
export const logError = (
  message: string,
  context?: Record<string, any>,
  stack?: string
) => {
  if (typeof window === "undefined") return;
  const log: ErrorLog = {
    id: `error_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    timestamp: Date.now(),
    level: "error",
    message,
    context,
    stack,
    userAgent: navigator.userAgent,
    url: window.location.href,
    sessionId: SESSION_ID,
    breadcrumbs: [...breadcrumbs],
  };

  console.error("[ErrorLogger]", message, context, stack);
  persistLog(log);
  sendToRemote(log).catch(() => {
    // Remote logging failed; already persisted locally
  });

  addBreadcrumb("error", message, "error", context);
};

/**
 * Log a warning
 */
export const logWarning = (message: string, context?: Record<string, any>) => {
  if (typeof window === "undefined") return;
  const log: ErrorLog = {
    id: `warning_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    timestamp: Date.now(),
    level: "warning",
    message,
    context,
    userAgent: navigator.userAgent,
    url: window.location.href,
    sessionId: SESSION_ID,
  };

  console.warn("[ErrorLogger]", message, context);
  persistLog(log);

  addBreadcrumb("warning", message, "warning", context);
};

/**
 * Log info (for tracing admin actions, etc.)
 */
export const logInfo = (message: string, context?: Record<string, any>) => {
  console.log("[ErrorLogger]", message, context);
  addBreadcrumb("info", message, "info", context);
};

/**
 * Persist log to localStorage (quota-safe)
 */
const persistLog = (log: ErrorLog) => {
  try {
    const logs = getLogs();
    logs.push(log);
    if (logs.length > MAX_LOGS) {
      logs.shift(); // Remove oldest
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  } catch {
    // Quota exceeded; trim and retry
    const logs = getLogs();
    if (logs.length > MAX_LOGS / 2) {
      const trimmed = logs.slice(-(MAX_LOGS / 4));
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
      } catch {
        // Give up
      }
    }
  }
};

/**
 * Retrieve stored logs
 */
export const getLogs = (): ErrorLog[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

/**
 * Clear all logs
 */
export const clearLogs = () => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(BREADCRUMB_KEY);
    breadcrumbs = [];
  } catch {
    // Ignore
  }
};

/**
 * Send log to remote service (stub; replace with actual endpoint)
 */
const sendToRemote = async (log: ErrorLog): Promise<void> => {
  // TODO: Replace with your Sentry project key or custom endpoint
  const REMOTE_ENDPOINT = process.env.VITE_ERROR_LOG_ENDPOINT;

  if (!REMOTE_ENDPOINT) {
    return; // No remote logging configured
  }

  try {
    await fetch(REMOTE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(log),
    });
  } catch (err) {
    console.warn("Failed to send error log to remote:", err);
    // Already logged locally; don't throw
  }
};

/**
 * Get current breadcrumbs (for debugging)
 */
export const getBreadcrumbs = (): Breadcrumb[] => {
  return [...breadcrumbs];
};

/**
 * Export logs for debugging (e.g., in admin panel)
 */
export const exportLogs = (): {
  logs: ErrorLog[];
  breadcrumbs: Breadcrumb[];
} => {
  return {
    logs: getLogs(),
    breadcrumbs: getBreadcrumbs(),
  };
};
