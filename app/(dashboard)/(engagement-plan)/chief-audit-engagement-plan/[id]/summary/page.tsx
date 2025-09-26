"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  CheckCircle,
  Download,
  Share,
  Edit,
  Target,
  List,
  Users,
  Calendar,
  AlertTriangle,
  BookOpen,
  BarChart3,
  MessageSquare,
  Database,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../../../components/ui/card";
import { Button } from "../../../../../../components/ui/button";
import { Badge } from "../../../../../../components/ui/badge";
import { Separator } from "../../../../../../components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../../../components/ui/table";
import { getProgram } from "../../../../../../lib/mock-engagement-plan-programs";
import { useEngagementPlan as useEngagementPlanContext } from "../../../../../../contexts/EngagementPlanContext";
import { EngagementPlanProvider, useEngagementPlan } from "../../../../../../hooks/useEngagementPlan";
import { ApprovalDialog } from "../../../../../../components/features/popup/approval-dialog";
import { SignatureSelectionDialog } from "../../../../../../components/signature-selection-dialog";

// Component สำหรับแสดงเนื้อหาจริง
function SummaryPageContent() {
  const params = useParams();
  const id = params?.id as string;
  const { state } = useEngagementPlan();

  // States for approval dialog
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showSignatureDialog, setShowSignatureDialog] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [comment, setComment] = useState("");
  
  // States for signature process
  const [approvalStep, setApprovalStep] = useState(1);
  const [signatureChoice, setSignatureChoice] = useState<'new' | 'saved' | null>(null);
  const [signatureData, setSignatureData] = useState({
    name: 'ผู้อนุมัติ',
    signature: null as string | null
  });
  const [otpValue, setOtpValue] = useState('');
  const isOtpValid = otpValue === '123456';

  // Debug: ตรวจสอบข้อมูลใน context
  console.log("Chief audit - Context state:", state);

  // ดึงข้อมูลจาก engagement plan จริง
  const engagementPlan = getProgram(parseInt(id));

  const mockEngagementPlan = engagementPlan
    ? {
        title: engagementPlan.auditTopics.auditTopic,
        fiscalYear: engagementPlan.fiscalYear.toString(),
        department: engagementPlan.auditTopics.departments
          .map((d: any) => d.departmentName)
          .join(", "),
        status:
          engagementPlan.status === "AUDITOR_ASSESSING"
            ? "กำลังดำเนินการประเมิน"
            : engagementPlan.status === "PENDING"
            ? "รอดำเนินการ"
            : engagementPlan.status === "COMPLETED"
            ? "เสร็จสิ้น"
            : engagementPlan.status,
      }
    : {
        title: "ไม่พบข้อมูลแผนการปฏิบัติงาน",
        fiscalYear: "2568",
        department: "ไม่ระบุ",
        status: "ไม่ระบุ",
      };

  // ดึงข้อมูลจริงจาก context state ที่กรอกไว้ในแต่ละ step
  const summaryData = {
    step1: {
      basicInfo: {
        auditedUnit: state.step1?.basicInfo?.auditedUnit || "ไม่ได้ระบุ",
        auditCategory: state.step1?.basicInfo?.auditCategory || "ไม่ได้ระบุ",
        preparer: state.step1?.basicInfo?.preparer || "ไม่ได้ระบุ",
        reviewer: state.step1?.basicInfo?.reviewer || "ไม่ได้ระบุ",
        approver: state.step1?.basicInfo?.approver || "ไม่ได้ระบุ",
      },
      description: state.step1?.description || "ยังไม่ได้กรอกคำอธิบาย",
      selectedActivities: state.step1?.selectedActivities || [],
    },
    step2: {
      auditIssues: state.step2?.auditIssues || "ยังไม่ได้กรอกประเด็นการตรวจสอบ",
      objectives: state.step2?.objectives || [],
      scopes: state.step2?.scopes || [],
      auditDuration: state.step2?.auditDuration || "ไม่ได้ระบุ",
      auditMethodology: state.step2?.auditMethodology || "ไม่ได้ระบุ",
      auditBudget: state.step2?.auditBudget || "ไม่ได้ระบุ",
      auditResponsible: state.step2?.auditResponsible || "ไม่ได้ระบุ",
      supervisor: state.step2?.supervisor || "ไม่ได้ระบุ",
    },
    step3: {
      auditPrograms: state.step3?.auditPrograms || [],
    },
    step4: {
      reportingObjective: state.step4?.reportingObjective || "ไม่ได้ระบุ",
      reportingMethod: state.step4?.reportingMethod || "ไม่ได้ระบุ",
      analysisMethod: state.step4?.analysisMethod || "ไม่ได้ระบุ",
      dataStorage: state.step4?.dataStorage || "ไม่ได้ระบุ",
      dataSources: state.step4?.dataSources || "ไม่ได้ระบุ",
      responsible: state.step4?.responsible || "ไม่ได้ระบุ",
      remarks: state.step4?.remarks || "ไม่มีหมายเหตุ",
    },
  };

  const steps = [
    {
      id: 1,
      title: "การประเมินความเสี่ยงระดับกิจกรรม",
      status: "completed",
      icon: <AlertTriangle className="h-5 w-5" />,
    },
    {
      id: 2,
      title: "แผนการปฏิบัติงาน (Engagement Plan)",
      status: "completed",
      icon: <Target className="h-5 w-5" />,
    },
    {
      id: 3,
      title: "Audit Program",
      status: "completed",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      id: 4,
      title: "การรายงานผลการตรวจสอบ",
      status: "completed",
      icon: <BarChart3 className="h-5 w-5" />,
    },
  ];

  const getRiskBadge = (level: string) => (
    <Badge className="bg-transparent border-0 shadow-none hover:bg-transparent text-gray-900">
      {level}
    </Badge>
  );

  // Handler functions for approval process
  const handleApproval = async () => {
    setIsApproving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setShowApprovalDialog(false);
    setShowSignatureDialog(true);
    setApprovalStep(1);
    setIsApproving(false);
  };

  const handleSignatureSubmit = async () => {
    console.log("Submitting signature with data:", {
      signatureData,
      comment,
      otpValue,
    });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Reset states
    setShowSignatureDialog(false);
    setComment("");
    setApprovalStep(1);
    setSignatureChoice(null);
    setSignatureData({ name: "ผู้อนุมัติ", signature: null });
    setOtpValue("");

    // Show success message
    alert("อนุมัติแผนการปฏิบัติงานตรวจสอบเรียบร้อยแล้ว");
  };

  return (
    <div className="px-6 py-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Link
            href="/chief-audit-engagement-plan"
            className="hover:text-blue-600"
          >
            การจัดทำ Audit Program / แผนการปฏิบัติงาน (Engagement plan)
          </Link>
          <span>/</span>
          <Link
            href={`/chief-audit-engagement-plan/${id}`}
            className="hover:text-blue-600"
          >
            แผนการปฏิบัติงานตรวจสอบ #{id}
          </Link>
          <span>/</span>
          <span>สรุปผลการดำเนินงาน</span>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              แผนการปฏิบัติงานตรวจสอบ (Audit Program)
            </h1>
            <div className="text-sm text-gray-500 mt-1">
              ปีงบประมาณ พ.ศ. {mockEngagementPlan.fiscalYear} •{" "}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {mockEngagementPlan.department}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              สถานะ: ผู้ตรวจสอบภายในดำเนินการจัดทำแผนการปฏิบัติงานตรวจสอบ
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              className="bg-[#3E52B9] hover:bg-[#2A3A8F] text-white"
              onClick={() => setShowApprovalDialog(true)}
              disabled={isApproving}
            >
              พิจารณาอนุมัติ
            </Button>
          </div>
        </div>
      </div>

      {/* เนื้อหาหลัก - รายงานแบบยาวต่อเนื่อง */}
      <div className="space-y-8">
        {/* ขั้นตอนที่ 1: การประเมินความเสี่ยงระดับกิจกรรม */}
        <Card>
          <CardContent className="space-y-3">
            <div className="text-2xl font-semibold text-gray-900">
              แผนการปฏิบัติงานตรวจสอบ
            </div>
            <div className="text-2xl font-semibold text-gray-900">
              {mockEngagementPlan.title} ประจำปีงบประมาณ พ.ศ.{" "}
              {mockEngagementPlan.fiscalYear}
            </div>
            <div className="text-2xl font-medium text-gray-900">
              {mockEngagementPlan.department}
            </div>

            <div>
              <h4 className="font-medium text-gray-900 flex items-center ">
                เรื่องที่ตรวจสอบ: {mockEngagementPlan.title}
              </h4>
              <h4 className="font-medium text-gray-900 flex items-center ">
                หน่วยรับตรวจ: {mockEngagementPlan.department}
              </h4>
              <h4 className="font-medium text-gray-900 flex items-center ">
                ประเภทของการตรวจ: การปฏิบัติตามกฎระเบียบ (Compliance Audit)
              </h4>

              <div className="bg-gradient-to-r rounded-xl pl-4 pt-2">
                <p className="text-gray-800 leading-relaxed">
                  {summaryData.step1.description}
                </p>
              </div>
            </div>
            <div className="pt-8 pb-8">
              {summaryData.step1.selectedActivities.length > 0 ? (
                <div className="overflow-x-auto border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-center w-16 py-4">
                          ลำดับ
                        </TableHead>
                        <TableHead className="text-center py-4">
                          กิจกรรม/เรื่อง
                        </TableHead>
                        <TableHead className="text-center py-4">
                          ความเสี่ยงด้าน
                        </TableHead>
                        <TableHead className="text-center py-4">
                          ระดับความเสี่ยง
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {summaryData.step1.selectedActivities.map(
                        (activity: any, index: number) => (
                          <TableRow key={activity.id || index}>
                            <TableCell className="text-center">
                              {index + 1}
                            </TableCell>
                            <TableCell className="max-w-md">
                              {activity.activity ||
                                activity.name ||
                                "ไม่ได้ระบุกิจกรรม"}
                            </TableCell>
                            <TableCell className="text-center">
                              {activity.riskDescription ||
                                activity.description ||
                                "ไม่ได้ระบุคำอธิบาย"}
                            </TableCell>
                            <TableCell className="text-center">
                              {getRiskBadge(
                                activity.riskLevel || activity.risk || "ไม่ระบุ"
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p>ยังไม่ได้เลือกกิจกรรมสำหรับการตรวจสอบ</p>
                  <p className="text-sm mt-1">กรุณากรอกข้อมูลในขั้นตอนที่ 1</p>
                </div>
              )}
            </div>
            <h4 className="font-medium text-gray-900 flex items-center">
              สำหรับรายละเอียดผลการประเมินความเสี่ยงของเรื่อง/กิจกรรม/กระบวนงาน/งานภาพรวม
              ปรากฎตามเอกสารแนบ แบบ WP
            </h4>
            <h4 className="font-medium text-gray-900 flex items-center">
              ประเด็นการตรวจสอบ
            </h4>
            <div className="pl-4">
              <p className="text-gray-800 leading-relaxed">
                {summaryData.step2.auditIssues}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 flex items-center ">
                วัตถุประสงค์การตรวจสอบ
              </h4>
              {summaryData.step2.objectives.length > 0 ? (
                <div className="pl-4  pt-2">
                  <div className="space-y-4">
                    {summaryData.step2.objectives.map(
                      (objective: string, index: number) => (
                        <div key={index} className="flex items-start gap-1">
                          <span className="text-gray-900 font-medium w-4 flex-shrink-0">
                            {index + 1})
                          </span>
                          <div className="flex-1">
                            <p className="text-gray-800 leading-relaxed font-medium">
                              {objective}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl">
                  <Target className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p className="font-medium">
                    ยังไม่ได้กำหนดวัตถุประสงค์การตรวจสอบ
                  </p>
                  <p className="text-sm mt-2">กรุณากรอกข้อมูลในขั้นตอนที่ 2</p>
                </div>
              )}
            </div>
            <div>
              <h4 className="font-medium text-gray-900 flex items-center">
                ขอบเขตการตรวจสอบ
              </h4>
              {summaryData.step2.scopes.length > 0 ? (
                <div className="space-y-4">
                  {summaryData.step2.scopes.map((scope: any, index: number) => (
                    <div key={scope.id || index} className="pt-2 pl-4">
                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">
                          {scope.text || scope.name || "ไม่ได้ระบุขอบเขต"}
                        </h5>
                        {scope.subScopes && scope.subScopes.length > 0 && (
                          <div className="space-y-2 ml-4">
                            {scope.subScopes.map(
                              (subScope: any, subIndex: number) => (
                                <div
                                  key={subScope.id || subIndex}
                                  className="flex items-start gap-3"
                                >
                                  <span className="font-medium text-gray-900 font-medium w-6 flex-shrink-0">
                                    {subIndex + 1})
                                  </span>
                                  <span className="font-medium text-gray-900 leading-relaxed">
                                    {subScope.text ||
                                      subScope.name ||
                                      "ไม่ได้ระบุ"}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl">
                  <List className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p className="font-medium">ยังไม่ได้กำหนดขอบเขตการตรวจสอบ</p>
                  <p className="text-sm mt-2">กรุณากรอกข้อมูลในขั้นตอนที่ 2</p>
                </div>
              )}
            </div>
            <div className="pt-2 pl-3">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div>
                    <span className="font-medium text-gray-900">
                      ระยะเวลาการตรวจสอบ: {summaryData.step2.auditDuration}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div>
                    <span className="font-medium text-gray-900">
                      วิธีการตรวจสอบ: {summaryData.step2.auditMethodology}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div>
                    <span className="font-medium text-gray-900">
                      ผู้รับผิดชอบในการตรวจสอบ:{" "}
                      {summaryData.step2.auditResponsible}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div>
                    <span className="font-medium text-gray-900">
                      ภายใต้การกำกับและควบคุมของ: {summaryData.step2.supervisor}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div className="text-2xl font-semibold text-gray-900">
              แนวการปฏิบัติงานตรวจสอบ (Audit Program)
            </div>
            <div className="text-2xl font-semibold text-gray-900">
              {mockEngagementPlan.title}
            </div>
            <div className="text-2xl font-medium text-gray-900">
              {mockEngagementPlan.department}
            </div>
            <hr />
            <h4 className="font-medium text-gray-900 flex items-center">
              ขั้นตอนการดำเนินงานที่สำคัญ
            </h4>
            <div className="pl-4">
              <div>
                <span className="font-medium text-gray-900">
                  1 ) การดำเนินการสอบทานเอกสาร หลักฐานการเงินและบัญชีของกองทุน
                  FTA ซึ่งจะต้องแจ้งหนังสือเปิดการตรวจสอบ
                  เพื่อนัดหมายการประชุมเปิดการตรวจสอบชี้แจงวัตถุประสงค์
                  การตรวจสอบ ขอบเขตการตรวจสอบ ระยะเวลา ทรัพยากร
                  และให้หน่วยรับตรวจ นำเสนอผลการดำเนินงาน เพื่อให้เกิดการสื่อสาร
                  การสร้างความเข้าใจสอดคล้องตรงกันระหว่าง
                  หน่วยรับตรวจและผู้ตรวจสอบภายใน
                  โดยให้ผู้ตรวจสอบภายในจัดทำบันทึกช่วยจำเป็นหลักฐานการประกอบการประชุมเปิดการตรวจสอบและแจ้งต่อหน่วยรับตรวจเพื่อทราบด้วย
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-900">
                  2 ) ภายหลังจากการตรวจสอบตามวัตถุประสงค์
                  ให้รวบรวมข้อมูลเพื่อนำไปวิเคราะห์หาสาเหตุที่แท้จริง
                  ผลกระทบที่อาจจะเกิดขึ้น
                  เพื่อให้ข้อเสนอแนะหรือมาตรการป้องกันให้สอดคล้อง กับข้อตรวจสอบ
                  เพื่อปรับปรุง/พัฒนา กระบวนการควบคุมภายใน
                  การบริหารความเสี่ยงของหน่วยรับตรวจ
                  และนำข้อสรุปไปจัดทำร่างรายงานผลการตรวจสอบเบื้องต้น เพื่อนัด
                  ประชุมหารือ
                  ทำความเข้าใจร่วมกันระหว่างผู้ตรวจสอบภายในและหน่วยรับตรวจ
                </span>
              </div>
            </div>
          </CardContent>
          <CardContent className="space-y-6 pt-3">
            {summaryData.step3.auditPrograms.length > 0 ? (
              <div className="w-full border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center w-16 py-4 font-medium">
                        ลำดับ
                      </TableHead>
                      <TableHead className="text-left py-4 px-4 font-medium w-[18%]">
                        วัตถุประสงค์การตรวจสอบ
                      </TableHead>
                      <TableHead className="text-left py-4 px-4 font-medium w-[16%]">
                        วิธีการเพื่อให้ได้มาซึ่งข้อมูล
                      </TableHead>
                      <TableHead className="text-left py-4 px-4 font-medium w-[16%]">
                        การวิเคราะห์/ประเมินผล
                      </TableHead>
                      <TableHead className="text-left py-4 px-4 font-medium w-[14%]">
                        การจัดเก็บข้อมูล
                      </TableHead>
                      <TableHead className="text-left py-4 px-4 font-medium w-[16%]">
                        แหล่งข้อมูล/เอกสาร
                      </TableHead>
                      <TableHead className="text-left py-4 px-4 font-medium w-[14%]">
                        ผู้รับผิดชอบ
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {summaryData.step3.auditPrograms.map(
                      (program: any, index: number) => (
                        <TableRow key={index} className="align-top">
                          <TableCell className="text-center font-medium align-top py-4">
                            {index + 1}
                          </TableCell>
                          <TableCell className="p-4 align-top">
                            <div className="font-medium text-gray-900 text-left leading-relaxed break-words whitespace-normal">
                              {program.objective || "ไม่ได้ระบุวัตถุประสงค์"}
                            </div>
                          </TableCell>
                          <TableCell className="p-4 align-top">
                            <div className="text-sm text-gray-700 text-left leading-relaxed break-words whitespace-normal">
                              {program.method || "ไม่ได้ระบุ"}
                            </div>
                          </TableCell>
                          <TableCell className="p-4 align-top">
                            <div className="text-sm text-gray-700 text-left leading-relaxed break-words whitespace-normal">
                              {program.analysis || "ไม่ได้ระบุ"}
                            </div>
                          </TableCell>
                          <TableCell className="p-4 align-top">
                            <div className="text-sm text-gray-700 text-left leading-relaxed break-words whitespace-normal">
                              {program.storage || "ไม่ได้ระบุ"}
                            </div>
                          </TableCell>
                          <TableCell className="p-4 align-top">
                            <div className="text-sm text-gray-700 text-left leading-relaxed break-words whitespace-normal">
                              {program.source || "ไม่ได้ระบุ"}
                            </div>
                          </TableCell>
                          <TableCell className="p-4 align-top">
                            <div className="text-sm text-gray-700 font-medium text-left leading-relaxed break-words whitespace-normal">
                              {program.responsible || "ไม่ได้ระบุ"}
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>ยังไม่ได้จัดทำ Audit Program</p>
                <p className="text-sm mt-1">กรุณากรอกข้อมูลในขั้นตอนที่ 3</p>
              </div>
            )}
          </CardContent>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">
                วิธีการสรุปผลการตรวจสอบและจัดทํารายงานผลการตรวจสอบ
              </h4>

              <div className="w-full border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-left py-4 px-4 font-medium w-[20%]">
                        วัตถุประสงค์
                      </TableHead>
                      <TableHead className="text-left py-4 px-4 font-medium w-[18%]">
                        วิธีการเพื่อให้ได้มาซึ่งข้อมูล
                      </TableHead>
                      <TableHead className="text-left py-4 px-4 font-medium w-[18%]">
                        การวิเคราะห์/ประเมินผล
                      </TableHead>
                      <TableHead className="text-left py-4 px-4 font-medium w-[16%]">
                        การจัดเก็บข้อมูล
                      </TableHead>
                      <TableHead className="text-left py-4 px-4 font-medium w-[16%]">
                        แหล่งข้อมูล/เอกสาร
                      </TableHead>
                      <TableHead className="text-left py-4 px-4 font-medium w-[12%]">
                        ผู้รับผิดชอบ
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="align-top">
                      <TableCell className="p-4 align-top">
                        <div className="text-sm text-gray-700 text-left leading-relaxed break-words whitespace-normal">
                          {summaryData.step4.reportingObjective}
                        </div>
                      </TableCell>
                      <TableCell className="p-4 align-top">
                        <div className="text-sm text-gray-700 text-left leading-relaxed break-words whitespace-normal">
                          {summaryData.step4.reportingMethod}
                        </div>
                      </TableCell>
                      <TableCell className="p-4 align-top">
                        <div className="text-sm text-gray-700 text-left leading-relaxed break-words whitespace-normal">
                          {summaryData.step4.analysisMethod}
                        </div>
                      </TableCell>
                      <TableCell className="p-4 align-top">
                        <div className="text-sm text-gray-700 text-left leading-relaxed break-words whitespace-normal">
                          {summaryData.step4.dataStorage}
                        </div>
                      </TableCell>
                      <TableCell className="p-4 align-top">
                        <div className="text-sm text-gray-700 text-left leading-relaxed break-words whitespace-normal">
                          {summaryData.step4.dataSources}
                        </div>
                      </TableCell>
                      <TableCell className="p-4 align-top">
                        <div className="text-sm text-gray-700 font-medium text-left leading-relaxed break-words whitespace-normal">
                          {summaryData.step4.responsible}
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* หมายเหตุ - แยกออกมาจากตาราง */}
              {summaryData.step4.remarks &&
                summaryData.step4.remarks !== "ไม่มีหมายเหตุ" && (
                  <div className="mt-4 p-4 rounded-lg">
                    <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      หมายเหตุ
                    </h5>
                    <p className="text-gray-800 leading-relaxed text-sm">
                      {summaryData.step4.remarks}
                    </p>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ApprovalDialog */}
      <ApprovalDialog
        open={showApprovalDialog}
        onOpenChange={setShowApprovalDialog}
        comment={comment}
        onCommentChange={setComment}
        onConfirm={handleApproval}
        loading={isApproving}
      />

      {/* SignatureSelectionDialog */}
      <SignatureSelectionDialog
        open={showSignatureDialog}
        onOpenChange={setShowSignatureDialog}
        approvalStep={approvalStep}
        signatureChoice={signatureChoice}
        signatureData={signatureData}
        otpValue={otpValue}
        isOtpValid={isOtpValid}
        loading={false}
        onSignatureChoice={setSignatureChoice}
        onSignatureDataChange={setSignatureData}
        onOTPChange={setOtpValue}
        onCancel={() => setShowSignatureDialog(false)}
        onConfirm={handleSignatureSubmit}
      />
    </div>
  );
}

// Component หลักที่มี Provider wrapping
export default function SummaryPage() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <EngagementPlanProvider planId={id}>
      <SummaryPageContent />
    </EngagementPlanProvider>
  );
}
