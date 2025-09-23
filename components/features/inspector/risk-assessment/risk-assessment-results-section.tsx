// app/(your-segment)/risk-assessment/results/page.tsx
"use client";

import { Fragment, useMemo, useState, useEffect, useCallback } from "react";
import useSWR from "swr";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, FileText, GripVertical } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  rowsByTab: Partial<Record<Exclude<TabKey, "all">, Row[]>>;
  submissionInfo?: {
    action?: string;
    submissionTime?: string;
    itemCount?: number;
  };
  reorderInfo?: {
    originalOrder?: string[];
    newOrder?: string[];
    changedItem?: string;
    reason?: string;
    hasChanges?: boolean;
    reasonById?: Record<string, string>;
  };
};

type OuterTab = "summary" | "reorder" | "unitRanking";

/* ======================== Data helpers ======================== */
const fetcher = (url: string) =>
  fetch(`${url}&_t=${Date.now()}`, {
    cache: "no-store",
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  }).then((r) => r.json() as Promise<ApiResponse>);

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

// กติกาให้เกรด (ตามตารางใหม่)
const SCORE_RULES = {
  excellentMin: 80,
  highMin: 60,
  mediumMin: 40,
  lowMin: 20,
};

// แปลงคะแนน -> เกรด
function computeGrade(score: number): Row["grade"] {
  if (score >= SCORE_RULES.excellentMin) return "E";
  if (score >= SCORE_RULES.highMin) return "H";
  if (score >= SCORE_RULES.mediumMin) return "M";
  if (score >= SCORE_RULES.lowMin) return "L";
  return "N";
}

// คำนวณคะแนนของแถว
// NOTE: ตอนนี้ใช้ค่า score ที่ API/Mock ส่งมาโดยตรง
// ถ้าภายหลังมีรายละเอียด (เช่น likelihood/impact/control) ให้นำมาแทนในฟังก์ชันนี้ได้เลย
function computeScore(r: Row): number {
  return Number.isFinite(r.score as number) ? (r.score as number) : 0;
}

/* ======================== Small UI ======================== */
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
    E: {
      txt: "สูงมาก",
      cls: "bg-red-100 text-red-700 border-red-200",
    },
    H: {
      txt: "สูง",
      cls: "bg-orange-100 text-orange-700 border-orange-200",
    },
    M: {
      txt: "ปานกลาง",
      cls: "bg-yellow-100 text-yellow-700 border-yellow-200",
    },
    L: {
      txt: "น้อย",
      cls: "bg-lime-100 text-lime-700 border-lime-200",
    },
    N: {
      txt: "น้อยมาก",
      cls: "bg-green-100 text-green-700 border-green-200",
    },
  } as const;
  const it = map[grade];
  return (
    <Badge variant="outline" className={cn("rounded-full px-2", it.cls)}>
      {it.txt}
    </Badge>
  );
}

function topicByTab(row: Row, tab: TabKey): string {
  if (tab === "unit" && row.mission && row.mission !== "-") return row.mission;
  if (tab === "work" && row.work && row.work !== "-") return row.work;
  if (tab === "project" && row.project && row.project !== "-") return row.project;
  if (tab === "carry" && row.carry && row.carry !== "-") return row.carry;
  if (tab === "activity" && row.activity && row.activity !== "-") return row.activity;
  if (tab === "process" && row.process && row.process !== "-") return row.process;
  if (tab === "it" && row.system && row.system !== "-") return row.system;
  
  // สำหรับ tab "all" หรือ fallback ให้ใช้ข้อมูลที่มีอยู่
  const candidates = [
    row.work,
    row.project,
    row.carry,
    row.activity,
    row.process,
    row.system,
    row.mission,
  ].filter((v) => v && v !== "-" && v.trim() !== "");
  
  return candidates.length > 0 ? candidates[0] : "ไม่ระบุหัวข้อ";
}

const STATUS_LABELS = {
  DONE: "ประเมินแล้ว",
  IN_PROGRESS: "กำลังประเมิน",
  NOT_STARTED: "ยังไม่ได้ประเมิน",
} as const;

// === Grouping helpers (copy วางใต้ topicByTab) ===
// ระบบการให้เกรดตามคะแนน:
// E (Excellent): 80-100 คะแนน
// H (High): 60-79 คะแนน
// M (Medium): 40-59 คะแนน
// L (Low): 20-39 คะแนน
// N (None/Not Assessed): 0-19 คะแนน
const gradeFromScore = (s?: number) =>
  !s || s <= 0
    ? "N"
    : s >= 80
    ? "E"
    : s >= 60
    ? "H"
    : s >= 40
    ? "M"
    : s >= 20
    ? "L"
    : "N";

// แปลงสถานะฝั่ง API ให้เป็นฉลากที่ UI เข้าใจ (คงคำว่า "แก้ไข" ไว้เพื่อแสดง badge ได้)
function normalizeStatus(raw?: string) {
  if (!raw) return STATUS_LABELS.NOT_STARTED;
  const t = String(raw).trim();
  if (["ประเมินแล้ว", "กำลังประเมิน", "ยังไม่ได้ประเมิน", "แก้ไข"].includes(t))
    return t;

  const u = t.toUpperCase();
  if (
    [
      "DONE",
      "COMPLETED",
      "FINISHED",
      "SUBMITTED",
      "EVALUATED",
      "EVALUATION_COMPLETED",
    ].includes(u)
  ) {
    return STATUS_LABELS.DONE;
  }
  if (["IN_PROGRESS", "DOING", "DRAFT", "STARTED", "WORKING"].includes(u)) {
    return STATUS_LABELS.IN_PROGRESS;
  }
  if (["NOT_STARTED", "PENDING", "NEW", "TO_DO", "UNASSESSED"].includes(u)) {
    return STATUS_LABELS.NOT_STARTED;
  }
  return t; // ไม่รู้จักก็แสดงตามเดิม
}

function deriveStatus(r: Row) {
  // ถ้ามีเอกสารและมีคะแนน > 0 ให้ถือว่าเสร็จแล้ว
  if (r.hasDoc && (r.score ?? 0) > 0) return STATUS_LABELS.DONE;
  return normalizeStatus(r.status);
}

function statusBucket(s: string): "DONE" | "IN_PROGRESS" | "NOT_STARTED" {
  if (s === "ประเมินแล้ว") return "DONE";
  if (s === "ยังไม่ได้ประเมิน") return "NOT_STARTED";
  // รวม "กำลังประเมิน" และ "แก้ไข" และอื่น ๆ ที่ไม่ใช่สองค่านี้เป็น IN_PROGRESS
  return "IN_PROGRESS";
}

function makeParentRow(tab: TabKey, topic: string, rows: Row[]): Row {
  const sorted = [...rows].sort((a, b) => {
    const A = a.index.split(".").map(Number);
    const B = b.index.split(".").map(Number);
    return A[0] !== B[0] ? A[0] - B[0] : (A[1] || 0) - (B[1] || 0);
  });

  const uniqUnits = Array.from(new Set(sorted.map((r) => r.unit))).filter(
    Boolean
  );
  const unitLabel =
    uniqUnits.length > 1
      ? `${uniqUnits[0]} และอีก ${uniqUnits.length - 1} หน่วยงาน`
      : uniqUnits[0] || "-";

  const totalScore = sorted.reduce((sum, r) => sum + (r.score || 0), 0);

  // คิดสถานะพาเรนต์จากสถานะของลูก (ใช้ deriveStatus + statusBucket)
  const buckets = sorted.map((r) => statusBucket(deriveStatus(r)));
  const allDone = buckets.every((b) => b === "DONE");
  const hasInProgress = buckets.some((b) => b === "IN_PROGRESS");
  const hasDone = buckets.some((b) => b === "DONE");
  const hasNotStarted = buckets.some((b) => b === "NOT_STARTED");

  let status: string;
  if (allDone) {
    status = STATUS_LABELS.DONE;
  } else if (hasInProgress || (hasDone && hasNotStarted)) {
    // ผสม DONE + NOT_STARTED หรือมี IN_PROGRESS/แก้ไข ใด ๆ => กำลังประเมิน
    status = STATUS_LABELS.IN_PROGRESS;
  } else {
    status = STATUS_LABELS.NOT_STARTED;
  }

  const base: Row = {
    id: `group:${tab}:${encodeURIComponent(topic)}`,
    index: sorted[0]?.index?.split(".")[0] || "-",
    unit: unitLabel,
    mission: "-",
    work: "-",
    project: "-",
    carry: "-",
    activity: "-",
    process: "-",
    system: "-",
    itType: "-",
    score: totalScore,
    grade: gradeFromScore(totalScore),
    status,
    hasDoc: false,
  };

  if (tab === "unit") base.mission = topic;
  else if (tab === "work") base.work = topic;
  else if (tab === "project") base.project = topic;
  else if (tab === "carry") base.carry = topic;
  else if (tab === "activity") base.activity = topic;
  else if (tab === "process") base.process = topic;
  else if (tab === "it") base.system = topic;
  if (tab === "all") base.work = topic;

  return base;
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
      score: 85,
      grade: "E", // 85 -> E (80-100 = E)
      status: "ประเมินแล้ว",
    }),
    mk({
      id: "w1-1",
      index: "1.1",
      unit: "สลก.",
      work: "มาตรการควบคุมการใช้งบประมาณ", // ชื่อเดียวกัน เพื่อให้จัดกลุ่มได้
      score: 72,
      grade: "H", // 72 -> H (60-79 = H)
      status: "ประเมินแล้ว",
    }),
    mk({
      id: "w2",
      index: "2",
      unit: "ชพน.",
      work: "งานพัสดุ",
      score: 46,
      grade: "M", // 46 -> M (40-59 = M)
      status: "ประเมินแล้ว",
    }),
    mk({
      id: "w3",
      index: "3",
      unit: "ศกส.",
      work: "งานบริหารงานบุคคล",
      score: 22,
      grade: "L", // 22 -> L (20-39 = L)
      status: "ประเมินแล้ว",
    }),
    mk({
      id: "w4",
      index: "4",
      unit: "ศสท.1",
      work: "งานสารบรรณ",
      score: 15,
      grade: "N", // 15 -> N (0-19 = N)
      status: "ประเมินแล้ว",
    }),
  ];

  const project = [
    mk({
      id: "p1",
      index: "5",
      unit: "ศกส.",
      project: "โครงการพัฒนาฐานข้อมูลเกษตรกร",
      score: 67,
      grade: "H", // 67 -> H (60-79 = H)
      status: "ประเมินแล้ว",
    }),
    mk({
      id: "p2",
      index: "6",
      unit: "ชพน.",
      project: "โครงการยกระดับการบริการ",
      score: 41,
      grade: "M", // 41 -> M (40-59 = M)
      status: "ประเมินแล้ว",
    }),
  ];

  const activity = [
    mk({
      id: "a1",
      index: "7",
      unit: "ชพน.ในสังกัด",
      activity: "ผลผลิต 1: พัฒนาระบบข้อมูล",
      score: 83,
      grade: "E", // 83 -> E (80-100 = E)
      status: "ประเมินแล้ว",
    }),
    mk({
      id: "a2",
      index: "8",
      unit: "สลก.",
      activity: "ผลผลิต 2: ปรับปรุงกระบวนการ",
      score: 38,
      grade: "L", // 38 -> L (20-39 = L)
      status: "ประเมินแล้ว",
    }),
  ];

  const process = [
    mk({
      id: "pr1",
      index: "9",
      unit: "ศกส.",
      process: "กระบวนงาน: บัญชีการเงิน",
      score: 61,
      grade: "H", // 61 -> H (60-79 = H)
      status: "ประเมินแล้ว",
    }),
    mk({
      id: "pr2",
      index: "10",
      unit: "ชพน.",
      process: "กระบวนงาน: การควบคุมภายใน",
      score: 44,
      grade: "M", // 44 -> M (40-59 = M)
      status: "ประเมินแล้ว",
    }),
  ];

  const unit = [
    mk({
      id: "u1",
      index: "11",
      unit: "ศกส.",
      mission: "ภารกิจ: บริหารจัดการ",
      score: 52,
      grade: "M", // 52 -> M (40-59 = M)
      status: "ประเมินแล้ว",
    }),
    mk({
      id: "u2",
      index: "12",
      unit: "สลก.",
      mission: "ภารกิจ: การเงินและงบประมาณ",
      score: 29,
      grade: "L", // 29 -> L (20-39 = L)
      status: "ประเมินแล้ว",
    }),
  ];

  const it = [
    mk({
      id: "it1",
      index: "13",
      unit: "ศกส.",
      system: "Big Data Analytics",
      score: 74,
      grade: "H", // 74 -> H (60-79 = H)
      status: "ประเมินแล้ว",
      itType: "IT",
    }),
    mk({
      id: "it2",
      index: "14",
      unit: "ชพน.",
      system: "ระบบบริหารเอกสาร",
      score: 35,
      grade: "L", // 35 -> L (20-39 = L)
      status: "ประเมินแล้ว",
      itType: "Non-IT",
    }),
  ];

  const carry = [
    mk({
      id: "c1",
      index: "15",
      unit: "ศกส.",
      carry: "กันเงินเหลื่อมปีระบบ Coaching Platform",
      score: 18,
      grade: "N", // 18 -> N (0-19 = N)
      status: "ประเมินแล้ว",
    }),
  ];

  return { work, project, activity, process, unit, it, carry };
}

type ResultsProps = {
  fullWidth?: boolean;
  className?: string;
  outerTab?: OuterTab;
  onOuterTabChange?: (v: OuterTab) => void;
  filter?: {
    grade?: "E" | "H" | "M" | "L" | "N";
    category?: string;
  };
  sortBy?: "index" | "score" | "unit";
  sortDir?: "desc" | "asc";
  onSortByChange?: (by: "index" | "score" | "unit") => void;
  onSortDirChange?: (dir: "desc" | "asc") => void;
  onDataChange?: (data: {
    donut?: Array<{ key: string; name: string; value: number; color: string; grade: string }>;
    stacked?: Array<{ name: string; veryHigh: number; high: number; medium: number; low: number; veryLow: number }>;
    matrix?: Array<{ category: string; veryLow: number; low: number; medium: number; high: number; veryHigh: number }>;
  }) => void;
  showCompare?: boolean; // แสดงโหมดเปรียบเทียบ
  compareYear?: number; // ปีที่จะเปรียบเทียบ
  currentYear?: number; // ปีปัจจุบัน
  overrideData?: {
    submissionInfo?: { action?: string };
    reorderInfo?: {
      hasChanges?: boolean;
      newOrder?: string[];
      originalOrder?: string[];
      changedItem?: string;
      reason?: string;
      reasonById?: Record<string, string>;
    };
    [key: string]: unknown;
  }; // ข้อมูลที่ส่งมาจาก parent (ใช้แทน useSWR)
  hideDocumentIcon?: boolean; // ซ่อนไอคอนเอกสาร
  hideEditButton?: boolean; // ซ่อนปุ่มแก้ไข
  hideStatusColumn?: boolean; // ซ่อนคอลัมน์สถานะการประเมินผล
};

function getCategory(r: Row): string {
  if (r.work && r.work !== "-") return "งาน";
  if (r.project && r.project !== "-") return "โครงการ";
  if (r.carry && r.carry !== "-") return "โครงการกันเงินเหลื่อมปี";
  if (r.activity && r.activity !== "-") return "กิจกรรม";
  if (r.process && r.process !== "-") return "กระบวนงาน";
  if (r.system && r.system !== "-") return "IT/Non-IT";
  if (r.mission && r.mission !== "-") return "หน่วยงาน";
  return "-";
}

/* ======================== Page Component ======================== */
export default function RiskAssessmentResultsSectionPage({
  fullWidth = true,
  className = "",
  outerTab: outerTabProp,
  filter,
  sortBy = "score",
  sortDir = "desc",

  onDataChange,
  showCompare = false,
  compareYear,
  currentYear = 2568,
  overrideData,
  hideDocumentIcon = false,
  hideEditButton = false,
  hideStatusColumn = false,
}: ResultsProps) {
  // โหมดชั้นนอก (ไม่มี UI เปลี่ยน แต่ยังรองรับผ่าน props)
  const [outerTabUncontrolled] =
    useState<OuterTab>("summary");
  const outerTab = outerTabProp ?? outerTabUncontrolled;

  // ชนิดข้อมูลชั้นใน (ตัด UI ออก เหลือค่าเริ่มต้น “all”)
  const [tab, setTab] = useState<TabKey>("all");

  const [year] = useState("2568");

  const PAGE_SIZE = 200;
  const [page, setPage] = useState(1);

  // ใช้ overrideData ถ้ามี ไม่งั้นใช้ useSWR
  const swrResult = useSWR<ApiResponse>(
    overrideData ? null : `/api/chief-risk-assessment-results?year=${year}`,
    fetcher
  );
  
  const data = overrideData || swrResult.data;
  const error = swrResult.error;
  const isLoading = overrideData ? false : swrResult.isLoading;

  console.log("📊 Data source in component:", {
    hasOverrideData: !!overrideData,
    hasSWRData: !!swrResult.data,
    finalDataSource: overrideData ? "overrideData" : "SWR",
    hasReorderInfo: !!data?.reorderInfo,
    submissionAction: data?.submissionInfo?.action,
    isLoading
  });

  // rows - ตรวจสอบข้อมูลการจัดลำดับใหม่
  const rowsByTab = useMemo(() => {
    console.log("🔄 Chief Inspector - Processing data:", {
      hasData: !!data,
      isLoading,
      error: !!error,
      hasRowsByTab: !!data?.rowsByTab,
      hasReorderInfo: !!data?.reorderInfo,
      action: data?.submissionInfo?.action,
      submissionTime: data && typeof data === 'object' && 'submissionTime' in data ? data.submissionTime : undefined,
      rowsByTabKeys: data?.rowsByTab ? Object.keys(data.rowsByTab) : []
    });

    // ถ้ายังโหลดอยู่ให้ return empty object เพื่อไม่แสดงข้อมูล mock
    if (isLoading) {
      console.log("⏳ Still loading, returning empty data");
      return {};
    }

    // ถ้ามี error ให้ใช้ mock data เฉพาะเมื่อไม่มีข้อมูลเก่า
    if (error && !data) {
      console.log("❌ Error loading data and no cached data, using mock rows");
      return buildMockRows();
    }

    // ตรวจสอบว่ามีข้อมูลจริงจาก API หรือไม่
    const hasValidRowsByTab = data?.rowsByTab && 
      Object.values(data.rowsByTab).some((v) => Array.isArray(v) && v.length > 0);

    if (hasValidRowsByTab) {
      console.log("✅ Using submitted data from Inspector", {
        tabsWithData: Object.entries(data!.rowsByTab!).map(([key, value]) => 
          ({ tab: key, count: Array.isArray(value) ? value.length : 0 })
        )
      });
      
      if (data?.reorderInfo?.hasChanges) {
        console.log("🔄 Data includes reorder changes");
      }
      return data!.rowsByTab as ApiResponse["rowsByTab"];
    } else {
      console.log("⚠️ No valid rowsByTab data available", {
        hasData: !!data,
        hasRowsByTab: !!data?.rowsByTab,
        rowsByTabType: typeof data?.rowsByTab,
        rowsByTabKeys: data?.rowsByTab ? Object.keys(data.rowsByTab) : 'no keys'
      });
      return {};
    }
  }, [data, isLoading, error]);

  const getTabRows = useCallback((k: Exclude<TabKey, "all">): Row[] => rowsByTab[k] ?? [], [rowsByTab]);

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
    [getTabRows]
  );

  // เดิม: const rawRows = useMemo(() => (tab === "all" ? allRows : getTabRows(tab)), [tab, allRows, rowsByTab]);

  const rawRows: Row[] = useMemo(() => {
    let rows = tab === "all" ? allRows : getTabRows(tab);

    // Apply filters
    if (filter?.grade) {
      rows = rows.filter((r) => r.grade === filter.grade);
    }
    if (filter?.category) {
      rows = rows.filter((r) => getCategory(r) === filter.category);
    }

    return rows;
  }, [tab, allRows, getTabRows, filter]);

  // === Group rows by duplicated topic ===
  const groupingEnabled = true;

  const { parentRows, groupChildren } = useMemo(() => {
    if (!groupingEnabled) {
      return {
        parentRows: rawRows,
        groupChildren: {} as Record<string, Row[]>,
      };
    }

    const buckets = new Map<string, Row[]>();
    for (const r of rawRows) {
      const topic = topicByTab(r, tab).trim();
      const key = topic && topic !== "-" ? topic : `__single__:${r.id}`;
      const list = buckets.get(key) ?? [];
      list.push(r);
      buckets.set(key, list);
    }

    const parents: Row[] = [];
    const childrenMap: Record<string, Row[]> = {};

    for (const [topic, rows] of buckets) {
      if (!topic.startsWith("__single__") && rows.length > 1) {
        const parent = makeParentRow(tab, topic, rows);
        parents.push(parent);

        const sortedChildren = [...rows].sort((a, b) => {
          const A = a.index.split(".").map(Number);
          const B = b.index.split(".").map(Number);
          return A[0] !== B[0] ? A[0] - B[0] : (A[1] || 0) - (B[1] || 0);
        });
        childrenMap[parent.id] = sortedChildren;
      } else {
        parents.push(rows[0]);
      }
    }

    // เรียงพาเรนต์ตาม index หลัก
    parents.sort((a, b) => {
      const A = a.index.split(".").map(Number);
      const B = b.index.split(".").map(Number);
      return A[0] !== B[0] ? A[0] - B[0] : (A[1] || 0) - (B[1] || 0);
    });

    return { parentRows: parents, groupChildren: childrenMap };
  }, [rawRows, tab, groupingEnabled]);

  // ✅ NEW: Map คำนวณคะแนน/เกรดให้ทุกแถว
  const evaluatedRows: Row[] = useMemo(
    () =>
      parentRows.map((r) => {
        const s = computeScore(r);
        const g = computeGrade(s);
        // คืนค่าแบบ immmutable — ให้ UI ไปใช้ score/grade ที่คำนวณเสมอ
        return { ...r, score: s, grade: g };
      }),
    [parentRows]
  );

  // ✅ คำนวณข้อมูลสำหรับ Dashboard จากตารางจริง
  const dashboardData = useMemo(() => {
    // ใช้เฉพาะ parent rows (เหมือนกับที่แสดงในตาราง)
    const finalParentRows = evaluatedRows.filter((r) => !r.index.includes("."));

    console.log("🔍 Dashboard Data Calculation:", {
      evaluatedRowsCount: evaluatedRows.length,
      parentRowsCount: finalParentRows.length,
      parentRows: finalParentRows.map((r) => ({
        id: r.id,
        index: r.index,
        grade: r.grade,
        score: r.score,
      })),
      filter: filter,
    });

    // นับจำนวนตามเกรด (ใช้เฉพาะ parent rows)
    const gradeCounts = finalParentRows.reduce(
      (acc, row) => {
        // แปลง grade จาก API ให้เป็นระบบเดียวกัน
        const normalizedGrade = row.grade === "-" ? "N" : row.grade;

        if (normalizedGrade === "E") acc.excellent++;
        else if (normalizedGrade === "H") acc.high++;
        else if (normalizedGrade === "M") acc.medium++;
        else if (normalizedGrade === "L") acc.low++;
        else if (normalizedGrade === "N" || normalizedGrade === "-") acc.none++;
        return acc;
      },
      { excellent: 0, high: 0, medium: 0, low: 0, none: 0 }
    );

    console.log("📊 Grade Counts:", gradeCounts);

    // สร้างข้อมูลโดนัท
    const donut: Array<{ key: string; name: string; value: number; color: string; grade: string }> = [];
    if (gradeCounts.excellent > 0) {
      donut.push({
        key: "excellent",
        name: "สูงมาก",
        value: gradeCounts.excellent,
        color: "#DC2626",
        grade: "E",
      });
    }
    if (gradeCounts.high > 0) {
      donut.push({
        key: "high",
        name: "สูง",
        value: gradeCounts.high,
        color: "#EA580C",
        grade: "H",
      });
    }
    if (gradeCounts.medium > 0) {
      donut.push({
        key: "medium",
        name: "ปานกลาง",
        value: gradeCounts.medium,
        color: "#FACC15",
        grade: "M",
      });
    }
    if (gradeCounts.low > 0) {
      donut.push({
        key: "low",
        name: "น้อย",
        value: gradeCounts.low,
        color: "#65A30D",
        grade: "L",
      });
    }
    if (gradeCounts.none > 0) {
      donut.push({
        key: "none",
        name: "น้อยมาก",
        value: gradeCounts.none,
        color: "#16A34A",
        grade: "N",
      });
    }

    console.log("🍩 Donut Data:", donut);

    // จัดกลุ่มตามประเภท (ใช้เฉพาะ parent rows)
    const categoryMap = new Map<
      string,
      { E: number; H: number; M: number; L: number; N: number }
    >();

    finalParentRows.forEach((row) => {
      const category = getCategory(row);
      if (category === "-") return; // ข้ามรายการที่ไม่มีหมวดหมู่

      if (!categoryMap.has(category)) {
        categoryMap.set(category, { E: 0, H: 0, M: 0, L: 0, N: 0 });
      }

      const counts = categoryMap.get(category)!;
      const normalizedGrade = row.grade === "-" ? "N" : row.grade;

      if (normalizedGrade === "E") counts.E++;
      else if (normalizedGrade === "H") counts.H++;
      else if (normalizedGrade === "M") counts.M++;
      else if (normalizedGrade === "L") counts.L++;
      else if (normalizedGrade === "N" || normalizedGrade === "-") counts.N++;
    });

    // สร้างข้อมูลแท่งซ้อน
    const stacked = Array.from(categoryMap.entries()).map(([name, counts]) => ({
      name,
      veryHigh: counts.E,
      high: counts.H,
      medium: counts.M,
      low: counts.L,
      veryLow: counts.N,
    }));

    // สร้างข้อมูลเมทริกซ์
    const matrix = Array.from(categoryMap.entries()).map(
      ([category, counts]) => ({
        category,
        veryLow: counts.N,
        low: counts.L,
        medium: counts.M,
        high: counts.H,
        veryHigh: counts.E,
      })
    );

    return { donut, stacked, matrix };
  }, [evaluatedRows, filter]); // ยังคงใช้ evaluatedRows เป็น dependency เพราะ parentRows มาจากมัน

  // ส่งข้อมูลไปยัง parent component
  useEffect(() => {
    if (onDataChange && evaluatedRows.length > 0) {
      onDataChange(dashboardData);
    }
  }, [dashboardData, onDataChange, evaluatedRows.length]);

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // เฉพาะ parent (index ไม่มี “.”) + คงลำดับเดิม
  const filteredParents = useMemo(() => {
    const parents = evaluatedRows.filter((r) => !r.index.includes("."));

    console.log("📋 Table Data (filteredParents):", {
      count: parents.length,
      parents: parents.map((r) => ({
        id: r.id,
        index: r.index,
        grade: r.grade,
        score: r.score,
      })),
      sortBy: sortBy,
      sortDir: sortDir,
    });

    // เรียงตาม sortBy และ sortDir
    const usedSortBy = outerTab === "summary" ? "index" : sortBy || "index";
    const usedSortAsc = outerTab === "summary" ? true : sortDir === "asc";

    parents.sort((a: { score?: number; index?: string; unit?: string }, b: { score?: number; index?: string; unit?: string }) => {
      const dir = usedSortAsc ? 1 : -1;

      if (usedSortBy === "score") return ((a.score || 0) - (b.score || 0)) * dir;
      if (sortBy === "unit")
        return String(a.unit).localeCompare(String(b.unit)) * dir;

      // default: เรียงตาม index
      const parseIdx = (s: string) => s.split(".").map(Number);
      const [a1, a2 = 0] = parseIdx(a.index ?? "");
      const [b1, b2 = 0] = parseIdx(b.index ?? "");
      if (a1 !== b1) return (a1 - b1) * dir;
      return (a2 - b2) * dir;
    });

    return parents;
  }, [evaluatedRows, sortBy, sortDir, outerTab]);

  // pagination
  const shouldPaginate = filteredParents.length > PAGE_SIZE;
  const totalPages = shouldPaginate
    ? Math.ceil(filteredParents.length / PAGE_SIZE)
    : 1;
  const paginatedParents = shouldPaginate
    ? filteredParents.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    : filteredParents;

  /* ---------- Reorder state & actions ---------- */
  const [orderIds, setOrderIds] = useState<string[] | null>(null);
  const orderedParents = useMemo(() => {
    console.log("🔍 orderedParents useMemo called:", {
      outerTab,
      tab,
      hasData: !!data,
      dataAction: data && typeof data === 'object' && 'action' in data ? data.action : undefined,
      hasRowsByTab: !!rowsByTab,
      rowsByTabKeys: rowsByTab ? Object.keys(rowsByTab) : [],
      hasReorderInfo: !!data?.reorderInfo,
      filteredParentsCount: filteredParents.length
    });

    // สำหรับ overview page: ถ้ามีข้อมูลจาก rowsByTab ที่จัดลำดับแล้ว ให้ใช้เลย
    const isReorderAction = (data && typeof data === 'object' && 'action' in data && data.action === "submit_reorder") || 
                           data?.submissionInfo?.action === "submit_reorder";
    
    // ตรวจสอบว่าเป็น reorder mode และมีข้อมูล reorder หรือไม่
    if (outerTab === "reorder" && (isReorderAction || data?.reorderInfo)) {
      console.log("🎯 In reorder mode, checking for data:", {
        isReorderAction,
        hasReorderInfo: !!data?.reorderInfo,
        hasRowsByTab: !!rowsByTab,
        rowsByTabKeys: rowsByTab ? Object.keys(rowsByTab) : [],
        currentTab: tab
      });
      
      // ลองใช้ข้อมูลจาก rowsByTab ก่อน
      if (rowsByTab && Object.keys(rowsByTab).length > 0) {
        const rowsByTabRecord = rowsByTab as Record<string, unknown[]>;
        // ลองหา tab "all" ก่อน แล้วค่อยหา tab ที่เจาะจง
        const reorderedData = rowsByTabRecord["all"] || rowsByTabRecord[tab] || [];
        const validRows = reorderedData.filter((item: unknown): item is Row => 
          Boolean(item && typeof item === 'object' && 'id' in item)
        );
        
        if (validRows.length > 0) {
          console.log("🔄 Using data from rowsByTab:", {
            source: rowsByTabRecord["all"] ? "all" : tab,
            rowCount: validRows.length,
            rowIds: validRows.map((r: Row) => r.id).slice(0, 5), // แสดงแค่ 5 ตัวแรก
            hasReorderInfo: !!data?.reorderInfo
          });
          return validRows;
        } else {
          console.log("⚠️ No valid rows found in rowsByTab:", {
            availableTabs: Object.keys(rowsByTabRecord),
            tabData: rowsByTabRecord[tab] ? `${(rowsByTabRecord[tab] as unknown[]).length} items` : 'null',
            allData: rowsByTabRecord["all"] ? `${(rowsByTabRecord["all"] as unknown[]).length} items` : 'null'
          });
        }
      }
    }

    // ถ้ามีข้อมูลจาก Inspector (reorderInfo) ให้ใช้ลำดับนั้นก่อน
    if (
      data?.reorderInfo?.newOrder &&
      Array.isArray(data.reorderInfo.newOrder) &&
      data.reorderInfo.newOrder.length > 0
    ) {
      console.log("🔄 Using reorder data from Inspector:", {
        originalOrder: data.reorderInfo.originalOrder,
        newOrder: data.reorderInfo.newOrder,
        changedItem: data.reorderInfo.changedItem,
        reason: data.reorderInfo.reason,
        reasonById: data.reorderInfo.reasonById,
        hasChanges: data.reorderInfo.hasChanges,
        filteredParentsIds: filteredParents.map((p) => p.id),
        outerTab,
        currentTab: tab
      });

      // ใช้ filteredParents เพื่อให้ครอบคลุมข้อมูลทั้งหมด
      const allParents = filteredParents;
      const map = new Map(allParents.map((r) => [r.id, r]));

      // จัดลำดับตาม newOrder ที่ส่งมาจาก Inspector
      const reorderedRows = data.reorderInfo.newOrder
        .map((id: string) => map.get(id))
        .filter((row: Row | undefined): row is Row => row !== undefined);

      console.log("✅ Reordered rows in overview:", {
        newOrderCount: data.reorderInfo.newOrder.length,
        reorderedCount: reorderedRows.length,
        reorderedIds: reorderedRows.map((r: Row) => r.id),
        allParentsCount: allParents.length,
        missingIds: data.reorderInfo.newOrder.filter((id: string) => !map.has(id))
      });

      // ถ้าจัดลำดับไม่ครบ ให้เติมที่เหลือ
      const newOrderSet = new Set(data.reorderInfo.newOrder);
      const remainingRows = allParents.filter((r) => !newOrderSet.has(r.id));

      if (remainingRows.length > 0) {
        console.log("📝 Adding remaining rows:", remainingRows.map((r) => r.id));
      }

      return [...reorderedRows, ...remainingRows];
    }

    // ถ้าไม่มีข้อมูลจาก Inspector ให้ใช้ orderIds ภายในหน้า
    if (!orderIds) {
      console.log("🔄 No reorder data, using paginatedParents:", {
        count: paginatedParents.length,
        ids: paginatedParents.map((p) => p.id)
      });
      return paginatedParents;
    }
    
    const map = new Map(paginatedParents.map((r) => [r.id, r]));
    const result = orderIds.map((id) => map.get(id)!).filter(Boolean);
    console.log("🔄 Using local orderIds:", {
      orderIdsCount: orderIds.length,
      resultCount: result.length,
      orderIds,
      resultIds: result.map((r) => r.id)
    });
    return result;
  }, [orderIds, paginatedParents, data, outerTab, rowsByTab, tab, filteredParents]);




  return (
    <div
      className={cn(
        fullWidth
          ? "w-full p-4 md:p-6 space-y-4"
          : "mx-auto max-w-[1200px] p-4 md:p-6 space-y-4",
        className
      )}
    >
      <Card className="border-dashed">
        <CardContent className="space-y-4">
          <div className="overflow-x-auto">
            <Tabs
              value={tab}
              onValueChange={(v) => {
                setTab(v as TabKey);
                setPage(1); // รีเซ็ตหน้าเวลาสลับแท็บ
                setOrderIds(null); // ถ้ามีโหมด reorder อยู่
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

          {!showCompare && outerTab === "summary" && (
            <SummarySection
              tab={tab}
              parents={paginatedParents} // <- ได้จาก filteredParents ซึ่งมาจาก evaluatedRows
              allRows={evaluatedRows} // <- ใช้ evaluatedRows
              expanded={expanded}
              setExpanded={setExpanded}
              isLoading={isLoading}
              error={!!error}
              hasData={Object.keys(rowsByTab).length > 0 && evaluatedRows.length > 0}
              groupChildren={groupChildren} // << เพิ่ม
              hideDocumentIcon={hideDocumentIcon}
              hideStatusColumn={hideStatusColumn}
            />
          )}

          {!showCompare && outerTab === "reorder" && (
            <ReorderSection
              tab={tab}
              parents={orderedParents}
              reasonById={data?.reorderInfo?.reasonById || {}}
              isLoading={isLoading}
              error={!!error}
              readOnly={true} // หน้า overview เป็นแค่แสดงผล ไม่ให้แก้ไข
            />
          )}

          {!showCompare && outerTab === "unitRanking" && (
            <UnitRankingSection
              tab={tab}
              parents={paginatedParents}
              allRows={rawRows}
              isLoading={isLoading}
              error={!!error}
              sortDir={sortDir}
              hideEditButton={hideEditButton}
            />
          )}

          {showCompare && (
            <CompareSection
              tab={tab}
              currentYear={currentYear}
              compareYear={compareYear}
              allCurrentRows={evaluatedRows}
              isLoading={isLoading}
              error={!!error}
            />
          )}

          {(outerTab === "summary" ||
            outerTab === "reorder" ||
            outerTab === "unitRanking") &&
            !showCompare &&
            shouldPaginate && (
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
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    ถัดไป
                  </Button>
                </div>
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ======================== Sections ======================== */
function SummarySection(props: {
  tab: TabKey;
  parents: Row[];
  allRows: Row[]; // unused (คงพารามิเตอร์ไว้)
  expanded: Record<string, boolean>;
  setExpanded: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  isLoading: boolean;
  error: boolean;
  hasData: boolean;
  groupChildren: Record<string, Row[]>;
  hideDocumentIcon?: boolean;
  hideStatusColumn?: boolean;
}) {
  const {
    tab,
    parents,
    expanded,
    setExpanded,
    isLoading,
    error,
    hasData,
    groupChildren,
    hideDocumentIcon = false,
    hideStatusColumn = false,
  } = props;

  return (
    <div className="rounded-xl border overflow-hidden">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-muted/50">
          <TableRow>
            <TableHead className="w-[90px]">ลำดับ</TableHead>
            <TableHead>หน่วยงาน</TableHead>
            <TableHead className="w-[44px] text-center"></TableHead>
            <TableHead className="align-middle !whitespace-normal break-words leading-snug">
              <span className="block max-w-[18rem] md:max-w-[32rem]">
                {DYNAMIC_HEAD[tab]}
              </span>
            </TableHead>
            <TableHead className="w-[120px]">คะแนนประเมิน</TableHead>
            <TableHead className="w-[120px]">เกรด</TableHead>
            {!hideStatusColumn && (
              <TableHead className="w-[170px]">สถานะการประเมินผล</TableHead>
            )}
            <TableHead className="w-[64px] text-center"></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading && !hasData ? (
            <RowLoading colSpan={hideStatusColumn ? 7 : 8} />
          ) : error ? (
            <RowError colSpan={hideStatusColumn ? 7 : 8} />
          ) : !hasData ? (
            <TableRow>
              <TableCell
                colSpan={hideStatusColumn ? 7 : 8}
                className="h-24 text-center text-muted-foreground"
              >
                รอการส่งข้อมูลจากหน่วยตรวจสอบภายใน
              </TableCell>
            </TableRow>
          ) : parents.length === 0 ? (
            <RowEmpty colSpan={8} />
          ) : (
            parents.map((r) => {
              const isHigh = r.grade === "H";
              const children = groupChildren[r.id] ?? [];
              const hasChildren = children.length > 0;
              const isOpen = !!expanded[r.id];

              return (
                <Fragment key={r.id}>
                  <TableRow className={cn(isHigh && "bg-red-50/50")}>
                    <TableCell className="font-mono text-xs md:text-sm">
                      {r.index}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {r.unit}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        {hasChildren && (
                          <ExpandBtn
                            id={r.id}
                            expanded={expanded}
                            setExpanded={setExpanded}
                          />
                        )}
                      </div>
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
                    {!hideStatusColumn && (
                      <TableCell>
                        <StatusBadge value={r.status} />
                      </TableCell>
                    )}
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        {!hasChildren && !hideDocumentIcon && r.hasDoc && (
                          <Button
                            asChild
                            variant="ghost"
                            size="icon"
                            aria-label="กรอก/ดูเอกสาร"
                          >
                            <Link href={`/risk-evaluation-form/${r.id}`}>
                              <FileText className="h-4 w-4" />
                            </Link>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>

                  {isOpen &&
                    hasChildren &&
                    children.map((c, i) => {
                      const displayIndex = `${r.index}.${i + 1}`;
                      return (
                        <TableRow
                          key={`${r.id}-child-${c.id}`}
                          className="bg-muted/30"
                        >
                          <TableCell className="font-mono text-xs md:text-sm">
                            {displayIndex}
                          </TableCell>
                          <TableCell className="whitespace-nowrap pl-6">
                            {c.unit}
                          </TableCell>
                          <TableCell>
                            {/* Empty cell for expand button column */}
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
                              {topicByTab(c, tab)}
                            </span>
                          </TableCell>
                          <TableCell className="font-medium">
                            {c.score ?? "-"}
                          </TableCell>
                          <TableCell>
                            <GradeBadge grade={c.grade} />
                          </TableCell>
                          {!hideStatusColumn && (
                            <TableCell>
                              <StatusBadge value={deriveStatus(c)} />
                            </TableCell>
                          )}
                          <TableCell className="text-center">
                            {!hideDocumentIcon && c.hasDoc && (
                              <Button
                                asChild
                                variant="ghost"
                                size="icon"
                                aria-label="กรอก/ดูเอกสาร"
                              >
                                <Link href={`/risk-evaluation-form/${c.id}`}>
                                  <FileText className="h-4 w-4" />
                                </Link>
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </Fragment>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// ReorderSection สำหรับหน้า Overview (แสดงผลเท่านั้น ไม่มีฟังก์ชัน drag)
function ReorderSection(props: {
  tab: TabKey;
  parents: Row[];
  onReorderByDrag?: (newIds: string[], movedId: string) => void;
  reasonById: Record<string, string>;
  onUpdateReason?: (id: string, reason: string) => void;
  isLoading: boolean;
  error: boolean;
  readOnly?: boolean; // เพิ่ม prop สำหรับโหมดอ่านอย่างเดียว
}) {
  const {
    tab,
    parents,
    isLoading,
    error,
    reasonById,
    readOnly = false, // default เป็น false (มีฟังก์ชัน drag)
  } = props;

  return (
    <div className="rounded-xl border overflow-hidden">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-muted/50">
          <TableRow>
            {/* ซ่อนคอลัมน์ drag ถ้าเป็น readOnly */}
            {!readOnly && <TableHead className="w-[44px]"></TableHead>}
            <TableHead className="w-[90px]">ลำดับ</TableHead>
            <TableHead>หน่วยงาน</TableHead>
            <TableHead className="align-middle !whitespace-normal break-words leading-snug">
              <span className="block max-w-[18rem] md:max-w-[32rem]">
                {DYNAMIC_HEAD[tab]}
              </span>
            </TableHead>
            <TableHead className="w-[120px]">คะแนนประเมิน</TableHead>
            <TableHead className="w-[120px]">เกรด</TableHead>
            <TableHead className="w-[220px]">เหตุผล</TableHead>
            {/* ซ่อนคอลัมน์แก้ไขถ้าเป็น readOnly */}
            {!readOnly && <TableHead className="w-[100px]">แก้ไข</TableHead>}
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <RowLoading colSpan={readOnly ? 6 : 8} />
          ) : error ? (
            <RowError colSpan={readOnly ? 6 : 8} />
          ) : parents.length === 0 ? (
            <RowEmpty colSpan={readOnly ? 6 : 8} />
          ) : (
            parents.map((r, index) => {
              return (
                <TableRow key={r.id}>
                  {/* ซ่อนคอลัมน์ drag ถ้าเป็น readOnly */}
                  {!readOnly && (
                    <TableCell className="text-center">
                      <button
                        aria-label="ลากเพื่อจัดลำดับ"
                        draggable
                        className="h-7 w-7 inline-flex items-center justify-center rounded hover:bg-muted cursor-grab active:cursor-grabbing"
                        title="ลากเพื่อจัดลำดับ"
                      >
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </TableCell>
                  )}

                  <TableCell className="font-mono text-xs md:text-sm">
                    {readOnly ? index + 1 : r.index}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{r.unit}</TableCell>
                  <TableCell className="text-muted-foreground align-top !whitespace-normal break-words">
                    {topicByTab(r, tab)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {r.score ?? "-"}
                  </TableCell>
                  <TableCell>
                    <GradeBadge grade={r.grade} />
                  </TableCell>

                  {/* คอลัมน์เหตุผล */}
                  <TableCell className="text-muted-foreground align-top !whitespace-normal break-words">
                    {reasonById[r.id]?.trim() ? reasonById[r.id] : "-"}
                  </TableCell>

                  {/* ซ่อนคอลัมน์แก้ไขถ้าเป็น readOnly */}
                  {!readOnly && (
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                      >
                        แก้ไข
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function UnitRankingSection(props: {
  tab: TabKey;
  parents: Row[];
  allRows: Row[];
  isLoading: boolean;
  error: boolean;
  sortDir: "desc" | "asc";
  hideEditButton?: boolean;
}) {
  const { tab, allRows, isLoading, error, sortDir, hideEditButton = false } = props;
  const topicOf = useCallback((r: Row) => topicByTab(r, tab) || "-", [tab]);
  const isTopicRow = useCallback((r: Row) => topicOf(r) !== "-" && topicOf(r).trim() !== "", [topicOf]);

  const groupedByUnit = useMemo(() => {
    const m = new Map<string, Row[]>();
    for (const r of allRows) {
      if (!isTopicRow(r)) continue;
      const arr = m.get(r.unit) ?? [];
      arr.push(r);
      m.set(r.unit, arr);
    }
    const result = Array.from(m.entries()).map(([unit, rows]) => {
      // เรียงข้อมูลภายในแต่ละหน่วยงานตาม sortDir
      if (sortDir === "desc") {
        // มาก ไป น้อย (คะแนนสูงสุดไปต่ำสุด)
        rows.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
      } else {
        // น้อย ไป มาก (คะแนนต่ำสุดไปสูงสุด)
        rows.sort((a, b) => (a.score ?? 0) - (b.score ?? 0));
      }

      const catSet = new Set(rows.map(getCategory));
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

    // เรียงหน่วยงานตาม sortDir
    if (sortDir === "desc") {
      // มาก ไป น้อย (คะแนนรวมสูงสุดไปต่ำสุด)
      result.sort((a, b) => b.sumScore - a.sumScore);
    } else {
      // น้อย ไป มาก (คะแนนรวมต่ำสุดไปสูงสุด)
      result.sort((a, b) => a.sumScore - b.sumScore);
    }
    return result;
  }, [allRows, sortDir, isTopicRow]);

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
                  <TableRow>
                    <TableCell className="font-mono text-xs md:text-sm">
                      {unitIndex}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {g.unit}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {g.categories.size > 0
                        ? `${g.categories.size} หมวดหมู่`
                        : "-"}
                    </TableCell>
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
                    <TableCell className="font-medium">
                      {g.sumMax || "-"}
                    </TableCell>
                    <TableCell className="font-medium">
                      {g.sumScore || "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      <ExpandBtn
                        id={g.unit}
                        expanded={expanded}
                        setExpanded={setExpanded}
                      />
                    </TableCell>
                  </TableRow>

                  {open &&
                    g.rows.map((r, iTopic) => (
                      <TableRow key={r.id} className="bg-muted/30">
                        <TableCell className="font-mono text-xs md:text-sm">
                          {unitIndex}.{iTopic + 1}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {g.unit}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-muted-foreground">
                          {getCategory(r)}
                        </TableCell>
                        <TableCell className="text-muted-foreground align-top !whitespace-normal break-words">
                          <span
                            className="block"
                            style={{
                              display: "-webkit-box",
                              WebkitBoxOrient: "vertical",
                              WebkitLineClamp: 2,
                              overflow: "hidden",
                            }}
                            title={topicByTab(r, tab)}
                          >
                            {topicByTab(r, tab)}
                          </span>
                        </TableCell>
                        <TableCell>{r.maxScore ?? "-"}</TableCell>
                        <TableCell>{r.score ?? "-"}</TableCell>
                        <TableCell className="text-center">
                          {!hideEditButton && (
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
      className="h-8 w-8 rounded-full bg-white hover:bg-gray-50 border border-gray-400 shadow-sm"
      aria-label="แสดงหัวข้อย่อย"
      onClick={() => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))}
    >
      {isOpen ? (
        <ChevronUp className="h-4 w-4 text-gray-700" />
      ) : (
        <ChevronDown className="h-4 w-4 text-gray-700" />
      )}
    </Button>
  );
}

/* ======================== Compare Section ======================== */
function CompareSection(props: {
  tab: TabKey;
  currentYear: number;
  compareYear?: number;

  allCurrentRows: Row[];
  isLoading: boolean;
  error: boolean;
}) {
  const {
    tab,
    currentYear,
    compareYear,
    allCurrentRows,
    isLoading,
    error,
  } = props;

  // ดึงข้อมูลปีเปรียบเทียบ
  const {
    data: compareData,
    error: compareError,
    isLoading: compareLoading,
  } = useSWR<ApiResponse>(
    compareYear
      ? `/api/chief-risk-assessment-results?year=${compareYear}`
      : null,
    fetcher
  );

  // ประมวลผลข้อมูลปีเปรียบเทียบ
  const compareRows = useMemo(() => {
    if (!compareData?.rowsByTab) return [];

    // ตรวจสอบว่ามี "all" tab หรือไม่โดยใช้ any type casting
    const rowsByTabAny = compareData.rowsByTab as Record<string, unknown>;
    if (rowsByTabAny.all && Array.isArray(rowsByTabAny.all)) {
      return (rowsByTabAny.all as unknown[]).filter(
        (row: unknown): row is Row => row !== undefined && row !== null
      );
    }

    // ถ้าไม่มี "all" tab ให้รวมทุก tab แล้ว deduplicate by ID
    const allRows = Object.values(compareData.rowsByTab)
      .flat()
      .filter((row): row is Row => row !== undefined && row !== null);
    const uniqueRows = new Map<string, Row>();
    allRows.forEach((row) => {
      if (!uniqueRows.has(row.id)) {
        uniqueRows.set(row.id, row);
      }
    });
    return Array.from(uniqueRows.values());
  }, [compareData]);

  if (isLoading || compareLoading) {
    return (
      <div className="text-center py-8">
        <div className="text-lg font-medium mb-2">
          กำลังโหลดข้อมูลเปรียบเทียบ...
        </div>
        <div className="text-sm text-muted-foreground">
          กำลังดึงข้อมูลปี {currentYear} และ {compareYear}
        </div>
      </div>
    );
  }

  if (error || compareError) {
    return (
      <div className="text-center py-8 text-red-600">
        <div className="text-lg font-medium mb-2">เกิดข้อผิดพลาด</div>
        <div className="text-sm">ไม่สามารถโหลดข้อมูลเปรียบเทียบได้</div>
      </div>
    );
  }

  if (!compareYear || compareRows.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <div className="text-lg font-medium mb-2">ไม่มีข้อมูลเปรียบเทียบ</div>
        <div className="text-sm">ไม่พบข้อมูลสำหรับปี {compareYear}</div>
      </div>
    );
  }

  // สร้างตารางเปรียบเทียบแบบเคียงข้างกัน
  return (
    <div className="space-y-6">
      {/* หัวข้อการเปรียบเทียบ */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          การเปรียบเทียบข้อมูลประเมินความเสี่ยง
        </h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>
              ปี {currentYear} ({allCurrentRows.length} รายการ)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span>
              ปี {compareYear} ({compareRows.length} รายการ)
            </span>
          </div>
        </div>
      </div>

      {/* ตารางเปรียบเทียบแบบเคียงข้างกัน - ปีก่อนทางซ้าย, ปีปัจจุบันทางขวา */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ตารางปีเปรียบเทียบ (ปีก่อน) - ทางซ้าย */}
        <Card>
          <div className="bg-orange-50 px-4 py-3 border-b">
            <h4 className="font-medium text-orange-900">
              ปีงบประมาณ {compareYear}
            </h4>
          </div>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {compareRows.map((row: Row, index: number) => (
                    <TableRow key={`compare-${row.id}`}>
                      <TableCell className="font-mono text-xs md:text-sm">{index + 1}</TableCell>
                      <TableCell className="whitespace-nowrap">{row.unit}</TableCell>
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
                          {topicByTab(row, tab)}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">{row.score ?? "-"}</TableCell>
                      <TableCell>
                        <GradeBadge grade={row.grade} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* ตารางปีปัจจุบัน - ทางขวา */}
        <Card>
          <div className="bg-blue-50 px-4 py-3 border-b">
            <h4 className="font-medium text-blue-900">
              ปีงบประมาณ {currentYear}
            </h4>
          </div>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allCurrentRows.map((row, index) => (
                    <TableRow key={`current-${row.id}`}>
                      <TableCell className="font-mono text-xs md:text-sm">{index + 1}</TableCell>
                      <TableCell className="whitespace-nowrap">{row.unit}</TableCell>
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
                          {topicByTab(row, tab)}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">{row.score ?? "-"}</TableCell>
                      <TableCell>
                        <GradeBadge grade={row.grade} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
