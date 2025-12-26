"use client";

import { createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";
import { getPendingChanges, clearPendingChanges } from "@/lib/githubSync";
import { commitChangesToGitHub } from "@/app/actions/github";

interface AdminContextType {
  logout: () => void;
}

export const AdminSessionContext = createContext<AdminContextType | null>(null);

export function AdminSessionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleLogout = async () => {
    // Sync pending changes before logging out
    const pendingChanges = getPendingChanges();
    if (pendingChanges.length > 0) {
      // We don't have the branch in env here on client easily unless exposed
      // Assuming 'development' or 'main' fallback on server side if needed
      // Actually, commitChangesToGitHub server action defaults to 'development'
      // But we can check if we want to expose branch name
      const result = await commitChangesToGitHub(pendingChanges);
      if (result.success) {
        clearPendingChanges();
      }
    }

    await logoutAction();
    router.refresh(); // Clear server cache/state
    router.push("/admin/login");
  };

  return (
    <AdminSessionContext.Provider value={{ logout: handleLogout }}>
      {children}
    </AdminSessionContext.Provider>
  );
}
