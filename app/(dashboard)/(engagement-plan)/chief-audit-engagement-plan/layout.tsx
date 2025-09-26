"use client";

import { EngagementPlanProvider } from "@/contexts/EngagementPlanContext";

export default function ChiefAuditEngagementPlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EngagementPlanProvider>
      {children}
    </EngagementPlanProvider>
  );
}