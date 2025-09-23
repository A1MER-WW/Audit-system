// components/DetailView.tsx
"use client";

import Link from "next/link";
import {
  ChevronLeft,
  Plus,
  FileText,
  ChevronDown,
  ChevronRight,
  Trash2,
  Loader2,
} from "lucide-react";
import * as React from "react";
import type { AuditProgramRiskEvaluation } from "@/hooks/useAuditProgramRiskEvaluation";
import {
  RiskFactorPickerDialog,
  RiskFactorPickerValues,
} from "./popup/RiskFactorPickerModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Props = {
  detail: AuditProgramRiskEvaluation;
  /** จะถูกเรียกตอนกดยืนยันใน Dialog ส่งค่าที่ผู้ใช้เลือกกลับไปให้ parent */
  onAddFactor?: (values: RiskFactorPickerValues) => void;
  /** จะถูกเรียกเมื่อต้องการลบปัจจัยเสี่ยง */
  onDeleteFactor?: (riskId: number) => void;
  /** จะถูกเรียกเมื่อกดปุ่มบันทึก */
  onSave?: () => void;
};

const statusClass = (s: string) => {
  switch (s) {
    case "AUDITOR_ASSESSING":
      return "text-blue-600";
    case "COMPLETED":
      return "text-green-600";
    case "SUBMITTED":
      return "text-orange-600";
    case "APPROVED":
      return "text-emerald-600";
    case "PENDING":
    default:
      return "text-gray-600";
  }
};

export default function DetailView({
  detail,
  onAddFactor,
  onDeleteFactor,
  onSave,
}: Props) {
  const router = useRouter();
  const deptText = detail.auditTopics.departments
    .map((d) => d.departmentName)
    .join(" / ");

  // --- state สำหรับเปิด Dialog + ค่าในฟอร์ม ---
  const [openAdd, setOpenAdd] = React.useState(false);
  const [values, setValues] = React.useState<RiskFactorPickerValues>({
    process: "",
    dimension: [],
    riskFactor: "",
  });

  // --- state สำหรับ loading ---
  const [isNavigating, setIsNavigating] = React.useState(false);

  // --- state สำหรับ expand/collapse รายการปัจจัยเสี่ยง ---
  const [expandedItems, setExpandedItems] = React.useState<Set<number>>(
    new Set()
  );

  // เมื่อข้อมูลเปลี่ยนแปลง ให้ expand ทุกรายการโดยอัตโนมัติ
  React.useEffect(() => {
    if (detail.AuditActivityRisks.length > 0) {
      setExpandedItems(new Set(detail.AuditActivityRisks.map(risk => risk.id)));
    }
  }, [detail.AuditActivityRisks]);

  // --- state สำหรับ confirmation dialog ---
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [deleteTargetId, setDeleteTargetId] = React.useState<number | null>(null);
  const [deleteTargetName, setDeleteTargetName] = React.useState<string>("ปัจจัยเสี่ยง");

  const toggleExpanded = (itemId: number) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // รายการตัวเลือก (เอาตามที่หน้าคุณใช้จริงได้เลย)
  const processOptions = [
    // หมวดหลัก (ตามหัวข้อในภาพ)
    {
      label: "การติดตามและประเมินผลการดำเนินงานโครงการ",
      value: "followup-evaluation",
    },

    // รายการย่อยตามภาพ
    { label: "การจัดทำข้อเสนอโครงการ", value: "project-proposal" },
    {
      label: "การจัดทำคำขอตั้งงบประมาณ",
      value: "budget-appropriation-request",
    },
    {
      label: "การจัดทำแผนการปฏิบัติงานและแผนการใช้จ่ายงบประมาณ",
      value: "workplan-spending-plan",
    },
    {
      label: "การจัดสรรงบประมาณ/การโอนเปลี่ยนแปลงงบประมาณ",
      value: "budget-allocation-transfer-adjustment",
    },
    {
      label: "การดำเนินการตามข้อเสนอโครงการที่ได้รับการอนุมัติ",
      value: "execute-approved-project-proposal",
    },
    {
      label: "การรายงานผลการดำเนินงานและการรายงานผลสัมฤทธิ์ของโครงการ",
      value: "performance-and-outcome-reporting",
    },
  ];

  const dimensionOptions = [
    { label: "ด้านกลยุทธ์", value: "strategy" },
    { label: "ด้านการเงิน", value: "finance" },
    { label: "ด้านการดำเนินงาน", value: "operations" },
    { label: "ด้านเทคโนโลยีสารสนเทศ", value: "informationtechnology" },
    { label: "ด้านการปฏิบัติตามกฎระเบียบ", value: "regulatorycompliance" },
    { label: "ด้านการเกิดทุจริต", value: "fraudrisk" },
  ];

  const handleOpenAdd = () => {
    setValues({ process: "", dimension: [], riskFactor: "" });
    setOpenAdd(true);
  };

  // const handlePickRiskFactor = () => {
  //   const preset =
  //     "(1) แผนยุทธศาสตร์ ... ในระดับปฏิบัติการอย่างครอบคลุมในทุกภารกิจ\n\n" +
  //     "(2) การกำหนดแผน/ประเด็น ... รวมถึงการติดตามความไม่สอดคล้อง ...";
  //   setValues((v) => ({ ...v, riskFactor: preset }));
  // };

  // กดยืนยันใน Dialog
  const handleConfirmAdd = () => {
    onAddFactor?.(values); // ส่งให้ parent ถ้ามี
    setOpenAdd(false);
  };

  // เปิด confirmation dialog สำหรับลบ
  const handleDeleteClick = (riskId: number, processName: string) => {
    setDeleteTargetId(riskId);
    setDeleteTargetName(processName);
    setDeleteConfirmOpen(true);
  };

  // ยืนยันการลบ
  const handleConfirmDelete = () => {
    if (deleteTargetId !== null) {
      onDeleteFactor?.(deleteTargetId);
    }
    setDeleteConfirmOpen(false);
    setDeleteTargetId(null);
    setDeleteTargetName("ปัจจัยเสี่ยง");
  };

  // ยกเลิกการลบ
  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
    setDeleteTargetId(null);
    setDeleteTargetName("ปัจจัยเสี่ยง");
  };

  // จัดการการนำทางไปหน้าประเมินความเสี่ยง
  const handleNavigateToAssess = async () => {
    setIsNavigating(true);
    try {
      // เพิ่ม delay เล็กน้อยเพื่อให้เห็น loading
      await new Promise(resolve => setTimeout(resolve, 500));
      await router.push(`/audit-program-risk-evaluation/${detail.id}/assess`);
    } catch (error) {
      console.error('Navigation error:', error);
      setIsNavigating(false);
    }
  };

  return (
    <div className="px-6 py-4 relative">
      {/* Loading Overlay */}
      {isNavigating && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-xl border border-gray-200 min-w-[200px] text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-blue-600" />
            <p className="text-sm font-medium text-gray-900 mb-1">กำลังโหลด</p>
            <p className="text-xs text-gray-500">กำลังเตรียมหน้าประเมินความเสี่ยง...</p>
          </div>
        </div>
      )}

      {/* breadcrumb */}
      <div className="mb-3">
        <Link
          href="/audit-program-risk-evaluation"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="h-4 w-4" />
          กลับ
        </Link>
      </div>

      {/* Header card */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h1 className="text-lg font-semibold text-gray-900 leading-snug">
                {detail.auditTopics.auditTopic}
              </h1>
              <div className="text-sm text-gray-600">
                หน่วยงาน: <span className="text-gray-800">{deptText}</span>
              </div>
              <div className="text-sm">
                สถานะ:{" "}
                <span className={statusClass(detail.status)}>
                  {(() => {
                    switch (detail.status) {
                      case "AUDITOR_ASSESSING":
                        return "ผู้ตรวจสอบภายในกำลังดำเนินการประเมินความเสี่ยง";
                      case "COMPLETED":
                        return "เสร็จสิ้นการประเมินความเสี่ยงแล้ว";
                      case "SUBMITTED":
                        return "ส่งผลการประเมินแล้ว - รอการอนุมัติ";
                      case "APPROVED":
                        return "ได้รับการอนุมัติแล้ว";
                      case "PENDING":
                      default:
                        return "ผู้ตรวจสอบภายในยังไม่ได้ดำเนินการประเมินความเสี่ยง";
                    }
                  })()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* steps tabs */}
        <div className="border-t border-gray-100">
          <div className="flex items-center px-5 py-3">
            {[
              { n: 1, t: "เลือกปัจจัยเสี่ยง" },
              { n: 2, t: "ประเมินความเสี่ยง" },
              { n: 3, t: "ผลการประเมิน" },
            ].map((s, i) => {
              const currentStep = 1; // ขั้นตอนที่ active ตอนนี้
              const active = s.n === currentStep;

              return (
                <React.Fragment key={s.n}>
                  {/* เส้นคั่นระหว่างสเต็ป */}
                  {i > 0 && <span className="mx-3 h-px flex-1 bg-gray-200" />}

                  <div className="flex items-center gap-2">
                    {/* วงกลมตัวเลข */}
                    <div
                      className={[
                        "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                        active
                          ? "bg-[#3E52B9] text-white"
                          : "bg-gray-200 text-gray-700",
                      ].join(" ")}
                    >
                      {s.n}
                    </div>

                    {/* ข้อความ */}
                    <span
                      className={`text-sm ${
                        active ? "text-[#3E52B9]" : "text-gray-700"
                      }`}
                    >
                      {s.t}
                    </span>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* factors list */}
      <div className="mt-4 rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <h2 className="text-sm font-medium text-gray-800">
            เลือกปัจจัยเสี่ยง
          </h2>
          <button
            onClick={handleOpenAdd} // <-- เปิด Dialog ที่นี่
            className="inline-flex items-center gap-2 rounded-lg border border-blue-200 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-50"
          >
            <Plus className="h-4 w-4" />
            เพิ่มปัจจัยเสี่ยง
          </button>
        </div>

        <div className="p-3 space-y-3">
          {detail.AuditActivityRisks.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <p>ยังไม่มีปัจจัยเสี่ยง</p>
              <p className="text-sm mt-1">
                กดปุ่ม &quot;เพิ่มปัจจัยเสี่ยง&quot; เพื่อเริ่มต้น
              </p>
            </div>
          ) : (
            detail.AuditActivityRisks.map((a, idx) => {
              const isExpanded = expandedItems.has(a.id);
              return (
                <div
                  key={a.id}
                  className="rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-200"
                >
                  {/* header of a factor - collapsible */}
                  <div className="p-4">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-800">
                        {idx + 1}
                      </span>
                      <button
                        onClick={() => toggleExpanded(a.id)}
                        className="flex items-center gap-2 text-left flex-1 hover:text-blue-600 transition-colors group"
                      >
                        <div className="text-sm font-medium text-gray-800">
                          {processOptions.find((p) => p.value === a.processes)
                            ?.label || a.processes}
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-gray-500 group-hover:text-blue-600 transition-colors" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-500 group-hover:text-blue-600 transition-colors" />
                        )}
                      </button>
                    </div>

                    {/* expandable content */}
                    {isExpanded && (
                      <div className="mt-4 pl-9 space-y-3 animate-in slide-in-from-top-1 duration-200">
                        <div className="space-y-2">
                          <div className="text-xs text-gray-500 font-medium">
                            ด้าน:
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {/* แสดงหลายด้านในรูปแบบ tags - แยกจาก comma */}
                            {(a.risk_factors
                              ? a.risk_factors.split(",").map((f) => f.trim())
                              : []
                            ).map((factor, idx) => (
                              <div
                                key={idx}
                                className="inline-block px-3 py-1.5 text-xs bg-blue-50 border border-blue-100 rounded-lg text-blue-700 font-medium"
                              >
                                {dimensionOptions.find(
                                  (d) => d.value === factor
                                )?.label || factor}
                              </div>
                            ))}
                          </div>
                        </div>

                        {a.object && (
                          <div className="space-y-2">
                            <div className="text-xs text-gray-500 font-medium">
                              ปัจจัยเสี่ยง:
                            </div>
                            {(() => {
                              // ตรวจสอบว่าข้อมูลมี marker หรือไม่
                              if (
                                a.object.includes("[") &&
                                a.object.includes("]")
                              ) {
                                // ข้อมูลรูปแบบใหม่ที่แยกตามด้าน - ใช้ regex เหมือน RiskAssessmentView
                                const dimensionRegex = /\[([^\]]+)\]\s*([\s\S]*?)(?=\[|$)/g;
                                const sections: Array<{dimLabel: string, content: string}> = [];
                                let match;
                                while ((match = dimensionRegex.exec(a.object)) !== null) {
                                  sections.push({
                                    dimLabel: match[1],
                                    content: match[2].trim()
                                  });
                                }
                                return (
                                  <div className="space-y-3">
                                    {sections.map((section, idx) => (
                                      <div
                                        key={idx}
                                        className="border border-gray-200 rounded-lg overflow-hidden"
                                      >
                                        <div className="px-3 py-2 bg-blue-50 border-b border-gray-200">
                                          <div className="text-xs font-medium text-blue-700">
                                            {section.dimLabel}
                                          </div>
                                        </div>
                                        <div className="p-3 bg-white">
                                          <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                                            {section.content}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                );
                              } else {
                                // ข้อมูลรูปแบบเก่า
                                return (
                                  <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg">
                                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                                      {a.object}
                                    </p>
                                  </div>
                                );
                              }
                            })()}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {/* assessments summary (ย่อ ๆ) - show when expanded */}
                  {isExpanded && a.risks_assessment?.length ? (
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <div className="text-xs text-gray-500 font-medium mb-2">
                        ผลการประเมิน:
                      </div>
                      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        {a.risks_assessment.map((r) => (
                          <div
                            key={r.id}
                            className="rounded-lg border border-gray-100 p-3 bg-white"
                          >
                            <div className="text-sm font-medium text-gray-800">
                              ปัจจัย: {r.risk_factor}
                            </div>
                            <div className="mt-1 text-xs text-gray-600">
                              ความน่าจะเป็น: {r.likelihood_score} | ผลกระทบ:{" "}
                              {r.impact_score} | รวม: {r.total_score}
                            </div>
                            <div className="mt-1 text-xs">
                              ระดับความเสี่ยง:{" "}
                              <span className="font-medium text-gray-800">
                                {r.risk_level.grade}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {/* Delete button - show at bottom when expanded */}
                  {isExpanded && (
                    <div className="mt-4 px-4 pt-3 pb-4 border-t border-gray-100 flex justify-end">
                      <button
                        onClick={() => handleDeleteClick(
                          a.id, 
                          processOptions.find((p) => p.value === a.processes)?.label || a.processes
                        )}
                        title="ลบปัจจัยเสี่ยง"
                        className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-6 space-y-4">
        {/* Status-based buttons row */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {/* ตรวจสอบว่ามีการประเมินแล้วหรือไม่ */}
            {detail.AuditActivityRisks.some(risk => 
              risk.risks_assessment && risk.risks_assessment.length > 0
            ) && (
              <Link
                href={`/audit-program-risk-evaluation/${detail.id}/results`}
                className="inline-flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 shadow hover:bg-green-100 active:bg-green-200"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                ดูผลการประเมิน
              </Link>
            )}

            {/* ปุ่มทำเครื่องหมายเสร็จสิ้น - แสดงเมื่อ status เป็น AUDITOR_ASSESSING และมีการประเมิน */}
            {detail.status === "AUDITOR_ASSESSING" && 
             detail.AuditActivityRisks.some(risk => 
               risk.risks_assessment && risk.risks_assessment.length > 0
             ) && onSave && (
              <Button
                onClick={onSave}
                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-green-700 active:bg-green-800"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                เสร็จสิ้นการประเมิน
              </Button>
            )}
          </div>

          <div>
            {detail.AuditActivityRisks.length > 0 && detail.status !== "COMPLETED" && detail.status !== "SUBMITTED" && detail.status !== "APPROVED" && (
              <Button
                onClick={handleNavigateToAssess}
                disabled={isNavigating}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isNavigating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    กำลังโหลด...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    ไปประเมินความเสี่ยง
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Status message */}
        {detail.status === "COMPLETED" && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            การประเมินความเสี่ยงเสร็จสิ้นแล้ว
          </div>
        )}
        
        {detail.status === "SUBMITTED" && (
          <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg text-orange-700 text-sm">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            ส่งผลการประเมินแล้ว - รอการอนุมัติ
          </div>
        )}

        {detail.status === "APPROVED" && (
          <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-1.382l.764.764a1 1 0 000 1.414l-.764.764M15 3l.764.764a1 1 0 000 1.414L15 6" />
            </svg>
            ได้รับการอนุมัติแล้ว
          </div>
        )}
      </div>

      {/* floating button */}
      <div className="fixed bottom-6 right-6 hidden md:block">
        <button
          title="เอกสาร"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50"
        >
          <FileText className="h-5 w-5" />
        </button>
      </div>

      {/* === Dialog: เพิ่มปัจจัยเสี่ยง === */}
      <RiskFactorPickerDialog
        open={openAdd}
        onOpenChange={setOpenAdd}
        values={values}
        onChange={(patch) => setValues((v) => ({ ...v, ...patch }))}
        onConfirm={handleConfirmAdd}
        processOptions={processOptions}
        dimensionOptions={dimensionOptions}
      />

      {/* === Confirmation Dialog: ลบปัจจัยเสี่ยง === */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              ยืนยันการลบปัจจัยเสี่ยง
            </DialogTitle>
            <DialogDescription className="text-left">
              คุณต้องการลบปัจจัยเสี่ยงของ{" "}
              <span className="font-medium text-gray-900">&ldquo;{deleteTargetName}&rdquo;</span>{" "}
              หรือไม่?
              <br />
              <br />
              <span className="text-red-600 font-medium">
                ⚠️ การดำเนินการนี้ไม่สามารถยกเลิกได้
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={handleCancelDelete}
              className="sm:mr-2"
            >
              ยกเลิก
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              ลบปัจจัยเสี่ยง
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
