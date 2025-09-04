import Link from "next/link";

import { Globe, Store } from "lucide-react";
import { useTranslations } from "next-intl";

import { UnifiedLoginForm } from "@/app/(main)/auth/_components/unified-login-form";
import { APP_CONFIG } from "@/config/app-config";

export default function FranchiseLogin() {
  const t = useTranslations("auth");

  return (
    <>
      <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[350px]">
        <div className="space-y-4 text-center">
          <div className="bg-primary/10 mx-auto flex size-16 items-center justify-center rounded-full">
            <Store className="text-primary size-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{t("franchiseLogin")}</h1>
            <p className="text-muted-foreground text-sm">{t("franchiseLoginDescription")}</p>
          </div>
        </div>
        <div className="space-y-4">
          <UnifiedLoginForm role="franchise" />
        </div>
        <div className="text-muted-foreground text-center text-sm">
          <Link href="/auth/v2/login" className="text-primary hover:underline">
            {t("lookingForAdminLogin")}
          </Link>
        </div>
      </div>

      <div className="absolute bottom-5 flex w-full justify-between px-10">
        <div className="text-sm">{APP_CONFIG.copyright}</div>
        <div className="flex items-center gap-1 text-sm">
          <Globe className="text-muted-foreground size-4" />
          ENG
        </div>
      </div>
    </>
  );
}
