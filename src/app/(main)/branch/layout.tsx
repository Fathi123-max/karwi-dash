import { ReactNode } from "react";

import { BranchAdminHeader } from "./_components/branch-admin-header";
import { BranchAdminSidebar } from "./_components/branch-admin-sidebar";

export default function BranchAdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <BranchAdminSidebar />
      <div className="flex flex-1 flex-col">
        <BranchAdminHeader />
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
