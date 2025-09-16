import { NextResponse } from "next/server";

export type LikertOption = {
  value: number;
  label: string;
  description: string;
};

export type DimensionScale = {
  key: "S" | "F" | "O" | "C" | "IT" | "FR";
  title: string;
  likelihood?: LikertOption[];  // ✅ ใช้สำหรับช่อง "โอกาส"
  impact?: LikertOption[];      // ✅ ถ้าบางด้านอยาก override "ผลกระทบ"
  options?: LikertOption[];     // ✅ เผื่อย้อนหลัง (สเกลร่วมของด้านนั้น)
};

// ---------- 1) เกณฑ์รวมกลาง ----------
const baseLikelihood: LikertOption[] = [
  { value: 1, label: "น้อยที่สุด", description: "เหตุการณ์มีโอกาสเกิดน้อยมาก (≤20% หรือ ≤1 ครั้ง/ปี)" },
  { value: 2, label: "น้อย",       description: "โอกาสเกิด >20%–40% หรือ 2–3 ครั้ง/ปี" },
  { value: 3, label: "ปานกลาง",   description: "โอกาสเกิด >40%–60% หรือ 4–5 ครั้ง/ปี" },
  { value: 4, label: "มาก",        description: "โอกาสเกิด >60%–70% หรือ 6–7 ครั้ง/ปี" },
  { value: 5, label: "มากที่สุด",  description: "โอกาสเกิดสูงมาก (>70% หรือ >7 ครั้ง/ปี)" },
];

const baseImpact: LikertOption[] = [
  { value: 1, label: "น้อยที่สุด", description: "ผลกระทบเล็กน้อย/จำกัดวง" },
  { value: 2, label: "น้อย",       description: "ผลกระทบต่ำ กระทบงานบางส่วน" },
  { value: 3, label: "ปานกลาง",   description: "ผลกระทบปานกลาง กระทบหลายหน่วยงาน" },
  { value: 4, label: "มาก",        description: "ผลกระทบมาก กระทบข้ามหน่วยงาน/ต้องกอบกู้" },
  { value: 5, label: "มากที่สุด",  description: "ผลกระทบรุนแรงมาก กระทบองค์กร/ภาพลักษณ์/กฎหมาย" },
];

// ---------- 2) เกณฑ์เฉพาะรายด้าน (override เฉพาะ likelihood ตามที่ต้องการ) ----------
const perDimension: DimensionScale[] = [
  {
    key: "S",
    title: "ด้านกลยุทธ์",
    likelihood: [
      { value: 1, label: "น้อยที่สุด", description: "เหตุการณ์เชิงกลยุทธ์มีโอกาส ≤1 ครั้ง/ปี" },
      { value: 2, label: "น้อย",       description: "2–3 ครั้ง/ปี" },
      { value: 3, label: "ปานกลาง",   description: "4–5 ครั้ง/ปี" },
      { value: 4, label: "มาก",        description: "6–7 ครั้ง/ปี" },
      { value: 5, label: "มากที่สุด",  description: ">7 ครั้ง/ปี" },
    ],
  },
  {
    key: "F",
    title: "ด้านการเงิน",
    likelihood: [
      { value: 1, label: "น้อยที่สุด", description: "โอกาสความผิดพลาด/ความเสี่ยงการเงิน ≤1 ครั้ง/ปี" },
      { value: 2, label: "น้อย",       description: "2–3 ครั้ง/ปี" },
      { value: 3, label: "ปานกลาง",   description: "4–5 ครั้ง/ปี" },
      { value: 4, label: "มาก",        description: "6–7 ครั้ง/ปี" },
      { value: 5, label: "มากที่สุด",  description: ">7 ครั้ง/ปี" },
    ],
  },
  {
    key: "O",
    title: "ด้านการดำเนินงาน",
    likelihood: [
      { value: 1, label: "น้อยที่สุด", description: "Operational incident ≤1 ครั้ง/ปี" },
      { value: 2, label: "น้อย",       description: "2–3 ครั้ง/ปี" },
      { value: 3, label: "ปานกลาง",   description: "4–5 ครั้ง/ปี" },
      { value: 4, label: "มาก",        description: "6–7 ครั้ง/ปี" },
      { value: 5, label: "มากที่สุด",  description: ">7 ครั้ง/ปี" },
    ],
  },
  {
    key: "C",
    title: "ด้านกฎหมาย/ระเบียบ",
    likelihood: [
      { value: 1, label: "น้อยที่สุด", description: "ประเด็น Compliance เกิด ≤1 ครั้ง/ปี" },
      { value: 2, label: "น้อย",       description: "2–3 ครั้ง/ปี" },
      { value: 3, label: "ปานกลาง",   description: "4–5 ครั้ง/ปี" },
      { value: 4, label: "มาก",        description: "6–7 ครั้ง/ปี" },
      { value: 5, label: "มากที่สุด",  description: ">7 ครั้ง/ปี" },
    ],
  },
  {
    key: "IT",
    title: "ด้านเทคโนโลยีสารสนเทศ",
    // ✅ ตัวอย่าง: IT ใช้เกณฑ์ “จำนวนครั้ง/ปี” ตามที่ระบุ
    likelihood: [
      { value: 1, label: "น้อยที่สุด", description: "เหตุการณ์ไอที 1 ครั้ง/ปี" },
      { value: 2, label: "น้อย",       description: "2 ครั้ง/ปี" },
      { value: 3, label: "ปานกลาง",   description: "3 ครั้ง/ปี" },
      { value: 4, label: "มาก",        description: "4 ครั้ง/ปี" },
      { value: 5, label: "มากที่สุด",  description: ">4 ครั้ง/ปี" },
    ],
  },
  {
    key: "FR",
    title: "ด้านการทุจริต",
    // ✅ ตัวอย่าง: ด้านทุจริตใช้ “ระดับความพร้อม/การกำกับดูแล” เป็นตัวชี้ likelihood
    likelihood: [
      { value: 1, label: "น้อยที่สุด", description: "มีมาตรการครบถ้วน สื่อสารทั่วถึง และติดตามสม่ำเสมอ" },
      { value: 2, label: "น้อย",       description: "มีมาตรการและติดตามเป็นระยะ" },
      { value: 3, label: "ปานกลาง",   description: "มีแนวทางบางส่วน/สื่อสารระดับหนึ่ง" },
      { value: 4, label: "มาก",        description: "มีแผนแต่สื่อสาร/ติดตามยังไม่ทั่วถึง" },
      { value: 5, label: "มากที่สุด",  description: "ไม่มีมาตรการที่ชัดเจน" },
    ],
  },
];

export async function GET() {
  return NextResponse.json({
    message: "OK",
    data: {
      likelihood: baseLikelihood,   // default
      impact: baseImpact,           // default
      perDimension,                 // overrides ต่อด้าน (เฉพาะ likelihood)
    },
  });
}
