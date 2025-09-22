"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import Link from "next/link";
import { useAuditPrograms } from "@/hooks/useAuditPrograms";
import { useRiskAssessmentData } from "@/hooks/useRiskAssessmentData";
import RiskAssessmentResultView from "@/components/features/audit-program-risk-evaluation/RiskAssessmentResultView";
import type { AuditProgramRiskEvaluation, AuditActivityRisk } from "@/hooks/useAuditProgramRiskEvaluation";

export default function RiskAssessmentResultsPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  
  const { programs, isLoading } = useAuditPrograms();
  useRiskAssessmentData(id); // เรียกใช้ hook แต่ไม่ใช้ return value

  // Helper function สำหรับแปลง risk level
  const getRiskLevelLabel = (level: string) => {
    switch (level) {
      case "NEGLIGIBLE":
        return "น้อยที่สุด";
      case "LOW":
        return "น้อย";
      case "MEDIUM":
        return "ปานกลาง";
      case "HIGH":
        return "สูง";
      case "VERY_HIGH":
        return "สูงมาก";
      default:
        return "ไม่ระบุ";
    }
  };

  const detail = useMemo((): AuditProgramRiskEvaluation | null => {
    console.log('=== BUILDING DETAIL OBJECT ===');
    console.log('programs:', programs);
    console.log('isLoading:', isLoading);
    console.log('id:', id);
    
    if (!programs || isLoading) return null;
    const found = programs.find((p) => p.id === id);
    if (!found) {
      console.log('Program not found for id:', id, 'Available programs:', programs);
      return null;
    }
    
    // ดึงข้อมูลปัจจัยเสี่ยงจาก localStorage (จำลองการเก็บข้อมูลจาก step 1 และ 2)
    const savedRisks = localStorage.getItem(`audit-risks-${id}`);
    const savedAssessments = localStorage.getItem(`risk-assessments-${id}`);
    
    console.log('Saved risks:', savedRisks);
    console.log('Saved assessments:', savedAssessments);
    
    let activityRisks: AuditActivityRisk[] = [];
    
    if (savedRisks) {
      try {
        activityRisks = JSON.parse(savedRisks);
        
        // ถ้ามีการประเมินแล้ว ให้เพิ่มข้อมูลการประเมิน
        if (savedAssessments) {
          const assessments = JSON.parse(savedAssessments);
          console.log('Parsed assessments:', assessments);
          
          activityRisks = activityRisks.map(risk => {
            // หาการประเมินที่ตรงกับ risk นี้ โดยใช้ factorId
            const relatedAssessments = assessments.filter((assess: Record<string, unknown>) => 
              assess.factorId === risk.id
            );
            
            console.log(`Risk ${risk.id} has ${relatedAssessments.length} assessments:`, relatedAssessments);
            
            // แปลงเป็นรูปแบบ RiskAssessment ที่ต้องการ
            const risks_assessment = relatedAssessments.map((assess: Record<string, unknown>, index: number) => ({
              id: (assess.factorId as number) * 100 + ((assess.subFactorIndex as number) || index), // ใช้ subFactorIndex ถ้ามี
              risk_factor: assess.dimension as string,
              likelihood_score: assess.probability as number,
              impact_score: assess.impact as number,
              total_score: assess.riskScore as number,
              risk_ranking: index + 1,
              risk_ranking_by_user: null,
              reason_for_new_risk_ranking: null,
              risk_level: {
                grade_code: assess.riskLevel as string,
                grade: getRiskLevelLabel(assess.riskLevel as string)
              }
            }));
            
            console.log(`Risk ${risk.id} final assessment:`, risks_assessment);
            
            return {
              ...risk,
              risks_assessment
            };
          });
        }
      } catch (error) {
        console.error('Error parsing saved data:', error);
      }
    }
    
    // ถ้าไม่มีข้อมูลจริง ให้ใช้ mock data สำหรับทดสอบ
    if (activityRisks.length === 0) {
      activityRisks = [
        {
          id: 1,
          processes: "followup-evaluation",
          risk_factors: "strategy,finance",
          object: "[ด้านกลยุทธ์]\nแนวโน้มของการปรับเปลี่ยนนโยบายระดับชาติ อาจส่งผลต่อการดำเนินงานของหน่วยงาน\n\n---\n\n[ด้านการเงิน]\nงบประมาณที่ได้รับการจัดสรรไม่เพียงพอต่อการดำเนินงานตามแผน",
          risks_assessment: [
            {
              id: 101,
              risk_factor: "strategy",
              likelihood_score: 3,
              impact_score: 4,
              total_score: 12,
              risk_ranking: 1,
              risk_ranking_by_user: null,
              reason_for_new_risk_ranking: null,
              risk_level: {
                grade_code: "MEDIUM",
                grade: "ปานกลาง"
              }
            },
            {
              id: 102,
              risk_factor: "finance",
              likelihood_score: 4,
              impact_score: 4,
              total_score: 16,
              risk_ranking: 1,
              risk_ranking_by_user: null,
              reason_for_new_risk_ranking: null,
              risk_level: {
                grade_code: "HIGH",
                grade: "สูง"
              }
            }
          ]
        },
        {
          id: 2,
          processes: "project-proposal",
          risk_factors: "operations",
          object: "[ด้านการดำเนินงาน]\nการขาดแคลนบุคลากรที่มีความเชี่ยวชาญเฉพาะด้าน อาจส่งผลต่อคุณภาพของงาน",
          risks_assessment: [
            {
              id: 201,
              risk_factor: "operations",
              likelihood_score: 4,
              impact_score: 3,
              total_score: 12,
              risk_ranking: 2,
              risk_ranking_by_user: null,
              reason_for_new_risk_ranking: null,
              risk_level: {
                grade_code: "MEDIUM",
                grade: "ปานกลาง"
              }
            }
          ]
        },
        {
          id: 3,
          processes: "budget-appropriation-request", 
          risk_factors: "regulatorycompliance",
          object: "[ด้านการปฏิบัติตามกฎระเบียบ]\nการเปลี่ยนแปลงกฎระเบียบใหม่ อาจทำให้การดำเนินงานไม่เป็นไปตามข้อกำหนด",
          risks_assessment: [
            {
              id: 301,
              risk_factor: "regulatorycompliance",
              likelihood_score: 5,
              impact_score: 5,
              total_score: 25,
              risk_ranking: 1,
              risk_ranking_by_user: null,
              reason_for_new_risk_ranking: null,
              risk_level: {
                grade_code: "VERY_HIGH",
                grade: "สูงมาก"
              }
            }
          ]
        }
      ];
    }
    
    console.log('Final activityRisks:', activityRisks);
    
    // แปลง AuditProgram เป็น AuditProgramRiskEvaluation
    return {
      ...found,
      AuditActivityRisks: activityRisks
    };
  }, [programs, id, isLoading]);

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
            <div className="text-gray-600 font-medium">กำลังโหลดผลการประเมินความเสี่ยง...</div>
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

  // ตรวจสอบว่ามีข้อมูลการประเมินหรือไม่
  const hasAssessmentData = (() => {
    try {
      const savedAssessments = localStorage.getItem(`risk-assessments-${id}`);
      return savedAssessments !== null && JSON.parse(savedAssessments).length > 0;
    } catch (error) {
      console.error('Error checking assessment data:', error);
      return false;
    }
  })();
  
  if (!hasAssessmentData) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-6">
        <div className="text-center space-y-4 max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-4">
            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.312 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">ยังไม่ได้ประเมินความเสี่ยง</h3>
            <p className="text-gray-600">
              กรุณาทำการประเมินความเสี่ยงก่อนดูผลการประเมิน
            </p>
          </div>
          <div className="pt-4 space-y-2">
            <Link
              href={`/audit-program-risk-evaluation/${id}/assess`}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 active:bg-blue-800"
            >
              ไปประเมินความเสี่ยง
            </Link>
            <div>
              <Link
                href={`/audit-program-risk-evaluation/${id}`}
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                กลับไปเลือกปัจจัยเสี่ยง
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <RiskAssessmentResultView detail={detail} />
  );
}