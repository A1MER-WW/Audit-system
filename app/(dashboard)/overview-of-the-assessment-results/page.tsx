// app/(your-segment)/risk-assessment/results/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import DashboardSection from "@/components/features/inspector/risk-assessment/risk-assessment-dashboard-section";
import SummaryToolbar from "@/components/summary-toolbar";
import RiskAssessmentResultsSectionPage from "@/components/features/inspector/risk-assessment/risk-assessment-results-section";
import { ActiveFilters } from "@/components/features/inspector/risk-assessment/active-filters";

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
  rawData?: unknown;
  error?: string;
};

export default function RiskAssessmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams(); // 👈
  const [outerTab, setOuterTab] = useState<
    "summary" | "reorder" | "unitRanking"
  >("summary");
  const [sortBy, setSortBy] = useState<"index" | "score">("index");
  const [scoreSortDir, setScoreSortDir] = useState<"desc" | "asc">("asc");
  const [filter, setFilter] = useState<FilterType>({});

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
    useState<InspectorDataType | null>(null);
  useEffect(() => {
    const fromInspector = searchParams.get("fromInspector");
    const action = searchParams.get("action");

    if (fromInspector === "true") {
      console.log("🔄 Fetching updated data from Inspector...");
      
      // รีเซ็ตข้อมูลตารางก่อนโหลดใหม่
      setTableData({});
      
      // ยิงใหม่ทุกครั้งที่ query เปลี่ยน พร้อม timestamp เพื่อ bypass cache
      fetch(`/api/chief-risk-assessment-results?_t=${Date.now()}`, { 
        cache: "no-store",
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("✅ Received updated data:", {
            hasRowsByTab: !!data.rowsByTab,
            rowsByTabKeys: Object.keys(data.rowsByTab || {}),
            hasReorderInfo: !!data.reorderInfo,
            action: data.submissionInfo?.action
          });

          setDataFromInspector({
            timestamp: new Date().toISOString(),
            source: "inspector_submission",
            action: action || data.submissionInfo?.action || "submit",
            itemCount: data.submissionInfo?.itemCount || 0,
            hasReorderInfo: !!data.reorderInfo,
            reorderInfo: data.reorderInfo,
            rawData: data,
          });

          if (
            action === "reorder" ||
            data.submissionInfo?.action === "submit_reorder"
          ) {
            setOuterTab("reorder");
          }

          // ถ้าอยากเคลียร์ query หลังอ่านแล้ว (กัน reload ซ้ำ)
          const sp = new URLSearchParams(searchParams.toString());
          sp.delete("fromInspector");
          sp.delete("action");
          router.replace(`?${sp.toString()}`, { scroll: false });
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
    // ✅ ให้ effect ทำงานเมื่อ query เปลี่ยน
  }, [searchParams, router]);

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
        sortBy={sortBy}
        sortDir={scoreSortDir}
        onSortByChange={setSortBy}
        onSortDirChange={(dir) => setScoreSortDir(dir)}
        onClearSort={clearSort}
        hideSortOnReorder={true}
      />

      {/* ตาราง/แท็บด้านล่าง คุมด้วย state เดียวกัน */}
      <RiskAssessmentResultsSectionPage
        outerTab={outerTab}
        onOuterTabChange={setOuterTab}
        filter={filter}
        sortBy={sortBy}
        sortDir={scoreSortDir}
        onSortDirChange={setScoreSortDir}
        onDataChange={(data) => setTableData(data as { donut?: RiskSlice[]; stacked?: StackedRow[]; matrix?: MatrixRow[] })}
        overrideData={dataFromInspector?.rawData as {
          submissionInfo?: { action?: string };
          reorderInfo?: {
            hasChanges?: boolean;
            newOrder?: string[];
            originalOrder?: string[];
            changedItem?: string;
            reason?: string;
            reasonById?: Record<string, string>;
          };
          [key: string]: unknown;
        }}
      />
    </div>
  );
}
