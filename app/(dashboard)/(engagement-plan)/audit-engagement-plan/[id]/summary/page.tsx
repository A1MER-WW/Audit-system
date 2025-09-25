"use client";

import React from "react";
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
import { useEngagementPlan } from "../../../../../../hooks/useEngagementPlan";
import TestDataLoader from "../test-data-loader";

export default function SummaryPage() {
  const params = useParams();
  const id = params?.id as string;
  const { state } = useEngagementPlan();

  // Debug: ตรวจสอบข้อมูลใน context
  console.log("Context state:", state);

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
      auditBudget:
        "งบประมาณประมาณ 50,000 บาท สำหรับค่าเดินทาง ค่าวัสดุอุปกรณ์ และค่าใช้จ่ายในการเก็บรวบรวมข้อมูล", // Mock data for now
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

  const getRiskBadge = (level: string) => {
    const colors = {
      สูง: "bg-red-100 text-red-700 border-red-200",
      กลาง: "bg-yellow-100 text-yellow-700 border-yellow-200",
      ต่ำ: "bg-green-100 text-green-700 border-green-200",
    };
    return (
      <Badge
        className={
          colors[level as keyof typeof colors] || "bg-gray-100 text-gray-700"
        }
      >
        {level}
      </Badge>
    );
  };

  return (
    <div className="px-6 py-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Link href="/audit-engagement-plan" className="hover:text-blue-600">
            การจัดทำ Audit Program / แผนการปฏิบัติงาน (Engagement plan)
          </Link>
          <span>/</span>
          <Link
            href={`/audit-engagement-plan/${id}`}
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
              สรุปผลแผนการปฏิบัติงานตรวจสอบ (Audit Program)
            </h1>
            <div className="text-gray-600">{mockEngagementPlan.title}</div>
            <div className="text-sm text-gray-500 mt-1">
              ปีงบประมาณ พ.ศ. {mockEngagementPlan.fiscalYear} •{" "}
              {mockEngagementPlan.department}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              ดาวน์โหลด PDF
            </Button>
            <Button variant="outline" size="sm">
              <Share className="h-4 w-4 mr-2" />
              แชร์
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Edit className="h-4 w-4 mr-2" />
              แก้ไข
            </Button>
          </div>
        </div>
      </div>

      {/* เนื้อหาหลัก - รายงานแบบยาวต่อเนื่อง */}
      <div className="space-y-8">
        {/* ขั้นตอนที่ 1: การประเมินความเสี่ยงระดับกิจกรรม */}
        <Card>
          <CardContent className="space-y-3">
            <div className="text-2xl font-medium text-gray-600">
              {mockEngagementPlan.title} ประจำปีงบประมาณ พ.ศ.{" "}
              {mockEngagementPlan.fiscalYear}
            </div>

            <div>
              <h4 className="font-medium text-gray-900 flex items-center ">
                การประเมินความเสี่ยง
              </h4>
              <div className="bg-gradient-to-r rounded-xl pl-4 pt-2">
                <p className="text-gray-800 leading-relaxed">
                  {summaryData.step1.description}
                </p>
              </div>
            </div>

            <div className="pt-3">
              {summaryData.step1.selectedActivities.length > 0 ? (
                <div className="overflow-x-auto">
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
              สำหรับรายละเอียดผลการประเมินความเสี่ยงของเรื่อง/กิจกรรม/กระบวนงาน/งานภาพรวม ปรากฎตามเอกสารแนบ แบบ WP
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
          </CardContent>
          <CardContent className="space-y-6 pt-3">
            {summaryData.step3.auditPrograms.length > 0 ? (
              <div className="w-full">
                <Table
                  className="table-fixed w-full border-collapse"
                  style={{
                    tableLayout: "fixed",
                    width: "100%",
                  }}
                >
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
                            <div className="text-sm text-blue-600 font-medium text-left leading-relaxed break-words whitespace-normal">
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

              <div className="w-full">
                <Table
                  className="table-fixed w-full border-collapse"
                  style={{
                    tableLayout: "fixed",
                    width: "100%",
                  }}
                >
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
                        <div className="text-sm text-blue-600 font-medium text-left leading-relaxed break-words whitespace-normal">
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

      {/* Footer Actions */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t">
        <Link href={`/audit-engagement-plan/${id}/step-4-audit-reporting`}>
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            กลับไปขั้นตอนที่ 4
          </Button>
        </Link>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            ส่งกลับเพื่อแก้ไข
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <CheckCircle className="h-4 w-4 mr-2" />
            อนุมัติแผนการปฏิบัติงาน
          </Button>
        </div>
      </div>
    </div>
  );
}
