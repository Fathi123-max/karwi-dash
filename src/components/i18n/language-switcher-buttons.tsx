"use client";

import { Button } from "@/components/ui/button";
import { useLocale, useChangeLocale } from "@/i18n/client";

export function LanguageSwitcherButtons() {
  const locale = useLocale();
  const changeLocale = useChangeLocale();

  const languages = [
    { code: "en", name: "EN" },
    { code: "ar", name: "AR" },
  ];

  return (
    <div className="flex gap-2">
      {languages.map((lang) => (
        <Button
          key={lang.code}
          variant={locale === lang.code ? "default" : "outline"}
          size="sm"
          onClick={() => changeLocale(lang.code)}
        >
          {lang.name}
        </Button>
      ))}
    </div>
  );
}
