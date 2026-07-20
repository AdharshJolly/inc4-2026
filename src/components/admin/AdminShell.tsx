"use client";

import { useContext } from "react";
import { AdminSessionContext } from "@/app/admin/AdminSessionProvider";
import {
  ExternalLink,
  LogOut,
  Layers,
} from "lucide-react";

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const session = useContext(AdminSessionContext);

  return (
    <div className="min-h-screen bg-background flex text-sm">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-60 bg-card/80 backdrop-blur-xl border-r border-border/60 flex flex-col z-40">
        {/* Brand */}
        <div className="px-5 pt-6 pb-5 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/30">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-black text-foreground leading-none">InC4 2026</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-widest">Admin</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-3 pb-5 pt-3 border-t border-border/60 space-y-0.5 mt-auto">
          <button
            onClick={() => window.open("/", "_blank")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-150"
          >
            <ExternalLink className="w-4 h-4 shrink-0" />
            View Live Site
          </button>
          {session?.logout && (
            <button
              onClick={session.logout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-500/8 transition-all duration-150"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              Sign Out
            </button>
          )}
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 ml-60 min-h-screen flex flex-col">
        {children}
      </div>
    </div>
  );
}
