"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";

interface AdminContextType {
  logout: () => void;
}

export const AdminSessionContext = createContext<AdminContextType | null>(null);

export function AdminSessionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    // Release the admin lock
    const supabase = createClient();
    await supabase.from("admin_lock").update({ locked_by: null }).eq("id", 1);
    
    await logoutAction();
    router.refresh(); // Clear server cache/state
    router.push("/admin/login");
  };

  // Heartbeat to maintain admin lock
  useEffect(() => {
    const supabase = createClient();
    
    // Get unique identifier for this session
    let sessionId = sessionStorage.getItem("admin_session_id");
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem("admin_session_id", sessionId);
    }
    
    // Set the lock immediately
    supabase.from("admin_lock").update({ 
      locked_by: sessionId, 
      last_active_at: new Date().toISOString() 
    }).eq("id", 1);
    
    // Refresh the lock every 15 seconds
    const interval = setInterval(async () => {
      await supabase.from("admin_lock").update({ 
        locked_by: sessionId, 
        last_active_at: new Date().toISOString() 
      }).eq("id", 1);
    }, 15000);
    
    // Release lock on unmount (when closing tab or navigating away)
    const cleanup = () => {
      supabase.from("admin_lock").update({ locked_by: null }).eq("id", 1);
    };
    
    window.addEventListener("beforeunload", cleanup);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", cleanup);
      // Wait, we don't necessarily want to release if just navigating within admin
      // But if we unmount the whole provider (e.g. going to public pages) we should release
      cleanup();
    };
  }, []);

  return (
    <AdminSessionContext.Provider value={{ logout: handleLogout }}>
      {children}
    </AdminSessionContext.Provider>
  );
}
