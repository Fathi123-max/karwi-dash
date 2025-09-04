import Link from "next/link";

import { Globe, Shield } from "lucide-react";
import { useTranslations } from "next-intl";

import { AppLogo } from "@/components/app-logo";
import { LanguageSwitcherButtons } from "@/components/i18n/language-switcher-buttons";
import { Button } from "@/components/ui/button";
import { APP_CONFIG } from "@/config/app-config";

export default function LoginV2() {
  const t = useTranslations("auth");
  const tCommon = useTranslations("common");

  return (
    <>
      <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[350px]">
        <div className="space-y-4 text-center">
          {/* Enhanced Logo Section */}
          <div className="mx-auto flex justify-center">
            <AppLogo size="lg" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">
              {t("welcomeTo")} {APP_CONFIG.name}
            </h1>
            <p className="text-muted-foreground text-sm">{t("professionalCarCare")}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <Link href="/admin/login">
              <Button variant="outline" className="h-14 w-full justify-start gap-3 text-base">
                <Shield className="size-5" />
                <span>{t("adminLogin")}</span>
              </Button>
            </Link>
            <Link href="/franchise/login">
              <Button variant="outline" className="h-14 w-full justify-start gap-3 text-base">
                <Shield className="size-5" />
                <span>{t("franchiseLogin")}</span>
              </Button>
            </Link>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="font-medium">{t("newToPlatform")}</h3>
            <p className="text-muted-foreground mt-1 text-sm">{t("contactAdmin")}</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-5 flex w-full justify-between px-10">
        <div className="text-sm">{APP_CONFIG.copyright}</div>
        <div className="flex items-center gap-2">
          <LanguageSwitcherButtons />
        </div>
      </div>
    </>
  );
}
