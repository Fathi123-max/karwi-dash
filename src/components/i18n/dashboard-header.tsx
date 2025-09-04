"use client";

import { Bell, Settings, User } from "lucide-react";
import { useTranslations } from "next-intl";

import { LanguageSwitcherButtons } from "@/components/i18n/language-switcher-buttons";
import { Button } from "@/components/ui/button";

export function DashboardHeader() {
  const t = useTranslations("navigation");
  const tCommon = useTranslations("common");

  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">{t("dashboard")}</h1>
          <nav className="hidden items-center space-x-4 md:flex">
            <Button variant="ghost" size="sm">
              {t("services")}
            </Button>
            <Button variant="ghost" size="sm">
              {t("bookings")}
            </Button>
            <Button variant="ghost" size="sm">
              {t("staff")}
            </Button>
            <Button variant="ghost" size="sm">
              {t("reports")}
            </Button>
          </nav>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">{tCommon("notifications")}</span>
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
            <span className="sr-only">{t("settings")}</span>
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
            <span className="sr-only">{tCommon("profile")}</span>
          </Button>
          <LanguageSwitcherButtons />
        </div>
      </div>
    </header>
  );
}
