import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getPendingChanges, clearPendingChanges, commitChangesToGitHub } from "@/lib/githubSync";
import { useToast } from "@/hooks/use-toast";
import { FileEdit, Trash2, AlertTriangle, Upload, Loader2 } from "lucide-react";

export const PendingChangesCounter = () => {
  const [count, setCount] = useState(0);
  const [changes, setChanges] = useState<
    Array<{ path: string; content: string; message: string }>
  >([]);
  const [open, setOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  const updateChanges = () => {
    const pending = getPendingChanges();
    setCount(pending.length);
    setChanges(pending);
  };

  useEffect(() => {
    updateChanges();

    // Poll for changes every 2 seconds
    const interval = setInterval(updateChanges, 2000);

    // Listen for storage events from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "pendingGitHubChanges") {
        updateChanges();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleDiscardChanges = () => {
    clearPendingChanges();
    updateChanges();
    setShowConfirm(false);
    setOpen(false);
    toast({
      title: "Changes Discarded",
      description: "All pending changes have been cleared.",
      variant: "default",
    });
  };

  const handleSyncToGitHub = async () => {
    if (changes.length === 0) return;
    
    setIsSyncing(true);
    try {
      const result = await commitChangesToGitHub(changes);
      
      if (result.success) {
        clearPendingChanges();
        updateChanges();
        setOpen(false);
        toast({
          title: "Synced to GitHub",
          description: `Successfully committed ${changes.length} file(s) to GitHub.`,
          variant: "default",
        });
      } else {
        toast({
          title: "Sync Failed",
          description: result.error || "Failed to sync changes to GitHub.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  if (count === 0) return null;

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="relative border-orange-500/30 bg-orange-500/5 hover:bg-orange-500/10 text-orange-600 hover:text-orange-700"
          >
            <FileEdit className="w-4 h-4 mr-2" />
            <span className="font-semibold">{count}</span>
            <span className="ml-1">pending</span>
            <Badge className="ml-2 bg-orange-500 text-white px-2 py-0.5 text-xs">
              {count}
            </Badge>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96" align="end">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm">Pending Changes</h4>
              <Badge
                variant="secondary"
                className="bg-orange-500/10 text-orange-600"
              >
                {count} file{count !== 1 ? "s" : ""}
              </Badge>
            </div>

            <p className="text-xs text-muted-foreground">
              These changes will be committed to GitHub when you log out.
            </p>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {changes.map((change, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-md border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <p className="text-xs font-mono text-orange-600 mb-1 truncate">
                    {change.path.split("/").pop()}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {change.message}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                onClick={handleSyncToGitHub}
                disabled={isSyncing}
              >
                {isSyncing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                {isSyncing ? "Syncing..." : "Sync to GitHub"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                onClick={() => setShowConfirm(true)}
                disabled={isSyncing}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Discard All Changes
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Discard Pending Changes?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all {count} pending change
              {count !== 1 ? "s" : ""}. This action cannot be undone. Your
              changes will not be committed to GitHub.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDiscardChanges}
              className="bg-red-600 hover:bg-red-700"
            >
              Discard Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
