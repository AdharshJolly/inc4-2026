import { useEffect, useState, createContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";
import {
  commitChangesToGitHub,
  getPendingChanges,
  clearPendingChanges,
} from "@/lib/githubSync";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const AdminSessionContext = createContext<{ logout: () => void } | null>(
  null
);

/**
 * ProtectedAdminRoute
 *
 * Security layer for admin routes with:
 * - Password authentication
 * - Session management with timeout
 * - Rate limiting on failed attempts
 * - Session storage (in-memory, cleared on browser close)
 */
export const ProtectedAdminRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);

  // Session timeout in minutes (30 minutes)
  const SESSION_TIMEOUT = 30 * 60 * 1000;
  // Lockout threshold (max failed attempts before lockout)
  const MAX_FAILED_ATTEMPTS = 5;
  // Lockout duration in minutes
  const LOCKOUT_DURATION = 15 * 60 * 1000;

  // Admin password - should be environment variable in production
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";

  useEffect(() => {
    // Check if user has an active session
    const sessionData = sessionStorage.getItem("admin_session");
    const sessionTimestamp = sessionStorage.getItem("admin_session_time");

    if (sessionData && sessionTimestamp) {
      const timeSinceLogin = Date.now() - parseInt(sessionTimestamp);

      // Check if session has expired
      if (timeSinceLogin < SESSION_TIMEOUT) {
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      } else {
        // Session expired, clear it
        sessionStorage.removeItem("admin_session");
        sessionStorage.removeItem("admin_session_time");
      }
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Auto-logout on session timeout
    if (isAuthenticated) {
      const logoutTimer = setTimeout(() => {
        handleLogout();
      }, SESSION_TIMEOUT);

      return () => clearTimeout(logoutTimer);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // Handle window close/refresh - commit pending changes before leaving
    const handleBeforeUnload = async (e: BeforeUnloadEvent) => {
      const pendingChanges = getPendingChanges();
      if (pendingChanges.length > 0 && isAuthenticated) {
        // Prevent default to show browser confirmation
        e.preventDefault();
        e.returnValue = "";

        // Attempt to sync changes (non-blocking)
        const branch =
          import.meta.env.VITE_TINA_BRANCH ||
          (import.meta.env.MODE === "production" ? "main" : "development");

        try {
          const result = await commitChangesToGitHub(pendingChanges, branch);
          if (result.success) {
            clearPendingChanges();
            console.log("Changes synced before window close");
          } else {
            console.warn(`Failed to sync before close: ${result.error}`);
          }
        } catch (err) {
          console.error("Error during beforeunload sync:", err);
        }
      }
    };

    if (isAuthenticated) {
      window.addEventListener("beforeunload", handleBeforeUnload);
      return () =>
        window.removeEventListener("beforeunload", handleBeforeUnload);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // Lockout timer
    if (isLocked && lockoutTime > 0) {
      const timer = setInterval(() => {
        setLockoutTime((prev) => {
          if (prev <= 1) {
            setIsLocked(false);
            setFailedAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isLocked, lockoutTime]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if account is locked
    if (isLocked) {
      setError(
        `Too many failed attempts. Try again in ${Math.ceil(
          lockoutTime / 1000
        )} seconds.`
      );
      return;
    }

    // Verify password
    if (password === ADMIN_PASSWORD) {
      // Set session
      sessionStorage.setItem("admin_session", "true");
      sessionStorage.setItem("admin_session_time", Date.now().toString());

      setIsAuthenticated(true);
      setPassword("");
      setError("");
      setFailedAttempts(0);
    } else {
      // Failed attempt
      const newFailedAttempts = failedAttempts + 1;
      setFailedAttempts(newFailedAttempts);
      setPassword("");
      setError("Invalid password. Please try again.");

      // Lock account after max attempts
      if (newFailedAttempts >= MAX_FAILED_ATTEMPTS) {
        setIsLocked(true);
        setLockoutTime(Math.ceil(LOCKOUT_DURATION / 1000));
        setError(
          `Too many failed attempts. Account locked for ${Math.ceil(
            LOCKOUT_DURATION / 60000
          )} minutes.`
        );
      }
    }
  };

  const handleLogout = async () => {
    // Commit pending changes to GitHub before logout
    const pendingChanges = getPendingChanges();
    if (pendingChanges.length > 0) {
      const branch =
        import.meta.env.VITE_TINA_BRANCH ||
        (import.meta.env.MODE === "production" ? "main" : "development");

      const result = await commitChangesToGitHub(pendingChanges, branch);
      if (result.success) {
        clearPendingChanges();
        console.log(`Synced ${pendingChanges.length} changes to GitHub`);
      } else {
        console.warn(
          `Failed to sync changes to GitHub: ${result.error}. Logging out anyway.`
        );
      }
    }

    sessionStorage.removeItem("admin_session");
    sessionStorage.removeItem("admin_session_time");
    setIsAuthenticated(false);
    setPassword("");
    setError("");
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
        <Card className="w-full max-w-md border-primary/20">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-orange-500/10">
                <Lock className="w-6 h-6 text-orange-500" />
              </div>
            </div>
            <CardTitle className="text-2xl">Admin Access</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Admin Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  disabled={isLocked}
                  className="border-border"
                  autoComplete="off"
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={isLocked || !password}
                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                >
                  {isLocked ? "Account Locked" : "Login"}
                </Button>
                <Button
                  type="button"
                  onClick={() => navigate("/")}
                  variant="outline"
                  className="flex-1"
                >
                  Back
                </Button>
              </div>

              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-xs text-blue-600">
                  ℹ️ Session expires after {Math.floor(SESSION_TIMEOUT / 60000)}{" "}
                  minutes of access. Failed login attempts will lock the account
                  temporarily.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Authenticated - provide logout to children via context
  return (
    <AdminSessionContext.Provider value={{ logout: handleLogout }}>
      <div className="min-h-screen bg-background">{children}</div>
    </AdminSessionContext.Provider>
  );
};
