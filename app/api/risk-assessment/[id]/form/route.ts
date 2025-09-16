import { NextRequest, NextResponse } from "next/server";
import {
  db,
  upsertOverride,
  YEAR_DEFAULT,
  refreshFormsMap,
} from "@/lib/mock-risk-db";
import { findRowById, toGrade } from "@/lib/risk-dataset";
import type { AssessmentForm } from "@/types/risk";

const YEAR = YEAR_DEFAULT;

/** -------- หมวดหมู่ที่ใช้สุ่ม (ตา  // ✅ ใช้ categorie      // ✅ ใช้ categories ที่กำหนดใน TEMPLATE แทนการสุ่ม
      categories: it.categories || [],ี่กำหนดไว้ใน TEMPLATE แทนการสุ่ม
  const groups = TEMPLATE.map((g) => ({
    id: g.id,
    title: g.title,
    items: g.items.map((it) => ({
      id: it.id,
      label: it.label,
      // ใช้ categories ที่กำหนดไว้ใน TEMPLATE
      categories: it.categories || [],
      levels: it.levels, // ส่ง levels ไปให้ UI ใช้โชว์รายละเอียดระดับ
      values: { chance: 0, impact: 0, score: 0 },
    })),
    total: 0,
  }));---- */
const TAB_LABELS = {
  all: "ทั้งหมด",
  unit: "หน่วยงาน",
  work: "งาน",
  project: "โครงการ",
  carry: "โครงการกันเงินเหลื่อมปี",
  activity: "กิจกรรม",
  process: "กระบวนงาน",
  it: "IT/Non-IT",
} as const;

// pool สำหรับสุ่ม (ตัด "ทั้งหมด" ออก)
const CATEGORY_POOL = Object.values(TAB_LABELS).filter((v) => v !== "ทั้งหมด");

// สุ่มจำนวน n ระหว่าง min..max
function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// สุ่มหมวดหมู่ 1–2 ค่า (หรือปรับช่วงได้ตามต้องการ)
function pickRandomCategories() {
  const count = randInt(1, 2);
  const shuffled = [...CATEGORY_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/** ---------------- TEMPLATE (คงตามที่คุณมี) ---------------- */
// ... (TEMPLATE ของคุณคงไว้เหมือนเดิมด้านบน) ...
//  -- ย่อในคำตอบนี้เพื่อไม่ยาวเกินไป --
/* ใช้ TEMPLATE เดิมที่มี S,O,F,C,IT,FR และแต่ละ item มี levels อยู่แล้ว */
const TEMPLATE = [
  // ---------------- S ----------------
  {
    id: "S",
    title: "ด้านกลยุทธ์",
    items: [
      {
        id: "S1",
        categories: ["งาน", "หน่วยงาน", "โครงการ" , "โครงการกันเงินเหลื่อมปี"], // ใช้กรองแสดงเฉพาะหมวดที่เกี่ยวข้อง
        label:
          "แนวโน้มอัตราการปรับเปลี่ยน/โอน/ย้าย/ลาออก ของบุคลากรที่ปฏิบัติงาน",
        levels: {
          least:
            "หน่วยงานมีบุคลากรปฏิบัติงานจริงเต็มตามกรอบอัตรากำลัง และไม่มีการปรับเปลี่ยน/โอน/ย้าย/ลาออก ภายใน 2 ปี",
          low: "หน่วยงานมีบุคลากรปฏิบัติงานจริงเต็มตามกรอบอัตรากำลัง และไม่มีการปรับเปลี่ยน/โอน/ย้าย/ลาออก ภายใน 1 ปี",
          medium:
            "หน่วยงานมีบุคลากรปฏิบัติงานจริงเต็มตามกรอบอัตรากำลัง และไม่มีการปรับเปลี่ยน/โอน/ย้าย/ลาออกในปีงบประมาณ 2567",
          high: "หน่วยงานมีบุคลากรจริงน้อยกว่ากรอบอัตรากำลัง ~5%",
          highest: "หน่วยงานมีบุคลากรจริงน้อยกว่ากรอบอัตรากำลัง ~10%",
        },
      },
      {
        id: "S2",
        categories: ["โครงการ", "กิจกรรม"],
        label: "ผลการขับเคลื่อนแผนงาน/โครงการ ตามแผนปฏิบัติราชการของหน่วยงาน",
        levels: {
          least:
            "ผลการดำเนินงานบรรลุเป้าหมายทั้งหมดหรือเทียบเท่า 100% และไม่มีอุปสรรคสำคัญ",
          low: "ผลการดำเนินงานบรรลุเป้าหมายตามตัวชี้วัดส่วนใหญ่ โครงการ/กิจกรรมล่าช้าเล็กน้อย แต่สามารถควบคุมได้",
          medium:
            "ผลการดำเนินงานบรรลุเป้าหมายตามตัวชี้วัดในภาพรวม มีบางประเด็นต้องติดตามใกล้ชิด",
          high: "หลายโครงการ/กิจกรรมล่าช้า จำเป็นต้องเร่งรัดและมีความเสี่ยงต่อการไม่บรรลุเป้าหมาย",
          highest:
            "ส่วนใหญ่ไม่บรรลุตามแผน/ตัวชี้วัด มีผลกระทบต่อเป้าหมายเชิงยุทธศาสตร์",
        },
      },
    ],
  },

  // ---------------- F ----------------
  {
    id: "F",
    title: "ด้านการเงิน",
    items: [
      {
        id: "F1",
        categories: ["หน่วยงาน", "IT/Non-IT" , "โครงการกันเงินเหลื่อมปี"],
        label:
          "จำนวนแผนงาน/โครงการประจำปีงบประมาณ พ.ศ. 2567 ที่หน่วยงานเป็นผู้รับผิดชอบในการดำเนินการ",
        levels: {
          least: "เป็นหน่วยงานผู้ร่วมรับผิดชอบแผนงาน/โครงการ",
          low: "หน่วยงานเป็นผู้รับผิดชอบหลักในการขับเคลื่อนแผนงาน/โครงการ จำนวน 1 โครงการ",
          medium:
            "หน่วยงานเป็นผู้รับผิดชอบหลักในการขับเคลื่อนแผนงาน/โครงการ จำนวน 2 โครงการ",
          high: "หน่วยงานเป็นผู้รับผิดชอบหลักในการขับเคลื่อนแผนงาน/โครงการ จำนวน 3 โครงการ",
          highest:
            "หน่วยงานเป็นผู้รับผิดชอบหลักในการขับเคลื่อนแผนงาน/โครงการ จำนวน 4 โครงการ",
        },
      },
      {
        id: "F2",
        categories: ["โครงการ", "กิจกรรม", "IT/Non-IT"],
        label:
          "มีการมอบหมายอำนาจ หน้าที่ ตามทักษะ ความรู้ความสามารถของบุคลากรอย่างเหมาะสม",
        levels: {
          least:
            "หน่วยงานมีการมอบหมายงานเป็นลายลักษณ์อักษรตรงตามมาตรฐานกำหนดตำแหน่งร้อยละ 91-100 ของจำนวนบุคลากร",
          low: "หน่วยงานมีการมอบหมายงานเป็นลายลักษณ์อักษรตรงตามมาตรฐานกำหนดตำแหน่งร้อยละ 81- 90 ของจำนวนบุคลากร",
          medium:
            "หน่วยงานมีการมอบหมายผงานเป็นลายลักษณ์อักษรตรงตามมาตรฐานกำหนดตำแหน่ง ร้อยละ 71 – 80 ของจำนวนบุคลากร",
          high: "หน่วยงานมีการมอบหมายงานเป็นลายลักษณ์อักษรตรงตามมาตรฐานกำหนดตำแหน่ง น้อยกว่าร้อยละ 71 ของจำนวนบุคลากร",
          highest: "หน่วยงานไม่มีการมอบหมายงานเป็นลายลักษณ์อักษร",
        },
      },
    ],
  },

  // ---------------- O ----------------
  {
    id: "O",
    title: "ด้านการดำเนินงาน",
    items: [
      {
        id: "O1",
        categories: ["หน่วยงาน"],
        label:
          "จำนวนแผนงาน/โครงการประจำปีงบประมาณ พ.ศ. 2567 ที่มีความเสี่ยงต่อการบรรลุเป้าหมาย",
        levels: {
          least:
            "ในปีงบประมาณ พ.ศ. 2567  หน่วยงานได้รับจัดสรรงบประมาณในภาพรวม ต่ำกว่า 1,000,000 บาท",
          low: "ในปีงบประมาณ พ.ศ. 2567 หน่วยงานได้รับจัดสรรงบประมาณในภาพรวม ระหว่าง 1,000,001 - 5,000,000 บาท",
          medium:
            "ในปีงบประมาณ พ.ศ. 2567 หน่วยงานได้รับจัดสรรงบประมาณในภาพรวม ระหว่าง 5,000,001 - 10,000,000 บาท",
          high: "ในปีงบประมาณ พ.ศ. 2567 หน่วยงานได้รับจัดสรรงบประมาณในภาพรวม ระหว่าง 10,000,001 - 15,000,000 บาท",
          highest:
            "ในปีงบประมาณ พ.ศ. 2567 หน่วยงานได้รับจัดสรรงบประมาณในภาพรวม สูงกว่า 15,000,000 บาท ",
        },
      },
      {
        id: "O2",
        categories: ["โครงการ"],
        label: "ความสำเร็จในการดำเนินการตามแผนที่กำหนด",
        levels: {
          least: "เป็นโครงการที่ดำเนินการแล้วเสร็จในปีงบประมาณ พ.ศ. 2567",
          low: "เป็นโครงการที่ดำเนินการแล้วเสร็จในปีงบประมาณ พ.ศ. 2567 แต่มีการปรับแผนการปฏิบัติงานระหว่างปี",
          medium:
            "เป็นโครงการที่ดำเนินการแล้วเสร็จในปีงบประมาณ พ.ศ. 2567 แต่มีการปรับแผนการปฏิบัติงานระหว่างปี มากกว่า 1 ครั้ง",
          high: "เป็นโครงการที่ดำเนินการไม่แล้วเสร็จในปีงบประมาณ พ.ศ. 2567 และมีการปรับแผนการปฏิบัติงานและมีการขอกันเงินเหลื่อมปี",
          highest:
            "เป็นโครงการที่ดำเนินการไม่แล้วเสร็จในปีงบประมาณ พ.ศ. 2567 และมีการปรับแผนการปฏิบัติงานและไม่สามารถขอกันเงินเหลื่อมปี",
        },
      },
    ],
  },

  // ---------------- C ----------------
  {
    id: "C",
    title: "ด้านกฎหมาย ระเบียบ ข้อบังคับ",
    items: [
      {
        id: "C1",
        categories: ["งาน", "กระบวนงาน", "IT/Non-IT", "หน่วยงาน"],
        label:
          "การปฏิบัติตามกฎหมาย/ระเบียบ/ข้อบังคับ (ความครบถ้วน/ความเข้าใจ/การกำกับดูแล)",
        levels: {
          least:
            "ปฏิบัติตามครบถ้วน ถูกต้อง มีการกำกับดูแลสม่ำเสมอ (ร้อยละ 90 ขึ้นไป)",
          low: "ปฏิบัติตามระดับดี (ร้อยละ 76–90)",
          medium: "ปฏิบัติตามระดับปานกลาง (ร้อยละ 61–75)",
          high: "ปฏิบัติตามระดับพอใช้ ยังมีประเด็นต้องกำกับ (ร้อยละ 46–60)",
          highest: "ยังไม่ปฏิบัติตามหรือมีช่องว่างสำคัญ ต้องเร่งปรับปรุง",
        },
      },
      {
        id: "C2",
        categories: ["งาน", "หน่วยงาน"],
        label: "การถูกทักท้วงจากตรวจสอบภายใน/ภายนอก ประจำปีงบประมาณ พ.ศ. 2567",
        levels: {
          least: "ไม่มีประเด็นทักท้วง",
          low: "มีประเด็นเล็กน้อย แก้ไขแล้วภายใน 15 วัน",
          medium: "มีประเด็นต้องปรับปรุง แก้ไขภายใน 30 วัน",
          high: "มีประเด็นสำคัญ ต้องแก้ไขภายใน 45 วัน",
          highest: "มีประเด็นสำคัญมาก/ซ้ำซาก ใช้เวลาดำเนินการเกิน 45 วัน",
        },
      },
    ],
  },

  // ---------------- IT ----------------
  {
    id: "IT",
    title: "ด้านเทคโนโลยีสารสนเทศ",
    items: [
      {
        id: "IT1",
        categories: ["โครงการ", "กิจกรรม", "IT/Non-IT" , "โครงการกันเงินเหลื่อมปี"],
        label: "การป้องกันการถูกคุกคามทางไซเบอร์/เหตุขัดข้องระบบ",
        levels: {
          least:
            "เหตุการณ์ไม่มีผลกระทบสำคัญต่อบริการหลัก หรือระบบกลับมาใช้งานได้ภายใน 1 ชม.",
          low: "เหตุการณ์มีผลกระทบบางส่วน/ผู้ใช้ได้รับผลกระทบ < 2 ชม.",
          medium: "เหตุการณ์กระทบผู้ใช้จำนวนมาก ใช้เวลา 2–8 ชม.จึงกลับสู่ปกติ",
          high: "เหตุการณ์กระทบบริการสำคัญ ใช้เวลา 8–24 ชม.จึงกลับสู่ปกติ",
          highest:
            "เหตุการณ์กระทบอย่างรุนแรง/ยาวนาน > 24 ชม. หรือมีผลต่อข้อมูลสำคัญ",
        },
      },
      {
        id: "IT2",
        categories: ["โครงการ", "กิจกรรม", "IT/Non-IT" , "โครงการกันเงินเหลื่อมปี"],
        label: "การใช้ประโยชน์ของระบบงานที่พัฒนา",
        levels: {
          least:
            "ระบบมีผู้ใช้งานต่อเนื่อง บรรลุวัตถุประสงค์ และเกิดประโยชน์ต่อหน่วยงาน",
          low: "ระบบมีผู้ใช้งานต่อเนื่อง แต่ยังมีประเด็นปรับปรุงเล็กน้อย",
          medium: "ระบบมีผู้ใช้งานไม่ต่อเนื่อง/ยังไม่ครอบคลุมทุกกลุ่มเป้าหมาย",
          high: "ระบบยังไม่ถูกใช้งานจริงในวงกว้าง หรืออยู่ระหว่างทดสอบยาวนาน",
          highest: "ระบบยังไม่ถูกใช้งานจริง",
        },
      },
    ],
  },

  // ---------------- FR ----------------
  {
    id: "FR",
    title: "ด้านการเกิดทุจริต",
    items: [
      {
        id: "FR1",
        categories: ["หน่วยงาน"],
        label:
          "มีแผน/แนวทาง/มาตรการบริหารจัดการความเสี่ยงด้านการทุจริต และการสื่อสารทำความเข้าใจกับบุคลากร",
        levels: {
          least:
            "มีแผน/มาตรการครบถ้วน ชัดเจน เชื่อมเป้าหมายหน่วยงาน มีการสื่อสารครอบคลุมทุกกลุ่มงาน และติดตาม/ประเมินผลอย่างสม่ำเสมอ (รายเดือน/ไตรมาส) พร้อมรายงานผู้บริหาร",
          low: "มีแผน/มาตรการชัดเจน มีการสื่อสารให้บุคลากรรับทราบ และติดตาม/ประเมินผลเป็นระยะ",
          medium:
            "มีแนวทาง/มาตรการในระดับหนึ่ง มีการสื่อสารบางส่วนผ่านแผน/คู่มือ แต่ยังไม่ครอบคลุมทุกหน่วยงาน",
          high: "มีแผนหรือแนวทาง แต่ยังไม่ได้สื่อสารทั่วถึง หรือยังไม่มีการติดตาม/ประเมินผลที่เป็นระบบ",
          highest: "ไม่มีแผน/มาตรการบริหารความเสี่ยงด้านการทุจริตที่ชัดเจน",
        },
      },
      {
        id: "FR2",
        categories: ["หน่วยงาน"],
        label:
          "มีกลไกการตรวจสอบ ติดตาม และประเมินผลการป้องกันทุจริต รวมถึงช่องทางร้องเรียน/แจ้งเบาะแส",
        levels: {
          least:
            "มีกลไกตรวจสอบ/ติดตาม/ประเมินผลที่ชัดเจน โปร่งใส ตรวจสอบได้ มีช่องทางร้องเรียนหลายรูปแบบ พร้อมคุ้มครองผู้ร้อง และรายงานผู้บริหารทุกไตรมาส",
          low: "มีกลไกตรวจสอบ/ติดตามและช่องทางร้องเรียนที่ใช้งานจริง มีการสรุปผลและรายงานเป็นระยะ",
          medium:
            "มีช่องทางร้องเรียนและการติดตามในระดับหนึ่ง แต่ขั้นตอน/ความรับผิดชอบยังไม่ชัดครบ",
          high: "มีช่องทางร้องเรียนแต่ยังไม่ปรากฏการติดตาม/ประเมินผลอย่างเป็นระบบ หรือไม่มีการสรุปผลรายงาน",
          highest: "ไม่มีกลไกตรวจสอบ/ติดตาม และไม่มีช่องทางร้องเรียนที่ชัดเจน",
        },
      },
    ],
  },
];

function recompute(form: AssessmentForm) {
  // คำนวณ total score
  form.groups.forEach((g) => {
    g.total = g.items.reduce((s, it) => s + (it.values.score ?? 0), 0);
  });
  form.totalScore = form.groups.reduce((s, g) => s + (g.total ?? 0), 0);
  form.resultScore = form.totalScore;

  // คำนวณ composite score
  const row = findRowById(form.rowId) as any;
  const currentCategory = row?.audit_category_name || "";

  // หารายการที่เกี่ยวข้องกับ category
  const relevantItems = form.groups.flatMap((g) =>
    g.items.filter((it) => {
      if (!it.categories?.length) return true;
      if (!currentCategory) return true;
      return it.categories.includes(currentCategory);
    })
  );

  // คำนวณ max score จากรายการที่เกี่ยวข้องเท่านั้น
  // คำนวณ max score จากรายการที่เกี่ยวข้องเท่านั้น
  const max = relevantItems.length * 25;

  // คำนวณ composite จากคะแนนที่ได้หารด้วย max ของรายการที่เกี่ยวข้อง
  const relevantScore = relevantItems.reduce(
    (sum, it) => sum + (it.values.score || 0),
    0
  );
  form.composite = max ? Math.round((relevantScore / max) * 100) : 0;
  form.grade = toGrade(form.composite);

  // ตรวจสอบว่าทุกรายการที่เกี่ยวข้องถูกกรอกครบ
  const allFilled =
    relevantItems.length > 0 &&
    relevantItems.every(
      (it) => (it.values?.chance ?? 0) > 0 && (it.values?.impact ?? 0) > 0
    );

  form.status = allFilled ? "ประเมินแล้ว" : "กำลังประเมิน";
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const key = `${id}:${YEAR}`;
  const form = db.forms[key];
  if (!form) return NextResponse.json({ message: "No form" }, { status: 404 });
  return NextResponse.json({ message: "OK", data: form }, { status: 200 });
}

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const key = `${id}:${YEAR}`;
  if (db.forms[key])
    return NextResponse.json(
      { message: "Already exists", data: db.forms[key] },
      { status: 200 }
    );

  // Debug: แสดง ID ที่ได้รับและตรวจสอบรูปแบบ
  console.log("🔍 Form API - Received ID:", id);
  
  // ตรวจสอบว่า ID เป็นรูปแบบ compound (a1-c1-t101-d1) หรือเลขธรรมดา
  const isCompoundId = id.includes("-") && id.startsWith("a");
  
  if (isCompoundId) {
    // สำหรับ compound ID ให้สร้างฟอร์มโดยไม่ต้องหา row (ใช้ข้อมูลจาก annual evaluations)
    console.log("📝 Creating form for compound ID (from annual evaluations)");
  } else {
    // สำหรับ ID ธรรมดา ให้หา row ตามปกติ  
    const row = findRowById(id);
    if (!row)
      return NextResponse.json({ message: "Row not found" }, { status: 404 });
    console.log("📄 Found row:", row);
  }

  // ✅ ใส่ categories แบบ “สุ่ม” จาก CATEGORY_POOL + คง levels จาก TEMPLATE
  const groups = TEMPLATE.map((g) => ({
    id: g.id,
    title: g.title,
    items: g.items.map((it) => ({
      id: it.id,
      label: it.label,
      // ถ้าอยาก “สุ่มทับ” เสมอ ให้ใช้ pickRandomCategories()
      // ถ้าอยากใช้ที่กำหนดใน TEMPLATE ก่อน แล้วค่อย fallback เป็นสุ่ม ให้ใช้ it.categories?.length ? it.categories : pickRandomCategories()
      categories: it.categories || [],
      levels: it.levels, // ส่ง levels ไปให้ UI ใช้โชว์รายละเอียดระดับ
      values: { chance: 0, impact: 0, score: 0 },
    })),
    total: 0,
  }));

  const form: AssessmentForm = {
    rowId: id,
    year: YEAR,
    groups,
    totalScore: 0,
    resultScore: 0,
    composite: 0,
    grade: "L",
    status: "กำลังประเมิน",
  };

  db.forms[key] = form;
  upsertOverride(id, { status: "กำลังประเมิน" });

  return NextResponse.json({ message: "Created", data: form }, { status: 201 });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const key = `${id}:${YEAR}`;
  const body = (await req.json()) as AssessmentForm;

  recompute(body);
  db.forms[key] = body;

  // ✅ แก้ไข: บันทึก override ด้วย ID ที่ถูกต้อง (compound ID ของ department เฉพาะ)
  upsertOverride(id, {
    score: body.composite, // ใช้ composite แทน resultScore  
    grade: body.grade,
    status: body.status,
  });

  refreshFormsMap();

  return NextResponse.json({ message: "Saved", data: body }, { status: 200 });
}
