import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ActivityLogger } from "@/lib/activityLogger";
import { createClient } from "@/utils/supabase/client";

interface AddDateFormData {
  event: string;
  date: string;
  isHighlight: boolean;
  description?: string;
  actionText?: string;
  actionUrl?: string;
}

interface AddDatesDialogProps {
  onDateAdded?: (date: any) => void;
}

export const AddDatesDialog = ({ onDateAdded }: AddDatesDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const { toast } = useToast();
  const supabase = createClient();
  const [formData, setFormData] = useState<AddDateFormData>({
    event: "",
    date: "",
    isHighlight: false,
    description: "",
    actionText: "",
    actionUrl: "",
  });

  const handleInputChange = (field: keyof AddDateFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleHighlightChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isHighlight: checked }));
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const formattedDate = formatDate(date);
      setFormData((prev) => ({ ...prev, date: formattedDate }));
      setSelectedDate(date);
    }
  };

  const handleSubmit = async () => {
    if (!formData.event.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter an event name",
        variant: "destructive",
      });
      return;
    }

    if (!formData.date.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a date",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: maxOrderData } = await supabase
        .from("important_dates")
        .select("order_index")
        .order("order_index", { ascending: false })
        .limit(1)
        .single();
      
      const newOrderIndex = maxOrderData && maxOrderData.order_index !== null ? maxOrderData.order_index + 1 : 0;

      const { data, error } = await supabase.from("important_dates").insert({
        event: formData.event,
        event_date: formData.date,
        is_highlight: formData.isHighlight,
        description: formData.description?.trim() || null,
        action_text: formData.actionText?.trim() || null,
        action_url: formData.actionUrl?.trim() || null,
        order_index: newOrderIndex
      }).select().single();

      if (error) throw error;

      ActivityLogger.log({
        action: "Added new event date",
        type: "date",
        targetName: formData.event,
        status: "success",
      });

      toast({
        title: "Success",
        description: `Event "${formData.event}" added successfully!`,
      });

      onDateAdded?.(data);

      setFormData({
        event: "",
        date: "",
        isHighlight: false,
        description: "",
        actionText: "",
        actionUrl: "",
      });

      setOpen(false);
    } catch (error) {
      console.error("Error adding date:", error);
      toast({
        title: "Error",
        description: "Failed to add event date. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-primary hover:bg-primary/90"
          aria-label="Add new event date"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Event Date
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Event Date</DialogTitle>
          <DialogDescription>
            Add a new important date to the event timeline.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="event" className="text-sm font-medium">
              Event Name *
            </Label>
            <Input
              id="event"
              placeholder="e.g., Registration Opens"
              value={formData.event}
              onChange={(e) => handleInputChange("event", e.target.value)}
              aria-label="Event name"
              aria-required="true"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium">
              Date *
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  aria-label="Pick event date"
                  aria-required="true"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date || "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={(date) => date < new Date("1900-01-01")}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2 flex flex-row items-center space-x-2">
            <Checkbox
              id="add-isHighlight"
              checked={formData.isHighlight}
              onCheckedChange={(checked) => handleHighlightChange(!!checked)}
            />
            <Label htmlFor="add-isHighlight" className="!mt-0">
              Highlight Event
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description (optional)
            </Label>
            <textarea
              id="description"
              className="w-full min-h-24 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Details shown in calendar events (Google/ICS)."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
          </div>

          <div className="space-y-4 rounded-lg border border-border p-4 bg-secondary/10">
            <div>
              <h4 className="text-sm font-medium">Action Button (Optional)</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Add a primary button to the date card that links to a specific page (e.g., a registration portal, submission system, or detailed schedule).
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="actionText" className="text-sm font-medium">
                  Button Label
                </Label>
                <Input
                  id="actionText"
                  placeholder="e.g., Submit Paper, Register Now"
                  value={formData.actionText}
                  onChange={(e) => handleInputChange("actionText", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="actionUrl" className="text-sm font-medium">
                  Destination URL
                </Label>
                <Input
                  id="actionUrl"
                  placeholder="e.g., https://ic4.co.in/registration"
                  value={formData.actionUrl}
                  onChange={(e) => handleInputChange("actionUrl", e.target.value)}
                />
              </div>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90"
            aria-label="Submit new event date"
          >
            {isSubmitting ? "Adding..." : "Add Event Date"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
