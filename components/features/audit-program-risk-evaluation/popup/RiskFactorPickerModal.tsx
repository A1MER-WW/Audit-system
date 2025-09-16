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
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

type Option = { label: string; value: string };

export type RiskFactorPickerValues = {
  process?: string;
  dimension?: string; // เช่น "strategy" | "operation" | ...
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
  factorOptionsByDimension = {
    strategy: [
      "แผนยุทธศาสตร์/แผนปฏิบัติการ ไม่ถูกขับเคลื่อนครบทุกภารกิจ",
      "เป้าหมาย/ตัวชี้วัดไม่ชัดเจน ส่งผลให้ติดตามความสำเร็จคลาดเคลื่อน",
      "การจัดลำดับความสำคัญโครงการไม่สอดคล้องกับทรัพยากร",
      "การสื่อสารทิศทางยุทธศาสตร์ไม่ทั่วถึงทุกหน่วยงาน",
      "การติดตามทบทวนแผนไม่ต่อเนื่อง/ขาดวงรอบ PDCA",
    ],

    finance: [
      "การประมาณการงบประมาณคลาดเคลื่อน/การเบิกจ่ายล่าช้า",
      "ระเบียบการใช้จ่าย/หลักฐานประกอบไม่ครบถ้วน",
      "การควบคุมภายในด้านการเงินไม่เพียงพอ (การแยกหน้าที่/การอนุมัติ)",
      "การติดตามงบลงทุน/โครงการผูกพันไม่ใกล้ชิด",
      "ความถูกต้องของรายงานการเงิน/การกระทบยอดบัญชีล่าช้า",
    ],

    operations: [
      "การกำหนดแผน/ประเด็นติดตามโครงการยังไม่ครอบคลุมประเด็นสำคัญ",
      "ขาดทรัพยากรบุคคลช่วงพีกงาน ทำให้กิจกรรมล่าช้า",
      "ขั้นตอนงานซ้ำซ้อน/มาตรฐานกระบวนงานไม่สอดคล้องกันระหว่างหน่วย",
      "SLA/มาตรฐานการให้บริการไม่ชัดเจนหรือไม่ถูกติดตาม",
      "การจัดซื้อจัดจ้าง/โลจิสติกส์กระทบต่อกำหนดการดำเนินงาน",
    ],

    informationtechnology: [
      "ข้อมูลผลลัพธ์/สถานะไม่ครบถ้วน ทำให้วิเคราะห์คลาดเคลื่อน",
      "ระบบสารสนเทศรองรับการติดตามโครงการไม่เพียงพอ",
      "การสำรอง/กู้คืนข้อมูลและแผนความต่อเนื่องทางธุรกิจไม่พร้อม",
      "การกำกับสิทธิ์การเข้าถึง/ความมั่นคงปลอดภัยของข้อมูลไม่เข้มงวด",
      "การบูรณาการข้อมูลระหว่างระบบไม่สมบูรณ์",
    ],

    regulatorycompliance: [
      "การปฏิบัติตามระเบียบพัสดุ/การเบิกจ่ายไม่ครบถ้วน",
      "การสื่อสารแนวปฏิบัติ/ระเบียบใหม่ยังไม่ทั่วถึง",
      "เอกสารอนุมัติ/หลักฐานการปฏิบัติงานไม่เป็นปัจจุบัน",
      "การยื่นรายงานต่อหน่วยงานกำกับล่าช้าหรือไม่ครบถ้วน",
      "ขาดการติดตามข้อกำหนดเฉพาะทาง/กฎหมายใหม่",
    ],

    fraudrisk: [
      "การแยกหน้าที่ (SoD) ไม่ชัดเจน เปิดช่องทุจริต",
      "การตรวจทาน/อนุมัติไม่เป็นอิสระหรือไม่มีหลักฐานเพียงพอ",
      "การควบคุมเงินสด/ทรัพย์สินไม่รัดกุม",
      "ตัวชี้วัดผลงานสร้างแรงจูงใจให้บิดเบือนข้อมูล",
      "ช่องทางร้องเรียน/สืบสวนไม่ชัดเจนหรือไม่น่าเชื่อถือ",
    ],
  },
}: Props) {
  // === inner dialog: เลือกปัจจัยเสี่ยง ===
  const [openFactor, setOpenFactor] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [checked, setChecked] = React.useState<Record<string, boolean>>({});

  // เมื่อเปลี่ยนด้านความเสี่ยง เคลียร์ปัจจัยที่เลือกไว้เสมอ
  React.useEffect(() => {
    setChecked({});
    // เคลียร์ข้อความปัจจัยใน textarea ด้วย (เริ่มว่างจนกดเลือก)
    onChange({ riskFactor: "" });
  }, [values.dimension]); // eslint-disable-line react-hooks/exhaustive-deps

  const factors = React.useMemo(() => {
    const list = factorOptionsByDimension[values.dimension ?? ""] ?? [];
    if (!search.trim()) return list;
    const q = search.trim().toLowerCase();
    return list.filter((t) => t.toLowerCase().includes(q));
  }, [factorOptionsByDimension, values.dimension, search]);

  const allVisibleChecked =
    factors.length > 0 && factors.every((t) => checked[t]);

  const toggleAllVisible = (v: boolean) => {
    const next = { ...checked };
    factors.forEach((t) => (next[t] = v));
    setChecked(next);
  };

  const openFactorPicker = () => {
    if (!values.dimension) return; // ต้องเลือก "ด้าน" ก่อน
    setOpenFactor(true);
  };

  const confirmFactors = () => {
    const picked = Object.entries(checked)
      .filter(([, v]) => v)
      .map(([k]) => k);
    // รวมเป็นข้อความหลายบรรทัด (ตามภาพตัวอย่าง)
    onChange({ riskFactor: picked.join("\n\n") });
    setOpenFactor(false);
  };

  // เงื่อนไขปุ่มยืนยัน (dialog หลัก)
  const disabled =
    !values.process ||
    !values.dimension ||
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

            {/* ด้านความเสี่ยง (เต็มแนวกว้าง) */}
            <div className="space-y-1.5">
              <Label htmlFor="dimension">ด้านความเสี่ยง</Label>
              <Select
                value={values.dimension ?? ""}
                onValueChange={(v) => onChange({ dimension: v || undefined })}
              >
                <SelectTrigger
                  id="dimension"
                  aria-label="เลือกด้านความเสี่ยง"
                  className="w-full" // ⬅️ เต็มแนวกว้าง
                >
                  <SelectValue placeholder="เลือกด้านความเสี่ยง" />
                </SelectTrigger>
                <SelectContent className="w-[--radix-select-trigger-width]">
                  {dimensionOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* ปัจจัยเสี่ยง (แสดงเฉพาะข้อความที่เลือกแล้ว) + ปุ่ม picker */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="risk-factor">ปัจจัยเสี่ยง</Label>
                <Button
                  type="button"
                  onClick={openFactorPicker}
                  variant="default"
                  disabled={!values.dimension} // ต้องเลือก "ด้าน" ก่อน
                >
                  เลือกปัจจัยเสี่ยง
                </Button>
              </div>

              <Textarea
                id="risk-factor"
                rows={4}
                placeholder="ยังไม่ได้เลือกปัจจัย — กรุณากด 'เลือกปัจจัยเสี่ยง'"
                value={values.riskFactor ?? ""}
                onChange={(e) => onChange({ riskFactor: e.target.value })}
              />
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
              {values.dimension
                ? ` (${
                    dimensionOptions.find((d) => d.value === values.dimension)
                      ?.label ?? ""
                  })`
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
