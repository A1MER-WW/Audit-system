"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown, Check } from "lucide-react";

export type OuterTab = "summary" | "reorder" | "unitRanking";

type Props = {
  value: OuterTab;
  onChange: (v: OuterTab) => void;
  sortLabel?: string;
  sortDir: "desc" | "asc";               // มากไปน้อย = desc, น้อยไปมาก = asc
  onSortDirChange: (d: "desc" | "asc") => void;
  className?: string;
};

export default function SummaryToolbar({
  value,
  onChange,
  sortLabel = "เรียงตามคะแนนประเมิน",
  sortDir,
  onSortDirChange,
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
            {([
              ["summary", "ผลการประเมินความเสี่ยงรวมทั้งหมด"],
              ["reorder", "ผลการจัดลำดับความเสี่ยง"],
              ["unitRanking", "ผลการประเมินความเสี่ยงระดับหน่วยงาน"],
            ] as const).map(([k, label]) => (
              <TabsTrigger
                key={k}
                value={k}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-medium border",
                  "data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 data-[state=active]:border-indigo-200",
                  "data-[state=inactive]:bg-white data-[state=inactive]:text-muted-foreground"
                )}
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* ตัวเลือกเรียงคะแนน */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-9 rounded-xl gap-2 px-3 text-sm"
            >
              <span className="text-muted-foreground">{sortLabel}</span>
              <span className="font-medium">
                {sortDir === "desc" ? "มาก ไป น้อย" : "น้อย ไป มาก"}
              </span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={() => onSortDirChange("desc")}>
              {sortDir === "desc" && <Check className="mr-2 h-4 w-4" />}
              มาก ไป น้อย
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortDirChange("asc")}>
              {sortDir === "asc" && <Check className="mr-2 h-4 w-4" />}
              น้อย ไป มาก
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
