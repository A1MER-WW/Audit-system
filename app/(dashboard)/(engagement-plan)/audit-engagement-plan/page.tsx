"use client";

import { useMemo, useState } from "react";

import {
  useEngagementPlanPrograms,
  createEngagementPlanProgram,
  deleteEngagementPlanProgram,
} from "@/hooks/useEngagementPlanPrograms";
import EngagementPlanEvaluationTable from "@/components/features/engagement-plan/EngagementPlanEvaluationTable";

export default function AuditEngagementPlanPage() {
  // Year filter
  const yearOptions = [2566, 2567, 2568, 2569];
  const [fiscalYear, setFiscalYear] = useState<number>(2568);

  // Data
  const { programs, isLoading, refetch } =
    useEngagementPlanPrograms(fiscalYear);
  const rows = useMemo(() => programs ?? [], [programs]);

  // Actions
  async function handleCreate() {
    await createEngagementPlanProgram({
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
    await refetch();
  }

  async function handleDelete(id: number) {
    await deleteEngagementPlanProgram(id);
    await refetch();
  }

  return (
    <EngagementPlanEvaluationTable
      fiscalYear={fiscalYear}
      yearOptions={yearOptions}
      rows={rows}
      isLoading={isLoading}
      onFiscalYearChange={setFiscalYear}
      onCreate={handleCreate}
      onDelete={handleDelete}
    />
  );
}
