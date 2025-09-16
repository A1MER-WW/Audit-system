// lib/mock-risk-db.ts
import "server-only";
import type { AssessmentForm } from "@/types/risk";

/** ปีงบประมาณเริ่มต้น */
export const YEAR_DEFAULT = 2568;

/** โครงสร้าง override บนแถวใน List (คะแนน/เกรด/สถานะ) */
export type RowOverride = {
  score?: number;
  grade?: "E" | "H" | "M" | "L" | "N" | "-";
  status?: string;
};

/** โครงสร้างข้อมูลการจัดลำดับความเสี่ยง */
export type ReorderData = {
  year: string;
  tab: string;
  newOrder: string[];
  originalOrder: string[];
  reasonById: Record<string, string>;
  timestamp: string;
};

/** เก็บ state ไว้ใน global เพื่อให้ dev hot-reload แล้วข้อมูลยังอยู่ */
declare global {
  var __riskdb:
    | {
        forms: Record<string, AssessmentForm>; // key = `${rowId}:${year}`
        overrides: Record<string, RowOverride>; // key = rowId
        reorderData: Record<string, ReorderData>; // key = `${year}:${tab}`
      }
    | undefined;
}

/** DB ในหน่วยความจำ */
export const db = global.__riskdb ?? {
  forms: {} as Record<string, AssessmentForm>,
  overrides: {} as Record<string, RowOverride>,
  reorderData: {} as Record<string, ReorderData>,
};

if (!global.__riskdb) global.__riskdb = db;

/** อัปเดต override ของแถวในหน้า List */
export function upsertOverride(id: string, patch: RowOverride) {
  db.overrides[id] = { ...(db.overrides[id] || {}), ...patch };
}

/** ดึง/บันทึกฟอร์ม ด้วย key = `${rowId}:${year}` */
export function getFormKey(rowId: string, year: number = YEAR_DEFAULT) {
  return `${rowId}:${year}`;
}
export function getForm(rowId: string, year: number = YEAR_DEFAULT) {
  return db.forms[getFormKey(rowId, year)];
}
export function setForm(
  rowId: string,
  form: AssessmentForm,
  year: number = YEAR_DEFAULT
) {
  db.forms[getFormKey(rowId, year)] = form;
  return form;
}

/**
 * (สำหรับความเข้ากันได้กับโค้ดเดิม)
 * formsMap: map ที่ map จาก rowId -> form ของปีปัจจุบัน (ถ้ามี)
 * หมายเหตุ: ถ้า 1 rowId มีหลายปี จะเลือก YEAR_DEFAULT
 */
export const formsMap: Map<string, AssessmentForm> = new Map(
  Object.values(db.forms)
    .filter((f) => f.year === YEAR_DEFAULT)
    .map((f) => [f.rowId, f])
);

/** sync formsMap หลังจาก setForm */
export function refreshFormsMap() {
  formsMap.clear();
  for (const f of Object.values(db.forms)) {
    if (f.year === YEAR_DEFAULT) formsMap.set(f.rowId, f);
  }
}

/** จัดการข้อมูลการจัดลำดับ */
export function getReorderKey(year: string, tab: string) {
  return `${year}:${tab}`;
}

export function getReorderData(year: string, tab: string): ReorderData | null {
  return db.reorderData[getReorderKey(year, tab)] || null;
}

export function setReorderData(reorderData: ReorderData) {
  const key = getReorderKey(reorderData.year, reorderData.tab);
  db.reorderData[key] = reorderData;
  return reorderData;
}
