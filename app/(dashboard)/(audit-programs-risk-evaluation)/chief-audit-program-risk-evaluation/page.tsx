"use client";

import ChiefRiskEvaluationTable from "@/components/features/audit-program-risk-evaluation/ChiefRiskEvaluationTable";
import { useAuditPrograms } from "@/hooks/useAuditPrograms";
import { useState } from "react";

export default function ChiefAuditProgramRiskEvaluationPage() {
  const [fiscalYear, setFiscalYear] = useState(2568);
  const { programs, isLoading } = useAuditPrograms();

  // Filter programs that have been submitted (assuming submitted programs have a certain status)
  const submittedPrograms = programs.filter(program => 
    program.status === "SUBMITTED" || program.status === "AUDITOR_ASSESSING"
  );

  return (
    <ChiefRiskEvaluationTable
      fiscalYear={fiscalYear}
      yearOptions={[2567, 2568, 2569]}
      rows={submittedPrograms}
      isLoading={isLoading}
      onFiscalYearChange={setFiscalYear}
    />
  );
}