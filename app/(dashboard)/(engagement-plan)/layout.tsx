"use client";

import { useParams } from "next/navigation";
import { EngagementPlanProvider } from "@/hooks/useEngagementPlan";

export default function EngagementPlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const planId = params?.id as string || "default";

  return (
    <EngagementPlanProvider planId={planId}>
      {children}
    </EngagementPlanProvider>
  );
}