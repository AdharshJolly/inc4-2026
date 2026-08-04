import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Trash2 } from "lucide-react";
import { ActivityLogger } from "@/lib/activityLogger";
import { adminDbUpdate, adminDbDelete } from "@/app/actions/db";
import { createClient } from "@/utils/supabase/client";

interface BulkActionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "members" | "speakers";
  selectedIds: string[];
  selectedNames: string[];
  onActionComplete?: () => void;
}

export const BulkActionsDialog = ({
  open,
  onOpenChange,
  type,
  selectedIds,
  selectedNames,
  onActionComplete,
}: BulkActionsDialogProps) => {
  const [action, setAction] = useState<"delete" | "export" | "category">("delete");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    if (open && type === "members") {
      const fetchCategories = async () => {
        const { data } = await supabase.from("committee_categories").select("*");
        if (data) setCategories(data);
      };
      fetchCategories();
    }
  }, [open, type, supabase]);

  const handleBulkDelete = async () => {
    const table = type === "members" ? "committee_members" : "speakers";
    
    // Delete items from Supabase
    for (const id of selectedIds) {
      await adminDbDelete(table, id);
    }

    ActivityLogger.log({
      action: `Bulk deleted ${selectedIds.length} ${type}`,
      type: type === "members" ? "member" : "speaker",
      targetName: `${selectedIds.length} ${type}`,
      status: "success",
    });

    onOpenChange(false);
    onActionComplete?.();
  };

  const handleBulkCategoryChange = async () => {
    if (!selectedCategory) return;

    for (const id of selectedIds) {
      await adminDbUpdate("committee_members", id, { category_id: selectedCategory });
    }

    ActivityLogger.log({
      action: `Bulk moved ${selectedIds.length} committee members`,
      type: "member",
      targetName: `${selectedIds.length} members to ${
        categories.find((c) => c.id === selectedCategory)?.label ||
        selectedCategory
      }`,
      status: "success",
    });

    onOpenChange(false);
    onActionComplete?.();
  };

  const handleExport = async () => {
    let csvContent = "data:text/csv;charset=utf-8,";

    if (type === "members") {
      csvContent += "Name,Role,Affiliation,Category\n";
      
      const { data: members } = await supabase
        .from("committee_members")
        .select("*, committee_categories(label)")
        .in("id", selectedIds);
      
      if (members) {
        members.forEach((member) => {
          const row = [
            member.name,
            member.role || "",
            member.affiliation || "",
            member.committee_categories?.label || "",
          ];
          csvContent += row
            .map((field) => `"${field}"`)
            .join(",")
            .concat("\n");
        });
      }
    } else {
      csvContent += "Name,Role,Affiliation,Topic\n";
      const { data: speakers } = await supabase
        .from("speakers")
        .select("*")
        .in("id", selectedIds);

      if (speakers) {
        speakers.forEach((speaker) => {
          const row = [
            speaker.name,
            speaker.role || "",
            speaker.affiliation || "",
            speaker.topic || "",
          ];
          csvContent += row
            .map((field) => `"${field}"`)
            .join(",")
            .concat("\n");
        });
      }
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `bulk_export_${type}_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    ActivityLogger.log({
      action: `Bulk exported ${selectedIds.length} ${type}`,
      type: type === "members" ? "member" : "speaker",
      targetName: `${selectedIds.length} ${type}`,
      status: "success",
    });

    onOpenChange(false);
    onActionComplete?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Bulk Actions ({selectedIds.length} item
            {selectedIds.length !== 1 ? "s" : ""} selected)
          </DialogTitle>
          <DialogDescription>
            Selected: {selectedNames.slice(0, 3).join(", ")}
            {selectedNames.length > 3 && ` +${selectedNames.length - 3} more`}
          </DialogDescription>
        </DialogHeader>

        {!showConfirm ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="bulk-action">Choose Action</Label>
              <Select
                value={action}
                onValueChange={(value: any) => setAction(value)}
              >
                <SelectTrigger id="bulk-action">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="delete">Delete Selected</SelectItem>
                  <SelectItem value="export">Export to CSV</SelectItem>
                  {type === "members" && (
                    <SelectItem value="category">Move to Category</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {action === "category" && type === "members" && (
              <div>
                <Label htmlFor="target-category">Target Category *</Label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger id="target-category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {action === "delete" && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-red-600">
                    This action cannot be undone
                  </p>
                  <p className="text-red-600/80 text-xs mt-1">
                    {selectedIds.length}{" "}
                    {type === "members" ? "committee member" : "speaker"}
                    {selectedIds.length !== 1 ? "s" : ""} will be permanently
                    deleted.
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (action === "delete") {
                    setShowConfirm(true);
                  } else if (action === "export") {
                    handleExport();
                  } else if (action === "category") {
                    handleBulkCategoryChange();
                  }
                }}
                variant={action === "delete" ? "destructive" : "default"}
                disabled={action === "category" && !selectedCategory}
              >
                {action === "delete"
                  ? "Delete"
                  : action === "export"
                  ? "Export"
                  : "Move"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-sm font-medium text-red-600">
                Confirm Deletion
              </p>
              <p className="text-xs text-red-600/80 mt-2">
                Are you sure you want to permanently delete these{" "}
                {selectedIds.length} item{selectedIds.length !== 1 ? "s" : ""}?
                This action cannot be undone.
              </p>
              <div className="mt-3 space-y-1">
                {selectedNames.map((name) => (
                  <p key={name} className="text-xs text-red-600/70">
                    • {name}
                  </p>
                ))}
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => setShowConfirm(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleBulkDelete}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete {selectedIds.length} Item
                {selectedIds.length !== 1 ? "s" : ""}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
