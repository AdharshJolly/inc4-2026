import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, Info, CheckCircle, Clock, Download, Trash2 } from "lucide-react";
import { ActivityLogger, ActivityLogEntry } from "@/lib/activityLogger";
import { useState, useEffect } from "react";

export const ActivityLog = () => {
  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
  const [filter, setFilter] = useState<"all" | "24h" | "7d">("24h");

  useEffect(() => {
    const allLogs = ActivityLogger.getAll();
    const filtered =
      filter === "all"
        ? allLogs
        : filter === "24h"
        ? ActivityLogger.getRecent(24)
        : ActivityLogger.getRecent(24 * 7);

    setLogs(filtered);
  }, [filter]);

  const handleExport = () => {
    ActivityLogger.export();
  };

  const handleClear = () => {
    if (
      confirm(
        "Are you sure you want to clear all activity logs? This cannot be undone."
      )
    ) {
      ActivityLogger.clear();
      setLogs([]);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            Activity Log
          </CardTitle>
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="text-sm border border-border rounded px-2 py-1 bg-background"
            >
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="all">All time</option>
            </select>
            <Button
              size="sm"
              variant="outline"
              onClick={handleExport}
              title="Export activity log as JSON"
            >
              <Download className="w-3 h-3 mr-1" />
              Export
            </Button>
            {logs.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleClear}
                className="text-red-500 hover:text-red-600"
                title="Clear all activity logs"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {logs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No activity logs found for this period.</p>
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-primary/5 transition-colors"
              >
                <div className="mt-0.5">{getStatusIcon(log.status)}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium">{log.action}</p>
                    <Badge variant="outline" className="text-xs">
                      {log.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {log.targetName}
                  </p>

                  {log.changes && Object.keys(log.changes).length > 0 && (
                    <div className="text-xs text-muted-foreground mt-2 space-y-1">
                      {Object.entries(log.changes).map(([field, change]) => (
                        <div key={field} className="ml-3 border-l border-border pl-2">
                          <span className="font-medium">{field}:</span>{" "}
                          <span className="line-through text-red-600">
                            {String(change.old)}
                          </span>{" "}
                          →{" "}
                          <span className="text-green-600">
                            {String(change.new)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatTime(log.timestamp)}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
