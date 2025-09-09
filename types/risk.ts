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



export type ScoreTriplet = { chance: number; impact: number; score: number };

export type FormGroup = {
  id: string;
  title: string;
  items: { id: string; label: string; values: ScoreTriplet }[];
  total?: number;
};

export type AssessmentForm = {
  rowId: string;
  year: number;
  groups: FormGroup[];
  totalScore: number;
  resultScore: number;
  composite: number;
  grade: "H" | "M" | "L";
  status: "กำลังประเมิน" | "ประเมินแล้ว";
};
