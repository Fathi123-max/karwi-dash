"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fixStoragePolicies } from "@/server/actions/storage-policy-actions";

export default function StoragePolicyFixPage() {
  const [isFixing, setIsFixing] = useState(false);
  const [fixResult, setFixResult] = useState<{ success: boolean; message: string; results?: any[] } | null>(null);

  const handleFixPolicies = async () => {
    setIsFixing(true);
    setFixResult(null);

    try {
      const result = await fixStoragePolicies();
      setFixResult(result);
    } catch (error) {
      setFixResult({
        success: false,
        message: `Error: ${(error as Error).message}`,
      });
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Fix Storage Policies</h2>
          <p className="text-muted-foreground">Apply proper Row Level Security policies to storage buckets.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fix Storage RLS Policies</CardTitle>
          <CardDescription>
            This will apply the necessary Row Level Security policies to allow proper access to storage buckets.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">This operation will:</p>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            <li>Enable Row Level Security on storage objects</li>
            <li>Set public read access for all buckets</li>
            <li>Allow authenticated users to upload to specific buckets</li>
            <li>Allow owners to update/delete their own objects</li>
          </ul>
          <p className="text-muted-foreground text-sm">
            This requires admin privileges and will use the service role key.
          </p>

          <Button onClick={handleFixPolicies} disabled={isFixing} className="w-full sm:w-auto">
            {isFixing ? "Applying Policies..." : "Apply Storage Policies"}
          </Button>

          {fixResult && (
            <div
              className={`rounded-md p-4 ${fixResult.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
            >
              <p className="font-medium">{fixResult.message}</p>
              {fixResult.results && (
                <div className="mt-2 text-xs">
                  <p>Policy application details:</p>
                  <ul className="mt-1 list-disc pl-5">
                    {fixResult.results.map((result, index) => (
                      <li key={index} className={result.success ? "text-green-700" : "text-red-700"}>
                        {result.policy?.substring(0, 50)}...: {result.success ? "Success" : `Failed - ${result.error}`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
