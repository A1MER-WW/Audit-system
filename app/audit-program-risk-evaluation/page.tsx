"use client";

import { useMemo, useState } from "react";

import {
  useAuditPrograms,
  createAuditProgram,
  deleteAuditProgram,
} from "@/hooks/useAuditPrograms";
import RiskEvaluationTable from "@/components/features/audit-program-risk-evaluation/RiskEvaluationTable";

export default function AuditProgramRiskEvaluationPage() {
  // Year filter
  const yearOptions = [2566, 2567, 2568, 2569];
  const [fiscalYear, setFiscalYear] = useState<number>(2568);

  // Data
  const { programs, isLoading, refetch } = useAuditPrograms(fiscalYear);
  const rows = useMemo(() => programs ?? [], [programs]);

  // Actions
  async function handleCreate() {
    await createAuditProgram({
      auditTopics: {
        id: Date.now() % 100000,
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
    await deleteAuditProgram(id);
    await refetch();
  }

  return (
    <RiskEvaluationTable
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
