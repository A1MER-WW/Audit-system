import { NextResponse } from "next/server";
import { buildRowsByTabRaw } from "@/lib/risk-dataset";
import { Row } from "@/types/risk";
import { formsMap } from "@/lib/mock-risk-db";

const SCORE_RULES = { highMin: 60, mediumMin: 41 };
const toGrade = (s: number) => (s >= SCORE_RULES.highMin ? "H" : s >= SCORE_RULES.mediumMin ? "M" : "L");

// function resetToUnassessed(rows: Row[]): Row[] {
//   return rows.map((r) => ({
//     ...r,
//     score: 0,
//     grade: "-",
//     status: "ยังไม่ได้ประเมิน",
//   }));
// }

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const year = searchParams.get("year") ?? "2568";

  const rowsByTabRaw = buildRowsByTabRaw();

  const rowsByTab = Object.fromEntries(
    Object.entries(rowsByTabRaw).map(([k, rows]) => [
      k,
      mergeScoresFromForms(rows),
    ])
  ) as typeof rowsByTabRaw;

  return NextResponse.json({
    fiscalYears: [2568],
    pageTitle: "วางแผนงานตรวจสอบภายใน",
    subtitle: "การประเมินความเสี่ยงและการจัดลำดับความเสี่ยง",
    assessmentName: `ประเมินและจัดลำดับความเสี่ยงแผนการตรวจสอบประจำปี ${year}`,
    statusLine: { label: "สถานะ:", value: "ผู้ตรวจสอบกำลังประเมินความเสี่ยง" },
    rowsByTab, // <-- ใช้ตัวที่ merge แล้ว (ไม่ต้องพึ่ง ?scored=true อีก)
  });
}

function mergeScoresFromForms(rows: Row[]): Row[] {
  const cloned = rows.map(r => ({ ...r }));
  const byIndex = new Map<string, Row>();
  for (const r of cloned) {
    // ถ้าเป็นแถวลูกและมีฟอร์ม
    const f = formsMap.get(r.id); // <-- อ่านจาก mock DB ที่ PATCH ไปเมื่อกี้
    if (f) {
      const score = f.resultScore ?? 0;
      const allItems = f.groups.flatMap(g => g.items);
      const filled = allItems.every(it => (it.values?.chance ?? 0) > 0 && (it.values?.impact ?? 0) > 0);
      r.score = score;
      r.grade = score > 0 ? toGrade(score) : "-";
      r.status = filled ? "ประเมินแล้ว" : "กำลังประเมิน";
    } else {
      // ยังไม่มีฟอร์ม: เป็น "ยังไม่ได้ประเมิน" ศูนย์คะแนน
      r.score = 0;
      r.grade = "-";
      r.status = "ยังไม่ได้ประเมิน";
    }
    byIndex.set(r.index, r);
  }

  // อัปเดตพาเรนต์ = max ลูก
  const parents = cloned.filter(r => !r.index.includes("."));
  for (const p of parents) {
    const children = cloned.filter(c => c.index.startsWith(p.index + "."));
    if (children.length) {
      const maxChildScore = Math.max(...children.map(c => c.score || 0));
      const anyFilled = children.some(c => c.status !== "ยังไม่ได้ประเมิน");
      const allDone = children.length > 0 && children.every(c => c.status === "ประเมินแล้ว");
      const status = allDone ? "ประเมินแล้ว" : anyFilled ? "กำลังประเมิน" : "ยังไม่ได้ประเมิน";
      const score = maxChildScore;
      byIndex.set(p.index, { ...p, score, grade: score > 0 ? toGrade(score) : "-", status });
    }
  }

  return Array.from(byIndex.values()).sort((a, b) => {
    const A = a.index.split(".").map(Number);
    const B = b.index.split(".").map(Number);
    return A[0] !== B[0] ? A[0] - B[0] : (A[1] || 0) - (B[1] || 0);
  });
}
