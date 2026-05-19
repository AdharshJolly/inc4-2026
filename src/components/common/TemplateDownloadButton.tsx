"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { downloadFiles } from "@/lib/utils";

interface TemplateDownloadButtonProps {
  files: string[];
  title: string;
}

export const TemplateDownloadButton = ({
  files,
  title,
}: TemplateDownloadButtonProps) => {
  return (
    <Button className="w-full gap-2" onClick={() => downloadFiles(files)}>
      <Download className="w-4 h-4" /> {title || "Download Template"}
    </Button>
  );
};
