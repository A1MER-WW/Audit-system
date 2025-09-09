"use client";

import { useEffect, useState } from "react";
import useSWR, { mutate as globalMutate } from "swr";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowLeft, ChevronRight, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type RowMeta = {
  id: string;
  index: string;
  unit: string;
  category: string;
  topic: string;
  status: string;
};

type ScoreTriplet = { chance: number; impact: number; score: number };

type AssessmentForm = {
  rowId: string;
  year: number;
  groups: {
    id: string;
    title: string;
    items: { id: string; label: string; values: ScoreTriplet }[];
    total?: number;
  }[];
  totalScore: number;
  resultScore: number;
  composite: number;
  grade: "H" | "M" | "L";
  status: "กำลังประเมิน" | "ประเมินแล้ว";
};

type TabKey =
  | "unit"
  | "work"
  | "project"
  | "carry"
  | "activity"
  | "process"
  | "it";
type NavRow = { id: string; index: string; hasDoc?: boolean };

type ListApi = {
  rowsByTab: Partial<Record<TabKey, NavRow[]>>;
};

type LikertOption = { value: number; label: string; description: string };
type ScaleApi = {
  message: string;
  data: { likelihood: LikertOption[]; impact: LikertOption[] };
};

const fetcher = async (url: string) => {
  const r = await fetch(url);
  const j = await r.json().catch(() => ({}));
  if (!r.ok) {
    const err: any = new Error(j?.message || "error");
    err.status = r.status;
    throw err;
  }
  return j;
};

export default function RiskAssessmentFormPage({ id }: { id: string }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const { data: scaleRes } = useSWR<ScaleApi>("/api/risk-scales", fetcher);
  const LIKELIHOOD_OPTIONS = scaleRes?.data?.likelihood ?? [];
  const IMPACT_OPTIONS = scaleRes?.data?.impact ?? LIKELIHOOD_OPTIONS;
  const { data: metaRes } = useSWR<{ message: string; data: RowMeta }>(
    `/api/risk-assessment/${id}`,
    fetcher
  );

  const { data: listRes } = useSWR<ListApi>(
    "/api/risk-assessment?year=2568",
    fetcher
  );

  const flatLeafRows: NavRow[] = listRes?.rowsByTab
    ? (
        [
          ...(listRes.rowsByTab.work ?? []),
          ...(listRes.rowsByTab.project ?? []),
          ...(listRes.rowsByTab.carry ?? []),
          ...(listRes.rowsByTab.activity ?? []),
          ...(listRes.rowsByTab.process ?? []),
          ...(listRes.rowsByTab.unit ?? []),
          ...(listRes.rowsByTab.it ?? []),
        ] as NavRow[]
      )
        .filter((r) => !String(r.index).includes(".") && (r.hasDoc ?? true))
        .sort((a, b) => compareIndex(a.index, b.index))
    : [];

  // หา index ของหัวข้อปัจจุบัน และคำนวณก่อนหน้า/ถัดไป
  const currentIdx = flatLeafRows.findIndex((r) => r.id === id);
  const prevId = currentIdx > 0 ? flatLeafRows[currentIdx - 1]?.id : undefined;
  const nextId =
    currentIdx >= 0 && currentIdx < flatLeafRows.length - 1
      ? flatLeafRows[currentIdx + 1]?.id
      : undefined;

  const meta = metaRes?.data;
  // ฟอร์มการประเมิน (ครั้งแรกจะ 404)
  const {
    data: formRes,
    error: formErr,
    isLoading: formLoading,
    mutate,
  } = useSWR<{ message: string; data: AssessmentForm }>(
    `/api/risk-assessment/${id}/form`,
    fetcher,
    { shouldRetryOnError: false }
  );
  const form = formRes?.data;

  // ถ้าอยากกดปุ่ม "เริ่มประเมิน" เอง ให้ลบ useEffect ด้านล่าง แล้วแสดงปุ่มแทน
  // ที่นี่ผมทำแบบ auto-create เมื่อยังไม่เคยประเมิน (404)
  useEffect(() => {
    (async () => {
      if (formErr && (formErr as any).status === 404) {
        const res = await fetch(`/api/risk-assessment/${id}/form`, {
          method: "POST",
        });
        if (res.ok) await mutate();
      }
    })();
  }, [formErr, mutate, id]);

  // อัปเดตค่าของ item (chance/impact) แล้วคำนวณ score ทันทีบน client
  function setItemValue(
    groupIndex: number,
    itemIndex: number,
    patch: Partial<ScoreTriplet>
  ) {
    if (!form) return;
    const next: AssessmentForm = structuredClone(form);
    const item = next.groups[groupIndex].items[itemIndex];
    const chance = patch.chance ?? item.values.chance ?? 0;
    const impact = patch.impact ?? item.values.impact ?? 0;
    item.values.chance = chance;
    item.values.impact = impact;
    item.values.score = chance * impact;

    next.groups[groupIndex].total = next.groups[groupIndex].items.reduce(
      (s, it) => s + (it.values.score ?? 0),
      0
    );
    next.totalScore = next.groups.reduce((s, g) => s + (g.total ?? 0), 0);
    next.resultScore = next.totalScore;

    const max = next.groups.reduce((s, g) => s + g.items.length, 0) * 25;
    next.composite = max ? Math.round((next.resultScore / max) * 100) : 0;

    mutate({ message: "OK", data: next }, { revalidate: false });
  }

  async function save() {
    if (!form) return;
    setSaving(true);
    try {
      await toast.promise(
        (async () => {
          const r = await fetch(`/api/risk-assessment/${id}/form`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
          });
          const j = await r.json();
          if (!r.ok) throw new Error(j?.message || "บันทึกไม่สำเร็จ");

          await mutate(j, { revalidate: false });

          await globalMutate(
            (key: string) =>
              typeof key === "string" &&
              key.startsWith("/api/risk-assessment?"),
            undefined,
            { revalidate: true }
          );
        })(),
        {
          loading: "กำลังบันทึก...",
          success: "บันทึกสำเร็จ",
          error: (err) => err?.message || "เกิดข้อผิดพลาดระหว่างบันทึก",
        }
      );
    } finally {
      setSaving(false);
    }
  }

  const baseMax = form
    ? form.groups.reduce((s, g) => s + g.items.length, 0) * 25
    : 0;

  function LikertModal({
    open,
    onOpenChange,
    title,
    name,
    value,
    onSelect,
    options,
  }: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    title: string;
    name: string;
    value: number;
    onSelect: (v: number) => void;
    options: LikertOption[];
  }) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className={cn(
            "sm:max-w-[720px] max-h-[80vh] overflow-y-auto",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
            "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95"
          )}
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>แตะเพื่อเลือกระดับคะแนน</DialogDescription>
          </DialogHeader>

          <RadioGroup
            value={String(value || 0)}
            onValueChange={(v) => {
              onSelect(Number(v));
              onOpenChange(false);
            }}
            className="space-y-3"
          >
            {options.map((opt) => {
              const id = `${name}-${opt.value}`;
              const active = value === opt.value;
              return (
                <Label
                  key={id}
                  htmlFor={id}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition",
                    active
                      ? "bg-primary/10 border-primary/40 shadow-sm"
                      : "hover:bg-muted/40"
                  )}
                >
                  <RadioGroupItem
                    id={id}
                    value={String(opt.value)}
                    className="mt-1.5 h-5 w-5 shrink-0"
                  />
                  <div className="grid grid-cols-[auto,1fr] gap-3 w-full">
                    <div className="font-semibold text-foreground whitespace-nowrap">
                      {opt.label}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line break-words">
                      {opt.description}
                    </p>
                  </div>
                </Label>
              );
            })}
          </RadioGroup>
        </DialogContent>
      </Dialog>
    );
  }

  function ScorePicker({
    label,
    name,
    value,
    onChange,
    options,
  }: {
    label: string;
    name: string;
    value: number;
    onChange: (v: number) => void;
    options: LikertOption[];
  }) {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button
          variant="outline"
          className="w-20 justify-center"
          onClick={() => setOpen(true)}
        >
          {value || "-"}
        </Button>

        <LikertModal
          open={open}
          onOpenChange={setOpen}
          title={label}
          name={name}
          value={value || 0}
          onSelect={onChange}
          options={options}
        />
      </>
    );
  }

  function compareIndex(a: string, b: string) {
    const A = a.split(".").map(Number);
    const B = b.split(".").map(Number);
    if (A[0] !== B[0]) return A[0] - B[0];
    return (A[1] ?? 0) - (B[1] ?? 0);
  }

  return (
    <div className="w-full h-full p-6 space-y-6">
      {/* Top bar */}
      <div className="flex items-center gap-2 text-muted-foreground">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          aria-label="ย้อนกลับ"
          onClick={() => {
            if (typeof window !== "undefined" && window.history.length > 1) {
              router.back();
            } else {
              router.push("/risk-assessment");
            }
          }}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <span className="text-sm">
          การประเมินความเสี่ยงและการจัดลำดับความเสี่ยง
        </span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-sm text-foreground font-medium">
          แบบประเมินความเสี่ยง
        </span>
      </div>

      {/* Header meta */}
      <Card className="border-dashed">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">ลำดับ</TableHead>
                <TableHead>หน่วยงาน</TableHead>
                <TableHead>หมวดหมู่</TableHead>
                <TableHead>หัวข้องานตรวจสอบ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>{meta?.index ?? "-"}</TableCell>
                <TableCell>{meta?.unit ?? "-"}</TableCell>
                <TableCell>{meta?.category ?? "-"}</TableCell>
                <TableCell className="text-primary">
                  {meta?.topic ?? "-"}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* ปุ่มนำทางหัวข้อ */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="relative h-12 w-full rounded-xl"
          disabled={!prevId}
          onClick={() =>
            prevId && router.push(`/risk-assessment-form/${prevId}`)
          }
        >
          <ChevronRight className="absolute left-4 h-5 w-5 rotate-180" />
          <span className="mx-auto">หัวข้อก่อนหน้า</span>
        </Button>

        <Button
          variant="outline"
          className="relative h-12 w-full rounded-xl"
          disabled={!nextId}
          onClick={() =>
            nextId && router.push(`/risk-assessment-form/${nextId}`)
          }
        >
          <span className="mx-auto">หัวข้อถัดไป</span>
          <ChevronRight className="absolute right-4 h-5 w-5" />
        </Button>
      </div>

      {/* ถ้ายังโหลดฟอร์มอยู่ */}
      {formLoading && (
        <div className="text-sm text-muted-foreground">
          กำลังโหลดแบบประเมิน...
        </div>
      )}

      {/* ถ้ายังไม่มีฟอร์มและกำลังสร้าง */}
      {formErr && (formErr as any).status === 404 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            ยังไม่เคยประเมินสำหรับหัวข้อนี้ — กำลังเตรียมแบบฟอร์มว่าง...
          </div>
        </div>
      )}

      {/* ฟอร์ม (จะแสดงเมื่อมี form แล้ว) */}
      {form && (
        <>
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-lg">แบบประเมินความเสี่ยง</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Accordion
                type="multiple"
                defaultValue={form.groups.map((g) => g.id)}
                className="w-full"
              >
                {form.groups.map((group, gi) => (
                  <AccordionItem
                    key={group.id}
                    value={group.id}
                    className="border rounded-xl px-4"
                  >
                    <AccordionTrigger className="text-left py-4 font-semibold">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                          {group.id}
                        </span>
                        {group.title}
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({group.items.length})
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 pb-4">
                        {group.items.map((it, ii) => (
                          <div key={it.id} className="rounded-xl border p-4">
                            <div className="flex items-start justify-between gap-4">
                              <p className="text-sm leading-6 flex-1">
                                {it.label}
                              </p>
                              <div className="grid grid-cols-3 gap-2 w-[300px] text-center">
                                {/* โอกาส */}
                                <div>
                                  <div className="text-xs text-muted-foreground">
                                    โอกาส
                                  </div>
                                  <ScorePicker
                                    label="โอกาส"
                                    name={`${group.id}-${it.id}-chance`}
                                    value={it.values.chance ?? 0}
                                    onChange={(v) =>
                                      setItemValue(gi, ii, { chance: v })
                                    }
                                    options={LIKELIHOOD_OPTIONS}
                                  />
                                </div>
                                {/* ผลกระทบ */}
                                <div>
                                  <div className="text-xs text-muted-foreground">
                                    ผลกระทบ
                                  </div>
                                  <ScorePicker
                                    label="ผลกระทบ"
                                    name={`${group.id}-${it.id}-impact`}
                                    value={it.values.impact ?? 0}
                                    onChange={(v) =>
                                      setItemValue(gi, ii, { impact: v })
                                    }
                                    options={IMPACT_OPTIONS}
                                  />
                                </div>
                                {/* คะแนน */}
                                <div>
                                  <div className="text-xs text-muted-foreground">
                                    คะแนน
                                  </div>

                                  {(() => {
                                    const noPick =
                                      (it.values?.chance ?? 0) === 0 &&
                                      (it.values?.impact ?? 0) === 0;

                                    return (
                                      <Input
                                        readOnly
                                        value={
                                          noPick
                                            ? "-"
                                            : String(it.values.score ?? 0)
                                        }
                                        className="text-center"
                                      />
                                    );
                                  })()}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <Separator />

              {/* ผลรวม */}
              <div className="space-y-4">
                <div className="rounded-lg bg-blue-50 p-3 text-sm font-medium">
                  ผลการประเมิน
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-foreground">คะแนน</div>
                  <div className="flex items-center gap-8">
                    <StatStack
                      label="คะแนนเต็มที่ประเมิน"
                      help="(ระดับโอกาสสูงสุด 5 × ผลกระทบสูงสุด 5) × จำนวนปัจจัยเสี่ยงทั้งหมด"
                      value={baseMax}
                    />
                    <StatStack
                      label="ผลรวมคะแนนประเมิน"
                      help="ผลรวมคะแนนของทุกปัจจัย (chance × impact)"
                      value={form.resultScore}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-foreground">
                    คะแนนประเมิน (Composite Score)
                  </div>
                  <div className="flex items-center">
                    <Input
                      readOnly
                      value={form.composite}
                      className="h-8 w-20 text-center"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button onClick={save}>บันทึก</Button>
          </div>
        </>
      )}
    </div>
  );
}

/* ---------------- UI ย่อย ---------------- */
function NumberSelect({
  value,
  onValueChange,
}: {
  value: number;
  onValueChange: (v: number) => void;
}) {
  return (
    <Select
      value={String(value)}
      onValueChange={(v) => onValueChange(Number(v))}
    >
      <SelectTrigger className="w-20 mx-auto">
        <SelectValue placeholder="-" />
      </SelectTrigger>
      <SelectContent>
        {[0, 1, 2, 3, 4, 5].map((n) => (
          <SelectItem key={n} value={String(n)}>
            {n}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function StatStack({
  label,
  value,
  help,
}: {
  label: string;
  value: number | string;
  help?: string;
}) {
  return (
    <div className="min-w-[180px] flex flex-col items-end text-right">
      <div className="text-sm text-muted-foreground flex items-center gap-1">
        {label}
        {help ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent className="max-w-[22rem] text-xs">
                {help}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : null}
      </div>
      <Input readOnly value={value} className="mt-2 h-8 w-24 text-center" />
    </div>
  );
}
