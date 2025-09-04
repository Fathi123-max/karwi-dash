"use client";

import { useState, useRef, ChangeEvent } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadImage } from "@/lib/supabase/storage";
import { toast } from "sonner";

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  bucket?: string;
}

export function ImageUploadField({ value, onChange, bucket = "images" }: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const result = await uploadImage(file, bucket);
      const { url, error } = result;

      if (error) {
        toast.error(`Failed to upload image: ${error.message}`);
        return;
      }

      onChange(url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("An error occurred during upload");
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    onChange("");
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative">
          <div className="bg-muted aspect-video overflow-hidden rounded-lg border">
            <img
              src={value}
              alt="Preview"
              className="h-full w-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23cccccc' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpath d='M21 15l-5-5L5 21'/%3E%3C/svg%3E";
              }}
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6"
            onClick={removeImage}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border-2 border-dashed p-6 text-center">
          <ImageIcon className="text-muted-foreground mx-auto h-12 w-12" />
          <p className="text-muted-foreground mt-2 text-sm">
            Drag and drop your image here, or click to browse
          </p>
          <Button
            type="button"
            variant="secondary"
            className="mt-4"
            onClick={triggerFileInput}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Choose Image
              </>
            )}
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept="image/*"
            disabled={isUploading}
          />
        </div>
      )}
    </div>
  );
}