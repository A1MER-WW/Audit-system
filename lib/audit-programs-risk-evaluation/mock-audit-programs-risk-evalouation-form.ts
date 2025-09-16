// lib/mock-audit-programs-risk-evaluations.ts

import { AuditProgram } from "./mock-audit-programs";

export type RiskLevel = {
  grade_code: string; // เช่น "N", "H", "M", "L"
  grade: string; // เช่น "สูงมาก", "สูง", "ปานกลาง", "ต่ำ"
};

export type RiskAssessment = {
  id: number;
  risk_factor: string;
  likelihood_score: number; // 1-5
  impact_score: number; // 1-5
  total_score: number; // likelihood_score * impact_score
  risk_ranking: number;
  risk_ranking_by_user: number | null;
  reason_for_new_risk_ranking: string | null;
  risk_level: RiskLevel;
};

export type AuditActivityRisk = {
  id: number;
  processes: string;
  risk_factors: string; // หมวดหมู่ เช่น "ด้านกลยุทธ์" / "ด้านปฏิบัติการ" / "ด้านกฎหมาย/ระเบียบ" / "ด้านเทคโนโลยี"
  object: string; // ขอบเขต/รายละเอียดงาน (รองรับ \n)
  risks_assessment: RiskAssessment[];
};

export type AuditProgramRiskEvaluation = AuditProgram & {
  AuditActivityRisks: AuditActivityRisk[];
};

export type DetailResponse = {
  message: string;
  data: AuditProgramRiskEvaluation;
};

/** ========= Helpers ========= */
function lvl(total: number): RiskLevel {
  if (total >= 20) return { grade_code: "N", grade: "สูงมาก" };
  if (total >= 12) return { grade_code: "H", grade: "สูง" };
  if (total >= 6) return { grade_code: "M", grade: "ปานกลาง" };
  return { grade_code: "L", grade: "ต่ำ" };
}
function ra(
  id: number,
  risk_factor: string,
  like: number,
  impact: number,
  rank: number,
  note?: string
): RiskAssessment {
  const total = like * impact;
  return {
    id,
    risk_factor,
    likelihood_score: like,
    impact_score: impact,
    total_score: total,
    risk_ranking: rank,
    risk_ranking_by_user: null,
    reason_for_new_risk_ranking: note ?? null,
    risk_level: lvl(total),
  };
}

/** ========= Mock Data (ต่อ auditTopic id: 1..7) =========
 * โครงสร้างยึดตาม initialData ที่คุณมีใน lib/mock-audit-programs.ts
 * หมายเหตุ: คง message/data structure ตามตัวอย่างของคุณ
 */

export const PROGRAM_RISK_EVALS: Record<number, AuditProgramRiskEvaluation> = {
  1: {
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
    AuditActivityRisks: [
      {
        id: 101,
        processes: "การบริหารโครงการศูนย์เรียนรู้",
        risk_factors: "ด้านกลยุทธ์",
        object:
          "๑. วางแผน/อนุมัติโครงการ\n๒. จัดทำหลักสูตรและกิจกรรมถ่ายทอดความรู้\n๓. ติดตามความก้าวหน้าและวัดผลสำเร็จ",
        risks_assessment: [
          ra(
            1011,
            "แผนโครงการไม่ครอบคลุมพื้นที่/กลุ่มเป้าหมาย ทำให้ผลสัมฤทธิ์ไม่เป็นไปตามเป้าหมาย",
            4,
            4,
            1,
            "ควรกำหนดเกณฑ์คัดเลือกกลุ่มเป้าหมายชัดเจน"
          ),
          ra(
            1012,
            "ทรัพยากรบุคคล/วิทยากรไม่เพียงพอในช่วงพีกของกิจกรรม",
            3,
            4,
            2
          ),
        ],
      },
      {
        id: 102,
        processes: "การจัดซื้อจัดจ้างและเบิกจ่าย",
        risk_factors: "ด้านกฎหมาย/ระเบียบ",
        object:
          "๑. จัดซื้ออุปกรณ์การเรียนรู้\n๒. ทำสัญญาจ้างวิทยากรและบริการเสริม\n๓. ตรวจรับ พัสดุ/งานให้เป็นไปตามระเบียบ",
        risks_assessment: [
          ra(
            1021,
            "ความเสี่ยงการไม่ปฏิบัติตามระเบียบพัสดุ/เบิกจ่าย",
            3,
            5,
            1,
            "เพิ่มการตรวจทานแบบฟอร์มและหลักฐานก่อนเบิกจ่าย"
          ),
          ra(1022, "การส่งมอบพัสดุล่าช้า กระทบกำหนดการฝึกอบรม", 3, 3, 2),
        ],
      },
    ],
  },

  2: {
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
    AuditActivityRisks: [
      {
        id: 201,
        processes: "การติดตามและประเมินผลการดำเนินงานโครงการ",
        risk_factors: "ด้านกลยุทธ์",
        object:
          "๑.๑ ศึกษาวิเคราะห์ความเหมาะสมของโครงการที่เสนอ\n๑.๒ ติดตาม/กำกับดูแลการดำเนินงานให้สอดคล้องระเบียบ\n๑.๓ ติดตามความก้าวหน้าโครงการที่ได้รับเงินจากกองทุน\n๑.๔ ประเมินผลความสำเร็จ\n๑.๕ งานพัสดุจัดซื้อจัดจ้างของกองทุน\n๑.๖ ปฏิบัติตามข้อตกลงการประเมินผลของกระทรวงการคลัง",
        risks_assessment: [
          ra(
            2011,
            "ยุทธศาสตร์/แผนปฏิบัติการ (2565–2570) ไม่ถูกขับเคลื่อนครอบคลุมทุกภารกิจ",
            5,
            5,
            1,
            "จำเป็นต้องจัดทำ action plan รายไตรมาสและตัวชี้วัดชัดเจน"
          ),
          ra(
            2012,
            "ข้อมูลผลลัพธ์โครงการไม่ครบถ้วน ทำให้ประเมินผลคลาดเคลื่อน",
            4,
            4,
            2
          ),
        ],
      },
      {
        id: 202,
        processes: "การสื่อสารและการมีส่วนร่วมผู้มีส่วนได้ส่วนเสีย",
        risk_factors: "ด้านปฏิบัติการ",
        object:
          "วางแผนสื่อสาร/รับข้อร้องเรียน/สรุปข้อเสนอแนะเข้าสู่การปรับปรุง",
        risks_assessment: [
          ra(
            2021,
            "การสื่อสารนโยบายไม่ทั่วถึง ทำให้ความเข้าใจคลาดเคลื่อน",
            3,
            4,
            1
          ),
          ra(2022, "การรับข้อร้องเรียนล่าช้า", 2, 3, 2),
        ],
      },
    ],
  },

  3: {
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
    AuditActivityRisks: [
      {
        id: 301,
        processes: "รับ-จ่ายเงินและกระทบยอด",
        risk_factors: "ด้านปฏิบัติการ",
        object: "รับเงิน/จ่ายเงิน/กระทบยอด/ปิดงวด",
        risks_assessment: [
          ra(3011, "การควบคุมแยกหน้าที่ไม่เพียงพอ", 3, 4, 1),
          ra(3012, "ความผิดพลาดในการบันทึกบัญชี", 3, 3, 2),
        ],
      },
      {
        id: 302,
        processes: "การจัดทำรายงานการเงิน",
        risk_factors: "ด้านการรายงาน",
        object: "จัดทำงบทดลอง/งบการเงิน/หมายเหตุประกอบงบ",
        risks_assessment: [
          ra(3021, "รายงานการเงินล่าช้า ทำให้ตัดสินใจไม่ทันเวลา", 3, 4, 1),
          ra(3022, "หลักฐานประกอบไม่ครบถ้วน", 2, 3, 2),
        ],
      },
    ],
  },

  4: {
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
    AuditActivityRisks: [
      {
        id: 401,
        processes: "ทบทวนระเบียบ/แนวปฏิบัติ",
        risk_factors: "ด้านกฎหมาย/ระเบียบ",
        object: "ทบทวน/ออกระเบียบ/สื่อสารการเปลี่ยนแปลง",
        risks_assessment: [
          ra(4011, "แนวปฏิบัติไม่ทันสมัย ทำให้ควบคุมภายในอ่อนแอ", 3, 4, 1),
          ra(4012, "การสื่อสารระเบียบใหม่ไม่ทั่วถึง", 2, 3, 2),
        ],
      },
    ],
  },

  5: {
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
    AuditActivityRisks: [
      {
        id: 501,
        processes: "ติดตามข้อเสนอแนะการตรวจสอบ",
        risk_factors: "ด้านติดตามผล",
        object: "จัดทำแผนแก้ไข/กำหนดผู้รับผิดชอบ/ติดตามสถานะ",
        risks_assessment: [
          ra(5011, "การปิดข้อเสนอแนะล่าช้า ทำให้ความเสี่ยงเกิดซ้ำ", 3, 4, 1),
          ra(5012, "ไม่มีตัวชี้วัดความคืบหน้าที่ชัดเจน", 2, 3, 2),
        ],
      },
    ],
  },

  6: {
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
    AuditActivityRisks: [
      {
        id: 601,
        processes: "ติดตามความก้าวหน้า",
        risk_factors: "ด้านติดตามผล",
        object: "รายงานความก้าวหน้ารายเดือน/รายไตรมาส",
        risks_assessment: [
          ra(6011, "รายงานความก้าวหน้าไม่ต่อเนื่อง", 2, 3, 1),
          ra(6012, "ข้อมูลสถานะจริงไม่ตรงกับรายงาน", 2, 3, 2),
        ],
      },
    ],
  },

  7: {
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
    AuditActivityRisks: [
      {
        id: 701,
        processes: "การให้คำปรึกษาและอบรม",
        risk_factors: "ด้านทรัพยากร/ความรู้",
        object: "ให้คำปรึกษาเฉพาะทาง/ถ่ายทอดแนวทางมาตรฐาน",
        risks_assessment: [
          ra(7011, "ความพร้อมบุคลากร/วิทยากรไม่พอ", 3, 3, 1),
          ra(7012, "ผู้รับคำปรึกษานำไปใช้จริงได้น้อย", 2, 3, 2),
        ],
      },
    ],
  },
};

/** API helper */
export function getRiskEvaluationById(
  id: number
): AuditProgramRiskEvaluation | undefined {
  return PROGRAM_RISK_EVALS[id];
}
