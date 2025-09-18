"use client";

import { useParams } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { useAuditPrograms } from "@/hooks/useAuditPrograms";
import DetailView from "@/components/features/audit-program-risk-evaluation/DetailView";
import type { AuditProgramRiskEvaluation, AuditActivityRisk } from "@/hooks/useAuditProgramRiskEvaluation";
import type { RiskFactorPickerValues } from "@/components/features/audit-program-risk-evaluation/popup/RiskFactorPickerModal";

export default function AuditProgramRiskEvaluationDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  
  const { programs, isLoading } = useAuditPrograms();
  
  // State สำหรับเก็บปัจจัยเสี่ยงที่เพิ่มเข้ามา
  const [activityRisks, setActivityRisks] = useState<AuditActivityRisk[]>([]);

  // โหลดข้อมูลจาก localStorage เมื่อ component mount
  useEffect(() => {
    const savedRisks = localStorage.getItem(`audit-risks-${id}`);
    if (savedRisks) {
      try {
        const parsed = JSON.parse(savedRisks);
        setActivityRisks(parsed);
      } catch (error) {
        console.error('Error loading saved risks:', error);
      }
    }
  }, [id]);
  
  const detail = useMemo((): AuditProgramRiskEvaluation | null => {
    if (!programs || isLoading) return null;
    const found = programs.find((p) => p.id === id);
    if (!found) return null;
    
    // แปลง AuditProgram เป็น AuditProgramRiskEvaluation
    return {
      ...found,
      AuditActivityRisks: activityRisks // ใช้ state ที่จัดการแยก
    };
  }, [programs, id, isLoading, activityRisks]);

  // ฟังก์ชันเพิ่มปัจจัยเสี่ยงใหม่
  const handleAddFactor = (values: RiskFactorPickerValues) => {
    const newRisk: AuditActivityRisk = {
      id: Date.now(), // ใช้ timestamp เป็น id ชั่วคราว
      processes: values.process || "",
      risk_factors: Array.isArray(values.dimension) ? values.dimension.join(",") : (values.dimension || ""),
      object: values.riskFactor || "",
      risks_assessment: [] // เริ่มต้นด้วย array ว่าง
    };

    setActivityRisks(prev => {
      const updated = [...prev, newRisk];
      // บันทึกไปยัง localStorage
      localStorage.setItem(`audit-risks-${id}`, JSON.stringify(updated));
      return updated;
    });
  };

  // ฟังก์ชันลบปัจจัยเสี่ยง
  const handleDeleteFactor = (riskId: number) => {
    setActivityRisks(prev => {
      const updated = prev.filter(risk => risk.id !== riskId);
      // บันทึกไปยัง localStorage
      localStorage.setItem(`audit-risks-${id}`, JSON.stringify(updated));
      return updated;
    });
  };

  // ฟังก์ชันบันทึกข้อมูล
  const handleSave = () => {
    // ในอนาคตสามารถเชื่อมต่อ API เพื่อบันทึกข้อมูลได้
    console.log('บันทึกข้อมูลปัจจัยเสี่ยง:', activityRisks);
    alert('บันทึกข้อมูลเรียบร้อยแล้ว');
  };

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

  return (
    <DetailView 
      detail={detail} 
      onAddFactor={handleAddFactor}
      onDeleteFactor={handleDeleteFactor}
      onSave={handleSave}
    />
  );
}
