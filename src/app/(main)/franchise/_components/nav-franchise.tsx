"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { BarChart3, FileText, MapPin, UsersRound, History, Wrench, Tag, Package } from "lucide-react";

import { cn } from "@/lib/utils";

export function NavFranchise() {
  const t = useTranslations("franchise.nav");
  const pathname = usePathname();

  const franchiseNavItems = [
    { href: "/franchise/analytics", label: t("franchiseAnalytics"), icon: BarChart3 },
    { href: "/franchise/branch-analytics", label: t("branchAnalytics"), icon: BarChart3 },
    { href: "/franchise/promotions", label: t("promotions"), icon: Tag },
    // { href: "/franchise/reports", label: t("reports"), icon: FileText }, // Hidden as per requirements
    { href: "/franchise/branch-management", label: t("branchManagement"), icon: MapPin },
    { href: "/franchise/washer-management", label: t("washerManagement"), icon: UsersRound },
    { href: "/franchise/booking-history", label: t("bookingHistory"), icon: History },
    { href: "/franchise/products", label: t("products"), icon: Package },
  ];

  return (
    <nav className="grid items-start gap-2">
      {franchiseNavItems.map((item) => (
        <Link key={item.href} href={item.href}>
          <span
            className={cn(
              "group hover:bg-accent hover:text-accent-foreground flex items-center rounded-md px-3 py-2 text-sm font-medium",
              pathname === item.href ? "bg-accent" : "transparent",
            )}
          >
            <item.icon className="mr-2 h-4 w-4 rtl:mr-0 rtl:ml-2" />
            <span className="group-data-[collapsible=icon]:!hidden">{item.label}</span>
          </span>
        </Link>
      ))}
    </nav>
  );
}
