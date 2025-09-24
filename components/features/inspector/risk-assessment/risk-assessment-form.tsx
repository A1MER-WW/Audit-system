"use client";

import { JSX, useEffect, useMemo, useState } from "react";
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

/** ✅ ใช้ hook แบบเดียวกับหน้าบน */
import {
  useAnnualEvaluations,
  ApiAnnualEvaluation,
} from "@/hooks/useAnnualEvaluations";

/** ---------- Types ---------- */
type LikertModalProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  name: string;
  value: number;
  onSelect: (v: number) => void;
  options: LikertOption[];
  levels?: Levels;
  context?: { dimension: string; item: string };
};

type RowMeta = {
  id: string;
  index: string;
  unit: string;
  category: string;
  topic: string;
};

type ScoreTriplet = { chance: number; impact: number; score: number };

type Levels = {
  least?: string;
  low?: string;
  medium?: string;
  high?: string;
  highest?: string;
};

type AssessmentForm = {
  rowId: string;
  year: number;
  groups: {
    id: string;
    title: string;
    items: {
      id: string;
      label: string;
      categories?: string[];
      levels?: Levels;
      values: ScoreTriplet;
    }[];
    total?: number;
  }[];
  totalScore: number;
  resultScore: number;
  composite: number;
  grade: "N" | "L" | "M" | "H" | "E";
  status: "กำลังประเมิน" | "ประเมินแล้ว";
};

type LikertOption = { value: number; label: string; description: string };

/** ---------- ค่าคงที่/Helper ---------- */
const LABEL_BY_VALUE: Record<number, string> = {
  1: "น้อยที่สุด",
  2: "น้อย",
  3: "ปานกลาง",
  4: "มาก",
  5: "มากที่สุด",
};

const fetcher = async (url: string) => {
  const r = await fetch(url);
  const j = await r.json().catch(() => ({}));
  if (!r.ok) {
    const err = new Error(j?.message || "error") as Error & { status?: number };
    err.status = r.status;
    throw err;
  }
  return j;
};





/** ---------- สร้าง Groups และ children (ให้ตรงกับหน้าบน) ---------- */
type LeafRow = {
  id: string;
  index: string; // 1.1, 1.2 ...
  unit: string;
  topic: string;
  categoryName: string;
};

function buildGroupsForNav(evals: ApiAnnualEvaluation[]) {
  const groups: { parentId: string; children: LeafRow[] }[] = [];

  evals.forEach((a) => {
    a.RiskEvaluations.forEach((re) => {
      re.auditTopics.forEach((t) => {
        const children: LeafRow[] = t.DepartmentAssessmentScore.map((ds) => ({
          id: `a${a.id}-c${re.id}-t${t.id}-d${ds.department.id}`,
          index: "", // จะเซ็ตทีหลังตามลำดับ
          unit: ds.department.departmentName,
          topic: t.auditTopic,
          categoryName: re.category.name,
        }));
        groups.push({
          parentId: `group:a${a.id}-c${re.id}-t${t.id}`,
          children,
        });
      });
    });
  });

  // ใส่เลขลำดับ 1, 2, ... และลูก 1.1, 1.2 ...
  groups.forEach((g, gi) => {
    const parentIndex = `${gi + 1}`;
    g.children.forEach((c, cj) => {
      c.index = `${parentIndex}.${cj + 1}`;
    });
  });

  return groups;
}

/** ---------- หน้าแบบฟอร์ม ---------- */
export default function RiskAssessmentFormPage({ id }: { id: string }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  /** สเกลคะแนน */
  const { data: scaleRes } = useSWR<{
    message: string;
    data: {
      likelihood: LikertOption[];
      impact: LikertOption[];
      perDimension?: Record<string, unknown>[];
    };
  }>("/api/risk-scales", fetcher);

  const LIKELIHOOD_OPTIONS = scaleRes?.data?.likelihood ?? [];
  const IMPACT_OPTIONS = scaleRes?.data?.impact ?? LIKELIHOOD_OPTIONS;
  const PER_DIMENSION = scaleRes?.data?.perDimension ?? [];
  const MAX_CHANCE = Math.max(
    0,
    ...LIKELIHOOD_OPTIONS.map((o) => o.value ?? 0)
  );
  const MAX_IMPACT = Math.max(0, ...IMPACT_OPTIONS.map((o) => o.value ?? 0));

  function getOptionsFor(
    dimKey: string,
    kind: "likelihood" | "impact"
  ): LikertOption[] {
    const d = (PER_DIMENSION as Array<{ key: string; likelihood?: LikertOption[]; impact?: LikertOption[]; options?: LikertOption[] }>).find((x) => x.key === dimKey);
    if (kind === "likelihood" && d?.likelihood?.length) return d.likelihood;
    if (kind === "impact" && d?.impact?.length) return d.impact;
    if (d?.options?.length) return d.options;
    return kind === "likelihood" ? LIKELIHOOD_OPTIONS : IMPACT_OPTIONS;
  }

  /** ✅ ใช้ evaluations เพื่อหา meta/prev/next (ตรงกับหน้าบน) */
  const { annualEvaluations, loading: navLoading } = useAnnualEvaluations({
    fiscalYear: 2568, // ปรับถ้าจะส่ง year เป็น query ได้
  });

  const leafRows: LeafRow[] = useMemo(() => {
    const groups = buildGroupsForNav(annualEvaluations);
    return groups.flatMap((g) => g.children);
  }, [annualEvaluations]);

  const currentIdx = leafRows.findIndex((r) => r.id === id);
  const prevId = currentIdx > 0 ? leafRows[currentIdx - 1]?.id : undefined;
  const nextId =
    currentIdx >= 0 && currentIdx < leafRows.length - 1
      ? leafRows[currentIdx + 1]?.id
      : undefined;

  /** meta ของบรรทัดปัจจุบัน (แสดงบนหัวตาราง) */
  const meta: RowMeta | undefined = useMemo(
    () =>
      currentIdx >= 0
        ? {
            id,
            index: leafRows[currentIdx].index,
            unit: leafRows[currentIdx].unit,
            category: leafRows[currentIdx].categoryName,
            topic: leafRows[currentIdx].topic,
          }
        : undefined,
    [currentIdx, id, leafRows]
  );

  /** Fallback: ดึง meta จาก API เดิมถ้าไม่เจอใน annual evaluations */
  const { data: fallbackMetaRes } = useSWR<{ message: string; data: RowMeta }>(
    !meta ? `/api/risk-assessment/${id}` : null,
    fetcher,
    { shouldRetryOnError: false }
  );
  
  const effectiveMeta = meta || fallbackMetaRes?.data;

  /** category ปัจจุบัน (ใช้ filter ข้อคำถามรายมิติ) */
  const currentCategory = effectiveMeta?.category || "";
  
  // Debug info สำหรับตรวจสอบ
  useEffect(() => {
    console.log("🔍 Risk Assessment Form Debug:");
    console.log("  📝 Form ID:", id);
    console.log("  📊 leafRows count:", leafRows.length);
    console.log("  📍 currentIdx:", currentIdx);
    console.log("  📋 meta:", meta);
    console.log("  📋 fallbackMeta:", fallbackMetaRes?.data);
    console.log("  📋 effectiveMeta:", effectiveMeta);
    console.log("  🏷️ currentCategory:", currentCategory);
    // จะ log form status ด้านล่าง
    if (leafRows.length > 0) {
      console.log("  📝 First few leafRows:", leafRows.slice(0, 3));
    }
  }, [id, leafRows, currentIdx, meta, currentCategory, effectiveMeta, fallbackMetaRes?.data]);

  /** ฟอร์ม (อ่าน/สร้าง/บันทึก) */
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

  useEffect(() => {
    (async () => {
      if (formErr && 'status' in formErr && (formErr as { status: number }).status === 404) {
        const res = await fetch(`/api/risk-assessment/${id}/form`, {
          method: "POST",
        });
        if (res.ok) await mutate();
      }
    })();
  }, [formErr, mutate, id]);

  // Debug form loading status  
  useEffect(() => {
    if (formErr) {
      console.log("❌ Form Error:", formErr);
      if ('status' in formErr && (formErr as { status: number }).status === 404) {
        console.log("📝 Form not found, will try to create new one");
      }
    }
    if (form) {
      console.log("✅ Form loaded successfully");
      console.log("📊 Form groups count:", form.groups?.length);
      console.log("🎯 Current category for filtering:", currentCategory);
      
      // Debug visible groups calculation
      if (form.groups) {
        form.groups.forEach((g) => {
          const visibleItems = g.items.filter((it) => {
            const cats = it.categories ?? [];
            if (!cats.length) return true;
            if (!currentCategory) return true;
            if (currentCategory === "IT/Non-IT") {
              return (
                cats.includes("IT/Non-IT") ||
                cats.includes("IT") ||
                cats.includes("Non-IT")
              );
            }
            return cats.includes(currentCategory);
          });
          console.log(`  📂 Group ${g.id} (${g.title}): ${visibleItems.length}/${g.items.length} items visible`);
        });
      }
    }
  }, [formErr, form, currentCategory]);

  // ✅ โหลดค่าจาก localStorage เมื่อฟอร์มโหลดเสร็จแล้ว (เพื่อจำค่าที่ประเมินไปแล้ว)
  useEffect(() => {
    if (!form) return;
    
    try {
      const savedStatus = localStorage.getItem(`assessment_status_${id}`);
      if (savedStatus && ["กำลังประเมิน", "ประเมินแล้ว"].includes(savedStatus) && form.status !== savedStatus) {
        console.log(`🔄 Restoring assessment status from localStorage: ${savedStatus}`);
        
        // อัพเดทฟอร์มด้วยสถานะที่บันทึกไว้
        const updatedForm: AssessmentForm = { 
          ...form, 
          status: savedStatus as "กำลังประเมิน" | "ประเมินแล้ว" 
        };
        mutate({ message: "OK", data: updatedForm }, { revalidate: false });
      }
    } catch (error) {
      console.warn("Cannot access localStorage:", error);
    }
  }, [form, id, mutate]);


  // คะแนน composite เป็นเปอร์เซ็นต์ 0..100
  const toGrade = (s: number): "N" | "L" | "M" | "H" | "E" => {
    if (s >= 80) return "E";
    if (s >= 60) return "H";
    if (s >= 40) return "M";
    if (s >= 20) return "L";
    return "N"; // 0–19
  };



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

    const relevantItems = next.groups.flatMap((g) =>
      g.items.filter((it) => {
        const cats = it.categories ?? [];
        return cats.length === 0 || cats.includes(currentCategory);
      })
    );
    const relevantScore = relevantItems.reduce(
      (sum, it) => sum + (it.values.score || 0),
      0
    );
    const visibleCount = relevantItems.length;
    const maxPossibleScore = MAX_CHANCE * MAX_IMPACT * visibleCount;

    next.totalScore = relevantScore;
    next.resultScore = relevantScore;
    next.composite = maxPossibleScore
      ? Math.round((relevantScore / maxPossibleScore) * 100)
      : 0;

    const allFilled =
      visibleCount > 0 &&
      relevantItems.every(
        (it) => (it.values?.chance ?? 0) > 0 && (it.values?.impact ?? 0) > 0
      );

    next.status = allFilled ? "ประเมินแล้ว" : "กำลังประเมิน";
    next.grade = toGrade(next.composite);

    // ✅ บันทึกสถานะและข้อมูลการประเมินลง localStorage ทุกครั้งที่มีการเปลี่ยนแปลง
    try {
      localStorage.setItem(`assessment_status_${id}`, next.status);
      localStorage.setItem(`assessment_data_${id}`, JSON.stringify({
        status: next.status,
        totalScore: next.totalScore,
        composite: next.composite,
        grade: next.grade,
        lastUpdated: new Date().toISOString()
      }));
    } catch (error) {
      console.warn("Cannot save to localStorage:", error);
    }

    mutate({ message: "OK", data: next }, { revalidate: false });
  }

  /** เฉพาะกลุ่ม/ข้อที่ “เกี่ยวข้องกับ category ปัจจุบัน” */
  const visibleGroups = form
    ? form.groups
        .map((g, gi) => {
          const itemsVisible = g.items
            .map((it, ii) => ({ it, ii }))
            .filter(({ it }) => {
              const cats = it.categories ?? [];
              if (!cats.length) return true;
              if (!currentCategory) return true;

              // กรณีพิเศษ: รวม IT + Non-IT เข้าด้วยกัน
              if (currentCategory === "IT/Non-IT") {
                return (
                  cats.includes("IT/Non-IT") ||
                  cats.includes("IT") ||
                  cats.includes("Non-IT")
                );
              }

              return cats.includes(currentCategory);
            });

          return { gi, id: g.id, title: g.title, itemsVisible };
        })
        .filter((g) => g.itemsVisible.length > 0)
    : [];

  const visibleItemCount = visibleGroups.reduce(
    (s, g) => s + g.itemsVisible.length,
    0
  );
  const MAX_PER_ITEM = MAX_CHANCE * MAX_IMPACT; // ปกติ 25
  const visibleBaseMax = visibleItemCount * MAX_PER_ITEM;

  /** บันทึกข้อมูลอัตโนมัติ (ไม่มี toast แจ้งเตือน) */
  async function saveQuietly() {
    if (!form) return false;
    
    // ตรวจสอบว่ามีการประเมินอะไรไปแล้วหรือไม่
    const hasAnyValues = form.groups.some(g => 
      g.items.some(it => (it.values?.chance ?? 0) > 0 || (it.values?.impact ?? 0) > 0)
    );
    
    if (!hasAnyValues) return true; // ไม่มีข้อมูลให้บันทึก ถือว่าสำเร็จ
    
    try {
      const next: AssessmentForm = structuredClone(form);

      const relevantItems = next.groups.flatMap((g) =>
        g.items.filter((it) => {
          const cats = it.categories ?? [];
          if (!cats.length) return true;
          if (!currentCategory) return true;
          return cats.includes(currentCategory);
        })
      );

      const relevantScore = relevantItems.reduce(
        (sum, it) => sum + (it.values.score || 0),
        0
      );
      const visibleCount = relevantItems.length;
      const maxPossibleScore = MAX_CHANCE * MAX_IMPACT * visibleCount;

      next.totalScore = relevantScore;
      next.resultScore = relevantScore;
      next.composite = maxPossibleScore
        ? Math.round((relevantScore / maxPossibleScore) * 100)
        : 0;

      const allFilled =
        visibleCount > 0 &&
        relevantItems.every(
          (it) => (it.values?.chance ?? 0) > 0 && (it.values?.impact ?? 0) > 0
        );

      next.status = allFilled ? "ประเมินแล้ว" : "กำลังประเมิน";
      next.grade = toGrade(next.composite);

      const r = await fetch(`/api/risk-assessment/${id}/form`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      
      if (!r.ok) {
        console.warn("Auto-save failed:", await r.text());
        return false;
      }
      
      const j = await r.json();
      await mutate(j, { revalidate: false }); // ไม่ revalidate เพื่อไม่ให้ช้า
      
      // บันทึกสถานะลง localStorage
      try {
        localStorage.setItem(`assessment_status_${id}`, next.status);
        localStorage.setItem(`assessment_data_${id}`, JSON.stringify({
          status: next.status,
          totalScore: next.totalScore,
          composite: next.composite,
          grade: next.grade,
          lastUpdated: new Date().toISOString()
        }));
        console.log(`💾 Auto-saved assessment data: ${id} -> ${next.status} (${next.composite}%)`);
      } catch (error) {
        console.warn("Cannot save to localStorage:", error);
      }
      
      return true;
    } catch (error) {
      console.warn("Auto-save error:", error);
      return false;
    }
  }

  /** บันทึกพร้อม toast แจ้งเตือน */
  async function save() {
    if (!form) return;
    setSaving(true);
    try {
      const next: AssessmentForm = structuredClone(form);

      const relevantItems = next.groups.flatMap((g) =>
        g.items.filter((it) => {
          const cats = it.categories ?? [];
          if (!cats.length) return true;
          if (!currentCategory) return true;
          return cats.includes(currentCategory);
        })
      );

      const relevantScore = relevantItems.reduce(
        (sum, it) => sum + (it.values.score || 0),
        0
      );
      const visibleCount = relevantItems.length;
      const maxPossibleScore = MAX_CHANCE * MAX_IMPACT * visibleCount;

      next.totalScore = relevantScore;
      next.resultScore = relevantScore;
      next.composite = maxPossibleScore
        ? Math.round((relevantScore / maxPossibleScore) * 100)
        : 0;

      const allFilled =
        visibleCount > 0 &&
        relevantItems.every(
          (it) => (it.values?.chance ?? 0) > 0 && (it.values?.impact ?? 0) > 0
        );

      next.status = allFilled ? "ประเมินแล้ว" : "กำลังประเมิน";
      next.grade = toGrade(next.composite);

      await toast.promise(
        (async () => {
          const r = await fetch(`/api/risk-assessment/${id}/form`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(next),
          });
          const j = await r.json();
          if (!r.ok) throw new Error(j?.message || "บันทึกไม่สำเร็จ");
          await mutate(j, { revalidate: true });
          
          // ✅ บันทึกสถานะและข้อมูลการประเมินลง localStorage เพื่อให้หน้า risk-evaluation แสดงข้อมูลที่ถูกต้อง
          try {
            localStorage.setItem(`assessment_status_${id}`, next.status);
            localStorage.setItem(`assessment_data_${id}`, JSON.stringify({
              status: next.status,
              totalScore: next.totalScore,
              composite: next.composite,
              grade: next.grade,
              lastUpdated: new Date().toISOString()
            }));
            console.log(`💾 Saved assessment data: ${id} -> ${next.status} (${next.composite}%)`);
          } catch (error) {
            console.warn("Cannot save to localStorage:", error);
          }
          
          // ✅ Invalidate all related caches
          await globalMutate(
            (key: string) =>
              typeof key === "string" &&
              (key.startsWith("/api/risk-assessment?") || 
               key.startsWith("/api/annual-evaluations") ||
               key.includes(id)),
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

  /** นำทางพร้อมบันทึกอัตโนมัติ */
  async function handleNavigateWithSave(path: string) {
    console.log("🚀 Navigating with auto-save to:", path);
    
    // บันทึกอัตโนมัติก่อนนำทาง
    const saveSuccess = await saveQuietly();
    
    if (saveSuccess) {
      console.log("✅ Auto-save completed, navigating...");
      router.push(path);
    } else {
      // ถ้าบันทึกไม่สำเร็จ แต่ยังคงนำทางไปได้ (เพื่อไม่ให้ผู้ใช้ติดค้าง)
      console.warn("⚠️ Auto-save failed, but still navigating...");
      router.push(path);
    }
  }

  // helper UI
  function levelsToOptions(levels?: Levels | null): LikertOption[] | null {
    if (!levels) return null;
    const map: Record<number, string | undefined> = {
      1: levels.least,
      2: levels.low,
      3: levels.medium,
      4: levels.high,
      5: levels.highest,
    };
    if (!Object.values(map).some(Boolean)) return null;
    return [1, 2, 3, 4, 5].map((v) => ({
      value: v,
      label: LABEL_BY_VALUE[v],
      description: map[v] || "",
    }));
  }

  function valueToLevelKey(v: number): keyof Levels | undefined {
    return (
      { 1: "least", 2: "low", 3: "medium", 4: "high", 5: "highest" } as const
    )[v];
  }

  function LikertModal({
    open,
    onOpenChange,
    title,
    name,
    value,
    onSelect,
    options,
    levels,
    context,
  }: LikertModalProps): JSX.Element {
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

          {context ? (
            <div className="mb-3 rounded-xl border bg-muted/40 px-4 py-2 text-sm">
              <div className="text-muted-foreground">
                เรื่อง: <span className="text-foreground">{context.item}</span>
              </div>
            </div>
          ) : null}

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
              const key = valueToLevelKey(opt.value);
              const desc = (key && levels?.[key]) || opt.description;

              return (
                <Label
                  key={id}
                  htmlFor={id}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-2xl border p-4 min-h-[56px] transition",
                    active
                      ? "bg-primary/10 border-primary/40 shadow-sm"
                      : "hover:bg-muted/40"
                  )}
                >
                  <RadioGroupItem
                    id={id}
                    value={String(opt.value)}
                    className="h-5 w-5 shrink-0"
                  />
                  <div className="flex w-full flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                    <div className="font-semibold text-foreground sm:min-w-[90px] whitespace-nowrap">
                      {opt.label}
                    </div>
                    <div className="text-sm text-muted-foreground sm:flex-1 whitespace-normal break-words">
                      {desc}
                    </div>
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
    levels,
    context,
  }: {
    label: string;
    name: string;
    value: number;
    onChange: (v: number) => void;
    options: LikertOption[];
    levels?: Levels;
    context?: { dimension: string; item: string };
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
          levels={levels}
          context={context}
        />
      </>
    );
  }

  function getGroupStatus(itemsVisible: { it: { values?: { chance?: number; impact?: number } } }[]) {
    const total = itemsVisible.length;
    const done =
      total > 0 &&
      itemsVisible.every(
        ({ it }) => (it.values?.chance ?? 0) > 0 && (it.values?.impact ?? 0) > 0
      );

    return {
      done,
      text: done ? "ประเมินแล้ว" : "รอประเมิน",
      className: done
        ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
        : "bg-amber-100 text-amber-800 border border-amber-200",
    };
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
          onClick={() => handleNavigateWithSave("/risk-evaluation")}
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

      {/* Header meta (ดึงจาก evaluations → leafRows แทน meta API เดิม) */}
      <Card className="border-dashed">
        <CardContent>
          {navLoading ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 mb-3">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-sm text-muted-foreground">กำลังโหลดข้อมูลหัวข้อ...</span>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="h-4 bg-muted animate-pulse rounded"></div>
                <div className="h-4 bg-muted animate-pulse rounded"></div>
                <div className="h-4 bg-muted animate-pulse rounded"></div>
                <div className="h-4 bg-muted animate-pulse rounded"></div>
              </div>
            </div>
          ) : (
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
                  <TableCell>{effectiveMeta?.index ?? "-"}</TableCell>
                  <TableCell>{effectiveMeta?.unit ?? "-"}</TableCell>
                  <TableCell>{effectiveMeta?.category ?? "-"}</TableCell>
                  <TableCell className="text-primary">
                    {effectiveMeta?.topic ?? "-"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* ปุ่มนำทางหัวข้อ (prev/next จาก leafRows) */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="relative h-12 w-full rounded-xl"
          disabled={!prevId}
          onClick={() =>
            prevId && handleNavigateWithSave(`/risk-evaluation-form/${prevId}`)
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
            nextId && handleNavigateWithSave(`/risk-evaluation-form/${nextId}`)
          }
        >
          <span className="mx-auto">หัวข้อถัดไป</span>
          <ChevronRight className="absolute right-4 h-5 w-5" />
        </Button>
      </div>

      {/* Loading / Creating form */}
      {formLoading && (
        <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg border">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
          <div className="text-sm text-muted-foreground">
            กำลังโหลดแบบประเมิน...
          </div>
        </div>
      )}
      {formErr && 'status' in formErr && (formErr as { status: number }).status === 404 && (
        <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="animate-pulse rounded-full h-5 w-5 bg-blue-300"></div>
          <div className="text-sm text-blue-700">
            ยังไม่เคยประเมินสำหรับหัวข้อนี้ — กำลังเตรียมแบบฟอร์มว่าง...
          </div>
        </div>
      )}

      {/* ฟอร์ม */}
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
                {/** แสดงเฉพาะ items ที่เกี่ยวข้องกับ category ปัจจุบัน */}
                {visibleGroups.map((group) => (
                  <AccordionItem
                    key={group.id}
                    value={group.id}
                    className="border rounded-xl px-4"
                  >
                    <AccordionTrigger className="text-left py-4 font-semibold">
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                            {group.id}
                          </span>
                          {group.title}
                          <span className="ml-2 text-xs text-muted-foreground">
                            ({group.itemsVisible.length})
                          </span>
                        </div>
                        {(() => {
                          const st = getGroupStatus(group.itemsVisible);
                          return (
                            <span
                              className={cn(
                                "rounded-full px-2.5 py-1 text-xs font-medium",
                                st.className
                              )}
                            >
                              {st.text}
                            </span>
                          );
                        })()}
                      </div>
                    </AccordionTrigger>

                    <AccordionContent>
                      <div className="space-y-3 pb-4">
                        {group.itemsVisible.map(({ it, ii }) => (
                          <div key={it.id} className="rounded-xl border p-4">
                            <div className="flex items-start justify-between gap-4">
                              <p className="text-sm leading-6 flex-1">
                                {it.label}
                              </p>

                              <div className="grid grid-cols-3 gap-2 w-[300px] text-center">
                                <div>
                                  <div className="text-xs text-muted-foreground">
                                    โอกาส
                                  </div>
                                  <ScorePicker
                                    label={`โอกาส – ${group.title}`}
                                    name={`${group.id}-${it.id}-chance`}
                                    value={it.values.chance ?? 0}
                                    onChange={(v) =>
                                      setItemValue(group.gi, ii, { chance: v })
                                    }
                                    options={getOptionsFor(
                                      group.id,
                                      "likelihood"
                                    )}
                                    context={{
                                      dimension: group.title,
                                      item: it.label,
                                    }}
                                  />
                                </div>

                                <div>
                                  <div className="text-xs text-muted-foreground">
                                    ผลกระทบ
                                  </div>
                                  <ScorePicker
                                    label={`ผลกระทบ – ${group.title}`}
                                    name={`${group.id}-${it.id}-impact`}
                                    value={it.values.impact ?? 0}
                                    onChange={(v) =>
                                      setItemValue(group.gi, ii, { impact: v })
                                    }
                                    options={
                                      levelsToOptions((it as { levels?: Levels }).levels) ??
                                      getOptionsFor(group.id, "impact")
                                    }
                                    context={{
                                      dimension: group.title,
                                      item: it.label,
                                    }}
                                  />
                                </div>

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
                      help="(ระดับโอกาสสูงสุด × ผลกระทบสูงสุด) × จำนวนปัจจัยเสี่ยงที่แสดง"
                      value={visibleBaseMax}
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
            <Button onClick={save} disabled={saving}>
              {saving ? "กำลังบันทึก..." : "บันทึก"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

/* ---------- UI ย่อย ---------- */
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
