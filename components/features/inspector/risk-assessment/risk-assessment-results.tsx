// app/(your-segment)/risk-assessment/results/page.tsx
"use client";

import { Fragment, useMemo, useState, useCallback } from "react";
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

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  GripVertical,
  Info,
  FileText,
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
};

type OuterTab = "summary" | "reorder" | "unitRanking";
type UnitSortDir = "desc" | "asc";

/* ======================== Constants ======================== */
const fetcher = (url: string) => fetch(url).then((r) => r.json());

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
    E: { txt: "มากที่สุด", cls: "bg-purple-100 text-purple-700 border-purple-200" },
    H: { txt: "มาก", cls: "bg-red-100 text-red-700 border-red-200" },
    M: { txt: "ปานกลาง", cls: "bg-amber-100 text-amber-700 border-amber-200" },
    L: { txt: "น้อย", cls: "bg-sky-100 text-sky-700 border-sky-200" },
    N: { txt: "น้อยที่สุด", cls: "bg-gray-100 text-gray-700 border-gray-200" },
  } as const;
  const it = map[grade as keyof typeof map];
  if (!it) return <span className="text-muted-foreground">-</span>;
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
  !s || s <= 0 ? "N" : s >= 80 ? "E" : s >= 60 ? "H" : s >= 40 ? "M" : s >= 20 ? "L" : "N";

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
      work: "แผนงานจัดซื้อจัดจ้าง",
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
  scoreSortDir?: "asc" | "desc";
};

/* ======================== Page Component ======================== */
export default function RiskAssessmentResultsPage({
  fullWidth = true,
  className = "",
  outerTab: outerTabProp,
  onOuterTabChange,
}: ResultsProps) {
  // callback: ปุ่ม “เสนอหัวหน้าหน่วยตรวจสอบ”
  function onClickSubmit() {
    // เปิด RiskSubmitConfirmDialog popup
    setOpenSubmitDialog(true);
  }

  // เดิมมี handleConfirm อยู่แล้ว แก้นิดหน่อยให้ปิด SubmitDialog
  const handleConfirm = async () => {
    try {
      // รวบรวมข้อมูลทั้งหมดจากทุก tab สำหรับส่งไปยัง Chief Inspector
      const allTabsData = {
        all: allRows,
        work: getTabRows("work"),
        project: getTabRows("project"), 
        carry: getTabRows("carry"),
        activity: getTabRows("activity"),
        process: getTabRows("process"),
        unit: getTabRows("unit"),
        it: getTabRows("it")
      };

      // เตรียมข้อมูลการส่งตามประเภท
      let submissionData;
      
      if (outerTab === "reorder") {
        // สำหรับ reorder: ส่งข้อมูลการจัดลำดับ
        const originalOrder = paginatedParents.map(r => r.id);
        const newOrder = orderIds || originalOrder;
        const hasChanges = orderIds !== null && JSON.stringify(originalOrder) !== JSON.stringify(newOrder);
        const changedItems = Object.keys(reasonById);
        
        console.log("🔄 Preparing reorder submission:", {
          originalOrder,
          newOrder,
          orderIds,
          hasChanges,
          orderedParentsCount: orderedParents.length,
          reasonById
        });
        
        // สร้างข้อมูลที่ถูกจัดลำดับใหม่โดยใช้ filteredParents เป็นฐาน
        const reorderedData = newOrder.map(id => {
          return filteredParents.find(item => item.id === id);
        }).filter(Boolean);
        
        console.log("🔄 Creating reordered data for submission:", {
          originalOrderCount: originalOrder.length,
          newOrderCount: newOrder.length,
          filteredParentsCount: filteredParents.length,
          reorderedDataCount: reorderedData.length,
          newOrderIds: newOrder,
          reorderedDataIds: reorderedData.map((item) => item?.id).filter(Boolean)
        });
        
        // สร้างข้อมูล allTabsData ที่รวมข้อมูลการจัดลำดับใหม่
        const updatedAllTabsData = {
          ...allTabsData,
          [tab]: reorderedData, // ใช้ข้อมูลที่จัดลำดับใหม่สำหรับแท็บปัจจุบัน
          all: reorderedData // ใช้ข้อมูลที่จัดลำดับใหม่สำหรับแท็บ "all" ด้วย
        };

        submissionData = {
          action: "submit_reorder",
          year,
          tab,
          originalOrder,
          newOrder,
          changedItem: changedItems.length > 0 ? changedItems[0] : null,
          reason: Object.values(reasonById).join("; ") || "การจัดลำดับตามความเสี่ยง",
          hasChanges,
          data: reorderedData, // ใช้ข้อมูลที่จัดลำดับใหม่แล้ว
          reasonById, // ส่งข้อมูลเหตุผลทั้งหมด
          metadata: {
            pageTitle,
            subtitle,
            assessmentName,
            statusLine,
            totalItems: reorderedData.length,
            reorderTime: new Date().toISOString(),
            allTabsData: updatedAllTabsData // ใช้ข้อมูลที่อัพเดตแล้ว
          }
        };
      } else {
        // สำหรับ summary และ unitRanking
        submissionData = {
          action: outerTab === "summary" ? "submit_summary" : "submit_unit_ranking",
          year,
          tab,
          data: filteredParents,
          metadata: {
            pageTitle,
            subtitle,
            assessmentName,
            statusLine,
            totalItems: filteredParents.length,
            submissionTime: new Date().toISOString(),
            allTabsData // เพิ่มข้อมูลทุก tab
          }
        };
      }

      console.log("🚀 Submitting assessment results to chief:", submissionData);
      
      const response = await fetch(`/api/chief-risk-assessment-results?year=${year}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit to chief");
      }

      const result = await response.json();
      console.log("✅ Submission successful:", result);
      
      // ปิด dialog
      setOpenSubmitDialog(false);
      
      // นำทางไปหน้า overview-of-the-assessment-results พร้อมระบุว่าข้อมูลมาจาก Inspector
      const actionParam = outerTab === "reorder" ? "&action=reorder" : "";
      router.push(`/overview-of-the-assessment-results?fromInspector=true${actionParam}`);
    } catch (error) {
      console.error("Error submitting to chief:", error);
      // ยังคงปิด dialog แม้เกิดข้อผิดพลาด
      setOpenSubmitDialog(false);
    }
  };

  // handler สำหรับ dialog เหตุผลปรับลำดับ (แท็บ reorder)
  async function handleConfirmChangeOrder(payload: {
    note: string;
    acknowledged: boolean;
  }) {
    const newIds = pendingOrderIds ?? orderedParents.map((r) => r.id);

    console.log("🔄 Confirming reorder with reason:", {
      originalOrder: orderedParents.map(r => r.id),
      newOrder: newIds,
      changedItem: pendingMovedId,
      reason: payload.note.trim()
    });

    // คอมมิตลำดับใหม่
    setOrderIds(newIds);

    // เก็บเหตุผลสำหรับรายการที่ถูกย้าย
    if (pendingMovedId) {
      setReasonById((prev) => ({
        ...prev,
        [pendingMovedId]: payload.note.trim() || "เปลี่ยนลำดับความเสี่ยง",
      }));
    }

    // ปิด popup + เคลียร์สถานะชั่วคราว
    setOpenReasonDialog(false);
    setPendingOrderIds(null);
    setPreviewOrderIds(null);
    setPendingMovedId(null);

    console.log("✅ Reorder applied with reason - staying on current page");
  }
  const router = useRouter();

  // -------- Outer tabs (3 โหมด) --------
  const [outerTabUncontrolled, setOuterTabUncontrolled] =
    useState<OuterTab>("summary");

  const outerTab = outerTabProp ?? outerTabUncontrolled;
  const setOuterTab = onOuterTabChange ?? setOuterTabUncontrolled;
  const [unitSortDir, setUnitSortDir] = useState<UnitSortDir>("desc");

  // -------- Inner tabs (ประเภท) --------
  const [tab, setTab] = useState<TabKey>("all");
  const [year, setYear] = useState("2568");
  const [query] = useState("");
  const [status] = useState("all");
  const [onlyIT] = useState(false);
  const [sortBy] = useState<"index" | "score" | "unit">("score");
  const [sortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 200;
  const [openSubmitDialog, setOpenSubmitDialog] = useState(false); // สำหรับ RiskSubmitConfirmDialog
  const [openReasonDialog, setOpenReasonDialog] = useState(false); // สำหรับ ChangeOrderReasonDialog
  const [pendingOrderIds, setPendingOrderIds] = useState<string[] | null>(null);
  const [pendingMovedId, setPendingMovedId] = useState<string | null>(null);
  const [reasonById, setReasonById] = useState<Record<string, string>>({});
  const [previewOrderIds, setPreviewOrderIds] = useState<string[] | null>(null);
  
  // ใช้ useSWR กับ API endpoint ใหม่  
  const { data, error, isLoading } = useSWR<ApiResponse>(
    `/api/risk-assessment-results?year=${year}`,
    fetcher
  );

  function handleReorderByDrag(newIds: string[], movedId: string) {
    console.log("🔄 Drag reorder detected:", {
      originalOrder: paginatedParents.map(r => r.id),
      newOrder: newIds,
      movedItem: movedId
    });

    // เก็บข้อมูลการเปลี่ยนแปลงไว้รอ confirm
    setPreviewOrderIds(newIds);
    setPendingOrderIds(newIds);
    setPendingMovedId(movedId);
    
    // เปิด popup ให้ใส่เหตุผล
    setOpenReasonDialog(true);

    console.log("✅ Reorder dialog opened for reason input");
  }

  function handleUpdateReason(id: string, reason: string) {
    setReasonById((prev) => ({
      ...prev,
      [id]: reason
    }));
  }
  // rows จาก API หรือ fallback เป็น mock
  const rowsByTab = useMemo(() => {
    console.log("🔄 Risk Assessment Results - Data received:", data);
    
    const hasApiData = Object.values(data?.rowsByTab ?? {}).some(
      (v) => (v?.length ?? 0) > 0
    );
    
    if (hasApiData) {
      console.log("✅ Using API data");
      console.log("📊 Rows by tab from API:", Object.keys(data!.rowsByTab));
      Object.entries(data!.rowsByTab).forEach(([tab, rows]) => {
        console.log(`  ${tab}: ${rows?.length || 0} rows`);
      });
      return data!.rowsByTab as ApiResponse["rowsByTab"];
    } else {
      console.log("⚠️ No API data, using mock rows");
      return buildMockRows();
    }
  }, [data]);

  const pageTitle = data?.pageTitle ?? "วางแผนงานตรวจสอบภายใน";
  const subtitle = data?.subtitle ?? "การประเมินความเสี่ยงและการจัดลำดับความเสี่ยง";
  const assessmentName = data?.assessmentName ?? `ผลการประเมินความเสี่ยง แผนการตรวจสอบประจำปี ${year}`;
  const fiscalYears = data?.fiscalYears ?? [Number(year)];
  const statusLine = data?.statusLine ?? { label: "สถานะ:", value: "-" };

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
  const rawRows: Row[] = useMemo(
    () => (tab === "all" ? allRows : getTabRows(tab)),
    [tab, allRows, getTabRows]
  );
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

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // สำหรับ summary + reorder: filter เฉพาะ parent ในหน้าหลัก
  const filteredParents = useMemo(() => {
    let dataRows = [...parentRows];
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
    
    // กำหนดการเรียงลำดับตาม outerTab
    let usedSortBy: string;
    let usedSortAsc: boolean;
    
    if (outerTab === "summary") {
      usedSortBy = "index";
      usedSortAsc = true;  // เรียงตาม index จากน้อยไปมาก
    } else if (outerTab === "reorder") {
      usedSortBy = "index";
      usedSortAsc = true;  // ใน reorder แสดงลำดับปกติจากน้อยไปมาก
    } else {
      usedSortBy = sortBy;
      usedSortAsc = sortAsc;
    }
    
    dataRows.sort((a: { score?: number; index?: string; unit?: string }, b: { score?: number; index?: string; unit?: string }) => {
      const dir = usedSortAsc ? 1 : -1;

      if (usedSortBy === "score") return ((a.score || 0) - (b.score || 0)) * dir;
      if (usedSortBy === "unit")
        return String(a.unit).localeCompare(String(b.unit)) * dir;

      // usedSortBy === "index"
      const parseIdx = (s: string) => s.split(".").map(Number);
      const [a1, a2 = 0] = parseIdx(a.index ?? "");
      const [b1, b2 = 0] = parseIdx(b.index ?? "");
      if (a1 !== b1) return (a1 - b1) * dir;
      return (a2 - b2) * dir;
    });
    return dataRows;
  }, [parentRows, query, status, onlyIT, sortBy, sortAsc, outerTab]);

  // pagination (summary + reorder ใช้เหมือนกัน)
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
    // ลิสต์ฐาน (หน้านี้หลัง filter+paginate แล้ว)
    const base = paginatedParents;

    // helper แปลง id[] -> Row[]
    const mapFrom = (ids: string[]) => {
      const m = new Map(base.map((r) => [r.id, r]));
      return ids.map((id) => m.get(id)!).filter(Boolean);
    };

    // ลำดับที่ใช้แสดงผล:
    // 1) ถ้ามีพรีวิวจากการลาก ให้ใช้พรีวิวก่อน
    if (previewOrderIds) return mapFrom(previewOrderIds);

    // 2) ถ้ามีลำดับที่ “คอมมิตแล้ว” (จากการยืนยันก่อนหน้า) ก็ใช้
    if (orderIds) return mapFrom(orderIds);

    // 3) ค่าเริ่มต้น = ลำดับเดิม
    return base;
  }, [previewOrderIds, orderIds, paginatedParents]);




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
                size="sm"
                className="rounded-md bg-indigo-600 hover:bg-indigo-700 text-white"
                onClick={onClickSubmit}
              >
                เสนอหัวหน้าหน่วยตรวจสอบ
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
                onOpenChange={(v) => {
                  setOpenReasonDialog(v);
                  if (!v) {
                    // ยกเลิก -> ทิ้งพรีวิว/คิว
                    setPendingOrderIds(null);
                    setPreviewOrderIds(null);
                    setPendingMovedId(null); // <-- เคลียร์ด้วย
                  }
                }}
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
          {/* ---------- TABS ชั้นนอก (3 โหมด) + Sort Control ขวา ---------- */}
          <div className="flex items-center justify-between mb-2">
            <div className="overflow-x-auto">
              <Tabs
                value={outerTab}
                onValueChange={(v) => setOuterTab(v as OuterTab)}
              >
                {/* เอาเส้นขอบล่างออก และเว้นช่องไฟระหว่างแท็บแบบกว้าง ๆ */}
                <TabsList className="bg-transparent h-auto p-0 border-0 gap-8">
                  {Object.entries(OUTER_TABS).map(([k, label]) => (
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
            </div>

            {/* คอนโทรล “เรียงตามคะแนนประเมิน” ด้านขวา (แสดงเฉพาะ unitRanking) */}
            {outerTab === "unitRanking" && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  เรียงตามคะแนนประเมิน
                </span>
                <Select
                  value={unitSortDir}
                  onValueChange={(v) => setUnitSortDir(v as UnitSortDir)}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="มากไปน้อย" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">มากไปน้อย</SelectItem>
                    <SelectItem value="asc">น้อยไปมาก</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

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
              groupChildren={groupChildren} // << เพิ่ม
            />
          )}

          {outerTab === "reorder" && (
            <ReorderSection
              tab={tab}
              parents={orderedParents}
              onReorderByDrag={handleReorderByDrag}
              reasonById={reasonById} // << เพิ่ม prop
              onUpdateReason={handleUpdateReason} // << เพิ่ม callback สำหรับอัพเดตเหตุผล
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
              unitSortDir={unitSortDir}
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

function SummarySection(props: {
  tab: TabKey;
  parents: Row[];
  allRows: Row[]; // unused (คงพารามิเตอร์ไว้)
  expanded: Record<string, boolean>;
  setExpanded: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  isLoading: boolean;
  error: boolean;
  groupChildren: Record<string, Row[]>;
}) {
  const {
    tab,
    parents,
    expanded,
    setExpanded,
    isLoading,
    error,
    groupChildren,
  } = props;

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
                        {hasChildren ? (
                          <ExpandBtn
                            id={r.id}
                            expanded={expanded}
                            setExpanded={setExpanded}
                          />
                        ) : (
                          r.hasDoc && (
                            <Button
                              asChild
                              variant="ghost"
                              size="icon"
                              aria-label="กรอก/ดูเอกสาร"
                            >
                              <Link href={`/risk-assessment-form/${r.id}`}>
                                <FileText className="h-4 w-4" />
                              </Link>
                            </Button>
                          )
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
                          <TableCell>
                            <StatusBadge value={deriveStatus(c)} />
                          </TableCell>
                          <TableCell className="text-center">
                            {c.hasDoc && (
                              <Button
                                asChild
                                variant="ghost"
                                size="icon"
                                aria-label="กรอก/ดูเอกสาร"
                              >
                                <Link href={`/risk-assessment-form/${c.id}`}>
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

function ReorderSection(props: {
  tab: TabKey;
  parents: Row[];
  onReorderByDrag: (newIds: string[], movedId: string) => void; // <-- เพิ่ม movedId
  reasonById: Record<string, string>;
  onUpdateReason?: (id: string, reason: string) => void; // <-- เพิ่ม callback สำหรับอัพเดตเหตุผล
  isLoading: boolean;
  error: boolean;
}) {
  const { tab, parents, onReorderByDrag, isLoading, error, reasonById, onUpdateReason } = props;

  const arrayMove = (arr: string[], from: number, to: number) => {
    const a = [...arr];
    const [m] = a.splice(from, 1);
    a.splice(to, 0, m);
    return a;
  };

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const ids = useMemo(() => parents.map((r) => r.id), [parents]);
  const indexOf = (id: string) => ids.indexOf(id);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
    setDraggingId(id);
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };
  const handleDropOnRow = (e: React.DragEvent, overId: string) => {
    e.preventDefault();
    const fromId = e.dataTransfer.getData("text/plain") || draggingId;
    if (!fromId || fromId === overId) return;

    const from = indexOf(fromId);
    const to = indexOf(overId);
    if (from < 0 || to < 0 || from === to) return;

    const newIds = arrayMove(ids, from, to);
    onReorderByDrag(newIds, fromId); // <-- ส่ง movedId ขึ้นไป
    setDraggingId(null);
  };

  const handleEditReason = (id: string) => {
    setEditingId(id);
    setOpenEditDialog(true);
  };

  const handleConfirmEdit = (payload: { note: string; acknowledged: boolean }) => {
    if (editingId && onUpdateReason) {
      onUpdateReason(editingId, payload.note);
    }
    setOpenEditDialog(false);
    setEditingId(null);
  };

  return (
    <div className="rounded-xl border overflow-hidden">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-muted/50">
          <TableRow>
            <TableHead className="w-[44px]"></TableHead>
            <TableHead className="w-[90px]">ลำดับ</TableHead>
            <TableHead>หน่วยงาน</TableHead>
            <TableHead className="align-middle !whitespace-normal break-words leading-snug">
              <span className="block max-w-[18rem] md:max-w-[32rem]">
                {DYNAMIC_HEAD[tab]}
              </span>
            </TableHead>
            <TableHead className="w-[120px]">คะแนนประเมิน</TableHead>
            <TableHead className="w-[120px]">เกรด</TableHead>
            {/* เปลี่ยนจาก "สถานะการประเมินผล" เป็น "เหตุผล" */}
            <TableHead className="w-[220px]">เหตุผล</TableHead>
            <TableHead className="w-[100px]">แก้ไข</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <RowLoading colSpan={8} />
          ) : error ? (
            <RowError colSpan={8} />
          ) : parents.length === 0 ? (
            <RowEmpty colSpan={8} />
          ) : (
            parents.map((r) => (
              <TableRow
                key={r.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDropOnRow(e, r.id)}
                className={cn(
                  draggingId === r.id && "opacity-60",
                  "cursor-default select-none"
                )}
              >
                <TableCell className="text-center">
                  <button
                    aria-label="ลากเพื่อจัดลำดับ"
                    draggable
                    onDragStart={(e) => handleDragStart(e, r.id)}
                    className="h-7 w-7 inline-flex items-center justify-center rounded hover:bg-muted cursor-grab active:cursor-grabbing"
                    title="ลากเพื่อจัดลำดับ"
                  >
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                  </button>
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

                {/* คอลัมน์เหตุผล: ถ้าไม่มีให้แสดง "-" */}
                <TableCell className="text-muted-foreground align-top !whitespace-normal break-words">
                  {reasonById[r.id]?.trim() ? reasonById[r.id] : "-"}
                </TableCell>

                {/* คอลัมน์แก้ไข */}
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditReason(r.id)}
                    className="h-8 px-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                  >
                    แก้ไข
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Dialog สำหรับแก้ไขเหตุผล */}
      <ChangeOrderReasonDialog
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
        onConfirm={handleConfirmEdit}
      />
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
  unitSortDir: UnitSortDir; // << เพิ่ม
}) {
  const { tab, allRows, isLoading, error, unitSortDir } = props;

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
      rows.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
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

    // ใช้ทิศทางจาก unitSortDir
    result.sort((a, b) =>
      unitSortDir === "desc" ? b.sumScore - a.sumScore : a.sumScore - b.sumScore
    );

    return result;
  }, [allRows, unitSortDir, isTopicRow]);

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
