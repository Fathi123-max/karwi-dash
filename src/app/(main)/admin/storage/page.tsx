"use client";

import { useState } from "react";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { initializeStorageBuckets } from "@/server/actions/storage-actions";

export default function StorageManagementPage() {
  const [isInitializing, setIsInitializing] = useState(false);
  const [initializationResult, setInitializationResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleInitializeBuckets = async () => {
    setIsInitializing(true);
    setInitializationResult(null);

    try {
      const result = await initializeStorageBuckets();

      if (result.success) {
        setInitializationResult({
          success: true,
          message: "Storage buckets initialized successfully!",
        });
      } else {
        setInitializationResult({
          success: false,
          message: `Failed to initialize storage buckets: ${result.error || "Unknown error"}`,
        });
      }
    } catch (error) {
      setInitializationResult({
        success: false,
        message: `Error: ${(error as Error).message}`,
      });
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Storage Management</h2>
          <p className="text-muted-foreground">Manage Supabase storage buckets and permissions.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Initialize Storage Buckets</CardTitle>
          <CardDescription>Create and configure the required storage buckets for the application.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">This will create the following storage buckets if they don&apos;t already exist:</p>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            <li>
              <strong>images</strong> - Default bucket for general image storage
            </li>
            <li>
              <strong>branches</strong> - Bucket for branch-related images
            </li>
            <li>
              <strong>services</strong> - Bucket for service-related images
            </li>
          </ul>
          <p className="text-muted-foreground text-sm">All buckets will be configured as public for image access.</p>

          <Button onClick={handleInitializeBuckets} disabled={isInitializing} className="w-full sm:w-auto">
            {isInitializing ? "Initializing..." : "Initialize Storage Buckets"}
          </Button>

          {initializationResult && (
            <div
              className={`rounded-md p-4 ${initializationResult.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
            >
              {initializationResult.message}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fix Storage Policies</CardTitle>
          <CardDescription>Apply proper Row Level Security policies to storage buckets.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            If you&apos;re experiencing upload issues, you may need to fix the storage RLS policies.
          </p>

          <Link href="/admin/storage/fix-policies">
            <Button variant="outline" className="w-full sm:w-auto">
              Fix Storage Policies
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Storage Testing</CardTitle>
          <CardDescription>Test the storage functionality to verify it&lsquo;s working correctly.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">Use the storage test page to verify that file uploads are working properly.</p>

          <Link href="/admin/storage/test">
            <Button variant="outline" className="w-full sm:w-auto">
              Go to Storage Test Page
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
