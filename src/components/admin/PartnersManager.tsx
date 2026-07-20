import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Trash2, Building2, AlertTriangle, ArrowUp, ArrowDown, Search } from "lucide-react";
import { SkeletonCard } from "./Skeleton";
import { AddPartnerDialog } from "./AddPartnerDialog";
import { useToast } from "@/hooks/use-toast";
import { ActivityLogger } from "@/lib/activityLogger";
import { uploadImageToCloudinary } from "@/lib/cloudinaryUpload";
import { validatePhotoUpload } from "@/lib/validatePhotoUpload";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { createClient } from "@/utils/supabase/client";

export type PartnerItem = {
  id?: number;
  name: string;
  country: string;
  link?: string;
  image: string;
  whiteLogo?: boolean;
  order_index?: number;
};

export const PartnersManager = () => {
  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const supabase = createClient();

  const filteredPartners = useMemo(() => {
    if (!searchTerm.trim()) return partners;
    return partners.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.country.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [partners, searchTerm]);

  const [editOpen, setEditOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editForm, setEditForm] = useState<PartnerItem>({
    name: "",
    country: "",
    link: "",
    image: "",
    whiteLogo: false,
  });

  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreviewUrl, setEditImagePreviewUrl] = useState<string>("");

  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState<number | null>(null);

  const fetchPartners = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("partners")
      .select("*")
      .order("order_index", { ascending: true })
      .order("id", { ascending: true });

    if (error) {
      toast({ title: "Error", description: "Failed to load partners.", variant: "destructive" });
    } else if (data) {
      const mapped = data.map((d: any) => ({
        id: d.id,
        name: d.name,
        country: d.country,
        link: d.link,
        image: d.image_url,
        whiteLogo: d.white_logo,
        order_index: d.order_index,
      }));
      setPartners(mapped);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  useEffect(() => {
    return () => {
      if (editImagePreviewUrl) {
        URL.revokeObjectURL(editImagePreviewUrl);
      }
    };
  }, [editImagePreviewUrl]);

  const handleAddPartner = (newPartner: any) => {
    fetchPartners();
  };

  const openEdit = (index: number) => {
    setEditIndex(index);
    setEditForm({ ...partners[index] });
    setEditImageFile(null);
    setEditImagePreviewUrl("");
    setEditOpen(true);
  };

  const handleEditPhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (validatePhotoUpload(file, toast) && file) {
      const previewUrl = URL.createObjectURL(file);
      setEditImageFile(file);
      setEditImagePreviewUrl(previewUrl);
      setEditForm((prev) => ({ ...prev, image: "" }));
    }
  };

  const clearEditPhotoFile = () => {
    setEditImageFile(null);
    setEditImagePreviewUrl("");
  };

  const saveEdit = async () => {
    if (editIndex === null || !editForm.id) return;
    if (!editForm.name.trim() || !editForm.country.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide name and country.",
        variant: "destructive",
      });
      return;
    }

    if (!editForm.image.trim() && !editImageFile) {
      toast({
        title: "Validation Error",
        description: "Please provide either an image URL or upload an image file.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = editForm.image;

      if (editImageFile) {
        toast({
          title: "Uploading image",
          description: "Please wait while we upload your image to Cloudinary...",
        });

        const uploadResult = await uploadImageToCloudinary(editImageFile, "partners");

        if (!uploadResult.success) {
          throw new Error(uploadResult.error || "Failed to upload image");
        }

        imageUrl = uploadResult.url || "";
      }

      const { error } = await supabase
        .from("partners")
        .update({
          name: editForm.name,
          country: editForm.country,
          link: editForm.link || null,
          image_url: imageUrl,
          white_logo: editForm.whiteLogo,
        })
        .eq("id", editForm.id);

      if (error) {
        throw error;
      }

      ActivityLogger.log({
        action: "Edited partner",
        type: "partner",
        targetName: editForm.name,
        status: "success",
      });

      toast({ title: "Saved", description: `Updated "${editForm.name}".` });
      setEditOpen(false);
      setEditIndex(null);
      fetchPartners();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update partner.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = (index: number) => setConfirmDeleteIndex(index);

  const performDelete = async () => {
    if (confirmDeleteIndex === null) return;
    const target = partners[confirmDeleteIndex];
    if (!target.id) return;

    const { error } = await supabase
      .from("partners")
      .delete()
      .eq("id", target.id);

    if (error) {
      toast({ title: "Error", description: "Failed to delete partner.", variant: "destructive" });
      return;
    }

    ActivityLogger.log({
      action: "Deleted partner",
      type: "partner",
      targetName: target.name,
      status: "warning",
    });

    toast({ title: "Deleted", description: `Removed "${target.name}".` });
    setConfirmDeleteIndex(null);
    fetchPartners();
  };

  const movePartner = async (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === partners.length - 1)
    ) return;

    const newPartners = [...partners];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap
    const temp = newPartners[index];
    newPartners[index] = newPartners[swapIndex];
    newPartners[swapIndex] = temp;
    
    setPartners(newPartners);

    // Persist
    const updates = newPartners.map((item, idx) => ({
      id: item.id,
      order_index: idx
    }));

    await Promise.all(
      updates.map(update => 
        supabase.from("partners").update({ order_index: update.order_index }).eq("id", update.id)
      )
    );
    
    toast({ title: "Reordered", description: "Partner order updated." });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or country…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <AddPartnerDialog onPartnerAdded={handleAddPartner} />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : filteredPartners.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Building2 className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">
            {searchTerm ? "No partners match your search" : "No partners yet"}
          </p>
          <p className="text-xs text-muted-foreground">
            {searchTerm ? "Try adjusting your search terms" : "Add your first partner to get started"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPartners.map((partner, index) => (
            <div
              key={partner.id || index}
              className="flex flex-col p-4 rounded-xl border border-border shadow-sm hover:shadow-md hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 gap-4"
            >
              <div className={`flex items-center justify-center border rounded-md p-4 h-24 ${partner.whiteLogo ? "bg-slate-800 border-slate-700" : "bg-slate-100 border-slate-200 dark:bg-slate-800 dark:border-slate-700"}`}>
                {partner.image ? (
                  <img
                    src={partner.image}
                    alt={partner.name}
                    className={`max-h-full max-w-full object-contain ${partner.whiteLogo ? "brightness-0 invert" : ""}`}
                  />
                ) : (
                  <Building2 className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-base leading-tight mb-1">{partner.name}</h3>
                <p className="text-sm text-muted-foreground">{partner.country}</p>
                {partner.link && (
                  <a href={partner.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">
                    Visit Link
                  </a>
                )}
              </div>
              <div className="flex gap-2 mt-auto">
                <Button size="sm" variant="outline" onClick={() => openEdit(index)}>
                  <Edit className="w-3 h-3 mr-1" /> Edit
                </Button>
                <Button size="sm" variant="outline" onClick={() => movePartner(index, 'up')} disabled={index === 0}>
                  <ArrowUp className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => movePartner(index, 'down')} disabled={index === partners.length - 1}>
                  <ArrowDown className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="outline" className="text-red-500 hover:text-red-600" onClick={() => confirmDelete(index)}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Partner</DialogTitle>
            <DialogDescription>Modify partner details and save changes.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Country *</Label>
              <Input
                value={editForm.country}
                onChange={(e) => setEditForm((p) => ({ ...p, country: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Link URL</Label>
              <Input
                value={editForm.link || ""}
                onChange={(e) => setEditForm((p) => ({ ...p, link: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Image *</Label>
              <Tabs defaultValue={editForm.image && !editImageFile ? "url" : "upload"} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="url">Image URL</TabsTrigger>
                  <TabsTrigger value="upload">Upload File</TabsTrigger>
                </TabsList>

                <TabsContent value="url" className="space-y-2">
                  <Input
                    placeholder="https://example.com/logo.png"
                    type="url"
                    value={editForm.image}
                    onChange={(e) => setEditForm((p) => ({ ...p, image: e.target.value }))}
                  />
                  {editForm.image && !editImageFile && (
                    <div className="mt-2 border border-border rounded p-2">
                      <img
                        src={editForm.image}
                        alt="Current preview"
                        className={`w-full h-32 object-contain rounded p-2 ${editForm.whiteLogo ? "bg-slate-800 brightness-0 invert" : "bg-slate-100 dark:bg-slate-800"}`}
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
                      onChange={handleEditPhotoFileChange}
                      className="hidden"
                      id="edit-partner-photo-upload"
                    />
                    <label htmlFor="edit-partner-photo-upload" className="cursor-pointer block">
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, GIF, WebP (max. 5MB)</p>
                    </label>
                  </div>

                  {editImageFile && (
                    <div className="mt-2 space-y-2">
                      <div className="border border-border rounded p-2">
                        <img
                          src={editImagePreviewUrl}
                          alt="Preview"
                          className={`w-full h-32 object-contain rounded p-2 ${editForm.whiteLogo ? "bg-slate-800 brightness-0 invert" : "bg-slate-100 dark:bg-slate-800"}`}
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground truncate">{editImageFile.name}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={clearEditPhotoFile}
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
                checked={!!editForm.whiteLogo}
                onCheckedChange={(checked) => setEditForm((p) => ({ ...p, whiteLogo: !!checked }))}
              />
              <Label className="!mt-0">Force White Logo</Label>
            </div>
            <div className="flex gap-2">
              <Button onClick={saveEdit} disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90">
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
              <Button variant="outline" disabled={isSubmitting} className="w-full" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmDeleteIndex !== null} onOpenChange={(open) => !open && setConfirmDeleteIndex(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" /> Delete partner?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will remove the selected partner from the gallery.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={performDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
