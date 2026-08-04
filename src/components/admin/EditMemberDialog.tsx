import { useState, useEffect, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ActivityLogger } from "@/lib/activityLogger";
import { uploadImageToCloudinary } from "@/lib/cloudinaryUpload";
import { useToast } from "@/hooks/use-toast";
import { PhotoUploadField } from "./PhotoUploadField";
import { adminDbUpdate } from "@/app/actions/db";
import { createClient } from "@/utils/supabase/client";

interface EditMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memberId: string;
  memberName: string;
  categories: any[];
  onMemberUpdated?: () => void;
}

export const EditMemberDialog = ({
  open,
  onOpenChange,
  memberId,
  memberName,
  categories,
  onMemberUpdated,
}: EditMemberDialogProps) => {
  const [member, setMember] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    affiliation: "",
    photoUrl: "",
    photoFile: null as File | null,
  });

  const [uploadedFileName, setUploadedFileName] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const photoPreviewRef = useRef<string>("");
  const supabase = createClient();

  const fetchMember = useCallback(async () => {
    const { data, error } = await supabase
      .from("committee_members")
      .select("*")
      .eq("id", memberId)
      .single();
    
    if (data && !error) {
      setMember(data);
      setFormData({
        name: data.name || "",
        role: data.role || "",
        affiliation: data.affiliation || "",
        photoUrl: data.photo_url || "",
        photoFile: null,
      });
      setPhotoPreview(data.photo_url || "");
    }
  }, [supabase, memberId]);

  useEffect(() => {
    if (open) {
      fetchMember();
    }
  }, [open, fetchMember]);

  useEffect(() => {
    photoPreviewRef.current = photoPreview;
  }, [photoPreview]);

  useEffect(() => {
    return () => {
      if (photoPreviewRef.current?.startsWith("blob:")) {
        URL.revokeObjectURL(photoPreviewRef.current);
      }
    };
  }, []);

  const handleDialogOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      if (photoPreviewRef.current?.startsWith("blob:")) {
        URL.revokeObjectURL(photoPreviewRef.current);
      }
      setPhotoPreview(member?.photo_url || "");
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

      if (photoPreviewRef.current?.startsWith("blob:")) {
        URL.revokeObjectURL(photoPreviewRef.current);
      }
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
    if (!member) return;

    setIsSubmitting(true);

    try {
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
      } else if (!photoUrl && member.photo_url) {
        photoUrl = member.photo_url;
      }

      await adminDbUpdate("committee_members", memberId, {
        name: formData.name,
        role: formData.role,
        affiliation: formData.affiliation,
        photo_url: photoUrl,
      });

      ActivityLogger.log({
        action: "Updated committee member",
        type: "member",
        targetName: formData.name,
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

  if (!member) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Member: {memberName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
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
              className="bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
