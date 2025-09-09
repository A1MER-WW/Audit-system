import { NextRequest, NextResponse } from "next/server";
import { db, upsertOverride, YEAR_DEFAULT, refreshFormsMap } from "@/lib/mock-risk-db";
import { findRowById, toGrade } from "@/lib/risk-dataset";
import type { AssessmentForm } from "@/types/risk";

const YEAR = YEAR_DEFAULT;

const TEMPLATE = [
  {
    id: "S",
    title: "ด้านกลยุทธ์",
    items: [
      {
        id: "S1",
        label:
          "แผนปฏิบัติงาน/แนวปฏิบัติของโครงการ/งบประมาณ (มีผู้ปฏิบัติตามตามการวิเคราะห์และนโยบายของผู้บริหาร)",
      },
    ],
  },
  {
    id: "O",
    title: "ด้านการปฏิบัติงาน",
    items: [
      {
        id: "O1",
        label: "มีประกาศ/หนังสือ/คำสั่ง กำหนดบทบาท หน้าที่ และความรับผิดชอบ",
      },
      { id: "O2", label: "ผู้ปฏิบัติงานมีความชำนาญการปฏิบัติงาน" },
      { id: "O3", label: "การติดตามและประเมินผลการปฏิบัติงาน" },
    ],
  },
  {
    id: "G",
    title: "ด้านกฎหมาย ระบบ องค์กร",
    items: [
      { id: "G1", label: "การปฏิบัติตามกฎหมายและระเบียบ" },
      {
        id: "G2",
        label: "การควบคุมภายในของหน่วยงานตามเกณฑ์และกรอบ พ.ร.บ. 2567",
      },
    ],
  },
  {
    id: "K",
    title: "ด้านการจัดการความรู้",
    items: [{ id: "K1", label: "มีกิจกรรมการแลกเปลี่ยนเรียนรู้ภายในองค์กร" }],
  },
];

function recompute(form: AssessmentForm) {
  form.groups.forEach((g) => {
    g.total = g.items.reduce((s, it) => s + (it.values.score ?? 0), 0);
  });
  form.totalScore = form.groups.reduce((s, g) => s + (g.total ?? 0), 0);
  form.resultScore = form.totalScore;

  const max = TEMPLATE.reduce((s, g) => s + g.items.length, 0) * 25;
  form.composite = max ? Math.round((form.resultScore / max) * 100) : 0;
  form.grade = toGrade(form.resultScore);

  const allFilled = form.groups.every((g) =>
    g.items.every(
      (it) => (it.values?.chance ?? 0) > 0 && (it.values?.impact ?? 0) > 0
    )
  );
  form.status = allFilled ? "ประเมินแล้ว" : "กำลังประเมิน";
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const key = `${params.id}:${YEAR}`;
  const form = db.forms[key];
  if (!form) return NextResponse.json({ message: "No form" }, { status: 404 });
  return NextResponse.json({ message: "OK", data: form }, { status: 200 });
}

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const key = `${params.id}:${YEAR}`;
  if (db.forms[key])
    return NextResponse.json(
      { message: "Already exists", data: db.forms[key] },
      { status: 200 }
    );

  const row = findRowById(params.id);
  if (!row)
    return NextResponse.json({ message: "Row not found" }, { status: 404 });

  const groups = TEMPLATE.map((g) => ({
    id: g.id,
    title: g.title,
    items: g.items.map((it) => ({
      id: it.id,
      label: it.label,
      values: { chance: 0, impact: 0, score: 0 },
    })),
    total: 0,
  }));

  const form: AssessmentForm = {
    rowId: params.id,
    year: YEAR,
    groups,
    totalScore: 0,
    resultScore: 0,
    composite: 0,
    grade: "L",
    status: "กำลังประเมิน",
  };

  db.forms[key] = form;

  upsertOverride(params.id, { status: "กำลังประเมิน" });

  return NextResponse.json({ message: "Created", data: form }, { status: 201 });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const key = `${params.id}:${YEAR}`;
  const body = (await req.json()) as AssessmentForm;

  recompute(body);
  db.forms[key] = body;

  upsertOverride(params.id, {
    score: body.resultScore,
    grade: body.grade,
    status: body.status,
  });
  
  // Refresh forms map to update the list view
  refreshFormsMap();

  return NextResponse.json({ message: "Saved", data: body }, { status: 200 });
}
