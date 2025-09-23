"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ChevronDown, Check } from "lucide-react";

export type OuterTab = "summary" | "reorder" | "unitRanking";

type Props = {
  value: OuterTab;
  onChange: (v: OuterTab) => void;
  sortBy?: "index" | "score";
  sortLabel?: string;
  sortDir: "desc" | "asc"; // มากไปน้อย = desc, น้อยไปมาก = asc
  onSortByChange?: (by: "index" | "score") => void;
  onSortDirChange: (d: "desc" | "asc") => void;
  onClearSort?: () => void; // ฟังก์ชันรีเซ็ต sort กลับไปค่าเริ่มต้น
  className?: string;
  hideSortOnReorder?: boolean; // ซ่อนตัวเลือกเรียงเมื่ออยู่ในแท็บ reorder
  // Props สำหรับการเปรียบเทียบ (แทน showCompareTab)
  showCompareToggle?: boolean; // แสดง switch เปรียบเทียบสำหรับ Chief Inspector
  showCompareView?: boolean;
  onCompareToggle?: (enabled: boolean) => void;
  compareYear?: number;
  onCompareYearChange?: (year: number) => void;
  availableYears?: number[];
};

export default function SummaryToolbar({
  value,
  onChange,
  sortBy = "score",
  sortLabel,
  sortDir,
  onSortByChange,
  onSortDirChange,
  onClearSort,
  hideSortOnReorder = false,
  showCompareToggle = false,
  showCompareView = false,
  onCompareToggle,
  compareYear,
  onCompareYearChange,
  availableYears = [2567, 2566, 2565],
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-2 md:p-3">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* กลุ่มปุ่มเม็ด 3 โหมด */}
        <Tabs value={value} onValueChange={(v) => onChange(v as OuterTab)}>
          <TabsList
            className={cn(
              "h-auto bg-transparent p-0 gap-2",
              "flex flex-wrap justify-start"
            )}
          >
            {(
              [
                ["summary", "ผลการประเมินความเสี่ยงรวมทั้งหมด"],
                ["reorder", "ผลการจัดลำดับความเสี่ยง"],
                ["unitRanking", "ผลการประเมินความเสี่ยงระดับหน่วยงาน"],
              ] as const
            ).map(([k, label]) => (
              <TabsTrigger
                key={k}
                value={k}
                className={cn(
                  "px-3 py-2 text-sm rounded-lg bg-transparent text-foreground/80 hover:text-foreground",
                  "data-[state=active]:bg-indigo-600 data-[state=active]:text-white",
                  "border-0"
                )}
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* ตัวเลือกการเรียง - ซ่อนเมื่ออยู่ในแท็บ reorder */}
        <div className="flex items-center gap-2">
          {!(hideSortOnReorder && value === "reorder") && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-9 rounded-xl gap-2 px-3 text-sm"
                >
                  <span className="text-muted-foreground">
                    {sortBy === "index" ? "เรียงตามลำดับ" : (sortLabel || "เรียงตามคะแนน")}
                  </span>
                  <span className="font-medium">
                    {sortBy === "index" 
                      ? (sortDir === "desc" ? "มาก ไป น้อย" : "น้อย ไป มาก")
                      : (sortDir === "desc" ? "สูง ไป ต่ำ" : "ต่ำ ไป สูง")
                    }
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                {/* ตัวเลือกประเภทการเรียง */}
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                  ประเภทการเรียง
                </div>
                <DropdownMenuItem onClick={() => onSortByChange?.("index")}>
                  {sortBy === "index" && <Check className="mr-2 h-4 w-4" />}
                  เรียงตามลำดับ
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSortByChange?.("score")}>
                  {sortBy === "score" && <Check className="mr-2 h-4 w-4" />}
                  เรียงตามคะแนน
                </DropdownMenuItem>
                
                {/* Separator */}
                <div className="h-px bg-border my-1" />
                
                {/* ตัวเลือกทิศทางการเรียง */}
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                  ทิศทางการเรียง
                </div>
                <DropdownMenuItem onClick={() => onSortDirChange("desc")}>
                  {sortDir === "desc" && <Check className="mr-2 h-4 w-4" />}
                  {sortBy === "index" ? "มาก ไป น้อย" : "สูง ไป ต่ำ"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSortDirChange("asc")}>
                  {sortDir === "asc" && <Check className="mr-2 h-4 w-4" />}
                  {sortBy === "index" ? "น้อย ไป มาก" : "ต่ำ ไป สูง"}
                </DropdownMenuItem>
                
                {/* Clear Sort Button */}
                {onClearSort && (
                  <>
                    <div className="h-px bg-border my-1" />
                    <DropdownMenuItem onClick={onClearSort} className="text-muted-foreground">
                      รีเซ็ตการเรียง
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Switch เปรียบเทียบปี - แสดงเฉพาะใน Chief Inspector */}
          {showCompareToggle && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  id="compare-toggle"
                  checked={showCompareView}
                  onCheckedChange={onCompareToggle}
                />
                <Label htmlFor="compare-toggle" className="text-sm cursor-pointer">
                  เปรียบเทียบปีงบประมาณ
                </Label>
              </div>
              
              {/* ตัวเลือกปีเปรียบเทียบ - แสดงเมื่อเปิด switch */}
              {showCompareView && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">เปรียบเทียบกับปี:</span>
                  <select
                    className="border rounded px-2 py-1 text-sm h-9"
                    value={compareYear}
                    onChange={(e) => onCompareYearChange?.(Number(e.target.value))}
                  >
                    {availableYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
