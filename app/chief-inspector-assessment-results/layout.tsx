import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ผลการประเมินความเสี่ยง - หัวหน้าผู้ตรวจสอบ",
  description:
    "หน้าแสดงผลการประเมินความเสี่ยงและการเปรียบเทียบปีงบประมาณสำหรับหัวหน้าผู้ตรวจสอบ",
};

export default function ChiefInspectorAssessmentResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
