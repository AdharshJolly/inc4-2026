import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SharedDialogWrapper } from "./SharedDialogWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ActivityLogger } from "@/lib/activityLogger";
import { uploadImageToCloudinary } from "@/lib/cloudinaryUpload";
import { PreviewDialog } from "./PreviewDialog";
import { validatePhotoUpload } from "@/lib/validatePhotoUpload";
import { z } from "zod";
import { createClient } from "@/utils/supabase/client";

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
  const supabase = createClient();

  useEffect(() => {
    return () => {
      if (formData.photoPreviewUrl) {
        URL.revokeObjectURL(formData.photoPreviewUrl);
      }
    };
  }, [formData.photoPreviewUrl]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPhotoUrl(formData.photoUrl);
    }, 400);
    return () => clearTimeout(timer);
  }, [formData.photoUrl]);

  useEffect(() => {
    if (!debouncedPhotoUrl) {
      setImageError(false);
      setLastFailedUrl(null);
    }
  }, [debouncedPhotoUrl]);

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
    if (validatePhotoUpload(file, toast) && file) {
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
    setFormData((prev) => ({
      ...prev,
      photoFile: null,
      photoPreviewUrl: "",
    }));
  };

  const handleSubmit = async () => {
    const speakerSchema = z.object({
      name: z.string().min(2, "Speaker name is required"),
      role: z.string().min(2, "Speaker role is required"),
      affiliation: z.string().min(2, "Affiliation is required"),
      topic: z.string().optional().or(z.literal("")),
      linkedin: z.string().url("Must be a valid LinkedIn URL").or(z.literal("")),
    });

    try {
      speakerSchema.parse({
        name: formData.name,
        role: formData.role,
        affiliation: formData.affiliation,
        topic: formData.topic,
        linkedin: formData.linkedin,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
        return;
      }
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
      }

      // Get max order_index
      const { data: maxData } = await supabase
        .from("speakers")
        .select("order_index")
        .order("order_index", { ascending: false })
        .limit(1);
      
      const newIndex = maxData && maxData.length > 0 ? maxData[0].order_index + 1 : 0;

      const { error } = await supabase.from("speakers").insert({
        name: formData.name,
        role: formData.role,
        affiliation: formData.affiliation,
        topic: formData.topic,
        linkedin: formData.linkedin || "",
        photo_url: photoUrl,
        order_index: newIndex,
      });

      if (error) throw error;

      ActivityLogger.log({
        action: "Added new speaker",
        type: "speaker",
        targetName: formData.name,
        status: "success",
      });

      toast({
        title: "Success",
        description: `Speaker "${formData.name}" added successfully!`,
      });

      onSpeakerAdded?.({
        name: formData.name,
        role: formData.role,
        affiliation: formData.affiliation,
        topic: formData.topic,
        photoUrl: photoUrl,
        linkedin: formData.linkedin,
      });

      clearPhotoFile();
      setFormData(initialFormData);
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
    <SharedDialogWrapper
      open={open}
      onOpenChange={handleOpenChange}
      triggerText="Add Speaker"
      title="Add New Keynote Speaker"
      description="Add a new keynote speaker. Fields with * are required."
      onInteractOutside={(e) => {
        if (formData.name || formData.role || formData.affiliation || formData.topic || formData.photoUrl || formData.photoFile) {
          e.preventDefault();
        }
      }}
    >
      <div className="space-y-4">
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

          <div className="space-y-2">
            <Label htmlFor="topic" className="text-sm font-medium">
              Topic/Title
            </Label>
            <Input
              id="topic"
              placeholder="e.g., AI in Industry 4.0"
              value={formData.topic}
              onChange={(e) => handleInputChange("topic", e.target.value)}
              className="border-border"
            />
          </div>

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
                    setImageError(false);
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

        <div className="flex gap-2 pt-4">
          {formData.name &&
            formData.role &&
            formData.affiliation &&
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
              (formData.photoUrl || formData.photoFile)
                ? "flex-1"
                : "flex-auto"
            } bg-primary hover:bg-primary/90`}
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
      </SharedDialogWrapper>
    );
};
