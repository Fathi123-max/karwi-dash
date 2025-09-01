"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { BarChart, Calendar, Car, Home, LogOut, Menu, Package, Users, Wrench } from "lucide-react";

import { branchAdminLogout } from "@/app/(main)/auth/_actions/branch-admin-logout";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navItems = [
  {
    title: "Dashboard",
    href: "/branch",
    icon: Home,
  },
  {
    title: "Bookings",
    href: "/branch/bookings",
    icon: Calendar,
  },
  {
    title: "Services",
    href: "/branch/services",
    icon: Package,
  },
  {
    title: "Washers",
    href: "/branch/washers",
    icon: Users,
  },
  {
    title: "Vehicles",
    href: "/branch/vehicles",
    icon: Car,
  },
  {
    title: "Equipment",
    href: "/branch/equipment",
    icon: Wrench,
  },
  {
    title: "Reports",
    href: "/branch/reports",
    icon: BarChart,
  },
];

export function BranchAdminSidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    await branchAdminLogout();
  };

  return (
    <>
      {/* Mobile sidebar */}
      <Sheet>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="outline" size="icon">
            <Menu className="h-4 w-4" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-full flex-col">
            <div className="border-b p-4">
              <h2 className="text-lg font-semibold">Branch Admin</h2>
            </div>
            <nav className="flex-1 overflow-y-auto p-2">
              <ul className="space-y-1">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "hover:bg-accent hover:text-accent-foreground flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                        pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="border-t p-2">
              <Button variant="ghost" className="w-full justify-start gap-3 px-3" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:border-r">
        <div className="flex h-full flex-col">
          <div className="border-b p-4">
            <h2 className="text-lg font-semibold">Branch Admin</h2>
          </div>
          <nav className="flex-1 overflow-y-auto p-2">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "hover:bg-accent hover:text-accent-foreground flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="border-t p-2">
            <Button variant="ghost" className="w-full justify-start gap-3 px-3" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
