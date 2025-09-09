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
import { ChevronDown, ChevronUp, FileText, Info } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

const STATUS_OPTIONS = [
  { label: "ทั้งหมด", value: "all" },
  { label: "กำลังประเมิน", value: "กำลังประเมิน" },
  { label: "ประเมินแล้ว", value: "ประเมินแล้ว" },
  { label: "ยังไม่ได้ประเมิน", value: "ยังไม่ได้ประเมิน" },
];

function StatusBadge({ value }: { value: string }) {
  const map: Record<string, string> = {
    กำลังประเมิน: "bg-blue-100 text-blue-700 border-blue-200",
    ประเมินแล้ว: "bg-emerald-100 text-emerald-700 border-emerald-200",
    ยังไม่ได้ประเมิน: "bg-red-100 text-red-700 border-red-200",
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

function GradeBadge({ grade }: { grade: string }) {
  if (!grade || grade === "-")
    return <span className="text-muted-foreground">-</span>;
  const intent =
    grade === "H"
      ? "bg-red-100 text-red-700 border-red-200"
      : grade === "M"
      ? "bg-amber-100 text-amber-700 border-amber-200"
      : "bg-sky-100 text-sky-700 border-sky-200";
  return (
    <Badge variant="outline" className={cn("rounded-full px-2", intent)}>
      {grade}
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

export default function RiskAssessmentPlanningPage({
  fullWidth = false,
  className = "",
}: {
  fullWidth?: boolean;
  className?: string;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<TabKey>("all");
  const [year, setYear] = useState("2568");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [onlyIT, setOnlyIT] = useState(false);
  const [sortBy, setSortBy] = useState<"index" | "score" | "unit">("index");
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 200;

  const { data, error, isLoading } = useSWR<ApiResponse>(
    `/api/risk-assessment?year=${year}`,
    fetcher,
    {
      revalidateOnFocus: true,
      refreshInterval: 1000,
    }
  );

  const rowsByTab = data?.rowsByTab ?? {};
  const getTabRows = (k: Exclude<TabKey, "all">): Row[] => rowsByTab[k] ?? [];

  const allRows: Row[] = useMemo(() => {
    return [
      ...getTabRows("work"),
      ...getTabRows("project"),
      ...getTabRows("carry"),
      ...getTabRows("activity"),
      ...getTabRows("process"),
      ...getTabRows("unit"),
      ...getTabRows("it"),
    ];
  }, [rowsByTab]);

  const rawRows: Row[] = useMemo(
    () => (tab === "all" ? allRows : getTabRows(tab)),
    [tab, allRows, rowsByTab]
  );

  const gradeFromScore = (s?: number) =>
    !s || s <= 0 ? "-" : s >= 60 ? "H" : s >= 41 ? "M" : "L";

  // เปิด "จัดกลุ่มหัวข้อซ้ำ" สำหรับทุกแท็บ (รวม all)
  const groupingEnabled = true;

  // รวมกลุ่มตามหัวข้อเดียวกัน -> parentRows + groupChildren
  function makeParentRow(topic: string, rows: Row[]): Row {
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

    const maxScore = Math.max(...sorted.map((r) => r.score || 0));
    const totalScore = sorted.reduce((sum, r) => sum + (r.score || 0), 0);
    const allDone = sorted.every((r) => r.status === "ประเมินแล้ว");
    const anyDoing = sorted.some((r) => r.status !== "ยังไม่ได้ประเมิน");
    const status = allDone
      ? "ประเมินแล้ว"
      : anyDoing
      ? "กำลังประเมิน"
      : "ยังไม่ได้ประเมิน";

    const base: Row = {
      id: `group:${tab}:${encodeURIComponent(topic)}`,
      index: sorted[0]?.index?.split(".")[0] || "-", // ใช้เลขหลักแรกเป็นลำดับพาเรนต์
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
    if (tab === "all") {
      base.work = topic; // หรือจะใส่ลง field ไหนก็ได้ที่คุณใช้ render
    }
    return base;
  }

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
        const parent = makeParentRow(topic, rows);
        parents.push(parent);

        // เรียงลูกตาม index และส่งให้เรนเดอร์ 1.1, 1.2, ...
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

    // เรียงพาเรนต์ตามลำดับเลขหลัก
    parents.sort((a, b) => {
      const A = a.index.split(".").map(Number);
      const B = b.index.split(".").map(Number);
      return A[0] !== B[0] ? A[0] - B[0] : (A[1] || 0) - (B[1] || 0);
    });

    return { parentRows: parents, groupChildren: childrenMap };
  }, [rawRows, tab, groupingEnabled]);

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // ฟิลเตอร์/เรียง ใช้จาก parentRows (หลังรวมกลุ่มแล้ว)
  const filtered = useMemo(() => {
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

    dataRows.sort((a: any, b: any) => {
      const dir = sortAsc ? 1 : -1;
      if (sortBy === "score") return (a.score - b.score) * dir;
      if (sortBy === "unit")
        return String(a.unit).localeCompare(String(b.unit)) * dir;

      const toNum = (s: string) => s.split(".").map(Number);
      const [a1, a2 = 0] = toNum(a.index ?? "");
      const [b1, b2 = 0] = toNum(b.index ?? "");
      if (a1 !== b1) return (a1 - b1) * dir;
      return (a2 - b2) * dir;
    });

    return dataRows;
  }, [parentRows, query, status, onlyIT, sortBy, sortAsc]);

  const pageTitle = data?.pageTitle ?? "วางแผนงานตรวจสอบภายใน";
  const subtitle =
    data?.subtitle ?? "การประเมินความเสี่ยงและการจัดลำดับความเสี่ยง";
  const assessmentName =
    data?.assessmentName ??
    `ประเมินและจัดลำดับความเสี่ยงแผนการตรวจสอบประจำปี ${year}`;
  const fiscalYears = data?.fiscalYears ?? [Number(year)];
  const statusLine = data?.statusLine ?? { label: "สถานะ:", value: "-" };

  const shouldPaginate = filtered.length > PAGE_SIZE;
  const totalPages = shouldPaginate
    ? Math.ceil(filtered.length / PAGE_SIZE)
    : 1;
  const paginated = shouldPaginate
    ? filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    : filtered;

  return (
    <div
      className={cn(
        fullWidth
          ? "w-full p-4 md:p-6 space-y-4"
          : "mx-auto max-w-[1200px] p-4 md:p-6 space-y-4",
        className
      )}
    >
      <div className="text-sm text-muted-foreground">
        วางแผนงานตรวจสอบภายใน / {subtitle}
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl md:text-2xl font-semibold">{pageTitle}</h1>
        </div>
      </div>

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
            <Button
              asChild
              size="sm"
              className="rounded-md bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Link href={"/risk-assessment-results"}>ผลการประเมิน</Link>
            </Button>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <Info className="h-4 w-4" />
            <span className="font-medium text-foreground">
              {statusLine.label}
            </span>
            {statusLine.value}
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Tabs */}
          <div className="overflow-x-auto">
            <Tabs
              value={tab}
              onValueChange={(v) => {
                setTab(v as TabKey);
                setPage(1);
              }}
            >
              <TabsList className="mb-2 w-full justify-start bg-transparent h-auto p-0 border-b border-border">
                {Object.entries(TAB_LABELS).map(([k, label]) => (
                  <TabsTrigger
                    key={k}
                    value={k}
                    className="
                      rounded-none bg-transparent
                      px-0 md:px-2 py-3 text-sm font-medium
                      text-muted-foreground hover:text-foreground
                      border-b-2 border-transparent
                      data-[state=active]:text-primary
                      data-[state=active]:border-primary
                      focus-visible:outline-none
                    "
                  >
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Table */}
          <div className="rounded-xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[90px]">ลำดับ</TableHead>
                  <TableHead>หน่วยงาน</TableHead>
                  <TableHead className="align-middle !whitespace-normal break-words leading-snug">
                    <span className="block max-w-[18rem] md:max-w-[32rem]">
                      {DYNAMIC_HEAD[tab]}
                    </span>
                  </TableHead>
                  <TableHead className="w-[120px]">คะแนนประเมิน</TableHead>
                  <TableHead className="w-[80px]">เกรด</TableHead>
                  <TableHead className="w-[170px]">สถานะการประเมินผล</TableHead>
                  <TableHead className="w-[64px] text-center"></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-24 text-center text-muted-foreground"
                    >
                      กำลังโหลดข้อมูล...
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-24 text-center text-red-600"
                    >
                      โหลดข้อมูลไม่สำเร็จ
                    </TableCell>
                  </TableRow>
                ) : paginated.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-24 text-center text-muted-foreground"
                    >
                      ไม่พบข้อมูล
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((r) => (
                    <Fragment key={r.id}>
                      <TableRow>
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
                          {r.score || "-"}
                        </TableCell>
                        <TableCell>
                          <GradeBadge grade={r.grade} />
                        </TableCell>
                        <TableCell>
                          <StatusBadge value={r.status} />
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center gap-2">
                            {groupChildren[r.id]?.length ? (
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

                      {/* Children rows (1.1, 1.2, ... ) */}
                      {expanded[r.id] &&
                        (groupChildren[r.id] ?? []).map((c, i) => {
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
                                {c.score || "-"}
                              </TableCell>
                              <TableCell>
                                <GradeBadge grade={c.grade} />
                              </TableCell>
                              <TableCell>
                                <StatusBadge value={c.status} />
                              </TableCell>
                              <TableCell className="text-center">
                                <div className="flex justify-center gap-2">
                                  {c.hasDoc && (
                                    <Button
                                      asChild
                                      variant="ghost"
                                      size="icon"
                                      aria-label="กรอก/ดูเอกสาร"
                                    >
                                      <Link
                                        href={`/risk-assessment-form/${c.id}`}
                                      >
                                        <FileText className="h-4 w-4" />
                                      </Link>
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </Fragment>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {shouldPaginate && (
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-2">
              <div className="text-sm text-muted-foreground">
                แสดง {paginated.length} จากทั้งหมด {filtered.length} รายการ
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
