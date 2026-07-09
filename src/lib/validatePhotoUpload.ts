export function validatePhotoUpload(
  file: File | undefined,
  toast: any
): boolean {
  if (!file) return false;

  if (!file.type.startsWith("image/")) {
    toast({
      title: "Validation Error",
      description: "Please select a valid image file",
      variant: "destructive",
    });
    return false;
  }

  if (file.size > 5 * 1024 * 1024) {
    toast({
      title: "Validation Error",
      description: "File size must be less than 5MB",
      variant: "destructive",
    });
    return false;
  }

  return true;
}
