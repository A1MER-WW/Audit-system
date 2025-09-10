"use client";

import React, { useMemo, useState } from "react";
import LikelihoodTable from "@/components/likelihoodtable";
import ImpactCategoryCard from "@/components/impactcategorycard";
import ManageRiskAssessmentsModal from "@/components/manageriskassessmentsmodal";
import type { LikelihoodLevel, ManageChoice } from "@/types/riskassessments";

export default function RiskAssessmentsPage() {
  const fiscalYears = useMemo(() => [2568, 2567, 2566, 2565], []);
  const [year, setYear] = useState<number>(2568);
  const [tab, setTab] = useState<"likelihood" | "impact">("likelihood");
  const [comparePrev, setComparePrev] = useState<boolean>(false);

  // modal
  const [showManageModal, setShowManageModal] = useState(false);
  const [wantManage, setWantManage] = useState<ManageChoice>("want");

  const factorColumns = [
    "ด้านกลยุทธ์",
    "ด้านการเงิน",
    "ด้านการดำเนินงาน",
    "ด้านการปฏิบัติตามกฎหมาย\nระเบียบ",
    "ด้านเทคโนโลยีสารสนเทศ",
    "ด้านการทุจริต",
  ];

  const likelihoodLevels: LikelihoodLevel[] = [
    { level: 5, label: "สูงมาก" },
    { level: 4, label: "สูง" },
    { level: 3, label: "ปานกลาง" },
    { level: 2, label: "น้อย" },
    { level: 1, label: "น้อยมาก" },
  ];

  const impactCategories = [
    "ด้านกลยุทธ์",
    "ด้านการเงิน",
    "ด้านการดำเนินงาน",
    "ด้านการปฏิบัติตามกฎหมาย ระเบียบ",
    "ด้านเทคโนโลยีสารสนเทศ",
    "ด้านการทุจริต",
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <button className="hover:underline">กลับ</button>
          <span>›</span>
          <span className="text-gray-700">กำหนดปัจจัยเสี่ยงและเกณฑ์การจัดความเสี่ยง</span>
        </div>

        {/* Top controls */}
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-5">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">ปีงบประมาณ</label>
            <div className="relative w-56">
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-2.5 pr-10 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              >
                {fiscalYears.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 011.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" />
              </svg>
            </div>
          </div>

          <div className="md:col-span-3 flex items-end justify-end gap-3">
            <button className="rounded-xl bg-indigo-600 px-4 py-2 text-white shadow hover:bg-indigo-700">
              เสนอหัวหน้าหน่วยตรวจสอบ
            </button>
            <button
              onClick={() => setShowManageModal(true)}
              className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-indigo-700 hover:bg-indigo-100"
            >
              จัดการปัจจัยและเกณฑ์พิจารณาความเสี่ยง
            </button>
          </div>
        </div>

        <p className="mt-3 text-sm text-gray-600">
          สถานะ: <span className="text-indigo-700">ผู้ตรวจสอบทบทวนปัจจัยและเกณฑ์การจัดความเสี่ยง</span>
        </p>

        {/* Tabs + compare */}
        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="inline-flex rounded-xl bg-gray-100 p-1">
            <button
              onClick={() => setTab("likelihood")}
              className={`px-4 py-2 text-sm rounded-lg transition ${tab === "likelihood" ? "bg-white shadow text-indigo-700" : "text-gray-600 hover:text-gray-800"}`}
            >
              โอกาส (Likelihood)
            </button>
            <button
              onClick={() => setTab("impact")}
              className={`px-4 py-2 text-sm rounded-lg transition ${tab === "impact" ? "bg-white shadow text-indigo-700" : "text-gray-600 hover:text-gray-800"}`}
            >
              ผลกระทบ (Impact)
            </button>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">เปรียบเทียบกับปีงบประมาณก่อนหน้า</span>
            <label className="inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={comparePrev}
                onChange={(e) => setComparePrev(e.target.checked)}
              />
              <span className="h-5 w-10 rounded-full bg-gray-300 transition-all peer-checked:bg-indigo-600 relative after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-5" />
            </label>
            <button className="rounded-lg border px-3 py-1.5 text-gray-700 hover:bg-gray-100">กรอง</button>
          </div>
        </div>

        {/* Content */}
        {tab === "likelihood" ? (
          <LikelihoodTable columns={factorColumns} levels={likelihoodLevels} />
        ) : (
          <section className="mt-4 space-y-4">
            {impactCategories.map((cat) => (
              <ImpactCategoryCard key={cat} category={cat} />
            ))}
          </section>
        )}

        <div className="mt-6 text-xs text-gray-500">
          รอทำการต่อ API แล้วเติมข้อมูลจริงในตารางได้ทันทีครับ:)
        </div>
      </div>

      {/* Modal */}
      <ManageRiskAssessmentsModal
        open={showManageModal}
        value={wantManage}
        onChange={setWantManage}
        onClose={() => setShowManageModal(false)}
        onConfirm={() => {
          // TODO: call API depending on wantManage
          setShowManageModal(false);
        }}
      />
    </div>
  );
}
