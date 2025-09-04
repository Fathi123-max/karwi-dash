import { getTranslations } from "next-intl/server";

import { LanguageSwitcherButtons } from "@/components/i18n/language-switcher-buttons";
import { TestTranslations } from "@/components/i18n/test-translations";

export async function generateMetadata() {
  const t = await getTranslations("dashboard");
  return {
    title: t("welcome"),
  };
}

export default function I18nTestPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">I18n Test Page</h1>
        <LanguageSwitcherButtons />
      </div>

      <TestTranslations />

      <div className="mt-8 rounded-lg bg-gray-100 p-4">
        <h2 className="mb-2 text-lg font-semibold">Instructions:</h2>
        <p>1. Use the language buttons above to switch between English and Arabic</p>
        <p>2. The page will automatically refresh with the new language</p>
        <p>3. Your language preference is saved in a cookie</p>
      </div>
    </div>
  );
}
