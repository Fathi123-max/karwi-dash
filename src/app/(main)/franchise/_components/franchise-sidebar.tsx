"use client";

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

import { NavFranchise } from "./nav-franchise";

export function FranchiseSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="/franchise">
                <AppLogo size="md" className="group-data-[collapsible=icon]:!hidden" />
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:!hidden">Franchise Menu</SidebarGroupLabel>
          <NavFranchise />
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
