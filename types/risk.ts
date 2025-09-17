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
  grade: "E" | "H" | "M" | "L" | "N" | "-";
  status: string;
  hasDoc: boolean;
  audit_category_name?: "หน่วยงาน" | "งาน" | "โครงการ" | "โครงการกันเงินเหลื่อมปี" | "กิจกรรม" | "กระบวนงาน" | "IT และ Non-IT";
};



export type ScoreTriplet = { chance: number; impact: number; score: number };

export type Levels = {
  least?: string;
  low?: string;
  medium?: string;
  high?: string;
  highest?: string;
};

export type FormGroup = {
  id: string;
  title: string;
  items: {
    id: string;
    label: string;
    categories?: string[];
    levels?: Levels;
    values: ScoreTriplet;
  }[];
  total?: number;
};

export type AssessmentForm = {
  rowId: string;
  year: number;
  groups: FormGroup[];
  totalScore: number;
  resultScore: number;
  composite: number;
  grade: "E" | "H" | "M" | "L" | "N";
  status: "กำลังประเมิน" | "ประเมินแล้ว";
};
