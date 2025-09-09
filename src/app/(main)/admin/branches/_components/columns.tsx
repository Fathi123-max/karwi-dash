"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MapPin, Phone, Star } from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { BranchActions } from "./branch-actions";
import { Branch } from "./types";

// Helper to parse location string
const parseLocation = (locationStr: string | null | undefined): { lat: number; lng: number } | undefined => {
  if (!locationStr) return undefined;

  // Handle stringified JSON format
  if (typeof locationStr === "string" && locationStr.startsWith("{")) {
    try {
      const parsed = JSON.parse(locationStr);
      if (parsed && typeof parsed.lat === "number" && typeof parsed.lng === "number") {
        return { lat: parsed.lat, lng: parsed.lng };
      }
    } catch (e) {
      // Not a JSON string, continue to other formats
    }
  }

  // Check for WKT format (POINT(lng lat))
  const match = locationStr.match(/POINT\(([-\d.]+) ([-\d.]+)\)/);
  if (match && match.length === 3) {
    return { lng: parseFloat(match[1]), lat: parseFloat(match[2]) };
  }

  // Handle GeoJSON format if stored as string
  if (typeof locationStr === "string" && locationStr.includes('"type":"Point"')) {
    try {
      const parsed = JSON.parse(locationStr);
      if (parsed.type === "Point" && Array.isArray(parsed.coordinates) && parsed.coordinates.length === 2) {
        return { lng: parsed.coordinates[0], lat: parsed.coordinates[1] };
      }
    } catch (e) {
      // Not a valid GeoJSON string
    }
  }

  return undefined;
};

// Define columns with localization
export const getColumns = (t: (key: string) => string): ColumnDef<Branch>[] => [
  {
    accessorKey: "name",
    header: t("columns.name"),
  },
  {
    accessorKey: "franchise",
    header: t("columns.franchise"),
  },
  {
    accessorKey: "city",
    header: t("columns.city"),
    cell: ({ row }) => {
      const branch = row.original;
      return branch.city ?? <span className="text-muted-foreground">{t("columns.notSet")}</span>;
    },
  },
  {
    accessorKey: "phone_number",
    header: t("columns.phone"),
    cell: ({ row }) => {
      const branch = row.original;
      return branch.phone_number ? (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4" />
          <span>{branch.phone_number}</span>
        </div>
      ) : (
        <span className="text-muted-foreground">{t("columns.notSet")}</span>
      );
    },
  },
  {
    accessorKey: "ratings",
    header: t("columns.rating"),
    cell: ({ row }) => {
      const branch = row.original;
      return branch.ratings ? (
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span>{branch.ratings.toFixed(1)}</span>
        </div>
      ) : (
        <span className="text-muted-foreground">{t("columns.notRated")}</span>
      );
    },
    filterFn: (row, columnId, filterValue: string[]) => {
      const branch = row.original;

      // If no filter selected, show all
      if (filterValue === undefined || filterValue.length === 0) return true;

      const rating = branch.ratings ?? 0;

      // Check if the rating matches any of the selected filters
      return filterValue.some((filter) => {
        if (filter === "5") return rating >= 5;
        if (filter === "4+") return rating >= 4 && rating < 5;
        if (filter === "3+") return rating >= 3 && rating < 4;
        if (filter === "<3") return rating < 3 && rating > 0;
        if (filter === "0") return rating === 0;
        return false;
      });
    },
  },
  {
    accessorKey: "services",
    header: t("columns.services"),
    cell: ({ row }) => {
      const branch = row.original;

      // Show loading state if services haven't loaded yet
      if (branch.services === undefined) {
        return <span className="text-muted-foreground">{t("common.loading")}</span>;
      }

      const services = branch.services ?? [];
      if (services.length === 0) {
        return <span className="text-muted-foreground">{t("columns.noServices")}</span>;
      }
      return (
        <div className="flex max-w-xs flex-wrap gap-1">
          {services.map((service) => (
            <Badge key={service.id} variant="secondary" className="font-normal">
              {service.name}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "serviceCount",
    header: t("columns.serviceCount"),
    cell: ({ row }) => {
      const branch = row.original;

      // Show loading state if services haven't loaded yet
      if (branch.services === undefined) {
        return <span className="text-muted-foreground">{t("common.loading")}</span>;
      }

      const serviceCount = branch.services?.length ?? 0;
      return <span>{serviceCount}</span>;
    },
    filterFn: (row, columnId, filterValue: string[]) => {
      const branch = row.original;

      // If services haven't loaded yet, don't filter
      if (branch.services === undefined) return true;

      const serviceCount = branch.services?.length ?? 0;
      const serviceCountStr = serviceCount.toString();

      // If no filter selected, show all
      if (filterValue === undefined || filterValue.length === 0) return true;

      // Check if the service count matches any of the selected filters
      return filterValue.some((filter) => {
        if (filter === "0") return serviceCount === 0;
        if (filter === "1-2") return serviceCount >= 1 && serviceCount <= 2;
        if (filter === "3-5") return serviceCount >= 3 && serviceCount <= 5;
        if (filter === "6-10") return serviceCount >= 6 && serviceCount <= 10;
        if (filter === "10+") return serviceCount > 10;
        // For exact matches (when we show individual counts)
        return filter === serviceCountStr;
      });
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const branch = row.original;
      return <BranchActions branch={branch} />;
    },
  },
];

// Export default columns for backward compatibility
export const columns: ColumnDef<Branch>[] = getColumns((key) => {
  // Simple mapping for backward compatibility
  const map: Record<string, string> = {
    "columns.name": "Name",
    "columns.franchise": "Franchise",
    "columns.city": "City",
    "columns.phone": "Phone",
    "columns.rating": "Rating",
    "columns.services": "Services",
    "columns.serviceCount": "Service Count",
    "columns.notSet": "Not set",
    "columns.notRated": "Not rated",
    "columns.noServices": "No services",
    "common.loading": "Loading...",
  };
  return map[key] || key;
});
