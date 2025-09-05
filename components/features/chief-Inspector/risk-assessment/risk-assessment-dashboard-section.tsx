"use client";

import { useMemo, useState } from "react";
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
  key: "veryHigh" | "high" | "medium" | "low" | "veryLow";
  name: string;
  value: number;
  color: string;
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



/** ---------- Main Section ---------- */
type DashboardProps = {
  year: number;
  statusText?: string;
  donut?: RiskSlice[];
  stacked?: StackedRow[];
  matrix?: MatrixRow[];
  onGradeClick?: (grade: "H" | "M" | "L") => void;
  onCategoryClick?: (category: string) => void;
  activeFilter?: {
    grade?: "H" | "M" | "L";
    category?: string;
  };
};

export default function DashboardSection({
  year,
  statusText,
  donut = defaultDonut,
  stacked = defaultStacked,
  matrix = defaultMatrix,
  onGradeClick,
  onCategoryClick,
  activeFilter,
}: DashboardProps) {
  const [showMatrixReport, setShowMatrixReport] = useState(true);

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
              <span className="text-amber-600">{statusText ?? "-"}</span>
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
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={donut}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={70}
                        outerRadius={110}
                        strokeWidth={2}
                      >
                        {donut.map((d) => (
                          <Cell 
                            key={d.key} 
                            fill={d.color}
                            style={{ cursor: onGradeClick ? 'pointer' : 'default' }}
                            onClick={() => {
                              if (!onGradeClick) return;
                              const grade = d.key === "veryHigh" ? "H" : 
                                          d.key === "high" ? "M" : 
                                          d.key === "medium" ? "L" : undefined;
                              if (grade) onGradeClick(grade);
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
                </div>

                {/* legend แบบ 2 คอลัมน์ */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  {donut.map((d) => {
                    const grade = d.key === "veryHigh" ? "H" : 
                                d.key === "high" ? "M" : 
                                d.key === "medium" ? "L" : undefined;
                    const isActive = grade === activeFilter?.grade;
                    
                    return (
                      <div 
                        key={d.key} 
                        className={cn(
                          "flex items-center gap-2",
                          onGradeClick && "cursor-pointer hover:bg-gray-50 p-1 rounded",
                          isActive && "bg-gray-100"
                        )}
                        onClick={() => grade && onGradeClick?.(grade)}
                      >
                        <span
                          className="inline-block h-3 w-3 rounded-sm"
                          style={{ backgroundColor: d.color }}
                          aria-hidden
                        />
                        <span className="text-muted-foreground">{d.name}</span>
                        <span className="ml-auto font-medium">{d.value}</span>
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
                        name="High Risk (H)" 
                        fill={colors.veryHigh}
                        fillOpacity={activeFilter?.grade === "H" || !activeFilter?.grade ? 1 : 0.3}
                        onClick={(data) => {
                          if (!onGradeClick || !onCategoryClick || !data?.name) return;
                          onGradeClick("H");
                          onCategoryClick(data.name);
                        }}
                        style={{ cursor: (onGradeClick && onCategoryClick) ? 'pointer' : 'default' }}
                      />
                      <Bar 
                        dataKey="high" 
                        stackId="a" 
                        name="Medium Risk (M)" 
                        fill={colors.high}
                        fillOpacity={activeFilter?.grade === "M" || !activeFilter?.grade ? 1 : 0.3}
                        onClick={(data) => {
                          if (!onGradeClick || !onCategoryClick || !data?.name) return;
                          onGradeClick("M");
                          onCategoryClick(data.name);
                        }}
                        style={{ cursor: (onGradeClick && onCategoryClick) ? 'pointer' : 'default' }}
                      />
                      <Bar 
                        dataKey="medium" 
                        stackId="a" 
                        name="Low Risk (L)" 
                        fill={colors.medium}
                        fillOpacity={activeFilter?.grade === "L" || !activeFilter?.grade ? 1 : 0.3}
                        onClick={(data) => {
                          if (!onGradeClick || !onCategoryClick || !data?.name) return;
                          onGradeClick("L");
                          onCategoryClick(data.name);
                        }}
                        style={{ cursor: (onGradeClick && onCategoryClick) ? 'pointer' : 'default' }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* -------- รายงานเมทริกซ์ความเสี่ยง (Toggle) -------- */}
      {showMatrixReport && (
        <MatrixReport data={matrix} />
      )}
    </section>
  );
}

/** ---------- Matrix Report Component ---------- */
function MatrixReport({ data }: { data: MatrixRow[] }) {
  const columns = [
    { key: "veryLow",  label: "น้อยที่สุด (1)",  color: colorsScale.veryLow },
    { key: "low",      label: "น้อย (2)",       color: colorsScale.low },
    { key: "medium",   label: "ปานกลาง (3)",    color: colorsScale.medium },
    { key: "high",     label: "มาก (4)",        color: colorsScale.high },
    { key: "veryHigh", label: "มากที่สุด (5)",  color: colorsScale.veryHigh },
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
                  <div key={col.key} className="p-3 text-center text-sm font-medium border-b">
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
                  <div className="p-2.5 text-sm">{row.category}</div>

                  {/* Cells */}
                  {columns.map(col => {
                    const v = row[col.key];
                    return (
                      <div key={col.key} className="p-2.5">
                        <div
                          className={cn(
                            "h-10 rounded-md flex items-center justify-center text-sm font-medium",
                            "border",
                            "transition-colors"
                          )}
                          style={{
                            // ใช้สีเฉดตามคอลัมน์และความเข้มจากค่า
                            backgroundColor: `color-mix(in oklab, ${col.color} ${Math.min(92, Math.max(14, Math.round((v / Math.max(1, v) ) * 72 + 14)))}%, white)`,
                            borderColor: `color-mix(in oklab, ${col.color} 35%, transparent)`,
                          }}
                        >
                          {v}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}

              {/* Footer ระดับ (แนวตั้งเหมือนรูป) */}
              <div className="grid grid-cols-[180px_repeat(5,1fr)] border-t">
                <div className="p-3 text-sm text-muted-foreground" />
                {columns.map(col => (
                  <div key={col.key} className="p-3 text-center text-sm text-muted-foreground">
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
const colors = {
  veryHigh: "#EF4444", // red-500 - High Risk (H)
  high: "#F97316",     // orange-500 - Medium Risk (M) 
  medium: "#0EA5E9",   // sky-500 - Low Risk (L)
  low: "#10B981",      // emerald-500 - Not used
  veryLow: "#3B82F6",  // blue-500 - Not used
};

// เฉดสีหลักสำหรับเมทริกซ์ (ใช้กับ color-mix ด้านบน)
const colorsScale = {
  veryHigh: "oklch(0.65 0.22 27)",   // โทนแดง - High Risk (H)
  high:     "oklch(0.74 0.18 50)",   // โทนส้ม - Medium Risk (M)
  medium:   "oklch(0.70 0.15 230)",  // โทนฟ้า - Low Risk (L)
  low:      "oklch(0.80 0.10 150)",  // โทนเขียว - Not used
  veryLow:  "oklch(0.70 0.13 265)",  // โทนน้ำเงิน - Not used
} as const;

/** ---------- Mock data (แก้ตามจริงได้) ---------- */
const defaultDonut: RiskSlice[] = [
  { key: "veryHigh", name: "High Risk (H)",     value: 37, color: colors.veryHigh },
  { key: "high",     name: "Medium Risk (M)",   value: 44, color: colors.high },
  { key: "medium",   name: "Low Risk (L)",      value: 30, color: colors.medium },
];

const defaultStacked: StackedRow[] = [
  { name: "หน่วยงาน",             veryHigh: 10, high: 15, medium: 8,  low: 0, veryLow: 0 },
  { name: "งาน",                  veryHigh: 8,  high: 12, medium: 10, low: 0, veryLow: 0 },
  { name: "โครงการ",              veryHigh: 6,  high: 8,  medium: 6,  low: 0, veryLow: 0 },
  { name: "โครงการกันเงินเหลือมปี", veryHigh: 4,  high: 6,  medium: 4,  low: 0, veryLow: 0 },
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
