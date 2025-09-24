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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../../components/ui/card";
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
      objectives: state.step2?.objectives || [],
      scopes: state.step2?.scopes || [],
      auditDuration: state.step2?.auditDuration || "ไม่ได้ระบุ",
      auditMethodology: state.step2?.auditMethodology || "ไม่ได้ระบุ",
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
      <Badge className={colors[level as keyof typeof colors] || "bg-gray-100 text-gray-700"}>
        {level}
      </Badge>
    );
  };

  return (
    <div className="px-6 py-4">
      {/* Test Data Loader */}
      <TestDataLoader />
      
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Link href="/audit-engagement-plan" className="hover:text-blue-600">
            การจัดทำ Audit Program / แผนการปฏิบัติงาน (Engagement plan)
          </Link>
          <span>/</span>
          <Link href={`/audit-engagement-plan/${id}`} className="hover:text-blue-600">
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
            <div className="text-gray-600">
              {mockEngagementPlan.title}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              ปีงบประมาณ พ.ศ. {mockEngagementPlan.fiscalYear} • {mockEngagementPlan.department}
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

        {/* สถานะความสมบูรณ์ */}
        <Card className="mb-6 bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-900">
                  แผนการปฏิบัติงานตรวจสอบเสร็จสมบูรณ์
                </h3>
                <p className="text-sm text-green-700">
                  ได้ดำเนินการครบทุกขั้นตอนแล้ว พร้อมสำหรับการอนุมัติและดำเนินการต่อไป
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <List className="h-5 w-5" />
              ความคืบหน้าโดยรวม
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {steps.map((step) => (
                <div key={step.id} className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-green-600">{step.icon}</div>
                  <div>
                    <p className="text-sm font-medium text-green-900">ขั้นตอนที่ {step.id}</p>
                    <p className="text-xs text-green-700">เสร็จสิ้น</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* เนื้อหาหลัก - รายงานแบบยาวต่อเนื่อง */}
      <div className="space-y-8">
        
        {/* ข้อมูลพื้นฐานโครงการ */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-600" />
              ข้อมูลพื้นฐานโครงการ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600">หน่วยรับตรวจ</label>
                <p className="text-sm mt-1">{summaryData.step1.basicInfo.auditedUnit}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">ประเภทของการตรวจ</label>
                <p className="text-sm mt-1">{summaryData.step1.basicInfo.auditCategory}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">ระยะเวลาการตรวจสอบ</label>
                <p className="text-sm mt-1">{summaryData.step2.auditDuration}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">จำนวนวัตถุประสงค์</label>
                <p className="text-sm mt-1">{summaryData.step2.objectives.length} ข้อ</p>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            {/* ทีมงานที่เกี่ยวข้อง */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">ทีมงานที่เกี่ยวข้อง</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="p-2 bg-blue-100 rounded">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-blue-900">ผู้จัดทำ</p>
                    <p className="text-xs text-blue-600">{summaryData.step1.basicInfo.preparer}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <div className="p-2 bg-purple-100 rounded">
                    <Users className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-purple-900">ผู้สอบทาน</p>
                    <p className="text-xs text-purple-600">{summaryData.step1.basicInfo.reviewer}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="p-2 bg-green-100 rounded">
                    <Users className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-green-900">ผู้อนุมัติ</p>
                    <p className="text-xs text-green-600">{summaryData.step1.basicInfo.approver}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ขั้นตอนที่ 1: การประเมินความเสี่ยงระดับกิจกรรม */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              ขั้นตอนที่ 1: การประเมินความเสี่ยงระดับกิจกรรม
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">คำอธิบาย</h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                {summaryData.step1.description}
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-4">กิจกรรมที่เลือกสำหรับการตรวจสอบ</h4>
              {summaryData.step1.selectedActivities.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 border-0">
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
                      {summaryData.step1.selectedActivities.map((activity: any, index: number) => (
                        <TableRow key={activity.id || index}>
                          <TableCell className="text-center">
                            {index + 1}
                          </TableCell>
                          <TableCell className="max-w-md">
                            {activity.activity || activity.name || 'ไม่ได้ระบุกิจกรรม'}
                          </TableCell>
                          <TableCell className="text-center">
                            {activity.riskDescription || activity.description || 'ไม่ได้ระบุคำอธิบาย'}
                          </TableCell>
                          <TableCell className="text-center">
                            {getRiskBadge(activity.riskLevel || activity.risk || 'ไม่ระบุ')}
                          </TableCell>
                        </TableRow>
                      ))}
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

            {/* สรุปความเสี่ยงโดยรวม */}
            {summaryData.step1.selectedActivities.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-4">สรุปการประเมินความเสี่ยงโดยรวม</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="text-sm font-medium">ความเสี่ยงระดับสูง</span>
                    <Badge className="bg-red-100 text-red-700">
                      {summaryData.step1.selectedActivities.filter((a: any) => 
                        (a.riskLevel || a.risk) === 'สูง' || (a.riskLevel || a.risk) === 'high'
                      ).length} กิจกรรม
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                    <span className="text-sm font-medium">ความเสี่ยงระดับกลาง</span>
                    <Badge className="bg-yellow-100 text-yellow-700">
                      {summaryData.step1.selectedActivities.filter((a: any) => 
                        (a.riskLevel || a.risk) === 'กลาง' || (a.riskLevel || a.risk) === 'medium'
                      ).length} กิจกรรม
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium">ความเสี่ยงระดับต่ำ</span>
                    <Badge className="bg-green-100 text-green-700">
                      {summaryData.step1.selectedActivities.filter((a: any) => 
                        (a.riskLevel || a.risk) === 'ต่ำ' || (a.riskLevel || a.risk) === 'low'
                      ).length} กิจกรรม
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ขั้นตอนที่ 2: แผนการปฏิบัติงาน (Engagement Plan) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              ขั้นตอนที่ 2: แผนการปฏิบัติงาน (Engagement Plan)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* วัตถุประสงค์ */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">วัตถุประสงค์การตรวจสอบ</h4>
              {summaryData.step2.objectives.length > 0 ? (
                <div className="space-y-2">
                  {summaryData.step2.objectives.map((objective: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-blue-600 mt-1">{index + 1}.</span>
                      <span className="text-sm text-blue-900">{objective}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
                  <Target className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                  <p>ยังไม่ได้กำหนดวัตถุประสงค์การตรวจสอบ</p>
                  <p className="text-sm mt-1">กรุณากรอกข้อมูลในขั้นตอนที่ 2</p>
                </div>
              )}
            </div>

            {/* ขอบเขต */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">ขอบเขตการตรวจสอบ</h4>
              {summaryData.step2.scopes.length > 0 ? (
                <div className="space-y-4">
                  {summaryData.step2.scopes.map((scope: any, index: number) => (
                    <div key={scope.id || index} className="border rounded-lg p-4 bg-gray-50">
                      <h5 className="font-medium text-gray-900 mb-2">{scope.text || scope.name || 'ไม่ได้ระบุขอบเขต'}</h5>
                      {scope.subScopes && scope.subScopes.length > 0 && (
                        <div className="ml-4 space-y-1">
                          {scope.subScopes.map((subScope: any, subIndex: number) => (
                            <div key={subScope.id || subIndex} className="flex items-start gap-2">
                              <span className="text-xs text-gray-400 mt-1.5">•</span>
                              <span className="text-sm text-gray-600">{subScope.text || subScope.name || 'ไม่ได้ระบุ'}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
                  <List className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                  <p>ยังไม่ได้กำหนดขอบเขตการตรวจสอบ</p>
                  <p className="text-sm mt-1">กรุณากรอกข้อมูลในขั้นตอนที่ 2</p>
                </div>
              )}
            </div>

            {/* ข้อมูลอื่นๆ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-gray-900 mb-2">ระยะเวลาการตรวจสอบ</h5>
                <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                  {summaryData.step2.auditDuration}
                </p>
              </div>
              <div>
                <h5 className="font-medium text-gray-900 mb-2">วิธีการตรวจสอบ</h5>
                <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                  {summaryData.step2.auditMethodology}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-gray-900 mb-2">ผู้รับผิดชอบในการตรวจสอบ</h5>
                <p className="text-sm text-gray-600 p-3 bg-blue-50 rounded-lg">
                  {summaryData.step2.auditResponsible}
                </p>
              </div>
              <div>
                <h5 className="font-medium text-gray-900 mb-2">ภายใต้การกำกับและควบคุมของ</h5>
                <p className="text-sm text-gray-600 p-3 bg-blue-50 rounded-lg">
                  {summaryData.step2.supervisor}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ขั้นตอนที่ 3: Audit Program */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-purple-600" />
              ขั้นตอนที่ 3: Audit Program
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {summaryData.step3.auditPrograms.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 border-0">
                      <TableHead className="text-center w-16 py-4 font-semibold">
                        ลำดับ
                      </TableHead>
                      <TableHead className="text-left py-4 px-4 font-semibold min-w-[200px]">
                        วัตถุประสงค์การตรวจสอบ
                      </TableHead>
                      <TableHead className="text-left py-4 px-4 font-semibold min-w-[180px]">
                        วิธีการเพื่อให้ได้มาซึ่งข้อมูล
                      </TableHead>
                      <TableHead className="text-left py-4 px-4 font-semibold min-w-[180px]">
                        การวิเคราะห์/ประเมินผล
                      </TableHead>
                      <TableHead className="text-left py-4 px-4 font-semibold min-w-[150px]">
                        การจัดเก็บข้อมูล
                      </TableHead>
                      <TableHead className="text-left py-4 px-4 font-semibold min-w-[150px]">
                        แหล่งข้อมูล/เอกสาร
                      </TableHead>
                      <TableHead className="text-left py-4 px-4 font-semibold min-w-[150px]">
                        ผู้รับผิดชอบ
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {summaryData.step3.auditPrograms.map((program: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell className="text-center font-medium">
                          {index + 1}
                        </TableCell>
                        <TableCell className="min-w-[200px] p-4">
                          <div className="font-medium text-gray-900 text-left leading-relaxed">
                            {program.objective || 'ไม่ได้ระบุวัตถุประสงค์'}
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[180px] p-4">
                          <div className="text-sm text-gray-700 text-left leading-relaxed">
                            {program.method || 'ไม่ได้ระบุ'}
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[180px] p-4">
                          <div className="text-sm text-gray-700 text-left leading-relaxed">
                            {program.analysis || 'ไม่ได้ระบุ'}
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[150px] p-4">
                          <div className="text-sm text-gray-700 text-left leading-relaxed">
                            {program.storage || 'ไม่ได้ระบุ'}
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[150px] p-4">
                          <div className="text-sm text-gray-700 text-left leading-relaxed">
                            {program.source || 'ไม่ได้ระบุ'}
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[150px] p-4">
                          <div className="text-sm text-blue-600 font-medium text-left leading-relaxed">
                            {program.responsible || 'ไม่ได้ระบุ'}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
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
        </Card>

        {/* ขั้นตอนที่ 4: การรายงานผลการตรวจสอบ */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              ขั้นตอนที่ 4: การรายงานผลการตรวจสอบ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-4">
                วิธีการสรุปผลการตรวจสอบและจัดทำรายงานผลการตรวจสอบ
              </h4>
              
              <div className="space-y-4">
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">วัตถุประสงค์</h5>
                  <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">{summaryData.step4.reportingObjective}</p>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">วิธีการเพื่อให้ได้มาซึ่งข้อมูล</h5>
                  <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">{summaryData.step4.reportingMethod}</p>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">การวิเคราะห์/ประเมินผล</h5>
                  <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">{summaryData.step4.analysisMethod}</p>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">การจัดเก็บข้อมูล</h5>
                  <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">{summaryData.step4.dataStorage}</p>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">แหล่งข้อมูล/เอกสารที่ใช้ในการตรวจสอบ</h5>
                  <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">{summaryData.step4.dataSources}</p>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">ผู้รับผิดชอบ</h5>
                  <p className="text-sm text-gray-600 p-3 bg-blue-50 rounded-lg">{summaryData.step4.responsible}</p>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">หมายเหตุ</h5>
                  <p className="text-sm text-gray-600 p-3 bg-yellow-50 rounded-lg">{summaryData.step4.remarks}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* สรุปและข้อเสนอแนะ */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-indigo-600" />
              สรุปและข้อเสนอแนะ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h5 className="font-medium text-gray-900 mb-2">สรุปผลการจัดทำแผนการปฏิบัติงานตรวจสอบ</h5>
              <p className="text-sm text-gray-600 p-4 bg-blue-50 rounded-lg">
                ได้ดำเนินการจัดทำแผนการปฏิบัติงานตรวจสอบครบทุกขั้นตอนตามมาตรฐานการตรวจสอบภายใน โดยครอบคลุมการประเมินความเสี่ยง 
                การกำหนดวัตถุประสงค์และขอบเขตการตรวจสอบ การจัดทำ Audit Program และการกำหนดวิธีการรายงานผลการตรวจสอบ 
                แผนงานนี้พร้อมสำหรับการดำเนินการตรวจสอบตามกำหนดเวลา
              </p>
            </div>
            
            <div>
              <h5 className="font-medium text-gray-900 mb-2">ข้อเสนอแนะ</h5>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 p-3 bg-green-50 rounded-lg">
                  • ควรมีการทบทวนและปรับปรุงแผนการปฏิบัติงานให้สอดคล้องกับการเปลี่ยนแปลงของสภาพแวดล้อมการดำเนินงาน
                </p>
                <p className="text-sm text-gray-600 p-3 bg-green-50 rounded-lg">
                  • ควรมีการประสานงานกับหน่วยรับตรวจเพื่อให้การตรวจสอบเป็นไปอย่างราบรื่นและมีประสิทธิภาพ
                </p>
                <p className="text-sm text-gray-600 p-3 bg-green-50 rounded-lg">
                  • ควรมีการติดตามผลการดำเนินงานตามแผนอย่างต่อเนื่องเพื่อให้บรรลุวัตถุประสงค์ที่กำหนดไว้
                </p>
              </div>
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
          <Button variant="outline" className="bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100">
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