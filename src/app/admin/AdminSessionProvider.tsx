"use client";

import { createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";
import { getPendingChanges, clearPendingChanges } from "@/lib/githubSync";
import { commitChangesToGitHub } from "@/app/actions/github";
import { useToast } from "@/hooks/use-toast";

interface AdminContextType {
  logout: () => void;
}

export const AdminSessionContext = createContext<AdminContextType | null>(null);

export function AdminSessionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    // Sync pending changes before logging out
    const pendingChanges = getPendingChanges();
    
    if (pendingChanges.length > 0) {
      try {
        const result = await commitChangesToGitHub(pendingChanges);
        
        if (!result.success) {
          toast({
            title: "Logout Failed",
            description: result.error || "Failed to commit pending changes. Please try again or discard changes.",
            variant: "destructive",
          });
          return; // Abort logout
        }
        
        // Only clear if successful
        clearPendingChanges();
        
      } catch (error) {
        toast({
          title: "Logout Failed",
          description: error instanceof Error ? error.message : "An unexpected error occurred during sync.",
          variant: "destructive",
        });
        return; // Abort logout
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
