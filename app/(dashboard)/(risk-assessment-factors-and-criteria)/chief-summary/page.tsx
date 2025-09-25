"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import ChiefDashboardSummary from "@/components/chief-dashboard-summary";

export default function ChiefSummary() {
  const router = useRouter();
  const fiscalYears = useMemo(() => [2568, 2567, 2566, 2565], []);
  const [year, setYear] = useState<number>(2568);
  const [selectedSubTab, setSelectedSubTab] = useState<"likelihood" | "impact">("likelihood");

  return (
    <div className="w-full h-full bg-gray-50 text-gray-900 flex flex-col">
      <div className="w-full h-full px-6 py-4 flex flex-col">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-3 text-sm text-gray-500 mb-6">
          <button 
            onClick={() => router.back()}
            className="hover:underline"
          >
            กลับ
          </button>
          <span>›</span>
          <span className="text-gray-700">กำหนดปัจจัยเสี่ยงและเกณฑ์การจัดความเสี่ยง</span>
        </div>

        {/* Year Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ปีงบประมาณ
          </label>
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

        {/* Status Info */}
        <div className="mb-4 text-sm text-gray-600">
          ขั้นตอนการประเมินความเสี่ยงปัจจัยด้วยเกณฑ์ความเสี่ยง ของหน่วยงานในสังกัด ปีงบประมาณ 2568
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <ChiefDashboardSummary 
            year={year} 
            selectedTab={selectedSubTab} 
            onTabChange={setSelectedSubTab}
          />
        </div>
      </div>
    </div>
  );
}