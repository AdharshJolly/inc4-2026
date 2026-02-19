import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Trash2 } from "lucide-react";
import { ActivityLogger } from "@/lib/activityLogger";
import { storePendingChange } from "@/lib/githubSync";
import committeeData from "@/data/committee.json";
import speakersData from "@/data/speakers.json";
import type { CommitteeData, SpeakersData } from "@/types/data";

interface BulkActionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "members" | "speakers";
  selectedIds: string[]; // Format: "categoryId-index" for members, "index" for speakers
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
  const [action, setAction] = useState<"delete" | "export" | "category">(
    "delete"
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [showConfirm, setShowConfirm] = useState(false);

  const committee = (committeeData as CommitteeData).root;
  const speakers = (speakersData as SpeakersData).root;

  const handleBulkDelete = () => {
    if (type === "members") {
      // Delete selected members
      const itemsToDelete = selectedIds.map((id) => {
        const [categoryId, index] = id.split("-");
        return { categoryId, index: parseInt(index) };
      });

      // Sort by index descending to avoid index shift issues
      itemsToDelete.sort((a, b) => b.index - a.index);

      itemsToDelete.forEach(({ categoryId, index }) => {
        const category = committee.find((c) => c.id === categoryId);
        if (category) {
          category.members.splice(index, 1);
        }
      });

      // Store pending change for GitHub commit
      const updatedCommittee = JSON.stringify(committeeData, null, 2);
      storePendingChange({
        path: "src/data/committee.json",
        content: updatedCommittee,
        message: `Deleted ${selectedIds.length} committee members`,
      });

      ActivityLogger.log({
        action: `Bulk deleted ${selectedIds.length} committee members`,
        type: "member",
        targetName: `${selectedIds.length} members`,
        status: "success",
      });
    } else {
      // Delete selected speakers
      const indices = selectedIds
        .map((id) => parseInt(id))
        .sort((a, b) => b - a);

      indices.forEach((index) => {
        speakers.splice(index, 1);
      });

      // Store pending change for GitHub commit
      const updatedSpeakers = JSON.stringify(speakersData, null, 2);
      storePendingChange({
        path: "src/data/speakers.json",
        content: updatedSpeakers,
        message: `Deleted ${selectedIds.length} speakers`,
      });

      ActivityLogger.log({
        action: `Bulk deleted ${selectedIds.length} speakers`,
        type: "speaker",
        targetName: `${selectedIds.length} speakers`,
        status: "success",
      });
    }

    onOpenChange(false);
    onActionComplete?.();
  };

  const handleBulkCategoryChange = () => {
    if (!selectedCategory) return;

    const itemsToUpdate = selectedIds.map((id) => {
      const [categoryId, index] = id.split("-");
      return { categoryId, index: parseInt(index) };
    });

    itemsToUpdate.forEach(({ categoryId, index }) => {
      const currentCategory = committee.find((c) => c.id === categoryId);
      const newCategory = committee.find((c) => c.id === selectedCategory);

      if (currentCategory && newCategory) {
        const member = currentCategory.members[index];
        if (member) {
          currentCategory.members.splice(index, 1);
          newCategory.members.push(member);
        }
      }
    });

    // Store pending change for GitHub commit
    const updatedCommittee = JSON.stringify(committeeData, null, 2);
    storePendingChange({
      path: "src/data/committee.json",
      content: updatedCommittee,
      message: `Moved ${selectedIds.length} committee members to ${
        committee.find((c) => c.id === selectedCategory)?.label
      }`,
    });

    ActivityLogger.log({
      action: `Bulk moved ${selectedIds.length} committee members`,
      type: "member",
      targetName: `${selectedIds.length} members to ${
        committee.find((c) => c.id === selectedCategory)?.label ||
        selectedCategory
      }`,
      status: "success",
    });

    onOpenChange(false);
    onActionComplete?.();
  };

  const handleExport = () => {
    let csvContent = "data:text/csv;charset=utf-8,";

    if (type === "members") {
      csvContent += "Name,Role,Affiliation,Category\n";
      const itemsToExport = selectedIds.map((id) => {
        const [categoryId, index] = id.split("-");
        const category = committee.find((c) => c.id === categoryId);
        const member = category?.members[parseInt(index)];
        return member;
      });

      itemsToExport.forEach((member) => {
        if (member) {
          const row = [
            member.name,
            member.role || "",
            member.affiliation || "",
            selectedIds
              .map((id) => {
                const [categoryId] = id.split("-");
                return committee.find((c) => c.id === categoryId)?.label;
              })
              .join(", "),
          ];
          csvContent += row
            .map((field) => `"${field}"`)
            .join(",")
            .concat("\n");
        }
      });
    } else {
      csvContent += "Name,Role,Affiliation,Topic\n";
      const itemsToExport = selectedIds.map((id) => speakers[parseInt(id)]);

      itemsToExport.forEach((speaker) => {
        if (speaker) {
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
        }
      });
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
                    {committee.map((cat) => (
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
