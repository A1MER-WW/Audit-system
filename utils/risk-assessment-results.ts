import { Row, TabKey } from "@/types/risk-assessment-results";

export const gradeFromScore = (s?: number) =>
  !s || s <= 0 ? "-" : s >= 80 ? "E" : s >= 60 ? "H" : s >= 40 ? "M" : s >= 20 ? "L" : "N";

export function topicByTab(row: Row, tab: TabKey): string {
  if (tab === "unit") return row.mission;
  if (tab === "work") return row.work;
  if (tab === "project") return row.project;
  if (tab === "carry") return row.carry;
  if (tab === "activity") return row.activity;
  if (tab === "process") return row.process;
  if (tab === "it") return row.system;
  return (
    [
      row.work,
      row.project,
      row.carry,
      row.activity,
      row.process,
      row.system,
      row.mission,
    ].find((v) => v && v !== "-") || "-"
  );
}

export function makeParentRow(tab: TabKey, topic: string, rows: Row[]): Row {
  const sorted = [...rows].sort((a, b) => {
    const A = a.index.split(".").map(Number);
    const B = b.index.split(".").map(Number);
    return A[0] !== B[0] ? A[0] - B[0] : (A[1] || 0) - (B[1] || 0);
  });
  
  const uniqUnits = Array.from(new Set(sorted.map((r) => r.unit))).filter(Boolean);
  const unitLabel = uniqUnits.length > 1
    ? `${uniqUnits[0]} และอีก ${uniqUnits.length - 1} หน่วยงาน`
    : uniqUnits[0] || "-";

  const totalScore = sorted.reduce((sum, r) => sum + (r.score || 0), 0);
  const allDone = sorted.every((r) => r.status === "ประเมินแล้ว");
  const anyDoing = sorted.some((r) => r.status !== "ยังไม่ได้ประเมิน");
  const status = allDone
    ? "ประเมินแล้ว"
    : anyDoing
    ? "กำลังประเมิน"
    : "ยังไม่ได้ประเมิน";

  const base: Row = {
    id: `group:${tab}:${encodeURIComponent(topic)}`,
    index: sorted[0]?.index?.split(".")[0] || "-",
    unit: unitLabel,
    mission: "-",
    work: "-",
    project: "-",
    carry: "-",
    activity: "-",
    process: "-",
    system: "-",
    itType: "-",
    score: totalScore,
    grade: gradeFromScore(totalScore),
    status,
    hasDoc: false,
  };

  if (tab === "unit") base.mission = topic;
  else if (tab === "work") base.work = topic;
  else if (tab === "project") base.project = topic;
  else if (tab === "carry") base.carry = topic;
  else if (tab === "activity") base.activity = topic;
  else if (tab === "process") base.process = topic;
  else if (tab === "it") base.system = topic;
  if (tab === "all") base.work = topic;

  return base;
}

export function getCategory(r: Row): string {
  if (r.work && r.work !== "-") return "งาน";
  if (r.project && r.project !== "-") return "โครงการ";
  if (r.carry && r.carry !== "-") return "กันเงินเหลื่อมปี";
  if (r.activity && r.activity !== "-") return "กิจกรรม";
  if (r.process && r.process !== "-") return "กระบวนงาน";
  if (r.system && r.system !== "-") return "IT / Non-IT";
  if (r.mission && r.mission !== "-") return "หน่วยงาน";
  return "-";
}
