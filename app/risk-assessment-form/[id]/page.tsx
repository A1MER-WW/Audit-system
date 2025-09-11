"use client";

import { Suspense } from "react";
import RiskAssessmentFormPage from "@/components/features/inspector/risk-assessment/risk-assessment-form";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// Loading component สำหรับหน้าฟอร์ม
function FormPageSkeleton() {
  return (
    <div className="w-full h-full p-6 space-y-6">
      {/* Top bar skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Header meta card skeleton */}
      <Card className="border-dashed">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <div className="flex items-center gap-4 text-sm">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-center">
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-8 w-16" />
              </div>
              <div className="text-center">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-20" />
              </div>
              <div className="text-center">
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Navigation buttons skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>

      {/* Form content skeleton */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>

        {/* Form groups skeleton */}
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-64" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((j) => (
                <div key={j} className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center p-4 border rounded-lg">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Save button skeleton */}
      <div className="flex justify-end pt-4">
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}

export default function Page({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-svh">
      <Suspense fallback={<FormPageSkeleton />}>
        <RiskAssessmentFormPage id={params.id} />
      </Suspense>
    </div>
  );
}
