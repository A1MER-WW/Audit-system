"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  BarChart3,
  CheckCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  uniqueKey?: string;
  reason_for_new_risk_ranking?: string;
};

export default function SubmittedRiskAssessmentView({ detail }: Props) {
  const [tab, setTab] = useState("results");
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

      const processedAssessments = assessmentData.map(
        (
          assessment: Record<string, unknown>,
          index: number
        ): AssessmentResult => {
          const dimensionLabels: Record<string, string> = {
            strategy: "ด้านกลยุทธ์",
            finance: "ด้านการเงิน",
            operations: "ด้านการดำเนินงาน",
            informationtechnology: "ด้านเทคโนโลยีสารสนเทศ",
            regulatorycompliance: "ด้านการปฏิบัติตามกฎระเบียบ",
            fraudrisk: "ด้านการเกิดทุจริต",
          };

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

          const findRiskByFactorId = (factorId: number) => {
            return detail.AuditActivityRisks.find((r) => r.id === factorId);
          };

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

          const uniqueId = `${assessment.factorId}-${assessment.dimension}-${
            assessment.subFactorIndex || 0
          }`;
          const hashCode = uniqueId.split("").reduce((a, b) => {
            a = (a << 5) - a + b.charCodeAt(0);
            return a & a;
          }, 0);

          return {
            id: Math.abs(hashCode),
            processName: getProcessName(assessment.factorId as number),
            dimension:
              dimensionLabels[assessment.dimension as string] ||
              (assessment.dimension as string),
            riskFactor:
              (assessment.factorText as string) || "ไม่ระบุปัจจัยเสี่ยง",
            totalScore:
              (assessment.riskScore as number) ||
              (assessment.probability as number) *
                (assessment.impact as number),
            riskLevel: getRiskLevelLabel(assessment.riskLevel as string),
            priority: index + 1,
            probability: assessment.probability as number,
            impact: assessment.impact as number,
            uniqueKey: uniqueId,
            reason_for_new_risk_ranking: undefined,
          };
        }
      );

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

      const assessmentsWithReasons = finalAssessments.map(
        (assessment: AssessmentResult) => ({
          ...assessment,
          reason_for_new_risk_ranking:
            reasonsMap[assessment.id] || assessment.reason_for_new_risk_ranking,
        })
      );

      return assessmentsWithReasons;
    } catch (error) {
      console.error("Error parsing assessment data:", error);
      return [];
    }
  }, [detail.id, detail.AuditActivityRisks]);

  // คำนวณสถิติสำหรับ dashboard
  const riskStatistics = useMemo(() => {
    const riskCounts = {
      สูงมาก: 0,
      สูง: 0,
      ปานกลาง: 0,
      น้อย: 0,
      น้อยที่สุด: 0,
    };

    assessments.forEach((assessment) => {
      if (riskCounts.hasOwnProperty(assessment.riskLevel)) {
        riskCounts[assessment.riskLevel as keyof typeof riskCounts]++;
      }
    });

    const total = assessments.length;

    return {
      total,
      riskCounts,
      highRisk: riskCounts["สูงมาก"] + riskCounts["สูง"],
      mediumRisk: riskCounts["ปานกลาง"],
      lowRisk: riskCounts["น้อย"] + riskCounts["น้อยที่สุด"],
    };
  }, [assessments]);

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
    <div className="px-6 py-4">
      {/* breadcrumb */}
      <div className="mb-3">
        <Link
          href={`/audit-program-risk-evaluation/${detail.id}/results`}
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
                <span className="text-green-600 font-medium">
                  เสนอหัวหน้ากลุ่มตรวจสอบภายในแล้ว
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm text-green-600 font-medium">
                ส่งเรียบร้อย
              </span>
            </div>
          </div>
        </div>

        {/* steps tabs */}
        <div className="border-t border-gray-100">
          <div className="flex items-center px-5 py-3">
            {[
              { n: 1, t: "เลือกปัจจัยเสี่ยง" },
              { n: 2, t: "ประเมินความเสี่ยง" },
              { n: 3, t: "ผลการประเมิน" },
              { n: 4, t: "เสนอหัวหน้ากลุ่ม" },
            ].map((s, i) => {
              const currentStep = 4; // ขั้นตอนที่ active ตอนนี้
              const active = s.n === currentStep;
              const completed = s.n < currentStep;

              return (
                <React.Fragment key={s.n}>
                  {/* เส้นคั่นระหว่างสเต็ป */}
                  {i > 0 && (
                    <span
                      className={`mx-3 h-px flex-1 ${
                        completed || active ? "bg-green-500" : "bg-gray-200"
                      }`}
                    />
                  )}

                  <div className="flex items-center gap-2">
                    {/* วงกลมตัวเลข */}
                    <div
                      className={[
                        "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                        active || completed
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-700",
                      ].join(" ")}
                    >
                      {completed && !active ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        s.n
                      )}
                    </div>

                    {/* ข้อความ */}
                    <span
                      className={`text-sm ${
                        active || completed ? "text-green-600" : "text-gray-700"
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

      {/* Dashboard Section */}
      <div className="mt-6">
        <div className="px-1 text-lg font-semibold text-gray-800 mb-4">
          ภาพรวมการประเมินความเสี่ยงครอบคลุมความเสี่ยงของโครงการ{" "}
          {detail.auditTopics.auditTopic}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-red-100">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-700 mb-1">
                {riskStatistics.riskCounts["สูงมาก"]}
              </div>
              <div className="text-sm text-red-600">สูงมาก</div>
              <div className="text-xs text-red-500 mt-1">รายการ</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-700 mb-1">
                {riskStatistics.riskCounts["สูง"]}
              </div>
              <div className="text-sm text-orange-600">สูง</div>
              <div className="text-xs text-orange-500 mt-1">รายการ</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-700 mb-1">
                {riskStatistics.riskCounts["ปานกลาง"]}
              </div>
              <div className="text-sm text-yellow-600">ปานกลาง</div>
              <div className="text-xs text-yellow-500 mt-1">รายการ</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-700 mb-1">
                {riskStatistics.riskCounts["น้อย"]}
              </div>
              <div className="text-sm text-green-600">น้อย</div>
              <div className="text-xs text-green-500 mt-1">รายการ</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-700 mb-1">
                {riskStatistics.riskCounts["น้อยที่สุด"]}
              </div>
              <div className="text-sm text-gray-600">น้อยที่สุด</div>
              <div className="text-xs text-gray-500 mt-1">รายการ</div>
            </CardContent>
          </Card>
        </div>

        {/* Risk Distribution Chart Placeholder */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              ภาพรวมการประเมินความเสี่ยงและจัดลำดับความเสี่ยงครอบคลุม
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-48 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-dashed border-blue-200">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-blue-400 mx-auto mb-3" />
                <div className="text-blue-600 font-medium">
                  แผนภูมิแสดงการกระจายความเสี่ยง
                </div>
                <div className="text-sm text-blue-500 mt-1">
                  รวม {riskStatistics.total} รายการ | ความเสี่ยงสูง{" "}
                  {riskStatistics.highRisk} รายการ | ปานกลาง{" "}
                  {riskStatistics.mediumRisk} รายการ | ต่ำ{" "}
                  {riskStatistics.lowRisk} รายการ
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>ผลการประเมินความเสี่ยง</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600">
              รายการนี้มีความเสี่ยงทั้งหมด{" "}
              <span className="font-semibold text-gray-800">
                {riskStatistics.total}
              </span>{" "}
              รายการ โดย:
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>
                  ความเสี่ยงระดับสูงมาก:{" "}
                  <span className="font-semibold">
                    {riskStatistics.riskCounts["สูงมาก"]} รายการ
                  </span>
                </span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span>
                  ความเสี่ยงระดับสูง:{" "}
                  <span className="font-semibold">
                    {riskStatistics.riskCounts["สูง"]} รายการ
                  </span>
                </span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>
                  ความเสี่ยงระดับปานกลาง:{" "}
                  <span className="font-semibold">
                    {riskStatistics.riskCounts["ปานกลาง"]} รายการ
                  </span>
                </span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>
                  ความเสี่ยงระดับน้อย:{" "}
                  <span className="font-semibold">
                    {riskStatistics.riskCounts["น้อย"]} รายการ
                  </span>
                </span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <span>
                  ความเสี่ยงระดับน้อยที่สุด:{" "}
                  <span className="font-semibold">
                    {riskStatistics.riskCounts["น้อยที่สุด"]} รายการ
                  </span>
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab} className="mt-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="results">ผลการประเมินความเสี่ยง</TabsTrigger>
            <TabsTrigger value="ranking">ผลการจัดลำดับความเสี่ยง</TabsTrigger>
          </TabsList>
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

                      <TableCell className="min-w-[160px]">
                        <div className="font-medium">{a.processName}</div>
                      </TableCell>

                      <TableCell className="text-center">
                        <Badge variant="outline" className="text-xs">
                          {a.dimension}
                        </Badge>
                      </TableCell>

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
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Ranking Table */}
        <TabsContent value="ranking" className="mt-4">
          <div className="space-y-4">
            {/* Header info */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    ผลการจัดลำดับความเสี่ยงที่เสนอ
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    ลำดับความเสี่ยงที่ได้รับการจัดเรียงและส่งเสนอแล้ว
                    (ไม่สามารถแก้ไขได้)
                  </p>
                </div>
              </div>
            </div>

            {/* Ranking Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <Table>
                <TableHeader>
                  {/* แถวที่ 1 */}
                  <TableRow className="bg-white">
                    <TableHead
                      className="text-center w-20 align-middle border-0"
                      rowSpan={2}
                    >
                      ลำดับ
                    </TableHead>

                    <TableHead
                      className="w-40 align-middle border-0"
                      rowSpan={2}
                    >
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

                    <TableHead
                      className="text-center w-32 align-middle border-0"
                      rowSpan={2}
                    >
                      เหตุผล
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
                  {(reorderedAssessments.length > 0
                    ? reorderedAssessments
                    : assessments
                  ).map((assessment, index) => (
                    <TableRow key={assessment.id} className="hover:bg-gray-50">
                      {/* ลำดับ */}
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className="font-medium">{index + 1}</span>
                        </div>
                      </TableCell>

                      {/* กระบวนงาน */}
                      <TableCell className="min-w-[160px]">
                        <div className="font-medium text-sm">
                          {assessment.processName}
                        </div>
                      </TableCell>

                      {/* ด้าน */}
                      <TableCell className="text-center">
                        <Badge variant="outline" className="text-xs">
                          {assessment.dimension}
                        </Badge>
                      </TableCell>

                      {/* ความเสี่ยงและปัจจัยเสี่ยง */}
                      <TableCell className="w-[560px] align-top">
                        <div
                          className="text-sm text-gray-900 whitespace-pre-line break-words"
                          title={assessment.riskFactor}
                        >
                          {assessment.riskFactor}
                        </div>
                      </TableCell>

                      {/* คะแนน */}
                      <TableCell className="text-center">
                        <div className="font-bold text-lg">
                          {assessment.totalScore}
                        </div>
                      </TableCell>

                      {/* ระดับความเสี่ยง */}
                      <TableCell className="text-center">
                        <Badge
                          className={`${riskLevelColor(
                            assessment.riskLevel
                          )} border font-medium`}
                        >
                          {assessment.riskLevel}
                        </Badge>
                      </TableCell>

                      {/* ลำดับความเสี่ยง */}
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center">
                          <Badge
                            variant="secondary"
                            className="rounded-full w-8 h-8 flex items-center justify-center font-bold"
                          >
                            {index + 1}
                          </Badge>
                        </div>
                      </TableCell>

                      {/* เหตุผล */}
                      <TableCell className="text-center">
                        <div className="text-sm text-gray-600">
                          {assessment.reason_for_new_risk_ranking || "-"}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
