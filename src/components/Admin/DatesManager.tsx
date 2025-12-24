import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Calendar as CalendarIcon,
  Edit,
  Trash2,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import datesData from "@/data/important-dates.json";
import type { ImportantDatesData, ImportantDateItem } from "@/types/data";
import { AddDatesDialog } from "./AddDatesDialog";
import { useToast } from "@/hooks/use-toast";
import { storePendingChange } from "@/lib/githubSync";
import { ActivityLogger } from "@/lib/activityLogger";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as DatePicker } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

export const DatesManager = () => {
  const initialDates = useMemo(
    () => (datesData as ImportantDatesData).root || [],
    []
  );
  const [dates, setDates] = useState<ImportantDateItem[]>(() =>
    structuredClone(initialDates)
  );
  const { toast } = useToast();

  const [editOpen, setEditOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [editForm, setEditForm] = useState<ImportantDateItem>({
    event: "",
    date: "",
    status: "upcoming",
    description: "",
  });
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState<number | null>(
    null
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "highlight":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      default:
        return "bg-muted";
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleAddDate = (newDate: ImportantDateItem) => {
    const newDates = [...dates, newDate];
    setDates(newDates);

    const updatedData = { root: newDates };
    storePendingChange({
      path: "src/data/important-dates.json",
      content: JSON.stringify(updatedData, null, 2),
      message: `Added event date: ${newDate.event}`,
    });
  };

  const openEdit = (index: number) => {
    const d = dates[index];
    setEditIndex(index);
    setEditForm({ ...d });
    // Try parsing to a Date for picker convenience
    const maybeDate = new Date(d.date);
    setSelectedDate(isNaN(maybeDate.getTime()) ? undefined : maybeDate);
    setEditOpen(true);
  };

  const handleEditDateSelect = (date: Date | undefined) => {
    if (date) {
      const formatted = formatDate(date);
      setEditForm((prev) => ({ ...prev, date: formatted }));
      setSelectedDate(date);
    }
  };

  const saveEdit = () => {
    if (editIndex === null) return;
    const prev = dates[editIndex];
    if (!editForm.event.trim() || !editForm.date.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide both event name and date.",
        variant: "destructive",
      });
      return;
    }

    const updated = [...dates];
    updated[editIndex] = { ...editForm };
    setDates(updated);

    const updatedData = { root: updated };
    storePendingChange({
      path: "src/data/important-dates.json",
      content: JSON.stringify(updatedData, null, 2),
      message: `Updated event date: ${prev.event} → ${editForm.event}`,
    });

    ActivityLogger.log({
      action: "Edited event date",
      type: "date",
      targetName: editForm.event,
      status: "success",
      changes: {
        event: { old: prev.event, new: editForm.event },
        date: { old: prev.date, new: editForm.date },
        status: { old: prev.status, new: editForm.status },
        ...(prev.description !== editForm.description
          ? {
              description: { old: prev.description, new: editForm.description },
            }
          : {}),
      },
    });

    toast({ title: "Saved", description: `Updated "${editForm.event}".` });
    setEditOpen(false);
    setEditIndex(null);
  };

  const confirmDelete = (index: number) => setConfirmDeleteIndex(index);

  const performDelete = () => {
    if (confirmDeleteIndex === null) return;
    const target = dates[confirmDeleteIndex];
    const updated = dates.filter((_, i) => i !== confirmDeleteIndex);
    setDates(updated);

    const updatedData = { root: updated };
    storePendingChange({
      path: "src/data/important-dates.json",
      content: JSON.stringify(updatedData, null, 2),
      message: `Deleted event date: ${target.event}`,
    });

    ActivityLogger.log({
      action: "Deleted event date",
      type: "date",
      targetName: target.event,
      status: "warning",
    });

    toast({ title: "Deleted", description: `Removed "${target.event}".` });
    setConfirmDeleteIndex(null);
  };

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex gap-2">
        <AddDatesDialog onDateAdded={handleAddDate} />
      </div>

      {/* Timeline */}
      <div className="space-y-3">
        {dates.map((date, index) => (
          <div
            key={index}
            className="flex items-start gap-4 p-4 rounded-lg border border-border hover:border-primary/40 hover:bg-primary/5 transition-colors"
          >
            <div
              className={`p-3 rounded-full ${
                date.status === "highlight"
                  ? "bg-orange-500/10"
                  : date.status === "upcoming"
                  ? "bg-blue-500/10"
                  : "bg-green-500/10"
              }`}
            >
              <Calendar
                className={`w-5 h-5 ${
                  date.status === "highlight"
                    ? "text-orange-500"
                    : date.status === "upcoming"
                    ? "text-blue-500"
                    : "text-green-500"
                }`}
              />
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{date.event}</h3>
                  <p className="text-sm text-muted-foreground">{date.date}</p>
                </div>
                <Badge className={getStatusColor(date.status)}>
                  {date.status}
                </Badge>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEdit(index)}
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-500 hover:text-red-600"
                  onClick={() => confirmDelete(index)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Event Date</DialogTitle>
            <DialogDescription>
              Modify the event details and save changes.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-event">Event Name *</Label>
              <Input
                id="edit-event"
                value={editForm.event}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, event: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-date">Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="edit-date"
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {editForm.date || "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <DatePicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleEditDateSelect}
                    defaultMonth={selectedDate}
                    disabled={(date) => date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-status">Status *</Label>
              <Select
                value={editForm.status}
                onValueChange={(v) =>
                  setEditForm((p) => ({
                    ...p,
                    status: v as ImportantDateItem["status"],
                  }))
                }
              >
                <SelectTrigger id="edit-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="highlight">Highlight</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description (optional)</Label>
              <textarea
                id="edit-description"
                className="w-full min-h-24 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Details shown in calendar events (Google/ICS)."
                value={editForm.description || ""}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, description: e.target.value }))
                }
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={saveEdit}
                className="w-full bg-orange-500 hover:bg-orange-600"
              >
                Save Changes
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setEditOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={confirmDeleteIndex !== null}
        onOpenChange={(open) => !open && setConfirmDeleteIndex(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" /> Delete event?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will remove the selected event
              date from the timeline.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={performDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
