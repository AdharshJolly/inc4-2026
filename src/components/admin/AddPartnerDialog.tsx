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
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import partnersData from "@/data/partners.json";
import { storePendingChange } from "@/lib/githubSync";
import { ActivityLogger } from "@/lib/activityLogger";
import { uploadImageToGitHub } from "@/lib/fileUpload";
import type { PartnersData, PartnerItem } from "@/types/data";

interface AddPartnerFormData extends PartnerItem {
  imageFile: File | null;
  imagePreviewUrl: string;
}

interface AddPartnerDialogProps {
  onPartnerAdded?: (partner: PartnerItem) => void;
}

export const AddPartnerDialog = ({ onPartnerAdded }: AddPartnerDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState<AddPartnerFormData>({
    name: "",
    country: "",
    link: "",
    image: "",
    whiteLogo: false,
    imageFile: null,
    imagePreviewUrl: "",
  });

  const [partners, setPartners] = useState<PartnersData["root"]>(() =>
    structuredClone((partnersData as PartnersData).root)
  );

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
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Validation Error",
          description: "Please select a valid image file",
          variant: "destructive",
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Validation Error",
          description: "File size must be less than 5MB",
          variant: "destructive",
        });
        return;
      }
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
          description: "Please wait while we upload your image to GitHub...",
        });

        const uploadResult = await uploadImageToGitHub(formData.imageFile, "partners");

        if (!uploadResult.success) {
          throw new Error(uploadResult.error || "Failed to upload image");
        }

        imageUrl = uploadResult.path || "";
      }

      const newPartner: PartnerItem = {
        name: formData.name,
        country: formData.country,
        link: formData.link?.trim() || undefined,
        image: imageUrl,
        whiteLogo: formData.whiteLogo,
      };

      setPartners((prev) => {
        const updated = [...prev, newPartner];
        storePendingChange({
          path: "src/data/partners.json",
          content: JSON.stringify({ root: updated }, null, 2),
          message: `Added new partner: ${formData.name}`,
        });
        return updated;
      });

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

      onPartnerAdded?.(newPartner);
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
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Partner
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Partner</DialogTitle>
          <DialogDescription>Add a new industry or academic partner.</DialogDescription>
        </DialogHeader>
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
          
          {/* Photo - URL or Upload */}
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
      </DialogContent>
    </Dialog>
  );
};
