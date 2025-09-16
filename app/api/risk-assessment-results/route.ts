import { NextRequest, NextResponse } from "next/server";
import { db, formsMap } from "@/lib/mock-risk-db";

// Import types from annual evaluations
import {
  mockAnnualEvaluations,
  type ApiAnnualEvaluation,
  type MaybeGrade,
  type EvaluationStatus,
} from "../annual-evaluations/route";

// Types สำหรับ Risk Assessment Results
export type ResultsApiResponse = {
  fiscalYears: number[];
  pageTitle: string;
  subtitle: string;
  assessmentName: string;
  statusLine: { label: string; value: string };
  rowsByTab: Partial<Record<Exclude<TabKey, "all">, ResultRow[]>>;
};

export type TabKey =
  | "all"
  | "unit"
  | "work"
  | "project"
  | "carry"
  | "activity"
  | "process"
  | "it";

export type ResultRow = {
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

// Helper function จาก annual evaluations route
function syncWithMockDatabase(
  data: ApiAnnualEvaluation[]
): ApiAnnualEvaluation[] {
  return data.map((a) => ({
    ...a,
    RiskEvaluations: a.RiskEvaluations.map((re) => ({
      ...re,
      auditTopics: re.auditTopics.map((t) => {
        // อัพเดต DepartmentAssessmentScore ก่อน
        const updatedDepartmentScores = t.DepartmentAssessmentScore.map(
          (ds) => {
            const compoundId = `a${a.id}-c${re.id}-t${t.id}-d${ds.department.id}`;
            const override = db.overrides[compoundId];
            const form = formsMap.get(compoundId);

            if (override || form) {
              return {
                ...ds,
                department: {
                  ...ds.department,
                  composite_score: override?.score ?? form?.composite ?? null,
                  grade: (override?.grade ?? form?.grade ?? null) as MaybeGrade,
                },
              };
            }

            return {
              ...ds,
              department: {
                ...ds.department,
                composite_score: null,
                grade: null,
              },
            };
          }
        );

        // คำนวณ topic level scores จาก department scores ที่อัพเดตแล้ว
        const validScores = updatedDepartmentScores
          .map((ds) => ds.department.composite_score)
          .filter((score): score is number => score !== null);

        const hasScores = validScores.length > 0;
        const avgScore = hasScores
          ? Math.round(
              validScores.reduce((sum, score) => sum + score, 0) /
                validScores.length
            )
          : 0;

        // ตรวจสอบสถานะแต่ละ department แยกกัน
        const departmentStatuses = updatedDepartmentScores.map((ds) => {
          const compoundId = `a${a.id}-c${re.id}-t${t.id}-d${ds.department.id}`;
          const override = db.overrides[compoundId];
          const form = formsMap.get(compoundId);
          return {
            departmentId: ds.department.id,
            status: override?.status ?? form?.status ?? "ยังไม่ได้ประเมิน",
            hasScore: (ds.department.composite_score ?? 0) > 0,
          };
        });

        const evaluatedDepartments = departmentStatuses.filter(d => d.hasScore);
        const allDone = evaluatedDepartments.length > 0 && 
                       evaluatedDepartments.every(d => d.status === "ประเมินแล้ว");

        return {
          ...t,
          total_score: hasScores ? avgScore : null,
          composite_score: hasScores ? avgScore : null,
          grade: hasScores
            ? ((avgScore >= 80
                ? "E"
                : avgScore >= 60
                ? "H"
                : avgScore >= 40
                ? "M"
                : avgScore >= 20
                ? "L"
                : "N") as MaybeGrade)
            : null,
          evaluation_status: evaluatedDepartments.length === 0
            ? ("PENDING" as EvaluationStatus)
            : allDone
            ? ("DONE" as EvaluationStatus)  
            : ("IN_PROGRESS" as EvaluationStatus),
          DepartmentAssessmentScore: updatedDepartmentScores,
        };
      }),
    })),
  }));
}

// Grade helper
const gradeFromScore = (s?: number) =>
  !s || s <= 0 ? "-" : s >= 60 ? "H" : s >= 41 ? "M" : "L";

// แปลงข้อมูล annual evaluations เป็น ResultRow
function convertToResultRows(
  annualEvaluations: ApiAnnualEvaluation[]
): Partial<Record<Exclude<TabKey, "all">, ResultRow[]>> {
  const rowsByTab: Partial<Record<Exclude<TabKey, "all">, ResultRow[]>> = {};
  let globalIndex = 1;

  annualEvaluations.forEach((annual) => {
    annual.RiskEvaluations.forEach((riskEval) => {
      const categoryName = riskEval.category.name;
      let tabKey: Exclude<TabKey, "all"> | null = null;

      // แมปหมวดหมู่เป็น tab key
      switch (categoryName) {
        case "หน่วยงาน":
          tabKey = "unit";
          break;
        case "งาน":
          tabKey = "work";
          break;
        case "โครงการ":
          tabKey = "project";
          break;
        case "โครงการกันเงินเหลื่อมปี":
          tabKey = "carry";
          break;
        case "กิจกรรม":
          tabKey = "activity";
          break;
        case "กระบวนงาน":
          tabKey = "process";
          break;
        case "IT/Non-IT":
          tabKey = "it";
          break;
        default:
          return; // skip unknown categories
      }

      if (!tabKey) return;

      riskEval.auditTopics.forEach((topic) => {
        // สร้างแถวแยกกันสำหรับแต่ละ department ไม่ต้องมี parent-child structure
        topic.DepartmentAssessmentScore.forEach((ds, idx) => {
          const row: ResultRow = {
            id: `a${annual.id}-c${riskEval.id}-t${topic.id}-d${ds.department.id}`,
            index: topic.DepartmentAssessmentScore.length === 1 
              ? globalIndex.toString() 
              : `${globalIndex}.${idx + 1}`,
            unit: ds.department.departmentName,
            mission: tabKey === "unit" ? topic.auditTopic : "-",
            work: tabKey === "work" ? topic.auditTopic : "-",
            project: tabKey === "project" ? topic.auditTopic : "-",
            carry: tabKey === "carry" ? topic.auditTopic : "-",
            activity: tabKey === "activity" ? topic.auditTopic : "-",
            process: tabKey === "process" ? topic.auditTopic : "-",
            system: tabKey === "it" ? topic.auditTopic : "-",
            itType: categoryName === "IT/Non-IT" 
              ? (topic.auditTopic.includes("(IT)") ? "IT" : topic.auditTopic.includes("(Non-IT)") ? "Non-IT" : "-")
              : "-",
            score: ds.department.composite_score ?? 0,
            maxScore: 100,
            grade: (ds.department.grade as ResultRow["grade"]) ?? (gradeFromScore(ds.department.composite_score ?? 0) as ResultRow["grade"]),
            status: (ds.department.composite_score ?? 0) > 0 ? "ประเมินแล้ว" : "ยังไม่ได้ประเมิน",
            hasDoc: true,
          };

          if (!rowsByTab[tabKey]) rowsByTab[tabKey] = [];
          rowsByTab[tabKey]!.push(row);
        });

        globalIndex++;
      });
    });
  });

  return rowsByTab;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get("year") || "2568";

    // ดึงข้อมูลจาก annual evaluations และ sync กับ mock database
    let data: ApiAnnualEvaluation[] = JSON.parse(
      JSON.stringify(mockAnnualEvaluations)
    );
    data = syncWithMockDatabase(data);

    // กรองตามปี
    const fiscalYear = parseInt(year);
    data = data.filter((a) => a.fiscalYear === fiscalYear);

    // แปลงเป็น result rows
    const rowsByTab = convertToResultRows(data);

    // สร้าง response
    const response: ResultsApiResponse = {
      fiscalYears: Array.from(new Set(mockAnnualEvaluations.map(a => a.fiscalYear))).sort((a, b) => b - a),
      pageTitle: "วางแผนงานตรวจสอบภายใน",
      subtitle: "การประเมินความเสี่ยงและการจัดลำดับความเสี่ยง",
      assessmentName: `ผลการประเมินความเสี่ยง แผนการตรวจสอบประจำปี ${year}`,
      statusLine: {
        label: "สถานะ:",
        value: data[0]?.status === "ASSESSOR_IN_PROGRESS" 
          ? "ผู้ตรวจสอบดำเนินการประเมินความเสี่ยง"
          : data[0]?.status === "AWAITING_DIRECTOR_REVIEW"
          ? "รอหัวหน้าหน่วยตรวจสอบพิจารณาผลการประเมินความเสี่ยง"
          : data[0]?.status === "DIRECTOR_APPROVED"
          ? "หัวหน้าหน่วยตรวจสอบพิจารณาอนุมัติผลการประเมินความเสี่ยงเรียบร้อยแล้ว"
          : "-"
      },
      rowsByTab,
    };

    // Delay เพื่อจำลอง API call
    await new Promise((r) => setTimeout(r, 300));

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch risk assessment results",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
