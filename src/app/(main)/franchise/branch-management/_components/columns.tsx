"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Branch } from "@/stores/franchise-dashboard/branch-store";

import { BranchActions } from "./branch-actions";

const parseLocation = (locationStr: string | null | undefined): { lat: number; lng: number } | undefined => {
  if (!locationStr) return undefined;
  const match = locationStr.match(/POINT\(([-\d.]+) ([-\d.]+)\)/);
  if (match && match.length === 3) {
    return { lng: parseFloat(match[1]), lat: parseFloat(match[2]) };
  }
  return undefined;
};

// Create a function that returns the columns with translations
export const getColumns = (t: (key: string) => string): ColumnDef<Branch>[] => [
  {
    accessorKey: "name",
    header: t("name"),
  },
  {
    accessorKey: "location_text",
    header: t("location"),
    cell: ({ row }) => {
      const locationStr = row.getValue("location_text");
      const location = parseLocation(locationStr);

      if (!location) {
        return <span className="text-muted-foreground">{t("notSet")}</span>;
      }

      const { lat, lng } = location;
      const mapUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

      return (
        <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
          <Button variant="outline" size="sm">
            <MapPin className="mr-2 h-4 w-4" />
            {t("viewOnMap")}
          </Button>
        </a>
      );
    },
  },
  {
    accessorKey: "services",
    header: t("services"),
    cell: ({ row }) => {
      const services = row.original.services ?? [];
      if (services.length === 0) {
        return <span className="text-muted-foreground">{t("noServices")}</span>;
      }
      return (
        <div className="flex max-w-xs flex-wrap gap-1">
          {services.map((service: any) => (
            <Badge key={service.id} variant="secondary" className="font-normal">
              {service.name}
            </Badge>
          ))}
        </div>
      );
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
