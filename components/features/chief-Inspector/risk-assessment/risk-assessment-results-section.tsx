// app/(your-segment)/risk-assessment/results/page.tsx
"use client";

import { Fragment, useMemo, useState } from "react";
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
import { ChevronDown, ChevronUp } from "lucide-react";
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

/* ======================== Data helpers ======================== */
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

// กติกาให้เกรด (ปรับได้ตามนโยบาย)
const SCORE_RULES = { highMin: 60, mediumMin: 41 };

// แปลงคะแนน -> เกรด
function computeGrade(score: number): Row["grade"] {
  if (score >= SCORE_RULES.highMin) return "H";
  if (score >= SCORE_RULES.mediumMin) return "M";
  return "L";
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
  filter?: {
    grade?: "H" | "M" | "L";
    category?: string;
  };
};

function getCategory(r: Row): string {
  if (r.work && r.work !== "-") return "งาน";
  if (r.project && r.project !== "-") return "โครงการ";
  if (r.carry && r.carry !== "-") return "กันเงินเหลื่อมปี";
  if (r.activity && r.activity !== "-") return "กิจกรรม";
  if (r.process && r.process !== "-") return "กระบวนงาน";
  if (r.system && r.system !== "-") return "IT / Non-IT";
  if (r.mission && r.mission !== "-") return "หน่วยงาน";
  return "-";
}

/* ======================== Page Component ======================== */
export default function RiskAssessmentResultsSectionPage({
  fullWidth = true,
  className = "",
  outerTab: outerTabProp,
  onOuterTabChange,
  filter,
}: ResultsProps) {
  // โหมดชั้นนอก (ไม่มี UI เปลี่ยน แต่ยังรองรับผ่าน props)
  const [outerTabUncontrolled, setOuterTabUncontrolled] =
    useState<OuterTab>("summary");
  const outerTab = outerTabProp ?? outerTabUncontrolled;
  const setOuterTab = onOuterTabChange ?? setOuterTabUncontrolled;

  // ชนิดข้อมูลชั้นใน (ตัด UI ออก เหลือค่าเริ่มต้น “all”)
  const [tab, setTab] = useState<TabKey>("all");

  const [year] = useState("2568");

  const PAGE_SIZE = 200;
  const [page, setPage] = useState(1);

  const { data, error, isLoading } = useSWR<ApiResponse>(
    `/api/risk-assessment?year=${year}&scored=true`,
    fetcher
  );

  // rows
  const rowsByTab = Object.values(data?.rowsByTab ?? {}).some(
    (v) => (v?.length ?? 0) > 0
  )
    ? (data!.rowsByTab as ApiResponse["rowsByTab"])
    : buildMockRows();

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
  }, [tab, allRows, rowsByTab, filter]);

  // ✅ NEW: Map คำนวณคะแนน/เกรดให้ทุกแถว
  const evaluatedRows: Row[] = useMemo(
    () =>
      rawRows.map((r) => {
        const s = computeScore(r);
        const g = computeGrade(s);
        // คืนค่าแบบ immmutable — ให้ UI ไปใช้ score/grade ที่คำนวณเสมอ
        return { ...r, score: s, grade: g };
      }),
    [rawRows]
  );

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // เฉพาะ parent (index ไม่มี “.”) + คงลำดับเดิม
  const filteredParents = useMemo(
    () => evaluatedRows.filter((r) => !r.index.includes(".")),
    [evaluatedRows]
  );

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

          {outerTab === "summary" && (
            <SummarySection
              tab={tab}
              parents={paginatedParents} // <- ได้จาก filteredParents ซึ่งมาจาก evaluatedRows
              allRows={evaluatedRows} // <- ใช้ evaluatedRows
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

          {(outerTab === "summary" || outerTab === "reorder") &&
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
  allRows: Row[];
  expanded: Record<string, boolean>;
  setExpanded: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  isLoading: boolean;
  error: boolean;
}) {
  const { tab, parents, isLoading, error } = props;

  return (
    <div className="rounded-xl border overflow-hidden">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-muted/50">
          <TableRow>
            <TableHead className="w-[90px]">ลำดับ</TableHead>
            <TableHead>หน่วยงานที่รับผิดชอบ</TableHead>
            <TableHead className="w-[140px]">หมวดหมู่</TableHead>
            <TableHead className="align-middle !whitespace-normal break-words leading-snug">
              <span className="block max-w-[18rem] md:max-w-[32rem]">
                หัวข้อ
              </span>
            </TableHead>
            <TableHead className="w-[120px]">คะแนนประเมิน</TableHead>
            <TableHead className="w-[120px]">เกรด</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <RowLoading colSpan={6} />
          ) : error ? (
            <RowError colSpan={6} />
          ) : parents.length === 0 ? (
            <RowEmpty colSpan={6} />
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
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {getCategory(r)}
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
                  </TableRow>
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
  isLoading: boolean;
  error: boolean;
}) {
  const { tab, parents, isLoading, error } = props;

  return (
    <div className="rounded-xl border overflow-hidden">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-muted/50">
          <TableRow>
            {/* ลบคอลัมน์ว่างออก */}
            <TableHead className="w-[90px]">ลำดับ</TableHead>
            <TableHead>หน่วยงานที่รับผิดชอบ</TableHead>
            <TableHead className="w-[140px]">หมวดหมู่</TableHead>
            <TableHead className="align-middle !whitespace-normal break-words leading-snug">
              <span className="block max-w-[18rem] md:max-w-[32rem]">
                หัวข้อ
              </span>
            </TableHead>
            <TableHead className="w-[120px]">คะแนนประเมิน</TableHead>
            <TableHead className="w-[120px]">เกรด</TableHead>
            <TableHead className="w-[200px]">เหตุผล</TableHead>
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
            parents.map((r) => (
              <TableRow key={r.id}>
                {/* ลบเซลล์คอลัมน์ว่างออก */}
                <TableCell className="font-mono text-xs md:text-sm">
                  {r.index}
                </TableCell>
                <TableCell className="whitespace-nowrap">{r.unit}</TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {getCategory(r)}
                </TableCell>
                <TableCell className="text-muted-foreground align-top !whitespace-normal break-words">
                  {topicByTab(r, tab)}
                </TableCell>
                <TableCell className="font-medium">{r.score ?? "-"}</TableCell>
                <TableCell>
                  <GradeBadge grade={r.grade} />
                </TableCell>
                <TableCell className="text-muted-foreground">-</TableCell>
              </TableRow>
            ))
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
}) {
  const { tab, allRows, isLoading, error } = props;
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
