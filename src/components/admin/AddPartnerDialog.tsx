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
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import partnersData from "@/data/partners.json";
import { storePendingChange } from "@/lib/githubSync";
import { ActivityLogger } from "@/lib/activityLogger";
import type { PartnersData, PartnerItem } from "@/types/data";

interface AddPartnerDialogProps {
  onPartnerAdded?: (partner: PartnerItem) => void;
}

export const AddPartnerDialog = ({ onPartnerAdded }: AddPartnerDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState<PartnerItem>({
    name: "",
    country: "",
    link: "",
    image: "",
    whiteLogo: false,
  });

  const [partners, setPartners] = useState<PartnersData["root"]>(() =>
    structuredClone((partnersData as PartnersData).root)
  );

  const handleInputChange = (field: keyof PartnerItem, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.country.trim() || !formData.image.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter name, country, and image URL",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const newPartner = {
        name: formData.name,
        country: formData.country,
        link: formData.link?.trim() || undefined,
        image: formData.image,
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
      setFormData({ name: "", country: "", link: "", image: "", whiteLogo: false });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add partner.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Partner
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
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
          <div className="space-y-2">
            <Label>Image URL *</Label>
            <Input value={formData.image} onChange={(e) => handleInputChange("image", e.target.value)} />
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
