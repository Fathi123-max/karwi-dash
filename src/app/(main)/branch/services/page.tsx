"use client";

import { useEffect } from "react";

import { useBranchAdminStore } from "@/stores/branch-admin-store";

import { BranchServicesTable } from "./_components/branch-services-table";

export default function BranchServicesPage() {
  const { services, fetchServices, isLoading, error } = useBranchAdminStore();

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  if (isLoading) {
    return <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Services</h2>
        <p className="text-muted-foreground">Manage services for your branch</p>
      </div>
      <BranchServicesTable data={services} />
    </div>
  );
}
