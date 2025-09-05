// app/api/risk-assessment/route.ts
import { NextResponse } from "next/server";

export type TabKey = "all" | "unit" | "work" | "project" | "carry" | "activity" | "process" | "it";
export type Row = {
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

const SARABUN_UNITS: string[] = [
  "สลก.", "ศกช.", "กนผ.", "สวศ.", "ศสส.", "ศปผ.", "กศป.",
  ...Array.from({ length: 12 }, (_, i) => `สศท.${i + 1}`),
];

/* ============ กติกาคะแนน/เกรด + ตัวช่วยคำนวณ ============ */
// เกณฑ์เกรด
const SCORE_RULES = { highMin: 60, mediumMin: 41 };
const toGrade = (s: number): Row["grade"] =>
  s >= SCORE_RULES.highMin ? "H" : s >= SCORE_RULES.mediumMin ? "M" : "L";

// ให้คะแนนแบบ deterministic จาก index (กระจายเป็นชุดตัวเลขคุ้น ๆ: 65, 56, 55, 54, 51, 44, 10)
const scoreFromIndex = (idx: string): number => {
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

// คำนวณคะแนนทั้งชุด (ลูกได้คะแนนจาก index, พาเรนต์ใช้ "สูงสุดของลูก" หรือคะแนนตัวเองหากไม่มีลูก)
function evaluateRows(rows: Row[]): Row[] {
  // 1) เติมคะแนน/เกรดให้ทุกรายการ (ทั้งพาเรนต์/ลูก)
  const withScores = rows.map((r) => {
    const s = r.score > 0 ? r.score : scoreFromIndex(r.index);
    return {
      ...r,
      score: s,
      grade: toGrade(s),
      status: s > 0 ? "ประเมินแล้ว" : r.status,
    };
  });

  // 2) อัปเดตพาเรนต์ให้เป็น "ค่าสูงสุดของลูก"
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
    // คงลำดับตาม index
    const A = a.index.split(".").map(Number);
    const B = b.index.split(".").map(Number);
    return A[0] !== B[0] ? A[0] - B[0] : (A[1] || 0) - (B[1] || 0);
  });
}

/* ============ Builders (ชุดดิบ: 0 คะแนน) ============ */
function buildWorkRows(): Row[] {
  const parent1: Row = {
    id: "1", index: "1", unit: "กพร. และอีก 19 หน่วยงาน",
    mission: "-", work: "งานสารบรรณ", project: "-", carry: "-",
    activity: "-", process: "-", system: "-", itType: "-",
    score: 0, grade: "-", status: "ยังไม่ได้ประเมิน", hasDoc: true,
  };
  const children1: Row[] = SARABUN_UNITS.map((u, i) => ({
    id: `1.${i + 1}`, index: `1.${i + 1}`, unit: u,
    mission: "-", work: "งานสารบรรณ", project: "-", carry: "-",
    activity: "-", process: "-", system: "-", itType: "-",
    score: 0, grade: "-", status: "ยังไม่ได้ประเมิน", hasDoc: true,
  }));

  const topLevel: Array<{ idx: string; unit: string; work: string }> = [
    { idx: "2", unit: "สลก.", work: "งานทรัพยากรบุคคล" },
    { idx: "3", unit: "กพร./สลก./ศกช./กนผ./สวศ./ศสส./ศปผ./กศป./สศท.1-12", work: "งานการเงิน บัญชี และงบประมาณ" },
    { idx: "4", unit: "กพร./สลก./ศกช./กนผ./สวศ./ศสส./ศปผ./กศป./สศท.1-12", work: "งานพัสดุ" },
    { idx: "5", unit: "สลก.", work: "งานประชาสัมพันธ์" },
    { idx: "6", unit: "สลก.", work: "งานแผนงานและงบประมาณ" },
    { idx: "7", unit: "สลก.", work: "งานช่วยอำนวยการและงานเลขานุการของสำนักงาน" },
    { idx: "8", unit: "ศปผ.", work: "งานกฎหมาย นิติกรรมสัญญา เสริมสร้างวินัยและพัฒนาระบบคุณธรรม" },
    { idx: "9", unit: "กนผ./สศท.1-12", work: "งานนโยบายและแผนการเกษตร ..." },
    { idx: "10", unit: "กนผ.", work: "งานนโยบายและแผนพัฒนาการเกษตรพื้นที่เศรษฐกิจเฉพาะ" },
    { idx: "11", unit: "กนผ.", work: "งานแผนงานและงบประมาณของกระทรวงเกษตรและสหกรณ์" },
    { idx: "12", unit: "กนผ.", work: "งานวิเคราะห์และประมาณการเศรษฐกิจการเกษตร" },
    { idx: "13", unit: "กนผ.", work: "งานนโยบายและแผนพัฒนาระบบโลจิสติกด้านการเกษตร" },
    { idx: "14", unit: "กศป.", work: "งานนโยบายและยุทธศาสตร์ ..." },
    { idx: "15", unit: "กศป.", work: "งานติดตามการปฏิบัติงานตามพันธกรณี ..." },
    { idx: "16", unit: "กศป.", work: "งานประสานงานเกี่ยวกับการสำรองข้าวฉุกเฉิน" },
    { idx: "17", unit: "ศปผ.", work: "งานประเมินผล ..." },
    { idx: "18", unit: "ศปผ.", work: "งานวิชาการและนวัตกรรมการประเมินผล" },
    { idx: "19", unit: "ศปผ.", work: "งานประสานงานโครงการอันเนื่องมาจากพระราชดำริ" },
    { idx: "20", unit: "ศสส.", work: "งานภูมิสารสนเทศการเกษตร" },
    { idx: "21", unit: "ศสส.", work: "งานเทคโนโลยีสารสนเทศ" },
    { idx: "22", unit: "ศสส./สศท.1-12", work: "งานสารสนเทศเศรษฐกิจการเกษตร ..." },
    { idx: "23", unit: "ศสส.", work: "งานพยากรณ์ข้อมูลการเกษตร" },
    { idx: "24", unit: "ศสส.", work: "งานปฏิบัติการข้อมูลการเกษตร" },
    { idx: "25", unit: "สวศ.", work: "งานวิจัยเศรษฐกิจการเกษตร ..." },
    { idx: "26", unit: "สวศ.", work: "งานเสริมสร้างนวัตกรรมด้านวิจัยเศรษฐกิจการเกษตร" },
    { idx: "27", unit: "สวศ.", work: "งานบริหารกองทุนภาคเกษตร" },
    { idx: "28", unit: "ศกช.", work: "งานธรรมาภิบาลข้อมูลงานบริการข้อมูล" },
    { idx: "29", unit: "ศกช.", work: "งานวิทยาศาสตร์ข้อมูลและปัญญาประดิษฐ์" },
    { idx: "30", unit: "ศกช.", work: "งานวิเคราะห์เศรษฐกิจการเกษตร" },
    { idx: "31", unit: "ศกช.", work: "งานติดตามและวิเคราะห์ภัยพิบัติทางการเกษตร" },
    { idx: "32", unit: "กพร.", work: "งานพัฒนาระบบราชการและระบบบริหารการจัดการภาครัฐ" },
  ];
  const more: Row[] = topLevel.map((t) => ({
    id: t.idx, index: t.idx, unit: t.unit,
    mission: "-", work: t.work, project: "-", carry: "-",
    activity: "-", process: "-", system: "-", itType: "-",
    score: 0, grade: "-", status: "ยังไม่ได้ประเมิน", hasDoc: true,
  }));
  return [parent1, ...children1, ...more];
}

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

function buildProcessRows(): Row[] {
  const parent: Row = {
    id: "501", index: "501", unit: "หลายหน่วยงาน",
    mission: "-", work: "-", project: "-", carry: "-", activity: "-",
    process: "กระบวนการปฏิบัติงานมาตรฐาน (รวม 5 กระบวนการ)",
    system: "-", itType: "-",
    score: 0, grade: "-", status: "ยังไม่ได้ประเมิน", hasDoc: true,
  };
  const items = [
    "รับ-ส่งหนังสือ/สารบรรณภายใน",
    "จัดซื้อจัดจ้างและบริหารสัญญา",
    "บริหารงบประมาณและการเงิน",
    "ควบคุมคุณภาพและธรรมาภิบาลข้อมูล",
    "จัดทำ/ทบทวนมาตรฐานและคู่มือ",
  ];
  const children: Row[] = items.map((n, i) => ({
    id: `501.${i + 1}`, index: `501.${i + 1}`, unit: i < 2 ? "สลก." : i === 2 ? "กนผ." : "ศกช.",
    mission: "-", work: "-", project: "-", carry: "-", activity: "-",
    process: n, system: "-", itType: "-",
    score: 0, grade: "-", status: "ยังไม่ได้ประเมิน", hasDoc: true,
  }));
  return [parent, ...children];
}

function buildITRows(): Row[] {
  const parent: Row = {
    id: "601", index: "601", unit: "ศสส.",
    mission: "-", work: "-", project: "-", carry: "-", activity: "-", process: "-",
    system: "ระบบสารสนเทศที่เกี่ยวข้อง (รวม 7 รายการ)",
    itType: "-",
    score: 0, grade: "-", status: "ยังไม่ได้ประเมิน", hasDoc: true,
  };
  const systems: Array<[string, "IT" | "Non-IT", string]> = [
    ["AGRI Data Lake", "IT", "ศสส."],
    ["Agri-Forecast", "IT", "ศสส."],
    ["E-Document", "IT", "สลก."],
    ["Dashboard นโยบายเกษตร", "IT", "กนผ."],
    ["แบบฟอร์มรายงานภาคสนาม", "Non-IT", "สศท.1-12"],
    ["คู่มือ/แนวทางปฏิบัติ", "Non-IT", "กพร."],
    ["Data Governance Toolkit", "IT", "ศกช."],
  ];
  const children: Row[] = systems.map(([name, type, unit], i) => ({
    id: `601.${i + 1}`, index: `601.${i + 1}`, unit,
    mission: "-", work: "-", project: "-", carry: "-", activity: "-", process: "-",
    system: name, itType: type,
    score: 0, grade: "-", status: "ยังไม่ได้ประเมิน", hasDoc: true,
  }));
  return [parent, ...children];
}

/* ============ API ============ */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const year = searchParams.get("year") ?? "2568";
  const scored = searchParams.get("scored") === "true"; // <— ใช้สลับชุดข้อมูล

  const rowsByTabRaw = {
    unit: buildUnitRows(),
    work: buildWorkRows(),
    project: buildProjectRows(),
    carry: buildCarryRows(),
    activity: buildActivityRows(),
    process: buildProcessRows(),
    it: buildITRows(),
  } as Record<Exclude<TabKey, "all">, Row[]>;

  // ชุดที่ "ประเมินแล้ว"
  const rowsByTabScored = Object.fromEntries(
    (Object.entries(rowsByTabRaw) as [Exclude<TabKey,"all">, Row[]][])
      .map(([k, rows]) => [k, evaluateRows(rows)])
  ) as typeof rowsByTabRaw;

  const payload = {
    fiscalYears: [2568],
    pageTitle: "วางแผนงานตรวจสอบภายใน",
    subtitle: "การประเมินความเสี่ยงและการจัดลำดับความเสี่ยง",
    assessmentName: `ประเมินและจัดลำดับความเสี่ยงแผนการตรวจสอบประจำปี ${year}`,
    statusLine: { label: "สถานะ:", value: "ผู้ตรวจสอบกำลังประเมินความเสี่ยง" },
    // ส่งกลับ 2 ชุดให้เลือกใช้
    rowsByTab: scored ? rowsByTabScored : rowsByTabRaw,   // สลับด้วย ?scored=true
    rowsByTabScored,                                       // แนบมาเผื่อใช้งาน
    rowsByTabRaw,                                          // ชุดศูนย์คะแนนดิบ
  };

  return NextResponse.json(payload);
}
