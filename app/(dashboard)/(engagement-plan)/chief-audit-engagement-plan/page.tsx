"use client";

import { useMemo, useState } from "react";
import { useEngagementPlan } from "@/contexts/EngagementPlanContext";
import EngagementPlanEvaluationTable from "@/components/features/engagement-plan/EngagementPlanEvaluationTable";

export default function ChiefAuditEngagementPlanPage() {
  // Year filter
  const yearOptions = [2566, 2567, 2568, 2569];
  const [fiscalYear, setFiscalYear] = useState<number>(2568);

  // Data from context (ใช้ข้อมูลเดียวกันกับระบบหลัก)
  const {
    getProgramsByFiscalYear,
    isLoading,
  } = useEngagementPlan();

  const rows = useMemo(
    () => getProgramsByFiscalYear(fiscalYear),
    [getProgramsByFiscalYear, fiscalYear]
  );

  return (
    <div className="space-y-6">
      <EngagementPlanEvaluationTable
        title="หัวหน้าผู้ตรวจสอบภายใน - รายการแผนงานตรวจสอบ"
        subtitle="แผนงานตรวจสอบและประเมินความเสี่ยงที่ผู้ตรวจสอบได้ดำเนินการแล้ว รอการพิจารณาอนุมัติ"
        fiscalYear={fiscalYear}
        onFiscalYearChange={setFiscalYear}
        yearOptions={yearOptions}
        rows={rows}
        isLoading={isLoading}
        showCreateButton={false}
        basePath="/chief-audit-engagement-plan"
      />
    </div>
  );
}