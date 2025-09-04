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

import { cn } from "@/lib/utils";

const adminNavItems = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/branches", label: "Branches", icon: Building2 },
  { href: "/admin/franchises", label: "Franchises", icon: MapPin },
  { href: "/admin/washers", label: "Washers", icon: UsersRound },
  { href: "/admin/services", label: "Services", icon: Wrench },
  {
    href: "/admin/products",
    label: "Products",
    icon: Package,
    subItems: [
      { href: "/admin/products", label: "Manage Products" },
      { href: "/admin/products/orders", label: "Orders" },
    ],
  },
  { href: "/admin/users", label: "Users", icon: UsersRound },
  { href: "/admin/payments", label: "Payments", icon: FileText },
  { href: "/admin/schedule", label: "Schedule", icon: Calendar },
  { href: "/admin/reviews", label: "Reviews", icon: FileText },
  // { href: "/admin/promotions", label: "Promotions", icon: FileText }, // Hidden as per requirement
  {
    href: "/admin/banners-offers",
    label: "Banners & Offers",
    icon: Image,
    subItems: [{ href: "/admin/banners-offers", label: "Manage All" }],
  },
];

export function NavAdmin() {
  const pathname = usePathname();

  return (
    <nav className="grid items-start gap-2">
      {adminNavItems.map((item) => (
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
              <item.icon className="mr-2 h-4 w-4" />
              <span className="group-data-[collapsible=icon]:!hidden">{item.label}</span>
            </span>
          </Link>
          {item.subItems && (
            <div className="mt-1 ml-8 space-y-1">
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
