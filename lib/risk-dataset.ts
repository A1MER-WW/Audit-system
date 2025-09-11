import { Row, TabKey } from "@/types/risk";

/** ✅ เพิ่ม type ที่มีฟิลด์ audit_category_name ให้ก้อนรวม */
export type RowWithCategory = Row & {
  audit_category_name:
    | "หน่วยงาน"
    | "งาน"
    | "โครงการ"
    | "โครงการกันเงินเหลื่อมปี"
    | "กิจกรรม"
    | "กระบวนงาน"
    | "IT และ Non-IT";
};

const SARABUN_UNITS: string[] = [
  "สลก.",
  "ศกช.",
  "กนผ.",
  "สวศ.",
  "ศสส.",
  "ศปผ.",
  "กศป.",
  ...Array.from({ length: 12 }, (_, i) => `สศท.${i + 1}`),
];

export const SCORE_RULES = { excellentMin: 80, highMin: 60, mediumMin: 40, lowMin: 20 };
export function toGrade(score: number): "E" | "H" | "M" | "L" | "N" {
  if (score === undefined || score === null) return "N";
  if (score >= 80) return "E";
  if (score >= 60) return "H";
  if (score >= 40) return "M";
  if (score >= 20) return "L";
  return "N";
}
export function scoreFromIndex(idx: string): number {
  const n = Number(idx.replace(/\D/g, "")) || 0;
  switch (n % 7) {
    case 0:
      return 65;
    case 1:
      return 56;
    case 2:
      return 55;
    case 3:
      return 54;
    case 4:
      return 51;
    case 5:
      return 44;
    default:
      return 10;
  }
}

export function evaluateRows(rows: Row[]): Row[] {
  // เติมคะแนน/เกรด และอัปเดตพาเรนต์ = max ลูก
  const withScores = rows.map((r) => {
    const s = r.score > 0 ? r.score : scoreFromIndex(r.index);
    return {
      ...r,
      score: s,
      grade: toGrade(s),
      status: s > 0 ? "ประเมินแล้ว" : r.status,
    };
  });

  const byIndex = new Map(withScores.map((r) => [r.index, r]));
  const parents = withScores.filter((r) => !r.index.includes("."));
  for (const p of parents) {
    const children = withScores.filter((c) =>
      c.index.startsWith(p.index + ".")
    );
    if (children.length) {
      const maxChild = Math.max(...children.map((c) => c.score || 0));
      const score = Math.max(p.score || 0, maxChild);
      byIndex.set(p.index, {
        ...p,
        score,
        grade: toGrade(score),
        status: "ประเมินแล้ว",
      });
    }
  }

  return Array.from(byIndex.values()).sort((a, b) => {
    const A = a.index.split(".").map(Number);
    const B = b.index.split(".").map(Number);
    return A[0] !== B[0] ? A[0] - B[0] : (A[1] || 0) - (B[1] || 0);
  });
}

/* -------------------------------------------------------
   ✅ ก้อนเดียว (ALL) + มี audit_category_name
   ------------------------------------------------------- */

/** ป้ายชื่อหมวด (ไทย) สำหรับแปะใน audit_category_name */
const CATEGORY_LABELS = {
  unit: "หน่วยงาน",
  work: "งาน",
  project: "โครงการ",
  carry: "โครงการกันเงินเหลื่อมปี",
  activity: "กิจกรรม",
  process: "กระบวนงาน",
  it: "IT และ Non-IT",
} as const;

/** ใส่ป้าย audit_category_name ให้แถว */
function tagCategory(
  rows: Row[],
  cat: keyof typeof CATEGORY_LABELS
): RowWithCategory[] {
  const label = CATEGORY_LABELS[cat];
  return rows.map((r) => ({ ...r, audit_category_name: label }));
}

/** ✅ ก้อนเดียวที่พร้อมใช้ทุกที่ */
export function buildAllRowsRaw(): RowWithCategory[] {
  const unit = tagCategory(buildUnitRows(), "unit");
  const work = tagCategory(buildWorkRows(), "work");
  const project = tagCategory(buildProjectRows(), "project");
  const carry = tagCategory(buildCarryRows(), "carry");
  const activity = tagCategory(buildActivityRows(), "activity");
  const process = tagCategory(buildProcessRows(), "process");
  const it = tagCategory(buildItRows(), "it");

  // หมวด process / it ยังไม่มี mock แยกของตัวเอง
  // ถ้าต้องมีจริง ค่อยเติม buildProcessRows(), buildItRows() แล้ว tagCategory เพิ่ม
  const all = [
    ...unit,
    ...work,
    ...project,
    ...carry,
    ...activity,
    ...process,
    ...it,
  ];

  // เรียงตาม index
  all.sort((a, b) => {
    const A = a.index.split(".").map(Number);
    const B = b.index.split(".").map(Number);
    return A[0] !== B[0] ? A[0] - B[0] : (A[1] || 0) - (B[1] || 0);
  });
  return all;
}

/** 🔁 ฟังก์ชันเดิม: แปลง “ก้อนเดียว” ให้เป็น rowsByTab (เผื่อจุดอื่นยังใช้รูปเดิม) */
export function buildRowsByTabRaw(): Record<Exclude<TabKey, "all">, Row[]> {
  const all = buildAllRowsRaw();
  const pick = (label: RowWithCategory["audit_category_name"]) =>
    all.filter((r) => r.audit_category_name === label);

  return {
    unit: pick(CATEGORY_LABELS.unit),
    work: pick(CATEGORY_LABELS.work),
    project: pick(CATEGORY_LABELS.project),
    carry: pick(CATEGORY_LABELS.carry),
    activity: pick(CATEGORY_LABELS.activity),
    process: pick(CATEGORY_LABELS.process), // ตอนนี้ว่าง (ไม่มี mock)
    it: pick(CATEGORY_LABELS.it), // ตอนนี้ว่าง (ไม่มี mock)
  };
}

/** ใช้ก้อนเดียวค้นหา (ปลอดภัยกว่า) */
export function findRowById(id: string): Row | undefined {
  const all = buildAllRowsRaw();
  return all.find((r) => r.id === id);
}

/* -------------------------------------------------------
   ✅ Mock builders (เดิม) — ปรับแค่ส่วน "งาน" ให้เป็น 1–19 + 20++
   ------------------------------------------------------- */

function buildWorkRows(): Row[] {
  const mk = (idx: number, unit: string, work: string): Row => ({
    id: String(idx),
    index: String(idx),
    unit,
    mission: "-",
    work,
    project: "-",
    carry: "-",
    activity: "-",
    process: "-",
    system: "-",
    itType: "-",
    score: 0,
    grade: "-",
    status: "ยังไม่ได้ประเมิน",
    hasDoc: true,
  });

  // 1–3 : งานสารบรรณ (3 หน่วยแรก)
  const block1 = SARABUN_UNITS.slice(0, 3).map((u, i) =>
    mk(i + 1, u, "งานสารบรรณ")
  );

  // 4–6 : งานเฉพาะ
  const defs = [
    { unit: "สลก.", work: "งานทรัพยากรบุคคล" },
    {
      unit: "กพร./สลก./ศกช./กนผ./สวศ./ศสส./ศปผ./กศป./สศท.1-12",
      work: "งานการเงิน บัญชี และงบประมาณ",
    },
    { unit: "ศสส.", work: "งานเทคโนโลยีสารสนเทศ" },
  ];
  const block2 = defs.map((t, i) => mk(4 + i, t.unit, t.work));

  return [...block1, ...block2]; // 1–6
}

function buildUnitRows(): Row[] {
  const mk = (idx: number, mission: string, unit = "กพร."): Row => ({
    id: String(idx),
    index: String(idx),
    unit,
    mission,
    work: "-",
    project: "-",
    carry: "-",
    activity: "-",
    process: "-",
    system: "-",
    itType: "-",
    score: 0,
    grade: "-",
    status: "ยังไม่ได้ประเมิน",
    hasDoc: true,
  });

  return [
    mk(7, "กำกับติดตามและประเมินประสิทธิภาพภาครัฐ"),
    mk(8, "พัฒนาระบบบริหารจัดการองค์กร"),
    mk(9, "เสริมสร้างธรรมาภิบาลและคุณธรรม"),
  ];
}

function buildProjectRows(): Row[] {
  const mk = (idx: number, unit: string, project: string): Row => ({
    id: String(idx),
    index: String(idx),
    unit,
    mission: "-",
    work: "-",
    project,
    carry: "-",
    activity: "-",
    process: "-",
    system: "-",
    itType: "-",
    score: 0,
    grade: "-",
    status: "ยังไม่ได้ประเมิน",
    hasDoc: true,
  });

  return [
    mk(10, "ศกช.", "พัฒนาระบบข้อมูลเศรษฐกิจการเกษตร"),
    mk(11, "ศสส.", "ยกระดับการพยากรณ์ผลผลิต"),
    mk(12, "กนผ.", "เฝ้าระวังและบริหารจัดการภัยพิบัติการเกษตร"),
  ];
}

function buildCarryRows(): Row[] {
  const mk = (idx: number, unit: string, carry: string): Row => ({
    id: String(idx),
    index: String(idx),
    unit,
    mission: "-",
    work: "-",
    project: "-",
    carry,
    activity: "-",
    process: "-",
    system: "-",
    itType: "-",
    score: 0,
    grade: "-",
    status: "ยังไม่ได้ประเมิน",
    hasDoc: true,
  });

  return [
    mk(13, "ศสส.", "กันเงิน: ปรับปรุงคลังข้อมูลกลาง"),
    mk(14, "สลก.", "กันเงิน: จัดซื้ออุปกรณ์สนับสนุนการสำรวจ"),
    mk(15, "กศป.", "กันเงิน: ปรับปรุงระบบเอกสารอิเล็กทรอนิกส์"),
  ];
}

function buildActivityRows(): Row[] {
  const mk = (idx: number, unit: string, activity: string): Row => ({
    id: String(idx),
    index: String(idx),
    unit,
    mission: "-",
    work: "-",
    project: "-",
    carry: "-",
    activity,
    process: "-",
    system: "-",
    itType: "-",
    score: 0,
    grade: "-",
    status: "ยังไม่ได้ประเมิน",
    hasDoc: true,
  });

  return [
    mk(16, "ศสส.", "พัฒนาระบบและแพลตฟอร์มข้อมูล"),
    mk(17, "สวศ.", "วิจัยและจัดทำข้อเสนอเชิงนโยบาย"),
    mk(18, "ศปผ.", "เผยแพร่ข้อมูลและสื่อสารสาธารณะ"),
  ];
}
function buildProcessRows(): Row[] {
  const mk = (idx: number, unit: string, process: string): Row => ({
    id: String(idx),
    index: String(idx),
    unit,
    mission: "-",
    work: "-",
    project: "-",
    carry: "-",
    activity: "-",
    process,
    system: "-",
    itType: "-",
    score: 0,
    grade: "-",
    status: "ยังไม่ได้ประเมิน",
    hasDoc: true,
  });

  return [
    mk(19, "กพร.", "กระบวนงานด้านตรวจสอบคุณภาพ"),
    mk(20, "ศกช.", "กระบวนงานด้านวิเคราะห์ข้อมูล"),
  ];
}

function buildItRows(): Row[] {
  const mk = (
    idx: number,
    unit: string,
    system: string,
    itType: "IT" | "Non-IT"
  ): Row => ({
    id: String(idx),
    index: String(idx),
    unit,
    mission: "-",
    work: "-",
    project: "-",
    carry: "-",
    activity: "-",
    process: "-",
    system,
    itType,
    score: 0,
    grade: "-",
    status: "ยังไม่ได้ประเมิน",
    hasDoc: true,
  });

  return [
    mk(21, "ศสส.", "ระบบเครือข่ายข้อมูลกลาง", "IT"),
    mk(22, "สลก.", "ระบบสารบรรณอิเล็กทรอนิกส์", "Non-IT"),
  ];
}
