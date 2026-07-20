"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityLog } from "@/components/admin/ActivityLog";
import { AdminShell } from "@/components/admin/AdminShell";

export default function ActivityLogPage() {
  return (
    <AdminShell>
      {/* Header */}
      <header className="sticky top-0 z-30 h-14 bg-background/80 backdrop-blur-xl border-b border-border/60 flex items-center px-8 gap-4">
        <span className="font-medium text-foreground">Activity Log</span>
      </header>

      <main className="flex-1 px-8 py-8">
        <div className="max-w-6xl">
          <div className="mb-6">
            <h1 className="text-2xl font-black tracking-tight text-foreground">Activity Log</h1>
            <p className="text-muted-foreground text-sm mt-1">View admin activity audit trail.</p>
          </div>

          <Card className="border-primary/20 shadow-sm">
            <CardHeader>
              <CardTitle>Admin Activity Audit Trail</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityLog />
            </CardContent>
          </Card>
        </div>
      </main>
    </AdminShell>
  );
}
