import { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import speakersData from "@/data/speakers.json";
import { storePendingChange } from "@/lib/githubSync";
import { ActivityLogger } from "@/lib/activityLogger";
import { uploadImageToGitHub } from "@/lib/fileUpload";
import type { SpeakersData } from "@/types/data";
import { PreviewDialog } from "./PreviewDialog";

interface AddSpeakerFormData {
  name: string;
  role: string;
  affiliation: string;
  topic: string;
  photoUrl: string;
  photoFile: File | null;
  photoPreviewUrl: string;
  linkedin: string;
}

interface AddSpeakerDialogProps {
  onSpeakerAdded?: (
    speaker: Omit<AddSpeakerFormData, "photoFile" | "photoPreviewUrl">
  ) => void;
}

const initialFormData: AddSpeakerFormData = {
  name: "",
  role: "",
  affiliation: "",
  topic: "",
  photoUrl: "",
  photoFile: null,
  photoPreviewUrl: "",
  linkedin: "",
};

export const AddSpeakerDialog = ({ onSpeakerAdded }: AddSpeakerDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [debouncedPhotoUrl, setDebouncedPhotoUrl] = useState("");
  const [lastFailedUrl, setLastFailedUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const [formData, setFormData] = useState<AddSpeakerFormData>(initialFormData);

  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      // Cleanup on unmount: revoke any remaining preview URL
      if (formData.photoPreviewUrl) {
        URL.revokeObjectURL(formData.photoPreviewUrl);
      }
    };
  }, [formData.photoPreviewUrl]);

  // Debounce photo URL input to avoid firing image load/toasts on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPhotoUrl(formData.photoUrl);
    }, 400);

    return () => clearTimeout(timer);
  }, [formData.photoUrl]);

  // Reset image error and failed URL when debounced URL is cleared
  useEffect(() => {
    if (!debouncedPhotoUrl) {
      setImageError(false);
      setLastFailedUrl(null);
    }
  }, [debouncedPhotoUrl]);

  // Cleanup when dialog closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      if (formData.photoPreviewUrl) {
        URL.revokeObjectURL(formData.photoPreviewUrl);
      }
      setFormData(initialFormData);
      setImageError(false);
      setLastFailedUrl(null);
      setDebouncedPhotoUrl("");
      setOpen(false);
      return;
    }
    setOpen(newOpen);
  };

  const handleInputChange = (
    field: keyof AddSpeakerFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Validation Error",
          description: "Please select a valid image file",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Validation Error",
          description: "File size must be less than 5MB",
          variant: "destructive",
        });
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
    // Don't revoke here - let useEffect cleanup handle revocation
    // to avoid breaking async uses of the URL by parent
    setFormData((prev) => ({
      ...prev,
      photoFile: null,
      photoPreviewUrl: "",
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter speaker name",
        variant: "destructive",
      });
      return;
    }
    if (!formData.role.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter speaker role",
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
    if (!formData.topic.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter topic",
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
      const speakers = (speakersData as SpeakersData).root;

      // Handle photo: upload file if present, otherwise use URL
      let photoUrl = formData.photoUrl;

      if (formData.photoFile) {
        toast({
          title: "Uploading photo",
          description: "Please wait while we upload your photo to GitHub...",
        });

        const uploadResult = await uploadImageToGitHub(
          formData.photoFile,
          "speakers"
        );

        if (!uploadResult.success) {
          throw new Error(uploadResult.error || "Failed to upload photo");
        }

        photoUrl = uploadResult.path || "";
      }

      // Create new speaker object with just the URL
      const newSpeaker = {
        name: formData.name,
        role: formData.role,
        affiliation: formData.affiliation,
        topic: formData.topic,
        linkedin: formData.linkedin || "",
        photo: photoUrl ? { url: photoUrl } : {},
      };

      // Add to speakers in memory
      speakers.push(newSpeaker);

      // Store pending change for GitHub commit on logout
      const updatedSpeakers = JSON.stringify(speakersData, null, 2);
      storePendingChange({
        path: "src/data/speakers.json",
        content: updatedSpeakers,
        message: `Added new speaker: ${formData.name}`,
      });

      // Log the action
      ActivityLogger.log({
        action: "Added new speaker",
        type: "speaker",
        targetName: formData.name,
        status: "success",
      });

      toast({
        title: "Success",
        description: `Speaker "${formData.name}" added successfully! Changes will sync to GitHub when you log out.`,
      });

      onSpeakerAdded?.({
        name: formData.name,
        role: formData.role,
        affiliation: formData.affiliation,
        topic: formData.topic,
        photoUrl: photoUrl,
        linkedin: formData.linkedin,
      });

      // Reset form
      clearPhotoFile();
      setFormData({
        name: "",
        role: "",
        affiliation: "",
        topic: "",
        photoUrl: "",
        photoFile: null,
        photoPreviewUrl: "",
        linkedin: "",
      });

      setOpen(false);
    } catch (error) {
      console.error("Error adding speaker:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to add speaker. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Speaker
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Keynote Speaker</DialogTitle>
          <DialogDescription>
            Add a new keynote speaker. Fields with * are required.
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
              placeholder="e.g., Dr. Jane Smith"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="border-border"
            />
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-medium">
              Role *
            </Label>
            <Input
              id="role"
              placeholder="e.g., Chief Technology Officer, Professor"
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
              placeholder="e.g., Tech Company, University Name"
              value={formData.affiliation}
              onChange={(e) => handleInputChange("affiliation", e.target.value)}
              className="border-border"
            />
          </div>

          {/* Topic */}
          <div className="space-y-2">
            <Label htmlFor="topic" className="text-sm font-medium">
              Topic/Title *
            </Label>
            <Input
              id="topic"
              placeholder="e.g., AI in Industry 4.0"
              value={formData.topic}
              onChange={(e) => handleInputChange("topic", e.target.value)}
              className="border-border"
            />
          </div>

          {/* LinkedIn */}
          <div className="space-y-2">
            <Label htmlFor="linkedin" className="text-sm font-medium">
              LinkedIn Profile
            </Label>
            <Input
              id="linkedin"
              placeholder="https://linkedin.com/in/username"
              type="url"
              value={formData.linkedin}
              onChange={(e) => handleInputChange("linkedin", e.target.value)}
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
                  onChange={(e) => {
                    handleInputChange("photoUrl", e.target.value);
                    setImageError(false); // Reset error when user changes URL
                    setLastFailedUrl(null);
                  }}
                  className="border-border"
                />
                {debouncedPhotoUrl && !imageError && (
                  <div className="mt-2 border border-border rounded p-2">
                    <img
                      src={debouncedPhotoUrl}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded"
                      onError={() => {
                        // Prevent repeated toasts for the same failing URL
                        if (debouncedPhotoUrl === lastFailedUrl) return;
                        setLastFailedUrl(debouncedPhotoUrl);
                        setImageError(true);
                        toast({
                          title: "Image Error",
                          description:
                            "Invalid image URL - please check the URL and try again",
                          variant: "destructive",
                        });
                      }}
                    />
                  </div>
                )}
                {debouncedPhotoUrl && imageError && (
                  <div className="mt-2 border border-red-200 bg-red-50 rounded p-4 text-center">
                    <p className="text-sm text-red-600 font-medium">
                      ❌ Unable to load image
                    </p>
                    <p className="text-xs text-red-500 mt-1">
                      The URL is invalid or the image cannot be accessed. Please
                      check the URL and try again.
                    </p>
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
                    id="speaker-photo-upload"
                  />
                  <label
                    htmlFor="speaker-photo-upload"
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
            formData.role &&
            formData.affiliation &&
            formData.topic &&
            (formData.photoUrl || formData.photoFile) && (
              <PreviewDialog
                content={{
                  type: "speaker",
                  data: {
                    name: formData.name,
                    role: formData.role,
                    affiliation: formData.affiliation,
                    topic: formData.topic,
                    photo: {
                      url: formData.photoUrl || formData.photoPreviewUrl,
                      file: null,
                    },
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
              formData.role &&
              formData.affiliation &&
              formData.topic &&
              (formData.photoUrl || formData.photoFile)
                ? "flex-1"
                : "flex-auto"
            } bg-orange-500 hover:bg-orange-600`}
          >
            {isSubmitting ? "Adding..." : "Add Speaker"}
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
