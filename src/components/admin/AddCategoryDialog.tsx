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
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ActivityLogger } from "@/lib/activityLogger";
import { createClient } from "@/utils/supabase/client";

interface AddCategoryDialogProps {
  onCategoryAdded?: () => void;
}

export const AddCategoryDialog = ({
  onCategoryAdded,
}: AddCategoryDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [label, setLabel] = useState("");
  const supabase = createClient();

  const handleSubmit = async () => {
    if (!label.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a category name",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: maxData } = await supabase
        .from("committee_categories")
        .select("order_index")
        .order("order_index", { ascending: false })
        .limit(1);
      
      const newIndex = maxData && maxData.length > 0 ? maxData[0].order_index + 1 : 0;

      const { error } = await supabase.from("committee_categories").insert({
        label: label,
        order_index: newIndex,
      });

      if (error) throw error;

      ActivityLogger.log({
        action: "Added new committee category",
        type: "category",
        targetName: label,
        status: "success",
      });

      toast({
        title: "Success",
        description: `Category "${label}" added successfully!`,
      });

      onCategoryAdded?.();

      setLabel("");
      setOpen(false);
    } catch (error) {
      console.error("Error adding category:", error);
      toast({
        title: "Error",
        description: "Failed to add category. Please try again.",
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
          variant="outline"
          className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Committee Category</DialogTitle>
          <DialogDescription>
            Create a new committee category to organize members.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="label" className="text-sm font-medium">
              Category Name *
            </Label>
            <Input
              id="label"
              placeholder="e.g., Steering Committee, Program Committee"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="border-border"
            />
            <p className="text-xs text-muted-foreground">
              This will appear as a tab option when adding/filtering members.
            </p>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 bg-blue-500 hover:bg-blue-600"
          >
            {isSubmitting ? "Adding..." : "Add Category"}
          </Button>
          <Button
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
            variant="outline"
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
