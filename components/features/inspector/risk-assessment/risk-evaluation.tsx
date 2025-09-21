"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
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
import { ChevronDown, ChevronUp, Info, FileText, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useAnnualEvaluations,
  ApiAnnualEvaluation,
} from "@/hooks/useAnnualEvaluations";

/** ---------------- UI constants ---------------- */
export type AnnualHeaderStatus =
  | "ASSESSOR_IN_PROGRESS"
  | "AWAITING_DIRECTOR_REVIEW"
  | "DIRECTOR_REJECTED"
  | "DIRECTOR_APPROVED";

export type TabKey =
  | "all"
  | "unit"
  | "work"
  | "project"
  | "carry"
  | "activity"
  | "process"
  | "it";

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

const STATUS_LABELS = {
  DONE: "ประเมินแล้ว",
  IN_PROGRESS: "กำลังประเมิน",
  NOT_STARTED: "ยังไม่ได้ประเมิน",
} as const;

/** ---------------- Row type ---------------- */

type Row = {
  id: string;
  index: string; // พาเรนต์: "1" | ลูก: "1.1"
  unit: string; // parent: label รวม, child: ชื่อหน่วยงานจริง
  topic: string;
  score: number; // parent: sum, child: คะแนนของหน่วยงาน
  grade: "H" | "M" | "L" | "E" | "N" | "-";
  status: string; // สถานะสรุป (parent) / สถานะรายบรรทัด (child)
  hasDoc: boolean; // parent=false, child=true
  categoryName: string;
  itType: "IT" | "Non-IT" | "-" | "";
};

type Group = {
  parent: Row;
  children: Row[];
};

/** ---------------- Utils ---------------- */

function GradeBadge({ grade }: { grade: string }) {
  if (!grade || grade === "-")
    return <span className="text-muted-foreground">-</span>;
  const intent =
    grade === "E"
      ? "bg-red-100 text-red-700 border-red-200"
      : grade === "H"
      ? "bg-orange-100 text-orange-700 border-orange-200"
      : grade === "M"
      ? "bg-yellow-100 text-yellow-700 border-yellow-200"
      : grade === "L"
      ? "bg-lime-100 text-lime-700 border-lime-200"
      : "bg-green-100 text-green-700 border-green-200"; // N หรืออื่นๆ
  
  const gradeText = 
    grade === "E" ? "สูงมาก"
    : grade === "H" ? "สูง"
    : grade === "M" ? "ปานกลาง"
    : grade === "L" ? "น้อย"
    : grade === "N" ? "น้อยมาก"
    : grade;
    
  return (
    <Badge variant="outline" className={cn("rounded-full px-2", intent)}>
      {gradeText}
    </Badge>
  );
}

function StatusBadge({ value }: { value: string }) {
  const map: Record<string, string> = {
    [STATUS_LABELS.IN_PROGRESS]: "bg-blue-100 text-blue-700 border-blue-200",
    [STATUS_LABELS.DONE]: "bg-emerald-100 text-emerald-700 border-emerald-200",
    [STATUS_LABELS.NOT_STARTED]: "bg-red-100 text-red-700 border-red-200",
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

const gradeFromScore = (s?: number) =>
  !s || s <= 0
    ? "-"
    : s >= 80
    ? "E"
    : s >= 60
    ? "H"
    : s >= 40
    ? "M"
    : s >= 20
    ? "L"
    : "N";

function categoriesForTab(tab: TabKey): string[] | null {
  switch (tab) {
    case "unit":
      return ["หน่วยงาน"];
    case "work":
      return ["งาน"];
    case "project":
      return ["โครงการ"];
    case "carry":
      return ["โครงการกันเงินเหลื่อมปี"];
    case "activity":
      return ["กิจกรรม"];
    case "process":
      return ["กระบวนงาน"];
    case "it":
      return ["IT/Non-IT"];
    default:
      return null;
  }
}

/** ฟังก์ชันช่วยดึงสถานะการประเมินจากข้อมูลที่บันทึกไว้ */
function getAssessmentStatus(
  compoundId: string,
  fallbackScore: number
): string {
  // ใช้ข้อมูลจาก API เป็นหลัก ถ้าไม่มีคะแนนหรือเป็น 0 = ยังไม่ได้ประเมิน
  if (!fallbackScore || fallbackScore <= 0) {
    console.log(`💡 No score from API for ${compoundId}: ยังไม่ได้ประเมิน`);
    return "ยังไม่ได้ประเมิน";
  }

  try {
    // ตรวจสอบสถานะจาก localStorage (สำหรับกรณีที่กำลังประเมินครึ่งทาง)
    const savedStatus = localStorage.getItem(`assessment_status_${compoundId}`);
    if (savedStatus && savedStatus === "กำลังประเมิน") {
      console.log(
        `📋 In progress from localStorage: ${compoundId} -> ${savedStatus}`
      );
      return savedStatus;
    }

    // ตรวจสอบข้อมูลการประเมินจาก localStorage
    const savedData = localStorage.getItem(`assessment_data_${compoundId}`);
    if (savedData) {
      try {
        const assessmentData = JSON.parse(savedData);
        if (assessmentData.status === "กำลังประเมิน") {
          console.log(
            `📊 In progress from assessment data: ${compoundId} -> ${assessmentData.status}`
          );
          return assessmentData.status;
        }
      } catch (parseError) {
        console.warn(
          "Failed to parse assessment data from localStorage:",
          parseError
        );
      }
    }
  } catch (error) {
    console.warn("Cannot access localStorage:", error);
  }

  // หากมีคะแนนจาก API แล้ว = ประเมินเสร็จแล้ว
  const status = "ประเมินแล้ว";
  console.log(
    `✅ Has score from API for ${compoundId}: ${status} (score: ${fallbackScore})`
  );
  return status;
}

/** สร้าง Group (พาเรนต์ + ลูก) จากข้อมูล API ที่ได้มา */
function buildGroups(
  annualEvaluations: ApiAnnualEvaluation[],
  tabCats: string[] | null
): Group[] {
  const groups: Group[] = [];
  // เก็บหัวข้อที่เจอแล้ว ต่อ "หมวด"
  const seenByCategory = new Map<string, Set<string>>();

  annualEvaluations.forEach((a) => {
    a.RiskEvaluations.forEach((re) => {
      if (tabCats && !tabCats.includes(re.category.name)) return;

      // เตรียม set สำหรับหมวดนี้
      if (!seenByCategory.has(re.category.name)) {
        seenByCategory.set(re.category.name, new Set());
      }
      const seenTopics = seenByCategory.get(re.category.name)!;

      re.auditTopics.forEach((t) => {
        // ✅ อนุญาตซ้ำเฉพาะหมวด "งาน"
        const allowDup = re.category.name === "งาน";
        const key = (t.auditTopic || "").trim();

        if (!allowDup) {
          // ถ้าไม่ใช่หมวด "งาน" และเคยเจอหัวข้อนี้แล้ว → ข้าม
          if (seenTopics.has(key)) return;
          seenTopics.add(key);
        }

        // ... (โค้ดสร้าง children / parent เหมือนเดิม)
        const children: Row[] = t.DepartmentAssessmentScore.map((ds) => {
          const childScore = ds.department.composite_score ?? 0;

          // สร้าง compound ID สำหรับแต่ละหน่วยงาน
          const compoundId = `a${a.id}-c${re.id}-t${t.id}-d${ds.department.id}`;

          // ใช้ฟังก์ชันช่วยเพื่อดึงสถานะจากคะแนน
          const departmentStatus = getAssessmentStatus(compoundId, childScore);

          return {
            id: compoundId,
            index: "",
            unit: ds.department.departmentName,
            topic: t.auditTopic,
            score: childScore,
            grade:
              (ds.department.grade as Row["grade"]) ||
              gradeFromScore(childScore),
            status: departmentStatus,
            hasDoc: true,
            categoryName: re.category.name,
            itType:
              re.category.name === "IT"
                ? "IT"
                : re.category.name === "Non-IT"
                ? "Non-IT"
                : "-",
          };
        });

        const unitNames = children.map((c) => c.unit);
        const uniqUnits = Array.from(new Set(unitNames)).filter(Boolean);
        let unitLabel = "-";
        if (uniqUnits.length === 1) unitLabel = uniqUnits[0]!;
        else if (uniqUnits.length === 2)
          unitLabel = `${uniqUnits[0]} และ ${uniqUnits[1]}`;
        else if (uniqUnits.length > 2)
          unitLabel = `${uniqUnits[0]} และอีก ${uniqUnits.length - 1} หน่วยงาน`;

        const totalScore = children.reduce((s, c) => s + (c.score || 0), 0);
        const statuses = children.map((c) => c.status);
        const allDone = statuses.every((s) => s === "ประเมินแล้ว");
        const someInProgress = statuses.some((s) => s === "กำลังประเมิน");
        const someNotStarted = statuses.some((s) => s === "ยังไม่ได้ประเมิน");

        let parentStatus: string;
        if (allDone) {
          parentStatus = "ประเมินแล้ว";
        } else if (
          someInProgress ||
          (statuses.some((s) => s === "ประเมินแล้ว") && someNotStarted)
        ) {
          parentStatus = "กำลังประเมิน";
        } else {
          parentStatus = "ยังไม่ได้ประเมิน";
        }

        console.log(`🔍 Parent status calculation for ${t.auditTopic}:`);
        console.log(`  📊 Children statuses: ${statuses.join(", ")}`);
        console.log(`  ✅ All done: ${allDone}`);
        console.log(`  🔄 Some in progress: ${someInProgress}`);
        console.log(`  ❌ Some not started: ${someNotStarted}`);
        console.log(`  📋 Final parent status: ${parentStatus}`);

        const parentScore = t.composite_score ?? t.total_score ?? totalScore;
        const parentGrade = ((t as { grade?: string }).grade ?? gradeFromScore(parentScore)) as "H" | "M" | "L" | "E" | "N" | "-";

        const parent: Row = {
          id: `group:a${a.id}-c${re.id}-t${t.id}`,
          index: "",
          unit: unitLabel,
          topic: t.auditTopic,
          score: parentScore,
          grade: parentGrade,
          status: parentStatus,
          hasDoc: false,
          categoryName: re.category.name,
          itType:
            re.category.name === "IT"
              ? "IT"
              : re.category.name === "Non-IT"
              ? "Non-IT"
              : "-",
        };

        groups.push({ parent, children });
      });
    });
  });

  // เติมเลข index เหมือนเดิม
  groups.forEach((g, gi) => {
    const parentIndex = `${gi + 1}`;
    g.parent.index = parentIndex;
    g.children.forEach((c, cj) => (c.index = `${parentIndex}.${cj + 1}`));
  });

  return groups;
}

const AnnualStatusLabel: Record<AnnualHeaderStatus, string> = {
  ASSESSOR_IN_PROGRESS: "ผู้ตรวจสอบดำเนินการประเมินความเสี่ยง",
  AWAITING_DIRECTOR_REVIEW:
    "รอหัวหน้าหน่วยตรวจสอบพิจารณาผลการประเมินความเสี่ยง",
  DIRECTOR_REJECTED:
    "หัวหน้าหน่วยตรวจสอบพิจารณาไม่อนุมัติผลการประเมินความเสี่ยง",
  DIRECTOR_APPROVED:
    "หัวหน้าหน่วยตรวจสอบพิจารณาอนุมัติผลการประเมินความเสี่ยงเรียบร้อยแล้ว",
};

const AnnualStatusBadgeClass: Record<AnnualHeaderStatus, string> = {
  ASSESSOR_IN_PROGRESS: "bg-amber-100 text-amber-700 border-amber-200",
  AWAITING_DIRECTOR_REVIEW: "bg-blue-100 text-blue-700 border-blue-200",
  DIRECTOR_REJECTED: "bg-red-100 text-red-700 border-red-200",
  DIRECTOR_APPROVED: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

/** ---------------- Page ---------------- */

export default function RiskAssessmentPlanningPage({
  fullWidth = false,
  className = "",
}: {
  fullWidth?: boolean;
  className?: string;
}) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const [tab, setTab] = useState<TabKey>("all");
  const [year, setYear] = useState<number>(2568);
  const [query] = useState("");
  const [status] = useState<
    "all" | "กำลังประเมิน" | "ประเมินแล้ว" | "ยังไม่ได้ประเมิน"
  >("all");
  const [sortBy, setSortBy] = useState<"index" | "score" | "unit">("index");
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const PAGE_SIZE = 200;

  const tabCats = categoriesForTab(tab);
  const apiCategory = tabCats && tabCats.length === 1 ? tabCats[0] : undefined;

  const { annualEvaluations, loading, error } = useAnnualEvaluations({
    fiscalYear: year,
    category: apiCategory, // "all" และ "it" จะไม่ส่ง category เพื่อดึงครบ
    search: query || undefined,
  });

  // รวมปีจากข้อมูล (mock ของเราใช้ปีเดียว)
  const fiscalYears = useMemo(() => {
    const set = new Set<number>();
    annualEvaluations.forEach((a) => set.add(a.fiscalYear));
    if (!set.size) set.add(year);
    return Array.from(set).sort((a, b) => b - a);
  }, [annualEvaluations, year]);

  // สร้างกลุ่มจากข้อมูล
  const allGroups = useMemo<Group[]>(() => {
    const groups = buildGroups(annualEvaluations, tabCats);
    return groups;
  }, [annualEvaluations, tabCats]);

  // ค้นหา + กรองสถานะ (ทำที่ระดับพาเรนต์)
  const filteredGroups = useMemo(() => {
    let gs = [...allGroups];

    if (query) {
      const q = query.trim().toLowerCase();
      gs = gs.filter((g) =>
        [
          g.parent.index,
          g.parent.unit,
          g.parent.topic,
          g.parent.categoryName,
        ].some((t) => String(t).toLowerCase().includes(q))
      );
    }
    if (status !== "all") {
      gs = gs.filter((g) => g.parent.status === status);
    }

    // sort (ที่พาเรนต์)
    gs.sort((A, B) => {
      const a = A.parent;
      const b = B.parent;
      const dir = sortAsc ? 1 : -1;

      if (sortBy === "score") return (a.score - b.score) * dir;
      if (sortBy === "unit")
        return String(a.unit).localeCompare(String(b.unit)) * dir;

      // index เป็นตัวเลขล้วน
      return (Number(a.index) - Number(b.index)) * dir;
    });

    // หลังจาก sort แล้ว ต้องรีเลข index ใหม่ให้เรียงต่อเนื่อง (1..N)
    gs.forEach((g, gi) => {
      const parentIndex = `${gi + 1}`;
      g.parent.index = parentIndex;
      g.children.forEach((c, cj) => {
        c.index = `${parentIndex}.${cj + 1}`;
      });
    });

    return gs;
  }, [allGroups, query, status, sortBy, sortAsc]);

  const shouldPaginate = filteredGroups.length > PAGE_SIZE;
  const totalPages = shouldPaginate
    ? Math.ceil(filteredGroups.length / PAGE_SIZE)
    : 1;
  const pageGroups = shouldPaginate
    ? filteredGroups.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    : filteredGroups;
  type LegacyAnnualStatus =
    | "DRAFT"
    | "SUBMITTED"
    | "DIRECTOR_REVIEW"
    | "APPROVED"
    | "REJECTED";

  function normalizeAnnualHeaderStatus(
    s?: AnnualHeaderStatus | LegacyAnnualStatus | null
  ): AnnualHeaderStatus | undefined {
    if (!s) return undefined;
    switch (s) {
      case "DRAFT":
        return "ASSESSOR_IN_PROGRESS";
      case "SUBMITTED":
      case "DIRECTOR_REVIEW":
        return "AWAITING_DIRECTOR_REVIEW";
      case "REJECTED":
        return "DIRECTOR_REJECTED";
      case "APPROVED":
        return "DIRECTOR_APPROVED";
      default:
        return s as AnnualHeaderStatus;
    }
  }

  // header text (mock)
  const pageTitle = "วางแผนงานตรวจสอบภายใน";
  const subtitle = "การประเมินความเสี่ยงและการจัดลำดับความเสี่ยง";
  const assessmentName = `ประเมินและจัดลำดับความเสี่ยงแผนการตรวจสอบประจำปี ${year}`;
  const rawAnnualStatus =
    (annualEvaluations[0]?.status as
      | AnnualHeaderStatus
      | LegacyAnnualStatus
      | undefined) ?? undefined;

  const currentAnnualStatus = normalizeAnnualHeaderStatus(rawAnnualStatus);
  // ตรวจสอบว่าประเมินครบทุกรายการแล้วหรือไม่
  const allAssessmentCompleted = useMemo(() => {
    return allGroups.every((group) =>
      group.children.every((child) => child.score > 0)
    );
  }, [allGroups]);

  // จัดการการนำทางไปหน้าผลการประเมิน
  const handleNavigateToResults = async () => {
    if (!allAssessmentCompleted) {
      const unassessedCount = allGroups.flatMap((g) => g.children).length -
        allGroups.flatMap((g) => g.children).filter((c) => c.score > 0).length;
      alert(`กรุณาประเมินให้ครบทุกรายการก่อน (เหลือ ${unassessedCount} รายการ)`);
      return;
    }

    setIsNavigating(true);
    try {
      // เพิ่ม delay เล็กน้อยเพื่อให้เห็น loading
      await new Promise(resolve => setTimeout(resolve, 500));
      await router.push("/risk-assessment-results");
    } catch (error) {
      console.error('Navigation error:', error);
      setIsNavigating(false);
    }
  };

  // ฟังก์ชันเคลียร์ข้อมูลทั้งหมด (localStorage + database)
  const handleClearLocalStorage = async () => {
    const confirmed = confirm(
      "🗑️ เคลียร์ข้อมูลการประเมิน\n\n" +
        "จะลบข้อมูลการประเมินที่บันทึกไว้ทั้งหมด:\n" +
        "• ข้อมูลใน Browser (localStorage)\n" +
        "• ข้อมูลคะแนนและฟอร์มประเมิน\n" +
        "• ข้อมูลจะกลับไปเป็นสถานะเริ่มต้น\n\n" +
        "ต้องการดำเนินการต่อหรือไม่?"
    );

    if (!confirmed) return;

    try {
      // ลบข้อมูลการประเมินทั้งหมดจาก localStorage
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (
          key.startsWith("assessment_status_") ||
          key.startsWith("assessment_data_")
        ) {
          localStorage.removeItem(key);
        }
      });
      console.log("🗑️ Cleared localStorage data");

      // เรียก API เพื่อเคลียร์ข้อมูลใน database
      const response = await fetch("/api/clear-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to clear database data");
      }

      const result = await response.json();
      console.log("🗑️ Database clear result:", result);

      alert(
        "✅ เคลียร์ข้อมูลเสร็จสิ้น!\n\n" +
          `• ลบข้อมูล localStorage เรียบร้อย\n` +
          `• ลบข้อมูลคะแนน: ${result.data?.clearedOverrides || 0} รายการ\n` +
          `• ลบข้อมูลฟอร์ม: ${result.data?.clearedForms || 0} รายการ\n\n` +
          "กำลังรีเฟรชหน้า..."
      );

      // รีเฟรชหน้าเพื่อโหลดข้อมูลใหม่
      window.location.reload();
    } catch (error) {
      console.error("Error clearing data:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      alert("เกิดข้อผิดพลาดในการเคลียร์ข้อมูล: " + errorMessage);
    }
  };

  // ฟังก์ชัน Auto ประเมิน
  const handleAutoAssess = async () => {
    try {
      const updates: Array<{
        id: string;
        score: number;
        grade: string;
      }> = [];

      // สร้างคะแนนสุ่มสำหรับรายการที่ยังไม่ได้ประเมิน
      allGroups.forEach((group) => {
        group.children.forEach((child) => {
          if (child.score <= 0) {
            // สุ่มคะแนนระหว่าง 20-85
            const randomScore = Math.floor(Math.random() * (85 - 20 + 1)) + 20;
            updates.push({
              id: child.id,
              score: randomScore,
              grade: gradeFromScore(randomScore),
            });
          }
        });
      });

      if (updates.length === 0) {
        alert("✅ ข้อมูลได้รับการประเมินครบถ้วนแล้ว");
        return;
      }

      // ยืนยันก่อนดำเนินการ
      const confirmed = confirm(
        `🤖 Auto ประเมิน\n\n` +
          `จะทำการประเมินรายการที่ยังไม่ได้ประเมิน ${updates.length} รายการ\n` +
          `ด้วยคะแนนสุ่มระหว่าง 20-85 คะแนน\n\n` +
          `ต้องการดำเนินการต่อหรือไม่?`
      );

      if (!confirmed) return;

      // เรียก API สำหรับอัพเดตคะแนน
      const response = await fetch("/api/auto-assess", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ updates }),
      });

      if (!response.ok) {
        throw new Error("Failed to update assessments");
      }

      const result = await response.json();
      console.log("🤖 Auto assessment result:", result);

      // แสดงผลลัพธ์
      alert(
        `🤖 Auto ประเมินเสร็จสิ้น!\n\n` +
          `ประเมินเพิ่ม ${updates.length} รายการ\n` +
          `คะแนนเฉลี่ย: ${Math.round(
            updates.reduce((sum, u) => sum + u.score, 0) / updates.length
          )} คะแนน\n\n` +
          `ข้อมูลได้รับการอัพเดตแล้ว`
      );

      // รีเฟรชข้อมูล SWR
      window.location.reload();
    } catch (error) {
      console.error("Error in auto assessment:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      alert("เกิดข้อผิดพลาดในการ Auto ประเมิน: " + errorMessage);
    }
  };

  // reset page เมื่อเปลี่ยน filter หลัก
  useEffect(() => setPage(1), [tab, year, query, status]);

  return (
    <div
      className={cn(
        fullWidth
          ? "w-full p-4 md:p-6 space-y-4"
          : "mx-auto max-w-[1200px] p-4 md:p-6 space-y-4",
        className
      )}
    >
      {/* Loading Overlay */}
      {isNavigating && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-xl border border-gray-200 min-w-[200px] text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-blue-600" />
            <p className="text-sm font-medium text-gray-900 mb-1">กำลังโหลด</p>
            <p className="text-xs text-gray-500">กำลังเตรียมผลการประเมิน...</p>
          </div>
        </div>
      )}
      <div className="text-sm text-muted-foreground">
        วางแผนงานตรวจสอบภายใน /{" "}
        <span className="text-sm text-foreground font-medium">{subtitle}</span>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl md:text-2xl font-semibold">{pageTitle}</h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">ปีงบประมาณ</span>
        <Select
          value={String(year)}
          onValueChange={(v) => {
            const y = Number(v);
            setYear(y);
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
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="rounded-md"
                onClick={handleAutoAssess}
                disabled={loading}
              >
                🤖 Auto ประเมิน
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="rounded-md text-red-600 border-red-300 hover:bg-red-50"
                onClick={handleClearLocalStorage}
                disabled={loading}
              >
                🗑️ เคลียร์ข้อมูล
              </Button>

              {/* ปุ่มเก่า - คอมเมนต์ไว้
              <Button
                asChild
                size="sm"
                className="rounded-md bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Link href={"/risk-assessment-results"}>ผลการประเมิน</Link>
              </Button>
              */}

              <Button
                onClick={handleNavigateToResults}
                disabled={isNavigating}
                size="sm"
                className={cn(
                  "rounded-md text-white",
                  allAssessmentCompleted
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                )}
                title={
                  !allAssessmentCompleted
                    ? `กรุณาประเมินให้ครบทุกรายการก่อน (เหลือ ${
                        allGroups.flatMap((g) => g.children).length -
                        allGroups
                          .flatMap((g) => g.children)
                          .filter((c) => c.score > 0).length
                      } รายการ)`
                    : undefined
                }
              >
                {isNavigating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    กำลังโหลด...
                  </>
                ) : (
                  "ผลการประเมิน"
                )}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Info className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-foreground">สถานะ:</span>
              {currentAnnualStatus ? (
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-full px-3",
                    AnnualStatusBadgeClass[currentAnnualStatus]
                  )}
                >
                  {AnnualStatusLabel[currentAnnualStatus]}
                </Badge>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </div>
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
                  <TableHead className="w-[120px]">
                    <button
                      className="underline decoration-dotted"
                      onClick={() => {
                        setSortBy("score");
                        setSortAsc((v) => (sortBy === "score" ? !v : true));
                      }}
                    >
                      คะแนนประเมิน
                    </button>
                  </TableHead>
                  <TableHead className="w-[80px]">เกรด</TableHead>
                  <TableHead className="w-[170px]">สถานะการประเมินผล</TableHead>
                  <TableHead className="w-[64px] text-center"></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
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
                ) : pageGroups.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-24 text-center text-muted-foreground"
                    >
                      ไม่พบข้อมูล
                    </TableCell>
                  </TableRow>
                ) : (
                  pageGroups.map(({ parent, children }) => {
                    const isSingleton = children.length === 1;

                    if (isSingleton) {
                      const only = children[0];

                      // ใช้เลขลำดับจาก parent (ไม่ต้อง .1)
                      const displayIndex = parent.index;

                      return (
                        <TableRow key={`single:${only.id}`}>
                          <TableCell className="font-mono text-xs md:text-sm">
                            {displayIndex}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {only.unit}
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
                              {only.topic}
                            </span>
                          </TableCell>
                          <TableCell className="font-medium">
                            {only.score || "-"}
                          </TableCell>
                          <TableCell>
                            <GradeBadge grade={only.grade} />
                          </TableCell>
                          <TableCell>
                            <StatusBadge value={only.status} />
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex justify-center gap-2">
                              {only.hasDoc && (
                                <Button
                                  asChild
                                  variant="ghost"
                                  size="icon"
                                  aria-label="กรอก/ดูเอกสาร"
                                >
                                  <Link
                                    href={`/risk-assessment-form/${only.id}`}
                                  >
                                    <FileText className="h-4 w-4" />
                                  </Link>
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    }

                    // กรณีมีหลาย child (หัวข้อซ้ำ) — แสดง parent + expand
                    return (
                      <Fragment key={parent.id}>
                        {/* Parent row */}
                        <TableRow>
                          <TableCell className="font-mono text-xs md:text-sm">
                            {parent.index}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {parent.unit}
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
                              {parent.topic}
                            </span>
                          </TableCell>
                          <TableCell className="font-medium">
                            {parent.score || "-"}
                          </TableCell>
                          <TableCell>
                            <GradeBadge grade={parent.grade} />
                          </TableCell>
                          <TableCell>
                            <StatusBadge value={parent.status} />
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex justify-center gap-2">
                              <ExpandBtn
                                id={parent.id}
                                expanded={expanded}
                                setExpanded={setExpanded}
                              />
                            </div>
                          </TableCell>
                        </TableRow>

                        {/* Children rows */}
                        {expanded[parent.id] &&
                          children.map((c) => (
                            <TableRow key={c.id} className="bg-muted/30">
                              <TableCell className="font-mono text-xs md:text-sm">
                                {c.index}
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
                                  {c.topic}
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
                          ))}
                      </Fragment>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {shouldPaginate && (
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-2">
              <div className="text-sm text-muted-foreground">
                แสดง {pageGroups.length} กลุ่ม จากทั้งหมด{" "}
                {filteredGroups.length} กลุ่ม
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
