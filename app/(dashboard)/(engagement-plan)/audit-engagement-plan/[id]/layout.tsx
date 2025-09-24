"use client";

import { EngagementPlanProvider } from "@/hooks/useEngagementPlan";
import { useParams } from "next/navigation";

export default function EngagementPlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const id = params?.id as string;

  return (
    <EngagementPlanProvider planId={id}>
      {children}
    </EngagementPlanProvider>
  );
}