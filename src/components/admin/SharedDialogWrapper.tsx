import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface SharedDialogWrapperProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerText?: string;
  title: string;
  description: string;
  children: React.ReactNode;
  onInteractOutside?: (e: Event) => void;
  hideTrigger?: boolean;
}

export function SharedDialogWrapper({
  open,
  onOpenChange,
  triggerText,
  title,
  description,
  children,
  onInteractOutside,
  hideTrigger = false,
}: SharedDialogWrapperProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {!hideTrigger && triggerText && (
        <DialogTrigger asChild>
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Plus className="w-4 h-4 mr-2" />
            {triggerText}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent 
        className="max-w-md max-h-[90vh] overflow-y-auto"
        onInteractOutside={onInteractOutside}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
