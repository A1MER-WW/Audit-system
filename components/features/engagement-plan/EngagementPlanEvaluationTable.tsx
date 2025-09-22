"use client";

import Link from "next/link";
import { FileText, Plus, ChevronLeft, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { EngagementPlanProgram } from "@/lib/mock-engagement-plan-programs";

type Props = {
  fiscalYear: number;
  yearOptions: number[];
  rows: EngagementPlanProgram[];
  isLoading: boolean;
  onFiscalYearChange: (year: number) => void;
  onCreate: () => void;
  onDelete: (id: number) => void;
};

// รองรับ basePath (ถ้ามี)
const RAW_BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const BASE = RAW_BASE.endsWith("/") ? RAW_BASE.slice(0, -1) : RAW_BASE;
const href = (p: string) => `${BASE}${p}`;

export default function EngagementPlanEvaluationTable({
  fiscalYear,
  yearOptions,
  rows,
  isLoading,
  onFiscalYearChange,
  onCreate,
}: Props) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigatingId, setNavigatingId] = useState<number | null>(null);
  const statusLabel = (status: string) => {
    switch (status) {
      case "AUDITOR_ASSESSING":
        return "ผู้ตรวจสอบภายในกำลังดำเนินการประเมินความเสี่ยง";
      case "PENDING":
        return "ผู้ตรวจสอบภายในยังไม่ได้ดำเนินการประเมินความเสี่ยง";
      case "COMPLETED":
        return "เสร็จสิ้นการประเมินความเสี่ยงแล้ว";
      case "SUBMITTED":
        return "ส่งผลการประเมินแล้ว - รอการอนุมัติ";
      case "APPROVED":
        return "ได้รับการอนุมัติแล้ว";
      default:
        return status;
    }
  };

  const statusClass = (status: string) => {
    switch (status) {
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

  // จัดการการนำทางไปหน้ารายละเอียด
  const handleNavigateToDetail = async (id: number) => {
    setIsNavigating(true);
    setNavigatingId(id);
    try {
      // เพิ่ม delay เล็กน้อยเพื่อให้เห็น loading
      await new Promise((resolve) => setTimeout(resolve, 500));
      await router.push(href(`/audit-engagement-plan/${id}/step-1-activity-risk`));
    } catch (error) {
      console.error("Navigation error:", error);
      setIsNavigating(false);
      setNavigatingId(null);
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
            <p className="text-xs text-gray-500">
              กำลังเปิดรายละเอียดการประเมิน...
            </p>
          </div>
        </div>
      )}

      {/* breadcrumb / back */}
      <div className="mb-3">
        <Link
          href="#"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="h-4 w-4" />
          กลับ
        </Link>
      </div>

      {/* title + subtitle */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">
          วางแผนงานตรวจสอบภายใน
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          ประเมินความเสี่ยงและการจัดทำแผนการจัดการความเสี่ยง
        </p>
      </div>

      {/* toolbar */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label
            htmlFor="fy"
            className="text-[20px] font-semibold text-gray-700 whitespace-nowrap"
          >
            ปีงบประมาณ
          </label>
          <div className="relative">
            <select
              id="fy"
              value={fiscalYear}
              onChange={(e) => onFiscalYearChange(Number(e.target.value))}
              className="peer w-40 appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm leading-5 text-gray-900 outline-none ring-0 transition focus:border-gray-400"
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              ▾
            </span>
          </div>
        </div>
      </div>

      {/* toolbar */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label
            htmlFor="fy"
            className="text-[20px] font-semibold text-gray-700 whitespace-nowrap"
          >
            แผนการปฏิบัติงานตรวจสอบ (Audit Program)
          </label>
        </div>

        <button
          onClick={onCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 active:bg-blue-800"
        >
          <Plus className="h-4 w-4" />
          เพิ่มแผนการปฏิบัติการตรวจสอบ
        </button>
      </div>

      {/* card/table */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-auto">
          <table className="min-w-[960px] w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-600">
                <th className="w-20 px-4 py-3 text-left">ลำดับ</th>
                <th className="w-56 px-4 py-3 text-left">
                  โครงการ/งานที่เข้าตรวจสอบ
                </th>
                <th className="w-72 px-4 py-3 text-left">หน่วยงาน</th>
                <th className="w-80 px-4 py-3 text-left">สถานะ</th>
                <th className="w-16 px-4 py-3 text-right">เอกสาร</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    className="px-4 py-6 text-center text-gray-500"
                    colSpan={5}
                  >
                    กำลังโหลด...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td
                    className="px-4 py-6 text-center text-gray-500"
                    colSpan={5}
                  >
                    ไม่พบข้อมูล
                  </td>
                </tr>
              ) : (
                rows.map((r, idx) => (
                  <tr key={r.id} className="border-t">
                    <td className="px-4 py-3">{idx + 1}</td>

                    <td className="px-4 py-3 w-56">
                      <p
                        className="line-clamp-2 text-gray-900"
                        title={r.auditTopics.auditTopic}
                      >
                        {r.auditTopics.auditTopic}
                      </p>
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      {r.auditTopics.departments
                        .map((d) => d.departmentName)
                        .join(" / ")}
                    </td>

                    <td className="px-4 py-3">
                      <span className={statusClass(r.status)}>
                        {statusLabel(r.status)}
                      </span>
                    </td>

                    <td className="px-4 py-2">
                      <div className="flex items-center justify-end gap-2">
                        {/* 🔗 ไปหน้า Detail ของแต่ละรายการ */}
                        <button
                          onClick={() => handleNavigateToDetail(r.id)}
                          disabled={isNavigating}
                          aria-label="เปิดรายละเอียดการประเมิน"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          {isNavigating && navigatingId === r.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <FileText className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
