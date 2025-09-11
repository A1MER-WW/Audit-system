// app/api/risk-criteria/route.ts
import { NextResponse } from "next/server";

/** ===== Types ===== */
export type CriteriaType = "likelihood" | "impact";
export type DimensionKey =
  | "strategy"
  | "finance"
  | "operation"
  | "compliance"
  | "it"
  | "fraud";

/** ====== Likelihood (ตารางเดี่ยว) ====== */
type CriteriaRow = {
  level: 1 | 2 | 3 | 4 | 5;
  likelihoodLabel?: string;
  byDimension: Record<DimensionKey, string>;
};
type CriteriaTable = {
  type: "likelihood";
  layout: "single";
  title: string;
  subtitle: string;
  columns: { order: number; key: "level" | DimensionKey; label: string }[];
  rows: CriteriaRow[];
};

/** ====== Impact (แยก section) ====== */
type ImpactRow = {
  level: 1 | 2 | 3 | 4 | 5;
  label: "น้อยมาก" | "น้อย" | "ปานกลาง" | "รุนแรง" | "รุนแรงมาก";
  // เนื้อหาแต่ละคอลัมน์ของ section นั้น ๆ
  cols: string[];
};
type ImpactSection = {
  key: DimensionKey;
  title: string; // หัวข้อบนแถบสีอ่อน เช่น "ด้านยุทธศาสตร์"
  columns: string[]; // หัวคอลัมน์ของ section นั้น ๆ (ไม่รวมคอลัมน์ "ระดับ")
  rows: ImpactRow[]; // 5→1
};
type ImpactPayload = {
  type: "impact";
  layout: "sectioned";
  title: string;
  subtitle: string;
  sections: ImpactSection[];
};

/** ====== Mock: Likelihood เดิม (ตัดให้สั้นลง) ====== */
const LIKELIHOOD_TABLE: CriteriaTable = {
  type: "likelihood",
  layout: "single",
  title: "เกณฑ์การประเมินผลโอกาสที่จะเกิดความเสี่ยง",
  subtitle: "Likelihood: L",
  columns: [
    { order: 0, key: "level", label: "ระดับ" },
    { order: 1, key: "strategy", label: "ด้านกลยุทธ์" },
    { order: 2, key: "finance", label: "ด้านการเงิน" },
    { order: 3, key: "operation", label: "ด้านการดำเนินงาน" },
    { order: 4, key: "compliance", label: "ด้านปฏิบัติตามกฎหมาย/ระเบียบ" },
    { order: 5, key: "it", label: "ด้านเทคโนโลยีสารสนเทศ" },
    { order: 6, key: "fraud", label: "ด้านการทุจริต" },
  ],
  rows: [
    {
      level: 5,
      likelihoodLabel: "สูงมาก",
      byDimension: {
        strategy: "เกิดบ่อยมาก (≥70 ครั้ง/ปี หรือ >7 ครั้ง/ปี)",
        finance: "เกิดบ่อยมาก (≥70 ครั้ง/ปี หรือ >7 ครั้ง/ปี)",
        operation: "เกิดบ่อยมาก (≥70 ครั้ง/ปี หรือ >7 ครั้ง/ปี)",
        compliance: "เกิดบ่อยมาก (≥70 ครั้ง/ปี หรือ >7 ครั้ง/ปี)",
        it: "มากกว่า 4 ครั้ง/ปี",
        fraud: "ไม่มีแนวบริหารจัดการทุจริต",
      },
    },
    // ... (4,3,2,1) ใส่เหมือนตัวอย่างก่อนหน้าได้เลย
  ],
};

/** ====== Mock: Impact แบบ “แยกเป็นหมวด/ตารางย่อย” ======
 * หมายเหตุ: คุณสามารถแก้หัวคอลัมน์และข้อความใน cols[] ให้ตรงภาพได้อิสระ
 */
const IMPACT_DATA: ImpactPayload = {
  type: "impact",
  layout: "sectioned",
  title: "เกณฑ์การประเมินผลกระทบ",
  subtitle: "Impact: I",
  sections: [
    {
      key: "strategy",
      title: "ด้านยุทธศาสตร์",
      columns: [
        "ผลกระทบต่อเป้าหมาย/ยุทธศาสตร์",
        "ตัวชี้วัด/ชื่อเสียง",
        "การบริหารจัดการ/แผน",
      ],
      rows: [
        {
          level: 5,
          label: "รุนแรงมาก",
          cols: [
            "บรรลุเป้าหมายหลักไม่ได้/ต้องทบทวนยุทธศาสตร์",
            "ตัวชี้วัดสำคัญล้มเหลวหลายตัว/ภาพลักษณ์เสียหายวงกว้าง",
            "ต้องยกเลิก/ปรับแผนยุทธศาสตร์ครั้งใหญ่",
          ],
        },
        {
          level: 4,
          label: "รุนแรง",
          cols: [
            "กระทบเป้าหมายหลักหลายข้อ",
            "ตัวชี้วัดหลักเบี่ยงเบนชัดเจน",
            "จำเป็นต้องปรับแผนและทรัพยากรจำนวนมาก",
          ],
        },
        {
          level: 3,
          label: "ปานกลาง",
          cols: [
            "กระทบวัตถุประสงค์บางข้อ",
            "ตัวชี้วัดบางตัวตกจากเป้าหมาย",
            "ต้องปรับลำดับความสำคัญ/วิธีดำเนินงาน",
          ],
        },
        {
          level: 2,
          label: "น้อย",
          cols: [
            "กระทบต่อผลลัพธ์เฉพาะส่วน",
            "ตัวชี้วัดเบี่ยงเบนเล็กน้อย",
            "ปรับแผนปฏิบัติการบางรายการ",
          ],
        },
        {
          level: 1,
          label: "น้อยมาก",
          cols: [
            "แทบไม่กระทบเป้าหมาย",
            "ไม่มีผลต่อภาพลักษณ์/ตัวชี้วัด",
            "ไม่ต้องปรับแผน",
          ],
        },
      ],
    },

    {
      key: "finance",
      title: "ด้านการเงิน",
      columns: [
        "มูลค่าความเสียหายโดยประมาณ",
        "งบประมาณ/เงินสด",
        "ผลต่อโครงการ/สัญญา",
      ],
      rows: [
        {
          level: 5,
          label: "รุนแรงมาก",
          cols: [
            "เสียหายระดับสูงมาก",
            "กระทบสภาพคล่อง/ต้องหาแหล่งทุน",
            "โครงการหยุด/ยกเลิก",
          ],
        },
        {
          level: 4,
          label: "รุนแรง",
          cols: ["เสียหายสูง", "ต้องโยกงบ/ตัดลดงบหลายส่วน", "ทบทวนสัญญาสำคัญ"],
        },
        {
          level: 3,
          label: "ปานกลาง",
          cols: ["เสียหายปานกลาง", "กระทบงบโครงการ", "ชะลอบางกิจกรรม"],
        },
        {
          level: 2,
          label: "น้อย",
          cols: ["เสียหายน้อย", "แก้ไขภายในหน่วย", "เลื่อนเล็กน้อย"],
        },
        {
          level: 1,
          label: "น้อยมาก",
          cols: ["ต่ำมาก/ไม่มี", "ไม่กระทบ", "ไม่มีผล"],
        },
      ],
    },

    {
      key: "operation",
      title: "ด้านการดำเนินงาน",
      columns: [
        "ความต่อเนื่องบริการ",
        "ประสิทธิภาพ/คิวงาน",
        "ทรัพยากรบุคคล/ความปลอดภัย",
      ],
      rows: [
        {
          level: 5,
          label: "รุนแรงมาก",
          cols: [
            "หยุดชะงักนาน/บริการหลักล่ม",
            "คิวค้างจำนวนมาก",
            "เสี่ยงต่อความปลอดภัยสูง",
          ],
        },
        {
          level: 4,
          label: "รุนแรง",
          cols: ["สะดุดยาวนาน", "คิวหน่วงมาก", "ต้องเสริมกำลังคนจำนวนมาก"],
        },
        {
          level: 3,
          label: "ปานกลาง",
          cols: ["สะดุดเป็นระยะ", "ประสิทธิภาพลดลงชัด", "ต้องโอที/ทำงานชดเชย"],
        },
        {
          level: 2,
          label: "น้อย",
          cols: ["สะดุดเล็กน้อย", "มีผลบางส่วน", "บริหารจัดการได้"],
        },
        {
          level: 1,
          label: "น้อยมาก",
          cols: ["เกือบปกติ", "ไม่มีผลชัดเจน", "ไม่กระทบ"],
        },
      ],
    },

    {
      key: "compliance",
      title: "ด้านการปฏิบัติตามกฎหมาย/ระเบียบ",
      columns: ["การละเมิด/ข้อบังคับ", "บทลงโทษ/คดี", "การกำกับติดตาม/เอกสาร"],
      rows: [
        {
          level: 5,
          label: "รุนแรงมาก",
          cols: [
            "ละเมิดกฎหมายสำคัญ",
            "เสี่ยงคดี/ค่าปรับสูงมาก",
            "ต้องปรับระบบควบคุมครั้งใหญ่",
          ],
        },
        {
          level: 4,
          label: "รุนแรง",
          cols: [
            "ผิดระเบียบหลัก",
            "โทษทางวินัย/ค่าปรับสูง",
            "ต้องแก้ไขขั้นตอนหลายเรื่อง",
          ],
        },
        {
          level: 3,
          label: "ปานกลาง",
          cols: [
            "ผิดข้อกำหนดรอง",
            "ตักเตือน/ปรับระดับกลาง",
            "เอกสารต้องแก้จำนวนหนึ่ง",
          ],
        },
        {
          level: 2,
          label: "น้อย",
          cols: ["ข้อบกพร่องย่อย", "ไม่มีโทษรุนแรง", "แก้ไขได้ทันที"],
        },
        {
          level: 1,
          label: "น้อยมาก",
          cols: ["ไม่ผิดระเบียบ", "ไม่มีคดีความ", "เอกสารครบถ้วน"],
        },
      ],
    },

    {
      key: "it",
      title: "ด้านเทคโนโลยีสารสนเทศ",
      columns: [
        "ความพร้อมใช้งานระบบ",
        "ข้อมูล/ความลับ",
        "ความต่อเนื่อง/กู้คืน",
      ],
      rows: [
        {
          level: 5,
          label: "รุนแรงมาก",
          cols: [
            "ระบบหลักล่มนาน",
            "ข้อมูลสูญ/รั่วไหลวงกว้าง",
            "DR ใช้เวลานานมาก",
          ],
        },
        {
          level: 4,
          label: "รุนแรง",
          cols: ["ระบบสำคัญล่มชั่วคราว", "รั่วไหลหลายระบบ", "กู้คืนช้า"],
        },
        {
          level: 3,
          label: "ปานกลาง",
          cols: ["ประสิทธิภาพตก", "รั่วไหลจำกัดขอบเขต", "กู้คืนได้ตามแผน"],
        },
        {
          level: 2,
          label: "น้อย",
          cols: ["ขัดข้องสั้นๆ", "ไม่มีรั่วไหลสำคัญ", "กู้คืนรวดเร็ว"],
        },
        {
          level: 1,
          label: "น้อยมาก",
          cols: ["ปกติ", "ไม่มีผลต่อข้อมูล", "ไม่ต้องกู้คืน"],
        },
      ],
    },

    {
      key: "fraud",
      title: "ด้านการทุจริต",
      columns: ["ลักษณะเหตุการณ์", "วงเงิน/ขอบเขต", "ผลต่อความเชื่อมั่น"],
      rows: [
        {
          level: 5,
          label: "รุนแรงมาก",
          cols: [
            "ทุจริตเชิงระบบ/เครือข่าย",
            "วงเงินสูงมาก/หลายหน่วย",
            "กระทบความเชื่อมั่นอย่างหนัก",
          ],
        },
        {
          level: 4,
          label: "รุนแรง",
          cols: [
            "ทุจริตหลายฝ่ายเกี่ยวข้อง",
            "วงเงินสูง",
            "เสียความเชื่อมั่นมาก",
          ],
        },
        {
          level: 3,
          label: "ปานกลาง",
          cols: ["เหตุเฉพาะจุด", "วงเงินปานกลาง", "กระทบภาพลักษณ์บางส่วน"],
        },
        {
          level: 2,
          label: "น้อย",
          cols: ["สัญญาณความเสี่ยงต่ำ", "วงเงินน้อย", "ผลกระทบจำกัด"],
        },
        {
          level: 1,
          label: "น้อยมาก",
          cols: ["ไม่มีสัญญาณ", "ไม่มีวงเงินเกี่ยวข้อง", "ไม่กระทบ"],
        },
      ],
    },
  ],
};

/** ====== GET ====== */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = (searchParams.get("type") || "likelihood") as CriteriaType;

  await new Promise((r) => setTimeout(r, 200)); // mock delay

  if (type === "impact") {
    return NextResponse.json({ success: true, data: IMPACT_DATA });
  }
  return NextResponse.json({ success: true, data: LIKELIHOOD_TABLE });
}
