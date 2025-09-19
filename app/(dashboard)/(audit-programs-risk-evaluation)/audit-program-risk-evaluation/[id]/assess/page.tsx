"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import Link from "next/link";
import { useAuditPrograms } from "@/hooks/useAuditPrograms";
import RiskAssessmentView from "@/components/features/audit-program-risk-evaluation/RiskAssessmentView";
import type { AuditProgramRiskEvaluation, AuditActivityRisk } from "@/hooks/useAuditProgramRiskEvaluation";
import type { RiskAssessment } from "@/hooks/useRiskAssessment";

export default function RiskAssessmentPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  
  const { programs, isLoading } = useAuditPrograms();

  const detail = useMemo((): AuditProgramRiskEvaluation | null => {
    if (!programs || isLoading) return null;
    const found = programs.find((p) => p.id === id);
    if (!found) return null;
    
    // ดึงข้อมูลปัจจัยเสี่ยงจาก localStorage (เหมือนกับหน้า detail)
    const savedRisks = localStorage.getItem(`audit-risks-${id}`);
    let activityRisks: AuditActivityRisk[] = [];
    
    if (savedRisks) {
      try {
        activityRisks = JSON.parse(savedRisks);
      } catch (error) {
        console.error('Error parsing saved risks:', error);
      }
    }
    
    // แปลง AuditProgram เป็น AuditProgramRiskEvaluation
    return {
      ...found,
      AuditActivityRisks: activityRisks
    };
  }, [programs, id, isLoading]);

  // ฟังก์ชันบันทึกการประเมิน
  const handleSaveAssessments = (assessments: RiskAssessment[]) => {
    // ในระบบจริงจะส่งข้อมูลไปยัง API
    console.log('บันทึกการประเมินความเสี่ยง:', assessments);
    alert(`บันทึกการประเมิน ${assessments.length} รายการเรียบร้อยแล้ว`);
  };

  if (Number.isNaN(id)) {
    return (
      <div className="p-6 text-sm text-red-600">ไม่พบรหัสรายการที่ถูกต้อง</div>
    );
  }

  if (isLoading) {
    return (
      <div className="px-6 py-4 space-y-4">
        {/* Skeleton Breadcrumb */}
        <div className="mb-3">
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Skeleton Header */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5 space-y-3">
          <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Loading message */}
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
            </div>
            <div className="text-gray-600 font-medium">กำลังโหลดข้อมูลการประเมินความเสี่ยง...</div>
            <div className="text-sm text-gray-500">กรุณารอสักครู่</div>
          </div>
        </div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-6">
        <div className="text-center space-y-4 max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.312 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">ไม่พบข้อมูล</h3>
            <p className="text-gray-600">
              ไม่พบข้อมูลรายการตรวจสอบที่ต้องการ
            </p>
          </div>
          <div className="pt-4">
            <Link
              href="/audit-program-risk-evaluation"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 active:bg-blue-800"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              กลับไปรายการหลัก
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (detail.AuditActivityRisks.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-6">
        <div className="text-center space-y-4 max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-4">
            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.312 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">ยังไม่มีปัจจัยเสี่ยง</h3>
            <p className="text-gray-600">
              กรุณาเลือกปัจจัยเสี่ยงก่อนทำการประเมินความเสี่ยง
            </p>
          </div>
          <div className="pt-4">
            <Link
              href={`/audit-program-risk-evaluation/${id}`}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 active:bg-blue-800"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              กลับไปเลือกปัจจัยเสี่ยง
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <RiskAssessmentView 
      detail={detail} 
      onSave={handleSaveAssessments}
    />
  );
}