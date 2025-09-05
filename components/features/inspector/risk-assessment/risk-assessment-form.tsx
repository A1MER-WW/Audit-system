"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Info,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import ScreeningChoiceDialog from "../../popup/next-topic";

// --- Types ---
interface FactorItem {
  id: string;
  title: string;
  defaultLikelihood?: number;
  defaultImpact?: number;
}

interface FactorGroup {
  code: string; // S / O / G / K
  name: string;
  items: FactorItem[];
}

type LikertOption = { value: number; label: string; description: string };

const LIKELIHOOD_OPTIONS: LikertOption[] = [
  {
    value: 1,
    label: "น้อยที่สุด",
    description:
      "หน่วยงานมีบุคลากรอยู่ปฏิบัติงานจริงเต็มตามกรอบอัตรากำลังและโดยไม่มีการปรับเปลี่ยน/โอน/ย้าย/ลาออกของบุคลากรที่ปฏิบัติงาน ภายในระยะเวลา 2 ปี",
  },
  {
    value: 2,
    label: "น้อย",
    description:
      "หน่วยงานมีบุคลากรอยู่ปฏิบัติงานจริงเต็มตามกรอบอัตรากำลังและโดยไม่มีการปรับเปลี่ยน/โอน/ย้าย/ลาออก ของบุคลากรที่ปฏิบัติงาน ภายในระยะเวลา 1 ปี",
  },
  {
    value: 3,
    label: "ปานกลาง",
    description:
      "หน่วยงานมีบุคลากรอยู่ปฏิบัติงานจริงเต็มตามกรอบอัตรากำลังและและไม่มีการปรับเปลี่ยน/โอน/ย้าย/ลาออกของบุคลากรที่ปฏิบัติงานในระหว่างปีงบประมาณ พ.ศ. 2567",
  },
  {
    value: 4,
    label: "มาก",
    description:
      "หน่วยงานมีบุคลากรอยู่ปฏิบัติงานจริงน้อยกว่าจำนวนบุคลากรตามกรอบอัตรากำลัง คิดเป็นร้อยละ 5",
  },
  {
    value: 5,
    label: "มากที่สุด",
    description:
      "หน่วยงานมีบุคลากรอยู่ปฏิบัติงานจริงน้อยกว่าจำนวนบุคลากรตามกรอบอัตรากำลัง คิดเป็นร้อยละ 10",
  },
];

const GROUPS: FactorGroup[] = [
  {
    code: "S",
    name: "ด้านกลยุทธ์",
    items: [
      {
        id: "S1",
        title:
          "แผนปฏิบัติงาน/แนวปฏิบัติของโครงการ/งบประมาณ (มีผู้ปฏิบัติตามตามการวิเคราะห์และนโยบายของผู้บริหาร)",
        defaultLikelihood: 5,
        defaultImpact: 5,
      },
    ],
  },
  {
    code: "O",
    name: "ด้านการปฏิบัติงาน",
    items: [
      {
        id: "O1",
        title: "มีประกาศ/หนังสือ/คำสั่ง กำหนดบทบาท หน้าที่ และความรับผิดชอบ",
        defaultLikelihood: 5,
        defaultImpact: 5,
      },
      {
        id: "O2",
        title: "ผู้ปฏิบัติงานมีความชำนาญการปฏิบัติงาน",
        defaultLikelihood: 5,
        defaultImpact: 5,
      },
      {
        id: "O3",
        title: "การติดตามและประเมินผลการปฏิบัติงาน",
        defaultLikelihood: 5,
        defaultImpact: 5,
      },
    ],
  },
  {
    code: "G",
    name: "ด้านกฎหมาย ระบบ องค์กร",
    items: [
      {
        id: "G1",
        title: "การปฏิบัติตามกฎหมายและระเบียบ",
        defaultLikelihood: 5,
        defaultImpact: 5,
      },
      {
        id: "G2",
        title: "การควบคุมภายในของหน่วยงานตามเกณฑ์และกรอบ พ.ร.บ. 2567",
        defaultLikelihood: 5,
        defaultImpact: 5,
      },
    ],
  },
  {
    code: "K",
    name: "ด้านการจัดการความรู้",
    items: [
      {
        id: "K1",
        title: "มีกิจกรรมการแลกเปลี่ยนเรียนรู้ภายในองค์กร",
        defaultLikelihood: 5,
        defaultImpact: 3,
      },
    ],
  },
];

const maxPerItem = 25; // 5 x 5

export default function RiskAssessmentFormPage() {
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState("2568");
  const router = useRouter();
  // state: likelihood & impact for each item
  const [scores, setScores] = useState<
    Record<string, { L: number; I: number }>
  >(() => {
    const initial: Record<string, { L: number; I: number }> = {};
    GROUPS.forEach((g) =>
      g.items.forEach((it) => {
        initial[it.id] = {
          L: it.defaultLikelihood ?? 0,
          I: it.defaultImpact ?? 0,
        };
      })
    );
    return initial;
  });

  const handleChange = (id: string, key: "L" | "I", value: number) => {
    setScores((prev) => ({ ...prev, [id]: { ...prev[id], [key]: value } }));
  };

  const sectionTotals = useMemo(() => {
    const map: Record<string, number> = {};
    GROUPS.forEach((g) => {
      map[g.code] = g.items.reduce(
        (sum, it) => sum + (scores[it.id]?.L ?? 0) * (scores[it.id]?.I ?? 0),
        0
      );
    });
    return map;
  }, [scores]);

  const totalScore = useMemo(
    () => Object.values(sectionTotals).reduce((a, b) => a + b, 0),
    [sectionTotals]
  );
  const baseScore = useMemo(
    () => GROUPS.reduce((sum, g) => sum + g.items.length * maxPerItem, 0),
    []
  );
  const composite = useMemo(
    () => (baseScore ? Math.round((totalScore / baseScore) * 100) : 0),
    [totalScore, baseScore]
  );

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
        {/* เพิ่ม overlay animations */}
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
            value={String(value)}
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
                    // ลด ring/reflow เวลาเลือก ให้ใช้ shadow บางๆ แทน
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
        {/* ปุ่มแสดงตัวเลข (เหมือนเดิม) */}
        <Button
          variant="outline"
          className="w-20 justify-center"
          onClick={() => setOpen(true)}
        >
          {value ?? "-"}
        </Button>

        {/* Popup เลือกแบบการ์ด */}
        <LikertModal
          open={open}
          onOpenChange={setOpen}
          title={label}
          name={name}
          value={value}
          onSelect={onChange}
          options={options}
        />
      </>
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

      {/* Year picker outside the card */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-foreground">ปีงบประมาณ</span>
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[2568, 2567, 2566, 2565, 2564, 2563].map((y) => (
              <SelectItem key={y} value={String(y)}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Header controls */}
      <Card className="border-dashed">
        <CardContent className="">
          <div className="flex-1">
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
                  <TableCell>1.3</TableCell>
                  <TableCell>กจท.</TableCell>
                  <TableCell>งานหลัก</TableCell>
                  <TableCell className="text-primary">งานเบิกจ่าย</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            {/* ปุ่มนำทางหัวข้อ */}
            <div className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ซ้าย: หัวข้อหลักเกณฑ์ */}
                <Button
                  variant="outline"
                  className="relative h-12 w-full rounded-xl border-primary text-primary hover:bg-primary/5"
                  onClick={() => {
                    /* TODO: ไปหน้าหลักเกณฑ์ */
                  }}
                >
                  <ChevronLeft className="absolute left-4 h-5 w-5" />
                  <span className="mx-auto">หัวข้อหลักเกณฑ์</span>
                </Button>

                {/* ขวา: หัวข้อต่อไป */}
                <Button
                  variant="outline"
                  className="relative h-12 w-full rounded-xl border-primary text-primary hover:bg-primary/5"
                  onClick={() => setOpen(true)} // 👉 กดแล้วเปิด popup
                >
                  <span className="mx-auto">หัวข้อต่อไป</span>
                  <ChevronRight className="absolute right-4 h-5 w-5" />
                </Button>

                <ScreeningChoiceDialog
                  open={open}
                  onOpenChange={setOpen}
                  initial="need"
                  onConfirm={(value) => {
                    console.log("ผู้ใช้เลือก:", value);
                    // TODO: ไปหัวข้อถัดไป พร้อมค่าที่เลือก
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assessment form */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg">แบบประเมินความเสี่ยง</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Accordion
            type="multiple"
            defaultValue={["S", "O", "G", "K"]}
            className="w-full"
          >
            {GROUPS.map((group) => (
              <AccordionItem
                key={group.code}
                value={group.code}
                className="border rounded-xl px-4"
              >
                <AccordionTrigger className="text-left py-4 font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                      {group.code}
                    </span>
                    {group.name}
                    <span className="ml-2 text-xs text-muted-foreground">
                      ({group.items.length})
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pb-4">
                    {group.items.map((item) => {
                      const L = scores[item.id]?.L ?? 0;
                      const I = scores[item.id]?.I ?? 0;
                      const score = L * I;
                      return (
                        <div key={item.id} className="rounded-xl border p-4">
                          <div className="flex items-start justify-between gap-4">
                            <p className="text-sm leading-6 flex-1">
                              {item.title}
                            </p>
                            <div className="grid grid-cols-3 gap-2 w-[300px] text-center">
                              <div>
                                <div className="text-xs text-muted-foreground">
                                  โอกาส
                                </div>
                                <ScorePicker
                                  label="โอกาส"
                                  name={`${item.id}-L`}
                                  value={L}
                                  onChange={(v) =>
                                    handleChange(item.id, "L", v)
                                  }
                                  options={LIKELIHOOD_OPTIONS}
                                />
                              </div>

                              <div>
                                <div className="text-xs text-muted-foreground">
                                  ผลกระทบ
                                </div>
                                <ScorePicker
                                  label="ผลกระทบ"
                                  name={`${item.id}-I`}
                                  value={I}
                                  onChange={(v) =>
                                    handleChange(item.id, "I", v)
                                  }
                                  options={LIKELIHOOD_OPTIONS}
                                />
                              </div>

                              <div>
                                <div className="text-xs text-muted-foreground">
                                  คะแนน
                                </div>
                                <Input
                                  readOnly
                                  value={score}
                                  className="text-center"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <Separator />

          {/* Results */}
          <div className="space-y-4">
            <div className="rounded-lg bg-blue-50 p-3 text-sm font-medium">
              ผลการประเมิน
            </div>

            {/* แถว: คะแนน (มี 2 ค่าอยู่ฝั่งขวา) */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-foreground">คะแนน</div>
              <div className="flex items-center gap-8">
                <StatStack
                  label="คะแนนเต็มที่ประเมิน"
                  help="การคำนวณคะแนนเต็มที่ประเมินคะแนนเต็มที่ประเมิน = (ระดับโอกาสที่จะเกิดสูงที่สุด * ระดับผลกระทบที่สูงที่สุด) * จำนวนปัจจัยเสี่ยงทั้งหมด"
                  value={baseScore}
                />
                <StatStack
                  label="ผลรวมคะแนนประเมิน"
                  help="การคำนวณ ผลรวมคะแนนประเมินผลรวมคะแนนประเมิน = ผลรวมคะแนนที่ประเมินของแต่ละปัจจัยเสี่ยง"
                  value={totalScore}
                />
              </div>
            </div>

            {/* แถว: Composite Score (ค่าฝั่งขวา) */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-foreground">
                คะแนนประเมิน (Composite Score)
              </div>
              <div className="flex items-center">
                <Input
                  readOnly
                  value={composite}
                  className="h-8 w-20 text-center"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

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

function StatBox({
  label,
  value,
  suffix,
  help,
}: {
  label: string;
  value: number | string;
  suffix?: string;
  help?: string;
}) {
  return (
    <div className="rounded-xl border p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground flex items-center gap-1">
          {label}
          {help ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent>{help}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : null}
        </div>
        <div className="text-xl font-semibold">
          {value}
          {suffix ? (
            <span className="text-sm ml-1 text-muted-foreground">{suffix}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
