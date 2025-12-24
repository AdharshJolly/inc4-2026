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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import datesData from "@/data/important-dates.json";
import { storePendingChange } from "@/lib/githubSync";
import { ActivityLogger } from "@/lib/activityLogger";
import type { ImportantDatesData } from "@/types/data";

interface AddDateFormData {
  event: string;
  date: string;
  status: "upcoming" | "completed" | "highlight";
}

interface AddDatesDialogProps {
  onDateAdded?: (date: AddDateFormData) => void;
}

export const AddDatesDialog = ({ onDateAdded }: AddDatesDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState<AddDateFormData>({
    event: "",
    date: "",
    status: "upcoming",
  });

  const handleInputChange = (field: keyof AddDateFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStatusChange = (
    value: "upcoming" | "completed" | "highlight"
  ) => {
    setFormData((prev) => ({ ...prev, status: value }));
  };

  const handleSubmit = async () => {
    // Validation
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

    if (!formData.status) {
      toast({
        title: "Validation Error",
        description: "Please select a status",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const dates = (datesData as ImportantDatesData).root;

      // Create new date object
      const newDate = {
        event: formData.event,
        date: formData.date,
        status: formData.status,
      };

      // Add to dates in memory
      dates.push(newDate);

      // Store pending change for GitHub commit on logout
      const updatedDates = JSON.stringify(datesData, null, 2);
      storePendingChange({
        path: "src/data/important-dates.json",
        content: updatedDates,
        message: `Added new event date: ${formData.event}`,
      });

      // Log the action
      ActivityLogger.log({
        action: "Added new event date",
        type: "date",
        targetName: formData.event,
        status: "success",
      });

      toast({
        title: "Success",
        description: `Event "${formData.event}" added successfully! Changes will sync to GitHub when you log out.`,
      });

      onDateAdded?.(formData);

      // Reset form
      setFormData({
        event: "",
        date: "",
        status: "upcoming",
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
          className="bg-orange-500 hover:bg-orange-600"
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
          {/* Event Name */}
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

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium">
              Date *
            </Label>
            <Input
              id="date"
              placeholder="e.g., January 15, 2026"
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              aria-label="Event date"
              aria-required="true"
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium">
              Status *
            </Label>
            <Select
              value={formData.status}
              onValueChange={handleStatusChange as (value: string) => void}
            >
              <SelectTrigger
                id="status"
                aria-label="Event status"
                aria-required="true"
              >
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="highlight">Highlight</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-orange-500 hover:bg-orange-600"
            aria-label="Submit new event date"
          >
            {isSubmitting ? "Adding..." : "Add Event Date"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
