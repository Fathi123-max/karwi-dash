"use client";

import { useRouter } from "next/navigation";

export function useLocale() {
  // Get locale from cookie
  if (typeof document !== "undefined") {
    const cookie = document.cookie.split("; ").find((row) => row.startsWith("NEXT_LOCALE="));
    return cookie ? cookie.split("=")[1] : "en";
  }
  return "en";
}

export function useChangeLocale() {
  const router = useRouter();

  return (newLocale: string) => {
    // Set the cookie with a 1-year expiration
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;

    // Refresh the page to apply the new locale
    router.refresh();
  };
}
