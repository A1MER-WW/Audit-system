import { TabKey, OuterTab } from "@/types/risk-assessment-results";

export const DYNAMIC_HEAD: Record<TabKey, string> = {
  all: "หัวข้อของงานตรวจสอบ",
  unit: "ภารกิจตามกฎกระทรวง",
  work: "หัวข้อของงานที่กำหนด",
  project: "หัวข้อของโครงการที่กำหนด",
  carry: "หัวข้อของโครงการที่กำหนด",
  activity: "หัวข้อของกิจกรรม (ผลผลิต) ที่กำหนด",
  process: "หัวข้อของกระบวนการปฏิบัติงานที่กำหนด",
  it: "หัวข้อของระบบ IT และ NON IT ที่กำหนด",
};

export const TAB_LABELS: Record<TabKey, string> = {
  all: "ทั้งหมด",
  unit: "หน่วยงาน",
  work: "งาน",
  project: "โครงการ",
  carry: "โครงการกันเงินเหลื่อมปี",
  activity: "กิจกรรม",
  process: "กระบวนงาน",
  it: "IT และ Non-IT",
};

export const OUTER_TABS: Record<OuterTab, string> = {
  summary: "ผลการประเมินความเสี่ยงรวมทั้งหมด",
  reorder: "ผลการจัดลำดับความเสี่ยง",
  unitRanking: "ผลลำดับความเสี่ยงหน่วยงาน",
};

export const STATUS_OPTIONS = [
  { label: "ทั้งหมด", value: "all" },
  { label: "กำลังประเมิน", value: "กำลังประเมิน" },
  { label: "ประเมินแล้ว", value: "ประเมินแล้ว" },
  { label: "ยังไม่ได้ประเมิน", value: "ยังไม่ได้ประเมิน" },
];
