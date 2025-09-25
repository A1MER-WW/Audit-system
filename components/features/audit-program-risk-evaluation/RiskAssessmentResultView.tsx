"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { AuditProgramRiskEvaluation } from "@/hooks/useAuditProgramRiskEvaluation";
import DragDropRiskTable from "./DragDropRiskTable";

type Props = {
  detail: AuditProgramRiskEvaluation;
};

type AssessmentResult = {
  id: number;
  processName: string;
  dimension: string;
  riskFactor: string;
  totalScore: number;
  riskLevel: string;
  priority: number;
  probability: number;
  impact: number;
  uniqueKey?: string; // เพิ่มสำหรับ debug
  reason_for_new_risk_ranking?: string; // เหตุผลในการเปลี่ยนลำดับ
};

export default function RiskAssessmentResultView({ detail }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState("results");
  const [isNavigating, setIsNavigating] = useState(false);
  const [reorderedAssessments, setReorderedAssessments] = useState<
    AssessmentResult[]
  >([]);

  // ดึงข้อมูลการประเมินจาก localStorage และประมวลผลให้แสดงในตาราง
  const assessments = useMemo((): AssessmentResult[] => {
    const savedAssessments = localStorage.getItem(
      `risk-assessments-${detail.id}`
    );

    if (!savedAssessments) {
      return [];
    }

    try {
      const assessmentData = JSON.parse(savedAssessments);

      // แปลงข้อมูลการประเมินให้เป็นรูปแบบที่ตารางต้องการ
      const processedAssessments = assessmentData.map(
        (
          assessment: Record<string, unknown>,
          index: number
        ): AssessmentResult => {
          // แปลง dimension code เป็น label
          const dimensionLabels: Record<string, string> = {
            strategy: "ด้านกลยุทธ์",
            finance: "ด้านการเงิน",
            operations: "ด้านการดำเนินงาน",
            informationtechnology: "ด้านเทคโนโลยีสารสนเทศ",
            regulatorycompliance: "ด้านการปฏิบัติตามกฎระเบียบ",
            fraudrisk: "ด้านการเกิดทุจริต",
          };

          // แปลง risk level code เป็น label
          const getRiskLevelLabel = (level: string) => {
            switch (level) {
              case "NEGLIGIBLE":
                return "น้อยที่สุด";
              case "LOW":
                return "น้อย";
              case "MEDIUM":
                return "ปานกลาง";
              case "HIGH":
                return "สูง";
              case "VERY_HIGH":
                return "สูงมาก";
              default:
                return "ไม่ระบุ";
            }
          };

          // ฟังก์ชันค้นหา risk จาก factorId
          const findRiskByFactorId = (factorId: number) => {
            return detail.AuditActivityRisks.find((r) => r.id === factorId);
          };

          // หากระบวนงานจาก factorId พร้อมการจัดการข้อมูลที่ครอบคลุมมากขึ้น
          const getProcessName = (factorId: number) => {
            const risk = findRiskByFactorId(factorId);
            if (risk) {
              const processLabels: Record<string, string> = {
                "followup-evaluation":
                  "การติดตามและประเมินผลการดำเนินงานโครงการ",
                "project-proposal": "การจัดทำข้อเสนอโครงการ",
                "budget-appropriation-request": "การจัดทำคำขอตั้งงบประมาณ",
                "workplan-spending-plan":
                  "การจัดทำแผนการปฏิบัติงานและแผนการใช้จ่ายงบประมาณ",
                "budget-allocation-transfer-adjustment":
                  "การจัดสรรงบประมาณ/การโอนเปลี่ยนแปลงงบประมาณ",
                "execute-approved-project-proposal":
                  "การดำเนินการตามข้อเสนอโครงการที่ได้รับการอนุมัติ",
                "performance-and-outcome-reporting":
                  "การรายงานผลการดำเนินงานและการรายงานผลสัมฤทธิ์ของโครงการ",
              };
              return processLabels[risk.processes] || risk.processes;
            }
            return `ไม่พบกระบวนงาน (ID: ${factorId})`;
          };

          // ฟังก์ชันตรวจสอบว่า dimension ที่บันทึกตรงกับข้อมูลจริงหรือไม่
          const validateDimension = (
            factorId: number,
            savedDimension: string
          ) => {
            const risk = findRiskByFactorId(factorId);
            if (risk) {
              const availableDimensions = risk.risk_factors
                .split(",")
                .map((d) => d.trim());
              return availableDimensions.includes(savedDimension);
            }
            return false;
          };

          // ตรวจสอบความถูกต้องของข้อมูล
          const isValidDimension = validateDimension(
            assessment.factorId as number,
            assessment.dimension as string
          );
          const risk = findRiskByFactorId(assessment.factorId as number);

          // เพิ่ม debug information
          console.log(`[RiskAssessmentResultView] Processing assessment:`, {
            factorId: assessment.factorId,
            subFactorIndex: assessment.subFactorIndex,
            dimension: assessment.dimension,
            isValidDimension,
            riskFound: !!risk,
            factorText: assessment.factorText,
            probability: assessment.probability,
            impact: assessment.impact,
            riskScore: assessment.riskScore,
          });

          // สร้าง unique id ที่รวม factorId, dimension, และ subFactorIndex
          const uniqueId = `${assessment.factorId}-${assessment.dimension}-${
            assessment.subFactorIndex || 0
          }`;
          const hashCode = uniqueId.split("").reduce((a, b) => {
            a = (a << 5) - a + b.charCodeAt(0);
            return a & a;
          }, 0);

          return {
            id: Math.abs(hashCode), // ใช้ absolute value ของ hash เป็น id
            processName: getProcessName(assessment.factorId as number),
            dimension:
              dimensionLabels[assessment.dimension as string] ||
              `${assessment.dimension} ${
                !isValidDimension ? "(ไม่ตรงกับข้อมูลต้นทาง)" : ""
              }`,
            riskFactor:
              (assessment.factorText as string) || "ไม่ระบุปัจจัยเสี่ยง",
            totalScore:
              (assessment.riskScore as number) ||
              (assessment.probability as number) *
                (assessment.impact as number),
            riskLevel: getRiskLevelLabel(assessment.riskLevel as string),
            priority: index + 1, // จัดลำดับตามคะแนน (สูงไปต่ำ)
            probability: assessment.probability as number,
            impact: assessment.impact as number,
            uniqueKey: uniqueId, // เก็บ key เดิมไว้สำหรับ debug
            reason_for_new_risk_ranking: undefined, // จะถูกโหลดจาก localStorage ทีหลัง
          };
        }
      );

      // Debug: แสดงข้อมูลก่อนเรียงลำดับ
      console.log(
        `[RiskAssessmentResultView] Processed ${processedAssessments.length} assessments before sorting:`,
        processedAssessments
      );

      // จัดเรียงตามคะแนนจากสูงไปต่ำ และอัพเดทลำดับความสำคัญ
      const sortedAssessments = processedAssessments.sort(
        (a: AssessmentResult, b: AssessmentResult) =>
          b.totalScore - a.totalScore
      );

      const finalAssessments = sortedAssessments.map(
        (assessment: AssessmentResult, index: number) => ({
          ...assessment,
          priority: index + 1,
        })
      );

      // Debug: แสดงข้อมูลหลังเรียงลำดับ
      // โหลดเหตุผลจาก localStorage
      const savedReasons = localStorage.getItem(`risk-reasons-${detail.id}`);
      let reasonsMap: Record<number, string> = {};

      if (savedReasons) {
        try {
          const reasonData = JSON.parse(savedReasons);
          reasonsMap = reasonData.reasons || {};
        } catch (error) {
          console.error("Error loading saved reasons:", error);
        }
      }

      // เพิ่มเหตุผลเข้าไปใน finalAssessments
      const assessmentsWithReasons = finalAssessments.map(
        (assessment: AssessmentResult) => ({
          ...assessment,
          reason_for_new_risk_ranking:
            reasonsMap[assessment.id] || assessment.reason_for_new_risk_ranking,
        })
      );

      console.log(
        `[RiskAssessmentResultView] Final ${assessmentsWithReasons.length} sorted assessments with reasons:`,
        assessmentsWithReasons
      );

      return assessmentsWithReasons;

      // Debug: ตรวจสอบ unique keys
      const uniqueKeys = finalAssessments.map(
        (a: AssessmentResult) => a.uniqueKey
      );
      const duplicateKeys = uniqueKeys.filter(
        (key: string | undefined, index: number) =>
          uniqueKeys.indexOf(key) !== index
      );
      if (duplicateKeys.length > 0) {
        console.warn(
          `[RiskAssessmentResultView] Found duplicate keys:`,
          duplicateKeys
        );
      } else {
        console.log(
          `[RiskAssessmentResultView] All keys are unique:`,
          uniqueKeys
        );
      }

      return assessmentsWithReasons;
    } catch (error) {
      console.error("Error parsing assessment data:", error);
      return [];
    }
  }, [detail.id, detail.AuditActivityRisks]);

  // ฟังก์ชันสำหรับบันทึกลำดับใหม่
  const handleSaveReorder = (newAssessments: AssessmentResult[]) => {
    setReorderedAssessments(newAssessments);

    // บันทึกลำดับใหม่ลง localStorage
    const reorderData = {
      timestamp: new Date().toISOString(),
      reorderedIds: newAssessments.map((a) => a.id),
      assessments: newAssessments,
    };

    localStorage.setItem(
      `risk-reorder-${detail.id}`,
      JSON.stringify(reorderData)
    );

    // แสดงข้อความแจ้งเตือน
    alert("บันทึกลำดับความเสี่ยงใหม่เรียบร้อยแล้ว");
  };

  // ฟังก์ชันสำหรับรีเซ็ตลำดับ
  const handleResetReorder = () => {
    setReorderedAssessments([]);
    localStorage.removeItem(`risk-reorder-${detail.id}`);
  };

  // โหลดข้อมูลลำดับและเหตุผลที่เคยบันทึกไว้
  const loadSavedReorderAndReasons = React.useCallback(() => {
    // โหลดเหตุผล
    const savedReasons = localStorage.getItem(`risk-reasons-${detail.id}`);
    let reasonsMap: Record<number, string> = {};

    if (savedReasons) {
      try {
        const reasonData = JSON.parse(savedReasons);
        reasonsMap = reasonData.reasons || {};
      } catch (error) {
        console.error("Error loading saved reasons:", error);
      }
    }

    // โหลดลำดับ
    const savedReorder = localStorage.getItem(`risk-reorder-${detail.id}`);
    if (savedReorder && assessments.length > 0) {
      try {
        const reorderData = JSON.parse(savedReorder);
        const reorderedIds = reorderData.reorderedIds;

        // จัดเรียงตาม reorderedIds และเพิ่มเหตุผล
        const reordered = reorderedIds
          .map((id: number) => {
            const assessment = assessments.find((a) => a.id === id);
            if (!assessment) return null;
            return {
              ...assessment,
              reason_for_new_risk_ranking:
                reasonsMap[id] || assessment.reason_for_new_risk_ranking,
            };
          })
          .filter(Boolean)
          .map((assessment: AssessmentResult, index: number) => ({
            ...assessment,
            priority: index + 1,
          }));

        setReorderedAssessments(reordered);
      } catch (error) {
        console.error("Error loading saved reorder:", error);
      }
    } else {
      // ถ้าไม่มีการจัดเรียงใหม่ แต่มีเหตุผล ให้เพิ่มเหตุผลเข้าไปใน assessments ปกติ
      if (Object.keys(reasonsMap).length > 0) {
        const updatedAssessments = assessments.map((assessment) => ({
          ...assessment,
          reason_for_new_risk_ranking:
            reasonsMap[assessment.id] || assessment.reason_for_new_risk_ranking,
        }));
        setReorderedAssessments(updatedAssessments);
      }
    }
  }, [detail.id, assessments]);

  // โหลดข้อมูลลำดับและเหตุผลเมื่อ assessments เปลี่ยน
  React.useEffect(() => {
    loadSavedReorderAndReasons();
  }, [loadSavedReorderAndReasons]);

  // จัดการการนำทางไปหน้า submitted
  const handleNavigateToSubmitted = async () => {
    setIsNavigating(true);
    try {
      // เพิ่ม delay เล็กน้อยเพื่อให้เห็น loading
      await new Promise(resolve => setTimeout(resolve, 500));
      await router.push(`/audit-program-risk-evaluation/${detail.id}/submitted`);
    } catch (error) {
      console.error('Navigation error:', error);
      setIsNavigating(false);
    }
  };

  const riskLevelColor = (level: string) => {
    switch (level) {
      case "สูงมาก":
        return "bg-red-100 text-red-700 border-red-200";
      case "สูง":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "ปานกลาง":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "น้อย":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="px-6 py-4 relative">
      {/* Loading Overlay */}
      {isNavigating && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-xl border border-gray-200 min-w-[200px] text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-blue-600" />
            <p className="text-sm font-medium text-gray-900 mb-1">กำลังโหลด</p>
            <p className="text-xs text-gray-500">กำลังเสนอหัวหน้ากลุ่มตรวจสอบภายใน...</p>
          </div>
        </div>
      )}

      {/* breadcrumb */}
      <div className="mb-3">
        <Link
          href={`/audit-program-risk-evaluation/${detail.id}/assess`}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="h-4 w-4" />
          กลับ
        </Link>
      </div>

      {/* Header card with stepper */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h1 className="text-lg font-semibold text-gray-900 leading-snug">
                {detail.auditTopics.auditTopic}
              </h1>
              <div className="text-sm text-gray-600">
                หน่วยงาน:{" "}
                <span className="text-gray-800">
                  {detail.auditTopics.departments
                    .map((d) => d.departmentName)
                    .join(" / ")}
                </span>
              </div>
              <div className="text-sm">
                สถานะ:{" "}
                <span className="text-[#3E52B9]">
                  ผู้ตรวจสอบภายในกำลังดำเนินการ
                </span>
              </div>
            </div>{" "}
            <Button 
              onClick={handleNavigateToSubmitted}
              disabled={isNavigating}
              className="bg-[#3E52B9] hover:bg-[#2A3A8F] text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isNavigating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  กำลังโหลด...
                </>
              ) : (
                "เสนอหัวหน้ากลุ่มตรวจสอบภายใน"
              )}
            </Button>
          </div>
        </div>

        {/* steps tabs */}
        <div className="border-t border-gray-100">
          <div className="flex items-center px-5 py-3">
            {[
              { n: 1, t: "เลือกปัจจัยเสี่ยง" },
              { n: 2, t: "ประเมินความเสี่ยง" },
              { n: 3, t: "ผลการประเมิน" },
            ].map((s, i) => {
              const currentStep = 3; // ขั้นตอนที่ active ตอนนี้
              const active = s.n === currentStep;
              const completed = s.n < currentStep;

              return (
                <React.Fragment key={s.n}>
                  {/* เส้นคั่นระหว่างสเต็ป */}
                  {i > 0 && (
                    <span
                      className={`mx-3 h-px flex-1 ${
                        completed || active ? "bg-[#3E52B9]" : "bg-gray-200"
                      }`}
                    />
                  )}

                  <div className="flex items-center gap-2">
                    {/* วงกลมตัวเลข */}
                    <div
                      className={[
                        "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                        active || completed
                          ? "bg-[#3E52B9] text-white"
                          : "bg-gray-200 text-gray-700",
                      ].join(" ")}
                    >
                      {s.n}
                    </div>

                    {/* ข้อความ */}
                    <span
                      className={`text-sm ${
                        active || completed ? "text-[#3E52B9]" : "text-gray-700"
                      }`}
                    >
                      {s.t}
                    </span>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
      <div className="px-1 text-lg font-semibold text-gray-800 mt-4">
        ผลการประเมินความเสี่ยง
      </div>
      {/* วัตถุประสงค์ (หัวข้ออยู่นอก, รายการอยู่ในกล่องมีกรอบ) */}
      <section className="mt-4">
        {/* หัวข้อเล็ก ๆ ด้านบน */}
        <div className="px-1 text-sm text-gray-500">วัตถุประสงค์</div>

        {/* กล่องมีกรอบ + พื้นหลังอ่อน */}
        <div className="mt-2 rounded-xl border border-[#E6EDFF] bg-[#F7FAFF] p-4">
          <ul className="list-none space-y-1 text-sm leading-6 text-gray-800">
            <li>
              ๑.๑
              ศึกษาวิเคราะห์ความเหมาะสมของโครงการที่เสนอขอรับการสนับสนุนเงินกองทุนตลอดจนการให้คำแนะนำการจัดทำโครงการที่ดี
            </li>
            <li>
              ๑.๒ ติดตาม ควบคุม
              กำกับดูแลการดำเนินงานโครงการที่สอดคล้องกับระเบียบหลักเกณฑ์อื่นๆ
              ของทางราชการที่เกี่ยวข้องตลอดจนสอดคล้องตามมติคณะกรรมการ/คณะอนุกรรมการ/คณะทำงาน
              และแผนปฏิบัติงานที่กำหนด
            </li>
            <li>
              ๑.๓ ติดตามความก้าวหน้าผลการดำเนินงานโครงการต่าง ๆ
              ที่ได้รับเงินจากกองทุน
            </li>
            <li>๑.๔ ประเมินผลความสำเร็จของการดำเนินงานโครงการ</li>
            <li>
              ๑.๕ ปฏิบัติงานเกี่ยวกับการซื้อ การจ้างทำของ การจ้างเหมาบริการ
              การแลกเปลี่ยนการเช่า การควบคุม และการจำหน่ายซึ่งพัสดุ
              ครุภัณฑ์ที่ดินและสิ่งก่อสร้างของกองทุน
            </li>
            <li>๑.๖ ปฏิบัติงานตามข้อตกลงการประเมินผลกองทุนของกระทรวงการคลัง</li>
          </ul>
        </div>
      </section>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab} className="mt-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="results">ผลการประเมินความเสี่ยง</TabsTrigger>
            <TabsTrigger value="ranking">ผลการจัดลำดับความเสี่ยง</TabsTrigger>
          </TabsList>

          {/* Action buttons */}
          <div className="flex gap-2">
            {/* Show different buttons based on active tab */}
            {tab === "results" ? (
              <>
                {/* <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const confirmClear = confirm(
                      "คุณต้องการล้างข้อมูลการประเมินทั้งหมดหรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้"
                    );
                    if (confirmClear) {
                      localStorage.removeItem(`risk-assessments-${detail.id}`);
                      window.location.reload();
                    }
                  }}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  ล้างข้อมูล
                </Button> */}
                {/* <Link
                  href={`/audit-program-risk-evaluation/${detail.id}/assess`}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow hover:bg-blue-700"
                >
                  แก้ไขการประเมิน
                </Link> */}
              </>
            ) : (
              <>
                {/* <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const confirmReset = confirm(
                      "คุณต้องการล้างการจัดลำดับและกลับไปใช้ลำดับเดิมหรือไม่?"
                    );
                    if (confirmReset) {
                      handleResetReorder();
                    }
                  }}
                  className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                >
                  ล้างการจัดลำดับ
                </Button> */}
                {/* <Button
                  size="sm"
                  onClick={() => setTab("results")}
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  ดูผลการประเมิน
                </Button>
                <Button
                  onClick={handleNavigateToSubmitted}
                  disabled={isNavigating}
                  className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white shadow hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isNavigating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      กำลังโหลด...
                    </>
                  ) : (
                    "เสนอหัวหน้ากลุ่มตรวจสอบภายใน"
                  )}
                </Button> */}
              </>
            )}
          </div>
        </div>

        {/* Results Table */}
        <TabsContent value="results" className="mt-4">
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <Table>
              <TableHeader>
                {/* แถวที่ 1 */}
                <TableRow className="bg-white">
                  <TableHead
                    className="text-center w-12 align-middle border-0"
                    rowSpan={2}
                  >
                    ลำดับ
                  </TableHead>

                  <TableHead className="w-40 align-middle border-0" rowSpan={2}>
                    กระบวนงาน
                  </TableHead>

                  <TableHead
                    className="text-center w-40 align-middle border-0"
                    rowSpan={2}
                  >
                    ด้าน
                  </TableHead>

                  <TableHead
                    className="w-[560px] align-middle border-0"
                    rowSpan={2}
                  >
                    ความเสี่ยงและปัจจัยเสี่ยง
                  </TableHead>

                  {/* หัวข้อรวม */}
                  <TableHead
                    className="text-center align-middle font-semibold border-0 !border-b-0 bg-white"
                    colSpan={3}
                  >
                    การประเมินความเสี่ยงระดับกิจกรรม
                  </TableHead>
                </TableRow>

                {/* แถวที่ 2 */}
                <TableRow className="bg-gray-50/70">
                  <TableHead className="text-center w-20">คะแนน</TableHead>
                  <TableHead className="text-center w-28">
                    ระดับความเสี่ยง
                  </TableHead>
                  <TableHead className="text-center w-24">
                    ลำดับความเสี่ยง
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assessments.length > 0 ? (
                  assessments.map((a: AssessmentResult, i: number) => (
                    <TableRow
                      key={a.uniqueKey || `assessment-${i}`}
                      className="hover:bg-gray-50"
                    >
                      <TableCell className="text-center">{i + 1}</TableCell>

                      {/* กระบวนงาน: แคบลงจาก min-w-[200px] -> min-w-[160px] */}
                      <TableCell className="min-w-[160px]">
                        <div className="font-medium">{a.processName}</div>
                      </TableCell>

                      <TableCell className="text-center">
                        <Badge variant="outline" className="text-xs">
                          {a.dimension}
                        </Badge>
                      </TableCell>

                      {/* ความเสี่ยงและปัจจัยเสี่ยง: กว้างขึ้น + ตัด clamp ให้แสดงได้มากขึ้น + ตัดคำยาว */}
                      <TableCell className="w-[560px] align-top">
                        <div
                          className="text-sm text-gray-900 whitespace-pre-line break-words"
                          title={a.riskFactor}
                        >
                          {a.riskFactor}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="font-bold text-lg">{a.totalScore}</div>
                      </TableCell>

                      <TableCell className="text-center">
                        <Badge
                          className={`${riskLevelColor(
                            a.riskLevel
                          )} border font-medium`}
                        >
                          {a.riskLevel}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-center">
                        <div className="flex items-center justify-center">
                          <Badge
                            variant="secondary"
                            className="rounded-full w-8 h-8 flex items-center justify-center font-bold"
                          >
                            {a.priority}
                          </Badge>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="text-gray-500">
                        <div className="text-lg font-medium mb-2">
                          ยังไม่มีข้อมูลการประเมิน
                        </div>
                        <div className="text-sm">
                          กรุณาไปทำการประเมินความเสี่ยงก่อน
                        </div>
                        <Link
                          href={`/audit-program-risk-evaluation/${detail.id}/assess`}
                          className="inline-flex items-center gap-2 mt-3 text-blue-600 hover:text-blue-700 text-sm"
                        >
                          ไปประเมินความเสี่ยง →
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="ranking" className="mt-4">
          <DragDropRiskTable
            initialAssessments={
              reorderedAssessments.length > 0
                ? reorderedAssessments
                : assessments
            }
            onSave={handleSaveReorder}
            onReset={handleResetReorder}
            auditId={detail.id}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
