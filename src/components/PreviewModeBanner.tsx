import { isPreviewMode, disablePreviewMode } from "@/lib/previewMode";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Eye, X } from "lucide-react";

export const PreviewModeBanner = () => {
  if (!isPreviewMode()) return null;

  const handleExitPreview = () => {
    disablePreviewMode();
    window.location.reload();
  };

  return (
    <Alert className="rounded-none border-x-0 border-t-0 bg-orange-500/10 border-orange-500/20">
      <Eye className="h-4 w-4 text-orange-600" />
      <AlertTitle className="text-orange-600">Preview Mode</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span className="text-sm text-orange-700">
          You're viewing uncommitted changes from the admin panel. This is not the live site.
        </span>
        <Button
          size="sm"
          variant="outline"
          onClick={handleExitPreview}
          className="ml-4 border-orange-500/30 hover:bg-orange-500/20"
        >
          <X className="w-3 h-3 mr-1" />
          Exit Preview
        </Button>
      </AlertDescription>
    </Alert>
  );
};
