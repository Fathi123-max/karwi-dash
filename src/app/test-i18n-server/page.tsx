import { getTranslations } from "next-intl/server";

import { LanguageSwitcherButtons } from "@/components/i18n/language-switcher-buttons";
import { TestTranslations } from "@/components/i18n/test-translations";

export async function generateMetadata() {
  const t = await getTranslations("dashboard");
  return {
    title: t("welcome"),
  };
}

export default async function I18nServerTestPage() {
  const t = await getTranslations("dashboard");
  const tCommon = await getTranslations("common");

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("welcome")}</h1>
        <LanguageSwitcherButtons />
      </div>

      {/* Server-rendered content */}
      <div className="mb-6 rounded-lg border p-4">
        <h2 className="mb-2 text-lg font-semibold">{t("recentBookings")}</h2>
        <p className="mb-2">{tCommon("loading")}</p>
        <div className="flex gap-2">
          <button className="rounded bg-blue-500 px-3 py-1 text-white">{tCommon("save")}</button>
          <button className="rounded bg-gray-500 px-3 py-1 text-white">{tCommon("cancel")}</button>
        </div>
      </div>

      {/* Client component */}
      <TestTranslations />
    </div>
  );
}
