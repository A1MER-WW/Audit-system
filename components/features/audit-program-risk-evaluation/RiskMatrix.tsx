"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";

type RiskMatrixProps = {
  assessments: Array<{
    probability: number; // 1..5
    impact: number; // 1..5
    riskLevel?: string;
  }>;
  onCellClick?: (probability: number, impact: number) => void;
};

export default function RiskMatrix({ assessments, onCellClick }: RiskMatrixProps) {
  /** ---------- สรุปจำนวนต่อช่อง (impact-likelihood) ---------- */
  const matrixData = React.useMemo(() => {
    const matrix: Record<string, number> = {};

    assessments.forEach((a) => {
      const key = `${a.impact}-${a.probability}`;
      matrix[key] = (matrix[key] || 0) + 1;
    });

    // ตัวอย่างเดโม่ตามภาพ หากไม่มีข้อมูลส่งเข้า
    if (assessments.length === 0) {
      matrix["5-1"] = 1;
      matrix["5-2"] = 2;
      matrix["5-4"] = 4; // **มีกรอบน้ำเงิน**
      matrix["4-2"] = 2;
      matrix["4-5"] = 2;
      matrix["2-1"] = 2;
      matrix["2-5"] = 1;
    }

    return matrix;
  }, [assessments]);

  /** ---------- สีพื้นตามระดับความเสี่ยง (อ้างอิงภาพโทนพาสเทล) ---------- */
  const getRiskColor = (impact: number, likelihood: number) => {
    const score = impact * likelihood;
    if (score >= 20) return "bg-red-500 text-white"; // แดงเข้ม
    if (score >= 16) return "bg-red-400 text-white";
    if (score >= 12) return "bg-red-300 text-gray-900"; // ชมพูแดง
    if (score >= 10) return "bg-pink-300 text-gray-900"; // ชมพู
    if (score >= 8) return "bg-yellow-300 text-gray-900";
    if (score >= 6) return "bg-yellow-200 text-gray-900";
    if (score >= 4) return "bg-yellow-100 text-gray-900";
    if (score >= 2) return "bg-green-300 text-gray-900";
    return "bg-green-500 text-white";
  };

  /** ---------- label ไทยตามภาพ ---------- */
  const likelihoodRows = [
    "มากที่สุด (5)",
    "มาก (4)",
    "ปานกลาง (3)",
    "น้อย (2)",
    "น้อยที่สุด (1)",
  ];
  const impactCols = [
    "น้อยที่สุด (1)",
    "น้อย (2)",
    "ปานกลาง (3)",
    "มาก (4)",
    "มากที่สุด (5)",
  ];

  // หาค่าที่มากที่สุดเพื่อล้อมกรอบฟ้าเหมือนภาพ (หรือจะล็อกไว้ที่ 5x4 ก็ได้)
  const maxCell = React.useMemo(() => {
    let max = -1;
    let pos: { impact: number; likelihood: number } | null = null;
    for (let l = 1; l <= 5; l++) {
      for (let i = 1; i <= 5; i++) {
        const v = matrixData[`${i}-${l}`] || 0;
        if (v > max) {
          max = v;
          pos = { impact: i, likelihood: l };
        }
      }
    }
    return { ...pos, value: max };
  }, [matrixData]);

  return (
    <Card className="mt-6">
      <CardContent className="p-6">
        {/* หัวข้อ */}
        <h3 className="text-sm font-medium text-gray-800 mb-4">
          รายงานเมทริกซ์ผลการประเมินและจัดลำดับความเสี่ยง
        </h3>

        <div className="bg-white p-6 rounded-xl border">
          <div className="relative flex gap-4">
            {/* ป้ายแกน Y (Likelihood) */}
            <div className="shrink-0 flex items-center">
              <div className="-rotate-90 text-sm font-medium text-gray-700 whitespace-nowrap">
                โอกาส (Likelihood)
              </div>
            </div>

            {/* ตารางแบบ grid ให้ mood เหมือนภาพ */}
            <div className="w-full">
              {/* ส่วนหัวคอลัมน์ (Impact 5→1 อยู่ด้านบนเป็นกล่องขาวมีเส้นขอบ) */}
              <div className="min-w-[640px]">
                <div className="grid grid-cols-[160px_repeat(5,1fr)] gap-2 w-full mb-2">
                  <div />
                  {/* มุมซ้ายบนเว้นว่าง */}
                  {[5, 4, 3, 2, 1].map((impact) => (
                    <div
                      key={`head-${impact}`}
                      className="h-12 rounded-lg border border-gray-300 bg-white flex items-center justify-center px-1"
                    >
                      <span className="text-xs font-medium leading-tight">
                        {impactCols[impact - 1]}
                      </span>
                    </div>
                  ))}
                </div>

                {/* แถวข้อมูล: Likelihood 5→1 */}
                {[5, 4, 3, 2, 1].map((likelihoodIdxFromTop) => {
                  const likelihood = likelihoodIdxFromTop; // 5..1
                  const label = likelihoodRows[5 - likelihood];
                  return (
                    <div
                      key={`row-${likelihood}`}
                      className="grid grid-cols-[160px_repeat(5,1fr)] gap-2 w-full mb-2"
                    >
                      {/* ป้ายแถวซ้าย */}
                      <div className="h-12 rounded-lg border border-gray-300 bg-white flex items-center justify-center px-2">
                        <span className="text-xs font-medium leading-tight text-center">
                          {label}
                        </span>
                      </div>

                      {/* ช่องเมทริกซ์: Impact 5→1 */}
                      {[5, 4, 3, 2, 1].map((impact) => {
                        const value =
                          matrixData[`${impact}-${likelihood}`] || 0;
                        const highlighted =
                          maxCell.impact === impact &&
                          maxCell.likelihood === likelihood &&
                          (maxCell.value ?? 0) > 0;

                        return (
                          <div
                            key={`cell-${impact}-${likelihood}`}
                            className={[
                              "h-12 rounded-lg flex items-center justify-center text-base font-bold relative",
                              value > 0
                                ? getRiskColor(impact, likelihood)
                                : "bg-white text-gray-400",
                              "shadow-[inset_0_0_0_1px_#e5e7eb]", // เส้นแบ่งบางๆ เหมือนภาพ
                              onCellClick && value > 0 ? "cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all" : "",
                            ].join(" ")}
                            onClick={() => onCellClick && value > 0 && onCellClick(likelihood, impact)}
                          >
                            {value}
                            {highlighted && (
                              <div className="absolute inset-0 rounded-lg ring-2 ring-blue-600 pointer-events-none" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}

                {/* ป้ายแกน X (Impact) ด้านล่าง */}
                <div className="grid grid-cols-[160px_repeat(5,1fr)] gap-2 mt-3">
                  <div />
                  <div className="col-span-5 h-10 rounded-lg border border-gray-300 bg-white flex items-center justify-center">
                    <span className="text-sm font-medium">
                      ผลกระทบ (Impact)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
