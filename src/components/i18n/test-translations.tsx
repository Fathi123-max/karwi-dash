"use client";

import { useTranslations } from "next-intl";

export function TestTranslations() {
  const t = useTranslations("dashboard");
  const tCommon = useTranslations("common");

  return (
    <div className="rounded-lg border p-4">
      <h2 className="mb-2 text-lg font-semibold">{t("welcome")}</h2>
      <p className="mb-2">{t("recentBookings")}</p>
      <div className="flex gap-2">
        <button className="rounded bg-blue-500 px-3 py-1 text-white">{tCommon("save")}</button>
        <button className="rounded bg-gray-500 px-3 py-1 text-white">{tCommon("cancel")}</button>
      </div>
    </div>
  );
}
