"use client";

import { useState, useRef, ChangeEvent, useEffect } from "react";

import { X, Upload, Link, Image as ImageIcon, Loader2, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { uploadImage } from "@/lib/supabase/storage";

interface BranchPicturesFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder?: string;
}

export function BranchPicturesField({ form, name, label, placeholder }: BranchPicturesFieldProps) {
  const t = useTranslations("admin.branches.form.pictures");
  const [externalUrl, setExternalUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get current pictures from form
  const fieldValue = form.watch(name);
  const imageUrls = fieldValue
    ? Array.isArray(fieldValue)
      ? fieldValue
      : fieldValue
          .split(",")
          .map((url: string) => url.trim())
          .filter(Boolean)
    : [];

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      const newUrls: string[] = [];

      for (const file of Array.from(files)) {
        // Upload to Supabase Storage in the branches bucket
        // Handle various error cases including RLS policy violations
        const result = await uploadImage(file, "branches");
        const { url, error } = result;

        if (error) {
          if (error.message.includes("Bucket not found")) {
            toast.error(`Failed to upload ${file.name}: Storage bucket not found. Please contact administrator.`);
          } else if (error.message.includes("new row violates row-level security policy")) {
            toast.error(`Failed to upload ${file.name}: Insufficient permissions. Please contact administrator.`);
          } else if (error.message.includes("The resource was not found")) {
            toast.error(`Failed to upload ${file.name}: Storage resource not found.`);
          } else {
            toast.error(`Failed to upload ${file.name}: ${error.message}`);
          }
          continue;
        }

        newUrls.push(url);
      }

      // Update form value
      const currentUrls = form.getValues(name) ?? [];
      const updatedUrls = [...currentUrls, ...newUrls];
      form.setValue(name, updatedUrls, { shouldValidate: true, shouldDirty: true, shouldTouch: true });

      toast.success(`Successfully uploaded ${newUrls.length} image(s)`);
    } catch (error) {
      toast.error("An error occurred during upload");
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddExternalUrl = () => {
    if (!externalUrl.trim()) return;

    const currentUrls = form.getValues(name) ?? [];
    const updatedUrls = [...currentUrls, externalUrl.trim()];
    form.setValue(name, updatedUrls, { shouldValidate: true, shouldDirty: true, shouldTouch: true });

    setExternalUrl("");
  };

  const removeImage = (index: number) => {
    const currentUrls = form.getValues(name) ?? [];
    const updatedUrls = currentUrls.filter((_: any, i: number) => i !== index);
    form.setValue(name, updatedUrls, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <Label>{label}</Label>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            {t("tabs.upload")}
          </TabsTrigger>
          <TabsTrigger value="url" className="flex items-center gap-2">
            <Link className="h-4 w-4" />
            {t("tabs.addUrl")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-4 space-y-4">
          <div className="rounded-lg border-2 border-dashed p-6 text-center">
            <ImageIcon className="text-muted-foreground mx-auto h-12 w-12" />
            <p className="text-muted-foreground mt-2 text-sm">{t("upload.description")}</p>
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
                  {t("upload.uploading")}
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  {t("upload.chooseFiles")}
                </>
              )}
            </Button>
            <Input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              multiple
              accept="image/*"
              disabled={isUploading}
            />
            <div className="text-muted-foreground mt-2 flex items-center justify-center gap-1 text-xs">
              <AlertCircle className="h-3 w-3" />
              <span>{t("upload.storageInfo")}</span>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="url" className="mt-4 space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder={t("url.placeholder")}
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddExternalUrl()}
            />
            <Button type="button" onClick={handleAddExternalUrl}>
              {t("url.addButton")}
            </Button>
          </div>

          <div className="text-muted-foreground text-sm">
            <p>{t("url.description")}</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Display current images */}
      {imageUrls.length > 0 && (
        <div className="space-y-2">
          <Label>{t("currentImages")}</Label>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {imageUrls.map((url: string, index: number) => (
              <div key={index} className="group relative">
                <div className="bg-muted aspect-square overflow-hidden rounded-lg border">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      // If the image fails to load, show a placeholder
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
                  className="absolute -top-2 -right-2 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
                <div className="mt-1 truncate text-center text-xs">{t("imageLabel", { index: index + 1 })}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hidden input for form submission */}
      <input type="hidden" {...form.register(name)} />
    </div>
  );
}
