"use client";

import { useEffect } from "react";

import { useBranchAdminStore } from "@/stores/branch-admin-store";

import { BranchWashersTable } from "./_components/branch-washers-table";

export default function BranchWashersPage() {
  const { washers, fetchWashers, isLoading, error } = useBranchAdminStore();

  useEffect(() => {
    fetchWashers();
  }, [fetchWashers]);

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
        <h2 className="text-3xl font-bold tracking-tight">Washers</h2>
        <p className="text-muted-foreground">Manage washers for your branch</p>
      </div>
      <BranchWashersTable data={washers} />
    </div>
  );
}
