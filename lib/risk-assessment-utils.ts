import { factorOptionsByDimension } from "./risk-factors-data";
import type { RiskLevel } from "@/hooks/useRiskAssessment";

/**
 * ค้นหาข้อมูลปัจจัยเสี่ยงเฉพาะจากด้านและข้อความปัจจัย
 */
export const findFactorData = (dimension: string, factorText: string) => {
  const dimensionData = factorOptionsByDimension[dimension];
  if (!dimensionData) return null;
  
  return dimensionData.find(item => {
    // ค้นหาแบบตรงกัน หรือ factorText มีคำที่อยู่ใน item.factor
    return item.factor === factorText || 
           factorText.includes(item.factor.substring(0, 50)) ||
           item.factor.includes(factorText.substring(0, 50));
  });
};

/**
 * สร้างระดับผลกระทบเฉพาะสำหรับแต่ละปัจจัยเสี่ยง
 */
export const getCustomImpactLevels = (dimension: string, factorText: string): RiskLevel[] => {
  const factorData = findFactorData(dimension, factorText);
  
  if (factorData) {
    return [
      { level: 1, label: "น้อยที่สุด", description: factorData.impacts.very_low, color: "text-green-600" },
      { level: 2, label: "น้อย", description: factorData.impacts.low, color: "text-yellow-600" },
      { level: 3, label: "ปานกลาง", description: factorData.impacts.medium, color: "text-orange-600" },
      { level: 4, label: "สูง", description: factorData.impacts.high, color: "text-red-600" },
      { level: 5, label: "สูงมาก", description: factorData.impacts.very_high, color: "text-red-800" }
    ];
  }
  
  // Fallback สำหรับกรณีที่ไม่พบข้อมูล
  return [
    { level: 1, label: "น้อยที่สุด", description: "ผลกระทบต่อปัจจัยนี้น้อยที่สุด", color: "text-green-600" },
    { level: 2, label: "น้อย", description: "ผลกระทบต่อปัจจัยนี้น้อย", color: "text-yellow-600" },
    { level: 3, label: "ปานกลาง", description: "ผลกระทบต่อปัจจัยนี้ปานกลาง", color: "text-orange-600" },
    { level: 4, label: "สูง", description: "ผลกระทบต่อปัจจัยนี้สูง", color: "text-red-600" },
    { level: 5, label: "สูงมาก", description: "ผลกระทบต่อปัจจัยนี้สูงมาก", color: "text-red-800" }
  ];
};