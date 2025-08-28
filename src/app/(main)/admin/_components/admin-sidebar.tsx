"use client";

import { Command, Mail } from "lucide-react";

import { NavAdmin } from "@/app/(main)/dashboard/_components/sidebar/nav-admin";
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
                <Command className="size-6" />
                <span className="truncate text-base font-semibold group-data-[collapsible=icon]:!hidden">
                  {APP_CONFIG.name}
                </span>
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
