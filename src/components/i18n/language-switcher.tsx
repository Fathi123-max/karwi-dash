"use client";

import { Languages } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLocale, useChangeLocale } from "@/i18n/client";

export function LanguageSwitcher() {
  const locale = useLocale();
  const changeLocale = useChangeLocale();

  const languages = [
    { code: "en", name: "English" },
    { code: "ar", name: "العربية" },
  ];

  return (
    <div className="flex items-center gap-2">
      <Languages className="h-4 w-4" />
      <select
        value={locale}
        onChange={(e) => changeLocale(e.target.value)}
        className="border-0 bg-transparent p-0 focus:ring-0"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}
