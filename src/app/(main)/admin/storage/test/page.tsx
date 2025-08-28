"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadImage } from "@/lib/supabase/storage";

export default function StorageTestPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<{ url: string; error: string | null; bucket?: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadResult(null);

    try {
      // Test upload to different buckets
      const buckets = ["images", "branches", "services"];

      for (const bucket of buckets) {
        try {
          console.log(`Testing upload to ${bucket} bucket...`);
          const result = await uploadImage(selectedFile, bucket);

          if (result.error) {
            console.log(`Failed to upload to ${bucket}:`, result.error.message);
          } else {
            console.log(`Successfully uploaded to ${bucket}:`, result.url);
            setUploadResult({ url: result.url, error: null, bucket });
            break; // Use the first successful upload
          }
        } catch (error) {
          console.log(`Error uploading to ${bucket}:`, (error as Error).message);
        }
      }

      // If all specific buckets failed, try with default
      if (!uploadResult || (uploadResult && uploadResult.error)) {
        console.log("Trying with default bucket...");
        const result = await uploadImage(selectedFile);
        setUploadResult({ ...result, bucket: "images (default)" });
      }
    } catch (error) {
      setUploadResult({ url: "", error: (error as Error).message, bucket: "unknown" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Storage Test</h2>
          <p className="text-muted-foreground">Test Supabase storage functionality.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Test</CardTitle>
          <CardDescription>Test uploading files to different storage buckets.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">Select an image file</Label>
            <Input id="file" type="file" accept="image/*" onChange={handleFileChange} disabled={isUploading} />
          </div>

          <Button onClick={handleUpload} disabled={!selectedFile || isUploading} className="w-full sm:w-auto">
            {isUploading ? "Uploading..." : "Upload File"}
          </Button>

          {uploadResult && (
            <div
              className={`rounded-md p-4 ${uploadResult.error ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}
            >
              {uploadResult.error ? (
                <div>
                  <p className="font-medium">Upload failed:</p>
                  <p className="text-sm">{uploadResult.error}</p>
                  {uploadResult.bucket && <p className="mt-1 text-xs">Attempted bucket: {uploadResult.bucket}</p>}
                </div>
              ) : (
                <div>
                  <p className="font-medium">Upload successful!</p>
                  <p className="text-sm">Bucket: {uploadResult.bucket}</p>
                  <p className="text-sm break-all">URL: {uploadResult.url}</p>
                  {uploadResult.url && (
                    <div className="mt-2">
                      <img src={uploadResult.url} alt="Upload result" className="h-auto max-w-full rounded" />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Connection Troubleshooting</CardTitle>
          <CardDescription>Common issues and solutions for Supabase storage connection problems.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm">
            <h3 className="font-medium">Common Issues:</h3>
            <ul className="list-disc space-y-1 pl-5">
              <li>Missing or incorrect environment variables</li>
              <li>Storage buckets not created</li>
              <li>Row Level Security (RLS) policies blocking access</li>
              <li>Network connectivity issues</li>
            </ul>

            <h3 className="mt-3 font-medium">Solutions:</h3>
            <ol className="list-decimal space-y-1 pl-5">
              <li>Verify your .env.local file contains correct Supabase credentials</li>
              <li>Ensure required storage buckets exist in your Supabase project</li>
              <li>Check that RLS policies allow uploads for authenticated users</li>
              <li>
                Try the connection test page at{" "}
                <a href="/test" className="text-blue-600 hover:underline">
                  /test
                </a>
              </li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
