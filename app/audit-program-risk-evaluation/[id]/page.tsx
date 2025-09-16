"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import { useAuditPrograms } from "@/hooks/useAuditPrograms";
import DetailView from "@/components/features/audit-program-risk-evaluation/DetailView";
import type { AuditProgramRiskEvaluation } from "@/hooks/useAuditProgramRiskEvaluation";

export default function AuditProgramRiskEvaluationDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  
  const { programs, isLoading } = useAuditPrograms();
  
  const detail = useMemo((): AuditProgramRiskEvaluation | null => {
    if (!programs || isLoading) return null;
    const found = programs.find((p) => p.id === id);
    if (!found) return null;
    
    // แปลง AuditProgram เป็น AuditProgramRiskEvaluation
    return {
      ...found,
      AuditActivityRisks: [] // เริ่มต้นด้วย array ว่าง
    };
  }, [programs, id, isLoading]);

  if (Number.isNaN(id)) {
    return (
      <div className="p-6 text-sm text-red-600">ไม่พบรหัสรายการที่ถูกต้อง</div>
    );
  }

  if (isLoading) {
    return <div className="p-6 text-sm text-gray-600">กำลังโหลด...</div>;
  }

  if (!detail) {
    return (
      <div className="p-6">
        <p className="text-sm text-red-600">ไม่พบข้อมูล</p>
      </div>
    );
  }

  return <DetailView detail={detail} />;
}
