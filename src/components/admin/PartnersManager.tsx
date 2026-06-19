import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Trash2, Building2, AlertTriangle } from "lucide-react";
import partnersData from "@/data/partners.json";
import type { PartnersData, PartnerItem } from "@/types/data";
import { AddPartnerDialog } from "./AddPartnerDialog";
import { useToast } from "@/hooks/use-toast";
import { storePendingChange } from "@/lib/githubSync";
import { ActivityLogger } from "@/lib/activityLogger";
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
import Image from "next/image";

export const PartnersManager = () => {
  const initialPartners = useMemo(() => (partnersData as PartnersData).root || [], []);
  const [partners, setPartners] = useState<PartnerItem[]>(() => structuredClone(initialPartners));
  const { toast } = useToast();

  const [editOpen, setEditOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<PartnerItem>({
    name: "",
    country: "",
    link: "",
    image: "",
    whiteLogo: false,
  });
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState<number | null>(null);

  const handleAddPartner = (newPartner: PartnerItem) => {
    const updated = [...partners, newPartner];
    setPartners(updated);
    storePendingChange({
      path: "src/data/partners.json",
      content: JSON.stringify({ root: updated }, null, 2),
      message: `Added partner: ${newPartner.name}`,
    });
  };

  const openEdit = (index: number) => {
    setEditIndex(index);
    setEditForm({ ...partners[index] });
    setEditOpen(true);
  };

  const saveEdit = () => {
    if (editIndex === null) return;
    if (!editForm.name.trim() || !editForm.country.trim() || !editForm.image.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide name, country, and image URL.",
        variant: "destructive",
      });
      return;
    }

    const updated = [...partners];
    updated[editIndex] = { ...editForm };
    setPartners(updated);

    storePendingChange({
      path: "src/data/partners.json",
      content: JSON.stringify({ root: updated }, null, 2),
      message: `Updated partner: ${editForm.name}`,
    });

    ActivityLogger.log({
      action: "Edited partner",
      type: "partner",
      targetName: editForm.name,
      status: "success",
    });

    toast({ title: "Saved", description: `Updated "${editForm.name}".` });
    setEditOpen(false);
    setEditIndex(null);
  };

  const confirmDelete = (index: number) => setConfirmDeleteIndex(index);

  const performDelete = () => {
    if (confirmDeleteIndex === null) return;
    const target = partners[confirmDeleteIndex];
    const updated = partners.filter((_, i) => i !== confirmDeleteIndex);
    setPartners(updated);

    storePendingChange({
      path: "src/data/partners.json",
      content: JSON.stringify({ root: updated }, null, 2),
      message: `Deleted partner: ${target.name}`,
    });

    ActivityLogger.log({
      action: "Deleted partner",
      type: "partner",
      targetName: target.name,
      status: "warning",
    });

    toast({ title: "Deleted", description: `Removed "${target.name}".` });
    setConfirmDeleteIndex(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <AddPartnerDialog onPartnerAdded={handleAddPartner} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {partners.map((partner, index) => (
          <div
            key={index}
            className="flex flex-col p-4 rounded-lg border border-border hover:border-primary/40 hover:bg-primary/5 transition-colors gap-4"
          >
            <div className="flex items-center justify-center bg-white/5 border border-white/10 rounded-md p-4 h-24">
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
              <Button size="sm" variant="outline" className="text-red-500 hover:text-red-600" onClick={() => confirmDelete(index)}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md">
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
              <Label>Image URL *</Label>
              <Input
                value={editForm.image}
                onChange={(e) => setEditForm((p) => ({ ...p, image: e.target.value }))}
              />
            </div>
            <div className="space-y-2 flex flex-row items-center space-x-2">
              <Checkbox
                checked={!!editForm.whiteLogo}
                onCheckedChange={(checked) => setEditForm((p) => ({ ...p, whiteLogo: !!checked }))}
              />
              <Label className="!mt-0">Force White Logo</Label>
            </div>
            <div className="flex gap-2">
              <Button onClick={saveEdit} className="w-full bg-orange-500 hover:bg-orange-600">
                Save Changes
              </Button>
              <Button variant="outline" className="w-full" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
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
