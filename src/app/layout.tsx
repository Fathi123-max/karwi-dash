import { ReactNode } from "react";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";

import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";

import { Toaster } from "@/components/ui/sonner";
import { APP_CONFIG } from "@/config/app-config";
import { getPreference } from "@/server/server-actions";
import { PreferencesStoreProvider } from "@/stores/preferences/preferences-provider";
import { THEME_MODE_VALUES, THEME_PRESET_VALUES, type ThemePreset, type ThemeMode } from "@/types/preferences/theme";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// Favicon metadata
const faviconBasePath = "/icons/favicon_light";
export const metadata: Metadata = {
  title: APP_CONFIG.meta.title,
  description: APP_CONFIG.meta.description,
  icons: {
    icon: [
      { url: `${faviconBasePath}/favicon.ico` },
      { url: `${faviconBasePath}/favicon-16x16.png`, sizes: "16x16", type: "image/png" },
      { url: `${faviconBasePath}/favicon-32x32.png`, sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: `${faviconBasePath}/apple-touch-icon.png` }],
  },
  manifest: `${faviconBasePath}/site.webmanifest`,
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-title": APP_CONFIG.meta.title,
    "theme-color": "#ffffff", // Default theme color from your manifest
  },
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const locale = await getLocale();
  const themeMode = await getPreference<ThemeMode>("theme_mode", THEME_MODE_VALUES, "light");
  const themePreset = await getPreference<ThemePreset>("theme_preset", THEME_PRESET_VALUES, "default");
  const messages = await getMessages();

  // Set text direction based on locale
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={themeMode === "dark" ? "dark" : ""}
      data-theme-preset={themePreset}
      suppressHydrationWarning
    >
      <body className={`${inter.className} min-h-screen antialiased`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <PreferencesStoreProvider themeMode={themeMode} themePreset={themePreset}>
            {children}
            <Toaster />
          </PreferencesStoreProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
