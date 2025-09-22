"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { HydrationErrorBoundary } from "@/components/hydration-error-boundary"
import { useIsClient } from "@/hooks/use-client"

interface DashboardLayoutClientProps {
  children: React.ReactNode
}

export function DashboardLayoutClient({ children }: DashboardLayoutClientProps) {
  const isClient = useIsClient()

  if (!isClient) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">กำลังโหลด...</div>
      </div>
    )
  }

  return (
    <HydrationErrorBoundary>
      <div suppressHydrationWarning className="prevent-hydration-mismatch">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <SiteHeader />
            <div className="flex flex-1 flex-col gap-4 p-4">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </HydrationErrorBoundary>
  )
}