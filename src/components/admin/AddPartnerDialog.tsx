import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SharedDialogWrapper } from "./SharedDialogWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ActivityLogger } from "@/lib/activityLogger";
import { uploadImageToCloudinary } from "@/lib/cloudinaryUpload";
import { validatePhotoUpload } from "@/lib/validatePhotoUpload";
import { createClient } from "@/utils/supabase/client";
import type { PartnerItem } from "./PartnersManager";

interface AddPartnerFormData {
  name: string;
  country: string;
  link?: string;
  image: string;
  whiteLogo?: boolean;
  imageFile: File | null;
  imagePreviewUrl: string;
}

interface AddPartnerDialogProps {
  onPartnerAdded?: (partner: any) => void;
}

export const AddPartnerDialog = ({ onPartnerAdded }: AddPartnerDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();
  const [formData, setFormData] = useState<AddPartnerFormData>({
    name: "",
    country: "",
    link: "",
    image: "",
    whiteLogo: false,
    imageFile: null,
    imagePreviewUrl: "",
  });

  useEffect(() => {
    return () => {
      if (formData.imagePreviewUrl) {
        URL.revokeObjectURL(formData.imagePreviewUrl);
      }
    };
  }, [formData.imagePreviewUrl]);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      if (formData.imagePreviewUrl) {
        URL.revokeObjectURL(formData.imagePreviewUrl);
      }
      setFormData({
        name: "",
        country: "",
        link: "",
        image: "",
        whiteLogo: false,
        imageFile: null,
        imagePreviewUrl: "",
      });
    }
    setOpen(newOpen);
  };

  const handleInputChange = (field: keyof AddPartnerFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (validatePhotoUpload(file, toast) && file) {
      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        imagePreviewUrl: previewUrl,
        image: "", // Clear URL
      }));
    }
  };

  const clearPhotoFile = () => {
    setFormData((prev) => ({
      ...prev,
      imageFile: null,
      imagePreviewUrl: "",
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.country.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter name and country.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.image.trim() && !formData.imageFile) {
      toast({
        title: "Validation Error",
        description: "Please provide either an image URL or upload an image file.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = formData.image;

      if (formData.imageFile) {
        toast({
          title: "Uploading image",
          description: "Please wait while we upload your image to Cloudinary...",
        });

        const uploadResult = await uploadImageToCloudinary(formData.imageFile, "partners");

        if (!uploadResult.success) {
          throw new Error(uploadResult.error || "Failed to upload image");
        }

        imageUrl = uploadResult.path || "";
      }

      const { data: maxOrderData } = await supabase
        .from("partners")
        .select("order_index")
        .order("order_index", { ascending: false })
        .limit(1)
        .single();
      
      const newOrderIndex = maxOrderData && maxOrderData.order_index !== null ? maxOrderData.order_index + 1 : 0;

      const { data, error } = await supabase.from("partners").insert({
        name: formData.name,
        country: formData.country,
        link: formData.link?.trim() || null,
        image_url: imageUrl,
        white_logo: formData.whiteLogo,
        order_index: newOrderIndex
      }).select().single();

      if (error) throw error;

      ActivityLogger.log({
        action: "Added new partner",
        type: "partner",
        targetName: formData.name,
        status: "success",
      });

      toast({
        title: "Success",
        description: `Partner "${formData.name}" added successfully!`,
      });

      onPartnerAdded?.(data);
      handleOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add partner.",
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
      triggerText="Add Partner"
      title="Add New Partner"
      description="Add a new industry or academic partner."
    >
      <div className="space-y-4">
          <div className="space-y-2">
            <Label>Name *</Label>
            <Input value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Country *</Label>
            <Input value={formData.country} onChange={(e) => handleInputChange("country", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Link URL</Label>
            <Input value={formData.link || ""} onChange={(e) => handleInputChange("link", e.target.value)} />
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Image *</Label>
            <Tabs defaultValue="url" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="url">Image URL</TabsTrigger>
                <TabsTrigger value="upload">Upload File</TabsTrigger>
              </TabsList>

              <TabsContent value="url" className="space-y-2">
                <Input
                  placeholder="https://example.com/logo.png"
                  type="url"
                  value={formData.image}
                  onChange={(e) => handleInputChange("image", e.target.value)}
                />
                {formData.image && !formData.imageFile && (
                  <div className="mt-2 border border-border rounded p-2">
                    <img
                      src={formData.image}
                      alt="Current preview"
                      className={`w-full h-32 object-contain rounded p-2 ${formData.whiteLogo ? "bg-slate-800 brightness-0 invert" : "bg-slate-100 dark:bg-slate-800"}`}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
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
                    id="partner-photo-upload"
                  />
                  <label htmlFor="partner-photo-upload" className="cursor-pointer block">
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, GIF, WebP (max. 5MB)</p>
                  </label>
                </div>

                {formData.imageFile && (
                  <div className="mt-2 space-y-2">
                    <div className="border border-border rounded p-2">
                      <img
                        src={formData.imagePreviewUrl}
                        alt="Preview"
                        className={`w-full h-32 object-contain rounded p-2 ${formData.whiteLogo ? "bg-slate-800 brightness-0 invert" : "bg-slate-100 dark:bg-slate-800"}`}
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground truncate">{formData.imageFile.name}</span>
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

          <div className="space-y-2 flex flex-row items-center space-x-2">
            <Checkbox
              checked={!!formData.whiteLogo}
              onCheckedChange={(checked) => handleInputChange("whiteLogo", !!checked)}
            />
            <Label className="!mt-0">Force White Logo</Label>
          </div>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full bg-orange-500 hover:bg-orange-600">
            {isSubmitting ? "Adding..." : "Add Partner"}
          </Button>
        </div>
      </SharedDialogWrapper>
    );
};
