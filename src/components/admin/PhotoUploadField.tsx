import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AlertCircle, Upload, X } from "lucide-react";

interface PhotoUploadFieldProps {
  photoUrl: string;
  photoFile: File | null;
  photoPreview: string;
  uploadedFileName: string;
  errors?: {
    photo?: string;
  };
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUrlChange: (url: string) => void;
  onClearPhoto: () => void;
}

export const PhotoUploadField = ({
  photoUrl,
  photoFile,
  photoPreview,
  uploadedFileName,
  errors = {},
  onFileUpload,
  onUrlChange,
  onClearPhoto,
}: PhotoUploadFieldProps) => {
  return (
    <>
      <div>
        <Label className="mb-3 block">Photo *</Label>

        <Tabs defaultValue="url">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="url">Photo URL</TabsTrigger>
            <TabsTrigger value="upload">Upload File</TabsTrigger>
          </TabsList>

          <TabsContent value="url" className="space-y-3">
            <Input
              type="url"
              placeholder="https://example.com/photo.jpg"
              value={photoUrl}
              onChange={(e) => onUrlChange(e.target.value)}
              disabled={!!photoFile}
            />
            {photoFile && (
              <p className="text-xs text-amber-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                File upload takes precedence over URL
              </p>
            )}
          </TabsContent>

          <TabsContent value="upload" className="space-y-3">
            <div className="border-2 border-dashed rounded-lg p-4">
              <input
                type="file"
                accept="image/*"
                onChange={onFileUpload}
                className="hidden"
                id="photo-upload-input"
              />
              <label
                htmlFor="photo-upload-input"
                className="flex flex-col items-center cursor-pointer"
              >
                <Upload className="w-6 h-6 mb-2 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                  Click to upload
                </span>
                <span className="text-xs text-muted-foreground">
                  PNG, JPG, GIF (max 5MB)
                </span>
              </label>
            </div>

            {uploadedFileName && (
              <div className="flex items-center justify-between bg-muted p-2 rounded">
                <span className="text-sm">{uploadedFileName}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onClearPhoto}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {errors.photo && (
          <p className="text-xs text-red-500 mt-2">{errors.photo}</p>
        )}
      </div>

      {photoPreview && (
        <div className="border rounded-lg p-4 bg-muted/50">
          <p className="text-xs font-medium mb-3 text-muted-foreground">
            Preview
          </p>
          <img
            src={photoPreview}
            alt="Preview"
            className="max-w-full max-h-48 rounded object-cover"
          />
        </div>
      )}
    </>
  );
};
