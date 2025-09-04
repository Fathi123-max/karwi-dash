import { getTranslations } from "next-intl/server";

import { DashboardHeader } from "@/components/i18n/dashboard-header";
import { TestTranslations } from "@/components/i18n/test-translations";

export async function generateMetadata() {
  const t = await getTranslations("dashboard");
  return {
    title: t("welcome"),
  };
}

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="container flex-1 py-8">
        <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
        <TestTranslations />
      </main>
    </div>
  );
}
