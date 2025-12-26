"use client";

import { useContext } from "react";
import { PageTitle } from "@/components/PageTitle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ActivityLog } from "@/components/Admin/ActivityLog";
import { AdminSessionContext } from "../AdminSessionProvider";
import { PendingChangesCounter } from "@/components/Admin/PendingChangesCounter";

export default function ActivityLogPage() {
  const session = useContext(AdminSessionContext);

  return (
    <div className="min-h-screen bg-background pt-[110px]">
      <div className="container mx-auto px-4 pb-4 flex items-center justify-between">
        <PageTitle title="Activity Log" />
        <div className="flex items-center gap-3">
          <PendingChangesCounter />
          {session?.logout && (
            <Button
              onClick={session.logout}
              variant="outline"
              size="sm"
              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            >
              Logout
            </Button>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 pb-20">
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Admin Activity Audit Trail</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityLog />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
