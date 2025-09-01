"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function BranchVehiclesPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Vehicles</h2>
        <p className="text-muted-foreground">Manage vehicles for your branch</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Management</CardTitle>
          <CardDescription>View and manage vehicles associated with your branch</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p>Vehicle management functionality coming soon...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
