import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Upload, X } from "lucide-react";
import committeeData from "@/data/committee.json";
import { getPhotoUrl } from "@/lib/photoMigration";
import { ActivityLogger } from "@/lib/activityLogger";
import { storePendingChange } from "@/lib/githubSync";
import { uploadImageToGitHub } from "@/lib/fileUpload";
import { useToast } from "@/hooks/use-toast";
import { PhotoUploadField } from "./PhotoUploadField";
import type { CommitteeData } from "@/types/data";

interface EditMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryId: string;
  memberIndex: number;
  memberName: string;
  onMemberUpdated?: () => void;
}

export const EditMemberDialog = ({
  open,
  onOpenChange,
  categoryId,
  memberIndex,
  memberName,
  onMemberUpdated,
}: EditMemberDialogProps) => {
  const committee = (committeeData as CommitteeData).root;
  const category = committee.find((c) => c.id === categoryId);
  const member = category?.members[memberIndex];

  const [formData, setFormData] = useState({
    name: member?.name || "",
    role: member?.role || "",
    affiliation: member?.affiliation || "",
    photoUrl: getPhotoUrl(member?.photo) || "",
    photoFile: null as File | null,
  });

  const [uploadedFileName, setUploadedFileName] = useState("");
  const [photoPreview, setPhotoPreview] = useState(
    getPhotoUrl(member?.photo) || ""
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  // Ref to track the latest blob URL for proper cleanup
  const photoPreviewRef = useRef<string>("");

  // Update ref whenever preview changes
  useEffect(() => {
    photoPreviewRef.current = photoPreview;
  }, [photoPreview]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      // Cleanup on unmount - revoke only blob URLs
      if (photoPreviewRef.current?.startsWith("blob:")) {
        URL.revokeObjectURL(photoPreviewRef.current);
      }
    };
  }, []);

  // Cleanup when dialog closes
  const handleDialogOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Dialog is closing, revoke blob URL if present
      if (photoPreviewRef.current?.startsWith("blob:")) {
        URL.revokeObjectURL(photoPreviewRef.current);
      }
      setPhotoPreview(getPhotoUrl(member?.photo) || "");
    }
    onOpenChange(newOpen);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.affiliation.trim()) {
      newErrors.affiliation = "Affiliation is required";
    }
    if (!formData.photoUrl && !formData.photoFile) {
      newErrors.photo = "Please add a photo (URL or file)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          file: "Please upload an image file",
        }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          file: "File size must be less than 5MB",
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        photoFile: file,
        photoUrl: "",
      }));
      setUploadedFileName(file.name);

      // Revoke previous blob preview if present to prevent leaks
      if (photoPreviewRef.current?.startsWith("blob:")) {
        URL.revokeObjectURL(photoPreviewRef.current);
      }
      // Create blob URL for efficient preview (will be revoked on unmount)
      const blobUrl = URL.createObjectURL(file);
      setPhotoPreview(blobUrl);

      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.file;
        return newErrors;
      });
    }
  };

  const handleUrlChange = (url: string) => {
    // Revoke previous blob preview if present when switching to URL
    if (photoPreviewRef.current?.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreviewRef.current);
    }
    setFormData((prev) => ({
      ...prev,
      photoUrl: url,
      photoFile: null,
    }));
    setUploadedFileName("");
    setPhotoPreview(url);
  };

  const handleClearPhoto = () => {
    setFormData((prev) => ({
      ...prev,
      photoUrl: "",
      photoFile: null,
    }));
    setUploadedFileName("");
    setPhotoPreview("");
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (!member || !category) return;

    setIsSubmitting(true);

    try {
      // Track changes for activity log
      const changes: Record<string, { old: string; new: string }> = {};

      if (member.name !== formData.name) {
        changes.name = { old: member.name, new: formData.name };
      }
      if (member.role !== formData.role) {
        changes.role = { old: member.role, new: formData.role };
      }
      if (member.affiliation !== formData.affiliation) {
        changes.affiliation = {
          old: member.affiliation,
          new: formData.affiliation,
        };
      }

      // Handle photo: upload file if present, otherwise keep existing or use URL
      let photoUrl = formData.photoUrl;

      if (formData.photoFile) {
        toast({
          title: "Uploading photo",
          description: "Please wait while we upload your photo to GitHub...",
        });

        const uploadResult = await uploadImageToGitHub(
          formData.photoFile,
          "committee"
        );

        if (!uploadResult.success) {
          throw new Error(uploadResult.error || "Failed to upload photo");
        }

        photoUrl = uploadResult.path || "";
      } else if (!photoUrl && member.photo?.url) {
        // Keep existing photo if no new upload or URL
        photoUrl = member.photo.url;
      }

      // Update member in memory
      const updatedMember = {
        ...member,
        name: formData.name,
        role: formData.role,
        affiliation: formData.affiliation,
        photo: photoUrl ? { url: photoUrl } : {},
      };

      category.members[memberIndex] = updatedMember;

      // Store pending change for GitHub commit on logout
      const updatedCommittee = JSON.stringify(committeeData, null, 2);
      storePendingChange({
        path: "src/data/committee.json",
        content: updatedCommittee,
        message: `Updated committee member: ${formData.name}`,
      });

      // Log the action
      ActivityLogger.log({
        action: "Updated committee member",
        type: "member",
        targetName: formData.name,
        changes: Object.keys(changes).length > 0 ? changes : undefined,
        status: "success",
      });

      toast({
        title: "Success",
        description: `Member "${formData.name}" updated successfully!`,
      });

      onOpenChange(false);
      onMemberUpdated?.();
    } catch (error) {
      console.error("Error updating member:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update member. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!member || !category) {
    return null;
  }

  // Note: CommitteeCategory uses `label`, not `name`. If needed for future use,
  // map to `{ id, label }`. Currently unused; removing avoids type errors.
  // const categories = committee.map((c) => ({ id: c.id, label: c.label }));

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Member: {memberName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                placeholder="Full name"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="edit-role">Role</Label>
              <Input
                id="edit-role"
                value={formData.role}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    role: e.target.value,
                  }))
                }
                placeholder="e.g., Chair, Vice-Chair"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="edit-affiliation">Affiliation *</Label>
              <Input
                id="edit-affiliation"
                value={formData.affiliation}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    affiliation: e.target.value,
                  }))
                }
                placeholder="University or Organization"
                className={errors.affiliation ? "border-red-500" : ""}
              />
              {errors.affiliation && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.affiliation}
                </p>
              )}
            </div>
          </div>

          <PhotoUploadField
            photoUrl={formData.photoUrl}
            photoFile={formData.photoFile}
            photoPreview={photoPreview}
            uploadedFileName={uploadedFileName}
            errors={errors}
            onFileUpload={handleFileUpload}
            onUrlChange={handleUrlChange}
            onClearPhoto={handleClearPhoto}
          />

          {/* Actions */}
          <div className="flex gap-3 justify-end border-t pt-6">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
