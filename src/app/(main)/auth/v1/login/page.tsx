import Link from "next/link";

import { Command } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { LoginForm } from "../../_components/login-form";
import { GoogleButton } from "../../_components/social-auth/google-button";

export async function generateMetadata() {
  const t = await getTranslations("auth");
  return {
    title: t("login"),
  };
}

export default async function LoginV1() {
  const t = await getTranslations("auth");

  return (
    <div className="flex h-dvh">
      <div className="bg-primary hidden lg:block lg:w-1/3">
        <div className="flex h-full flex-col items-center justify-center p-12 text-center">
          <div className="space-y-6">
            <Command className="text-primary-foreground mx-auto size-12" />
            <div className="space-y-2">
              <h1 className="text-primary-foreground text-5xl font-light">{t("welcomeBack")}</h1>
              <p className="text-primary-foreground/80 text-xl">{t("loginToContinue")}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-background flex w-full items-center justify-center p-8 lg:w-2/3">
        <div className="w-full max-w-md space-y-10 py-24 lg:py-32">
          <div className="space-y-4 text-center">
            <div className="font-medium tracking-tight">{t("login")}</div>
            <div className="text-muted-foreground mx-auto max-w-xl">{t("loginDescription")}</div>
          </div>
          <div className="space-y-4">
            <LoginForm />
            <GoogleButton className="w-full" variant="outline" />
          </div>
        </div>
      </div>
    </div>
  );
}
