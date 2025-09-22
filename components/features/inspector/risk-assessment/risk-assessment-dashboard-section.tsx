"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { Info } from "lucide-react";

/** ---------- Types ---------- */
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
  veryLow: number; // น้อยที่สุด (1)
  low: number;     // น้อย (2)
  medium: number;  // ปานกลาง (3)
  high: number;    // มาก (4)
  veryHigh: number;// มากที่สุด (5)
};

// API types
type Row = {
  id: string;
  index: string;
  unit: string;
  mission: string;
  work: string;
  project: string;
  carry: string;
  activity: string;
  process: string;
  system: string;
  itType: "IT" | "Non-IT" | "-" | "";
  score: number;
  maxScore?: number;
  grade: "E" | "H" | "M" | "L" | "N" | "-";
  status: string;
  hasDoc: boolean;
};

type ApiResponse = {
  fiscalYears: number[];
  pageTitle: string;
  subtitle: string;
  assessmentName: string;
  statusLine: { label: string; value: string };
  rowsByTab: Partial<Record<string, Row[]>>;
  submissionInfo?: {
    action: string;
    submissionTime?: string;
    itemCount?: number;
  };
};

// API fetcher
const fetcher = (url: string) => fetch(url).then((r) => r.json() as Promise<ApiResponse>);



/** ---------- Main Section ---------- */
type DashboardProps = {
  year: number;
  compareYear?: number; // ปีที่จะเปรียบเทียบ
  statusText?: string;
  donut?: RiskSlice[];
  stacked?: StackedRow[];
  matrix?: MatrixRow[];
  onGradeClick?: (grade: "E" | "H" | "M" | "L" | "N") => void;
  onCategoryClick?: (category: string) => void;
  activeFilter?: {
    grade?: "E" | "H" | "M" | "L" | "N";
    category?: string;
  };
  showCompare?: boolean; // แสดงโหมดเปรียบเทียบ
};

export default function DashboardSection({
  year,
  compareYear,
  statusText,
  donut: donutProp,
  stacked: stackedProp,
  matrix: matrixProp,
  onGradeClick,
  onCategoryClick,
  activeFilter,
  showCompare = false,
}: DashboardProps) {
  const [showMatrixReport, setShowMatrixReport] = useState(false);

  // ดึงข้อมูลจาก API
  const { data, error, isLoading } = useSWR<ApiResponse>(
    `/api/chief-risk-assessment-results?year=${year}`,
    fetcher
  );

  // ดึงข้อมูลปีเปรียบเทียบถ้ามีการเปรียบเทียบ
  const { data: compareData, isLoading: compareLoading } = useSWR<ApiResponse>(
    showCompare && compareYear ? `/api/chief-risk-assessment-results?year=${compareYear}` : null,
    fetcher
  );

  // คำนวณข้อมูลจริงจาก API - ใช้ข้อมูลที่ส่งผ่าน props เป็นหลัก
  const { donut, stacked, matrix, actualStatusText } = useMemo(() => {
    // ถ้ามีข้อมูลจาก props (ที่มาจากตารางจริง) ให้ใช้ข้อมูลนั้น
    if (donutProp && donutProp.length > 0) {
      return {
        donut: donutProp,
        stacked: stackedProp || [],
        matrix: matrixProp || [],
        actualStatusText: statusText || (data?.statusLine?.value) || "แสดงข้อมูลจากตาราง"
      };
    }

    // ถ้ายังโหลดอยู่หรือมี error ให้แสดงข้อความรอ/error
    if (isLoading && !data) {
      return {
        donut: [],
        stacked: [],
        matrix: [],
        actualStatusText: "กำลังโหลดข้อมูล..."
      };
    }

    if (error && !data) {
      return {
        donut: [],
        stacked: [],
        matrix: [],
        actualStatusText: statusText || "เกิดข้อผิดพลาดในการโหลดข้อมูล"
      };
    }

    // ตรวจสอบว่ามีข้อมูลจริงจาก API หรือไม่
    if (!data || !data.rowsByTab || Object.values(data.rowsByTab).every((v: any) => !v || (Array.isArray(v) && v.length === 0))) {
      return {
        donut: [],
        stacked: [],
        matrix: [],
        actualStatusText: statusText || "รอการส่งข้อมูลจากหน่วยตรวจสอบภายใน"
      };
    }

    // รวมทุกแถวจากทุกแท็บ
    const allRows: Row[] = Object.values(data.rowsByTab).flat().filter((row): row is Row => row !== undefined && row !== null);
    
    // Debug: แสดงข้อมูลจริงจาก API
    console.log("🔍 Dashboard Debug - API Data:", {
      totalRows: allRows.length,
      sampleRows: allRows.slice(0, 3),
      gradeDistribution: allRows.reduce((acc: Record<string, number>, row) => {
        acc[row.grade] = (acc[row.grade] || 0) + 1;
        return acc;
      }, {}),
      tabData: Object.keys(data.rowsByTab).map(tab => ({
        tab,
        count: data.rowsByTab[tab]?.length || 0
      }))
    });
    
    // นับจำนวนตามเกรด (รวมทุกเกรด) - รองรับทั้งระบบ E,H,M,L,N และ H,M,L,"-"
    const gradeCounts = allRows.reduce((acc, row) => {
      // แปลง grade จาก API ให้เป็นระบบเดียวกัน
      const normalizedGrade = row.grade === "-" ? "N" : row.grade;
      
      if (normalizedGrade === "E") acc.excellent++;
      else if (normalizedGrade === "H") acc.high++;
      else if (normalizedGrade === "M") acc.medium++;
      else if (normalizedGrade === "L") acc.low++;
      else if (normalizedGrade === "N" || normalizedGrade === "-") acc.none++;
      return acc;
    }, { excellent: 0, high: 0, medium: 0, low: 0, none: 0 });

    // สร้างข้อมูลโดนัท (แสดงเฉพาะเกรดที่มีข้อมูล - ใช้สีที่ตรงกัน)
    const calculatedDonut: RiskSlice[] = [];
    
    if (gradeCounts.excellent > 0) {
      calculatedDonut.push({ key: "excellent", name: "สูงมาก", value: gradeCounts.excellent, color: gradeColors.E, grade: "E" });
    }
    if (gradeCounts.high > 0) {
      calculatedDonut.push({ key: "high", name: "สูง", value: gradeCounts.high, color: gradeColors.H, grade: "H" });
    }
    if (gradeCounts.medium > 0) {
      calculatedDonut.push({ key: "medium", name: "ปานกลาง", value: gradeCounts.medium, color: gradeColors.M, grade: "M" });
    }
    if (gradeCounts.low > 0) {
      calculatedDonut.push({ key: "low", name: "น้อย", value: gradeCounts.low, color: gradeColors.L, grade: "L" });
    }
    if (gradeCounts.none > 0) {
      calculatedDonut.push({ key: "none", name: "น้อยมาก", value: gradeCounts.none, color: gradeColors.N, grade: "N" });
    }

    // จัดกลุ่มตามประเภท (รองรับทุกเกรด)
    const categoryMap = new Map<string, { E: number; H: number; M: number; L: number; N: number }>();
    
    allRows.forEach(row => {
      let category = "อื่นๆ";
      if (row.work && row.work !== "-") category = "งาน";
      else if (row.project && row.project !== "-") category = "โครงการ";
      else if (row.carry && row.carry !== "-") category = "โครงการกันเงินเหลื่อมปี";
      else if (row.activity && row.activity !== "-") category = "กิจกรรม";
      else if (row.process && row.process !== "-") category = "กระบวนงาน";
      else if (row.system && row.system !== "-") category = "IT/Non-IT";
      else if (row.mission && row.mission !== "-") category = "หน่วยงาน";

      if (!categoryMap.has(category)) {
        categoryMap.set(category, { E: 0, H: 0, M: 0, L: 0, N: 0 });
      }
      
      const counts = categoryMap.get(category)!;
      // แปลง grade จาก API ให้เป็นระบบเดียวกัน
      const normalizedGrade = row.grade === "-" ? "N" : row.grade;
      
      if (normalizedGrade === "E") counts.E++;
      else if (normalizedGrade === "H") counts.H++;
      else if (normalizedGrade === "M") counts.M++;
      else if (normalizedGrade === "L") counts.L++;
      else if (normalizedGrade === "N" || normalizedGrade === "-") counts.N++;
    });

    // สร้างข้อมูลแท่งซ้อน (รวมทุกเกรด)
    const calculatedStacked: StackedRow[] = Array.from(categoryMap.entries()).map(([name, counts]) => ({
      name,
      veryHigh: counts.E, // Excellent -> veryHigh
      high: counts.H,     // High -> high 
      medium: counts.M,   // Medium -> medium
      low: counts.L,      // Low -> low
      veryLow: counts.N   // None -> veryLow
    }));

    // สร้างข้อมูลเมทริกซ์ (ใช้ข้อมูลจริงจาก API)
    const calculatedMatrix: MatrixRow[] = Array.from(categoryMap.entries()).map(([category, counts]) => {
      return {
        category,
        veryLow: counts.N,   // None/Not Assessed
        low: counts.L,       // Low Risk
        medium: counts.M,    // Medium Risk  
        high: counts.H,      // High Risk
        veryHigh: counts.E   // Excellent Risk
      };
    });

    return {
      donut: calculatedDonut,
      stacked: calculatedStacked,
      matrix: calculatedMatrix,
      actualStatusText: data.statusLine?.value || statusText || "-"
    };
  }, [data, error, isLoading, donutProp, stackedProp, matrixProp, statusText]);

  const total = useMemo(
    () => donut.reduce((s, d) => s + d.value, 0),
    [donut]
  );

  return (
    <section className="space-y-4">
      {/* หัวข้อหลัก + สถานะ */}
      <Card className="border-dashed">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-2">
            <CardTitle className="text-base md:text-lg font-medium">
              ผลการประเมินและจัดลำดับด้านความเสี่ยงแผนการตรวจสอบประจำปี {year}
            </CardTitle>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Info className="h-4 w-4" />
              <span className="text-amber-600 font-medium">สถานะ:</span>
              <span className="text-amber-600">{actualStatusText}</span>
              
              {/* แสดงข้อมูลเพิ่มเติมเมื่อได้รับข้อมูลจาก Inspector */}
              {data?.submissionInfo && (
                <div className="ml-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-700 font-medium">
                    ได้รับข้อมูลแล้ว ({data.submissionInfo.itemCount} รายการ)
                  </span>
                  {data.submissionInfo.submissionTime && (
                    <span className="text-gray-500 text-xs">
                      {new Date(data.submissionInfo.submissionTime).toLocaleString('th-TH')}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* หัวข้อบล็อกภาพรวม + สวิตช์ */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm md:text-base font-medium">
              ภาพรวมการประเมินและจัดลำดับความเสี่ยงแผนการตรวจสอบประจำปี
            </h3>

            <div className="flex items-center gap-2">
              <Label htmlFor="matrix-toggle" className="text-sm text-muted-foreground">
                รายงานเมทริกซ์ความเสี่ยง
              </Label>
              <Switch
                id="matrix-toggle"
                checked={showMatrixReport}
                onCheckedChange={setShowMatrixReport}
              />
            </div>
          </div>

          {/* 2 คอลัมน์: โดนัท / แท่งซ้อน - หรือ 4 คอลัมน์ถ้าเปรียบเทียบ */}
          <div className={cn(
            "grid gap-4",
            showCompare ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-4" : "grid-cols-1 md:grid-cols-2"
          )}>
            {/* === โดนัทรวมทั้งองค์กร ปีปัจจุบัน === */}
            <Card className={showCompare ? "lg:col-span-1" : ""}>
              <CardContent className="p-4 md:p-6">
                <div className="text-sm font-medium mb-3">
                  ผลการประเมินจัดลำดับด้านความเสี่ยงแผนงานภาพรวม
                  {showCompare && <span className="text-blue-600 ml-2">(ปี {year})</span>}
                </div>

                <div className="relative h-[260px] md:h-[300px]">
                  {donut.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <div className="text-center">
                        <div className="text-lg mb-2">ไม่มีข้อมูล</div>
                        <div className="text-sm">รอการส่งข้อมูลจากหน่วยตรวจสอบภายใน</div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie
                            data={donut}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={70}
                            outerRadius={110}
                            stroke="#fff"
                            strokeWidth={2}
                            label={(props: any) => {
                              const value = Number(props.value) || 0;
                              const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : "0.0";
                              return `${percentage}%`;
                            }}
                            labelLine={true}
                          >
                            {donut.map((d) => (
                              <Cell 
                                key={d.key} 
                                fill={d.color}
                                stroke="#fff"
                                strokeWidth={2}
                                style={{ cursor: onGradeClick ? 'pointer' : 'default' }}
                                onClick={() => {
                                  if (!onGradeClick) return;
                                  onGradeClick(d.grade);
                                }}
                              />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>

                      {/* ตัวเลขรวมกลางวง */}
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl md:text-5xl font-semibold leading-none">
                            {total}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* legend แบบ 2 คอลัมน์ */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  {donut.map((d) => {
                    const isActive = d.grade === activeFilter?.grade;
                    const percentage = total > 0 ? ((d.value / total) * 100).toFixed(1) : "0.0";
                    
                    return (
                      <div 
                        key={d.key} 
                        className={cn(
                          "flex items-center gap-2",
                          onGradeClick && "cursor-pointer hover:bg-gray-50 p-1 rounded",
                          isActive && "bg-gray-100"
                        )}
                        onClick={() => onGradeClick?.(d.grade)}
                      >
                        <span
                          className="inline-block h-3 w-3 rounded-sm"
                          style={{ backgroundColor: d.color }}
                          aria-hidden
                        />
                        <span className="text-muted-foreground">{d.name}</span>
                        <span className="ml-auto font-medium">{d.value}</span>
                        <span className="text-sm text-muted-foreground">({percentage}%)</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* === โดนัทปีเปรียบเทียบ (เฉพาะเมื่อ showCompare) === */}
            {showCompare && compareYear && (
              <Card className="lg:col-span-1">
                <CardContent className="p-4 md:p-6">
                  <div className="text-sm font-medium mb-3">
                    ผลการประเมินจัดลำดับด้านความเสี่ยงแผนงานภาพรวม
                    <span className="text-orange-600 ml-2">(ปี {compareYear})</span>
                  </div>

                  <div className="relative h-[260px] md:h-[300px]">
                    {compareLoading ? (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        <div className="text-center">
                          <div className="text-lg mb-2">กำลังโหลด...</div>
                          <div className="text-sm">ข้อมูลปี {compareYear}</div>
                        </div>
                      </div>
                    ) : !compareData ? (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        <div className="text-center">
                          <div className="text-lg mb-2">ไม่มีข้อมูล</div>
                          <div className="text-sm">ปี {compareYear}</div>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* คำนวณข้อมูล donut สำหรับปีเปรียบเทียบ */}
                        {(() => {
                          const compareRows: Row[] = Object.values(compareData.rowsByTab).flat().filter((row): row is Row => row !== undefined && row !== null);
                          const compareGradeCounts = compareRows.reduce((acc, row) => {
                            const normalizedGrade = row.grade === "-" ? "N" : row.grade;
                            if (normalizedGrade === "E") acc.excellent++;
                            else if (normalizedGrade === "H") acc.high++;
                            else if (normalizedGrade === "M") acc.medium++;
                            else if (normalizedGrade === "L") acc.low++;
                            else if (normalizedGrade === "N" || normalizedGrade === "-") acc.none++;
                            return acc;
                          }, { excellent: 0, high: 0, medium: 0, low: 0, none: 0 });

                          const compareDonut: RiskSlice[] = [];
                          if (compareGradeCounts.excellent > 0) {
                            compareDonut.push({ key: "excellent", name: "สูงมาก", value: compareGradeCounts.excellent, color: gradeColors.E, grade: "E" });
                          }
                          if (compareGradeCounts.high > 0) {
                            compareDonut.push({ key: "high", name: "สูง", value: compareGradeCounts.high, color: gradeColors.H, grade: "H" });
                          }
                          if (compareGradeCounts.medium > 0) {
                            compareDonut.push({ key: "medium", name: "ปานกลาง", value: compareGradeCounts.medium, color: gradeColors.M, grade: "M" });
                          }
                          if (compareGradeCounts.low > 0) {
                            compareDonut.push({ key: "low", name: "น้อย", value: compareGradeCounts.low, color: gradeColors.L, grade: "L" });
                          }
                          if (compareGradeCounts.none > 0) {
                            compareDonut.push({ key: "none", name: "น้อยมาก", value: compareGradeCounts.none, color: gradeColors.N, grade: "N" });
                          }

                          const compareTotal = compareDonut.reduce((s, d) => s + d.value, 0);

                          return (
                            <>
                              <ResponsiveContainer>
                                <PieChart>
                                  <Pie
                                    data={compareDonut}
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius={70}
                                    outerRadius={110}
                                    stroke="#fff"
                                    strokeWidth={2}
                                    label={(props: any) => {
                                      const value = Number(props.value) || 0;
                                      const percentage = compareTotal > 0 ? ((value / compareTotal) * 100).toFixed(1) : "0.0";
                                      return `${percentage}%`;
                                    }}
                                    labelLine={true}
                                  >
                                    {compareDonut.map((d) => (
                                      <Cell 
                                        key={d.key} 
                                        fill={d.color}
                                        stroke="#fff"
                                        strokeWidth={2}
                                        style={{ cursor: onGradeClick ? 'pointer' : 'default' }}
                                        onClick={() => {
                                          if (!onGradeClick) return;
                                          onGradeClick(d.grade);
                                        }}
                                      />
                                    ))}
                                  </Pie>
                                </PieChart>
                              </ResponsiveContainer>

                              {/* ตัวเลขรวมกลางวง */}
                              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                  <div className="text-4xl md:text-5xl font-semibold leading-none">
                                    {compareTotal}
                                  </div>
                                </div>
                              </div>

                              {/* legend แบบ 2 คอลัมน์ */}
                              <div className="absolute bottom-0 left-0 right-0">
                                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                                  {compareDonut.map((d) => {
                                    const isActive = d.grade === activeFilter?.grade;
                                    const percentage = compareTotal > 0 ? ((d.value / compareTotal) * 100).toFixed(1) : "0.0";
                                    
                                    return (
                                      <div 
                                        key={d.key} 
                                        className={cn(
                                          "flex items-center gap-2",
                                          onGradeClick && "cursor-pointer hover:bg-gray-50 p-1 rounded",
                                          isActive && "bg-gray-100"
                                        )}
                                        onClick={() => onGradeClick?.(d.grade)}
                                      >
                                        <span
                                          className="inline-block h-3 w-3 rounded-sm"
                                          style={{ backgroundColor: d.color }}
                                          aria-hidden
                                        />
                                        <span className="text-muted-foreground">{d.name}</span>
                                        <span className="ml-auto font-medium">{d.value}</span>
                                        <span className="text-sm text-muted-foreground">({percentage}%)</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </>
                          );
                        })()}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* === แท่งซ้อนตามหมวด === */}
            <Card className={showCompare ? "lg:col-span-1" : ""}>
              <CardContent className="p-4 md:p-6">
                <div className="text-sm font-medium mb-3">
                  สรุปจำนวนผลการประเมินและจัดลำดับความเสี่ยงแยกตามหมวด
                  {showCompare && <span className="text-blue-600 ml-2">(ปี {year})</span>}
                </div>

                <div className="h-[260px] md:h-[300px]">
                  {stacked.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <div className="text-center">
                        <div className="text-lg mb-2">ไม่มีข้อมูล</div>
                        <div className="text-sm">รอการส่งข้อมูลจากหน่วยตรวจสอบภายใน</div>
                      </div>
                    </div>
                  ) : (
                    <ResponsiveContainer>
                      <BarChart data={stacked}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" tickMargin={8} />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Bar 
                          dataKey="veryHigh" 
                          stackId="a" 
                          name="สูงมาก" 
                          fill={gradeColors.E}
                          fillOpacity={activeFilter?.grade === "E" || !activeFilter?.grade ? 1 : 0.3}
                          onClick={(data) => {
                            if (!onGradeClick || !onCategoryClick || !data?.name) return;
                            onGradeClick("E");
                            onCategoryClick(data.name);
                          }}
                          style={{ cursor: (onGradeClick && onCategoryClick) ? 'pointer' : 'default' }}
                        />
                        <Bar 
                          dataKey="high" 
                          stackId="a" 
                          name="สูง" 
                          fill={gradeColors.H}
                          fillOpacity={activeFilter?.grade === "H" || !activeFilter?.grade ? 1 : 0.3}
                          onClick={(data) => {
                            if (!onGradeClick || !onCategoryClick || !data?.name) return;
                            onGradeClick("H");
                            onCategoryClick(data.name);
                          }}
                          style={{ cursor: (onGradeClick && onCategoryClick) ? 'pointer' : 'default' }}
                        />
                        <Bar 
                          dataKey="medium" 
                          stackId="a" 
                          name="ปานกลาง" 
                          fill={gradeColors.M}
                          fillOpacity={activeFilter?.grade === "M" || !activeFilter?.grade ? 1 : 0.3}
                          onClick={(data) => {
                            if (!onGradeClick || !onCategoryClick || !data?.name) return;
                            onGradeClick("M");
                            onCategoryClick(data.name);
                          }}
                          style={{ cursor: (onGradeClick && onCategoryClick) ? 'pointer' : 'default' }}
                        />
                        <Bar 
                          dataKey="low" 
                          stackId="a" 
                          name="น้อย" 
                          fill={gradeColors.L}
                          fillOpacity={activeFilter?.grade === "L" || !activeFilter?.grade ? 1 : 0.3}
                          onClick={(data) => {
                            if (!onGradeClick || !onCategoryClick || !data?.name) return;
                            onGradeClick("L");
                            onCategoryClick(data.name);
                          }}
                          style={{ cursor: (onGradeClick && onCategoryClick) ? 'pointer' : 'default' }}
                        />
                        <Bar 
                          dataKey="veryLow" 
                          stackId="a" 
                          name="น้อยมาก" 
                          fill={gradeColors.N}
                          fillOpacity={activeFilter?.grade === "N" || !activeFilter?.grade ? 1 : 0.3}
                          onClick={(data) => {
                            if (!onGradeClick || !onCategoryClick || !data?.name) return;
                            onGradeClick("N");
                            onCategoryClick(data.name);
                          }}
                          style={{ cursor: (onGradeClick && onCategoryClick) ? 'pointer' : 'default' }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* === แท่งซ้อนปีเปรียบเทียบ (เฉพาะเมื่อ showCompare) === */}
            {showCompare && compareYear && (
              <Card className="lg:col-span-1">
                <CardContent className="p-4 md:p-6">
                  <div className="text-sm font-medium mb-3">
                    สรุปจำนวนผลการประเมินและจัดลำดับความเสี่ยงแยกตามหมวด
                    <span className="text-orange-600 ml-2">(ปี {compareYear})</span>
                  </div>

                  <div className="h-[260px] md:h-[300px]">
                    {compareLoading ? (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        <div className="text-center">
                          <div className="text-lg mb-2">กำลังโหลด...</div>
                          <div className="text-sm">ข้อมูลปี {compareYear}</div>
                        </div>
                      </div>
                    ) : !compareData ? (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        <div className="text-center">
                          <div className="text-lg mb-2">ไม่มีข้อมูล</div>
                          <div className="text-sm">ปี {compareYear}</div>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* คำนวณข้อมูล stacked สำหรับปีเปรียบเทียบ */}
                        {(() => {
                          const compareRows: Row[] = Object.values(compareData.rowsByTab).flat().filter((row): row is Row => row !== undefined && row !== null);
                          
                          // จัดกลุ่มตามประเภท
                          const compareCategoryMap = new Map<string, { E: number; H: number; M: number; L: number; N: number }>();
                          
                          compareRows.forEach(row => {
                            let category = "อื่นๆ";
                            if (row.work && row.work !== "-") category = "งาน";
                            else if (row.project && row.project !== "-") category = "โครงการ";
                            else if (row.carry && row.carry !== "-") category = "โครงการกันเงินเหลื่อมปี";
                            else if (row.activity && row.activity !== "-") category = "กิจกรรม";
                            else if (row.process && row.process !== "-") category = "กระบวนงาน";
                            else if (row.system && row.system !== "-") category = "IT/Non-IT";
                            else if (row.mission && row.mission !== "-") category = "หน่วยงาน";

                            if (!compareCategoryMap.has(category)) {
                              compareCategoryMap.set(category, { E: 0, H: 0, M: 0, L: 0, N: 0 });
                            }
                            
                            const counts = compareCategoryMap.get(category)!;
                            const normalizedGrade = row.grade === "-" ? "N" : row.grade;
                            
                            if (normalizedGrade === "E") counts.E++;
                            else if (normalizedGrade === "H") counts.H++;
                            else if (normalizedGrade === "M") counts.M++;
                            else if (normalizedGrade === "L") counts.L++;
                            else if (normalizedGrade === "N" || normalizedGrade === "-") counts.N++;
                          });

                          // สร้างข้อมูลแท่งซ้อน
                          const compareStacked: StackedRow[] = Array.from(compareCategoryMap.entries()).map(([name, counts]) => ({
                            name,
                            veryHigh: counts.E,
                            high: counts.H,
                            medium: counts.M,
                            low: counts.L,
                            veryLow: counts.N
                          }));

                          return (
                            <ResponsiveContainer>
                              <BarChart data={compareStacked}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tickMargin={8} />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Legend />
                                <Bar 
                                  dataKey="veryHigh" 
                                  stackId="a" 
                                  name="สูงมาก" 
                                  fill={gradeColors.E}
                                  fillOpacity={activeFilter?.grade === "E" || !activeFilter?.grade ? 1 : 0.3}
                                  onClick={(data) => {
                                    if (!onGradeClick || !onCategoryClick || !data?.name) return;
                                    onGradeClick("E");
                                    onCategoryClick(data.name);
                                  }}
                                  style={{ cursor: (onGradeClick && onCategoryClick) ? 'pointer' : 'default' }}
                                />
                                <Bar 
                                  dataKey="high" 
                                  stackId="a" 
                                  name="สูง" 
                                  fill={gradeColors.H}
                                  fillOpacity={activeFilter?.grade === "H" || !activeFilter?.grade ? 1 : 0.3}
                                  onClick={(data) => {
                                    if (!onGradeClick || !onCategoryClick || !data?.name) return;
                                    onGradeClick("H");
                                    onCategoryClick(data.name);
                                  }}
                                  style={{ cursor: (onGradeClick && onCategoryClick) ? 'pointer' : 'default' }}
                                />
                                <Bar 
                                  dataKey="medium" 
                                  stackId="a" 
                                  name="ปานกลาง" 
                                  fill={gradeColors.M}
                                  fillOpacity={activeFilter?.grade === "M" || !activeFilter?.grade ? 1 : 0.3}
                                  onClick={(data) => {
                                    if (!onGradeClick || !onCategoryClick || !data?.name) return;
                                    onGradeClick("M");
                                    onCategoryClick(data.name);
                                  }}
                                  style={{ cursor: (onGradeClick && onCategoryClick) ? 'pointer' : 'default' }}
                                />
                                <Bar 
                                  dataKey="low" 
                                  stackId="a" 
                                  name="น้อย" 
                                  fill={gradeColors.L}
                                  fillOpacity={activeFilter?.grade === "L" || !activeFilter?.grade ? 1 : 0.3}
                                  onClick={(data) => {
                                    if (!onGradeClick || !onCategoryClick || !data?.name) return;
                                    onGradeClick("L");
                                    onCategoryClick(data.name);
                                  }}
                                  style={{ cursor: (onGradeClick && onCategoryClick) ? 'pointer' : 'default' }}
                                />
                                <Bar 
                                  dataKey="veryLow" 
                                  stackId="a" 
                                  name="น้อยมาก" 
                                  fill={gradeColors.N}
                                  fillOpacity={activeFilter?.grade === "N" || !activeFilter?.grade ? 1 : 0.3}
                                  onClick={(data) => {
                                    if (!onGradeClick || !onCategoryClick || !data?.name) return;
                                    onGradeClick("N");
                                    onCategoryClick(data.name);
                                  }}
                                  style={{ cursor: (onGradeClick && onCategoryClick) ? 'pointer' : 'default' }}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          );
                        })()}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      {/* -------- รายงานเมทริกซ์ความเสี่ยง (Toggle) -------- */}
      {showMatrixReport && (
        <MatrixReport 
          data={matrix} 
          onGradeClick={onGradeClick}
          onCategoryClick={onCategoryClick}
          activeFilter={activeFilter}
        />
      )}
    </section>
  );
}

/** ---------- Matrix Report Component ---------- */
function MatrixReport({ 
  data, 
  onGradeClick, 
  onCategoryClick, 
  activeFilter 
}: { 
  data: MatrixRow[];
  onGradeClick?: (grade: "E" | "H" | "M" | "L" | "N") => void;
  onCategoryClick?: (category: string) => void;
  activeFilter?: {
    grade?: "E" | "H" | "M" | "L" | "N";
    category?: string;
  };
}) {
  const columns = [
    { key: "veryLow",  label: "น้อยมาก",  color: colorsScale.veryLow, grade: "N" as const },
    { key: "low",      label: "น้อย",       color: colorsScale.low, grade: "L" as const },
    { key: "medium",   label: "ปานกลาง",    color: colorsScale.medium, grade: "M" as const },
    { key: "high",     label: "สูง",        color: colorsScale.high, grade: "H" as const },
    { key: "veryHigh", label: "สูงมาก",  color: colorsScale.veryHigh, grade: "E" as const },
  ] as const;





  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base md:text-lg font-medium">
          เมทริกซ์ความเสี่ยงแยกตามหมวดหมู่
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="w-full overflow-x-auto">
          <div className="min-w-[860px]">
            {/* กรอบรวม */}
            <div className="rounded-xl border">
              {/* Header */}
              <div className="grid grid-cols-[180px_repeat(5,1fr)]">
                <div className="p-3 text-sm font-medium border-b">หมวดหมู่</div>
                {columns.map(col => (
                  <div 
                    key={col.key} 
                    className={cn(
                      "p-3 text-center text-sm font-medium border-b transition-colors",
                      onGradeClick && "cursor-pointer hover:bg-gray-50",
                      activeFilter?.grade === col.grade && "bg-blue-50 text-blue-700",
                      activeFilter?.grade && activeFilter?.grade !== col.grade && "opacity-60"
                    )}
                    onClick={() => onGradeClick?.(col.grade)}
                    title={`กรองตามระดับ: ${col.label}`}
                  >
                    {col.label}
                  </div>
                ))}
              </div>

              {/* Rows */}
              {data.map((row, idx) => (
                <div
                  key={row.category}
                  className={cn(
                    "grid grid-cols-[180px_repeat(5,1fr)]",
                    idx !== data.length - 1 && "border-b"
                  )}
                >
                  {/* ชื่อหมวด */}
                  <div 
                    className={cn(
                      "p-2.5 text-sm font-medium",
                      onCategoryClick && "cursor-pointer hover:bg-gray-50 rounded-l-md",
                      activeFilter?.category === row.category && "bg-blue-50 text-blue-700",
                      activeFilter?.category && activeFilter?.category !== row.category && "opacity-60"
                    )}
                    onClick={() => onCategoryClick?.(row.category)}
                    title={`กรองตามหมวด: ${row.category}`}
                  >
                    {row.category}
                  </div>

                  {/* Cells */}
                  {columns.map(col => {
                    const v = row[col.key];
                    const isActiveCell = activeFilter?.grade === col.grade && activeFilter?.category === row.category;
                    const isActiveGrade = activeFilter?.grade === col.grade;
                    const isActiveCategory = activeFilter?.category === row.category;
                    const hasFilter = !!activeFilter?.grade || !!activeFilter?.category;
                    
                    return (
                      <div key={col.key} className="p-2.5">
                        <div
                          className={cn(
                            "h-10 rounded-md flex items-center justify-center text-sm font-medium",
                            "border transition-all duration-200",
                            (onGradeClick || onCategoryClick) && "cursor-pointer hover:scale-105 hover:shadow-md",
                            isActiveCell && "ring-2 ring-blue-500 ring-offset-1",
                            hasFilter && !isActiveGrade && !isActiveCategory && "opacity-40"
                          )}
                          style={{
                            // ใช้สีเฉดตามคอลัมน์และความเข้มจากค่า
                            backgroundColor: `color-mix(in oklab, ${col.color} ${Math.min(92, Math.max(14, Math.round((v / Math.max(1, v) ) * 72 + 14)))}%, white)`,
                            borderColor: `color-mix(in oklab, ${col.color} 35%, transparent)`,
                          }}
                          onClick={() => {
                            if (onGradeClick && onCategoryClick) {
                              // Set both grade and category filters
                              onGradeClick(col.grade);
                              onCategoryClick(row.category);
                            } else if (onGradeClick) {
                              onGradeClick(col.grade);
                            } else if (onCategoryClick) {
                              onCategoryClick(row.category);
                            }
                          }}
                          title={`${col.label} - ${row.category}: ${v} รายการ`}
                        >
                          {v}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}

              {/* Footer ระดับ (แนวตั้งเหมือนรูป) */}
              <div className="grid grid-cols-[180px_repeat(5,1fr)] border-t bg-gray-50">
                <div className="p-3 text-sm text-muted-foreground" />
                {columns.map(col => (
                  <div 
                    key={col.key} 
                    className={cn(
                      "p-3 text-center text-sm text-muted-foreground transition-colors",
                      onGradeClick && "cursor-pointer hover:text-gray-700",
                      activeFilter?.grade === col.grade && "text-blue-700 font-medium"
                    )}
                    onClick={() => onGradeClick?.(col.grade)}
                  >
                    {/* ซ้ำ label สั้น ๆ ด้านล่าง */}
                    {col.label.split(" ")[0]}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/** ---------- Palette ---------- */
// ระบบสีที่ตรงกับภาพตัวอย่าง และสอดคล้องกันระหว่าง Donut, Bar chart และ Matrix
const gradeColors = {
  // ตามลำดับความเสี่ยง: สูงไปต่ำ (ตรงตามภาพ)
  E: "#DC2626", // red-600 - สูงมาก (แดงเข้ม)
  H: "#EA580C", // orange-600 - สูง (ส้มแดง) 
  M: "#FACC15", // yellow-400 - ปานกลาง (เหลือง)
  L: "#65A30D", // lime-600 - น้อย (เขียวอ่อน)
  N: "#16A34A"  // green-600 - น้อยมาก (เขียวเข้ม)
};





// เฉดสีหลักสำหรับเมทริกซ์ (ตรงกับสีหลัก)
const colorsScale = {
  veryHigh: "#DC2626", // สูงมาก (E) - แดงเข้ม
  high:     "#EA580C", // สูง (H) - ส้มแดง
  medium:   "#FACC15", // ปานกลาง (M) - เหลือง
  low:      "#65A30D", // น้อย (L) - เขียวอ่อน
  veryLow:  "#16A34A"  // น้อยมาก (N) - เขียวเข้ม
} as const;






