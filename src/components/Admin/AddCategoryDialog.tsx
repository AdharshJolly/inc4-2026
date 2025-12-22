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
  const [formData, setFormData] = useState<AddCategoryFormData>({
    label: "",
  });

  const handleSubmit = async () => {
    // Validation
    if (!formData.label.trim()) {
      alert("Please enter a category name");
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Integrate with TinaCMS GraphQL mutation
      // const mutation = `
      //   mutation AddCommitteeCategory($label: String!) {
      //     addCommitteeCategory(label: $label) {
      //       id
      //       label
      //       members { id name role }
      //     }
      //   }
      // `;

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      console.log("New category to be added:", formData);

      onCategoryAdded?.(formData);

      // Reset form
      setFormData({ label: "" });
      setOpen(false);
      alert(
        "Category added successfully! (Note: Changes will persist when integrated with TinaCMS)"
      );
    } catch (error) {
      console.error("Error adding category:", error);
      alert("Error adding category. Please try again.");
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
