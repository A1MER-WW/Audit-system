"use client";

import React, { useState, useMemo } from "react";
import { ChevronLeft, Save, AlertTriangle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  useRiskAssessment,
  type RiskAssessment,
  type RiskLevel,
} from "@/hooks/useRiskAssessment";
import type {
  AuditProgramRiskEvaluation,
  AuditActivityRisk,
} from "@/hooks/useAuditProgramRiskEvaluation";
import { getCustomImpactLevels } from "@/lib/risk-assessment-utils";

type Props = {
  detail: AuditProgramRiskEvaluation;
  onSave?: (assessments: RiskAssessment[]) => void;
};

const dimensionLabels: Record<string, string> = {
  strategy: "ด้านกลยุทธ์",
  finance: "ด้านการเงิน",
  operations: "ด้านการดำเนินงาน",
  informationtechnology: "ด้านเทคโนโลยีสารสนเทศ",
  regulatorycompliance: "ด้านการปฏิบัติตามกฎระเบียบ",
  fraudrisk: "ด้านการเกิดทุจริต",
};

const processLabels: Record<string, string> = {
  "followup-evaluation": "การติดตามและประเมินผลการดำเนินงานโครงการ",
  "project-proposal": "การจัดทำข้อเสนอโครงการ",
  "budget-appropriation-request": "การจัดทำคำขอตั้งงบประมาณ",
  "workplan-spending-plan": "การจัดทำแผนการปฏิบัติงานและแผนการใช้จ่ายงบประมาณ",
  "budget-allocation-transfer-adjustment":
    "การจัดสรรงบประมาณ/การโอนเปลี่ยนแปลงงบประมาณ",
  "execute-approved-project-proposal":
    "การดำเนินการตามข้อเสนอโครงการที่ได้รับการอนุมัติ",
  "performance-and-outcome-reporting":
    "การรายงานผลการดำเนินงานและการรายงานผลสัมฤทธิ์ของโครงการ",
};

const getRiskLevelColor = (level: string) => {
  switch (level) {
    case "NEGLIGIBLE":
      return "bg-blue-100 text-blue-800";
    case "LOW":
      return "bg-green-100 text-green-800";
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-800";
    case "HIGH":
      return "bg-orange-100 text-orange-800";
    case "VERY_HIGH":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
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

// Component สำหรับ Modal เลือกระดับ (ใช้ UI pattern เหมือน risk-assessment-form.tsx)
const RiskLevelModal: React.FC<{
  title: string;
  levels: RiskLevel[];
  selectedValue: number;
  onSelect: (value: number) => void;
  children: React.ReactNode;
  context?: { dimension: string; item: string };
}> = ({ title, levels, selectedValue, onSelect, children, context }) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (value: number) => {
    console.log(
      `[RiskLevelModal] ${title} selected:`,
      value,
      "from current:",
      selectedValue
    );
    onSelect(value);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[720px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>แตะเพื่อเลือกระดับคะแนน</DialogDescription>
        </DialogHeader>

        {context && (
          <div className="mb-3 rounded-xl border bg-muted/40 px-4 py-2 text-sm">
            <div className="text-muted-foreground">
              เรื่อง: <span className="text-foreground">{context.item}</span>
            </div>
          </div>
        )}

        <RadioGroup
          value={String(selectedValue || 0)}
          onValueChange={(v) => handleSelect(Number(v))}
          className="space-y-3"
        >
          {/* ตัวเลือก "ไม่ประเมิน" */}
          <Label
            htmlFor="none-option"
            className="flex cursor-pointer items-center gap-3 rounded-2xl border p-4 min-h-[56px] transition hover:bg-muted/40"
          >
            <RadioGroupItem
              id="none-option"
              value="0"
              className="h-5 w-5 shrink-0"
            />
            <div className="flex w-full flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
              <div className="font-semibold text-muted-foreground sm:min-w-[90px] whitespace-nowrap">
                -
              </div>
              <div className="text-sm text-muted-foreground sm:flex-1 whitespace-normal break-words">
                ยังไม่ประเมิน
              </div>
            </div>
          </Label>

          {/* ตัวเลือกระดับต่างๆ */}
          {levels.map((level) => {
            const id = `level-${level.level}`;
            const active = selectedValue === level.level;

            return (
              <Label
                key={id}
                htmlFor={id}
                className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 min-h-[56px] transition ${
                  active
                    ? "bg-primary/10 border-primary/40 shadow-sm"
                    : "hover:bg-muted/40"
                }`}
              >
                <RadioGroupItem
                  id={id}
                  value={String(level.level)}
                  className="h-5 w-5 shrink-0"
                />
                <div className="flex w-full flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                  <div className="font-semibold text-foreground sm:min-w-[90px] whitespace-nowrap">
                    {level.label}
                  </div>
                  <div className="text-sm text-muted-foreground sm:flex-1 whitespace-normal break-words">
                    {level.description ||
                      `หมายถึงการมีระดับ${level.label} ในการประเมินความเสี่ยง`}
                  </div>
                </div>
              </Label>
            );
          })}
        </RadioGroup>
      </DialogContent>
    </Dialog>
  );
};

// Component ฟอร์มประเมินความเสี่ยงสำหรับแต่ละปัจจัยย่อย
const IndividualRiskForm: React.FC<{
  riskText: string;
  riskId: string;
  probabilityLevels: RiskLevel[];
  impactLevels: RiskLevel[];
  assessment?: RiskAssessment;
  rank?: number;
  onUpdate: (probability: number, impact: number) => void;
}> = ({
  riskText,
  probabilityLevels,
  impactLevels,
  assessment,
  rank,
  onUpdate,
}) => {
  // ใช้ assessment data โดยตรงแทนการใช้ local state เพื่อหลีกเลี่ยงปัญหา sync
  const currentProbability = assessment?.probability || 0;
  const currentImpact = assessment?.impact || 0;

  const handleProbabilityChange = (value: number) => {
    console.log(
      `[IndividualRiskForm] Probability changing for "${riskText.substring(
        0,
        30
      )}...": ${currentProbability} -> ${value}, current impact: ${currentImpact}`
    );
    onUpdate(value, currentImpact);
  };

  const handleImpactChange = (value: number) => {
    console.log(
      `[IndividualRiskForm] Impact changing for "${riskText.substring(
        0,
        30
      )}...": ${currentImpact} -> ${value}, current probability: ${currentProbability}`
    );
    onUpdate(currentProbability, value);
  };

  const riskScore = currentProbability * currentImpact;
  const pickedBoth = currentProbability > 0 && currentImpact > 0;

  return (
    <div
      className="
    grid items-center px-4 py-3
    grid-cols-[1fr_120px_120px_56px_120px_72px]
    gap-x-3 md:gap-x-4
  "
    >
      {/* ซ้าย: ปัจจัย (จำกัด 2 บรรทัด) */}
      <div className="text-sm text-gray-700 pr-4">
        <div className="text-gray-600 line-clamp-2 leading-snug">
          {riskText.trim()}
        </div>
      </div>

      {/* โอกาส */}
      <div className="w-[120px]">
        <RiskLevelModal
          title="โอกาส"
          levels={probabilityLevels}
          selectedValue={currentProbability}
          onSelect={handleProbabilityChange}
          context={{
            dimension: "ระดับโอกาส",
            item:
              riskText.trim().length > 50
                ? riskText.trim().substring(0, 50) + "..."
                : riskText.trim(),
          }}
        >
          <Button
            variant="outline"
            className="w-full h-9 text-sm justify-center font-medium tabular-nums"
            title={`โอกาส: ${currentProbability || 0}`}
          >
            {currentProbability === 0 ? "-" : currentProbability}
          </Button>
        </RiskLevelModal>
      </div>

      {/* ผลกระทบ */}
      <div className="w-[120px]">
        <RiskLevelModal
          title="ผลกระทบ"
          levels={impactLevels}
          selectedValue={currentImpact}
          onSelect={handleImpactChange}
          context={{
            dimension: "ระดับผลกระทบ",
            item:
              riskText.trim().length > 50
                ? riskText.trim().substring(0, 50) + "..."
                : riskText.trim(),
          }}
        >
          <Button
            variant="outline"
            className="w-full h-9 text-sm justify-center font-medium tabular-nums"
            title={`ผลกระทบ: ${currentImpact || 0}`}
          >
            {currentImpact === 0 ? "-" : currentImpact}
          </Button>
        </RiskLevelModal>
      </div>

      {/* คะแนน */}
      <div className="text-center w-[56px]">
        <div className="text-xs text-gray-500 md:hidden mb-0.5">คะแนน</div>
        <div className="font-semibold">{riskScore || "-"}</div>
      </div>

      {/* ระดับ */}
      <div className="text-center w-[120px]">
        <div className="text-xs text-gray-500 md:hidden mb-0.5">ระดับ</div>
        {pickedBoth && assessment?.riskLevel ? (
          <Badge
            className={`${getRiskLevelColor(
              assessment.riskLevel
            )} text-xs px-2 py-1`}
          >
            {getRiskLevelLabel(assessment.riskLevel)}
          </Badge>
        ) : (
          <Badge className="bg-gray-100 text-gray-700 text-xs px-2 py-1">
            -
          </Badge>
        )}
      </div>

      {/* ลำดับ */}
      <div className="text-center w-[72px]">
        <div className="text-xs text-gray-500 md:hidden mb-0.5">ลำดับ</div>
        <div className="font-semibold">{rank ?? "-"}</div>
      </div>
    </div>
  );
};
// Component หลักสำหรับแสดงปัจจัยเสี่ยงที่แยกข้อ
const RiskAssessmentForm: React.FC<{
  risk: AuditActivityRisk;
  probabilityLevels: RiskLevel[];
  impactLevels: RiskLevel[];
  selectedDimension: string;
  getAssessment: (
    factorId: number,
    dimension: string,
    subFactorIndex?: number
  ) => RiskAssessment | undefined;
  onUpdate: (
    factorId: number,
    factorText: string,
    dimension: string,
    probability: number,
    impact: number,
    subFactorIndex?: number
  ) => void;
}> = ({
  risk,
  probabilityLevels,
  getAssessment,
  onUpdate,
  selectedDimension,
}) => {
  // แยกปัจจัยเสี่ยงออกตาม dimension ที่เลือก (แก้ไขให้ง่ายขึ้น)
  const extractFactorsForDimension = (
    content: string,
    targetDimension: string
  ): string[] => {
    console.log(
      `[extractFactorsForDimension] Target dimension: ${targetDimension}, Content preview:`,
      content.substring(0, 200) + "..."
    );

    // ทดลองแยกตามรูปแบบข้อมูลทั้งหมดก่อน
    let factors: string[] = [];

    // ตรวจสอบว่าข้อมูลมี marker หรือไม่
    if (content.includes("[") && content.includes("]")) {
      // ข้อมูลรูปแบบใหม่ที่มี marker
      const dimensionLabels: Record<string, string> = {
        strategy: "ด้านกลยุทธ์",
        finance: "ด้านการเงิน",
        operations: "ด้านการดำเนินงาน",
        informationtechnology: "ด้านเทคโนโลยีสารสนเทศ",
        regulatorycompliance: "ด้านการปฏิบัติตามกฎระเบียบ",
        fraudrisk: "ด้านการเกิดทุจริต",
      };

      const targetLabel = dimensionLabels[targetDimension];
      console.log(
        `[extractFactorsForDimension] Looking for dimension label: "${targetLabel}"`
      );

      // แยกทุก section ที่มี [ด้าน...]
      const dimensionRegex = /\[([^\]]+)\]\s*([\s\S]*?)(?=\[|$)/g;
      let match;

      while ((match = dimensionRegex.exec(content)) !== null) {
        const [, bracketContent, sectionContent] = match;
        console.log(
          `[extractFactorsForDimension] Found section: "${bracketContent}"`
        );

        if (bracketContent === targetLabel) {
          factors = sectionContent
            .trim()
            .split(/\n\s*\n/)
            .filter((f) => f.trim().length > 0)
            .map((f) => f.trim());
          console.log(
            `[extractFactorsForDimension] Extracted ${factors.length} factors:`,
            factors
          );
          break;
        }
      }
    } else {
      // ข้อมูลรูปแบบเก่า - แสดงทั้งหมด
      factors = content
        .split(/\n\s*\n/)
        .filter((factor) => factor.trim().length > 0);
      console.log(
        `[extractFactorsForDimension] Legacy format, found ${factors.length} factors`
      );
    }

    console.log(
      `[extractFactorsForDimension] Final result: ${factors.length} factors for dimension "${targetDimension}"`
    );
    return factors;
  };

  const riskFactors = extractFactorsForDimension(
    risk.object,
    selectedDimension
  );

  console.log(
    `[RiskAssessmentForm] Risk ID: ${risk.id}, Selected dimension: ${selectedDimension}, Factors found: ${riskFactors.length}`
  );

  // ถ้าไม่มีปัจจัยสำหรับด้านนี้ ไม่แสดงอะไร
  if (riskFactors.length === 0) {
    console.log(
      `[RiskAssessmentForm] No factors found for risk ${risk.id} in dimension ${selectedDimension}`
    );
    return null;
  }

  // ถ้ามีปัจจัยเดียว ให้แสดงแบบเดิม
  if (riskFactors.length === 1) {
    // แยกข้อย่อยภายในปัจจัยเดียว (แยกด้วย \n)
    const subFactors = riskFactors[0]
      .split("\n")
      .filter((f) => f.trim().length > 0);

    if (subFactors.length <= 1) {
      return (
        <IndividualRiskForm
          riskText={riskFactors[0]}
          riskId={`${risk.id}`}
          probabilityLevels={probabilityLevels}
          impactLevels={getCustomImpactLevels(
            selectedDimension,
            riskFactors[0]
          )}
          assessment={getAssessment(risk.id, selectedDimension)}
          onUpdate={(probability, impact) =>
            onUpdate(
              risk.id,
              riskFactors[0],
              selectedDimension,
              probability,
              impact
            )
          }
        />
      );
    }

    // ถ้ามีหลายข้อย่อย ให้แสดงแยกข้อ
    return (
      <>
        {subFactors.map((factor, index) => (
          <IndividualRiskForm
            key={`${risk.id}-${index}`}
            riskText={factor}
            riskId={`${risk.id}-${index}`}
            probabilityLevels={probabilityLevels}
            impactLevels={getCustomImpactLevels(
              selectedDimension,
              factor.trim()
            )}
            assessment={getAssessment(risk.id, selectedDimension, index)}
            onUpdate={(probability, impact) =>
              onUpdate(
                risk.id,
                factor.trim(),
                selectedDimension,
                probability,
                impact,
                index
              )
            }
          />
        ))}
      </>
    );
  }

  // ถ้ามีหลายปัจจัย ให้แสดงแยกข้อ (ใช้ข้อมูลเฉพาะของแต่ละปัจจัย)
  return (
    <>
      {riskFactors.map((factor, index) => (
        <IndividualRiskForm
          key={`${risk.id}-${index}`}
          riskText={factor}
          riskId={`${risk.id}-${index}`}
          probabilityLevels={probabilityLevels}
          impactLevels={getCustomImpactLevels(selectedDimension, factor.trim())}
          assessment={getAssessment(risk.id, selectedDimension, index)}
          onUpdate={(probability, impact) =>
            onUpdate(
              risk.id,
              factor.trim(),
              selectedDimension,
              probability,
              impact,
              index
            )
          }
        />
      ))}
    </>
  );
};

export default function RiskAssessmentView({ detail, onSave }: Props) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const {
    assessments,
    updateAssessment,
    getProbabilityLevels,
    getProcessObjectives,
    getAssessment,
    assessmentStats,
    hasAssessments,
    forceSave,
  } = useRiskAssessment(detail.id);

  // จัดกลุ่มปัจจัยเสี่ยงตามกระบวนงาน
  const processGroups = useMemo(() => {
    const groups: Record<string, AuditActivityRisk[]> = {};
    detail.AuditActivityRisks.forEach((risk) => {
      const process = risk.processes || "other";
      if (!groups[process]) groups[process] = [];
      groups[process].push(risk);
    });
    return groups;
  }, [detail.AuditActivityRisks]);

  // จัดกลุ่มปัจจัยเสี่ยงตามด้าน

  const [activeTab, setActiveTab] = useState<string>("");
  const [selectedDimension, setSelectedDimension] = useState<string>("");

  // เซ็ตค่าเริ่มต้นสำหรับแท็บ
  React.useEffect(() => {
    const processKeys = Object.keys(processGroups);

    if (processKeys.length > 0 && !activeTab) {
      setActiveTab(processKeys[0]);
      // เซ็ตด้านแรกของกระบวนงานแรก
      const firstProcess = processGroups[processKeys[0]];
      if (firstProcess && firstProcess.length > 0) {
        const firstDimensions = firstProcess[0].risk_factors
          .split(",")
          .map((d) => d.trim());
        if (firstDimensions.length > 0) {
          setSelectedDimension(firstDimensions[0]);
        }
      }
    }
  }, [processGroups, activeTab]);

  // เซ็ตด้านแรกเมื่อเปลี่ยนกระบวนงาน
  React.useEffect(() => {
    if (activeTab && processGroups[activeTab]) {
      const allDimensions = processGroups[activeTab].flatMap((risk) =>
        risk.risk_factors.split(",").map((d) => d.trim())
      );
      const dimensionsInProcess = [...new Set(allDimensions)];
      if (dimensionsInProcess.length > 0) {
        console.log(
          `[RiskAssessmentView] Setting selectedDimension to: ${dimensionsInProcess[0]} for process: ${activeTab}`
        );
        setSelectedDimension(dimensionsInProcess[0]);
      }
    }
  }, [activeTab, processGroups]);

  // Debug เมื่อเปลี่ยน dimension
  React.useEffect(() => {
    console.log(
      `[RiskAssessmentView] Selected dimension changed to: ${selectedDimension}`
    );
  }, [selectedDimension]);

  const handleAssessmentUpdate = (
    factorId: number,
    factorText: string,
    dimension: string,
    probability: number,
    impact: number,
    subFactorIndex?: number
  ) => {
    console.log(
      `[handleAssessmentUpdate] Factor ID: ${factorId}, Dimension: ${dimension}, SubIndex: ${subFactorIndex}, Probability: ${probability}, Impact: ${impact}`
    );
    console.log(
      `[handleAssessmentUpdate] Factor Text: "${factorText.substring(
        0,
        50
      )}..."`
    );

    // บันทึกทุกการประเมิน (แม้จะเป็น 0) เพื่อเก็บ state
    updateAssessment(
      factorId,
      factorText,
      dimension,
      probability,
      impact,
      subFactorIndex
    );
    console.log(
      `[handleAssessmentUpdate] Assessment updated: ${probability}x${impact}=${
        probability * impact
      }`
    );
  };

  // จัดการการนำทางไปหน้าผลการประเมิน
  const handleNavigateToResults = async () => {
    setIsNavigating(true);
    try {
      if (!hasAssessments()) {
        alert(
          "กรุณาทำการประเมินความเสี่ยงอย่างน้อย 1 รายการก่อนดูผลการประเมิน"
        );
        setIsNavigating(false);
        return;
      }
      
      // บังคับบันทึกข้อมูลก่อนไปหน้า results
      forceSave();
      
      // เพิ่ม delay เล็กน้อยเพื่อให้เห็น loading
      await new Promise(resolve => setTimeout(resolve, 500));
      await router.push(`/audit-program-risk-evaluation/${detail.id}/results`);
    } catch (error) {
      console.error('Navigation error:', error);
      setIsNavigating(false);
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(assessments);
    } else {
      // บันทึกการประเมินลง localStorage สำหรับใช้ใน results page
      console.log("Saving assessments to localStorage:", assessments);
      localStorage.setItem(
        `risk-assessments-${detail.id}`,
        JSON.stringify(assessments)
      );
      console.log("Assessments saved successfully");

      // แสดงข้อความแจ้งเตือนแล้ว redirect
      alert("บันทึกการประเมินความเสี่ยงเรียบร้อยแล้ว");

      // ใช้ setTimeout เพื่อให้ alert แสดงก่อน แล้วค่อย redirect
      setTimeout(() => {
        router.push(`/audit-program-risk-evaluation/${detail.id}/results`);
      }, 100);
    }
  };

  const deptText = detail.auditTopics.departments
    .map((d) => d.departmentName)
    .join(" / ");

  return (
    <div className="px-6 py-4 relative">
      {/* Loading Overlay */}
      {isNavigating && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-xl border border-gray-200 min-w-[200px] text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-blue-600" />
            <p className="text-sm font-medium text-gray-900 mb-1">กำลังโหลด</p>
            <p className="text-xs text-gray-500">กำลังเตรียมผลการประเมิน...</p>
          </div>
        </div>
      )}

      {/* breadcrumb */}
      <div className="mb-3">
        <Link
          href={`/audit-program-risk-evaluation/${detail.id}`}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="h-4 w-4" />
          กลับ
        </Link>
      </div>

      {/* Header card */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h1 className="text-lg font-semibold text-gray-900 leading-snug">
                {detail.auditTopics.auditTopic}
              </h1>
              <div className="text-sm text-gray-600">
                หน่วยงาน: <span className="text-gray-800">{deptText}</span>
              </div>
              <div className="text-sm">
                สถานะ:{" "}
                <span className="text-blue-600">กำลังประเมินความเสี่ยง</span>
              </div>
            </div>
          </div>
        </div>

        {/* steps tabs */}
        <div className="border-t border-gray-100">
          {/* Stepper */}
          <div className="flex items-center px-5 py-3">
            {[
              { n: 1, t: "เลือกปัจจัยเสี่ยง" },
              { n: 2, t: "ประเมินความเสี่ยง" },
              { n: 3, t: "ผลการประเมิน" },
            ].map((s, i) => {
              const currentStep = 2; // ขั้นตอนที่ active ตอนนี้
              const active = s.n === currentStep;

              return (
                <React.Fragment key={s.n}>
                  {/* เส้นคั่นระหว่างสเต็ป */}
                  {i > 0 && <span className="mx-3 h-px flex-1 bg-gray-200" />}

                  <div className="flex items-center gap-2">
                    {/* วงกลมตัวเลข */}
                    <div
                      className={[
                        "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                        active
                          ? "bg-[#3E52B9] text-white"
                          : "bg-gray-200 text-gray-700",
                      ].join(" ")}
                    >
                      {s.n}
                    </div>

                    {/* ข้อความ */}
                    <span
                      className={`text-sm ${
                        active ? "text-[#3E52B9]" : "text-gray-700"
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

      {/* Assessment Content */}
      <div className="mt-4 space-y-4">
        {/* Process Tabs */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">ประเมินความเสี่ยง</CardTitle>
              {assessmentStats.total > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <AlertTriangle className="h-4 w-4" />
                  คะแนนเฉลี่ย: {assessmentStats.averageScore}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {/* Main Process Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
              {Object.keys(processGroups).map((process) => (
                <Button
                  key={process}
                  variant={activeTab === process ? "default" : "outline"}
                  onClick={() => setActiveTab(process)}
                  className={`whitespace-nowrap ${
                    activeTab === process
                      ? "bg-[#3E52B9] hover:bg-[#2f3e8a] text-white"
                      : ""
                  }`}
                >
                  {processLabels[process] || process}
                </Button>
              ))}
            </div>

            {/* Selected Process Content */}
            {Object.keys(processGroups).map(
              (process) =>
                activeTab === process && (
                  <div key={process} className="space-y-4">
                    {/* Process Objectives */}
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">
                        วัตถุประสงค์
                      </h4>
                      <ul className="space-y-1 text-sm text-blue-700">
                        {getProcessObjectives(process).map((objective, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-blue-600 mt-1">•</span>
                            <span>{objective}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Dimension Sub-tabs for this process */}
                    {(() => {
                      // รองรับหลายด้านจาก comma-separated string
                      const allDimensions = processGroups[process].flatMap(
                        (risk) =>
                          risk.risk_factors.split(",").map((d) => d.trim())
                      );
                      const dimensionsInProcess = [...new Set(allDimensions)];
                      return (
                        <div className="space-y-4">
                          <div className="flex gap-2 flex-wrap">
                            {dimensionsInProcess.map((dimension) => (
                              <Button
                                key={dimension}
                                variant="ghost" // ใช้ ghost ให้ปุ่มโปร่งใส
                                onClick={() => {
                                  console.log(
                                    `[RiskAssessmentView] Dimension button clicked: ${selectedDimension} -> ${dimension}`
                                  );
                                  setSelectedDimension(dimension);
                                }}
                                size="sm"
                                className={`text-sm rounded-none ${
                                  selectedDimension === dimension
                                    ? "border-b-2 border-[#3E52B9] text-[#3E52B9]"
                                    : "text-gray-600 hover:text-[#3E52B9]"
                                }`}
                                title={`เปลี่ยนไปด้าน: ${
                                  dimensionLabels[dimension] || dimension
                                }`}
                              >
                                {dimensionLabels[dimension] || dimension}
                              </Button>
                            ))}
                          </div>

                          {/* Risk factors for selected dimension in this process */}
                          {selectedDimension && (
                            <div className="space-y-3">
                              <h4 className="font-medium text-gray-900">
                                ความเสี่ยงและปัจจัยเสี่ยง
                              </h4>

                              <div className="rounded-xl border border-gray-200 overflow-hidden">
                                {/* Header row */}
                                {/* Header row (2 ชั้น) */}
                                <div
                                  className="
    hidden md:grid items-center px-4 py-2 bg-gray-50 text-xs text-gray-600
    [grid-template-columns:1fr_120px_120px_56px_120px_72px]
    gap-x-3 md:gap-x-4
  "
                                >
                                  {/* แถวบน: กลุ่มหัวข้อรวม */}
                                  <div /> {/* ช่องว่างคอลัมน์ซ้าย */}
                                  <div className="col-start-2 col-span-4 text-center font-semibold">
                                    การประเมินความเสี่ยงระดับกิจกรรม
                                  </div>
                                  <div /> {/* ช่องว่างคอลัมน์ขวา */}
                                  {/* แถวล่าง: หัวคอลัมน์ย่อย */}
                                  <div className="pr-4 mt-1">
                                    ความเสี่ยงและปัจจัยเสี่ยง
                                  </div>
                                  <div className="text-center mt-1">โอกาส</div>
                                  <div className="text-center mt-1">
                                    ผลกระทบ
                                  </div>
                                  <div className="text-center mt-1">คะแนน</div>
                                  <div className="text-center mt-1">
                                    ระดับความเสี่ยง
                                  </div>
                                  <div className="text-center mt-1">
                                    ลำดับความเสี่ยง
                                  </div>
                                </div>

                                {/* Rows */}
                                <div className="divide-y divide-gray-200">
                                  {processGroups[process]
                                    .filter((risk) =>
                                      risk.risk_factors
                                        .split(",")
                                        .map((d) => d.trim())
                                        .includes(selectedDimension)
                                    )
                                    .map((risk) => (
                                      <RiskAssessmentForm
                                        key={risk.id}
                                        risk={risk}
                                        selectedDimension={selectedDimension}
                                        probabilityLevels={getProbabilityLevels(
                                          selectedDimension
                                        )}
                                        impactLevels={getCustomImpactLevels(
                                          selectedDimension,
                                          risk.object
                                        )}
                                        getAssessment={getAssessment}
                                        onUpdate={handleAssessmentUpdate}
                                      />
                                    ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )
            )}
          </CardContent>
        </Card>
        {/* Action Buttons */}
        <div className="flex justify-between gap-3">
          <div className="flex gap-2">
            {/* Debug: Clear Assessment Data */}
            <Button
              variant="outline"
              onClick={() => {
                if (
                  confirm(
                    "ต้องการล้างข้อมูลการประเมินทั้งหมดเพื่อเริ่มทดสอบใหม่หรือไม่?"
                  )
                ) {
                  localStorage.removeItem(`risk-assessments-${detail.id}`);
                  window.location.reload();
                }
              }}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              🗑️ ล้างข้อมูลทดสอบ
            </Button>
            {/* Debug: Show Assessment Count */}
            <Button
              variant="outline"
              onClick={() => {
                alert(
                  `ข้อมูลการประเมินปัจจุบัน: ${
                    assessments.length
                  } รายการ\n\nรายละเอียด:\n${assessments
                    .map(
                      (a) =>
                        `- Factor ${a.factorId} (${a.dimension}): ${a.probability}x${a.impact}=${a.riskScore}`
                    )
                    .join("\n")}`
                );
              }}
            >
              📊 ดูข้อมูลการประเมิน ({assessments.length})
            </Button>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-green-700 active:bg-green-800"
            >
              <Save className="h-4 w-4" />
              บันทึกและดูผลการประเมิน
            </Button>
            <Button
              onClick={handleNavigateToResults}
              disabled={isNavigating}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isNavigating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  กำลังโหลด...
                </>
              ) : (
                "ดูผลการประเมิน"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
