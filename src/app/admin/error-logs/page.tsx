"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { getLogs, clearLogs, exportLogs } from "@/lib/errorLogger";
import type { ErrorLog } from "@/lib/errorLogger";
import { useEffect, useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { AdminShell } from "@/components/admin/AdminShell";

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

type LevelFilter = "all" | "error" | "warning" | "info";

export default function ErrorLogsPage() {
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

  return (
    <AdminShell>
      {/* Header */}
      <header className="sticky top-0 z-30 h-14 bg-background/80 backdrop-blur-xl border-b border-border/60 flex items-center px-8 gap-4">
        <span className="font-medium text-foreground">Error Logs</span>
      </header>

      <main className="flex-1 px-8 py-8">
        <div className="max-w-6xl">
          <div className="mb-6">
            <h1 className="text-2xl font-black tracking-tight text-foreground">Error Logs</h1>
            <p className="text-muted-foreground text-sm mt-1">View and manage application error logs.</p>
          </div>

          <Card className="border-primary/20 shadow-sm">
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
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <AlertCircle className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground mb-1">No logs found</p>
                  <p className="text-xs text-muted-foreground">Once errors occur, they will appear here for review.</p>
                </div>
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
                                    <pre className="whitespace-pre-wrap text-xs overflow-auto">
                                      {JSON.stringify(log.context || {}, null, 2)}
                                    </pre>
                                    <div className="font-semibold">Stack</div>
                                    <pre className="whitespace-pre-wrap text-xs overflow-auto">
                                      {log.stack || "-"}
                                    </pre>
                                    <div className="font-semibold">
                                      Breadcrumbs
                                    </div>
                                    <pre className="whitespace-pre-wrap text-xs overflow-auto">
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
      </main>
    </AdminShell>
  );
}
