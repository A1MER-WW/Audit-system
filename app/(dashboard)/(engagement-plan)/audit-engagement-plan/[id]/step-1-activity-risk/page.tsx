"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  Target,
  List,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search } from "lucide-react";

// Mock data for activity risk assessment
const mockActivityRisks = [
  {
    id: 1,
    activity: "การวางแผนโครงการ",
    riskDescription: "การวางแผนไม่ครอบคลุมหรือไม่สอดคล้องกับวัตถุประสงค์",
    probability: "สูง",
    impact: "สูง",
    riskLevel: "สูงมาก",
    controlMeasures: "มีการทบทวนแผนโดยผู้เชี่ยวชาญและคณะกรรมการ",
    residualRisk: "ปานกลาง",
  },
  {
    id: 2,
    activity: "การจัดหาพัสดุ",
    riskDescription: "การจัดซื้อจัดจ้างไม่โปร่งใสหรือไม่เป็นไปตามระเบียบ",
    probability: "ปานกลาง",
    impact: "สูง",
    riskLevel: "สูง",
    controlMeasures: "มีระบบการควบคุมการจัดซื้อจัดจ้างและการตรวจสอบ",
    residualRisk: "ต่ำ",
  },
  {
    id: 3,
    activity: "การบริหารงบประมาณ",
    riskDescription: "การใช้งงบประมาณเกินกว่าที่อนุมัติหรือไม่มีประสิทธิภาพ",
    probability: "ต่ำ",
    impact: "สูง",
    riskLevel: "ปานกลาง",
    controlMeasures: "มีระบบการติดตามและควบคุมงบประมาณรายเดือน",
    residualRisk: "ต่ำ",
  },
];

const riskLevels = [
  { value: "ต่ำ", color: "bg-green-100 text-green-700" },
  { value: "ปานกลาง", color: "bg-yellow-100 text-yellow-700" },
  { value: "สูง", color: "bg-orange-100 text-orange-700" },
  { value: "สูงมาก", color: "bg-red-100 text-red-700" },
];

export default function Step1ActivityRiskPage() {
  const params = useParams();
  const id = params?.id as string;

  const [editingRisk, setEditingRisk] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    activity: "",
    riskDescription: "",
    probability: "",
    impact: "",
    controlMeasures: "",
  });

  // ดึงข้อมูลจาก engagement plan จริง
  const { getProgram } = require("@/lib/mock-engagement-plan-programs");
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
  const [auditTopics, setAuditTopics] = useState("");
  const [auditType, setAuditType] = useState("");
  const [auditor, setAuditor] = useState("");
  const [auditedUnit, setAuditedUnit] = useState<string>("");
  const [auditCategory, setAuditCategory] = useState<string>("");
  const [preparer, setPreparer] = useState<string>(
    "นางสาวกุสุมา สุขสอน (ผู้ตรวจสอบภายใน)"
  );
  const [reviewer, setReviewer] = useState<string>(
    "นางสาวจิรวรรณ สมัคร (หัวหน้ากลุ่มตรวจสอบภายใน)"
  );
  const [approver, setApprover] = useState<string>(
    "นางสาวจิรวรรณ สมัคร (หัวหน้ากลุ่มตรวจสอบภายใน)"
  );

  // State สำหรับ popup dialog
  const [isPersonDialogOpen, setIsPersonDialogOpen] = useState<boolean>(false);
  const [currentField, setCurrentField] = useState<"preparer" | "reviewer" | "approver" | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // รายชื่อผู้รับผิดชอบ (ตามภาพ)
  const peopleList = [
    { id: "1", name: "กคม.", status: "ผู้ตรวจสอบภายใน" },
    { id: "2", name: "นางสาวจิรรวรรม สมัคร", status: "หัวหน้ากลุ่มตรวจสอบภายใน" },
    { id: "3", name: "นางสาวจิตติมา สุขสอบ", status: "ผู้ตรวจสอบภายใน" },
    { id: "4", name: "ภูวดล", status: "ผู้ตรวจสอบภายใน" },
    { id: "5", name: "รัฐพล", status: "ผู้ตรวจสอบภายใน" },
  ];

  const filteredPeople = peopleList.filter(
    (person) =>
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenPersonDialog = (field: "preparer" | "reviewer" | "approver") => {
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
  const getRiskBadge = (level: string) => {
    const riskLevel = riskLevels.find((r) => r.value === level);
    return (
      <Badge className={riskLevel?.color || "bg-gray-100 text-gray-700"}>
        {level}
      </Badge>
    );
  };

  const handleSave = () => {
    // Implementation for saving data
    setEditingRisk(null);
    setFormData({
      activity: "",
      riskDescription: "",
      probability: "",
      impact: "",
      controlMeasures: "",
    });
  };

  const handleCancel = () => {
    setEditingRisk(null);
    setFormData({
      activity: "",
      riskDescription: "",
      probability: "",
      impact: "",
      controlMeasures: "",
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
                  onChange={(e) => setPreparer(e.target.value)}
                  placeholder="-"
                  className="w-full"
                />
                <Dialog open={isPersonDialogOpen && currentField === "preparer"} onOpenChange={setIsPersonDialogOpen}>
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
                <Dialog open={isPersonDialogOpen && currentField === "reviewer"} onOpenChange={setIsPersonDialogOpen}>
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
                <Dialog open={isPersonDialogOpen && currentField === "approver"} onOpenChange={setIsPersonDialogOpen}>
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
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-medium">
                1
              </div>
              <span className="ml-2 text-sm font-medium text-blue-600">
                การประเมินความเสี่ยงระดับกิจกรรม
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-0.5 bg-gray-300"></div>
              <div className="flex items-center justify-center w-8 h-8 bg-gray-200 text-gray-600 rounded-full text-sm font-medium">
                2
              </div>
              <span className="ml-2 text-sm text-gray-600">
                แผนการปฏิบัติงาน (Engagement Plan)
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-0.5 bg-gray-300"></div>
              <div className="flex items-center justify-center w-8 h-8 bg-gray-200 text-gray-600 rounded-full text-sm font-medium">
                3
              </div>
              <span className="ml-2 text-sm text-gray-600">Audit Program</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-0.5 bg-gray-300"></div>
              <div className="flex items-center justify-center w-8 h-8 bg-gray-200 text-gray-600 rounded-full text-sm font-medium">
                4
              </div>
              <span className="ml-2 text-sm text-gray-600">
                การรายงานผลการตรวจสอบ (Audit Reporting)
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
          <div className="text-sm text-gray-600">
            ประเมินความเสี่ยงในแต่ละกิจกรรมของกระบวนการตรวจสอบ
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* วิเคราะห์ความเสี่ยงการไม่บรรลุวัตถุประสงค์และเป้าหมาย */}
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              วิเคราะห์ความเสี่ยงการไม่บรรลุวัตถุประสงค์และเป้าหมาย
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  หัวข้อตรวจ
                </label>
                <Textarea
                  value={auditTopics || mockEngagementPlan.title}
                  onChange={(e) => setAuditTopics(e.target.value)}
                  className="w-full min-h-[60px]"
                  placeholder="กรอกหัวข้อการตรวจสอบ..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ประเภทการตรวจ
                </label>
                <Textarea
                  value={auditType}
                  onChange={(e) => setAuditType(e.target.value)}
                  className="w-full min-h-[60px]"
                  placeholder="กรอกประเภทการตรวจสอบ..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ผู้ตรวจ
                </label>
                <Input
                  value={auditor || mockEngagementPlan.department}
                  onChange={(e) => setAuditor(e.target.value)}
                  className="w-full"
                  placeholder="กรอกชื่อผู้ตรวจสอบ..."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    วันเดือนปี
                  </label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                    >
                      เลือกกิจกรรมตรวจ
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                    >
                      เลือกกิจกรรมตรวจ
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* วิธีการที่จะใช้ในการตรวจสอบ */}
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              วิธีการที่จะใช้ในการตรวจสอบ
            </h3>
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 border-0">
                      <TableHead className="text-center w-16 py-4">
                        ลำดับ
                      </TableHead>
                      <TableHead className="text-center py-4">
                        กิจกรรมการตรวจสอบ
                      </TableHead>
                      <TableHead className="text-center py-4">
                        ความเสี่ยงที่เคก
                      </TableHead>
                      <TableHead className="text-center py-4">
                        ระดับความเสี่ยง
                      </TableHead>
                      <TableHead className="text-center w-20 py-4"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="text-center">1</TableCell>
                      <TableCell>
                        ผู้ตรวจสอบที่ได้รับมอบหมายกิจกรรม (ผู้ตรวจสอบภายใน)
                      </TableCell>
                      <TableCell>การเปิดเสียง (0)</TableCell>
                      <TableCell className="text-center">สูงมาก</TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          🗑️
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-center">2</TableCell>
                      <TableCell>
                        ผู้ตรวจสอบที่สัมพบญาณโดยการศึกษาค่าใช้จ่ายที่บันทึไว้
                        ภายใต้โครงการทดสอบ เพื่อใช้ในการบันทึกงบประมาณ
                      </TableCell>
                      <TableCell>การเปิดเสียง (0)</TableCell>
                      <TableCell className="text-center">สูงมาก</TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          🗑️
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-center">3</TableCell>
                      <TableCell>
                        การสำพญาณตามงานการศึกษาหยุดการใช้จ่ายต่าง ๆ ปองเดียศุ
                        ภายในโครงการเดียวกัน และเปรียบเปรียนกันรายจ่าย
                        ที่สำคัญของแต่ละประเภท
                      </TableCell>
                      <TableCell>การเปิดเสียง (0)</TableCell>
                      <TableCell className="text-center">สูงมาก</TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          🗑️
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-center">4</TableCell>
                      <TableCell>
                        รับ นายงานค่าใช้จ่ายผู้ทำงานค่าใช้จ่ายต่าง ๆ ของงะแน์งาน
                      </TableCell>
                      <TableCell>การเปิดเสียง (0)</TableCell>
                      <TableCell className="text-center">สูงมาก</TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          🗑️
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-center">5</TableCell>
                      <TableCell>
                        ผู้ตรวจที่ประบาณการตั้งแกยิ่ม
                        พาณพอรำส่งแปี่ราต้มสมศ่งค่ยศรมดงานได้
                        ขงคีที่การเออการต้องรเคทธิ ดสรณ์นา
                      </TableCell>
                      <TableCell>การเปิดเสียง (0)</TableCell>
                      <TableCell className="text-center">สูงมาก</TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          🗑️
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-center">6</TableCell>
                      <TableCell>
                        การทดจยีนัดสำคืต์ำบนชได์สุนี้คีโปแสดชสี่ให์ม
                        ใได้ระกญ่ฟข้างศราใล
                      </TableCell>
                      <TableCell>การเปิดเสียง (0)</TableCell>
                      <TableCell className="text-center">สูงมาก</TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          🗑️
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-center">7</TableCell>
                      <TableCell>
                        การทดจยีนัดสำคืต์ำบนชได์ทะงานคงรายนีาของสำคัญ
                      </TableCell>
                      <TableCell>การเปิดเสียง (0)</TableCell>
                      <TableCell className="text-center">สูงมาก</TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          🗑️
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  บันทึกกิจกรรม
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="assessment" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="assessment">การประเมินความเสี่ยง</TabsTrigger>
          <TabsTrigger value="matrix">เมทริกซ์ความเสี่ยง</TabsTrigger>
          <TabsTrigger value="summary">สรุปผล</TabsTrigger>
        </TabsList>

        <TabsContent value="assessment" className="space-y-6">
          {/* Risk Assessment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                รายการประเมินความเสี่ยงระดับกิจกรรม
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">#</TableHead>
                      <TableHead>กิจกรรม</TableHead>
                      <TableHead>ความเสี่ยง</TableHead>
                      <TableHead>โอกาสเกิด</TableHead>
                      <TableHead>ผลกระทบ</TableHead>
                      <TableHead>ระดับความเสี่ยง</TableHead>
                      <TableHead>มาตรการควบคุม</TableHead>
                      <TableHead>ความเสี่ยงคงเหลือ</TableHead>
                      <TableHead className="w-[100px]">การดำเนินการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockActivityRisks.map((risk, index) => (
                      <TableRow key={risk.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium max-w-[150px]">
                          {editingRisk === risk.id ? (
                            <Input
                              value={formData.activity}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  activity: e.target.value,
                                })
                              }
                              placeholder="กิจกรรม"
                            />
                          ) : (
                            risk.activity
                          )}
                        </TableCell>
                        <TableCell className="max-w-[200px]">
                          {editingRisk === risk.id ? (
                            <Textarea
                              value={formData.riskDescription}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  riskDescription: e.target.value,
                                })
                              }
                              placeholder="คำอธิบายความเสี่ยง"
                              rows={2}
                            />
                          ) : (
                            <span className="text-sm">
                              {risk.riskDescription}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {editingRisk === risk.id ? (
                            <Select
                              value={formData.probability}
                              onValueChange={(value) =>
                                setFormData({ ...formData, probability: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="เลือก" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ต่ำ">ต่ำ</SelectItem>
                                <SelectItem value="ปานกลาง">ปานกลาง</SelectItem>
                                <SelectItem value="สูง">สูง</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            getRiskBadge(risk.probability)
                          )}
                        </TableCell>
                        <TableCell>
                          {editingRisk === risk.id ? (
                            <Select
                              value={formData.impact}
                              onValueChange={(value) =>
                                setFormData({ ...formData, impact: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="เลือก" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ต่ำ">ต่ำ</SelectItem>
                                <SelectItem value="ปานกลาง">ปานกลาง</SelectItem>
                                <SelectItem value="สูง">สูง</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            getRiskBadge(risk.impact)
                          )}
                        </TableCell>
                        <TableCell>{getRiskBadge(risk.riskLevel)}</TableCell>
                        <TableCell className="max-w-[200px]">
                          {editingRisk === risk.id ? (
                            <Textarea
                              value={formData.controlMeasures}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  controlMeasures: e.target.value,
                                })
                              }
                              placeholder="มาตรการควบคุม"
                              rows={2}
                            />
                          ) : (
                            <span className="text-sm">
                              {risk.controlMeasures}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{getRiskBadge(risk.residualRisk)}</TableCell>
                        <TableCell>
                          {editingRisk === risk.id ? (
                            <div className="flex gap-1">
                              <Button size="sm" onClick={handleSave}>
                                บันทึก
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleCancel}
                              >
                                ยกเลิก
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingRisk(risk.id);
                                setFormData({
                                  activity: risk.activity,
                                  riskDescription: risk.riskDescription,
                                  probability: risk.probability,
                                  impact: risk.impact,
                                  controlMeasures: risk.controlMeasures,
                                });
                              }}
                            >
                              แก้ไข
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end mt-4">
                <Button variant="outline">เพิ่มรายการความเสี่ยง</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="matrix" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>เมทริกซ์ความเสี่ยง</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-500 py-8">
                <Target className="h-12 w-12 mx-auto mb-3" />
                <p>เมทริกซ์ความเสี่ยงจะแสดงที่นี่</p>
                <p className="text-sm">
                  หลังจากที่มีการประเมินความเสี่ยงครบถ้วนแล้ว
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <List className="h-5 w-5" />
                สรุปผลการประเมินความเสี่ยง
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {riskLevels.map((level) => {
                  const count = mockActivityRisks.filter(
                    (risk) => risk.riskLevel === level.value
                  ).length;
                  return (
                    <div
                      key={level.value}
                      className="text-center p-4 border rounded-lg"
                    >
                      <div
                        className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${level.color} mb-2`}
                      >
                        {level.value}
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {count}
                      </p>
                      <p className="text-sm text-gray-600">รายการ</p>
                    </div>
                  );
                })}
              </div>

              <div className="prose max-w-none">
                <h3>ข้อสรุปและข้อเสนอแนะ</h3>
                <ul>
                  <li>
                    พบความเสี่ยงระดับสูงมาก 1 รายการ ในด้านการวางแผนโครงการ
                  </li>
                  <li>
                    ควรเพิ่มมาตรการควบคุมเพิ่มเติมสำหรับความเสี่ยงระดับสูง
                  </li>
                  <li>
                    มาตรการควบคุมปัจจุบันสามารถลดความเสี่ยงได้อย่างมีประสิทธิภาพ
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Link href={`/audit-engagement-plan/${id}`}>
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            กลับสู่รายละเอียดแผน
          </Button>
        </Link>
        <Link href={`/audit-engagement-plan/${id}/step-2-engagement-plan`}>
          <Button>
            ขั้นตอนถัดไป: แผนการปฏิบัติงาน
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </div>

      {/* Person Selection Dialog */}
      <Dialog open={isPersonDialogOpen} onOpenChange={setIsPersonDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              เลือกผู้รับผิดชอบ
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* People List */}
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {filteredPeople.map((person) => (
                <div
                  key={person.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 ${
                    selectedPerson === `${person.name} (${person.status})`
                      ? "bg-blue-50 border border-blue-200"
                      : "border border-gray-200"
                  }`}
                  onClick={() => handleSelectPerson(person.name, person.status)}
                >
                  <div className="flex-shrink-0">
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        selectedPerson === `${person.name} (${person.status})`
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedPerson === `${person.name} (${person.status})` && (
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {person.name}
                    </p>
                    <p className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded inline-block">
                      {person.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Confirm Button */}
            <div className="flex justify-end pt-4">
              <Button
                onClick={handleConfirmSelection}
                disabled={!selectedPerson}
                className="bg-[#3E52B9] hover:bg-[#3346a6]"
              >
                บันทึก
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
