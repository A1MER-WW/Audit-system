"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEngagementPlan } from "@/hooks/useEngagementPlan";
import { DEFAULT_USERS } from "@/constants/default-users";
import { ArrowLeft, ArrowRight, Settings, Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { getProgram } from "@/lib/mock-engagement-plan-programs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import {
  availableActivities,
  riskLevels,
  type Activity,
} from "@/lib/mock-activity-data";
import {
  PersonSelectionDialog,
  ActivityManagementDialog,
} from "@/components/features/engagement-plan/popup";
import SaveIndicator from "@/components/features/engagement-plan/SaveIndicator";
import TestDataLoader from "../test-data-loader";

export default function Step1ActivityRiskPage() {
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
        objectives: ["ผู้ตรวจสอบที่ได้รับมอบหมายกิจกรรม (ผู้ตรวจสอบภายใน)"],
        generalObjectives: [
          "ประเมินประสิทธิภาพ และประสิทธิผลของโครงการ/งาน/กิจกรรม",
        ],
        specificObjectives: [
          "ประเมินความรู้ ความเข้าใจ ของเจ้าหน้าที่ผู้ปฏิบัติงานงาน/กิจกรรม",
        ],
      }
    : {
        title: "ไม่พบข้อมูลแผนการปฏิบัติงาน",
        fiscalYear: "2568",
        department: "ไม่ระบุ",
        status: "ไม่ระบุ",
        objectives: ["ไม่ระบุ"],
        generalObjectives: ["ไม่ระบุ"],
        specificObjectives: ["ไม่ระบุ"],
      };

  // State สำหรับ text fields ใหม่
  const [auditedUnit, setAuditedUnit] = useState<string>("");
  const [auditCategory, setAuditCategory] = useState<string>("");
  const [preparer, setPreparer] = useState<string>("");
  const [reviewer, setReviewer] = useState<string>("");
  const [approver, setApprover] = useState<string>("");

  // Description state
  const [description, setDescription] = useState<string>("");

  // State สำหรับ popup dialog
  const [isPersonDialogOpen, setIsPersonDialogOpen] = useState<boolean>(false);
  const [currentField, setCurrentField] = useState<
    "preparer" | "reviewer" | "approver" | null
  >(null);
  const [selectedPerson, setSelectedPerson] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // State สำหรับ Activity Management Dialog
  const [isActivityDialogOpen, setIsActivityDialogOpen] =
    useState<boolean>(false);
  const [activitySearchTerm, setActivitySearchTerm] = useState<string>("");
  const [selectedActivities, setSelectedActivities] = useState<Activity[]>([]);
  const [tempSelectedActivities, setTempSelectedActivities] = useState<
    Activity[]
  >([]);

  // Load data from context when component mounts
  useEffect(() => {
    if (state.step1) {
      if (state.step1.basicInfo) {
        setAuditedUnit(state.step1.basicInfo.auditedUnit || "");
        setAuditCategory(state.step1.basicInfo.auditCategory || "");
        setPreparer(state.step1.basicInfo.preparer || DEFAULT_USERS.preparer);
        setReviewer(state.step1.basicInfo.reviewer || DEFAULT_USERS.reviewer);
        setApprover(state.step1.basicInfo.approver || DEFAULT_USERS.approver);
      } else {
        // If no basicInfo exists, set defaults
        setPreparer(DEFAULT_USERS.preparer);
        setReviewer(DEFAULT_USERS.reviewer);
        setApprover(DEFAULT_USERS.approver);
      }
      setDescription(state.step1.description || "");
      // Convert context activities to component activities format
      const contextActivities = state.step1.selectedActivities || [];
      const convertedActivities = contextActivities.map((activity) => ({
        ...activity,
        selected: true,
      }));
      setSelectedActivities(convertedActivities);
    } else {
      // If no step1 data exists, set defaults
      setPreparer(DEFAULT_USERS.preparer);
      setReviewer(DEFAULT_USERS.reviewer);
      setApprover(DEFAULT_USERS.approver);
    }
  }, [state.step1]);

  // Auto-save when local state changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch({
        type: "UPDATE_STEP1",
        payload: {
          basicInfo: {
            auditedUnit,
            auditCategory,
            preparer,
            reviewer,
            approver,
          },
          description,
          selectedActivities,
        },
      });
    }, 1000); // Auto-save after 1 second of inactivity

    return () => clearTimeout(timeoutId);
  }, [auditedUnit, auditCategory, preparer, reviewer, approver, description, selectedActivities, dispatch]);

  // Function to handle next step - save data to context
  const handleNextStep = () => {
    // Save Step 1 data to context
    dispatch({
      type: "UPDATE_STEP1",
      payload: {
        basicInfo: {
          auditedUnit,
          auditCategory,
          preparer,
          reviewer,
          approver,
        },
        description: description || "ยังไม่ได้กรอกคำอธิบาย",
        selectedActivities,
      },
    });

    // Navigate to Step 2
    router.push(`/audit-engagement-plan/${id}/step-2-engagement-plan`);
  };

  const handleOpenPersonDialog = (
    field: "preparer" | "reviewer" | "approver"
  ) => {
    setCurrentField(field);
    setIsPersonDialogOpen(true);
    setSearchTerm("");
    // ตั้งค่า selectedPerson ตามค่าปัจจุบัน
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

  // Functions for Activity Management

  const handleOpenActivityDialog = () => {
    // Initialize temp selection with current selected activities
    setTempSelectedActivities([...selectedActivities]);
    setIsActivityDialogOpen(true);
  };

  const handleToggleActivity = (activityId: number) => {
    const activity = availableActivities.find((a) => a.id === activityId);
    if (!activity) return;

    if (tempSelectedActivities.find((a) => a.id === activityId)) {
      // Remove from temp selected
      setTempSelectedActivities((prev) =>
        prev.filter((a) => a.id !== activityId)
      );
    } else {
      // Add to temp selected
      setTempSelectedActivities((prev) => [...prev, activity]);
    }
  };

  const handleConfirmActivitySelection = () => {
    // Apply temp selection to actual selection
    setSelectedActivities([...tempSelectedActivities]);
    setIsActivityDialogOpen(false);
    setActivitySearchTerm("");
    setTempSelectedActivities([]);
  };

  const handleCancelActivitySelection = () => {
    setIsActivityDialogOpen(false);
    setActivitySearchTerm("");
    setTempSelectedActivities([]);
  };

  const removeActivityFromSelected = (activityId: number) => {
    setSelectedActivities((prev) => prev.filter((a) => a.id !== activityId));
  };
  const getRiskBadge = (level: string) => {
    const riskLevel = riskLevels.find((r) => r.value === level);
    return (
      <Badge className={riskLevel?.color || "bg-gray-100 text-gray-700"}>
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
          <div className="flex items-center gap-4">
            <SaveIndicator />
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                ปริ้นท์
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                บันทึกแผนการปฏิบัติงานตรวจสอบ
              </Button>
            </div>
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
              <Input
                value={auditedUnit}
                onChange={(e) => setAuditedUnit(e.target.value)}
                placeholder="-"
                className="w-full"
              />
            </div>

            {/* ประเภทของการตรวจ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ประเภทของการตรวจ
              </label>
              <Input
                value={auditCategory}
                onChange={(e) => setAuditCategory(e.target.value)}
                placeholder="-"
                className="w-full"
              />
            </div>

            {/* ผู้จัดทำ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ผู้จัดทำ
              </label>
              <div className="flex items-center gap-3">
                <Input
                  value={preparer}
                  placeholder="-"
                  className="w-full bg-gray-50"
                  readOnly
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
                  placeholder="-"
                  className="w-full bg-gray-50"
                  readOnly
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
                  placeholder="-"
                  className="w-full bg-gray-50"
                  readOnly
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
              <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-medium">
                1
              </div>
              <span className="ml-2 text-sm font-medium text-blue-600 whitespace-nowrap">
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
              <span className="ml-2 text-sm text-gray-600 whitespace-nowrap">
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

      {/* การประเมินความเสี่ยงระดับกิจกรรม */}
      <Card className="mb-6">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-lg text-gray-800">
            การประเมินความเสี่ยงระดับกิจกรรม
          </CardTitle>
          {/* ช่องกรอกคำอธิบาย */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              คำอธิบาย
            </label>
            <Textarea
              placeholder="กรอกคำอธิบายเกี่ยวกับการประเมินความเสี่ยงระดับกิจกรรม..."
              className="w-full min-h-[80px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </CardHeader>

        {/* รายการกิจกรรม/เรื่องที่จะเข้าตรวจสอบ */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              รายการกิจกรรม/เรื่องที่จะเข้าตรวจสอบ
            </h3>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleOpenActivityDialog}
            >
              <Settings className="h-4 w-4 mr-2" />
              จัดการกิจกรรม
            </Button>
          </div>

          <div className="space-y-4">
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
                    <TableHead className="text-center w-20 py-4"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedActivities.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-gray-500"
                      >
                        ยังไม่มีกิจกรรมที่เลือก กรุณากดปุ่ม
                        &quot;จัดการกิจกรรม&quot; เพื่อเลือกกิจกรรม
                      </TableCell>
                    </TableRow>
                  ) : (
                    selectedActivities.map((activity, index) => (
                      <TableRow key={activity.id}>
                        <TableCell className="text-center">
                          {index + 1}
                        </TableCell>
                        <TableCell className="max-w-md">
                          {activity.activity}
                        </TableCell>
                        <TableCell className="text-center">
                          {activity.riskDescription}
                        </TableCell>
                        <TableCell className="text-center">
                          {getRiskBadge(activity.riskLevel)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() =>
                              removeActivityFromSelected(activity.id)
                            }
                          >
                            <Trash></Trash>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Link href={`/audit-engagement-plan/${id}`}>
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            กลับสู่รายละเอียดแผน
          </Button>
        </Link>
        <Button onClick={handleNextStep}>
          ขั้นตอนถัดไป: แผนการปฏิบัติงาน
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Person Selection Dialog */}
      <PersonSelectionDialog
        isOpen={isPersonDialogOpen}
        onOpenChange={setIsPersonDialogOpen}
        selectedPerson={selectedPerson}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSelectPerson={handleSelectPerson}
        onConfirmSelection={handleConfirmSelection}
      />

      {/* Activity Management Dialog */}
      <ActivityManagementDialog
        isOpen={isActivityDialogOpen}
        onOpenChange={setIsActivityDialogOpen}
        searchTerm={activitySearchTerm}
        onSearchChange={setActivitySearchTerm}
        tempSelectedActivities={tempSelectedActivities}
        onToggleActivity={handleToggleActivity}
        onConfirmSelection={handleConfirmActivitySelection}
        onCancelSelection={handleCancelActivitySelection}
      />
    </div>
  );
}
