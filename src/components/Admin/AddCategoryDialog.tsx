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
import committeeData from "@/data/committee.json";
import { storePendingChange } from "@/lib/githubSync";
import { ActivityLogger } from "@/lib/activityLogger";
import type { CommitteeData } from "@/types/data";

interface AddCategoryFormData {
  label: string;
}

interface AddCategoryDialogProps {
  onCategoryAdded?: (category: AddCategoryFormData) => void;
}

export const AddCategoryDialog = ({
  onCategoryAdded,
}: AddCategoryDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState<AddCategoryFormData>({
    label: "",
  });
  // Initialize local committee state from imported JSON
  const [committee] = useState<CommitteeData["root"]>(() =>
    structuredClone((committeeData as CommitteeData).root)
  );

  const handleSubmit = async () => {
    // Validation
    if (!formData.label.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a category name",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate unique ID for category
      const categoryId = `category-${Date.now()}`;

      // Create new category object
      const newCategory = {
        id: categoryId,
        name: formData.label,
        members: [],
      };

      // Use immutable approach: create new array with spread operator
      // Never mutate the imported JSON module - create a copy instead
      const updatedCommitteeArray = [...committee, newCategory];

      // Reconstruct the full data object with the updated committee array
      const updatedData = {
        root: updatedCommitteeArray,
      };

      // Store pending change for GitHub commit on logout
      const updatedCommitteeJson = JSON.stringify(updatedData, null, 2);
      storePendingChange({
        path: "src/data/committee.json",
        content: updatedCommitteeJson,
        message: `Added new committee category: ${formData.label}`,
      });

      // Log the action
      ActivityLogger.log({
        action: "Added new committee category",
        type: "category",
        targetName: formData.label,
        status: "success",
      });

      toast({
        title: "Success",
        description: `Category "${formData.label}" added successfully! Changes will sync to GitHub when you log out.`,
      });

      onCategoryAdded?.(formData);

      // Reset form
      setFormData({ label: "" });
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
          {/* Label */}
          <div className="space-y-2">
            <Label htmlFor="label" className="text-sm font-medium">
              Category Name *
            </Label>
            <Input
              id="label"
              placeholder="e.g., Steering Committee, Program Committee"
              value={formData.label}
              onChange={(e) => setFormData({ label: e.target.value })}
              className="border-border"
            />
            <p className="text-xs text-muted-foreground">
              This will appear as a tab option when adding/filtering members.
            </p>
          </div>
        </div>

        {/* Actions */}
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
