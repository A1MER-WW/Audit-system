// app/chief-inspector-evaluation-results/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import DashboardSection from "@/components/features/inspector/risk-assessment/risk-assessment-dashboard-section";
import SummaryToolbar from "@/components/summary-toolbar";
import RiskEvaluationResultsSectionPage from "@/components/features/inspector/risk-assessment/risk-assessment-results-section";
import { ActiveFilters } from "@/components/features/inspector/risk-assessment/active-filters";

export type FilterType = {
  grade?: "E" | "H" | "M" | "L" | "N";
  category?: string;
};

type ChiefInspectorDataType = {
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
  rawData?: unknown;
  error?: string;
};

export default function ChiefInspectorEvaluationResultsPage() {
  const router = useRouter();
  const [outerTab, setOuterTab] = useState<
    "summary" | "reorder" | "unitRanking"
  >("summary");
  const [sortBy, setSortBy] = useState<"index" | "score">("index");
  const [scoreSortDir, setScoreSortDir] = useState<"desc" | "asc">("asc");
  const [filter, setFilter] = useState<FilterType>({});
  
  // State สำหรับการเปรียบเทียบปี
  const [selectedYear] = useState<number>(2568);
  const [compareYear, setCompareYear] = useState<number>(2567);
  const [showCompareView, setShowCompareView] = useState<boolean>(false);

  // State สำหรับเก็บข้อมูลจากตารางเพื่อส่งไปยัง Dashboard
  type RiskSlice = {
    key: "excellent" | "high" | "medium" | "low" | "none";
    name: string;
    value: number;
    color: string;
    grade: "E" | "H" | "M" | "L" | "N";
  };

  type StackedRow = {
    name: string;
    veryHigh: number;
    high: number;
    medium: number;
    low: number;
    veryLow: number;
  };

  type MatrixRow = {
    category: string;
    veryLow: number;
    low: number;
    medium: number;
    high: number;
    veryHigh: number;
  };
  
  const [tableData, setTableData] = useState<{
    donut?: RiskSlice[];
    stacked?: StackedRow[];
    matrix?: MatrixRow[];
  }>({});

  const clearFilter = () => setFilter({});
  const clearSort = () => {
    // รีเซ็ตไปค่าเริ่มต้น: summary mode ใช้ index/asc, อื่นๆ ใช้ score/desc
    if (outerTab === "summary") {
      setSortBy("index");
      setScoreSortDir("asc");
    } else {
      setSortBy("score");
      setScoreSortDir("desc");
    }
  };

  // ฟังก์ชันสำหรับ toggle การเปรียบเทียบ
  const handleCompareToggle = (enabled: boolean) => {
    setShowCompareView(enabled);
  };

  // Auto-adjust sorting when outerTab changes
  useEffect(() => {
    if (outerTab === "summary") {
      // summary mode ใช้ index/asc เป็นค่าเริ่มต้น
      if (sortBy !== "index" || scoreSortDir !== "asc") {
        setSortBy("index");
        setScoreSortDir("asc");
      }
    }
  }, [outerTab, sortBy, scoreSortDir]);

  // ตรวจสอบว่ามีข้อมูลส่งมาจาก Inspector หรือไม่
  const [dataFromInspector, setDataFromInspector] =
    useState<ChiefInspectorDataType | null>(null);

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
              router.push("/dashboard");
            }
          }}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <span className="text-sm text-foreground font-medium">
          ภาพรวมผลการประเมินความเสี่ยงและจัดลำดับความเสี่ยงสำหรับหัวหน้าผู้ตรวจสอบ
        </span>
      </div>

      {/* หัวข้อหลัก */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          ผลการประเมินความเสี่ยงและจัดลำดับความเสี่ยง ปีงบประมาณ {selectedYear}
        </h1>
      </div>

      {/* บล็อกกราฟ/สรุปด้านบน - แสดงเสมอ แต่ในโหมดเปรียบเทียบแสดงแค่ปีปัจจุบัน */}
      <div className="space-y-4">
        <DashboardSection
          year={selectedYear}
          statusText={
            dataFromInspector
              ? dataFromInspector.action === "submit_reorder"
                ? "ได้รับการจัดลำดับความเสี่ยงใหม่แล้ว - รอพิจารณา"
                : "ได้รับผลการประเมินแล้ว - รอพิจารณา"
              : showCompareView 
                ? `ข้อมูลผลการประเมินความเสี่ยงปี ${selectedYear} (เปรียบเทียบกับปี ${compareYear})`
                : "ข้อมูลผลการประเมินความเสี่ยงปัจจุบัน"
          }
          donut={tableData.donut}
          stacked={tableData.stacked}
          matrix={tableData.matrix}
          onGradeClick={(grade) => setFilter((prev) => ({ ...prev, grade }))}
          onCategoryClick={(category) =>
            setFilter((prev) => ({ ...prev, category }))
          }
          activeFilter={filter}
          showCompare={false}
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
        sortBy={sortBy}
        sortDir={scoreSortDir}
        onSortByChange={(by) => setSortBy(by)}
        onSortDirChange={(dir) => setScoreSortDir(dir)}
        onClearSort={clearSort}
        hideSortOnReorder={true}
        showCompareToggle={true} // แสดง switch เปรียบเทียบสำหรับ Chief Inspector
        showCompareView={showCompareView}
        onCompareToggle={handleCompareToggle}
        compareYear={compareYear}
        onCompareYearChange={setCompareYear}
        availableYears={[2567, 2566, 2565]}
      />

      {/* ตาราง/แท็บด้านล่าง คุมด้วย state เดียวกัน */}
      <RiskEvaluationResultsSectionPage
        outerTab={outerTab}
        onOuterTabChange={setOuterTab}
        filter={filter}
        sortBy={sortBy}
        sortDir={scoreSortDir}
        onSortByChange={(by: any) => setSortBy(by as "index" | "score")}
        onSortDirChange={setScoreSortDir}
        onDataChange={(data: any) => setTableData(data as { donut?: RiskSlice[]; stacked?: StackedRow[]; matrix?: MatrixRow[] })}
        showCompare={showCompareView}
        compareYear={showCompareView ? compareYear : undefined}
        currentYear={selectedYear}
        hideDocumentIcon={true}
        hideEditButton={true}
        hideStatusColumn={true}
      />
    </div>
  );
}