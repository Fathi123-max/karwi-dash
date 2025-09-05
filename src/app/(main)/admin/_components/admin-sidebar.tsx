"use client";

import { useEffect, useState } from "react";

import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";

import { NavAdmin } from "@/app/(main)/dashboard/_components/sidebar/nav-admin";
import { AppLogo } from "@/components/app-logo";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { APP_CONFIG } from "@/config/app-config";

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations("admin");
  const [sidebarSide, setSidebarSide] = useState<"left" | "right">("left");

  useEffect(() => {
    // Set initial side based on document direction
    const isRtl = document.documentElement.dir === "rtl";
    setSidebarSide(isRtl ? "right" : "left");

    // Create a MutationObserver to watch for changes to the dir attribute
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "dir") {
          const isRtl = document.documentElement.dir === "rtl";
          setSidebarSide(isRtl ? "right" : "left");
        }
      });
    });

    // Start observing the document element for attribute changes
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["dir"],
    });

    // Clean up the observer when the component unmounts
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <Sidebar side={sidebarSide} {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="/admin">
                <AppLogo size="md" className="group-data-[collapsible=icon]:!hidden" />
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:!hidden">{t("menu.admin")}</SidebarGroupLabel>
          <NavAdmin />
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:!hidden">{t("menu.marketing")}</SidebarGroupLabel>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/admin/email-marketing">
                <Mail className="rtl:sidebar-icon" />
                <span className="group-data-[collapsible=icon]:!hidden">{t("menu.emailMarketing")}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
