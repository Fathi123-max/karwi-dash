"use client";

import { PlusCircle } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { useWasherStore } from "@/stores/admin-dashboard/washer-store";

import { useWasherColumns } from "./_components/columns";
import { WasherDataTable } from "./_components/washer-data-table";
import { WasherDialog } from "./_components/washer-dialog";

export default function WashersPage() {
  const t = useTranslations("admin.washers");
  const { washers } = useWasherStore();
  const columns = useWasherColumns();

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("title")}</h2>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        <div className="flex items-center space-x-2">
          <WasherDialog>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              {t("add")}
            </Button>
          </WasherDialog>
        </div>
      </div>
      <WasherDataTable data={washers} />
    </div>
  );
}
