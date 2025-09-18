// components/RiskFactorPickerDialog.tsx
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { factorOptionsByDimension as factorsData } from "@/lib/risk-factors-data";

// แปลงข้อมูลจาก factorsData เป็นรูปแบบ string[] เพื่อใช้ใน component นี้
const convertToStringArray = () => {
  const result: Record<string, string[]> = {};
  Object.entries(factorsData).forEach(([dimension, factors]) => {
    result[dimension] = factors.map(f => f.factor);
  });
  return result;
};
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Search, Eye, EyeOff, List, Grid } from "lucide-react";

type Option = { label: string; value: string };

export type RiskFactorPickerValues = {
  process?: string;
  dimension?: string[]; // เปลี่ยนเป็น array เพื่อรองรับหลายด้าน
  riskFactor?: string; // จะถูกเติมหลังเลือกจาก Dialog ปัจจัย
};

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;

  values: RiskFactorPickerValues;
  onChange: (patch: Partial<RiskFactorPickerValues>) => void;

  // เมื่อยืนยันใน Dialog หลัก
  onConfirm: () => void;

  // dropdown options
  processOptions?: Option[];
  dimensionOptions?: Option[];

  /**
   * แผนที่ "ด้านความเสี่ยง" -> รายการปัจจัยเสี่ยง
   * key = values.dimension (value ของ Select)
   * value = รายการข้อความปัจจัย (หลายบรรทัดได้)
   */
  factorOptionsByDimension?: Record<string, string[]>;
};

export function RiskFactorPickerDialog({
  open,
  onOpenChange,
  values,
  onChange,
  onConfirm,
  processOptions = [],
  dimensionOptions = [],
  factorOptionsByDimension = convertToStringArray(),
}: Props) {
  // === inner dialog: เลือกปัจจัยเสี่ยง ===
  const [openFactor, setOpenFactor] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [checked, setChecked] = React.useState<Record<string, boolean>>({});
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<'text' | 'cards'>('text');

  // เมื่อเปลี่ยนด้านความเสี่ยง เคลียร์ปัจจัยที่เลือกไว้เสมอ
  React.useEffect(() => {
    setChecked({});
    // เคลียร์ข้อความปัจจัยใน textarea ด้วย (เริ่มว่างจนกดเลือก)
    onChange({ riskFactor: "" });
  }, [values.dimension]); // eslint-disable-line react-hooks/exhaustive-deps

  const factors = React.useMemo(() => {
    // รวมปัจจัยจากทุกด้านที่เลือก
    const selectedDimensions = values.dimension ?? [];
    const allFactors: string[] = [];
    
    selectedDimensions.forEach(dim => {
      const list = factorOptionsByDimension[dim] ?? [];
      allFactors.push(...list);
    });
    
    // ลบรายการซ้ำ
    const uniqueFactors = Array.from(new Set(allFactors));
    
    if (!search.trim()) return uniqueFactors;
    const q = search.trim().toLowerCase();
    return uniqueFactors.filter((t: string) => t.toLowerCase().includes(q));
  }, [factorOptionsByDimension, values.dimension, search]);

  const allVisibleChecked =
    factors.length > 0 && factors.every((t) => checked[t]);

  const toggleAllVisible = (v: boolean) => {
    const next = { ...checked };
    factors.forEach((t) => (next[t] = v));
    setChecked(next);
  };

  const openFactorPicker = () => {
    if (!values.dimension?.length) return; // ต้องเลือกอย่างน้อย 1 ด้าน
    setOpenFactor(true);
  };

  const confirmFactors = () => {
    const picked = Object.entries(checked)
      .filter(([, v]) => v)
      .map(([k]) => k);
    
    // สร้างโครงสร้างข้อมูลที่แยกตาม dimension
    const selectedDimensions = values.dimension ?? [];
    const factorsByDimension: Record<string, string[]> = {};
    
    // แยกปัจจัยตาม dimension ที่มาจากไหน
    selectedDimensions.forEach(dim => {
      factorsByDimension[dim] = [];
      const factorsForDim = factorOptionsByDimension[dim] ?? [];
      picked.forEach(factor => {
        if (factorsForDim.includes(factor)) {
          factorsByDimension[dim].push(factor);
        }
      });
    });
    
    // รวมเป็นข้อความโดยมี marker บอกด้าน
    const formattedFactors = selectedDimensions.map(dim => {
      const factors = factorsByDimension[dim];
      if (factors.length === 0) return null;
      const dimLabel = dimensionOptions.find(d => d.value === dim)?.label || dim;
      return `[${dimLabel}]\n${factors.join('\n\n')}`;
    }).filter(Boolean).join('\n\n---\n\n');
    
    onChange({ riskFactor: formattedFactors });
    setOpenFactor(false);
  };

  // เงื่อนไขปุ่มยืนยัน (dialog หลัก)
  const disabled =
    !values.process ||
    !values.dimension?.length ||
    !(values.riskFactor ?? "").trim().length;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              เลือกปัจจัยเสี่ยงและเกณฑ์การประเมินความเสี่ยง
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* กระบวนงาน (เต็มแนวกว้าง) */}
            <div className="space-y-1.5">
              <Label htmlFor="process">กระบวนงาน</Label>
              <Select
                value={values.process ?? ""}
                onValueChange={(v) => onChange({ process: v || undefined })}
              >
                <SelectTrigger
                  id="process"
                  aria-label="เลือกกระบวนงาน"
                  className="w-full" // ⬅️ เต็มแนวกว้าง
                >
                  <SelectValue placeholder="เลือกกระบวนงาน" />
                </SelectTrigger>
                <SelectContent className="w-[--radix-select-trigger-width]">
                  {processOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* ด้านความเสี่ยง (เลือกได้หลายด้าน) */}
            <div className="space-y-3">
              <Label>ด้านความเสี่ยง (เลือกได้หลายด้าน)</Label>
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                {dimensionOptions.map((option) => {
                  const isChecked = (values.dimension ?? []).includes(option.value);
                  return (
                    <label
                      key={option.value}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors",
                        isChecked
                          ? "border-blue-300 bg-blue-50"
                          : "border-gray-200 bg-white hover:bg-gray-50"
                      )}
                    >
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={(checked) => {
                          const currentDimensions = values.dimension ?? [];
                          let newDimensions: string[];
                          
                          if (checked) {
                            // เพิ่มด้านใหม่
                            newDimensions = [...currentDimensions, option.value];
                          } else {
                            // ลบด้านออก
                            newDimensions = currentDimensions.filter(d => d !== option.value);
                          }
                          
                          onChange({ dimension: newDimensions });
                        }}
                      />
                      <span className="text-sm font-medium">{option.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* ปัจจัยเสี่ยง (แสดงเฉพาะข้อความที่เลือกแล้ว) + ปุ่ม picker */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label htmlFor="risk-factor">ปัจจัยเสี่ยง</Label>
                  {(() => {
                    const content = values.riskFactor ?? "";
                    if (content.trim()) {
                      // นับจำนวนปัจจัยที่เลือก
                      const sections = content.includes('[') && content.includes(']') 
                        ? content.split('---').length 
                        : 1;
                      const totalFactors = content.split('\n').filter(line => 
                        line.trim() && !line.includes('[') && !line.includes('---')
                      ).length;
                      
                      return (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          {totalFactors} รายการ จาก {sections} ด้าน
                        </span>
                      );
                    }
                    return null;
                  })()}
                </div>
                <div className="flex gap-2">
                  {values.riskFactor?.trim() && (
                    <>
                      <Button
                        type="button"
                        onClick={() => setViewMode(viewMode === 'text' ? 'cards' : 'text')}
                        variant="outline"
                        size="sm"
                      >
                        {viewMode === 'text' ? <Grid className="h-4 w-4" /> : <List className="h-4 w-4" />}
                      </Button>
                      {viewMode === 'text' && (
                        <Button
                          type="button"
                          onClick={() => setIsCollapsed(!isCollapsed)}
                          variant="outline"
                          size="sm"
                        >
                          {isCollapsed ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </Button>
                      )}
                    </>
                  )}
                  <Button
                    type="button"
                    onClick={openFactorPicker}
                    variant="default"
                    disabled={!values.dimension?.length} // ต้องเลือกอย่างน้อย 1 ด้าน
                  >
                    เลือกปัจจัยเสี่ยง
                  </Button>
                </div>
              </div>

              {(() => {
                const content = values.riskFactor ?? "";
                
                if (viewMode === 'cards' && content.trim()) {
                  // แสดงแบบ Card View
                  if (content.includes('[') && content.includes(']')) {
                    const sections = content.split('---').map(s => s.trim());
                    return (
                      <div className="max-h-[400px] overflow-y-auto space-y-3 border border-gray-200 rounded-lg p-3 bg-gray-50">
                        {sections.map((section, idx) => {
                          const lines = section.split('\n');
                          const headerLine = lines[0];
                          const factors = lines.slice(1).filter(line => line.trim());
                          const dimLabel = headerLine.match(/\[(.*?)\]/)?.[1];
                          
                          return (
                            <div key={idx} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                              <div className="px-3 py-2 bg-blue-50 border-b border-gray-200">
                                <div className="text-sm font-medium text-blue-700">{dimLabel}</div>
                                <div className="text-xs text-blue-600">{factors.length} รายการ</div>
                              </div>
                              <div className="p-3">
                                <div className="space-y-2">
                                  {factors.map((factor, factorIdx) => (
                                    <div key={factorIdx} className="text-sm text-gray-700 p-2 bg-gray-50 rounded border-l-2 border-blue-200">
                                      {factor}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  } else {
                    // ข้อมูลแบบเก่า - แสดงเป็น list
                    const factors = content.split('\n').filter(line => line.trim());
                    return (
                      <div className="max-h-[400px] overflow-y-auto space-y-2 border border-gray-200 rounded-lg p-3 bg-gray-50">
                        {factors.map((factor, idx) => (
                          <div key={idx} className="text-sm text-gray-700 p-2 bg-white rounded border-l-2 border-blue-200">
                            {factor}
                          </div>
                        ))}
                      </div>
                    );
                  }
                } else {
                  // แสดงแบบ Text View
                  let displayValue = content;
                  
                  if (isCollapsed && content.trim()) {
                    // แสดงแบบย่อ - เฉพาะหัวข้อด้านและจำนวนปัจจัย
                    if (content.includes('[') && content.includes(']')) {
                      const sections = content.split('---').map(s => s.trim());
                      displayValue = sections.map(section => {
                        const lines = section.split('\n');
                        const headerLine = lines[0];
                        const factorCount = lines.slice(1).filter(line => line.trim()).length;
                        return `${headerLine} (${factorCount} รายการ)`;
                      }).join('\n\n');
                    } else {
                      const factorCount = content.split('\n').filter(line => line.trim()).length;
                      displayValue = `รวม ${factorCount} รายการปัจจัยเสี่ยง (กดปุ่ม 👁 เพื่อดูรายละเอียด)`;
                    }
                  }
                  
                  return (
                    <Textarea
                      id="risk-factor"
                      rows={isCollapsed ? 4 : 8}
                      className={`${isCollapsed ? 'min-h-[100px] max-h-[150px]' : 'min-h-[200px] max-h-[400px]'} resize-y`}
                      placeholder="ยังไม่ได้เลือกปัจจัย — กรุณากด 'เลือกปัจจัยเสี่ยง'"
                      value={displayValue}
                      onChange={(e) => {
                        if (!isCollapsed) {
                          onChange({ riskFactor: e.target.value });
                        }
                      }}
                      readOnly={isCollapsed}
                    />
                  );
                }
              })()}
            </div>

            <Separator />

            {/* หมายเหตุ: นำออก/แก้ข้อความอธิบายได้ตามต้องการ; ในภาพตัวอย่างจะโชว์เฉพาะรายการที่เลือก */}
            {/* สามารถลบ section นี้ทิ้งได้ หากไม่ต้องการคำอธิบายคงที่ */}
            {/* <div className="space-y-4 text-sm text-muted-foreground">...</div> */}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              ยกเลิก
            </Button>
            <Button onClick={onConfirm} disabled={disabled}>
              ยืนยัน
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─────────────────────────────
           Dialog ย่อย: เลือกปัจจัยเสี่ยง (ตาม "ด้าน")
         ───────────────────────────── */}
      <Dialog open={openFactor} onOpenChange={setOpenFactor}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              เลือกปัจจัยเสี่ยง
              {values.dimension?.length
                ? ` (${values.dimension.map(d => 
                    dimensionOptions.find((opt) => opt.value === d)?.label ?? d
                  ).join(', ')})`
                : ""}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* search */}
            <div>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="ค้นหาเรื่องที่ตรวจสอบ"
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* เลือกทั้งหมด */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="check-all"
                checked={allVisibleChecked}
                onCheckedChange={(v) => toggleAllVisible(Boolean(v))}
              />
              <Label htmlFor="check-all" className="text-sm font-medium">
                เลือกทั้งหมด
              </Label>
            </div>

            {/* list */}
            <div className="max-h-[360px] space-y-3 overflow-auto pr-1">
              {factors.map((t) => (
                <label
                  key={t}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-xl border p-3",
                    checked[t]
                      ? "border-indigo-300 bg-indigo-50/60"
                      : "border-border bg-background"
                  )}
                >
                  <Checkbox
                    checked={!!checked[t]}
                    onCheckedChange={(v) =>
                      setChecked((prev) => ({ ...prev, [t]: Boolean(v) }))
                    }
                    className="mt-1"
                  />
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                    {t}
                  </p>
                </label>
              ))}

              {factors.length === 0 && (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  ไม่พบรายการปัจจัยสำหรับคำค้นนี้
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpenFactor(false)}>
              ยกเลิก
            </Button>
            <Button
              onClick={confirmFactors}
              disabled={!Object.values(checked).some(Boolean)}
            >
              ยืนยัน
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
