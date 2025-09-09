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
  "สลก.", "ศกช.", "กนผ.", "สวศ.", "ศสส.", "ศปผ.", "กศป.",
  ...Array.from({ length: 12 }, (_, i) => `สศท.${i + 1}`),
];

export const SCORE_RULES = { highMin: 60, mediumMin: 41 };
export function toGrade(score: number): "H" | "M" | "L" {
  if (score === undefined || score === null) return "L";
  if (score >= 75) return "H";
  if (score >= 50) return "M";
  return "L";
}
export function scoreFromIndex(idx: string): number {
  const n = Number(idx.replace(/\D/g, "")) || 0;
  switch (n % 7) {
    case 0: return 65;
    case 1: return 56;
    case 2: return 55;
    case 3: return 54;
    case 4: return 51;
    case 5: return 44;
    default: return 10;
  }
};

export function evaluateRows(rows: Row[]): Row[] {
  // เติมคะแนน/เกรด และอัปเดตพาเรนต์ = max ลูก
  const withScores = rows.map((r) => {
    const s = r.score > 0 ? r.score : scoreFromIndex(r.index);
    return { ...r, score: s, grade: toGrade(s), status: s > 0 ? "ประเมินแล้ว" : r.status };
  });

  const byIndex = new Map(withScores.map((r) => [r.index, r]));
  const parents = withScores.filter((r) => !r.index.includes("."));
  for (const p of parents) {
    const children = withScores.filter((c) => c.index.startsWith(p.index + "."));
    if (children.length) {
      const maxChild = Math.max(...children.map((c) => c.score || 0));
      const score = Math.max(p.score || 0, maxChild);
      byIndex.set(p.index, { ...p, score, grade: toGrade(score), status: "ประเมินแล้ว" });
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
function tagCategory(rows: Row[], cat: keyof typeof CATEGORY_LABELS): RowWithCategory[] {
  const label = CATEGORY_LABELS[cat];
  return rows.map(r => ({ ...r, audit_category_name: label }));
}

/** ✅ ก้อนเดียวที่พร้อมใช้ทุกที่ */
export function buildAllRowsRaw(): RowWithCategory[] {
  const unit = tagCategory(buildUnitRows(), "unit");
  const work = tagCategory(buildWorkRows(), "work");
  const project = tagCategory(buildProjectRows(), "project");
  const carry = tagCategory(buildCarryRows(), "carry");
  const activity = tagCategory(buildActivityRows(), "activity");

  // หมวด process / it ยังไม่มี mock แยกของตัวเอง
  // ถ้าต้องมีจริง ค่อยเติม buildProcessRows(), buildItRows() แล้ว tagCategory เพิ่ม
  const all = [...unit, ...work, ...project, ...carry, ...activity];

  // เรียงตาม index
  all.sort((a, b) => {
    const A = a.index.split(".").map(Number);
    const B = b.index.split(".").map(Number);
    return A[0] !== B[0] ? A[0] - B[0] : (A[1] || 0) - (B[1] || 0);
  });
  return all;
}

/** 🔁 ฟังก์ชันเดิม: แปลง “ก้อนเดียว” ให้เป็น rowsByTab (เผื่อจุดอื่นยังใช้รูปเดิม) */
export function buildRowsByTabRaw(): Record<Exclude<TabKey,"all">, Row[]> {
  const all = buildAllRowsRaw();
  const pick = (label: RowWithCategory["audit_category_name"]) =>
    all.filter(r => r.audit_category_name === label);

  return {
    unit: pick(CATEGORY_LABELS.unit),
    work: pick(CATEGORY_LABELS.work),
    project: pick(CATEGORY_LABELS.project),
    carry: pick(CATEGORY_LABELS.carry),
    activity: pick(CATEGORY_LABELS.activity),
    process: pick(CATEGORY_LABELS.process),   // ตอนนี้ว่าง (ไม่มี mock)
    it: pick(CATEGORY_LABELS.it),             // ตอนนี้ว่าง (ไม่มี mock)
  };
}

/** ใช้ก้อนเดียวค้นหา (ปลอดภัยกว่า) */
export function findRowById(id: string): Row | undefined {
  const all = buildAllRowsRaw();
  return all.find(r => r.id === id);
}

/* -------------------------------------------------------
   ✅ Mock builders (เดิม) — ปรับแค่ส่วน "งาน" ให้เป็น 1–19 + 20++
   ------------------------------------------------------- */

function buildUnitRows(): Row[] {
  const parent: Row = {
    id: "101", index: "101", unit: "กพร.",
    mission: "ภารกิจตามกฎกระทรวง (รวม 5 ภารกิจ)",
    work: "-", project: "-", carry: "-", activity: "-", process: "-", system: "-", itType: "-",
    score: 0, grade: "-", status: "ยังไม่ได้ประเมิน", hasDoc: true,
  };
  const children: Row[] = [
    ["101.1", "กำกับ ติดตาม และประเมินประสิทธิภาพภาครัฐ"],
    ["101.2", "พัฒนาระบบบริหารจัดการองค์กร"],
    ["101.3", "พัฒนามาตรฐานและกระบวนงาน"],
    ["101.4", "เสริมสร้างธรรมาภิบาลและคุณธรรม"],
    ["101.5", "จัดทำตัวชี้วัดและรายงานผล"],
  ].map(([index, mission]) => ({
    id: index as string, index: index as string, unit: "กพร.",
    mission: mission as string,
    work: "-", project: "-", carry: "-", activity: "-", process: "-", system: "-", itType: "-",
    score: 0, grade: "-", status: "ยังไม่ได้ประเมิน", hasDoc: true,
  }));
  return [parent, ...children];
}


function buildWorkRows(): Row[] {
  // helper สำหรับสร้างแถวมาตรฐาน
  const mkRow = (idx: number, unit: string, work: string): Row => ({
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

  // 1–19 : งานสารบรรณของแต่ละหน่วย (เดิม 1.1–1.19)
  const block1 = SARABUN_UNITS.map((u, i) => mkRow(i + 1, u, "งานสารบรรณ"));

  // เดิม 2–32 => เปลี่ยนเป็น 20–50 (ตามที่คุยกัน)
  const defs = [
    { unit: "สลก.", work: "งานทรัพยากรบุคคล" },
    { unit: "กพร./สลก./ศกช./กนผ./สวศ./ศสส./ศปผ./กศป./สศท.1-12", work: "งานการเงิน บัญชี และงบประมาณ" },
    { unit: "กพร./สลก./ศกช./กนผ./สวศ./ศสส./ศปผ./กศป./สศท.1-12", work: "งานพัสดุ" },
    { unit: "สลก.", work: "งานประชาสัมพันธ์" },
    { unit: "สลก.", work: "งานแผนงานและงบประมาณ" },
    { unit: "สลก.", work: "งานช่วยอำนวยการและงานเลขานุการของสำนักงาน" },
    { unit: "ศปผ.", work: "งานกฎหมาย นิติกรรมสัญญา เสริมสร้างวินัยและพัฒนาระบบคุณธรรม" },
    { unit: "กนผ./สศท.1-12", work: "งานนโยบายและแผนการเกษตร ..." },
    { unit: "กนผ.", work: "งานนโยบายและแผนพัฒนาการเกษตรพื้นที่เศรษฐกิจเฉพาะ" },
    { unit: "กนผ.", work: "งานแผนงานและงบประมาณของกระทรวงเกษตรและสหกรณ์" },
    { unit: "กนผ.", work: "งานวิเคราะห์และประมาณการเศรษฐกิจการเกษตร" },
    { unit: "กนผ.", work: "งานนโยบายและแผนพัฒนาระบบโลจิสติกด้านการเกษตร" },
    { unit: "กศป.", work: "งานนโยบายและยุทธศาสตร์ ..." },
    { unit: "กศป.", work: "งานติดตามการปฏิบัติงานตามพันธกรณี ..." },
    { unit: "กศป.", work: "งานประสานงานเกี่ยวกับการสำรองข้าวฉุกเฉิน" },
    { unit: "ศปผ.", work: "งานประเมินผล ..." },
    { unit: "ศปผ.", work: "งานวิชาการและนวัตกรรมการประเมินผล" },
    { unit: "ศปผ.", work: "งานประสานงานโครงการอันเนื่องมาจากพระราชดำริ" },
    { unit: "ศสส.", work: "งานภูมิสารสนเทศการเกษตร" },
    { unit: "ศสส.", work: "งานเทคโนโลยีสารสนเทศ" },
    { unit: "ศสส./สศท.1-12", work: "งานสารสนเทศเศรษฐกิจการเกษตร ..." },
    { unit: "ศสส.", work: "งานพยากรณ์ข้อมูลการเกษตร" },
    { unit: "ศสส.", work: "งานปฏิบัติการข้อมูลการเกษตร" },
    { unit: "สวศ.", work: "งานวิจัยเศรษฐกิจการเกษตร ..." },
    { unit: "สวศ.", work: "งานเสริมสร้างนวัตกรรมด้านวิจัยเศรษฐกิจการเกษตร" },
    { unit: "สวศ.", work: "งานบริหารกองทุนภาคเกษตร" },
    { unit: "ศกช.", work: "งานธรรมาภิบาลข้อมูลงานบริการข้อมูล" },
    { unit: "ศกช.", work: "งานวิทยาศาสตร์ข้อมูลและปัญญาประดิษฐ์" },
    { unit: "ศกช.", work: "งานวิเคราะห์เศรษฐกิจการเกษตร" },
    { unit: "ศกช.", work: "งานติดตามและวิเคราะห์ภัยพิบัติทางการเกษตร" },
    { unit: "กพร.", work: "งานพัฒนาระบบราชการและระบบบริหารการจัดการภาครัฐ" },
  ] as const;

  const block2 = defs.map((t, i) => mkRow(19 + i + 1, t.unit, t.work));

  return [...block1, ...block2];
}

function buildProjectRows(): Row[] {
  const parent: Row = {
    id: "201", index: "201", unit: "หลายหน่วยงาน",
    mission: "-", work: "-", project: "โครงการสำคัญปี 2568 (รวม 8 โครงการ)",
    carry: "-", activity: "-", process: "-", system: "-", itType: "-",
    score: 0, grade: "-", status: "ยังไม่ได้ประเมิน", hasDoc: true,
  };
  const names = [
    "พัฒนาระบบข้อมูลเศรษฐกิจการเกษตร",
    "ยกระดับการพยากรณ์ผลผลิต",
    "สนับสนุนการเจรจาการค้าเกษตร",
    "เฝ้าระวังภัยพิบัติการเกษตร",
    "ขับเคลื่อนโลจิสติกส์การเกษตร",
    "พัฒนามาตรฐานข้อมูลกลาง",
    "สนับสนุนงานวิจัยเศรษฐกิจการเกษตร",
    "สื่อสารสาธารณะด้านข้อมูลเกษตร",
  ];
  const children: Row[] = names.map((n, i) => ({
    id: `201.${i + 1}`, index: `201.${i + 1}`, unit: i % 2 ? "ศสส." : "ศกช.",
    mission: "-", work: "-", project: n, carry: "-", activity: "-", process: "-", system: "-",
    itType: "-", score: 0, grade: "-", status: "ยังไม่ได้ประเมิน", hasDoc: true,
  }));
  return [parent, ...children];
}

function buildCarryRows(): Row[] {
  const parent: Row = {
    id: "301", index: "301", unit: "หลายหน่วยงาน",
    mission: "-", work: "-", project: "-", carry: "โครงการกันเงินเหลื่อมปี 2568 (รวม 4 โครงการ)",
    activity: "-", process: "-", system: "-", itType: "-",
    score: 0, grade: "-", status: "ยังไม่ได้ประเมิน", hasDoc: true,
  };
  const children: Row[] = [
    "กันเงิน: ปรับปรุงคลังข้อมูลกลาง",
    "กันเงิน: จัดซื้ออุปกรณ์สนับสนุนการสำรวจ",
    "กันเงิน: ปรับปรุงระบบเอกสารอิเล็กทรอนิกส์",
    "กันเงิน: กิจกรรมพัฒนาบุคลากรเชิงลึก",
  ].map((n, i) => ({
    id: `301.${i + 1}`, index: `301.${i + 1}`, unit: i % 2 ? "สลก." : "ศสส.",
    mission: "-", work: "-", project: "-", carry: n, activity: "-", process: "-", system: "-",
    itType: "-", score: 0, grade: "-", status: "ยังไม่ได้ประเมิน", hasDoc: true,
  }));
  return [parent, ...children];
}

function buildActivityRows(): Row[] {
  const parent: Row = {
    id: "401", index: "401", unit: "หลายหน่วยงาน",
    mission: "-", work: "-", project: "-", carry: "-",
    activity: "กิจกรรม (ผลผลิต) ปี 2568 (รวม 6 กิจกรรม)",
    process: "-", system: "-", itType: "-",
    score: 0, grade: "-", status: "ยังไม่ได้ประเมิน", hasDoc: true,
  };
  const items = [
    "พัฒนาระบบและแพลตฟอร์มข้อมูล",
    "วิจัยและจัดทำข้อเสนอเชิงนโยบาย",
    "ฝึกอบรม/ถ่ายทอดองค์ความรู้",
    "เผยแพร่ข้อมูลและสื่อสารสาธารณะ",
    "สำรวจและเก็บรวบรวมข้อมูลภาคสนาม",
    "ติดตามและประเมินผลโครงการ",
  ];
  const children: Row[] = items.map((n, i) => ({
    id: `401.${i + 1}`, index: `401.${i + 1}`,
    unit: ["ศสส.", "สวศ.", "กศป.", "ศปผ.", "กนผ.", "ศกช."][i] || "ศสส.",
    mission: "-", work: "-", project: "-", carry: "-",
    activity: n, process: "-", system: "-", itType: "-",
    score: 0, grade: "-", status: "ยังไม่ได้ประเมิน", hasDoc: true,
  }));
  return [parent, ...children];
}
