// components/DetailView.tsx
"use client";

import Link from "next/link";
import { ChevronLeft, Plus, X, FileText } from "lucide-react";
import * as React from "react";
import type { AuditProgramRiskEvaluation } from "@/hooks/useAuditProgramRiskEvaluation";
import {
  RiskFactorPickerDialog,
  RiskFactorPickerValues,
} from "./popup/RiskFactorPickerModal";

type Props = {
  detail: AuditProgramRiskEvaluation;
  /** จะถูกเรียกตอนกดยืนยันใน Dialog ส่งค่าที่ผู้ใช้เลือกกลับไปให้ parent */
  onAddFactor?: (values: RiskFactorPickerValues) => void;
  /** จะถูกเรียกเมื่อต้องการลบปัจจัยเสี่ยง */
  onDeleteFactor?: (riskId: number) => void;
  /** จะถูกเรียกเมื่อกดปุ่มบันทึก */
  onSave?: () => void;
};

const statusClass = (s: string) =>
  s === "AUDITOR_ASSESSING" ? "text-blue-600" : "text-gray-600";

export default function DetailView({ detail, onAddFactor, onDeleteFactor, onSave }: Props) {
  const deptText = detail.auditTopics.departments
    .map((d) => d.departmentName)
    .join(" / ");

  // --- state สำหรับเปิด Dialog + ค่าในฟอร์ม ---
  const [openAdd, setOpenAdd] = React.useState(false);
  const [values, setValues] = React.useState<RiskFactorPickerValues>({
    process: "",
    dimension: "",
    riskFactor: "",
  });

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

  // คลิก "เพิ่มปัจจัยเสี่ยง"
  const handleOpenAdd = () => {
    setValues({ process: "", dimension: "", riskFactor: "" });
    setOpenAdd(true);
  };

  // คลิก "เลือกปัจจัยเสี่ยง" ใน Dialog (คุณจะเปลี่ยนเป็นตัวเลือกจริง/command dialog ก็ได้)
  const handlePickRiskFactor = () => {
    const preset =
      "(1) แผนยุทธศาสตร์ ... ในระดับปฏิบัติการอย่างครอบคลุมในทุกภารกิจ\n\n" +
      "(2) การกำหนดแผน/ประเด็น ... รวมถึงการติดตามความไม่สอดคล้อง ...";
    setValues((v) => ({ ...v, riskFactor: preset }));
  };

  // กดยืนยันใน Dialog
  const handleConfirmAdd = () => {
    onAddFactor?.(values); // ส่งให้ parent ถ้ามี
    setOpenAdd(false);
  };

  return (
    <div className="px-6 py-4">
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
                  {detail.status === "AUDITOR_ASSESSING"
                    ? "ผู้ตรวจสอบภายในกำลังดำเนินการประเมินความเสี่ยง"
                    : "ผู้ตรวจสอบภายในยังไม่ได้ดำเนินการประเมินความเสี่ยง"}
                </span>
              </div>
            </div>

            <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 active:bg-blue-800">
              แบบบันทึกค่าความเสี่ยง
            </button>
          </div>
        </div>

        {/* steps tabs */}
        <div className="border-t border-gray-100">
          <div className="flex items-center gap-3 px-5 py-3">
            {[
              { n: 1, t: "เลือกปัจจัยเสี่ยง" },
              { n: 2, t: "ประเมินความเสี่ยง" },
              { n: 3, t: "ผลการประเมิน" },
            ].map((s) => (
              <div key={s.n} className="flex items-center gap-2">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                    s.n === 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {s.n}
                </div>
                <div
                  className={`text-sm ${
                    s.n === 1 ? "text-blue-700" : "text-gray-600"
                  }`}
                >
                  {s.t}
                </div>
              </div>
            ))}
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
              <p className="text-sm mt-1">กดปุ่ม "เพิ่มปัจจัยเสี่ยง" เพื่อเริ่มต้น</p>
            </div>
          ) : (
            detail.AuditActivityRisks.map((a, idx) => (
              <div
                key={a.id}
                className="rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                {/* header of a factor */}
                <div className="flex items-start justify-between p-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-start gap-3">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-800">
                        {idx + 1}
                      </span>
                      <div className="flex-1 space-y-2">
                        <div className="text-sm font-medium text-gray-800">
                          {processOptions.find(p => p.value === a.processes)?.label || a.processes}
                        </div>
                        <div className="inline-block px-2 py-1 text-xs bg-gray-100 rounded-md text-gray-600">
                          {dimensionOptions.find(d => d.value === a.risk_factors)?.label || a.risk_factors}
                        </div>
                        {a.object && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500 mb-1">ปัจจัยเสี่ยงที่เลือก:</p>
                            <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                              {a.object}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteFactor?.(a.id)}
                    title="ลบปัจจัยเสี่ยง"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-red-200 bg-white text-red-600 hover:bg-red-50 ml-3"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* assessments summary (ย่อ ๆ) */}
                {a.risks_assessment?.length ? (
                  <div className="border-t border-gray-100 p-3">
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      {a.risks_assessment.map((r) => (
                        <div
                          key={r.id}
                          className="rounded-lg border border-gray-100 p-3"
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
              </div>
            ))
          )}
        </div>
      </div>

      {/* Save button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => {
            onSave?.() || alert('บันทึกข้อมูลเรียบร้อยแล้ว');
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-green-700 active:bg-green-800"
        >
          บันทึก
        </button>
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
    </div>
  );
}
