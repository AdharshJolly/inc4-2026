import { useState, useEffect, useCallback } from "react";
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
import { createClient } from "@/utils/supabase/client";

interface EditSpeakerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  speakerId: string;
  speakerName: string;
  onSpeakerUpdated?: () => void;
}

export const EditSpeakerDialog = ({
  open,
  onOpenChange,
  speakerId,
  speakerName,
  onSpeakerUpdated,
}: EditSpeakerDialogProps) => {
  const [speaker, setSpeaker] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    affiliation: "",
    topic: "",
    linkedin: "",
    photoUrl: "",
    photoFile: null as File | null,
  });

  const [uploadedFileName, setUploadedFileName] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const supabase = createClient();

  const fetchSpeaker = useCallback(async () => {
    const { data, error } = await supabase
      .from("speakers")
      .select("*")
      .eq("id", speakerId)
      .single();
    
    if (data && !error) {
      setSpeaker(data);
      setFormData({
        name: data.name || "",
        role: data.role || "",
        affiliation: data.affiliation || "",
        topic: data.topic || "",
        linkedin: data.linkedin || "",
        photoUrl: data.photo_url || "",
        photoFile: null,
      });
      setPhotoPreview(data.photo_url || "");
    }
  }, [supabase, speakerId]);

  useEffect(() => {
    if (open) {
      fetchSpeaker();
    }
  }, [open, fetchSpeaker]);

  useEffect(() => {
    return () => {
      if (photoPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, []);

  const handleDialogOpenChange = (newOpen: boolean) => {
    if (!newOpen && photoPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreview);
      setPhotoPreview(speaker?.photo_url || "");
    }
    onOpenChange(newOpen);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.role.trim()) {
      newErrors.role = "Role is required";
    }
    if (!formData.affiliation.trim()) {
      newErrors.affiliation = "Affiliation is required";
    }
    if (!formData.topic.trim()) {
      newErrors.topic = "Topic is required";
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
    if (!speaker) return;

    try {
      let photoUrl = formData.photoUrl;

      if (formData.photoFile) {
        toast({
          title: "Uploading photo",
          description: "Please wait while we upload your photo...",
        });

        const uploadResult = await uploadImageToCloudinary(
          formData.photoFile,
          "speakers"
        );

        if (!uploadResult.success) {
          throw new Error(uploadResult.error || "Failed to upload photo");
        }

        photoUrl = uploadResult.url || "";
      } else if (!photoUrl && speaker.photo_url) {
        photoUrl = speaker.photo_url;
      }

      const { error } = await supabase
        .from("speakers")
        .update({
          name: formData.name,
          role: formData.role,
          affiliation: formData.affiliation,
          topic: formData.topic,
          linkedin: formData.linkedin,
          photo_url: photoUrl,
        })
        .eq("id", speakerId);

      if (error) throw error;

      ActivityLogger.log({
        action: "Updated speaker",
        type: "speaker",
        targetName: formData.name,
        status: "success",
      });

      onOpenChange(false);
      onSpeakerUpdated?.();
    } catch (error) {
      console.error("Error updating speaker:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update speaker. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!speaker) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Speaker: {speakerName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-speaker-name">Name *</Label>
              <Input
                id="edit-speaker-name"
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
              <Label htmlFor="edit-speaker-role">Role *</Label>
              <Input
                id="edit-speaker-role"
                value={formData.role}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    role: e.target.value,
                  }))
                }
                placeholder="e.g., Keynote Speaker"
                className={errors.role ? "border-red-500" : ""}
              />
              {errors.role && (
                <p className="text-xs text-red-500 mt-1">{errors.role}</p>
              )}
            </div>

            <div className="col-span-2">
              <Label htmlFor="edit-speaker-affiliation">Affiliation *</Label>
              <Input
                id="edit-speaker-affiliation"
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

            <div className="col-span-2">
              <Label htmlFor="edit-speaker-topic">Topic *</Label>
              <Input
                id="edit-speaker-topic"
                value={formData.topic}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    topic: e.target.value,
                  }))
                }
                placeholder="Presentation topic/title"
                className={errors.topic ? "border-red-500" : ""}
              />
              {errors.topic && (
                <p className="text-xs text-red-500 mt-1">{errors.topic}</p>
              )}
            </div>

            <div className="col-span-2">
              <Label htmlFor="edit-speaker-linkedin">LinkedIn Profile</Label>
              <Input
                id="edit-speaker-linkedin"
                type="url"
                value={formData.linkedin}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    linkedin: e.target.value,
                  }))
                }
                placeholder="https://linkedin.com/in/..."
              />
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
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-primary hover:bg-primary/90"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
