"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { PersonSelectionDialog } from "@/components/features/engagement-plan/popup";
import { DEFAULT_USERS } from "@/constants/default-users";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getProgram } from "@/lib/mock-engagement-plan-programs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEngagementPlan } from "@/hooks/useEngagementPlan";

export default function Step3AuditProgramPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { state, dispatch, saveToStorage } = useEngagementPlan();

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

  // ดึงวัตถุประสงค์จาก step 2
  const objectives = state.step2?.objectives || [];
  const [expanded, setExpanded] = useState<number | null>(null);
  const [auditData, setAuditData] = useState(
    objectives.map(() => ({
      method: "",
      analysis: "",
      storage: "",
      source: "",
      responsible: "",
    }))
  );

  // State สำหรับผู้รับผิดชอบแต่ละ field
  const [preparer, setPreparer] = useState<string>(state.step1?.basicInfo?.preparer || DEFAULT_USERS.preparer);
  const [reviewer, setReviewer] = useState<string>(state.step1?.basicInfo?.reviewer || DEFAULT_USERS.reviewer);
  const [approver, setApprover] = useState<string>(state.step1?.basicInfo?.approver || DEFAULT_USERS.approver);

  // Load saved audit programs data when component mounts
  useEffect(() => {
    if (state.step3?.auditPrograms && state.step3.auditPrograms.length > 0) {
      const loadedAuditData = state.step3.auditPrograms.map(program => ({
        method: program.method || "",
        analysis: program.analysis || "",
        storage: program.storage || "",
        source: program.source || "",
        responsible: program.responsible || "",
      }));
      setAuditData(loadedAuditData);
    } else if (objectives.length > 0) {
      // Initialize with objectives if no saved data
      setAuditData(objectives.map(() => ({
        method: "",
        analysis: "",
        storage: "",
        source: "",
        responsible: "",
      })));
    }
  }, [state.step3, objectives]);

  // State สำหรับ popup dialog
  const [isPersonDialogOpen, setIsPersonDialogOpen] = useState<boolean>(false);
  const [currentField, setCurrentField] = useState<string | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Auto-save to context when data changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Save audit programs data
      const auditPrograms = auditData.map((data, index) => ({
        objective: objectives[index] || `วัตถุประสงค์ที่ ${index + 1}`,
        method: data.method,
        analysis: data.analysis,
        storage: data.storage,
        source: data.source,
        responsible: data.responsible,
      }));

      dispatch({
        type: "UPDATE_STEP3",
        payload: {
          auditPrograms,
        }
      });

      // Also save the personnel data back to step 1 to keep it synchronized
      dispatch({
        type: "UPDATE_STEP1",
        payload: {
          basicInfo: {
            auditedUnit: state.step1?.basicInfo?.auditedUnit || "",
            auditCategory: state.step1?.basicInfo?.auditCategory || "",
            preparer,
            reviewer,
            approver,
          },
        },
      });
    }, 1000); // Auto-save after 1 second of inactivity

    return () => clearTimeout(timeoutId);
  }, [auditData, preparer, reviewer, approver, objectives, dispatch, state.step1?.basicInfo]);

  // Function to handle next step - save data to context
  const handleNextStep = () => {
    // Save Step 3 data to context - map auditData to include objectives
    const auditPrograms = auditData.map((data, index) => ({
      objective: objectives[index] || `วัตถุประสงค์ที่ ${index + 1}`,
      method: data.method,
      analysis: data.analysis,
      storage: data.storage,
      source: data.source,
      responsible: data.responsible,
    }));

    dispatch({
      type: "UPDATE_STEP3",
      payload: {
        auditPrograms,
      }
    });

    // Also save the personnel data back to step 1 to keep it synchronized
    dispatch({
      type: "UPDATE_STEP1",
      payload: {
        basicInfo: {
          auditedUnit: state.step1?.basicInfo?.auditedUnit || "",
          auditCategory: state.step1?.basicInfo?.auditCategory || "",
          preparer,
          reviewer,
          approver,
        },
      },
    });
    
    // Navigate to Step 4
    router.push(`/audit-engagement-plan/${id}/step-4-audit-reporting`);
  };

  const handleOpenPersonDialog = (field: string) => {
    setCurrentField(field);
    setIsPersonDialogOpen(true);
    setSearchTerm("");
    if (field === "preparer") setSelectedPerson(preparer);
    if (field === "reviewer") setSelectedPerson(reviewer);
    if (field === "approver") setSelectedPerson(approver);
  };

  const handleSelectPerson = (personName: string, personStatus: string) => {
    setSelectedPerson(`${personName} (${personStatus})`);
  };

  const handleConfirmSelection = () => {
    if (currentField && selectedPerson) {
      if (currentField === "preparer") setPreparer(selectedPerson);
      if (currentField === "reviewer") setReviewer(selectedPerson);
      if (currentField === "approver") setApprover(selectedPerson);
    }
    setIsPersonDialogOpen(false);
    setCurrentField(null);
    setSelectedPerson("");
  };



  const handleExpand = (idx: number) => {
    setExpanded(expanded === idx ? null : idx);
  };

  const handleChange = (idx: number, field: string, value: string) => {
    setAuditData((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  return (
    <div className="px-6 py-4">
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
            <Button variant="outline" size="sm">
              ปริ้นท์
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              บันทึกแผนการปฏิบัติงานตรวจสอบ
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
              <div className="flex items-center gap-3">
                <Input
                  value={preparer}
                  onChange={(e) => setPreparer(e.target.value)}
                  placeholder="-"
                  className="w-full"
                />
                <Dialog
                  open={isPersonDialogOpen && currentField === "preparer"}
                  onOpenChange={setIsPersonDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      className="bg-[#3E52B9] hover:bg-[#3346a6]"
                      onClick={() => handleOpenPersonDialog("preparer")}
                    >
                      เลือกผู้รับผิดชอบ
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            </div>

            {/* ผู้สอบทาน */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ผู้สอบทาน
              </label>
              <div className="flex items-center gap-3">
                <Input
                  value={reviewer}
                  onChange={(e) => setReviewer(e.target.value)}
                  placeholder="-"
                  className="w-full"
                />
                <Dialog
                  open={isPersonDialogOpen && currentField === "reviewer"}
                  onOpenChange={setIsPersonDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      className="bg-[#3E52B9] hover:bg-[#3346a6]"
                      onClick={() => handleOpenPersonDialog("reviewer")}
                    >
                      เลือกผู้รับผิดชอบ
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            </div>

            {/* ผู้อนุมัติ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ผู้อนุมัติ
              </label>
              <div className="flex items-center gap-3">
                <Input
                  value={approver}
                  onChange={(e) => setApprover(e.target.value)}
                  placeholder="-"
                  className="w-full"
                />
                <Dialog
                  open={isPersonDialogOpen && currentField === "approver"}
                  onOpenChange={setIsPersonDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      className="bg-[#3E52B9] hover:bg-[#3346a6]"
                      onClick={() => handleOpenPersonDialog("approver")}
                    >
                      เลือกผู้รับผิดชอบ
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step Navigation */}
        <div className="mb-6">
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
              <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-medium">
                3
              </div>
              <span className="ml-2 text-sm font-medium text-blue-600 whitespace-nowrap">
                Audit Program
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-0.5 bg-gray-300"></div>
              <div className="flex items-center justify-center w-8 h-8 bg-gray-200 text-gray-600 rounded-full text-sm font-medium">
                4
              </div>
              <span className="ml-2 text-sm text-gray-600 whitespace-nowrap">
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

      {/* ส่วนล่าง: Audit Program Objectives */}
      <div className="space-y-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>วัตถุประสงค์การตรวจสอบ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {objectives.length > 0 ? (
                objectives.map((objective, idx) => (
                <div key={idx} className="border rounded-lg">
                  <button
                    type="button"
                    className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 flex justify-between items-center"
                    onClick={() => handleExpand(idx)}
                  >
                    <span className="font-medium text-gray-800">
                      {objective}
                    </span>
                    <span>{expanded === idx ? "▲" : "▼"}</span>
                  </button>
                  {expanded === idx && (
                    <div className="p-4 space-y-4 bg-white">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          วิธีการเพื่อให้ได้มาซึ่งข้อมูล
                        </label>
                        <Textarea
                          value={auditData[idx].method}
                          onChange={(e) =>
                            handleChange(idx, "method", e.target.value)
                          }
                          placeholder="ระบุวิธีการ..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          การวิเคราะห์/ประเมินผล
                        </label>
                        <Textarea
                          value={auditData[idx].analysis}
                          onChange={(e) =>
                            handleChange(idx, "analysis", e.target.value)
                          }
                          placeholder="ระบุการวิเคราะห์/ประเมินผล..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          การจัดเก็บข้อมูล
                        </label>
                        <Textarea
                          value={auditData[idx].storage}
                          onChange={(e) =>
                            handleChange(idx, "storage", e.target.value)
                          }
                          placeholder="ระบุการจัดเก็บข้อมูล..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          แหล่งข้อมูล/เอกสารที่ใช้ในการตรวจสอบ
                        </label>
                        <Textarea
                          value={auditData[idx].source}
                          onChange={(e) =>
                            handleChange(idx, "source", e.target.value)
                          }
                          placeholder="ระบุแหล่งข้อมูล/เอกสาร..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ผู้รับผิดชอบ
                        </label>
                        <div className="flex items-center gap-3">
                          <Input
                            value={auditData[idx].responsible}
                            placeholder="ระบุผู้รับผิดชอบ..."
                            className="w-full bg-gray-50"
                            readOnly
                          />
                          <Dialog
                            open={
                              isPersonDialogOpen &&
                              currentField === `responsible-${idx}`
                            }
                            onOpenChange={setIsPersonDialogOpen}
                          >
                            <DialogTrigger asChild>
                              <Button
                                type="button"
                                className="bg-[#3E52B9] hover:bg-[#3346a6]"
                                onClick={() => {
                                  setCurrentField(`responsible-${idx}`);
                                  setIsPersonDialogOpen(true);
                                  setSearchTerm("");
                                  setSelectedPerson(auditData[idx].responsible);
                                }}
                              >
                                เลือกผู้รับผิดชอบ
                              </Button>
                            </DialogTrigger>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
              ) : (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                  <div className="mb-3">
                    <svg className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <p className="font-medium">ไม่พบวัตถุประสงค์การตรวจสอบ</p>
                  <p className="text-sm mt-1">กรุณากรอกวัตถุประสงค์ในขั้นตอนที่ 2 ก่อน</p>
                  <Link href={`/audit-engagement-plan/${id}/step-2-engagement-plan`}>
                    <Button className="mt-3" variant="outline">
                      ไปขั้นตอนที่ 2
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Link href={`/audit-engagement-plan/${id}/step-2-engagement-plan`}>
          <Button variant="outline">
            <span className="mr-2">ขั้นตอนก่อนหน้า: แผนการปฏิบัติงาน</span>
          </Button>
        </Link>
        <Button onClick={handleNextStep}>
          <span className="mr-2">ขั้นตอนถัดไป: การรายงานผลการตรวจสอบ</span>
        </Button>
      </div>
      {/* Person Selection Dialog */}
      <PersonSelectionDialog
        isOpen={isPersonDialogOpen}
        onOpenChange={setIsPersonDialogOpen}
        selectedPerson={selectedPerson}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSelectPerson={(personName, personStatus) => {
          setSelectedPerson(`${personName} (${personStatus})`);
        }}
        onConfirmSelection={() => {
          if (currentField) {
            if (currentField === "preparer") setPreparer(selectedPerson);
            else if (currentField === "reviewer") setReviewer(selectedPerson);
            else if (currentField === "approver") setApprover(selectedPerson);
            else if (currentField.startsWith("responsible-")) {
              const idx = parseInt(currentField.split("-")[1], 10);
              setAuditData((prev) => {
                const next = [...prev];
                next[idx] = { ...next[idx], responsible: selectedPerson };
                return next;
              });
            }
          }
          setIsPersonDialogOpen(false);
          setCurrentField(null);
          setSelectedPerson("");
        }}
      />
    </div>
  );
}
