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
};

export default function DashboardSection({
  year,
  statusText,
  donut: donutProp,
  stacked: stackedProp,
  matrix: matrixProp,
  onGradeClick,
  onCategoryClick,
  activeFilter,
}: DashboardProps) {
  const [showMatrixReport, setShowMatrixReport] = useState(false);

  // ดึงข้อมูลจาก API
  const { data, error, isLoading } = useSWR<ApiResponse>(
    `/api/chief-risk-assessment-results?year=${year}`,
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
    if (!data || !data.rowsByTab || Object.values(data.rowsByTab).every(v => !v || v.length === 0)) {
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
      calculatedDonut.push({ key: "excellent", name: "มากที่สุด", value: gradeCounts.excellent, color: gradeColors.E, grade: "E" });
    }
    if (gradeCounts.high > 0) {
      calculatedDonut.push({ key: "high", name: "มาก", value: gradeCounts.high, color: gradeColors.H, grade: "H" });
    }
    if (gradeCounts.medium > 0) {
      calculatedDonut.push({ key: "medium", name: "ปานกลาง", value: gradeCounts.medium, color: gradeColors.M, grade: "M" });
    }
    if (gradeCounts.low > 0) {
      calculatedDonut.push({ key: "low", name: "น้อย", value: gradeCounts.low, color: gradeColors.L, grade: "L" });
    }
    if (gradeCounts.none > 0) {
      calculatedDonut.push({ key: "none", name: "ไม่ประเมิน", value: gradeCounts.none, color: gradeColors.N, grade: "N" });
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

          {/* 2 คอลัมน์: โดนัท / แท่งซ้อน */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* === โดนัทรวมทั้งองค์กร === */}
            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="text-sm font-medium mb-3">
                  ผลการประเมินจัดลำดับด้านความเสี่ยงแผนงานภาพรวม
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
                            label={(entry: any) => {
                              const value = entry.value || 0;
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

            {/* === แท่งซ้อนตามหมวด === */}
            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="text-sm font-medium mb-3">
                  สรุปจำนวนผลการประเมินและจัดลำดับความเสี่ยงแยกตามหมวด
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
                          name="มากที่สุด (E)" 
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
                          name="มาก (H)" 
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
                          name="ปานกลาง (M)" 
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
                          name="น้อย (L)" 
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
                          name="ไม่ประเมิน (N)" 
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
    { key: "veryLow",  label: "น้อยที่สุด (1)",  color: colorsScale.veryLow, grade: "N" as const },
    { key: "low",      label: "น้อย (2)",       color: colorsScale.low, grade: "L" as const },
    { key: "medium",   label: "ปานกลาง (3)",    color: colorsScale.medium, grade: "M" as const },
    { key: "high",     label: "มาก (4)",        color: colorsScale.high, grade: "H" as const },
    { key: "veryHigh", label: "มากที่สุด (5)",  color: colorsScale.veryHigh, grade: "E" as const },
  ] as const;

  // หา max เพื่อนำไปคำนวณความเข้มสีแบบ heat
  const maxVal = Math.max(
    1,
    ...data.flatMap(r => [r.veryLow, r.low, r.medium, r.high, r.veryHigh])
  );

  const getBg = (base: string, v: number) => {
    // intensity 10–30–50–70–90 ตามสัดส่วนค่า
    const pct = v / maxVal;
    const step = pct >= 0.85 ? 90 : pct >= 0.65 ? 70 : pct >= 0.45 ? 50 : pct >= 0.25 ? 30 : 10;
    // ใช้ CSS variable + opacity
    return `${base}/${step}`;
  };

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
  // ตามลำดับความเสี่ยง: สูงไปต่ำ
  E: "#9333EA", // purple-600 - Excellent (มากที่สุด) 
  H: "#EF4444", // red-500 - High Risk (มาก)
  M: "#F97316", // orange-500 - Medium Risk (ปานกลาง) 
  L: "#10B981", // emerald-500 - Low Risk (น้อย)
  N: "#6B7280"  // gray-500 - Not Assessed (ไม่ประเมิน)
};



// สำหรับ Donut/Bar chart (ใช้ key mapping เดิม)
const colors = {
  veryHigh: gradeColors.H, // High Risk (H) - แดง
  high: gradeColors.M,     // Medium Risk (M) - ส้ม
  medium: gradeColors.L,   // Low Risk (L) - เขียว
  low: "#3B82F6",         // ไม่ใช้แล้ว
  veryLow: gradeColors.N,  // Not Assessed (N) - เทา
};

// เฉดสีหลักสำหรับเมทริกซ์ (ตรงกับสีหลัก)
const colorsScale = {
  veryHigh: "#9333EA", // Excellent (E) - ม่วง
  high:     "#EF4444", // High Risk (H) - แดง  
  medium:   "#F97316", // Medium Risk (M) - ส้ม
  low:      "#10B981", // Low Risk (L) - เขียว
  veryLow:  "#6B7280"  // Not Assessed (N) - เทา
} as const;

/** ---------- Mock data (แก้ตามจริงได้) ---------- */
const defaultDonut: RiskSlice[] = [
  { key: "high", name: "มาก", value: 37, color: gradeColors.H, grade: "H" },
  { key: "medium", name: "ปานกลาง", value: 44, color: gradeColors.M, grade: "M" },
  { key: "low", name: "น้อย", value: 30, color: gradeColors.L, grade: "L" },
];

const defaultStacked: StackedRow[] = [
  { name: "หน่วยงาน",             veryHigh: 10, high: 15, medium: 8,  low: 0, veryLow: 0 },
  { name: "งาน",                  veryHigh: 8,  high: 12, medium: 10, low: 0, veryLow: 0 },
  { name: "โครงการ",              veryHigh: 6,  high: 8,  medium: 6,  low: 0, veryLow: 0 },
  { name: "โครงการกันเงินเหลื่อมปี", veryHigh: 4,  high: 6,  medium: 4,  low: 0, veryLow: 0 },
  { name: "กิจกรรม",              veryHigh: 3,  high: 5,  medium: 4,  low: 0, veryLow: 0 },
  { name: "กระบวนงาน",            veryHigh: 4,  high: 6,  medium: 5,  low: 0, veryLow: 0 },
  { name: "IT/Non-IT",            veryHigh: 2,  high: 4,  medium: 3,  low: 0, veryLow: 0 },
];

const defaultMatrix: MatrixRow[] = [
  { category: "หน่วยงาน",  veryLow: 8, low: 4, medium: 10, high: 7, veryHigh: 9 },
  { category: "งาน",       veryLow: 1, low: 10, medium: 5,  high: 2, veryHigh: 5 },
  { category: "โครงการ",   veryLow: 0, low: 2,  medium: 4,  high: 3, veryHigh: 0 },
  { category: "โครงการกันเงินเหลื่อมปี", veryLow: 4, low: 8, medium: 7, high: 2, veryHigh: 0 },
  { category: "กิจกรรม",   veryLow: 4, low: 1,  medium: 7,  high: 6, veryHigh: 0 },
  { category: "กระบวนงาน", veryLow: 1, low: 3,  medium: 9,  high: 10, veryHigh: 0 },
  { category: "IT/Non-IT", veryLow: 7, low: 2,  medium: 2,  high: 1,  veryHigh: 0 },
];
