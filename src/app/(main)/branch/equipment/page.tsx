"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function BranchEquipmentPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Equipment</h2>
        <p className="text-muted-foreground">Manage equipment for your branch</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Equipment Management</CardTitle>
          <CardDescription>View and manage equipment at your branch</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p>Equipment management functionality coming soon...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
