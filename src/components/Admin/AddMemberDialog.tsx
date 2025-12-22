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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Eye } from "lucide-react";
import committeeData from "@/data/committee.json";
import type { CommitteeData } from "@/types/data";
import { PreviewDialog } from "./PreviewDialog";

interface AddMemberFormData {
  name: string;
  role: string;
  affiliation: string;
  photoUrl: string;
  photoFile: File | null;
  photoPreviewUrl: string;
  categoryId: string;
}

interface AddMemberDialogProps {
  onMemberAdded?: (member: AddMemberFormData & { categoryId: string }) => void;
}

export const AddMemberDialog = ({ onMemberAdded }: AddMemberDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<AddMemberFormData>({
    name: "",
    role: "",
    affiliation: "",
    photoUrl: "",
    photoFile: null,
    photoPreviewUrl: "",
    categoryId: "",
  });

  const committee = (committeeData as CommitteeData).root;

  const handleInputChange = (field: keyof AddMemberFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);

      setFormData((prev) => ({
        ...prev,
        photoFile: file,
        photoPreviewUrl: previewUrl,
        photoUrl: "", // Clear URL if file is selected
      }));
    }
  };

  const clearPhotoFile = () => {
    if (formData.photoPreviewUrl) {
      URL.revokeObjectURL(formData.photoPreviewUrl);
    }
    setFormData((prev) => ({
      ...prev,
      photoFile: null,
      photoPreviewUrl: "",
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name.trim()) {
      alert("Please enter a member name");
      return;
    }
    if (!formData.affiliation.trim()) {
      alert("Please enter affiliation");
      return;
    }
    if (!formData.categoryId) {
      alert("Please select a category");
      return;
    }
    if (!formData.photoUrl && !formData.photoFile) {
      alert("Please provide either a photo URL or upload a photo file");
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Integrate with TinaCMS GraphQL mutation
      // For file uploads, you'll need to:
      // 1. Upload file to TinaCMS media manager
      // 2. Get the returned file path
      // 3. Use that path in the member data

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      console.log("New member to be added:", {
        ...formData,
        photo: {
          url: formData.photoUrl,
          file: formData.photoFile ? formData.photoFile.name : null,
        },
      });

      onMemberAdded?.({
        name: formData.name,
        role: formData.role,
        affiliation: formData.affiliation,
        photoUrl: formData.photoUrl || formData.photoPreviewUrl,
        photoFile: null,
        photoPreviewUrl: "",
        categoryId: formData.categoryId,
      });

      // Reset form
      clearPhotoFile();
      setFormData({
        name: "",
        role: "",
        affiliation: "",
        photoUrl: "",
        photoFile: null,
        photoPreviewUrl: "",
        categoryId: "",
      });

      setOpen(false);
      alert(
        "Member added successfully! (Note: Changes will persist when integrated with TinaCMS)"
      );
    } catch (error) {
      console.error("Error adding member:", error);
      alert("Error adding member. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Committee Member
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Committee Member</DialogTitle>
          <DialogDescription>
            Add a new member to the committee. Fields with * are required.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Full Name *
            </Label>
            <Input
              id="name"
              placeholder="e.g., Dr. John Smith"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="border-border"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">
              Category *
            </Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) => handleInputChange("categoryId", value)}
            >
              <SelectTrigger id="category">
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

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-medium">
              Role
            </Label>
            <Input
              id="role"
              placeholder="e.g., General Chair, Program Co-Chair"
              value={formData.role}
              onChange={(e) => handleInputChange("role", e.target.value)}
              className="border-border"
            />
          </div>

          {/* Affiliation */}
          <div className="space-y-2">
            <Label htmlFor="affiliation" className="text-sm font-medium">
              Affiliation/Institution *
            </Label>
            <Input
              id="affiliation"
              placeholder="e.g., University of Example, Tech Corp"
              value={formData.affiliation}
              onChange={(e) => handleInputChange("affiliation", e.target.value)}
              className="border-border"
            />
          </div>

          {/* Photo - URL or Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Photo *</Label>
            <Tabs defaultValue="url" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="url">Photo URL</TabsTrigger>
                <TabsTrigger value="upload">Upload File</TabsTrigger>
              </TabsList>

              <TabsContent value="url" className="space-y-2">
                <Input
                  placeholder="https://example.com/photo.jpg"
                  type="url"
                  value={formData.photoUrl}
                  onChange={(e) =>
                    handleInputChange("photoUrl", e.target.value)
                  }
                  className="border-border"
                />
                {formData.photoUrl && (
                  <div className="mt-2 border border-border rounded p-2">
                    <img
                      src={formData.photoUrl}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded"
                      onError={() => {
                        // Handle invalid image URL
                      }}
                    />
                  </div>
                )}
              </TabsContent>

              <TabsContent value="upload" className="space-y-2">
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/40 transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoFileChange}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="cursor-pointer block"
                  >
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, GIF (max. 5MB)
                    </p>
                  </label>
                </div>

                {formData.photoFile && (
                  <div className="mt-2 space-y-2">
                    <div className="border border-border rounded p-2">
                      <img
                        src={formData.photoPreviewUrl}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded"
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground truncate">
                        {formData.photoFile.name}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={clearPhotoFile}
                        className="text-red-500 hover:text-red-600"
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4">
          {formData.name &&
            formData.affiliation &&
            formData.categoryId &&
            (formData.photoUrl || formData.photoFile) && (
              <PreviewDialog
                content={{
                  type: "member",
                  data: {
                    name: formData.name,
                    role: formData.role,
                    affiliation: formData.affiliation,
                    photoUrl: formData.photoUrl || formData.photoPreviewUrl,
                    categoryLabel: committee.find(
                      (c) => c.id === formData.categoryId
                    )?.label,
                  },
                }}
                trigger={
                  <Button variant="outline" className="flex-1">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                }
              />
            )}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`${
              formData.name &&
              formData.affiliation &&
              formData.categoryId &&
              (formData.photoUrl || formData.photoFile)
                ? "flex-1"
                : "flex-auto"
            } bg-orange-500 hover:bg-orange-600`}
          >
            {isSubmitting ? "Adding..." : "Add Member"}
          </Button>
          <Button
            onClick={() => {
              clearPhotoFile();
              setOpen(false);
            }}
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
