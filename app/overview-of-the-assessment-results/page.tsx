// app/(your-segment)/risk-assessment/results/page.tsx
"use client";

import { useState, useEffect } from "react";
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
  const [outerTab, setOuterTab] = useState<
    "summary" | "reorder" | "unitRanking"
  >("summary");
  const [scoreSortDir, setScoreSortDir] = useState<"desc" | "asc">("desc");
  const [filter, setFilter] = useState<FilterType>({});

  const clearFilter = () => setFilter({});

  // ตรวจสอบว่ามีข้อมูลส่งมาจาก Inspector หรือไม่
  const [dataFromInspector, setDataFromInspector] = useState<InspectorDataType | null>(null);
  
  useEffect(() => {
    // ถ้ามี URL parameter หรือ localStorage ที่บ่งบอกว่ามีข้อมูลใหม่ส่งมา
    const searchParams = new URLSearchParams(window.location.search);
    const fromInspector = searchParams.get("fromInspector");
    const action = searchParams.get("action");
    
    if (fromInspector === "true") {
      console.log("📥 Data received from Inspector - refreshing...");
      
      // โหลดข้อมูลจาก API เพื่อดูรายละเอียดที่ส่งมา
      fetch('/api/chief-risk-assessment-results')
        .then(res => res.json())
        .then(data => {
          console.log("📊 Received data from Inspector:", data);
          setDataFromInspector({
            timestamp: new Date().toISOString(),
            source: "inspector_submission",
            action: action || data.submissionInfo?.action || "submit",
            itemCount: data.submissionInfo?.itemCount || 0,
            hasReorderInfo: !!data.reorderInfo,
            reorderInfo: data.reorderInfo,
            rawData: data
          });
          
          // ถ้าเป็นการจัดลำดับให้เปิดแท็บ reorder
          if (action === "reorder" || data.submissionInfo?.action === "submit_reorder") {
            setOuterTab("reorder");
          }
        })
        .catch(error => {
          console.error("Error loading inspector data:", error);
          setDataFromInspector({
            timestamp: new Date().toISOString(),
            source: "inspector_submission",
            action: action || "submit",
            error: "Failed to load data"
          });
        });
    }
  }, [setOuterTab]);

  return (
    <div className="min-h-svh space-y-4">
      {/* แสดงข้อมูลการรับข้อมูลจาก Inspector */}
      {dataFromInspector && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
              <span className="text-green-800 font-medium">
                {dataFromInspector.action === "submit_reorder" ? 
                  "ได้รับข้อมูลการจัดลำดับความเสี่ยงจาก Inspector เรียบร้อยแล้ว" :
                  "ได้รับข้อมูลการประเมินความเสี่ยงจาก Inspector เรียบร้อยแล้ว"
                }
              </span>
              <span className="text-green-600 text-sm">
                ({new Date(dataFromInspector.timestamp).toLocaleString('th-TH')})
              </span>
            </div>
            
            {/* แสดงรายละเอียดเพิ่มเติม */}
            <div className="ml-5 space-y-1 text-sm text-green-700">
              <div className="flex items-center space-x-4">
                <span>📊 จำนวนรายการ: <strong>{dataFromInspector.itemCount || 0}</strong> รายการ</span>
                {dataFromInspector.action === "submit_reorder" && (
                  <span>🔄 ประเภท: <strong>การจัดลำดับความเสี่ยงใหม่</strong></span>
                )}
                {dataFromInspector.action !== "submit_reorder" && (
                  <span>✅ ประเภท: <strong>การประเมินความเสี่ยง</strong></span>
                )}
              </div>
              
              {/* แสดงข้อมูลการจัดลำดับเพิ่มเติม */}
              {dataFromInspector.hasReorderInfo && dataFromInspector.reorderInfo && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="text-blue-800 font-medium text-sm mb-2">📋 รายละเอียดการจัดลำดับใหม่:</div>
                  <div className="space-y-1 text-xs text-blue-700">
                    {dataFromInspector.reorderInfo.hasChanges ? (
                      <>
                        <div>✅ มีการเปลี่ยนแปลงลำดับ</div>
                        {dataFromInspector.reorderInfo.changedItem && (
                          <div>🎯 รายการที่ถูกย้าย: {dataFromInspector.reorderInfo.changedItem}</div>
                        )}
                        {dataFromInspector.reorderInfo.reason && (
                          <div>💬 เหตุผล: {dataFromInspector.reorderInfo.reason}</div>
                        )}
                      </>
                    ) : (
                      <div>ℹ️ ไม่มีการเปลี่ยนแปลงลำดับ</div>
                    )}
                  </div>
                </div>
              )}
              
              {/* ข้อมูลสถิติการประเมิน */}
              {dataFromInspector.rawData?.rowsByTab && (
                <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-md">
                  <div className="text-gray-800 font-medium text-sm mb-2">📈 สถิติข้อมูลที่ได้รับ:</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-700">
                    {Object.entries(dataFromInspector.rawData.rowsByTab).map(([tabKey, rows]: [string, any]) => (
                      <div key={tabKey} className="bg-white p-2 rounded border">
                        <div className="font-medium text-center">{tabKey}</div>
                        <div className="text-center text-lg font-bold text-blue-600">
                          {Array.isArray(rows) ? rows.length : 0}
                        </div>
                        <div className="text-center text-xs text-gray-500">รายการ</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* บล็อกกราฟ/สรุปด้านบน */}
      <div className="space-y-4">
        <DashboardSection 
          year={2568} 
          statusText={dataFromInspector ? 
            (dataFromInspector.action === "submit_reorder" ? 
              "ได้รับการจัดลำดับความเสี่ยงใหม่แล้ว - รอพิจารณา" : 
              "ได้รับผลการประเมินแล้ว - รอพิจารณา"
            ) : 
            "รอหัวหน้าหน่วยตรวจสอบพิจารณา"
          }
          onGradeClick={(grade) => setFilter(prev => ({ ...prev, grade }))}
          onCategoryClick={(category) => setFilter(prev => ({ ...prev, category }))}
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
      />

      {/* ตาราง/แท็บด้านล่าง คุมด้วย state เดียวกัน */}
      <RiskAssessmentResultsSectionPage
        outerTab={outerTab}
        onOuterTabChange={setOuterTab}
        filter={filter}
      />
    </div>
  );
}
