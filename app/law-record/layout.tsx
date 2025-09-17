'use client'

import { AppSidebar } from "@/components/app-sidebar";
import { NavigationHandler } from "@/components/navigate-handler";
import { SiteHeader } from "@/components/site-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function LawRecordLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <NavigationHandler/>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
