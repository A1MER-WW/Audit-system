"use client";

import Link from "next/link";
import { ChevronLeft, Plus, MoreVertical, FileText } from "lucide-react";
import type { AuditProgramRiskEvaluation } from "@/hooks/useAuditProgramRiskEvaluation";

type Props = {
  detail: AuditProgramRiskEvaluation;
  onAddFactor?: () => void;
};

const statusClass = (s: string) =>
  s === "AUDITOR_ASSESSING" ? "text-blue-600" : "text-gray-600";

export default function DetailView({ detail, onAddFactor }: Props) {
  const deptText = detail.auditTopics.departments
    .map((d) => d.departmentName)
    .join(" / ");

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
          <h2 className="text-sm font-medium text-gray-800">เลือกปัจจัยเสี่ยง</h2>
          <button
            onClick={onAddFactor}
            className="inline-flex items-center gap-2 rounded-lg border border-blue-200 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-50"
          >
            <Plus className="h-4 w-4" />
            เพิ่มปัจจัยเสี่ยง
          </button>
        </div>

        <div className="p-3 space-y-3">
          {detail.AuditActivityRisks.map((a, idx) => (
            <div
              key={a.id}
              className="rounded-xl border border-gray-200 bg-white"
            >
              {/* header of a factor */}
              <div className="flex items-start justify-between p-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-800">
                    {idx + 1}. {a.processes}
                  </div>
                  <div className="text-xs text-gray-500">
                    ด้านความเสี่ยง: {a.risk_factors}
                  </div>
                  {a.object && (
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                      {a.object}
                    </p>
                  )}
                </div>

                <button
                  title="เมนู"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                >
                  <MoreVertical className="h-4 w-4" />
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
          ))}
        </div>
      </div>

      {/* (ตัวอย่าง) ปุ่มดาวน์โหลด/เอกสารมุมขวาล่าง */}
      <div className="fixed bottom-6 right-6 hidden md:block">
        <button
          title="เอกสาร"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50"
        >
          <FileText className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
