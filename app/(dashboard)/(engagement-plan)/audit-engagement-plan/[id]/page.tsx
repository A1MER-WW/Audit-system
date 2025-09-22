"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
;
import { Progress } from "@/components/ui/progress";
import { 
  ArrowRight, 
  CheckCircle, 
  Clock,
  FileText,
  Target,
  Users,
  Calendar
} from "lucide-react";
import Link from "next/link";

// Mock data for engagement plan
const mockEngagementPlan = {
  id: 1,
  auditTopic: "การตรวจสอบการจัดทำและบริหารจัดการโครงการลงทุนภาครัฐ",
  departments: ["กรมทางหลวง", "กรมทางหลวงชนบท"],
  fiscalYear: "2568",
  status: "step2",
  currentStep: 2,
  assignedTo: "นายสมชาย ใจดี",
  createdDate: "2024-12-15",
  updatedDate: "2024-12-20",
  objective: "เพื่อประเมินความมีประสิทธิภาพ ประสิทธิผล และความคุ้มค่าของการจัดทำและบริหารจัดการโครงการลงทุนภาครัฐ",
  scope: "การตรวจสอบครอบคลุมการจัดทำแผนงาน การดำเนินโครงการ การติดตามประเมินผล และการรายงานผล",
  auditPeriod: "มกราคม 2568 - มีนาคม 2568"
};

const steps = [
  {
    id: 1,
    title: "การประเมินความเสี่ยงระดับกิจกรรม",
    description: "ประเมินและวิเคราะห์ความเสี่ยงในแต่ละกิจกรรมของกระบวนการตรวจสอบ",
    status: "completed",
    url: "/step-1-activity-risk"
  },
  {
    id: 2,
    title: "แผนการปฏิบัติงานตรวจสอบ (Engagement Plan)",
    description: "จัดทำแผนการปฏิบัติงานตรวจสอบที่ครอบคลุมวัตถุประสงค์ ขอบเขต และวิธีการตรวจสอบ",
    status: "in-progress",
    url: "/step-2-engagement-plan"
  },
  {
    id: 3,
    title: "Audit Program",
    description: "กำหนดขั้นตอนการตรวจสอบโดยละเอียด วิธีการเก็บรวบรวมหลักฐาน และแผนการทดสอบ",
    status: "pending",
    url: "/step-3-audit-program"
  },
  {
    id: 4,
    title: "วิธีการสรุปผลการตรวจสอบ",
    description: "กำหนดรูปแบบและวิธีการในการสรุปผลการตรวจสอบ การรายงาน และข้อเสนอแนะ",
    status: "pending",
    url: "/step-4-audit-reporting"
  }
];

export default function AuditEngagementPlanDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const getStepStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-700">เสร็จสิ้น</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-700">กำลังดำเนินการ</Badge>;
      case "pending":
        return <Badge variant="secondary">รอดำเนินการ</Badge>;
      default:
        return <Badge variant="secondary">ไม่ระบุ</Badge>;
    }
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-blue-600" />;
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />;
    }
  };

  const completedSteps = steps.filter(step => step.status === "completed").length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  return (
    <div className="px-6 py-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Link href="/audit-engagement-plan" className="hover:text-blue-600">
            การจัดทำ Audit Program / แผนการปฏิบัติงาน
          </Link>
          <ArrowRight className="h-4 w-4" />
          <span>รายละเอียดแผน #{id}</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {mockEngagementPlan.auditTopic}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            ปีงบประมาณ {mockEngagementPlan.fiscalYear}
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {mockEngagementPlan.assignedTo}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            อัปเดทล่าสุด: {mockEngagementPlan.updatedDate}
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">ภาพรวม</TabsTrigger>
          <TabsTrigger value="steps">ขั้นตอนการดำเนินงาน</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                ความคืบหน้าโครงการ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">ความคืบหน้าโดยรวม</span>
                  <span className="text-sm text-gray-600">{completedSteps}/{steps.length} ขั้นตอน</span>
                </div>
                <Progress value={progressPercentage} className="w-full" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {steps.map((step) => (
                    <div key={step.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      {getStepIcon(step.status)}
                      <div>
                        <p className="text-sm font-medium">ขั้นตอนที่ {step.id}</p>
                        <p className="text-xs text-gray-600">{step.status === "completed" ? "เสร็จสิ้น" : step.status === "in-progress" ? "กำลังดำเนินการ" : "รอดำเนินการ"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>ข้อมูลโครงการ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">วัตถุประสงค์</label>
                  <p className="text-sm mt-1">{mockEngagementPlan.objective}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">ขอบเขตการตรวจสอบ</label>
                  <p className="text-sm mt-1">{mockEngagementPlan.scope}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">ช่วงเวลาการตรวจสอบ</label>
                  <p className="text-sm mt-1">{mockEngagementPlan.auditPeriod}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>หน่วยงานที่เกี่ยวข้อง</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockEngagementPlan.departments.map((dept, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="p-2 bg-blue-100 rounded">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-blue-900">{dept}</p>
                        <p className="text-xs text-blue-600">หน่วยงานเป้าหมายการตรวจสอบ</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="steps" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ขั้นตอนการดำเนินงาน</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div key={step.id} className="relative">
                    {index < steps.length - 1 && (
                      <div className="absolute left-6 top-12 w-px h-16 bg-gray-200" />
                    )}
                    <div className="flex gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-shrink-0 mt-1">
                        {getStepIcon(step.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {step.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {step.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStepStatusBadge(step.status)}
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Link
                            href={`/audit-engagement-plan/${id}${step.url}`}
                            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                          >
                            {step.status === "completed" ? "ดูรายละเอียด" : 
                             step.status === "in-progress" ? "ดำเนินการต่อ" : 
                             "เริ่มขั้นตอน"}
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}