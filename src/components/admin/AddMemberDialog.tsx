import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SharedDialogWrapper } from "./SharedDialogWrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ActivityLogger } from "@/lib/activityLogger";
import { uploadImageToCloudinary } from "@/lib/cloudinaryUpload";
import { PreviewDialog } from "./PreviewDialog";
import { validatePhotoUpload } from "@/lib/validatePhotoUpload";
import { createClient } from "@/utils/supabase/client";

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
  categories: any[];
  onMemberAdded?: () => void;
}

export const AddMemberDialog = ({ categories, onMemberAdded }: AddMemberDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();
  const [formData, setFormData] = useState<AddMemberFormData>({
    name: "",
    role: "",
    affiliation: "",
    photoUrl: "",
    photoFile: null,
    photoPreviewUrl: "",
    categoryId: "",
  });

  useEffect(() => {
    return () => {
      if (formData.photoPreviewUrl) {
        URL.revokeObjectURL(formData.photoPreviewUrl);
      }
    };
  }, []);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && formData.photoPreviewUrl) {
      URL.revokeObjectURL(formData.photoPreviewUrl);
      setFormData((prev) => ({
        ...prev,
        photoPreviewUrl: "",
      }));
    }
    setOpen(newOpen);
  };

  const handleInputChange = (field: keyof AddMemberFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (validatePhotoUpload(file, toast) && file) {
      if (formData.photoPreviewUrl) {
        URL.revokeObjectURL(formData.photoPreviewUrl);
      }
      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        photoFile: file,
        photoPreviewUrl: previewUrl,
        photoUrl: "",
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
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a member name",
        variant: "destructive",
      });
      return;
    }
    if (!formData.affiliation.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter affiliation",
        variant: "destructive",
      });
      return;
    }
    if (!formData.categoryId) {
      toast({
        title: "Validation Error",
        description: "Please select a category",
        variant: "destructive",
      });
      return;
    }
    if (!formData.photoUrl && !formData.photoFile) {
      toast({
        title: "Validation Error",
        description: "Please provide either a photo URL or upload a photo file",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const category = categories.find((c) => c.id === formData.categoryId);
      if (!category) {
        throw new Error("Category not found");
      }

      let photoUrl = formData.photoUrl;

      if (formData.photoFile) {
        toast({
          title: "Uploading photo",
          description: "Please wait while we upload your photo...",
        });

        const uploadResult = await uploadImageToCloudinary(
          formData.photoFile,
          "committee"
        );

        if (!uploadResult.success) {
          throw new Error(uploadResult.error || "Failed to upload photo");
        }

        photoUrl = uploadResult.url || "";
      }

      const { data: maxData } = await supabase
        .from("committee_members")
        .select("order_index")
        .eq("category_id", formData.categoryId)
        .order("order_index", { ascending: false })
        .limit(1);
      
      const newIndex = maxData && maxData.length > 0 ? maxData[0].order_index + 1 : 0;

      const { error } = await supabase.from("committee_members").insert({
        name: formData.name,
        role: formData.role || "",
        affiliation: formData.affiliation,
        photo_url: photoUrl,
        category_id: formData.categoryId,
        order_index: newIndex,
      });

      if (error) throw error;

      ActivityLogger.log({
        action: "Added new committee member",
        type: "member",
        targetName: formData.name,
        status: "success",
      });

      toast({
        title: "Success",
        description: `Member "${formData.name}" added successfully!`,
      });

      onMemberAdded?.();

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
    } catch (error) {
      console.error("Error adding member:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to add member. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SharedDialogWrapper
      open={open}
      onOpenChange={handleOpenChange}
      triggerText="Add Committee Member"
      title="Add New Committee Member"
      description="Add a new member to the committee. Fields with * are required."
    >
      <div className="space-y-4">
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
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
                      onError={() => {}}
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
                    categoryLabel: categories.find(
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
            } bg-primary hover:bg-primary/90`}
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
      </SharedDialogWrapper>
    );
};
