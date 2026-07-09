import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isCompleted } from "@/lib/dateUtils";
import {
  Calendar as CalendarIcon,
  Edit,
  Trash2,
  Calendar,
  AlertTriangle,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { AddDatesDialog } from "./AddDatesDialog";
import { useToast } from "@/hooks/use-toast";
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
import { Checkbox } from "@/components/ui/checkbox";
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
import { createClient } from "@/utils/supabase/client";

export type ImportantDateItem = {
  id?: number;
  event: string;
  date: string;
  isHighlight?: boolean;
  description?: string;
  actionText?: string;
  actionUrl?: string;
  order_index?: number;
};

export const DatesManager = () => {
  const [dates, setDates] = useState<ImportantDateItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const supabase = createClient();

  const [editOpen, setEditOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [editForm, setEditForm] = useState<ImportantDateItem>({
    event: "",
    date: "",
    isHighlight: false,
    description: "",
    actionText: "",
    actionUrl: "",
  });
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState<number | null>(null);

  const fetchDates = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("important_dates")
      .select("*")
      .order("order_index", { ascending: true })
      .order("id", { ascending: true });

    if (error) {
      toast({ title: "Error", description: "Failed to load dates.", variant: "destructive" });
    } else if (data) {
      const mapped = data.map((d: any) => ({
        id: d.id,
        event: d.event,
        date: d.event_date,
        isHighlight: d.is_highlight,
        description: d.description,
        actionText: d.action_text,
        actionUrl: d.action_url,
        order_index: d.order_index,
      }));
      setDates(mapped);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDates();
  }, []);

  const getStatusColor = (isHighlight?: boolean, dateStr: string = "") => {
    if (isHighlight) return "bg-orange-500/10 text-orange-500 border-orange-500/20";
    if (isCompleted(dateStr)) return "bg-green-500/10 text-green-500 border-green-500/20";
    return "bg-blue-500/10 text-blue-500 border-blue-500/20";
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleAddDate = (newDate: any) => {
    fetchDates();
  };

  const openEdit = (index: number) => {
    const d = dates[index];
    setEditIndex(index);
    setEditForm({ ...d });
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

  const saveEdit = async () => {
    if (editIndex === null || !editForm.id) return;
    const prev = dates[editIndex];
    if (!editForm.event.trim() || !editForm.date.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide both event name and date.",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("important_dates")
      .update({
        event: editForm.event,
        event_date: editForm.date,
        is_highlight: editForm.isHighlight,
        description: editForm.description || null,
        action_text: editForm.actionText || null,
        action_url: editForm.actionUrl || null,
      })
      .eq("id", editForm.id);

    if (error) {
      toast({ title: "Error", description: "Failed to update date.", variant: "destructive" });
      return;
    }

    ActivityLogger.log({
      action: "Edited event date",
      type: "date",
      targetName: editForm.event,
      status: "success",
    });

    toast({ title: "Saved", description: `Updated "${editForm.event}".` });
    setEditOpen(false);
    setEditIndex(null);
    fetchDates();
  };

  const confirmDelete = (index: number) => setConfirmDeleteIndex(index);

  const performDelete = async () => {
    if (confirmDeleteIndex === null) return;
    const target = dates[confirmDeleteIndex];
    if (!target.id) return;

    const { error } = await supabase
      .from("important_dates")
      .delete()
      .eq("id", target.id);

    if (error) {
      toast({ title: "Error", description: "Failed to delete date.", variant: "destructive" });
      return;
    }

    ActivityLogger.log({
      action: "Deleted event date",
      type: "date",
      targetName: target.event,
      status: "warning",
    });

    toast({ title: "Deleted", description: `Removed "${target.event}".` });
    setConfirmDeleteIndex(null);
    fetchDates();
  };

  const moveDate = async (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === dates.length - 1)
    ) return;

    const newDates = [...dates];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap items
    const temp = newDates[index];
    newDates[index] = newDates[swapIndex];
    newDates[swapIndex] = temp;
    
    // Update order_index
    setDates(newDates);

    // Persist to Supabase
    const updates = newDates.map((item, idx) => ({
      id: item.id,
      order_index: idx
    }));

    // Wait for all updates
    await Promise.all(
      updates.map(update => 
        supabase.from("important_dates").update({ order_index: update.order_index }).eq("id", update.id)
      )
    );
    
    toast({ title: "Reordered", description: "Event order updated." });
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <AddDatesDialog onDateAdded={handleAddDate} />
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading dates...</p>
        ) : dates.length === 0 ? (
          <p className="text-sm text-muted-foreground">No dates found.</p>
        ) : (
          dates.map((date, index) => (
            <div
              key={date.id || index}
              className="flex items-start gap-4 p-4 rounded-lg border border-border hover:border-primary/40 hover:bg-primary/5 transition-colors"
            >
              <div
                className={`p-3 rounded-full ${
                  date.isHighlight
                    ? "bg-orange-500/10"
                    : isCompleted(date.date)
                    ? "bg-green-500/10"
                    : "bg-blue-500/10"
                }`}
              >
                <Calendar
                  className={`w-5 h-5 ${
                    date.isHighlight
                      ? "text-orange-500"
                      : isCompleted(date.date)
                      ? "text-green-500"
                      : "text-blue-500"
                  }`}
                />
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{date.event}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(date.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <Badge className={getStatusColor(date.isHighlight, date.date)}>
                    {date.isHighlight ? "Highlight" : isCompleted(date.date) ? "Completed" : "Upcoming"}
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
                    onClick={() => moveDate(index, 'up')}
                    disabled={index === 0}
                  >
                    <ArrowUp className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => moveDate(index, 'down')}
                    disabled={index === dates.length - 1}
                  >
                    <ArrowDown className="w-3 h-3" />
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
          ))
        )}
      </div>

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

            <div className="space-y-2 flex flex-row items-center space-x-2">
              <Checkbox
                id="edit-isHighlight"
                checked={!!editForm.isHighlight}
                onCheckedChange={(checked) =>
                  setEditForm((p) => ({ ...p, isHighlight: !!checked }))
                }
              />
              <Label htmlFor="edit-isHighlight" className="!mt-0">Highlight Event</Label>
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

            <div className="space-y-4 rounded-lg border border-border p-4 bg-secondary/10 mt-4">
              <div>
                <h4 className="text-sm font-medium">Action Button (Optional)</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Add a primary button to the date card that links to a specific page (e.g., a registration portal, submission system, or detailed schedule).
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-actionText">Button Label</Label>
                  <Input
                    id="edit-actionText"
                    placeholder="e.g., Submit Paper, Register Now"
                    value={editForm.actionText || ""}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, actionText: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-actionUrl">Destination URL</Label>
                  <Input
                    id="edit-actionUrl"
                    placeholder="e.g., https://ic4.co.in/registration"
                    value={editForm.actionUrl || ""}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, actionUrl: e.target.value }))
                    }
                  />
                </div>
              </div>
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
