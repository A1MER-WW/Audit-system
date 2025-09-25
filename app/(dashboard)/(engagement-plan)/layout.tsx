"use client";

import { EngagementPlanProvider } from "@/contexts/EngagementPlanContext";

export default function EngagementPlanLayout({
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