import { cookies, headers } from "next/headers";

import { getRequestConfig } from "next-intl/server";

// Define the available locales
export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];

// Function to detect the user's preferred locale
async function getLocaleFromHeader(): Promise<Locale | null> {
  const headersList = await headers();
  const acceptLanguage = headersList.get("accept-language");
  if (!acceptLanguage) return null;

  // Extract the first locale from the Accept-Language header
  const locale = acceptLanguage.split(",")[0].split("-")[0];
  return locales.includes(locale as Locale) ? (locale as Locale) : null;
}

export default getRequestConfig(async () => {
  // Get the locale from the cookie first
  const cookieLocale = (await cookies()).get("NEXT_LOCALE")?.value;

  // If no cookie locale, try to detect from browser header
  const detectedLocale = await getLocaleFromHeader();

  // Default to English if no locale detected
  const locale =
    cookieLocale && locales.includes(cookieLocale as Locale) ? (cookieLocale as Locale) : detectedLocale || "en";

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
