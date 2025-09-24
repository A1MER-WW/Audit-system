"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEngagementPlan } from "@/hooks/useEngagementPlan";
import TestDataLoader from "../test-data-loader";
import {
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { getProgram } from "@/lib/mock-engagement-plan-programs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Step4AuditReportingPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { dispatch } = useEngagementPlan();

  // State สำหรับผู้รับผิดชอบแต่ละ field
  const [preparer] = useState<string>(
    "นางสาวกุสุมา สุขสอน (ผู้ตรวจสอบภายใน)"
  );
  const [responsible] = useState<string>("");

  // Step 4 specific form data
  const [reportingObjective, setReportingObjective] = useState<string>("");
  const [reportingMethodText, setReportingMethodText] = useState<string>("");
  const [analysisMethodText, setAnalysisMethodText] = useState<string>("");
  const [dataStorageText, setDataStorageText] = useState<string>("");
  const [dataSourcesText, setDataSourcesText] = useState<string>("");
  const [remarksText, setRemarksText] = useState<string>("");



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



  // Function to handle summary - save data to context
  const handleSummary = () => {
    // Use real form data that user filled in
    const step4Data = {
      reportingObjective: reportingObjective || "ไม่ได้ระบุวัตถุประสงค์",
      reportingMethod: reportingMethodText || "ไม่ได้ระบุวิธีการ",
      analysisMethod: analysisMethodText || "ไม่ได้ระบุการวิเคราะห์",
      dataStorage: dataStorageText || "ไม่ได้ระบุการจัดเก็บข้อมูล",
      dataSources: dataSourcesText || "ไม่ได้ระบุแหล่งข้อมูล",
      responsible: responsible || preparer || "ไม่ได้ระบุผู้รับผิดชอบ",
      remarks: remarksText || "ไม่มีหมายเหตุเพิ่มเติม",
    };

    dispatch({
      type: "UPDATE_STEP4",
      payload: step4Data
    });
    
    // Navigate to Summary
    router.push(`/audit-engagement-plan/${id}/summary`);
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
          <ArrowRight className="h-4 w-4" />
          <span>แผนการปฏิบัติงานตรวจสอบ</span>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              แผนการปฏิบัติงานตรวจสอบ (Audit Program)
            </h1>
            <div className="text-gray-600">
              ปีงบประมาณ พ.ศ. {mockEngagementPlan.fiscalYear}
              <span className="mx-2">•</span>
              {mockEngagementPlan.department}
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              เสนอหัวหน้ากลุ่มตรวจสอบภายใน
            </Button>
          </div>
        </div>

        {/* แผนการปฏิบัติงาน Card */}
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">
              {mockEngagementPlan.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* หน่วยรับตรวจ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                หน่วยรับตรวจ
              </label>
              <Input placeholder="-" className="w-full" />
            </div>

            {/* ประเภทของการตรวจ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ประเภทของการตรวจ
              </label>
              <Input placeholder="-" className="w-full" />
            </div>

            {/* ผู้จัดทำ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ผู้จัดทำ
              </label>
              <Input
                value={preparer}
                readOnly
                placeholder="-"
                className="w-full bg-gray-50"
              />
            </div>

            {/* ผู้สอบทาน */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ผู้สอบทาน
              </label>
              <Input
                value="นางสาวจิรวรรณ สมัคร (หัวหน้ากลุ่มตรวจสอบภายใน)"
                readOnly
                placeholder="-"
                className="w-full bg-gray-50"
              />
            </div>

            {/* ผู้อนุมัติ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ผู้อนุมัติ
              </label>
              <Input
                value="นางสาวจิรวรรณ สมัคร (หัวหน้ากลุ่มตรวจสอบภายใน)"
                readOnly
                placeholder="-"
                className="w-full bg-gray-50"
              />
            </div>
          </CardContent>
        </Card>

        {/* Step Navigation */}
        <div className="my-10 flex justify-left">
          <div className="flex items-center space-x-4 overflow-x-auto">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 bg-gray-200 text-gray-600 rounded-full text-sm font-medium">
                1
              </div>
              <span className="ml-2 text-sm text-gray-600 whitespace-nowrap">
                การประเมินความเสี่ยงระดับกิจกรรม
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-0.5 bg-gray-300"></div>
              <div className="flex items-center justify-center w-8 h-8 bg-gray-200 text-gray-600 rounded-full text-sm font-medium">
                2
              </div>
              <span className="ml-2 text-sm text-gray-600 whitespace-nowrap">
                แผนการปฏิบัติงาน (Engagement Plan)
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-0.5 bg-gray-300"></div>
              <div className="flex items-center justify-center w-8 h-8 bg-gray-200 text-gray-600 rounded-full text-sm font-medium">
                3
              </div>
              <span className="ml-2 text-sm text-gray-600 whitespace-nowrap">Audit Program</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-0.5 bg-gray-300"></div>
              <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-medium">
                4
              </div>
              <span className="ml-2 text-sm font-medium text-blue-600 whitespace-nowrap">
                การรายงานผลการตรวจสอบ (Audit Reporting)
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-0.5 bg-gray-300"></div>
              <div className="flex items-center justify-center w-8 h-8 bg-gray-200 text-gray-600 rounded-full text-sm font-medium">
                5
              </div>
              <span className="ml-2 text-sm text-gray-600 whitespace-nowrap">
                สรุปผลการดำเนินงาน
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* วิธีการสรุปผลการตรวจสอบและจัดทำรายงานผลการตรวจสอบ */}
      <div className="space-y-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>
              วิธีการสรุปผลการตรวจสอบและจัดทํารายงานผลการตรวจสอบ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                วัตถุประสงค์
              </label>
              <Textarea 
                placeholder="ระบุวัตถุประสงค์..." 
                value={reportingObjective}
                onChange={(e) => setReportingObjective(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                วิธีการเพื่อให้ได้มาซึ่งข้อมูล
              </label>
              <Textarea 
                placeholder="ระบุวิธีการ..." 
                value={reportingMethodText}
                onChange={(e) => setReportingMethodText(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                การวิเคราะห์/ประเมินผล
              </label>
              <Textarea 
                placeholder="ระบุการวิเคราะห์/ประเมินผล..." 
                value={analysisMethodText}
                onChange={(e) => setAnalysisMethodText(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                การจัดเก็บข้อมูล
              </label>
              <Textarea 
                placeholder="ระบุการจัดเก็บข้อมูล..." 
                value={dataStorageText}
                onChange={(e) => setDataStorageText(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                แหล่งข้อมูล/เอกสารที่ใช้ในการตรวจสอบ
              </label>
              <Textarea 
                placeholder="ระบุแหล่งข้อมูล/เอกสาร..." 
                value={dataSourcesText}
                onChange={(e) => setDataSourcesText(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ผู้รับผิดชอบ
              </label>
              <Input
                value={responsible}
                placeholder="ระบุผู้รับผิดชอบ..."
                className="w-full bg-gray-50"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                หมายเหตุ
              </label>
              <Textarea 
                placeholder="ระบุหมายเหตุ..." 
                value={remarksText}
                onChange={(e) => setRemarksText(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Person Selection Dialog */}


      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <Link href={`/audit-engagement-plan/${id}/step-3-audit-program`}>
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            ขั้นตอนก่อนหน้า: Audit Program
          </Button>
        </Link>
        <Button onClick={handleSummary} className="bg-green-600 hover:bg-green-700 text-white">
          สรุปผลการดำเนินงาน
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
