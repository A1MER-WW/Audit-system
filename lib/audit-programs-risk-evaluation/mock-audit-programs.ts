// lib/mock-audit-programs.ts

export type Department = {
  id: number;
  departmentName: string;
  isActive: boolean;
};

// เพิ่ม Category type และอัพเดต AuditTopics ให้มี category
export type Category = {
  id: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  name:
    | "หน่วยงาน"
    | "งาน"
    | "โครงการ"
    | "โครงการกันเงินเหลื่อมปี"
    | "กิจกรรม"
    | "กระบวนงาน"
    | "IT และ Non-IT";
};

export type AuditTopics = {
  id: number;
  category: Category;
  departments: Department[];
  auditTopic: string;
};

export type AuditProgram = {
  id: number;
  auditTopics: AuditTopics;
  fiscalYear: number;
  status: string; // "AUDITOR_ASSESSING" | "PENDING" | ...
  auditor_signature: string | null;
  director_signature: string | null;
  director_comment: string | null;
  version: number;
};

export type ListResponse = { message: string; data: AuditProgram[] };

/** ---------- Global store (กัน hot-reload เคลียร์ค่า) ---------- */
type Store = {
  data: AuditProgram[];
  autoId: number;
};

const initialData: AuditProgram[] = [
  {
    id: 1,
    auditTopics: {
      id: 1,
      category: { id: 2, name: "งาน" },
      departments: [
        { id: 1, departmentName: "สลก.", isActive: true },
        { id: 2, departmentName: "ศสท.1", isActive: true },
      ],
      auditTopic:
        "ผลการดำเนินโครงการศูนย์เรียนรู้การเพิ่มประสิทธิภาพการผลิตสินค้าเกษตร",
    },
    fiscalYear: 2568,
    status: "AUDITOR_ASSESSING",
    auditor_signature: null,
    director_signature: null,
    director_comment: null,
    version: 1,
  },
  {
    id: 2,
    auditTopics: {
      id: 2,
      category: { id: 3, name: "โครงการ" },
      departments: [{ id: 3, departmentName: "กองทุน FTA", isActive: true }],
      auditTopic:
        "ผลการดำเนินงานของกองทุนปรับโครงสร้างการผลิตภาคเกษตรเพื่อเพิ่มขีดความสามารถการแข่งขัน",
    },
    fiscalYear: 2568,
    status: "AUDITOR_ASSESSING",
    auditor_signature: null,
    director_signature: null,
    director_comment: null,
    version: 1,
  },
  {
    id: 3,
    auditTopics: {
      id: 3,
      category: { id: 1, name: "หน่วยงาน" },
      departments: [
        { id: 4, departmentName: "สำนักการเงินและบัญชี", isActive: true },
      ],
      auditTopic: "งานด้านการเงินและบัญชี",
    },
    fiscalYear: 2568,
    status: "PENDING",
    auditor_signature: null,
    director_signature: null,
    director_comment: null,
    version: 1,
  },
  {
    id: 4,
    auditTopics: {
      id: 4,
      category: { id: 6, name: "กระบวนงาน" },
      departments: [
        { id: 5, departmentName: "สำนักกฎหมายและนโยบาย", isActive: true },
        { id: 6, departmentName: "ฝ่ายแผนงานและงบประมาณ", isActive: true },
      ],
      auditTopic: "การตรวจสอบและประเมินผลการควบคุมภายในและการบริหารความเสี่ยง",
    },
    fiscalYear: 2568,
    status: "PENDING",
    auditor_signature: null,
    director_signature: null,
    director_comment: null,
    version: 1,
  },
  {
    id: 5,
    auditTopics: {
      id: 5,
      category: { id: 5, name: "กิจกรรม" },
      departments: [{ id: 7, departmentName: "สำนักงบประมาณ", isActive: true }],
      auditTopic:
        "การตรวจสอบการปฏิบัติตามข้อเสนอแนะเพื่อป้องกันปัญหาที่เกิดซ้ำจากการปฏิบัติงาน",
    },
    fiscalYear: 2568,
    status: "PENDING",
    auditor_signature: null,
    director_signature: null,
    director_comment: null,
    version: 1,
  },
  {
    id: 6,
    auditTopics: {
      id: 6,
      category: { id: 7, name: "IT และ Non-IT" },
      departments: [
        { id: 8, departmentName: "หน่วยงานในสังกัด อตก.", isActive: true },
      ],
      auditTopic:
        "ติดตามความก้าวหน้าในการปฏิบัติตามข้อเสนอแนะในรายงานผลการตรวจสอบ",
    },
    fiscalYear: 2568,
    status: "PENDING",
    auditor_signature: null,
    director_signature: null,
    director_comment: null,
    version: 1,
  },
  {
    id: 7,
    auditTopics: {
      id: 7,
      category: { id: 4, name: "โครงการกันเงินเหลื่อมปี" },
      departments: [
        { id: 9, departmentName: "หน่วยงานในสังกัด อตก.", isActive: true },
      ],
      auditTopic:
        "ให้คำปรึกษาและแนะแนวทางในการปรับปรุงการดำเนินงานตามมาตรฐานวิชาการเกษตร",
    },
    fiscalYear: 2568,
    status: "PENDING",
    auditor_signature: null,
    director_signature: null,
    director_comment: null,
    version: 1,
  },
];

declare global {
  var __AUDIT_STORE__: Store | undefined;
}

const store: Store = globalThis.__AUDIT_STORE__ ?? {
  data: structuredClone(initialData),
  autoId: Math.max(...initialData.map((x) => x.id)),
};

globalThis.__AUDIT_STORE__ = store;

/** ---------- Helpers (คืนค่าก๊อปปี้ ป้องกันการ mutate) ---------- */
function clone<T>(v: T): T {
  return structuredClone(v);
}

export function listPrograms(fiscalYear?: number): AuditProgram[] {
  const arr = fiscalYear
    ? store.data.filter((a) => a.fiscalYear === fiscalYear)
    : store.data;
  return clone(arr);
}

export function getProgram(id: number) {
  const found = store.data.find((a) => a.id === id);
  return found ? clone(found) : undefined;
}

export function addProgram(input: Omit<AuditProgram, "id">) {
  const item: AuditProgram = { ...clone(input), id: ++store.autoId };
  store.data.push(item);
  return clone(item);
}

export function updateProgram(
  id: number,
  patch: Partial<Omit<AuditProgram, "id">>
) {
  const idx = store.data.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  store.data[idx] = { ...store.data[idx], ...clone(patch) };
  return clone(store.data[idx]);
}

export function removeProgram(id: number) {
  const idx = store.data.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  const [removed] = store.data.splice(idx, 1);
  return removed ? clone(removed) : null;
}

/** (ออปชัน) ใช้ในเทสหรือปุ่ม Reset */
export function resetMock() {
  store.data = structuredClone(initialData);
  store.autoId = Math.max(...store.data.map((x) => x.id));
}
