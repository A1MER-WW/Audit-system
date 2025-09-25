"use client";

import React, { useMemo, useState } from "react";
import LikelihoodTable from "@/components/likelihoodtable";
import ManageRiskAssessmentsModal from "@/components/riskassessmentsmodal";
import ImpactTable, { ImpactRow } from "@/components/impacttable";
import type { LikelihoodLevel, ManageChoice } from "@/types/riskassessments";
import SubmitToInspectionModal from "@/components/submittoinspectionmodal";
import { useRouter } from "next/navigation";

export default function RiskAssessmentsPage() {
  const router = useRouter();
  const fiscalYears = useMemo(() => [2568, 2567, 2566, 2565], []);
  const [year, setYear] = useState<number>(2568);
  const [tab, setTab] = useState<"likelihood" | "impact">("likelihood");
  const [comparePrev, setComparePrev] = useState<boolean>(false);

  // modal
  const [showManageModal, setShowManageModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [wantManage, setWantManage] = useState<ManageChoice>("want");

  const factorColumns = [
    "ด้านกลยุทธ์",
    "ด้านการเงิน",
    "ด้านการดำเนินงาน",
    "ด้านการปฏิบัติตามกฎหมาย ระเบียบ",
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

  /** Likelihood - No Data */
  const mockLikelihoodData = {
    "ด้านกลยุทธ์": {
      "5": "ไม่มีข้อมูล",
      "4": "ไม่มีข้อมูล",
      "3": "ไม่มีข้อมูล",
      "2": "ไม่มีข้อมูล",
      "1": "ไม่มีข้อมูล",
    },
    "ด้านการเงิน": {
      "5": "ไม่มีข้อมูล",
      "4": "ไม่มีข้อมูล",
      "3": "ไม่มีข้อมูล",
      "2": "ไม่มีข้อมูล",
      "1": "ไม่มีข้อมูล",
    },
    "ด้านการดำเนินงาน": {
      "5": "ไม่มีข้อมูล",
      "4": "ไม่มีข้อมูล",
      "3": "ไม่มีข้อมูล",
      "2": "ไม่มีข้อมูล",
      "1": "ไม่มีข้อมูล",
    },
    "ด้านการปฏิบัติตามกฎหมาย ระเบียบ": {
      "5": "ไม่มีข้อมูล",
      "4": "ไม่มีข้อมูล",
      "3": "ไม่มีข้อมูล",
      "2": "ไม่มีข้อมูล",
      "1": "ไม่มีข้อมูล",
    },
    "ด้านเทคโนโลยีสารสนเทศ": {
      "5": "ไม่มีข้อมูล",
      "4": "ไม่มีข้อมูล",
      "3": "ไม่มีข้อมูล",
      "2": "ไม่มีข้อมูล",
      "1": "ไม่มีข้อมูล",
    },
    "ด้านการทุจริต": {
      "5": "ไม่มีข้อมูล",
      "4": "ไม่มีข้อมูล",
      "3": "ไม่มีข้อมูล",
      "2": "ไม่มีข้อมูล",
      "1": "ไม่มีข้อมูล",
    },
  };

  /** ---------- Impact - No Data ---------- */
  type ImpactSection = Record<string, ImpactRow[]>;
  const mockImpactData: ImpactSection = {
    "ด้านกลยุทธ์": [
      {
        id: 1,
        factor: "ไม่มีข้อมูล",
        category: "ไม่มีข้อมูล",
        levels: {
          น้อยที่สุด: "ไม่มีข้อมูล",
          น้อย: "ไม่มีข้อมูล",
          ปานกลาง: "ไม่มีข้อมูล",
          มาก: "ไม่มีข้อมูล",
          มากที่สุด: "ไม่มีข้อมูล",
        },
      },
    ],

    "ด้านการเงิน": [
      {
        id: 1,
        factor: "ไม่มีข้อมูล",
        category: "ไม่มีข้อมูล",
        levels: {
          น้อยที่สุด: "ไม่มีข้อมูล",
          น้อย: "ไม่มีข้อมูล",
          ปานกลาง: "ไม่มีข้อมูล",
          มาก: "ไม่มีข้อมูล",
          มากที่สุด: "ไม่มีข้อมูล",
        },
      },
    ],

    "ด้านการดำเนินงาน": [
      {
        id: 1,
        factor: "ไม่มีข้อมูล",
        category: "ไม่มีข้อมูล",
        levels: {
          น้อยที่สุด: "ไม่มีข้อมูล",
          น้อย: "ไม่มีข้อมูล",
          ปานกลาง: "ไม่มีข้อมูล",
          มาก: "ไม่มีข้อมูล",
          มากที่สุด: "ไม่มีข้อมูล",
        },
      },
    ],

    "ด้านการปฏิบัติตามกฏหมาย/ระเบียบ": [
      {
        id: 1,
        factor: "ไม่มีข้อมูล",
        category: "ไม่มีข้อมูล",
        levels: {
          น้อยที่สุด: "ไม่มีข้อมูล",
          น้อย: "ไม่มีข้อมูล",
          ปานกลาง: "ไม่มีข้อมูล",
          มาก: "ไม่มีข้อมูล",
          มากที่สุด: "ไม่มีข้อมูล",
        },
      },
    ],

    "ด้านเทคโนโลยีสารสนเทศ": [
      {
        id: 1,
        factor: "ไม่มีข้อมูล",
        category: "ไม่มีข้อมูล",
        levels: {
          น้อยที่สุด: "ไม่มีข้อมูล",
          น้อย: "ไม่มีข้อมูล",
          ปานกลาง: "ไม่มีข้อมูล",
          มาก: "ไม่มีข้อมูล",
          มากที่สุด: "ไม่มีข้อมูล",
        },
      },
    ],

    "ด้านการเกิดทุจริต": [
      {
        id: 1,
        factor: "ไม่มีข้อมูล",
        category: "ไม่มีข้อมูล",
        levels: {
          น้อยที่สุด: "ไม่มีข้อมูล",
          น้อย: "ไม่มีข้อมูล",
          ปานกลาง: "ไม่มีข้อมูล",
          มาก: "ไม่มีข้อมูล",
          มากที่สุด: "ไม่มีข้อมูล",
        },
      },
    ],
  };

  return (
    <div className="w-full h-full bg-gray-50 text-gray-900 flex flex-col">
      <div className="w-full h-full px-6 py-4 flex flex-col">
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

        </div>

        {/* Information Card - Overview */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  ปัจจัยและเกณฑ์พิจารณาความเสี่ยง สำหรับใช้ในการประเมินและจัดลำดับความเสี่ยงแผนการตรวจสอบประจำปี {year}
                </h3>
                <div className="flex gap-3">
                  <button   
                    onClick={() => setShowSubmitModal(true)}
                    className="rounded-xl bg-indigo-600 px-4 py-2 text-white shadow hover:bg-indigo-700 text-sm">
                    เสนอหัวหน้าหน่วยตรวจสอบ
                  </button>
                  <button
                    onClick={() => setShowManageModal(true)}
                    className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-indigo-700 hover:bg-indigo-100 text-sm"
                  >
                    จัดการปัจจัยและเกณฑ์พิจารณาความเสี่ยง
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                ปัจจัยและเกณฑ์พิจารณาความเสี่ยง
              </p>
              <div className="mt-3 inline-flex items-center text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                <span>สถานะ: ผู้ตรวจสอบภายในกำหนดปัจจัยและเกณฑ์พิจารณาความเสี่ยง</span>
              </div>
            </div>
          </div>
        </div>

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
            {tab === "impact" && (
              <>
                <button className="rounded-lg border px-3 py-1.5 text-gray-700 hover:bg-gray-100">กรอง</button>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {tab === "likelihood" ? (
            <LikelihoodTable
              columns={factorColumns}
              levels={likelihoodLevels}
              data={mockLikelihoodData}
              comparePrev={comparePrev}
              prevData={comparePrev ? mockLikelihoodData : undefined}
            />
          ) : (
            <div className="mt-4 space-y-8">
              {Object.entries(mockImpactData).map(([title, rows]) => (
                <ImpactTable key={title} title={title} rows={rows} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <ManageRiskAssessmentsModal
        open={showManageModal}
        value={wantManage}
        onChange={setWantManage}
        onClose={() => setShowManageModal(false)}
        onConfirm={() => setShowManageModal(false)}
      />
    </div>
  );
}

