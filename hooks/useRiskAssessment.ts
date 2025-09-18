"use client";

import { useState, useMemo, useEffect } from "react";

// ประเภทข้อมูลสำหรับระดับโอกาสและผลกระทบ
export type RiskLevel = {
  level: number;
  label: string;
  description: string;
  color: string;
};

// ประเภทข้อมูลสำหรับการประเมินความเสี่ยงของแต่ละปัจจัย
export type RiskAssessment = {
  factorId: number;
  subFactorIndex?: number; // สำหรับแยกข้อย่อย
  factorText: string;
  dimension: string;
  probability: number; // 1-5
  impact: number; // 1-5
  riskScore: number; // probability * impact
  riskLevel: "NEGLIGIBLE" | "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH";
};

// ข้อมูล mock สำหรับระดับโอกาส (แสดงตามด้าน)
const PROBABILITY_LEVELS: Record<string, RiskLevel[]> = {
  strategy: [
    {
      level: 1,
      label: "น้อยที่สุด",
      description:
        "หมายถึงการมีโอกาสเกิดขึ้นน้อยที่สุดในด้านกลยุทธ์ การดำเนินงานตามแผนยุทธศาสตร์มีโอกาสเกิดปัญหาน้อยมาก",
      color: "text-green-600",
    },
    {
      level: 2,
      label: "น้อย",
      description:
        "หมายถึงการมีโอกาสเกิดขึ้นน้อยในด้านกลยุทธ์ แผนยุทธศาสตร์อาจมีการปรับเปลี่ยนเล็กน้อย",
      color: "text-yellow-600",
    },
    {
      level: 3,
      label: "ปานกลาง",
      description:
        "หมายถึงการมีโอกาสเกิดขึ้นปานกลางในด้านกลยุทธ์ อาจต้องปรับแผนยุทธศาสตร์ในบางส่วน",
      color: "text-orange-600",
    },
    {
      level: 4,
      label: "สูง",
      description:
        "หมายถึงการมีโอกาสเกิดขึ้นสูงในด้านกลยุทธ์ แผนยุทธศาสตร์อาจต้องปรับเปลี่ยนอย่างมาก",
      color: "text-red-600",
    },
    {
      level: 5,
      label: "สูงมาก",
      description:
        "หมายถึงการมีโอกาสเกิดขึ้นสูงมากในด้านกลยุทธ์ แผนยุทธศาสตร์อาจล้มเหลวหรือต้องเริ่มใหม่",
      color: "text-red-800",
    },
  ],
  finance: [
    {
      level: 1,
      label: "น้อยที่สุด",
      description:
        "หมายถึงการมีโอกาสเกิดขึ้นน้อยที่สุดในด้านการเงิน งบประมาณและการเงินมีเสถียรภาพดี",
      color: "text-green-600",
    },
    {
      level: 2,
      label: "น้อย",
      description:
        "หมายถึงการมีโอกาสเกิดขึ้นน้อยในด้านการเงิน อาจมีการปรับงบประมาณเล็กน้อย",
      color: "text-yellow-600",
    },
    {
      level: 3,
      label: "ปานกลาง",
      description:
        "หมายถึงการมีโอกาสเกิดขึ้นปานกลางในด้านการเงิน อาจมีปัญหาทางการเงินระดับปานกลาง",
      color: "text-orange-600",
    },
    {
      level: 4,
      label: "สูง",
      description:
        "หมายถึงการมีโอกาสเกิดขึ้นสูงในด้านการเงิน อาจมีปัญหาการเงินที่ส่งผลกระทบต่อการดำเนินงาน",
      color: "text-red-600",
    },
    {
      level: 5,
      label: "สูงมาก",
      description:
        "หมายถึงการมีโอกาสเกิดขึ้นสูงมากในด้านการเงิน อาจเกิดวิกฤตการเงินหรือขาดสภาพคล่อง",
      color: "text-red-800",
    },
  ],
  operations: [
    {
      level: 1,
      label: "น้อยที่สุด",
      description:
        "หมายถึงการมีโอกาสเกิดขึ้นน้อยที่สุดในด้านการดำเนินงาน กระบวนการทำงานเป็นไปตามแผนได้ดี",
      color: "text-green-600",
    },
    {
      level: 2,
      label: "น้อย",
      description:
        "หมายถึงการมีโอกาสเกิดขึ้นน้อยในด้านการดำเนินงาน อาจมีปัญหาเล็กน้อยในกระบวนการทำงาน",
      color: "text-yellow-600",
    },
    {
      level: 3,
      label: "ปานกลาง",
      description:
        "หมายถึงการมีโอกาสเกิดขึ้นปานกลางในด้านการดำเนินงาน อาจมีปัญหาที่ต้องปรับปรุงกระบวนการ",
      color: "text-orange-600",
    },
    {
      level: 4,
      label: "สูง",
      description:
        "หมายถึงการมีโอกาสเกิดขึ้นสูงในด้านการดำเนินงาน อาจมีปัญหาที่ส่งผลกระทบต่อประสิทธิภาพ",
      color: "text-red-600",
    },
    {
      level: 5,
      label: "สูงมาก",
      description:
        "หมายถึงการมีโอกาสเกิดขึ้นสูงมากในด้านการดำเนินงาน อาจเกิดการหยุดชะงักหรือล่าช้าอย่างมาก",
      color: "text-red-800",
    },
  ],
  informationtechnology: [
    {
      level: 1,
      label: "น้อยที่สุด",
      description:
        "หมายถึงการมีโอกาสเกิดขึ้นน้อยที่สุดในด้านเทคโนโลยี ระบบ IT มีเสถียรภาพและความปลอดภัยดี",
      color: "text-green-600",
    },
    {
      level: 2,
      label: "น้อย",
      description:
        "หมายถึงการมีโอกาสเกิดขึ้นน้อยในด้านเทคโนโลยี อาจมีปัญหาทางเทคนิคเล็กน้อย",
      color: "text-yellow-600",
    },
    {
      level: 3,
      label: "ปานกลาง",
      description:
        "หมายถึงการมีโอกาสเกิดขึ้นปานกลางในด้านเทคโนโลยี อาจมีปัญหาระบบหรือการรักษาความปลอดภัย",
      color: "text-orange-600",
    },
    {
      level: 4,
      label: "สูง",
      description:
        "หมายถึงการมีโอกาสเกิดขึ้นสูงในด้านเทคโนโลยี อาจมีปัญหาระบบที่ส่งผลกระทบต่อการทำงาน",
      color: "text-red-600",
    },
    {
      level: 5,
      label: "สูงมาก",
      description:
        "หมายถึงการมีโอกาสเกิดขึ้นสูงมากในด้านเทคโนโลยี อาจเกิดการล่มของระบบหรือการโจมตีทางไซเบอร์",
      color: "text-red-800",
    },
  ],
  regulatorycompliance: [
    {
      level: 1,
      label: "น้อยที่สุด",
      description:
        "หมายถึงการมีโอกาสเกิดขึ้นน้อยที่สุดในด้านการปฏิบัติตามกฎระเบียบ มีการควบคุมและปฏิบัติตามกฎหมายได้ดี",
      color: "text-green-600",
    },
    {
      level: 2,
      label: "น้อย",
      description:
        "หมายถึงการมีโอกาสเกิดขึ้นน้อยในด้านการปฏิบัติตามกฎระเบียบ อาจมีการไม่ปฏิบัติตามกฎเล็กน้อย",
      color: "text-yellow-600",
    },
    {
      level: 3,
      label: "ปานกลาง",
      description:
        "หมายถึงการมีโอกาสเกิดขึ้นปานกลางในด้านการปฏิบัติตามกฎระเบียบ อาจมีการฝ่าฝืนกฎระเบียบบางประการ",
      color: "text-orange-600",
    },
    {
      level: 4,
      label: "สูง",
      description:
        "หมายถึงการมีโอกาสเกิดขึ้นสูงในด้านการปฏิบัติตามกฎระเบียบ อาจมีการฝ่าฝืนกฎหมายที่สำคัญ",
      color: "text-red-600",
    },
    {
      level: 5,
      label: "สูงมาก",
      description:
        "หมายถึงการมีโอกาสเกิดขึ้นสูงมากในด้านการปฏิบัติตามกฎระเบียบ อาจเกิดการฝ่าฝืนกฎหมายอย่างร้ายแรง",
      color: "text-red-800",
    },
  ],
  fraudrisk: [
    {
      level: 1,
      label: "น้อยที่สุด",
      description:
        "หมายถึงการมีโอกาสเกิดขึ้นน้อยที่สุดในด้านการทุจริต มีระบบควบคุมภายในที่แข็งแกร่ง",
      color: "text-green-600",
    },
    {
      level: 2,
      label: "น้อย",
      description:
        "หมายถึงการมีโอกาสเกิดขึ้นน้อยในด้านการทุจริต อาจมีช่องโหว่เล็กน้อยในระบบควบคุม",
      color: "text-yellow-600",
    },
    {
      level: 3,
      label: "ปานกลาง",
      description:
        "หมายถึงการมีโอกาสเกิดขึ้นปานกลางในด้านการทุจริต อาจมีความเสี่ยงการทุจริตในบางกิจกรรม",
      color: "text-orange-600",
    },
    {
      level: 4,
      label: "สูง",
      description:
        "หมายถึงการมีโอกาสเกิดขึ้นสูงในด้านการทุจริต มีความเสี่ยงการทุจริตที่ต้องเฝ้าระวัง",
      color: "text-red-600",
    },
    {
      level: 5,
      label: "สูงมาก",
      description:
        "หมายถึงการมีโอกาสเกิดขึ้นสูงมากในด้านการทุจริต มีความเสี่ยงการทุจริตขนาดใหญ่หรือเป็นระบบ",
      color: "text-red-800",
    },
  ],
};

// คำสำคัญสำหรับจัดกลุ่มปัจจัยเสี่ยงที่คล้ายกัน
const RISK_FACTOR_KEYWORDS: Record<string, string[]> = {
  personnel_changes: [
    "แนวโน้ม",
    "ปรับเปลี่ยน",
    "โอน",
    "ย้าย",
    "ลาออก",
    "บุคลากร",
    "ข้าราชการ",
    "ลูกจ้าง",
    "พนักงานราชการ",
  ],
  project_implementation: [
    "ผลการขับเคลื่อน",
    "แผนงาน",
    "โครงการ",
    "แผนปฏิบัติราชการ",
    "หน่วยงาน",
  ],
  project_count: [
    "จำนวนแผนงาน",
    "โครงการประจำปี",
    "งบประมาณ",
    "2567",
    "รับผิดชอบ",
    "ดำเนินการ",
  ],
  authority_delegation: [
    "มอบหมายอำนาจ",
    "หน้าที่",
    "ทักษะ",
    "ความรู้ความสามารถ",
    "บุคลากร",
    "เหมาะสม",
  ],
  manual_guidelines: ["คู่มือ", "แนวทางการปฏิบัติงาน", "ปฏิบัติงาน"],
  monitoring_evaluation: [
    "การติดตาม",
    "ประเมินผล",
    "การปฏิบัติงาน",
    "การดำเนินงาน",
    "โครงการ",
  ],
  budget_allocation: [
    "จำนวนเงิน",
    "งบประมาณ",
    "จัดสรร",
    "2567",
    "งบดำเนินงาน",
    "งบลงทุน",
    "งบอุดหนุน",
    "เงินนอกงบประมาณ",
  ],
  implementation_success: ["ความสำเร็จ", "การดำเนินการ", "แผนที่กำหนด"],
  budget_spending_overall: [
    "ผลการใช้จ่าย",
    "งบประมาณ",
    "ภาพรวม",
    "26 สิงหาคม 2567",
  ],
  budget_spending_investment: ["ผลการใช้จ่าย", "งบลงทุน", "26 สิงหาคม 2567"],
  cyber_security: ["การป้องกัน", "คุกคาม", "ไซเบอร์", "ระบบเทคโนโลยีสารสนเทศ"],
  system_utilization: ["การใช้ประโยชน์", "ระบบงาน", "พัฒนา"],
  regulatory_compliance: ["การปฏิบัติตาม", "กฎหมาย", "ระเบียบ"],
  audit_findings: ["ถูกทักท้วง", "หน่วยตรวจสอบ", "ภายใน", "ภายนอก", "2567"],
  knowledge_sharing: ["จัดกิจกรรม", "แลกเปลี่ยนเรียนรู้", "ภายในองค์กร"],
  personnel_development: ["พัฒนาบุคลากร", "การอบรม", "สัมมนา"],
};

// ฟังก์ชันหาคำสำคัญที่ตรงกับข้อความ
const findMatchingKeyword = (text: string): string | null => {
  const normalizedText = text.trim().toLowerCase().replace(/\s+/g, " ");

  for (const [key, keywords] of Object.entries(RISK_FACTOR_KEYWORDS)) {
    const matchCount = keywords.filter((keyword) =>
      normalizedText.includes(keyword.toLowerCase())
    ).length;

    // ถ้าตรงกับคำสำคัญมากกว่า 40% ของคำสำคัญทั้งหมดในกลุ่มนั้น
    if (matchCount / keywords.length >= 0.4) {
      return key;
    }
  }

  return null;
};

// ฟังก์ชันสร้าง hash สำหรับ text (ปรับปรุงใหม่)
const createHash = (text: string): string => {
  // พยายามหาคำสำคัญที่ตรงกับข้อความก่อน
  const matchedKeyword = findMatchingKeyword(text);
  if (matchedKeyword) {
    return matchedKeyword;
  }

  // ถ้าไม่เจอให้สร้าง hash แบบเดิม แต่ return เป็น string
  let hash = 0;
  const str = text.trim().toLowerCase().replace(/\s+/g, " ");
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return `fallback_${Math.abs(hash)}`;
};

// แผนที่ hash ไปยัง impact levels สำหรับแต่ละปัจจัยเสี่ยง
const FACTOR_IMPACT_LEVELS: Record<string, RiskLevel[]> = {};

// ฟังก์ชันลงทะเบียนปัจจัยเสี่ยงและ impact levels
const registerFactorImpactLevels = () => {
  // Strategy factors
  FACTOR_IMPACT_LEVELS[
    createHash(
      "แนวโน้มของการปรับเปลี่ยน/โอน/ย้าย/ลาออก ของบุคลากรที่ปฏิบัติงาน ตามภารกิจขององค์กรและนโยบายของผู้บริหาร (จำนวนข้าราชการ ลูกจ้างประจำ พนักงานราชการ)"
    )
  ] = [
    {
      level: 1,
      label: "น้อยที่สุด",
      description: "1",
      color: "text-green-600",
    },
    {
      level: 2,
      label: "น้อย",
      description: "2",
      color: "text-yellow-600",
    },
    {
      level: 3,
      label: "ปานกลาง",
      description: "3",
      color: "text-orange-600",
    },
    {
      level: 4,
      label: "สูง",
      description: "4",
      color: "text-red-600",
    },
    {
      level: 5,
      label: "สูงมาก",
      description: "5",
      color: "text-red-800",
    },
  ];

  FACTOR_IMPACT_LEVELS[
    createHash("ผลการขับเคลื่อนแผนงาน/โครงการตามแผนปฏิบัติราชการของหน่วยงาน")
  ] = [
    {
      level: 1,
      label: "น้อยที่สุด",
      description: "6",
      color: "text-green-600",
    },
    {
      level: 2,
      label: "น้อย",
      description: "7",
      color: "text-yellow-600",
    },
    {
      level: 3,
      label: "ปานกลาง",
      description: "8",
      color: "text-orange-600",
    },
    {
      level: 4,
      label: "สูง",
      description: "9",
      color: "text-red-600",
    },
    {
      level: 5,
      label: "สูงมาก",
      description: "10",
      color: "text-red-800",
    },
  ];

  // Finance factors
  FACTOR_IMPACT_LEVELS[
    createHash(
      "จำนวนแผนงาน/โครงการประจำปีงบประมาณ พ.ศ. 2567 ที่หน่วยงานเป็นผู้รับผิดชอบในการดำเนินการ"
    )
  ] = [
    {
      level: 1,
      label: "น้อยที่สุด",
      description: "โครงการทั้งหมดดำเนินไปตามแผน",
      color: "text-green-600",
    },
    {
      level: 2,
      label: "น้อย",
      description: "โครงการบางโครงการเกิดความล่าช้าเล็กน้อย",
      color: "text-yellow-600",
    },
    {
      level: 3,
      label: "ปานกลาง",
      description: "โครงการส่วนใหญ่ต้องปรับแผนการดำเนินงาน",
      color: "text-orange-600",
    },
    {
      level: 4,
      label: "สูง",
      description: "โครงการหลายโครงการต้องระงับหรือยกเลิก",
      color: "text-red-600",
    },
    {
      level: 5,
      label: "สูงมาก",
      description: "โครงการส่วนใหญ่ไม่สามารถดำเนินตามแผนได้",
      color: "text-red-800",
    },
  ];

  FACTOR_IMPACT_LEVELS[
    createHash(
      "มีการมอบหมายอำนาจ หน้าที่ ตามทักษะ ความรู้ความสามารถของบุคลากรอย่างเหมาะสม"
    )
  ] = [
    {
      level: 1,
      label: "น้อยที่สุด",
      description: "การมอบหมายงานเหมาะสมและมีประสิทธิภาพ",
      color: "text-green-600",
    },
    {
      level: 2,
      label: "น้อย",
      description: "การมอบหมายงานเหมาะสมในระดับปานกลาง",
      color: "text-yellow-600",
    },
    {
      level: 3,
      label: "ปานกลาง",
      description: "การมอบหมายงานไม่สอดคล้องกับความสามารถบางส่วน",
      color: "text-orange-600",
    },
    {
      level: 4,
      label: "สูง",
      description: "การมอบหมายงานไม่เหมาะสมส่งผลต่อคุณภาพงาน",
      color: "text-red-600",
    },
    {
      level: 5,
      label: "สูงมาก",
      description: "การมอบหมายงานผิดพลาดส่งผลต่อภารกิจหลัก",
      color: "text-red-800",
    },
  ];

  FACTOR_IMPACT_LEVELS[createHash("คู่มือหรือแนวทางการปฏิบัติงาน")] = [
    {
      level: 1,
      label: "น้อยที่สุด",
      description: "มีคู่มือที่ครบถ้วนและเป็นปัจจุบัน",
      color: "text-green-600",
    },
    {
      level: 2,
      label: "น้อย",
      description: "คู่มือมีความครบถ้วนส่วนใหญ่",
      color: "text-yellow-600",
    },
    {
      level: 3,
      label: "ปานกลาง",
      description: "คู่มือบางส่วนล้าสมัยหรือไม่สมบูรณ์",
      color: "text-orange-600",
    },
    {
      level: 4,
      label: "สูง",
      description: "คู่มือส่วนใหญ่ไม่เป็นปัจจุบันหรือไม่ชัดเจน",
      color: "text-red-600",
    },
    {
      level: 5,
      label: "สูงมาก",
      description: "ไม่มีคู่มือหรือคู่มือไม่สามารถใช้งานได้",
      color: "text-red-800",
    },
  ];

  FACTOR_IMPACT_LEVELS[createHash("การติดตาม และประเมินผลการปฏิบัติงาน")] = [
    {
      level: 1,
      label: "น้อยที่สุด",
      description: "มีระบบติดตามและประเมินผลที่มีประสิทธิภาพ",
      color: "text-green-600",
    },
    {
      level: 2,
      label: "น้อย",
      description: "ระบบติดตามและประเมินผลทำงานได้ดี",
      color: "text-yellow-600",
    },
    {
      level: 3,
      label: "ปานกลาง",
      description: "ระบบติดตามและประเมินผลมีข้อจำกัดบางประการ",
      color: "text-orange-600",
    },
    {
      level: 4,
      label: "สูง",
      description: "ระบบติดตามและประเมินผลไม่มีประสิทธิภาพ",
      color: "text-red-600",
    },
    {
      level: 5,
      label: "สูงมาก",
      description: "ไม่มีระบบติดตามและประเมินผลที่เหมาะสม",
      color: "text-red-800",
    },
  ];

  // Operations factors
  FACTOR_IMPACT_LEVELS[
    createHash(
      "จำนวนเงินงบประมาณที่ได้รับการจัดสรรประจำปีงบประมาณ พ.ศ. 2567 (งบดำเนินงาน งบลงทุน งบอุดหนุน งบรายจ่ายอื่น และเงินนอกงบประมาณ)"
    )
  ] = [
    {
      level: 1,
      label: "น้อยที่สุด",
      description: "ได้รับการจัดสรรงบประมาณครบถ้วนตามแผน",
      color: "text-green-600",
    },
    {
      level: 2,
      label: "น้อย",
      description: "ได้รับการจัดสรรงบประมาณเพียงพอสำหรับภารกิจหลัก",
      color: "text-yellow-600",
    },
    {
      level: 3,
      label: "ปานกลาง",
      description: "งบประมาณที่ได้รับไม่เพียงพอต้องปรับแผน",
      color: "text-orange-600",
    },
    {
      level: 4,
      label: "สูง",
      description: "ขาดแคลนงบประมาณส่งผลต่อการดำเนินงาน",
      color: "text-red-600",
    },
    {
      level: 5,
      label: "สูงมาก",
      description: "งบประมาณไม่เพียงพอทำให้ต้องระงับภารกิจ",
      color: "text-red-800",
    },
  ];

  FACTOR_IMPACT_LEVELS[createHash("ความสำเร็จในการดำเนินการตามแผนที่กำหนด")] = [
    {
      level: 1,
      label: "น้อยที่สุด",
      description: "การดำเนินงานสำเร็จตามแผนทุกประการ",
      color: "text-green-600",
    },
    {
      level: 2,
      label: "น้อย",
      description: "การดำเนินงานสำเร็จในระดับที่น่าพอใจ",
      color: "text-yellow-600",
    },
    {
      level: 3,
      label: "ปานกลาง",
      description: "การดำเนินงานบรรลุเป้าหมายบางส่วน",
      color: "text-orange-600",
    },
    {
      level: 4,
      label: "สูง",
      description: "การดำเนินงานไม่บรรลุเป้าหมายหลัก",
      color: "text-red-600",
    },
    {
      level: 5,
      label: "สูงมาก",
      description: "การดำเนินงานล้มเหลวส่วนใหญ่",
      color: "text-red-800",
    },
  ];

  FACTOR_IMPACT_LEVELS[
    createHash("ผลการใช้จ่ายงบประมาณในภาพรวม ณ วันที่ 26 สิงหาคม 2567")
  ] = [
    {
      level: 1,
      label: "น้อยที่สุด",
      description: "การใช้จ่ายงบประมาณเป็นไปตามแผนและมีประสิทธิภาพ",
      color: "text-green-600",
    },
    {
      level: 2,
      label: "น้อย",
      description: "การใช้จ่ายงบประมาณอยู่ในเกณฑ์ที่ยอมรับได้",
      color: "text-yellow-600",
    },
    {
      level: 3,
      label: "ปานกลาง",
      description: "การใช้จ่ายงบประมาณเบี่ยงเบนจากแผนบางส่วน",
      color: "text-orange-600",
    },
    {
      level: 4,
      label: "สูง",
      description: "การใช้จ่ายงบประมาณไม่เป็นไปตามแผนอย่างมาก",
      color: "text-red-600",
    },
    {
      level: 5,
      label: "สูงมาก",
      description: "การใช้จ่ายงบประมาณเกินแผนหรือต่ำกว่าแผนอย่างร้ายแรง",
      color: "text-red-800",
    },
  ];

  FACTOR_IMPACT_LEVELS[
    createHash("ผลการใช้จ่ายงบลงทุน ณ วันที่ 26 สิงหาคม 2567")
  ] = [
    {
      level: 1,
      label: "น้อยที่สุด",
      description: "การใช้จ่ายงบลงทุนเป็นไปตามแผนและคุ้มค่า",
      color: "text-green-600",
    },
    {
      level: 2,
      label: "น้อย",
      description: "การใช้จ่ายงบลงทุนอยู่ในเกณฑ์ที่เหมาะสม",
      color: "text-yellow-600",
    },
    {
      level: 3,
      label: "ปานกลาง",
      description: "การใช้จ่ายงบลงทุนล่าช้าหรือเกินแผนเล็กน้อย",
      color: "text-orange-600",
    },
    {
      level: 4,
      label: "สูง",
      description: "การใช้จ่ายงบลงทุนไม่เป็นไปตามแผนอย่างมาก",
      color: "text-red-600",
    },
    {
      level: 5,
      label: "สูงมาก",
      description: "ไม่สามารถใช้จ่ายงบลงทุนได้หรือเกินแผนอย่างร้ายแรง",
      color: "text-red-800",
    },
  ];

  // Information Technology factors
  FACTOR_IMPACT_LEVELS[
    createHash("การป้องกันการถูกคุกคามทางไซเบอร์ของระบบเทคโนโลยีสารสนเทศ")
  ] = [
    {
      level: 1,
      label: "น้อยที่สุด",
      description: "มีระบบป้องกันภัยไซเบอร์ที่แข็งแกร่งและครอบคลุม",
      color: "text-green-600",
    },
    {
      level: 2,
      label: "น้อย",
      description: "ระบบป้องกันภัยไซเบอร์มีประสิทธิภาพดี",
      color: "text-yellow-600",
    },
    {
      level: 3,
      label: "ปานกลาง",
      description: "ระบบป้องกันภัยไซเบอร์มีช่องโหว่บางประการ",
      color: "text-orange-600",
    },
    {
      level: 4,
      label: "สูง",
      description: "ระบบป้องกันภัยไซเบอร์อ่อนแอและมีความเสี่ยงสูง",
      color: "text-red-600",
    },
    {
      level: 5,
      label: "สูงมาก",
      description: "ไม่มีระบบป้องกันภัยไซเบอร์ที่เหมาะสมหรือถูกโจมตีแล้ว",
      color: "text-red-800",
    },
  ];

  FACTOR_IMPACT_LEVELS[createHash("การใช้ประโยชน์ของระบบงานที่พัฒนา")] = [
    {
      level: 1,
      label: "น้อยที่สุด",
      description: "ระบบงานถูกใช้ประโยชน์อย่างเต็มที่และมีประสิทธิภาพ",
      color: "text-green-600",
    },
    {
      level: 2,
      label: "น้อย",
      description: "ระบบงานถูกใช้ประโยชน์ในระดับที่ดี",
      color: "text-yellow-600",
    },
    {
      level: 3,
      label: "ปานกลาง",
      description: "ระบบงานถูกใช้ประโยชน์ในระดับปานกลาง",
      color: "text-orange-600",
    },
    {
      level: 4,
      label: "สูง",
      description: "ระบบงานไม่ถูกใช้ประโยชน์อย่างเต็มที่",
      color: "text-red-600",
    },
    {
      level: 5,
      label: "สูงมาก",
      description: "ระบบงานไม่ถูกใช้งานหรือไม่มีประโยชน์",
      color: "text-red-800",
    },
  ];

  // Regulatory Compliance factors
  FACTOR_IMPACT_LEVELS[createHash("ด้านการปฏิบัติตามกฎหมาย ระเบียบ")] = [
    {
      level: 1,
      label: "น้อยที่สุด",
      description: "ปฏิบัติตามกฎหมายและระเบียบอย่างครบถ้วน",
      color: "text-green-600",
    },
    {
      level: 2,
      label: "น้อย",
      description: "ปฏิบัติตามกฎหมายและระเบียบในระดับที่ดี",
      color: "text-yellow-600",
    },
    {
      level: 3,
      label: "ปานกลาง",
      description: "มีการไม่ปฏิบัติตามกฎระเบียบบางประการ",
      color: "text-orange-600",
    },
    {
      level: 4,
      label: "สูง",
      description: "มีการฝ่าฝืนกฎหมายและระเบียบที่สำคัญ",
      color: "text-red-600",
    },
    {
      level: 5,
      label: "สูงมาก",
      description: "มีการฝ่าฝืนกฎหมายและระเบียบอย่างร้ายแรง",
      color: "text-red-800",
    },
  ];

  FACTOR_IMPACT_LEVELS[
    createHash(
      "การถูกทักท้วงจากหน่วยตรวจสอบภายใน และหรือหน่วยตรวจสอบภายนอกประจำปีงบประมาณ พ.ศ. 2567"
    )
  ] = [
    {
      level: 1,
      label: "น้อยที่สุด",
      description: "ไม่มีการทักท้วงจากหน่วยตรวจสอบใดๆ",
      color: "text-green-600",
    },
    {
      level: 2,
      label: "น้อย",
      description: "มีการทักท้วงเล็กน้อยที่สามารถแก้ไขได้ง่าย",
      color: "text-yellow-600",
    },
    {
      level: 3,
      label: "ปานกลาง",
      description: "มีการทักท้วงในเรื่องที่ต้องปรับปรุงบางประการ",
      color: "text-orange-600",
    },
    {
      level: 4,
      label: "สูง",
      description: "มีการทักท้วงในเรื่องสำคัญที่ต้องแก้ไขด่วน",
      color: "text-red-600",
    },
    {
      level: 5,
      label: "สูงมาก",
      description: "มีการทักท้วงร้ายแรงหรือซ้ำซากในปัญหาเดิม",
      color: "text-red-800",
    },
  ];

  // Fraud Risk factors
  FACTOR_IMPACT_LEVELS[
    createHash("มีการจัดกิจกรรมการแลกเปลี่ยนเรียนรู้ภายในองค์กร")
  ] = [
    {
      level: 1,
      label: "น้อยที่สุด",
      description: "จัดกิจกรรมแลกเปลี่ยนเรียนรู้อย่างสม่ำเสมอและมีประสิทธิภาพ",
      color: "text-green-600",
    },
    {
      level: 2,
      label: "น้อย",
      description: "จัดกิจกรรมแลกเปลี่ยนเรียนรู้ในระดับดี",
      color: "text-yellow-600",
    },
    {
      level: 3,
      label: "ปานกลาง",
      description: "จัดกิจกรรมแลกเปลี่ยนเรียนรู้เป็นครั้งคราว",
      color: "text-orange-600",
    },
    {
      level: 4,
      label: "สูง",
      description: "จัดกิจกรรมแลกเปลี่ยนเรียนรู้น้อยมาก",
      color: "text-red-600",
    },
    {
      level: 5,
      label: "สูงมาก",
      description: "ไม่มีการจัดกิจกรรมแลกเปลี่ยนเรียนรู้",
      color: "text-red-800",
    },
  ];

  FACTOR_IMPACT_LEVELS[createHash("การพัฒนาบุคลากรการอบรม/สัมมนา")] = [
    {
      level: 1,
      label: "น้อยที่สุด",
      description: "มีการพัฒนาบุคลากรและอบรมอย่างเป็นระบบและครบถ้วน",
      color: "text-green-600",
    },
    {
      level: 2,
      label: "น้อย",
      description: "มีการพัฒนาบุคลากรและอบรมในระดับที่ดี",
      color: "text-yellow-600",
    },
    {
      level: 3,
      label: "ปานกลาง",
      description: "มีการพัฒนาบุคลากรและอบรมในระดับปานกลาง",
      color: "text-orange-600",
    },
    {
      level: 4,
      label: "สูง",
      description: "การพัฒนาบุคลากรและอบรมไม่เพียงพอ",
      color: "text-red-600",
    },
    {
      level: 5,
      label: "สูงมาก",
      description: "ไม่มีการพัฒนาบุคลากรและอบรมที่เหมาะสม",
      color: "text-red-800",
    },
  ];
};

// เรียกใช้ฟังก์ชันลงทะเบียนเมื่อโหลดไฟล์
registerFactorImpactLevels();

// ฟังก์ชัน debug สำหรับดู hash values (ใช้ใน development เท่านั้น)
const debugFactorHash = (factorText: string) => {
  const hash = createHash(factorText);
  const matchedKeyword = findMatchingKeyword(factorText);
  console.log(`Factor: "${factorText}"`);
  console.log(`-> Matched Keyword: ${matchedKeyword}`);
  console.log(`-> Hash: ${hash}`);
  console.log(`-> Has Impact Levels: ${!!FACTOR_IMPACT_LEVELS[hash]}`);
  return hash;
};

// ฟังก์ชันทดสอบระบบใหม่
const testSimilarFactors = () => {
  console.log("=== Testing Similar Risk Factors ===");

  // ทดสอบปัจจัยที่คล้ายกันจาก mock data
  const testCases = [
    "การติดตามและประเมินผลการดำเนินงานโครงการ", // จาก mock data
    "การติดตาม และประเมินผลการปฏิบัติงาน", // จาก useRiskAssessment
    "การติดตามความก้าวหน้า", // แปรผัน
  ];

  testCases.forEach((factor) => {
    debugFactorHash(factor);
    console.log("---");
  });
};

// ฟังก์ชันสร้างระดับผลกระทบตามปัจจัยเสี่ยง
const generateImpactLevels = (factorText: string): RiskLevel[] => {
  const hash = createHash(factorText);

  // ค้นหาจาก hash ที่ลงทะเบียนไว้
  if (FACTOR_IMPACT_LEVELS[hash]) {
    return FACTOR_IMPACT_LEVELS[hash];
  }

  // Default fallback
  return [
    {
      level: 1,
      label: "น้อยที่สุด",
      description: "ผลกระทบต่อปัจจัยนี้น้อยที่สุด",
      color: "text-green-600",
    },
    {
      level: 2,
      label: "น้อย",
      description: "ผลกระทบต่อปัจจัยนี้น้อย",
      color: "text-yellow-600",
    },
    {
      level: 3,
      label: "ปานกลาง",
      description: "ผลกระทบต่อปัจจัยนี้ปานกลาง",
      color: "text-orange-600",
    },
    {
      level: 4,
      label: "สูง",
      description: "ผลกระทบต่อปัจจัยนี้สูง",
      color: "text-red-600",
    },
    {
      level: 5,
      label: "สูงมาก",
      description: "ผลกระทบต่อปัจจัยนี้สูงมาก",
      color: "text-red-800",
    },
  ];
};

// ข้อมูล mock สำหรับระดับผลกระทบ (แยกตามด้าน - ใช้เป็น fallback)
const IMPACT_LEVELS: Record<string, RiskLevel[]> = {
  strategy: [
    {
      level: 1,
      label: "กล 1",
      description: "ไม่ส่งผลกระทบต่อการดำเนินงานตามแผนยุทธศาสตร์",
      color: "text-green-600",
    },
    {
      level: 2,
      label: "กล 2",
      description: "ส่งผลกระทบต่อการดำเนินงานเพียงเล็กน้อย",
      color: "text-yellow-600",
    },
    {
      level: 3,
      label: "กล 3",
      description: "ส่งผลกระทบต่อการดำเนินงานในระดับปานกลาง",
      color: "text-orange-600",
    },
    {
      level: 4,
      label: "กล 4",
      description: "ส่งผลกระทบต่อการดำเนินงานอย่างมาก",
      color: "text-red-600",
    },
    {
      level: 5,
      label: "กล 5",
      description: "ส่งผลกระทบต่อการดำเนินงานอย่างรุนแรง",
      color: "text-red-800",
    },
  ],
  finance: [
    {
      level: 1,
      label: "การเงิน 1",
      description: "ผลกระทบทางการเงินน้อยมาก",
      color: "text-green-600",
    },
    {
      level: 2,
      label: "การเงิน 2",
      description: "ผลกระทบทางการเงินในระดับน้อย",
      color: "text-yellow-600",
    },
    {
      level: 3,
      label: "การเงิน 3",
      description: "ผลกระทบทางการเงินในระดับปานกลาง",
      color: "text-orange-600",
    },
    {
      level: 4,
      label: "การเงิน 4",
      description: "ผลกระทบทางการเงินในระดับมาก",
      color: "text-red-600",
    },
    {
      level: 5,
      label: "การเงิน 5",
      description: "ผลกระทบทางการเงินอย่างรุนแรง",
      color: "text-red-800",
    },
  ],
  operations: [
    {
      level: 1,
      label: "ดำเนินงาน 1",
      description: "ไม่ส่งผลกระทบต่อการดำเนินงาน",
      color: "text-green-600",
    },
    {
      level: 2,
      label: "ดำเนินงาน 2",
      description: "ส่งผลกระทบต่อการดำเนินงานเพียงเล็กน้อย",
      color: "text-yellow-600",
    },
    {
      level: 3,
      label: "ดำเนินงาน 3",
      description: "ส่งผลกระทบต่อการดำเนินงานปานกลาง",
      color: "text-orange-600",
    },
    {
      level: 4,
      label: "ดำเนินงาน 4",
      description: "ส่งผลกระทบต่อการดำเนินงานอย่างมาก",
      color: "text-red-600",
    },
    {
      level: 5,
      label: "ดำเนินงาน 5",
      description: "หยุดชะงักการดำเนินงานอย่างรุนแรง",
      color: "text-red-800",
    },
  ],
  informationtechnology: [
    {
      level: 1,
      label: "IT 1",
      description: "ไม่ส่งผลกระทบต่อระบบ IT",
      color: "text-green-600",
    },
    {
      level: 2,
      label: "IT 2",
      description: "ส่งผลกระทบต่อระบบ IT เพียงเล็กน้อย",
      color: "text-yellow-600",
    },
    {
      level: 3,
      label: "IT 3",
      description: "ส่งผลกระทบต่อระบบ IT ปานกลาง",
      color: "text-orange-600",
    },
    {
      level: 4,
      label: "IT 4",
      description: "ส่งผลกระทบต่อระบบ IT อย่างมาก",
      color: "text-red-600",
    },
    {
      level: 5,
      label: "IT 5",
      description: "ระบบ IT ล่มหรือถูกโจมตีอย่างรุนแรง",
      color: "text-red-800",
    },
  ],
  regulatorycompliance: [
    {
      level: 1,
      label: "ปฏิบัติ 1",
      description: "ไม่มีการฝ่าฝืนกฎระเบียบ",
      color: "text-green-600",
    },
    {
      level: 2,
      label: "ปฏิบัติ 2",
      description: "การฝ่าฝืนกฎระเบียบเล็กน้อย",
      color: "text-yellow-600",
    },
    {
      level: 3,
      label: "ปฏิบัติ 3",
      description: "การฝ่าฝืนกฎระเบียบปานกลาง",
      color: "text-orange-600",
    },
    {
      level: 4,
      label: "ปฏิบัติ 4",
      description: "การฝ่าฝืนกฎระเบียบอย่างมาก",
      color: "text-red-600",
    },
    {
      level: 5,
      label: "ปฏิบัติ 5",
      description: "การฝ่าฝืนกฎระเบียบอย่างรุนแรง",
      color: "text-red-800",
    },
  ],
  fraudrisk: [
    {
      level: 1,
      label: "ทุจริต 1",
      description: "ไม่มีความเสี่ยงการทุจริต",
      color: "text-green-600",
    },
    {
      level: 2,
      label: "ทุจริต 2",
      description: "ความเสี่ยงการทุจริตเล็กน้อย",
      color: "text-yellow-600",
    },
    {
      level: 3,
      label: "ทุจริต 3",
      description: "ความเสี่ยงการทุจริตปานกลาง",
      color: "text-orange-600",
    },
    {
      level: 4,
      label: "ทุจริต 4",
      description: "ความเสี่ยงการทุจริตสูง",
      color: "text-red-600",
    },
    {
      level: 5,
      label: "ทุจริต 5",
      description: "ความเสี่ยงการทุจริตสูงมาก",
      color: "text-red-800",
    },
  ],
};

// ข้อมูล mock สำหรับวัตถุประสงค์ (แยกตามกระบวนงาน)
const PROCESS_OBJECTIVES: Record<string, string[]> = {
  "followup-evaluation": [
    "เพื่อติดตามและประเมินผลการดำเนินงานโครงการให้เป็นไปตามเป้าหมายที่กำหนด",
    "เพื่อให้มั่นใจว่าการใช้งบประมาณเป็นไปอย่างมีประสิทธิภาพและคุ้มค่า",
    "เพื่อระบุปัญหาและอุปสรรคในการดำเนินงานและหาแนวทางแก้ไข",
  ],
  "project-proposal": [
    "เพื่อให้การจัดทำข้อเสนอโครงการมีความครบถ้วน ถูกต้อง และสอดคล้องกับนโยบาย",
    "เพื่อให้มั่นใจว่าข้อเสนอโครงการได้รับการพิจารณาอนุมัติตามระเบียบ",
  ],
  "budget-appropriation-request": [
    "เพื่อให้การจัดทำคำขอตั้งงบประมาณเป็นไปตามระเบียบและแนวทางที่กำหนด",
    "เพื่อให้มั่นใจว่างบประมาณที่ขอตั้งสอดคล้องกับความจำเป็นและเป้าหมาย",
  ],
  "workplan-spending-plan": [
    "เพื่อให้การจัดทำแผนการปฏิบัติงานและแผนการใช้จ่ายงบประมาณมีความสมเหตุสมผล",
    "เพื่อให้มั่นใจว่าแผนที่จัดทำสามารถปฏิบัติได้จริงและเป็นไปตามเป้าหมาย",
  ],
  "budget-allocation-transfer-adjustment": [
    "เพื่อให้การจัดสรรงบประมาณและการโอนเปลี่ยนแปลงเป็นไปตามระเบียบ",
    "เพื่อให้มั่นใจว่าการใช้งบประมาณเป็นไปอย่างโปร่งใสและตรวจสอบได้",
  ],
  "execute-approved-project-proposal": [
    "เพื่อให้การดำเนินการตามข้อเสนอโครงการที่ได้รับอนุมัติเป็นไปตามแผน",
    "เพื่อให้มั่นใจว่าผลลัพธ์ของโครงการตรงตามวัตถุประสงค์ที่กำหนด",
  ],
  "performance-and-outcome-reporting": [
    "เพื่อให้การรายงานผลการดำเนินงานและผลสัมฤทธิ์มีความถูกต้องและครบถ้วน",
    "เพื่อให้ผู้บริหารและผู้เกี่ยวข้องได้รับทราบข้อมูลที่เป็นปัจจุบัน",
  ],
};

// ฟังก์ชันคำนวณระดับความเสี่ยง
const calculateRiskLevel = (
  score: number
): "NEGLIGIBLE" | "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH" => {
  if (score <= 3) return "NEGLIGIBLE"; // N (น้อยที่สุด)
  if (score <= 6) return "LOW"; // L (น้อย)
  if (score <= 12) return "MEDIUM"; // M (ปานกลาง)
  if (score <= 20) return "HIGH"; // H (สูง)
  return "VERY_HIGH"; // E (สูงมาก)
};

export function useRiskAssessment(auditId?: number) {
  const [assessments, setAssessments] = useState<RiskAssessment[]>([]);

  // โหลดข้อมูลการประเมินจาก localStorage เมื่อ component mount
  useEffect(() => {
    if (auditId) {
      try {
        const savedAssessments = localStorage.getItem(`risk-assessments-${auditId}`);
        if (savedAssessments) {
          const parsedAssessments = JSON.parse(savedAssessments);
          setAssessments(parsedAssessments);
          console.log('Loaded assessments from localStorage:', parsedAssessments);
        } else {
          setAssessments([]); // เคลียร์ state หากไม่มีข้อมูล
        }
      } catch (error) {
        console.error('Error loading saved assessments:', error);
        setAssessments([]); // เคลียร์ state หากมี error
      }
    }
  }, [auditId]);

  // บันทึกข้อมูลการประเมินลง localStorage เมื่อมีการเปลี่ยนแปลง
  useEffect(() => {
    if (auditId && assessments.length > 0) {
      try {
        localStorage.setItem(`risk-assessments-${auditId}`, JSON.stringify(assessments));
        console.log('Auto-saved assessments to localStorage:', assessments);
      } catch (error) {
        console.error('Error saving assessments:', error);
      }
    }
  }, [assessments, auditId]);

  // ฟังก์ชันเพิ่มหรืออัปเดตการประเมิน
  const updateAssessment = (
    factorId: number,
    factorText: string,
    dimension: string,
    probability: number,
    impact: number,
    subFactorIndex?: number
  ) => {
    const riskScore = probability * impact;
    const riskLevel = calculateRiskLevel(riskScore);

    setAssessments((prev) => {
      // ใช้ factorId, dimension และ subFactorIndex เป็น unique key เพื่อป้องกันการปนกัน
      const existing = prev.find(
        (a) =>
          a.factorId === factorId &&
          a.dimension === dimension &&
          (a.subFactorIndex === subFactorIndex ||
            (!a.subFactorIndex && !subFactorIndex))
      );

      const newAssessment: RiskAssessment = {
        factorId,
        subFactorIndex,
        factorText,
        dimension,
        probability,
        impact,
        riskScore,
        riskLevel,
      };

      const updatedAssessments = existing
        ? prev.map((a) =>
            a.factorId === factorId &&
            a.dimension === dimension &&
            (a.subFactorIndex === subFactorIndex ||
              (!a.subFactorIndex && !subFactorIndex))
              ? newAssessment
              : a
          )
        : [...prev, newAssessment];

      console.log(`[updateAssessment] Updated assessments for factor ${factorId}, dimension ${dimension}, subIndex ${subFactorIndex}:`, updatedAssessments);
      return updatedAssessments;
    });
  };

  // ฟังก์ชันลบการประเมิน
  const removeAssessment = (factorId: number) => {
    setAssessments((prev) => prev.filter((a) => a.factorId !== factorId));
  };

  // ฟังก์ชันดึงข้อมูลระดับโอกาสตามด้าน
  const getProbabilityLevels = (dimension: string): RiskLevel[] => {
    return PROBABILITY_LEVELS[dimension] || PROBABILITY_LEVELS.strategy;
  };

  // ฟังก์ชันดึงข้อมูลระดับผลกระทบตามปัจจัยเสี่ยง
  const getImpactLevels = (
    dimension: string,
    factorText?: string
  ): RiskLevel[] => {
    if (factorText) {
      return generateImpactLevels(factorText);
    }
    return IMPACT_LEVELS[dimension] || IMPACT_LEVELS.strategy;
  };

  // ฟังก์ชันดึงข้อมูลวัตถุประสงค์ตามกระบวนงาน
  const getProcessObjectives = (processValue: string): string[] => {
    return PROCESS_OBJECTIVES[processValue] || [];
  };

  // ฟังก์ชันดึงการประเมินตาม factorId, dimension และ subFactorIndex
  const getAssessment = (
    factorId: number,
    dimension: string,
    subFactorIndex?: number
  ): RiskAssessment | undefined => {
    const result = assessments.find(
      (a) =>
        a.factorId === factorId &&
        a.dimension === dimension &&
        (a.subFactorIndex === subFactorIndex ||
          (!a.subFactorIndex && !subFactorIndex))
    );
    
    console.log(`[getAssessment] Looking for factor ${factorId}, dimension ${dimension}, subIndex ${subFactorIndex}:`, result);
    return result;
  };

  // สถิติการประเมิน
  const assessmentStats = useMemo(() => {
    console.log(`[useRiskAssessment] Current assessments:`, assessments);
    
    const total = assessments.length;
    const byLevel = assessments.reduce((acc, curr) => {
      acc[curr.riskLevel] = (acc[curr.riskLevel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const averageScore =
      total > 0
        ? assessments.reduce((sum, curr) => sum + curr.riskScore, 0) / total
        : 0;

    const stats = {
      total,
      byLevel,
      averageScore: Math.round(averageScore * 100) / 100,
    };
    
    console.log(`[useRiskAssessment] Assessment stats:`, stats);
    return stats;
  }, [assessments]);

  // ฟังก์ชันตรวจสอบว่ามีข้อมูลการประเมินหรือไม่
  const hasAssessments = () => {
    return assessments.length > 0;
  };

  // ฟังก์ชันบังคับบันทึกข้อมูลทันที (สำหรับกรณีพิเศษ)
  const forceSave = () => {
    if (auditId) {
      try {
        localStorage.setItem(`risk-assessments-${auditId}`, JSON.stringify(assessments));
        console.log('Force-saved assessments to localStorage:', assessments);
        return true;
      } catch (error) {
        console.error('Error force-saving assessments:', error);
        return false;
      }
    }
    return false;
  };

  return {
    assessments,
    updateAssessment,
    removeAssessment,
    getProbabilityLevels,
    getImpactLevels,
    getProcessObjectives,
    getAssessment,
    assessmentStats,
    hasAssessments,
    forceSave,
    debugFactorHash, // สำหรับ debug
    testSimilarFactors, // สำหรับทดสอบ
  };
}
