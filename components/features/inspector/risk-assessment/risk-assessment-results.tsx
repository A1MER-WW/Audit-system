// app/(your-segment)/risk-assessment/results/page.tsx
"use client";

import { Fragment, useMemo, useState } from "react";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Filter,
  GripVertical,
  Info,
  MoveDown,
  MoveUp,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import RiskSubmitConfirmDialog from "../../popup/submitted-to-the-head-audit";
import ChangeOrderReasonDialog from "../../popup/reason-for-change";

/* ======================== Types ======================== */
export type TabKey =
  | "all"
  | "unit"
  | "work"
  | "project"
  | "carry"
  | "activity"
  | "process"
  | "it";

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
  maxScore?: number; // สำหรับแท็บหน่วยงาน
  grade: "H" | "M" | "L" | "-";
  status: string;
  hasDoc: boolean;
};

type ApiResponse = {
  fiscalYears: number[];
  pageTitle: string;
  subtitle: string;
  assessmentName: string;
  statusLine: { label: string; value: string };
  rowsByTab: Partial<Record<Exclude<TabKey, "all">, Row[]>>;
};

type OuterTab = "summary" | "reorder" | "unitRanking";

/* ======================== Constants ======================== */
const fetcher = (url: string) =>
  fetch(url).then((r) => r.json() as Promise<ApiResponse>);

const DYNAMIC_HEAD: Record<TabKey, string> = {
  all: "หัวข้อของงานตรวจสอบ",
  unit: "ภารกิจตามกฎกระทรวง",
  work: "หัวข้อของงานที่กำหนด",
  project: "หัวข้อของโครงการที่กำหนด",
  carry: "หัวข้อของโครงการที่กำหนด",
  activity: "หัวข้อของกิจกรรม (ผลผลิต) ที่กำหนด",
  process: "หัวข้อของกระบวนการปฏิบัติงานที่กำหนด",
  it: "หัวข้อของระบบ IT และ NON IT ที่กำหนด",
};

const TAB_LABELS: Record<TabKey, string> = {
  all: "ทั้งหมด",
  unit: "หน่วยงาน",
  work: "งาน",
  project: "โครงการ",
  carry: "โครงการกันเงินเหลื่อมปี",
  activity: "กิจกรรม",
  process: "กระบวนงาน",
  it: "IT และ Non-IT",
};

const OUTER_TABS: Record<OuterTab, string> = {
  summary: "ผลการประเมินความเสี่ยงรวมทั้งหมด",
  reorder: "ผลการจัดลำดับความเสี่ยง",
  unitRanking: "ผลลำดับความเสี่ยงหน่วยงาน",
};

const STATUS_OPTIONS = [
  { label: "ทั้งหมด", value: "all" },
  { label: "กำลังประเมิน", value: "กำลังประเมิน" },
  { label: "ประเมินแล้ว", value: "ประเมินแล้ว" },
  { label: "ยังไม่ได้ประเมิน", value: "ยังไม่ได้ประเมิน" },
];

/* ======================== Small UI Helpers ======================== */
function StatusBadge({ value }: { value: string }) {
  const map: Record<string, string> = {
    กำลังประเมิน: "bg-blue-100 text-blue-700 border-blue-200",
    ประเมินแล้ว: "bg-emerald-100 text-emerald-700 border-emerald-200",
    ยังไม่ได้ประเมิน: "bg-red-100 text-red-700 border-red-200",
    แก้ไข: "bg-amber-100 text-amber-700 border-amber-200",
  };
  return (
    <Badge
      variant="outline"
      className={cn("rounded-full px-3", map[value] || "")}
    >
      {value}
    </Badge>
  );
}

function GradeBadge({ grade }: { grade: Row["grade"] }) {
  if (!grade || grade === "-")
    return <span className="text-muted-foreground">-</span>;
  const map = {
    H: { txt: "High", cls: "bg-red-100 text-red-700 border-red-200" },
    M: { txt: "Medium", cls: "bg-amber-100 text-amber-700 border-amber-200" },
    L: { txt: "Low", cls: "bg-sky-100 text-sky-700 border-sky-200" },
  } as const;
  const it = map[grade];
  return (
    <Badge variant="outline" className={cn("rounded-full px-2", it.cls)}>
      {it.txt}
    </Badge>
  );
}

function topicByTab(row: Row, tab: TabKey): string {
  if (tab === "unit") return row.mission;
  if (tab === "work") return row.work;
  if (tab === "project") return row.project;
  if (tab === "carry") return row.carry;
  if (tab === "activity") return row.activity;
  if (tab === "process") return row.process;
  if (tab === "it") return row.system;
  return (
    [
      row.work,
      row.project,
      row.carry,
      row.activity,
      row.process,
      row.system,
      row.mission,
    ].find((v) => v && v !== "-") || "-"
  );
}

/* ======================== Mock Builder ======================== */
function buildMockRows(): Partial<Record<Exclude<TabKey, "all">, Row[]>> {
  const mk = (
    p: Partial<Row> & {
      id: string;
      index: string;
      unit: string;
      score: number;
      grade: Row["grade"];
      status: string;
    }
  ): Row => ({
    id: p.id,
    index: p.index,
    unit: p.unit,
    mission: p.mission ?? "-",
    work: p.work ?? "-",
    project: p.project ?? "-",
    carry: p.carry ?? "-",
    activity: p.activity ?? "-",
    process: p.process ?? "-",
    system: p.system ?? "-",
    itType: p.itType ?? "-",
    score: p.score,
    maxScore: p.maxScore ?? 60,
    grade: p.grade,
    status: p.status,
    hasDoc: p.hasDoc ?? true,
  });

  const work = [
    mk({
      id: "w1",
      index: "1",
      unit: "สลก.",
      work: "มาตรการควบคุมการใช้งบประมาณ",
      score: 65,
      grade: "H",
      status: "แก้ไข",
    }),
    mk({
      id: "w1-1",
      index: "1.1",
      unit: "สลก.",
      work: "แผนงานจัดซื้อจัดจ้าง",
      score: 55,
      grade: "M",
      status: "ประเมินแล้ว",
    }),
    mk({
      id: "w2",
      index: "2",
      unit: "ชพน.",
      work: "งานพัสดุ",
      score: 56,
      grade: "H",
      status: "แก้ไข",
    }),
  ];

  const project = [
    mk({
      id: "p1",
      index: "3",
      unit: "ศกส.",
      project: "โครงการพัฒนาฐานข้อมูลเกษตรกร",
      score: 54,
      grade: "M",
      status: "แก้ไข",
    }),
  ];

  const activity = [
    mk({
      id: "a1",
      index: "4",
      unit: "ชพน.ในสังกัด",
      activity: "ผลผลิต 1: พัฒนาระบบข้อมูล",
      score: 51,
      grade: "M",
      status: "แก้ไข",
    }),
  ];

  const process = [
    mk({
      id: "pr1",
      index: "5",
      unit: "ศกส.",
      process: "กระบวนงาน: บัญชีการเงิน",
      score: 44,
      grade: "M",
      status: "แก้ไข",
    }),
  ];

  const unit = [
    mk({
      id: "u1",
      index: "6",
      unit: "ศกส.",
      mission: "ภารกิจ: บริหารจัดการ",
      score: 10,
      grade: "L",
      status: "แก้ไข",
    }),
  ];

  const it = [
    mk({
      id: "it1",
      index: "7",
      unit: "ศกส.",
      system: "Big Data Analytics",
      score: 10,
      grade: "L",
      status: "แก้ไข",
      itType: "IT",
    }),
  ];

  const carry = [
    mk({
      id: "c1",
      index: "8",
      unit: "ศกส.",
      carry: "กันเงินเหลื่อมปีระบบ Coaching Platform",
      score: 10,
      grade: "L",
      status: "แก้ไข",
    }),
  ];

  return { work, project, activity, process, unit, it, carry };
}

type ResultsProps = {
  fullWidth?: boolean;
  className?: string;
  outerTab?: OuterTab;
  onOuterTabChange?: (v: OuterTab) => void;
  scoreSortDir?: "asc" | "desc";
};

/* ======================== Page Component ======================== */
export default function RiskAssessmentResultsPage({
  fullWidth = true,
  className = "",
  outerTab: outerTabProp,
  onOuterTabChange,
  scoreSortDir,
}: ResultsProps) {
  // callback: ปุ่ม “เสนอหัวหน้าหน่วยตรวจสอบ”
  function onClickSubmit() {
    if (outerTab === "reorder") {
      setOpenReasonDialog(true);
    } else {
      setOpenSubmitDialog(true);
    }
  }

  // เดิมมี handleConfirm อยู่แล้ว แก้นิดหน่อยให้ปิด SubmitDialog
  const handleConfirm = async () => {
    // TODO: call API ส่งเสนอหัวหน้า (กรณี summary/unitRanking)
    console.log("ยืนยันส่งเสนอหัวหน้าเรียบร้อย");
    setOpenSubmitDialog(false);
  };

  // handler สำหรับ dialog เหตุผลปรับลำดับ (แท็บ reorder)
  async function handleConfirmChangeOrder(payload: {
    note: string;
    acknowledged: boolean;
  }) {
    // TODO: เรียก API ส่งผลการ 'จัดลำดับใหม่' + โน้ต
    // ตัวอย่าง payload: { note: "...", acknowledged: true }
    console.log("submit change-order:", payload);

    // ตัวอย่าง pseudo:
    // await api.post(`/api/risk-assessment/${year}/submit-reorder`, {
    //   order: orderedParents.map(r => r.id),   // ถ้าต้องการแนบลำดับใหม่
    //   note: payload.note,
    //   acknowledged: payload.acknowledged,
    // });

    setOpenReasonDialog(false);
  }
  const router = useRouter();

  // -------- Outer tabs (3 โหมด) --------
  const [outerTabUncontrolled, setOuterTabUncontrolled] =
    useState<OuterTab>("summary");

  const outerTab = outerTabProp ?? outerTabUncontrolled;
  const setOuterTab = onOuterTabChange ?? setOuterTabUncontrolled;

  // -------- Inner tabs (ประเภท) --------
  const [tab, setTab] = useState<TabKey>("all");
  const [year, setYear] = useState("2568");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [onlyIT, setOnlyIT] = useState(false);
  const [sortBy, setSortBy] = useState<"index" | "score" | "unit">("score");
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 200;
  const [open, setOpen] = useState(false);
  const [openSubmitDialog, setOpenSubmitDialog] = useState(false); // สำหรับ RiskSubmitConfirmDialog
  const [openReasonDialog, setOpenReasonDialog] = useState(false); // สำหรับ ChangeOrderReasonDialog
  const { data, error, isLoading } = useSWR<ApiResponse>(
    `/api/risk-assessment?year=${year}`,
    fetcher
  );

  // rows
  const rowsByTab = Object.values(data?.rowsByTab ?? {}).some(
    (v) => (v?.length ?? 0) > 0
  )
    ? (data!.rowsByTab as ApiResponse["rowsByTab"])
    : buildMockRows();

  const pageTitle = data?.pageTitle ?? "วางแผนงานตรวจสอบภายใน";
  const subtitle =
    data?.subtitle ?? "การประเมินความเสี่ยงและการจัดลำดับความเสี่ยง";
  const assessmentName =
    data?.assessmentName ??
    `ผลการประเมินความเสี่ยง แผนการตรวจสอบประจำปี ${year}`;
  const fiscalYears = data?.fiscalYears ?? [Number(year)];
  const statusLine = data?.statusLine ?? { label: "สถานะ:", value: "-" };

  const getTabRows = (k: Exclude<TabKey, "all">): Row[] => rowsByTab[k] ?? [];
  const allRows: Row[] = useMemo(
    () => [
      ...getTabRows("work"),
      ...getTabRows("project"),
      ...getTabRows("carry"),
      ...getTabRows("activity"),
      ...getTabRows("process"),
      ...getTabRows("unit"),
      ...getTabRows("it"),
    ],
    [rowsByTab]
  );
  const rawRows: Row[] = useMemo(
    () => (tab === "all" ? allRows : getTabRows(tab)),
    [tab, allRows, rowsByTab]
  );

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // สำหรับ summary + reorder: filter เฉพาะ parent ในหน้าหลัก
  const filteredParents = useMemo(() => {
    let dataRows = [...rawRows];

    if (query) {
      const q = query.trim().toLowerCase();
      dataRows = dataRows.filter((r) =>
        [
          r.index,
          r.unit,
          r.mission,
          r.work,
          r.project,
          r.carry,
          r.activity,
          r.process,
          r.system,
        ].some((t) => String(t).toLowerCase().includes(q))
      );
    }
    if (status !== "all")
      dataRows = dataRows.filter((r) => r.status === status);
    if (onlyIT) dataRows = dataRows.filter((r) => r.itType && r.itType !== "-");

    // เฉพาะ parent
    dataRows = dataRows.filter((r) => !r.index.includes("."));

    dataRows.sort((a: any, b: any) => {
      const dir = sortAsc ? 1 : -1;
      if (sortBy === "score") return (a.score - b.score) * dir;
      if (sortBy === "unit")
        return String(a.unit).localeCompare(String(b.unit)) * dir;
      const parseIdx = (s: string) => s.split(".").map(Number);
      const [a1, a2 = 0] = parseIdx(a.index);
      const [b1, b2 = 0] = parseIdx(b.index);
      if (a1 !== b1) return (a1 - b1) * dir;
      return (a2 - b2) * dir;
    });
    return dataRows;
  }, [rawRows, query, status, onlyIT, sortBy, sortAsc]);

  // pagination (summary + reorder ใช้เหมือนกัน)
  const shouldPaginate = filteredParents.length > PAGE_SIZE;
  const totalPages = shouldPaginate
    ? Math.ceil(filteredParents.length / PAGE_SIZE)
    : 1;
  const paginatedParents = shouldPaginate
    ? filteredParents.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    : filteredParents;

  // children rows (สำหรับแสดงใน summary expanded และ unitRanking)
  const getChildRows = (rows: Row[], parentIndex: string) =>
    rows
      .filter((rr) => rr.index.startsWith(parentIndex + "."))
      .sort((a, b) => {
        const pa = a.index.split(".").map(Number);
        const pb = b.index.split(".").map(Number);
        if (pa[0] !== pb[0]) return pa[0] - pb[0];
        return (pa[1] ?? 0) - (pb[1] ?? 0);
      });

  /* ---------- Reorder state & actions ---------- */
  const [orderIds, setOrderIds] = useState<string[] | null>(null);
  const orderedParents = useMemo(() => {
    if (!orderIds) return paginatedParents;
    const map = new Map(paginatedParents.map((r) => [r.id, r]));
    return orderIds.map((id) => map.get(id)!).filter(Boolean);
  }, [orderIds, paginatedParents]);

  const ensureOrderInit = () => {
    if (!orderIds) setOrderIds(paginatedParents.map((r) => r.id));
  };
  const moveUp = (id: string) => {
    ensureOrderInit();
    setOrderIds((prev) => {
      const arr = [...(prev ?? paginatedParents.map((r) => r.id))];
      const i = arr.indexOf(id);
      if (i > 0) [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
      return arr;
    });
  };
  const moveDown = (id: string) => {
    ensureOrderInit();
    setOrderIds((prev) => {
      const arr = [...(prev ?? paginatedParents.map((r) => r.id))];
      const i = arr.indexOf(id);
      if (i >= 0 && i < arr.length - 1)
        [arr[i + 1], arr[i]] = [arr[i], arr[i + 1]];
      return arr;
    });
  };

  /* ======================== Render ======================== */
  return (
    <div
      className={cn(
        fullWidth
          ? "w-full p-4 md:p-6 space-y-4"
          : "mx-auto max-w-[1200px] p-4 md:p-6 space-y-4",
        className
      )}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-muted-foreground">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          aria-label="ย้อนกลับ"
          onClick={() => {
            if (typeof window !== "undefined" && window.history.length > 1) {
              window.history.back();
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
          ผลการประเมิน
        </span>
      </div>

      {/* ปีงบประมาณ */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">ปีงบประมาณ</span>
        <Select
          value={year}
          onValueChange={(v) => {
            setYear(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {fiscalYears.map((y) => (
              <SelectItem key={y} value={String(y)}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="border-dashed">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <CardTitle className="text-base md:text-lg font-medium">
              {assessmentName}
            </CardTitle>
            <>
              {/* ปุ่มเปิด Dialog */}
              <Button
                asChild
                size="sm"
                className="rounded-md bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Link href={`/overview-of-the-assessment-results`}>
                  เสนอหัวหน้าหน่วยตรวจสอบ
                </Link>
              </Button>

              {/* Dialog */}
              {/* Dialog: กรณีไม่ใช่แท็บ reorder */}
              <RiskSubmitConfirmDialog
                open={openSubmitDialog}
                onOpenChange={setOpenSubmitDialog}
                onConfirm={handleConfirm}
                assessmentTitle={`ผลการประเมินและจัดลำดับความเสี่ยงแผนการตรวจสอบประจำปี ${year}`}
              />

              {/* Dialog: กรณีแท็บ reorder */}
              <ChangeOrderReasonDialog
                open={openReasonDialog}
                onOpenChange={setOpenReasonDialog}
                onConfirm={handleConfirmChangeOrder}
              />
            </>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <Info className="h-4 w-4" />
            <span className="font-medium text-foreground">
              {statusLine.label}
            </span>
            {statusLine.value}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* ---------- TABS ชั้นนอก (3 โหมด) ---------- */}
          <Tabs
            value={outerTab}
            onValueChange={(v) => setOuterTab(v as OuterTab)}
          >
            <TabsList className="mb-2 w-full justify-start bg-transparent h-auto p-0 border-b border-border">
              {Object.entries(OUTER_TABS).map(([k, label]) => (
                <TabsTrigger
                  key={k}
                  value={k}
                  className="rounded-none bg-transparent px-0 md:px-3 py-3 text-sm font-medium text-muted-foreground hover:text-foreground border-b-2 border-transparent data-[state=active]:text-primary data-[state=active]:border-primary"
                >
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* ---------- TABS ชั้นใน (ประเภทข้อมูล) ---------- */}
          <div className="overflow-x-auto">
            <Tabs
              value={tab}
              onValueChange={(v) => {
                setTab(v as TabKey);
                setPage(1);
                setOrderIds(null);
              }}
            >
              <TabsList className="mb-2 w-full justify-start bg-transparent h-auto p-0 border-b border-border">
                {Object.entries(TAB_LABELS).map(([k, label]) => (
                  <TabsTrigger
                    key={k}
                    value={k}
                    className="rounded-none bg-transparent px-0 md:px-2 py-3 text-sm font-medium text-muted-foreground hover:text-foreground border-b-2 border-transparent data-[state=active]:text-primary data-[state=active]:border-primary"
                  >
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* ---------- FILTERS แถวเดียว ---------- */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ค้นหา ลำดับ/หน่วยงาน/หัวข้อ..."
                className="w-[260px]"
              />
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="สถานะ" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((op) => (
                    <SelectItem key={op.value} value={op.value}>
                      {op.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <label className="flex items-center gap-2 rounded-md px-2 py-2">
                <Checkbox
                  checked={onlyIT}
                  onCheckedChange={(v) => setOnlyIT(!!v)}
                />
                <span className="text-sm">เฉพาะ IT</span>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (sortBy === "score") setSortAsc((s) => !s);
                  setSortBy("score");
                }}
                className={cn(sortBy === "score" && "border-primary")}
              >
                คะแนน {sortBy === "score" ? (sortAsc ? "↑" : "↓") : ""}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (sortBy === "unit") setSortAsc((s) => !s);
                  setSortBy("unit");
                }}
                className={cn(sortBy === "unit" && "border-primary")}
              >
                หน่วยงาน {sortBy === "unit" ? (sortAsc ? "↑" : "↓") : ""}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (sortBy === "index") setSortAsc((s) => !s);
                  setSortBy("index");
                }}
                className={cn(sortBy === "index" && "border-primary")}
              >
                ลำดับ {sortBy === "index" ? (sortAsc ? "↑" : "↓") : ""}
              </Button>
            </div>
          </div>

          {/* ---------- CONTENT: แยกตาม outerTab ---------- */}
          {outerTab === "summary" && (
            <SummarySection
              tab={tab}
              parents={paginatedParents}
              allRows={rawRows}
              expanded={expanded}
              setExpanded={setExpanded}
              isLoading={isLoading}
              error={!!error}
            />
          )}

          {outerTab === "reorder" && (
            <ReorderSection
              tab={tab}
              parents={orderedParents}
              onMoveUp={moveUp}
              onMoveDown={moveDown}
              isLoading={isLoading}
              error={!!error}
            />
          )}

          {outerTab === "unitRanking" && (
            <UnitRankingSection
              tab={tab}
              parents={paginatedParents}
              allRows={rawRows}
              isLoading={isLoading}
              error={!!error}
            />
          )}

          {/* ---------- Pagination (summary & reorder ใช้ร่วม) ---------- */}
          {(outerTab === "summary" || outerTab === "reorder") && (
            <>
              {shouldPaginate && (
                <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-2">
                  <div className="text-sm text-muted-foreground">
                    แสดง {paginatedParents.length} จากทั้งหมด{" "}
                    {filteredParents.length} รายการ
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      ก่อนหน้า
                    </Button>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-1">
                          หน้า {page}/{totalPages}{" "}
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-44" align="end">
                        <div className="grid grid-cols-4 gap-2">
                          {Array.from({ length: totalPages }).map((_, i) => (
                            <Button
                              key={i}
                              variant={i + 1 === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => setPage(i + 1)}
                            >
                              {i + 1}
                            </Button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === totalPages}
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                    >
                      ถัดไป
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ======================== Sections ======================== */

// 1) Summary แบบเดิม (เพิ่ม expand แสดงลูก)
function SummarySection(props: {
  tab: TabKey;
  parents: Row[];
  allRows: Row[];
  expanded: Record<string, boolean>;
  setExpanded: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  isLoading: boolean;
  error: boolean;
}) {
  const { tab, parents, allRows, expanded, setExpanded, isLoading, error } =
    props;

  // Define getChildRows in this scope
  const getChildRows = (rows: Row[], parentIndex: string) =>
    rows
      .filter((rr) => rr.index.startsWith(parentIndex + "."))
      .sort((a, b) => {
        const pa = a.index.split(".").map(Number);
        const pb = b.index.split(".").map(Number);
        if (pa[0] !== pb[0]) return pa[0] - pb[0];
        return (pa[1] ?? 0) - (pb[1] ?? 0);
      });

  const hasChild = (idx: string) =>
    allRows.some((rr) => rr.index.startsWith(idx + "."));

  const getChild = (idx: string) => getChildRows(allRows, idx);

  return (
    <div className="rounded-xl border overflow-hidden">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-muted/50">
          <TableRow>
            <TableHead className="w-[90px]">ลำดับ</TableHead>
            <TableHead>หน่วยงาน</TableHead>
            <TableHead className="align-middle !whitespace-normal break-words leading-snug">
              <span className="block max-w-[18rem] md:max-w-[32rem]">
                {DYNAMIC_HEAD[tab]}
              </span>
            </TableHead>
            <TableHead className="w-[120px]">คะแนนประเมิน</TableHead>
            <TableHead className="w-[120px]">เกรด</TableHead>
            <TableHead className="w-[170px]">สถานะการประเมินผล</TableHead>
            <TableHead className="w-[64px] text-center"></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <RowLoading colSpan={7} />
          ) : error ? (
            <RowError colSpan={7} />
          ) : parents.length === 0 ? (
            <RowEmpty colSpan={7} />
          ) : (
            parents.map((r) => {
              const isHigh = r.grade === "H";
              return (
                <Fragment key={r.id}>
                  <TableRow className={cn(isHigh && "bg-red-50/50")}>
                    <TableCell className="font-mono text-xs md:text-sm">
                      {r.index}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {r.unit}
                    </TableCell>
                    <TableCell className="text-muted-foreground align-top !whitespace-normal break-words">
                      <span
                        className="block line-clamp-2 md:line-clamp-3"
                        style={{
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 2,
                          overflow: "hidden",
                        }}
                      >
                        {topicByTab(r, tab)}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">
                      {r.score ?? "-"}
                    </TableCell>
                    <TableCell>
                      <GradeBadge grade={r.grade} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge value={r.status} />
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        {hasChild(r.index) ? (
                          <ExpandBtn
                            id={r.id}
                            expanded={expanded}
                            setExpanded={setExpanded}
                          />
                        ) : (
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="px-2"
                          >
                            <Link href={`/risk-assessment/${r.id}/edit`}>
                              แก้ไข
                            </Link>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>

                  {expanded[r.id] &&
                    getChild(r.index).map((c: Row) => (
                      <TableRow
                        key={`${r.id}-child-${c.id}`}
                        className="bg-muted/30"
                      >
                        <TableCell className="font-mono text-xs md:text-sm">
                          {c.index}
                        </TableCell>
                        <TableCell className="whitespace-nowrap pl-6">
                          {c.unit}
                        </TableCell>
                        <TableCell className="text-muted-foreground align-top !whitespace-normal break-words">
                          {topicByTab(c, tab)}
                        </TableCell>
                        <TableCell className="font-medium">
                          {c.score ?? "-"}
                        </TableCell>
                        <TableCell>
                          <GradeBadge grade={c.grade} />
                        </TableCell>
                        <TableCell>
                          <StatusBadge value={c.status} />
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="px-2"
                          >
                            <Link href={`/risk-assessment/${c.id}/edit`}>
                              แก้ไข
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </Fragment>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// 2) Reorder (มีคอลัมน์ซ้ายไว้ย้ายลำดับด้วยปุ่มขึ้น/ลง)
function ReorderSection(props: {
  tab: TabKey;
  parents: Row[];
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  isLoading: boolean;
  error: boolean;
}) {
  const { tab, parents, onMoveUp, onMoveDown, isLoading, error } = props;

  return (
    <div className="rounded-xl border overflow-hidden">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-muted/50">
          <TableRow>
            <TableHead className="w-[56px]"></TableHead>
            <TableHead className="w-[90px]">ลำดับ</TableHead>
            <TableHead>หน่วยงาน</TableHead>
            <TableHead className="align-middle !whitespace-normal break-words leading-snug">
              <span className="block max-w-[18rem] md:max-w-[32rem]">
                {DYNAMIC_HEAD[tab]}
              </span>
            </TableHead>
            <TableHead className="w-[120px]">คะแนนประเมิน</TableHead>
            <TableHead className="w-[120px]">เกรด</TableHead>
            <TableHead className="w-[170px]">สถานะการประเมินผล</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <RowLoading colSpan={7} />
          ) : error ? (
            <RowError colSpan={7} />
          ) : parents.length === 0 ? (
            <RowEmpty colSpan={7} />
          ) : (
            parents.map((r, i) => (
              <TableRow key={r.id}>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="ขึ้น"
                      onClick={() => onMoveUp(r.id)}
                      className="h-7 w-7"
                    >
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="ลง"
                      onClick={() => onMoveDown(r.id)}
                      className="h-7 w-7"
                    >
                      <MoveDown className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs md:text-sm">
                  {r.index}
                </TableCell>
                <TableCell className="whitespace-nowrap">{r.unit}</TableCell>
                <TableCell className="text-muted-foreground align-top !whitespace-normal break-words">
                  {topicByTab(r, tab)}
                </TableCell>
                <TableCell className="font-medium">{r.score ?? "-"}</TableCell>
                <TableCell>
                  <GradeBadge grade={r.grade} />
                </TableCell>
                <TableCell>
                  <StatusBadge value={r.status} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// 3) ผลลำดับความเสี่ยงหน่วยงาน (สรุปเป็นราย "หน่วยงาน" + explan เรื่องภายในทั้งหมด)
function UnitRankingSection(props: {
  tab: TabKey;
  parents: Row[]; // ไม่ได้ใช้ตรง ๆ แล้ว
  allRows: Row[]; // ใช้รวมทุกหมวด/ทุกแท็บย่อย
  isLoading: boolean;
  error: boolean;
}) {
  const { tab, allRows, isLoading, error } = props;

  // ระบุหมวดของแถว
  const getCategory = (r: Row): string => {
    if (r.work && r.work !== "-") return "งาน";
    if (r.project && r.project !== "-") return "โครงการ";
    if (r.carry && r.carry !== "-") return "กันเงินเหลื่อมปี";
    if (r.activity && r.activity !== "-") return "กิจกรรม";
    if (r.process && r.process !== "-") return "กระบวนงาน";
    if (r.system && r.system !== "-") return "IT / Non-IT";
    if (r.mission && r.mission !== "-") return "หน่วยงาน";
    return "-";
  };

  // รวม “ทุกเรื่อง” ต่อหน่วยงาน (ตัดแถวที่ไม่มีหัวข้อจริง)
  const topicOf = (r: Row) => topicByTab(r, tab) || "-";
  const isTopicRow = (r: Row) => topicOf(r) !== "-" && topicOf(r).trim() !== "";

  const groupedByUnit = useMemo(() => {
    const m = new Map<string, Row[]>();
    for (const r of allRows) {
      if (!isTopicRow(r)) continue;
      const arr = m.get(r.unit) ?? [];
      arr.push(r);
      m.set(r.unit, arr);
    }
    // สร้างอ็อบเจ็กต์สำหรับแสดงผล
    const result = Array.from(m.entries()).map(([unit, rows]) => {
      // เรียง “เรื่อง” ในหน่วยงาน (คะแนนมาก -> น้อย)
      rows.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
      // นับหมวด
      const catSet = new Set(rows.map(getCategory));
      // รวมคะแนน
      const sumMax = rows.reduce(
        (acc, r) =>
          acc +
          (Number.isFinite(r.maxScore as number) ? (r.maxScore as number) : 0),
        0
      );
      const sumScore = rows.reduce(
        (acc, r) =>
          acc + (Number.isFinite(r.score as number) ? (r.score as number) : 0),
        0
      );
      return { unit, rows, categories: catSet, sumMax, sumScore };
    });
    // เรียงหน่วยงานตาม “ผลรวมคะแนนประเมิน” มาก -> น้อย (คือ “ลำดับ”)
    result.sort((a, b) => b.sumScore - a.sumScore);
    return result;
  }, [allRows, tab]);

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  return (
    <div className="rounded-xl border overflow-hidden">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-muted/50">
          <TableRow>
            <TableHead className="w-[90px]">ลำดับ</TableHead>
            <TableHead>หน่วยงาน</TableHead>
            <TableHead className="w-[140px]">หมวดหมู่</TableHead>
            <TableHead className="align-middle !whitespace-normal break-words leading-snug">
              <span className="block max-w-[18rem] md:max-w-[32rem]">
                {DYNAMIC_HEAD[tab]}
              </span>
            </TableHead>
            <TableHead className="w-[160px]">คะแนนประเมินสูงสุด</TableHead>
            <TableHead className="w-[190px]">ผลรวมคะแนนประเมิน</TableHead>
            <TableHead className="w-[64px] text-center"></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <RowLoading colSpan={7} />
          ) : error ? (
            <RowError colSpan={7} />
          ) : groupedByUnit.length === 0 ? (
            <RowEmpty colSpan={7} />
          ) : (
            groupedByUnit.map((g, iUnit) => {
              const open = !!expanded[g.unit];
              const unitIndex = iUnit + 1;
              const topicsCount = g.rows.length;

              return (
                <Fragment key={g.unit}>
                  {/* แถวพาเรนต์: 1 แถว / 1 หน่วยงาน */}
                  <TableRow>
                    {/* ลำดับ (1, 2, 3, ...) */}
                    <TableCell className="font-mono text-xs md:text-sm">
                      {unitIndex}
                    </TableCell>

                    {/* หน่วยงาน */}
                    <TableCell className="whitespace-nowrap">
                      {g.unit}
                    </TableCell>

                    {/* หมวดหมู่: N หมวดหมู่ */}
                    <TableCell className="whitespace-nowrap">
                      {g.categories.size > 0
                        ? `${g.categories.size} หมวดหมู่`
                        : "-"}
                    </TableCell>

                    {/* หัวข้อ: “N หัวข้อ Audit Universe ที่ถูกประเมิน” (ตัด 2 บรรทัดเหมือนหน้าแรก) */}
                    <TableCell className="text-muted-foreground align-top !whitespace-normal break-words">
                      <span
                        className="block"
                        style={{
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 2,
                          overflow: "hidden",
                        }}
                        title={`${topicsCount} หัวข้อ Audit Universe ที่ถูกประเมิน`}
                      >
                        {`${topicsCount} หัวข้อ Audit Universe ที่ถูกประเมิน`}
                      </span>
                    </TableCell>

                    {/* คะแนนรวมของหน่วยงาน (sum จากทุกเรื่อง) */}
                    <TableCell className="font-medium">
                      {g.sumMax || "-"}
                    </TableCell>
                    <TableCell className="font-medium">
                      {g.sumScore || "-"}
                    </TableCell>

                    {/* ปุ่ม explan อยู่คอลัมน์ท้ายสุด */}
                    <TableCell className="text-center">
                      <ExpandBtn
                        id={g.unit}
                        expanded={expanded}
                        setExpanded={setExpanded}
                      />
                    </TableCell>
                  </TableRow>

                  {/* explan: แตกเป็น 1.1, 1.2, ... + แสดงหมวด/หัวข้อจริงเหมือนแท็บแรก */}
                  {open &&
                    g.rows.map((r, iTopic) => (
                      <TableRow key={r.id} className="bg-muted/30">
                        {/* ดัชนีลูก: 1.1, 1.2, ... */}
                        <TableCell className="font-mono text-xs md:text-sm">
                          {unitIndex}.{iTopic + 1}
                        </TableCell>

                        {/* หน่วยงานซ้ำ (ให้โชว์เพื่ออ่านง่ายเหมือนรูปตัวอย่าง) */}
                        <TableCell className="whitespace-nowrap">
                          {g.unit}
                        </TableCell>

                        {/* หมวดของเรื่อง */}
                        <TableCell className="whitespace-nowrap text-muted-foreground">
                          {getCategory(r)}
                        </TableCell>

                        {/* หัวข้อของเรื่อง (clamp 2 บรรทัด) */}
                        <TableCell className="text-muted-foreground align-top !whitespace-normal break-words">
                          <span
                            className="block"
                            style={{
                              display: "-webkit-box",
                              WebkitBoxOrient: "vertical",
                              WebkitLineClamp: 2,
                              overflow: "hidden",
                            }}
                            title={topicOf(r)}
                          >
                            {topicOf(r)}
                          </span>
                        </TableCell>

                        {/* คะแนนของเรื่อง */}
                        <TableCell>{r.maxScore ?? "-"}</TableCell>
                        <TableCell>{r.score ?? "-"}</TableCell>

                        {/* ปุ่มแก้ไข (ตามแท็บแรก) */}
                        <TableCell className="text-center">
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="px-2"
                          >
                            <Link href={`/risk-assessment/${r.id}/edit`}>
                              แก้ไข
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </Fragment>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}

/* ======================== tiny components ======================== */
function RowLoading({ colSpan }: { colSpan: number }) {
  return (
    <TableRow>
      <TableCell
        colSpan={colSpan}
        className="h-24 text-center text-muted-foreground"
      >
        กำลังโหลดข้อมูล...
      </TableCell>
    </TableRow>
  );
}
function RowError({ colSpan }: { colSpan: number }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-24 text-center text-red-600">
        โหลดข้อมูลไม่สำเร็จ
      </TableCell>
    </TableRow>
  );
}
function RowEmpty({ colSpan }: { colSpan: number }) {
  return (
    <TableRow>
      <TableCell
        colSpan={colSpan}
        className="h-24 text-center text-muted-foreground"
      >
        ไม่พบข้อมูล
      </TableCell>
    </TableRow>
  );
}

function ExpandBtn({
  id,
  expanded,
  setExpanded,
}: {
  id: string;
  expanded: Record<string, boolean>;
  setExpanded: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}) {
  const isOpen = !!expanded[id];
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="แสดงหัวข้อย่อย"
      onClick={() => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))}
    >
      {isOpen ? (
        <ChevronUp className="h-4 w-4" />
      ) : (
        <ChevronDown className="h-4 w-4" />
      )}
    </Button>
  );
}
