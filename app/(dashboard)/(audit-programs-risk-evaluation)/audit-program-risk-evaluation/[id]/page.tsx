"use client";

import { useParams } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { useAuditPrograms, updateProgramStatus } from "@/hooks/useAuditPrograms";
import DetailView from "@/components/features/audit-program-risk-evaluation/DetailView";
import type { AuditProgramRiskEvaluation, AuditActivityRisk } from "@/hooks/useAuditProgramRiskEvaluation";
import type { RiskFactorPickerValues } from "@/components/features/audit-program-risk-evaluation/popup/RiskFactorPickerModal";

export default function AuditProgramRiskEvaluationDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  
  const { programs, isLoading, refetch } = useAuditPrograms();
  
  // State สำหรับเก็บปัจจัยเสี่ยงที่เพิ่มเข้ามา
  const [activityRisks, setActivityRisks] = useState<AuditActivityRisk[]>([]);
  const [hasStatusUpdated, setHasStatusUpdated] = useState(false);

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

  // อัปเดตสถานะเมื่อเข้าหน้าครั้งแรก (จาก PENDING เป็น AUDITOR_ASSESSING)
  useEffect(() => {
    const updateStatusOnEntry = async () => {
      if (!programs || isLoading || hasStatusUpdated) return;
      
      const currentProgram = programs.find(p => p.id === id);
      if (currentProgram && currentProgram.status === "PENDING") {
        try {
          console.log(`🔄 Updating status for program ${id} from PENDING to AUDITOR_ASSESSING`);
          await updateProgramStatus(id, "AUDITOR_ASSESSING");
          await refetch(); // รีเฟรชข้อมูล
          setHasStatusUpdated(true);
          
          // แสดง toast notification
          import('@/hooks/useToast').then(({ showToast }) => {
            showToast({
              title: "เริ่มดำเนินการประเมินความเสี่ยง",
              description: "สถานะได้ถูกอัปเดตเป็น 'กำลังดำเนินการประเมินความเสี่ยง'",
              variant: "success",
              duration: 3000
            });
          });
        } catch (error) {
          console.error('Error updating program status:', error);
        }
      }
    };

    updateStatusOnEntry();
  }, [programs, isLoading, id, hasStatusUpdated, refetch]);
  
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
    const processValue = values.process || "";
    const riskFactorsValue = Array.isArray(values.dimension) ? values.dimension.join(",") : (values.dimension || "");
    const objectValue = values.riskFactor || "";

    // ตรวจสอบข้อมูลซ้ำ
    const isDuplicate = activityRisks.some(risk => 
      risk.processes === processValue && 
      risk.risk_factors === riskFactorsValue &&
      risk.object === objectValue
    );

    if (isDuplicate) {
      // ใช้ dynamic import เพื่อหลีกเลี่ยง server-side rendering issues
      import('@/hooks/useToast').then(({ showToast }) => {
        showToast({
          title: "พบข้อมูลที่ซ้ำกัน",
          description: "กระบวนงาน ด้าน และปัจจัยเสี่ยงที่เลือกมีอยู่แล้ว กรุณาเลือกข้อมูลที่แตกต่างกัน",
          variant: "warning",
          duration: 4000
        });
      });
      return;
    }

    const newRisk: AuditActivityRisk = {
      id: Date.now(), // ใช้ timestamp เป็น id ชั่วคราว
      processes: processValue,
      risk_factors: riskFactorsValue,
      object: objectValue,
      risks_assessment: [] // เริ่มต้นด้วย array ว่าง
    };

    setActivityRisks(prev => {
      const updated = [...prev, newRisk];
      // บันทึกไปยัง localStorage
      localStorage.setItem(`audit-risks-${id}`, JSON.stringify(updated));
      
      // แสดง success toast
      import('@/hooks/useToast').then(({ showToast }) => {
        showToast({
          title: "เพิ่มปัจจัยเสี่ยงสำเร็จ",
          description: "ปัจจัยเสี่ยงได้ถูกเพิ่มในรายการแล้ว",
          variant: "success",
          duration: 3000
        });
      });
      
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

  // ฟังก์ชันบันทึกข้อมูลและอัปเดตสถานะ
  const handleSave = async () => {
    // บันทึกข้อมูลปัจจัยเสี่ยง
    console.log('บันทึกข้อมูลปัจจัยเสี่ยง:', activityRisks);
    
    try {
      // อัปเดตสถานะเป็น COMPLETED หากมีการประเมินความเสี่ยงแล้ว
      const hasAssessments = activityRisks.some(risk => 
        risk.risks_assessment && risk.risks_assessment.length > 0
      );
      
      if (hasAssessments) {
        console.log(`🔄 Updating status for program ${id} to COMPLETED`);
        await updateProgramStatus(id, "COMPLETED");
        await refetch(); // รีเฟรชข้อมูล
        
        import('@/hooks/useToast').then(({ showToast }) => {
          showToast({
            title: "เสร็จสิ้นการประเมินความเสี่ยง",
            description: "สถานะได้ถูกอัปเดตเป็น 'เสร็จสิ้นการประเมิน'",
            variant: "success",
            duration: 4000
          });
        });
      } else {
        import('@/hooks/useToast').then(({ showToast }) => {
          showToast({
            title: "บันทึกข้อมูลเรียบร้อย",
            description: `บันทึกปัจจัยเสี่ยง ${activityRisks.length} รายการแล้ว`,
            variant: "success",
            duration: 3000
          });
        });
      }
    } catch (error) {
      console.error('Error saving or updating status:', error);
      import('@/hooks/useToast').then(({ showToast }) => {
        showToast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
          variant: "error",
          duration: 4000
        });
      });
    }
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
