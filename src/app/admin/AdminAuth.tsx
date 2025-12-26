"use client";

import { useEffect, useState, createContext } from "react";
import { usePathname, useRouter } from "next/navigation";
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

export const AdminAuth = ({ children }: ProtectedRouteProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);

  const SESSION_TIMEOUT = 30 * 60 * 1000;
  const MAX_FAILED_ATTEMPTS = 5;
  const LOCKOUT_DURATION = 15 * 60 * 1000;

  const ADMIN_PASSWORD =
    process.env.NEXT_PUBLIC_ADMIN_PASSWORD ||
    process.env.NEXT_ADMIN_PASSWORD ||
    "admin123";

  const verifyPassword = async (input: string) => {
    try {
      const response = await fetch("/api/admin-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: input }),
      });

      if (response.ok) return true;
      if (response.status === 401) return false;
    } catch (error) {
      console.warn("Server auth unavailable, using client fallback", error);
    }
    return input === ADMIN_PASSWORD;
  };

  useEffect(() => {
    const sessionData = sessionStorage.getItem("admin_session");
    const sessionTimestamp = sessionStorage.getItem("admin_session_time");

    if (sessionData && sessionTimestamp) {
      const timeSinceLogin = Date.now() - parseInt(sessionTimestamp);
      if (timeSinceLogin < SESSION_TIMEOUT) {
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      } else {
        sessionStorage.removeItem("admin_session");
        sessionStorage.removeItem("admin_session_time");
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const logoutTimer = setTimeout(() => {
        handleLogout();
      }, SESSION_TIMEOUT);
      return () => clearTimeout(logoutTimer);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleBeforeUnload = async (e: BeforeUnloadEvent) => {
      const pendingChanges = getPendingChanges();
      if (pendingChanges.length > 0 && isAuthenticated) {
        e.preventDefault();
        e.returnValue = "";

        const branch =
          process.env.NEXT_PUBLIC_TINA_BRANCH ||
          process.env.NEXT_TINA_BRANCH ||
          "main";

        try {
          const result = await commitChangesToGitHub(pendingChanges, branch);
          if (result.success) {
            clearPendingChanges();
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) {
      setError(
        `Too many failed attempts. Try again in ${Math.ceil(
          lockoutTime / 1000
        )} seconds.`
      );
      return;
    }

    const isValid = await verifyPassword(password);
    if (isValid) {
      sessionStorage.setItem("admin_session", "true");
      sessionStorage.setItem("admin_session_time", Date.now().toString());
      setIsAuthenticated(true);
      setPassword("");
      setError("");
      setFailedAttempts(0);
    } else {
      const newFailedAttempts = failedAttempts + 1;
      setFailedAttempts(newFailedAttempts);
      setPassword("");
      setError("Invalid password. Please try again.");
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
    const pendingChanges = getPendingChanges();
    if (pendingChanges.length > 0) {
      const branch =
        process.env.NEXT_PUBLIC_TINA_BRANCH ||
        process.env.NEXT_TINA_BRANCH ||
        "main";
      const result = await commitChangesToGitHub(pendingChanges, branch);
      if (result.success) {
        clearPendingChanges();
      }
    }
    sessionStorage.removeItem("admin_session");
    sessionStorage.removeItem("admin_session_time");
    setIsAuthenticated(false);
    setPassword("");
    setError("");
    router.push("/");
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
                  onClick={() => router.push("/")}
                  variant="outline"
                  className="flex-1"
                >
                  Back
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <AdminSessionContext.Provider value={{ logout: handleLogout }}>
      <div className="min-h-screen bg-background">{children}</div>
    </AdminSessionContext.Provider>
  );
};
