"use client";

import * as React from "react";

import { useTranslations } from "next-intl";

import { AppLogo } from "@/components/app-logo";

export function AdminHeader() {
  const t = useTranslations("admin.dashboard");

  return (
    <div className="flex items-center justify-between space-y-2">
      <AppLogo size="md" />
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t("title")}</h2>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>
    </div>
  );
}
