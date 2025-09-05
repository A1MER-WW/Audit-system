// app/(your-segment)/risk-assessment/results/page.tsx
"use client";

import { useState } from "react";
import DashboardSection from "@/components/features/chief-Inspector/risk-assessment/risk-assessment-dashboard-section";
import SummaryToolbar from "@/components/summary-toolbar";
import RiskAssessmentResultsSectionPage from "@/components/features/chief-Inspector/risk-assessment/risk-assessment-results-section";
import { ActiveFilters } from "@/components/features/chief-Inspector/risk-assessment/active-filters";

export type FilterType = {
  grade?: "H" | "M" | "L";
  category?: string;
};

export default function RiskAssessmentPage() {
  const [outerTab, setOuterTab] = useState<
    "summary" | "reorder" | "unitRanking"
  >("summary");
  const [scoreSortDir, setScoreSortDir] = useState<"desc" | "asc">("desc");
  const [filter, setFilter] = useState<FilterType>({});

  const clearFilter = () => setFilter({});

  return (
    <div className="min-h-svh space-y-4">
      {/* บล็อกกราฟ/สรุปด้านบน */}
      <div className="space-y-4">
        <DashboardSection 
          year={2568} 
          statusText="รอหัวหน้าหน่วยตรวจสอบพิจารณา"
          onGradeClick={(grade) => setFilter(prev => ({ ...prev, grade }))}
          onCategoryClick={(category) => setFilter(prev => ({ ...prev, category }))}
          activeFilter={filter}
        />

        <ActiveFilters 
          grade={filter.grade}
          category={filter.category}
          onClear={clearFilter}
        />
      </div>

      {/* แถบสรุปใต้กราฟ ตามภาพ */}
      <SummaryToolbar
        value={outerTab}
        onChange={setOuterTab}
        sortDir={scoreSortDir}
        onSortDirChange={(dir) => setScoreSortDir(dir)}
      />

      {/* ตาราง/แท็บด้านล่าง คุมด้วย state เดียวกัน */}
      <RiskAssessmentResultsSectionPage
        outerTab={outerTab}
        onOuterTabChange={setOuterTab}
        filter={filter}
      />
    </div>
  );
}
