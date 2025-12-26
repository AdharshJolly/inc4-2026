"use client";

import { useEffect, useMemo, useState, useContext } from "react";
import { PageTitle } from "@/components/PageTitle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { AdminSessionContext } from "../AdminSessionProvider";
import { useToast } from "@/hooks/use-toast";
import {
  getLogs,
  getBreadcrumbs,
  clearLogs,
  exportLogs,
  type ErrorLog,
} from "@/lib/errorLogger";
import { createGitHubIssue } from "@/app/actions/github";
import { PendingChangesCounter } from "@/components/Admin/PendingChangesCounter";

type LevelFilter = "all" | "error" | "warning" | "info";

export default function ErrorLogsPage() {
  const session = useContext(AdminSessionContext);
  const { toast } = useToast();

  const [logs, setLogs] = useState<ErrorLog[]>([]);
  const [filter, setFilter] = useState<LevelFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setLogs(getLogs());
  }, []);

  const filtered = useMemo(() => {
    if (filter === "all") return logs.slice().reverse();
    return logs
      .filter((l) => l.level === filter)
      .slice()
      .reverse();
  }, [logs, filter]);

  const selectedLog = useMemo(() => {
    return filtered.find((l) => l.id === selectedId) || filtered[0] || null;
  }, [filtered, selectedId]);

  const levelBadge = (level: ErrorLog["level"]) => {
    const map: Record<ErrorLog["level"], string> = {
      error: "bg-red-500/15 text-red-600",
      warning: "bg-yellow-500/15 text-yellow-700",
      info: "bg-blue-500/15 text-blue-700",
    };
    return <Badge className={map[level]}>{level.toUpperCase()}</Badge>;
  };

  const exportToFile = () => {
    const data = exportLogs();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inc4-error-logs-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Exported logs",
      description: "Downloaded JSON with logs and breadcrumbs.",
    });
  };

  const handleClear = () => {
    clearLogs();
    setLogs([]);
    setSelectedId(null);
    toast({
      title: "Cleared logs",
      description: "All error logs and breadcrumbs removed.",
    });
  };

  const handleCreateIssue = async () => {
    const log =
      selectedLog || filtered.find((l) => l.level === "error") || null;
    if (!log) {
      toast({
        title: "No error selected",
        description: "Select a log row or ensure an error exists.",
        variant: "destructive",
      });
      return;
    }

    const breadcrumbs = getBreadcrumbs();
    const body = [
      `Time: ${new Date(log.timestamp).toISOString()}`,
      `Level: ${log.level}`,
      `Message: ${log.message}`,
      `URL: ${log.url || "-"}`,
      `UserAgent: ${log.userAgent || "-"}`,
      `Session: ${log.sessionId || "-"}`,
      "",
      "Context:",
      "```json",
      JSON.stringify(log.context || {}, null, 2),
      "```",
      "",
      "Stack:",
      "```",
      log.stack || "-",
      "```",
      "",
      "Recent Breadcrumbs:",
      "```json",
      JSON.stringify(breadcrumbs.slice(-20), null, 2),
      "```",
    ].join("\n");

    const res = await createGitHubIssue({
      title: `Admin Error: ${log.message.slice(0, 80)}`,
      body,
      labels: ["bug", "admin", "observability"],
    });

    if (res.success) {
      toast({ title: "Issue created", description: res.url });
    } else {
      toast({
        title: "Failed to create issue",
        description: res.error || "Unknown error",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pt-[110px]">
      <div className="container mx-auto px-4 pb-4 flex items-center justify-between">
        <PageTitle title="Error Logs" />
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
          <CardHeader className="space-y-3">
            <CardTitle className="flex items-center justify-between">
              <span>Application Error Logs</span>
              <div className="flex gap-2">
                <Button variant="outline" onClick={exportToFile}>
                  Export JSON
                </Button>
                <Button
                  variant="outline"
                  onClick={handleClear}
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                >
                  Clear All
                </Button>
                <Button onClick={handleCreateIssue}>Create GitHub Issue</Button>
              </div>
            </CardTitle>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Filter:</span>
              <Select
                value={filter}
                onValueChange={(v) => setFilter(v as LevelFilter)}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {filtered.length === 0 ? (
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No logs found</AlertTitle>
                <AlertDescription>
                  Once errors occur, they will appear here for review.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead style={{ width: 120 }}>Time</TableHead>
                      <TableHead style={{ width: 110 }}>Level</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead style={{ width: 220 }}>URL</TableHead>
                      <TableHead style={{ width: 140 }}>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((log) => (
                      <TableRow
                        key={log.id}
                        className={
                          selectedId === log.id ? "bg-muted/40" : undefined
                        }
                      >
                        <TableCell className="text-xs whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell>{levelBadge(log.level)}</TableCell>
                        <TableCell className="text-sm">{log.message}</TableCell>
                        <TableCell className="text-xs truncate" title={log.url}>
                          {log.url || "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedId(log.id)}
                            >
                              Select
                            </Button>
                            <Collapsible>
                              <CollapsibleTrigger asChild>
                                <Button variant="outline" size="sm">
                                  Details
                                </Button>
                              </CollapsibleTrigger>
                              <CollapsibleContent className="mt-2">
                                <div className="text-xs p-3 border rounded-md bg-muted/30 space-y-2">
                                  <div>
                                    <span className="font-semibold">
                                      Session:
                                    </span>{" "}
                                    {log.sessionId || "-"}
                                  </div>
                                  <div>
                                    <span className="font-semibold">
                                      UserAgent:
                                    </span>{" "}
                                    {log.userAgent || "-"}
                                  </div>
                                  <Separator className="my-2" />
                                  <div className="font-semibold">Context</div>
                                  <pre className="whitespace-pre-wrap text-[11px] overflow-auto">
                                    {JSON.stringify(log.context || {}, null, 2)}
                                  </pre>
                                  <div className="font-semibold">Stack</div>
                                  <pre className="whitespace-pre-wrap text-[11px] overflow-auto">
                                    {log.stack || "-"}
                                  </pre>
                                  <div className="font-semibold">
                                    Breadcrumbs
                                  </div>
                                  <pre className="whitespace-pre-wrap text-[11px] overflow-auto">
                                    {JSON.stringify(
                                      log.breadcrumbs || [],
                                      null,
                                      2
                                    )}
                                  </pre>
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
