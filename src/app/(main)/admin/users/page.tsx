"use client";

import { useTranslations } from "next-intl";

import { useUserStore } from "@/stores/admin-dashboard/user-store";

import { UserDataTable } from "./_components/user-data-table";

export default function UsersPage() {
  const t = useTranslations("admin.users");
  const { users } = useUserStore();

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("title")}</h2>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
      </div>
      <UserDataTable data={users} />
    </div>
  );
}
