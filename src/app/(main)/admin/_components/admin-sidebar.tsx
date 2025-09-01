"use client";

import { Mail } from "lucide-react";

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
  return (
    <Sidebar {...props}>
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
          <SidebarGroupLabel className="group-data-[collapsible=icon]:!hidden">Admin Menu</SidebarGroupLabel>
          <NavAdmin />
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:!hidden">Marketing</SidebarGroupLabel>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/admin/email-marketing">
                <Mail />
                <span className="group-data-[collapsible=icon]:!hidden">Email Marketing</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
