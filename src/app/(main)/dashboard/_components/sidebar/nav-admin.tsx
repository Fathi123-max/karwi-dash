import Link from "next/link";
import { usePathname } from "next/navigation";

import { BarChart3, Building2, Calendar, FileText, Home, Mail, MapPin, UsersRound, Wrench } from "lucide-react";

import { cn } from "@/lib/utils";

const adminNavItems = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/branches", label: "Branches", icon: Building2 },
  { href: "/admin/franchises", label: "Franchises", icon: MapPin },
  { href: "/admin/washers", label: "Washers", icon: UsersRound },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/users", label: "Users", icon: UsersRound },
  { href: "/admin/payments", label: "Payments", icon: FileText },
  { href: "/admin/schedule", label: "Schedule", icon: Calendar },
  { href: "/admin/reviews", label: "Reviews", icon: FileText },
  { href: "/admin/promotions", label: "Promotions", icon: FileText },
];

export function NavAdmin() {
  const pathname = usePathname();
  return (
    <nav className="grid items-start gap-2">
      {adminNavItems.map((item) => (
        <Link key={item.href} href={item.href}>
          <span
            className={cn(
              "group hover:bg-accent hover:text-accent-foreground flex items-center rounded-md px-3 py-2 text-sm font-medium",
              pathname === item.href ? "bg-accent" : "transparent",
            )}
          >
            <item.icon className="mr-2 h-4 w-4" />
            <span className="group-data-[collapsible=icon]:!hidden">{item.label}</span>
          </span>
        </Link>
      ))}
    </nav>
  );
}
