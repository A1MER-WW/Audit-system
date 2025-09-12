// app/(your-segment)/risk-assessment/results/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronRight } from "lucide-react";
import DashboardSection from "@/components/features/chief-Inspector/risk-assessment/risk-assessment-dashboard-section";
import SummaryToolbar from "@/components/summary-toolbar";
import RiskAssessmentResultsSectionPage from "@/components/features/chief-Inspector/risk-assessment/risk-assessment-results-section";
import { ActiveFilters } from "@/components/features/chief-Inspector/risk-assessment/active-filters";

export type FilterType = {
  grade?: "E" | "H" | "M" | "L" | "N";
  category?: string;
};

type InspectorDataType = {
  timestamp: string;
  source: string;
  action?: string;
  itemCount?: number;
  hasReorderInfo?: boolean;
  reorderInfo?: {
    originalOrder?: string[];
    newOrder?: string[];
    changedItem?: string;
    reason?: string;
    hasChanges?: boolean;
  };
  rawData?: any;
  error?: string;
};

export default function RiskAssessmentPage() {
  const router = useRouter();
  const [outerTab, setOuterTab] = useState<
    "summary" | "reorder" | "unitRanking"
  >("summary");
  const [scoreSortDir, setScoreSortDir] = useState<"desc" | "asc">("desc");
  const [filter, setFilter] = useState<FilterType>({});

  // State สำหรับเก็บข้อมูลจากตารางเพื่อส่งไปยัง Dashboard
  const [tableData, setTableData] = useState<{
    donut?: any[];
    stacked?: any[];
    matrix?: any[];
  }>({});

  const clearFilter = () => setFilter({});

  // ตรวจสอบว่ามีข้อมูลส่งมาจาก Inspector หรือไม่
  const [dataFromInspector, setDataFromInspector] =
    useState<InspectorDataType | null>(null);

  useEffect(() => {
    // ถ้ามี URL parameter หรือ localStorage ที่บ่งบอกว่ามีข้อมูลใหม่ส่งมา
    const searchParams = new URLSearchParams(window.location.search);
    const fromInspector = searchParams.get("fromInspector");
    const action = searchParams.get("action");

    if (fromInspector === "true") {
      console.log("📥 Data received from Inspector - refreshing...");

      // โหลดข้อมูลจาก API เพื่อดูรายละเอียดที่ส่งมา
      fetch("/api/chief-risk-assessment-results")
        .then((res) => res.json())
        .then((data) => {
          console.log("📊 Received data from Inspector:", data);
          setDataFromInspector({
            timestamp: new Date().toISOString(),
            source: "inspector_submission",
            action: action || data.submissionInfo?.action || "submit",
            itemCount: data.submissionInfo?.itemCount || 0,
            hasReorderInfo: !!data.reorderInfo,
            reorderInfo: data.reorderInfo,
            rawData: data,
          });

          // ถ้าเป็นการจัดลำดับให้เปิดแท็บ reorder
          if (
            action === "reorder" ||
            data.submissionInfo?.action === "submit_reorder"
          ) {
            setOuterTab("reorder");
          }
        })
        .catch((error) => {
          console.error("Error loading inspector data:", error);
          setDataFromInspector({
            timestamp: new Date().toISOString(),
            source: "inspector_submission",
            action: action || "submit",
            error: "Failed to load data",
          });
        });
    }
  }, [setOuterTab]);

  return (
    <div className="min-h-svh space-y-4 pt-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-muted-foreground">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          aria-label="ย้อนกลับ"
          onClick={() => {
            if (typeof window !== "undefined" && window.history.length > 1) {
              window.history.back();
            } else {
              router.push("/risk-assessment");
            }
          }}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <span className="text-sm text-foreground font-medium">
          การประเมินความเสี่ยงและการจัดลำดับความเสี่ยง
        </span>
      </div>

      {/* บล็อกกราฟ/สรุปด้านบน */}
      <div className="space-y-4">
        <DashboardSection
          year={2568}
          statusText={
            dataFromInspector
              ? dataFromInspector.action === "submit_reorder"
                ? "ได้รับการจัดลำดับความเสี่ยงใหม่แล้ว - รอพิจารณา"
                : "ได้รับผลการประเมินแล้ว - รอพิจารณา"
              : "รอหัวหน้าหน่วยตรวจสอบพิจารณา"
          }
          donut={tableData.donut}
          stacked={tableData.stacked}
          matrix={tableData.matrix}
          onGradeClick={(grade) => setFilter((prev) => ({ ...prev, grade }))}
          onCategoryClick={(category) =>
            setFilter((prev) => ({ ...prev, category }))
          }
          activeFilter={filter}
        />

        <ActiveFilters
          grade={filter.grade}
          category={filter.category}
          onClear={clearFilter}
        />
      </div>

      {/* แถบสรุปใต้กราฟ ตามภาพ */}
      <SummaryToolbar
        value={outerTab}
        onChange={setOuterTab}
        sortDir={scoreSortDir}
        onSortDirChange={(dir) => setScoreSortDir(dir)}
        hideSortOnReorder={true}
      />

      {/* ตาราง/แท็บด้านล่าง คุมด้วย state เดียวกัน */}
      <RiskAssessmentResultsSectionPage
        outerTab={outerTab}
        onOuterTabChange={setOuterTab}
        filter={filter}
        sortDir={scoreSortDir}
        onSortDirChange={setScoreSortDir}
        onDataChange={setTableData}
      />
    </div>
  );
}
