import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Building2,
  Calendar,
  FileText,
  Home,
  Mail,
  MapPin,
  Package,
  ShoppingCart,
  UsersRound,
  Wrench,
  Image,
  Tag,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

const adminNavItems = (t: (key: string) => string) => [
  { href: "/admin", label: t("navigation.dashboard"), icon: Home },
  { href: "/admin/branches", label: t("navigation.branches"), icon: Building2 },
  { href: "/admin/franchises", label: t("navigation.franchises"), icon: MapPin },
  { href: "/admin/washers", label: t("navigation.washers"), icon: UsersRound },
  { href: "/admin/services", label: t("navigation.services"), icon: Wrench },
  {
    href: "/admin/products",
    label: t("navigation.products"),
    icon: Package,
    subItems: [
      { href: "/admin/products", label: t("navigation.manageProducts") },
      { href: "/admin/products/orders", label: t("navigation.orders") },
    ],
  },
  { href: "/admin/users", label: t("navigation.users"), icon: UsersRound },
  { href: "/admin/payments", label: t("navigation.payments"), icon: FileText },
  // { href: "/admin/schedule", label: t("navigation.schedule"), icon: Calendar }, // Hidden as per requirement
  { href: "/admin/reviews", label: t("navigation.reviews"), icon: FileText },
  // { href: "/admin/promotions", label: t("navigation.promotions"), icon: FileText }, // Hidden as per requirement
  {
    href: "/admin/banners-offers",
    label: t("navigation.bannersOffers"),
    icon: Image,
    subItems: [{ href: "/admin/banners-offers", label: t("navigation.manageAll") }],
  },
];

export function NavAdmin() {
  const pathname = usePathname();
  const t = useTranslations("admin");

  const items = adminNavItems(t);

  return (
    <nav className="grid items-start gap-2">
      {items.map((item) => (
        <div key={item.href}>
          <Link href={item.href}>
            <span
              className={cn(
                "group hover:bg-accent hover:text-accent-foreground flex items-center rounded-md px-3 py-2 text-sm font-medium",
                pathname === item.href ||
                  (item.subItems && item.subItems.some((subItem) => pathname.startsWith(subItem.href)))
                  ? "bg-accent"
                  : "transparent",
              )}
            >
              <item.icon className="mr-2 h-4 w-4 rtl:mr-0 rtl:ml-2" />
              <span className="group-data-[collapsible=icon]:!hidden">{item.label}</span>
            </span>
          </Link>
          {item.subItems && (
            <div className="mt-1 ml-8 space-y-1 rtl:mr-8 rtl:ml-0">
              {item.subItems.map((subItem) => (
                <Link key={subItem.href} href={subItem.href}>
                  <span
                    className={cn(
                      "group hover:bg-accent hover:text-accent-foreground flex items-center rounded-md px-3 py-2 text-sm font-medium",
                      pathname === subItem.href ? "bg-accent" : "transparent",
                    )}
                  >
                    <span className="group-data-[collapsible=icon]:!hidden">{subItem.label}</span>
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
