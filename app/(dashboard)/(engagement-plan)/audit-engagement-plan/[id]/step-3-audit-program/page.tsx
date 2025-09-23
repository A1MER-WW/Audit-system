"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft,
  ArrowRight,
  FileText,
  CheckSquare,
  Clock,
  User,
  Save,
  Eye,
  Plus,
  Edit,
  Trash2
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
  TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Mock data for audit program
const mockAuditProgram = [
  {
    id: 1,
    objective: "ตรวจสอบกระบวนการวางแผนโครงการ",
    procedures: [
      "ทบทวนเอกสารแผนโครงการและเปรียบเทียบกับมาตรฐาน",
      "สัมภาษณ์ผู้รับผิดชอบการวางแผน",
      "ตรวจสอบการอนุมัติแผนโครงการ"
    ],
    evidence: "เอกสารแผนโครงการ, รายงานการประชุม, หนังสืออนุมัติ",
    sampleSize: "100% ของโครงการที่มีมูลค่าเกิน 10 ล้านบาท",
    responsible: "นักตรวจสอบอาวุโส",
    estimatedHours: 16,
    priority: "สูง",
    status: "กำลังดำเนินการ"
  },
  {
    id: 2,
    objective: "ตรวจสอบการจัดหาพัสดุและการจ้างงาน",
    procedures: [
      "ตรวจสอบการปฏิบัติตามระเบียบการจัดซื้อจัดจ้าง",
      "ทดสอบการควบคุมการอนุมัติการซื้อ",
      "ตรวจสอบเอกสารประกวดราคา"
    ],
    evidence: "เอกสารการจัดซื้อจัดจ้าง, ใบเสนอราคา, สัญญา",
    sampleSize: "ตัวอย่าง 30 รายการจากทั้งหมด 150 รายการ",
    responsible: "นักตรวจสอบ",
    estimatedHours: 24,
    priority: "สูง",
    status: "รอดำเนินการ"
  },
  {
    id: 3,
    objective: "ประเมินการบริหารงบประมาณ",
    procedures: [
      "วิเคราะห์การใช้งบประมาณเปรียบเทียบกับแผน",
      "ตรวจสอบการโอนงบประมาณ",
      "ทดสอบการควบคุมการเบิกจ่าย"
    ],
    evidence: "รายงานการใช้งบประมาณ, เอกสารการโอนงบ, ใบเบิกจ่าย",
    sampleSize: "ทุกรายการที่มีการโอนงบเกิน 5%",
    responsible: "นักตรวจสอบการเงิน",
    estimatedHours: 20,
    priority: "ปานกลาง",
    status: "รอดำเนินการ"
  }
];

const priorityColors = {
  "สูง": "bg-red-100 text-red-700",
  "ปานกลาง": "bg-yellow-100 text-yellow-700",
  "ต่ำ": "bg-green-100 text-green-700"
};

const statusColors = {
  "เสร็จสิ้น": "bg-green-100 text-green-700",
  "กำลังดำเนินการ": "bg-blue-100 text-blue-700",
  "รอดำเนินการ": "bg-gray-100 text-gray-700",
  "ล่าช้า": "bg-red-100 text-red-700"
};

export default function Step3AuditProgramPage() {
  const params = useParams();
  const id = params?.id as string;
  
  const [auditPrograms, setAuditPrograms] = useState(mockAuditProgram);
  const [selectedProgram, setSelectedProgram] = useState<typeof mockAuditProgram[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    objective: "",
    procedures: [""],
    evidence: "",
    sampleSize: "",
    responsible: "",
    estimatedHours: 0,
    priority: "ปานกลาง",
    status: "รอดำเนินการ"
  });

  const resetForm = () => {
    setFormData({
      objective: "",
      procedures: [""],
      evidence: "",
      sampleSize: "",
      responsible: "",
      estimatedHours: 0,
      priority: "ปานกลาง",
      status: "รอดำเนินการ"
    });
  };

  const handleEdit = (program: typeof mockAuditProgram[0]) => {
    setFormData({
      objective: program.objective,
      procedures: program.procedures,
      evidence: program.evidence,
      sampleSize: program.sampleSize,
      responsible: program.responsible,
      estimatedHours: program.estimatedHours,
      priority: program.priority,
      status: program.status
    });
    setSelectedProgram(program);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    resetForm();
    setSelectedProgram(null);
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (isEditing && selectedProgram) {
      setAuditPrograms(auditPrograms.map(program => 
        program.id === selectedProgram.id 
          ? { ...program, ...formData }
          : program
      ));
    } else {
      const newProgram = {
        id: Math.max(...auditPrograms.map(p => p.id)) + 1,
        ...formData
      };
      setAuditPrograms([...auditPrograms, newProgram]);
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (programId: number) => {
    setAuditPrograms(auditPrograms.filter(p => p.id !== programId));
  };

  const addProcedure = () => {
    setFormData({
      ...formData,
      procedures: [...formData.procedures, ""]
    });
  };

  const updateProcedure = (index: number, value: string) => {
    const newProcedures = [...formData.procedures];
    newProcedures[index] = value;
    setFormData({
      ...formData,
      procedures: newProcedures
    });
  };

  const removeProcedure = (index: number) => {
    setFormData({
      ...formData,
      procedures: formData.procedures.filter((_, i) => i !== index)
    });
  };

  const totalHours = auditPrograms.reduce((sum, program) => sum + program.estimatedHours, 0);
  const completedPrograms = auditPrograms.filter(p => p.status === "เสร็จสิ้น").length;
  const inProgressPrograms = auditPrograms.filter(p => p.status === "กำลังดำเนินการ").length;

  return (
    <div className="px-6 py-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Link href="/audit-engagement-plan" className="hover:text-blue-600">
            การจัดทำ Audit Program / แผนการปฏิบัติงาน
          </Link>
          <ArrowRight className="h-4 w-4" />
          <Link href={`/audit-engagement-plan/${id}`} className="hover:text-blue-600">
            รายละเอียดแผน #{id}
          </Link>
          <ArrowRight className="h-4 w-4" />
          <span>ขั้นตอนที่ 3</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              ขั้นตอนที่ 3: Audit Program
            </h1>
            <p className="text-gray-600">
              กำหนดขั้นตอนการตรวจสอบโดยละเอียด วิธีการเก็บรวบรวมหลักฐาน และแผนการทดสอบ
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              ดูตัวอย่าง
            </Button>
            <Button>
              <Save className="h-4 w-4 mr-2" />
              บันทึก
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="program" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="program">รายการ Audit Program</TabsTrigger>
          <TabsTrigger value="schedule">ตารางเวลา</TabsTrigger>
          <TabsTrigger value="summary">สรุปรวม</TabsTrigger>
        </TabsList>

        <TabsContent value="program" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">ทั้งหมด</p>
                    <p className="text-2xl font-bold text-gray-900">{auditPrograms.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckSquare className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">เสร็จสิ้น</p>
                    <p className="text-2xl font-bold text-gray-900">{completedPrograms}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">กำลังดำเนินการ</p>
                    <p className="text-2xl font-bold text-gray-900">{inProgressPrograms}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Clock className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">รวมชั่วโมง</p>
                    <p className="text-2xl font-bold text-gray-900">{totalHours}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Audit Program Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CheckSquare className="h-5 w-5" />
                  รายการ Audit Program
                </CardTitle>
                <Button onClick={handleAddNew}>
                  <Plus className="h-4 w-4 mr-2" />
                  เพิ่มรายการ
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>วัตถุประสงค์</TableHead>
                      <TableHead>วิธีการตรวจ��อบ</TableHead>
                      <TableHead>หลักฐาน</TableHead>
                      <TableHead>ขนาดตัวอย่าง</TableHead>
                      <TableHead>ผู้รับผิดชอบ</TableHead>
                      <TableHead>ชั่วโมง</TableHead>
                      <TableHead>ความสำคัญ</TableHead>
                      <TableHead>สถานะ</TableHead>
                      <TableHead className="w-24">การดำเนินการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditPrograms.map((program, index) => (
                      <TableRow key={program.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="max-w-[200px]">
                          <div className="font-medium">{program.objective}</div>
                        </TableCell>
                        <TableCell className="max-w-[250px]">
                          <ul className="text-sm space-y-1">
                            {program.procedures.map((procedure, idx) => (
                              <li key={idx} className="flex items-start gap-1">
                                <span className="text-gray-400 mt-1">•</span>
                                <span>{procedure}</span>
                              </li>
                            ))}
                          </ul>
                        </TableCell>
                        <TableCell className="max-w-[200px] text-sm">
                          {program.evidence}
                        </TableCell>
                        <TableCell className="max-w-[150px] text-sm">
                          {program.sampleSize}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <User className="h-3 w-3" />
                            {program.responsible}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {program.estimatedHours}
                        </TableCell>
                        <TableCell>
                          <Badge className={priorityColors[program.priority as keyof typeof priorityColors]}>
                            {program.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[program.status as keyof typeof statusColors]}>
                            {program.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(program)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(program.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ตารางเวลาการดำเนินงาน</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-500 py-8">
                <Clock className="h-12 w-12 mx-auto mb-3" />
                <p>ตารางเวลาจะแสดงที่นี่</p>
                <p className="text-sm">หลังจากที่มีการกำหนด Audit Program ครบถ้วนแล้ว</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>สรุปรวม Audit Program</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">สถิติการดำเนินงาน</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>จำนวนรายการทั้งหมด:</span>
                      <span className="font-medium">{auditPrograms.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>รวมชั่วโมงการทำงาน:</span>
                      <span className="font-medium">{totalHours} ชั่วโมง</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ความสำคัญสูง:</span>
                      <span className="font-medium">
                        {auditPrograms.filter(p => p.priority === "สูง").length} รายการ
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>ความคืบหน้า:</span>
                      <span className="font-medium">
                        {Math.round((completedPrograms / auditPrograms.length) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">หมายเหตุ</h3>
                  <div className="text-sm text-gray-600 space-y-2">
                    <p>• รายการที่มีความสำคัญสูงควรดำเนินการก่อน</p>
                    <p>• ควรมีการทบทวนและปรับปรุง Audit Program ตามความเหมาะสม</p>
                    <p>• เวลาที่ประมาณการอาจเปลี่ยนแปลงตามความซับซ้อนที่เพิ่มขึ้น</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog for Add/Edit */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "แก้ไข Audit Program" : "เพิ่ม Audit Program ใหม่"}
            </DialogTitle>
            <DialogDescription>
              กำหนดรายละเอียดของ Audit Program
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="objective">วัตถุประสงค์</Label>
              <Input
                id="objective"
                value={formData.objective}
                onChange={(e) => setFormData({...formData, objective: e.target.value})}
                placeholder="ระบุวัตถุประสงค์การตรวจสอบ"
              />
            </div>

            <div>
              <Label>วิธีการตรวจสอบ</Label>
              <div className="space-y-2">
                {formData.procedures.map((procedure, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={procedure}
                      onChange={(e) => updateProcedure(index, e.target.value)}
                      placeholder={`วิธีการตรวจสอบที่ ${index + 1}`}
                    />
                    {formData.procedures.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeProcedure(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addProcedure}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  เพิ่มวิธีการตรวจสอบ
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="evidence">หลักฐานการตรวจสอบ</Label>
                <Textarea
                  id="evidence"
                  value={formData.evidence}
                  onChange={(e) => setFormData({...formData, evidence: e.target.value})}
                  placeholder="ระบุหลักฐานที่ใช้ในการตรวจสอบ"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="sampleSize">ขนาดตัวอย่าง</Label>
                <Textarea
                  id="sampleSize"
                  value={formData.sampleSize}
                  onChange={(e) => setFormData({...formData, sampleSize: e.target.value})}
                  placeholder="ระบุขนาดและวิธีการเลือกตัวอย่าง"
                  rows={3}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="responsible">ผู้รับผิดชอบ</Label>
                <Input
                  id="responsible"
                  value={formData.responsible}
                  onChange={(e) => setFormData({...formData, responsible: e.target.value})}
                  placeholder="ระบุชื่อผู้รับผิดชอบ"
                />
              </div>

              <div>
                <Label htmlFor="estimatedHours">ประมาณเวลา (ชั่วโมง)</Label>
                <Input
                  id="estimatedHours"
                  type="number"
                  value={formData.estimatedHours}
                  onChange={(e) => setFormData({...formData, estimatedHours: parseInt(e.target.value) || 0})}
                  placeholder="0"
                />
              </div>

              <div>
                <Label htmlFor="priority">ความสำคัญ</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({...formData, priority: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกความสำคัญ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="สูง">สูง</SelectItem>
                    <SelectItem value="ปานกลาง">ปานกลาง</SelectItem>
                    <SelectItem value="ต่ำ">ต่ำ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="status">สถานะ</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({...formData, status: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกสถานะ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="รอดำเนินการ">รอดำเนินการ</SelectItem>
                  <SelectItem value="กำลังดำเนินการ">กำลังดำเนินการ</SelectItem>
                  <SelectItem value="เสร็จสิ้น">เสร็จสิ้น</SelectItem>
                  <SelectItem value="ล่าช้า">ล่าช้า</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              ยกเลิก
            </Button>
            <Button onClick={handleSave}>
              {isEditing ? "บันทึกการแก้ไข" : "เพิ่มรายการ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Link href={`/audit-engagement-plan/${id}/step-2-engagement-plan`}>
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            ขั้นตอนก่อนหน้า: แผนการปฏิบัติงาน
          </Button>
        </Link>
        <Link href={`/audit-engagement-plan/${id}/step-4-audit-reporting`}>
          <Button>
            ขั้นตอนถัดไป: วิธีการสรุปผล
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}