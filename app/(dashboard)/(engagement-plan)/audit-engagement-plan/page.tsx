"use client";

import { useMemo, useState } from "react";
import { useEngagementPlan } from "@/contexts/EngagementPlanContext";
import EngagementPlanEvaluationTable from "@/components/features/engagement-plan/EngagementPlanEvaluationTable";
import EngagementPlanStorageStatus from "@/components/features/engagement-plan/EngagementPlanStorageStatus";

export default function AuditEngagementPlanPage() {
  // Year filter
  const yearOptions = [2566, 2567, 2568, 2569];
  const [fiscalYear, setFiscalYear] = useState<number>(2568);

  // Data from context
  const {
    getProgramsByFiscalYear,
    isLoading,
    addProgram,
    deleteProgram,
    refreshPrograms,
  } = useEngagementPlan();

  const rows = useMemo(
    () => getProgramsByFiscalYear(fiscalYear),
    [getProgramsByFiscalYear, fiscalYear]
  );

  // Actions
  async function handleCreate() {
    await addProgram({
      auditTopics: {
        id: Date.now() % 100000,
        category: { id: 1, name: "หน่วยงาน" },
        departments: [
          { id: 999, departmentName: "หน่วยงานทดสอบ", isActive: true },
        ],
        auditTopic: "หัวข้อทดสอบการเพิ่มใหม่",
      },
      fiscalYear,
      status: "PENDING",
      auditor_signature: null,
      director_signature: null,
      director_comment: null,
      version: 1,
    });
  }

  async function handleDelete(id: number) {
    await deleteProgram(id);
  }

  return (
    <div className="space-y-6">
      {/* Main Table */}
      <EngagementPlanEvaluationTable
        fiscalYear={fiscalYear}
        yearOptions={yearOptions}
        rows={rows}
        isLoading={isLoading}
        onFiscalYearChange={setFiscalYear}
        onCreate={handleCreate}
        onDelete={handleDelete}
      />
    </div>
  );
}
