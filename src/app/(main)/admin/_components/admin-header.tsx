"use client";

import * as React from "react";

import { AppLogo } from "@/components/app-logo";

export function AdminHeader() {
  return (
    <div className="flex items-center justify-between space-y-2">
      <AppLogo size="md" />
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Karwi Admin Dashboard</h2>
        <p className="text-muted-foreground">Oversee the entire Karwi car wash network.</p>
      </div>
    </div>
  );
}
