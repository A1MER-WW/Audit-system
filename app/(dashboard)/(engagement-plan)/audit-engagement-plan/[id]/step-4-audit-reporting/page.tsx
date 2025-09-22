"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft,
  ArrowRight,
  FileText,
  BarChart3,
  Users,
  Save,
  Eye,
  Plus
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

export default function Step4AuditReportingPage() {
  const params = useParams();
  const id = params?.id as string;
  
  const [reportingMethods, setReportingMethods] = useState([
    {
      id: 1,
      type: "รายงานผลการตรวจสอบฉบับสมบูรณ์",
      format: "เอกสาร PDF",
      frequency: "เมื่อสิ้นสุดการตรวจสอบ",
      recipients: ["ผู้อำนวยการ", "คณะกรรมการตรวจสอบ"],
      template: "แบบฟอร์ม ผต.01",
      deliveryMethod: "ส่งทางอีเมลและเอกสารต้นฉบับ"
    },
    {
      id: 2,
      type: "รายงานความคืบหน้ารายเดือน",
      format: "Dashboard",
      frequency: "รายเดือน",
      recipients: ["หัวหน้าทีม", "ผู้จัดการโครงการ"],
      template: "Dashboard Template",
      deliveryMethod: "ระบบออนไลน์"
    }
  ]);

  const [newMethod, setNewMethod] = useState({
    type: "",
    format: "",
    frequency: "",
    recipients: [""],
    template: "",
    deliveryMethod: ""
  });

  const [showAddForm, setShowAddForm] = useState(false);

  const addRecipient = () => {
    setNewMethod({
      ...newMethod,
      recipients: [...newMethod.recipients, ""]
    });
  };

  const updateRecipient = (index: number, value: string) => {
    const newRecipients = [...newMethod.recipients];
    newRecipients[index] = value;
    setNewMethod({
      ...newMethod,
      recipients: newRecipients
    });
  };

  const removeRecipient = (index: number) => {
    setNewMethod({
      ...newMethod,
      recipients: newMethod.recipients.filter((_, i) => i !== index)
    });
  };

  const handleAddMethod = () => {
    if (newMethod.type && newMethod.format) {
      setReportingMethods([
        ...reportingMethods,
        {
          id: Date.now(),
          ...newMethod,
          recipients: newMethod.recipients.filter(r => r.trim() !== "")
        }
      ]);
      setNewMethod({
        type: "",
        format: "",
        frequency: "",
        recipients: [""],
        template: "",
        deliveryMethod: ""
      });
      setShowAddForm(false);
    }
  };

  const removeMethod = (id: number) => {
    setReportingMethods(reportingMethods.filter(method => method.id !== id));
  };

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
          <span>ขั้นตอนที่ 4</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              ขั้นตอนที่ 4: วิธีการสรุปผลการตรวจสอบ
            </h1>
            <p className="text-gray-600">
              กำหนดรูปแบบและวิธีการในการสรุปผลการตรวจสอบ การรายงาน และข้อเสนอแนะ
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

      <Tabs defaultValue="methods" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="methods">วิธีการรายงาน</TabsTrigger>
          <TabsTrigger value="templates">แบบฟอร์มและเทมเพลต</TabsTrigger>
          <TabsTrigger value="schedule">กำหนดเวลา</TabsTrigger>
        </TabsList>

        <TabsContent value="methods" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">รูปแบบรายงาน</p>
                    <p className="text-2xl font-bold text-gray-900">{reportingMethods.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">ผู้รับรายงาน</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {[...new Set(reportingMethods.flatMap(m => m.recipients))].length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">ช่องทางส่ง</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {[...new Set(reportingMethods.map(m => m.deliveryMethod))].length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reporting Methods */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  วิธีการรายงานผล
                </CardTitle>
                <Button onClick={() => setShowAddForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  เพิ่มวิธีการรายงาน
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportingMethods.map((method) => (
                  <div key={method.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{method.type}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-600">รูปแบบ:</span>
                            <p>{method.format}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">ความถี่:</span>
                            <p>{method.frequency}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">แบบฟอร์ม:</span>
                            <p>{method.template}</p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <span className="font-medium text-gray-600">ผู้รับรายงาน:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {method.recipients.map((recipient, idx) => (
                              <span key={idx} className="inline-flex px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                                {recipient}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className="font-medium text-gray-600">วิธีการส่ง:</span>
                          <p className="text-sm">{method.deliveryMethod}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMethod(method.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        ลบ
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Add New Method Form */}
                {showAddForm && (
                  <div className="p-4 border-2 border-dashed rounded-lg">
                    <h3 className="font-semibold mb-4">เพิ่มวิธีการรายงานใหม่</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="type">ประเภทรายงาน</Label>
                          <Input
                            id="type"
                            value={newMethod.type}
                            onChange={(e) => setNewMethod({...newMethod, type: e.target.value})}
                            placeholder="เช่น รายงานผลการตรวจสอบฉบับสมบูรณ์"
                          />
                        </div>
                        <div>
                          <Label htmlFor="format">รูปแบบ</Label>
                          <Select
                            value={newMethod.format}
                            onValueChange={(value) => setNewMethod({...newMethod, format: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="เลือกรูปแบบ" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="เอกสาร PDF">เอกสาร PDF</SelectItem>
                              <SelectItem value="Dashboard">Dashboard</SelectItem>
                              <SelectItem value="Presentation">Presentation</SelectItem>
                              <SelectItem value="Excel Report">Excel Report</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="frequency">ความถี่ในการรายงาน</Label>
                          <Input
                            id="frequency"
                            value={newMethod.frequency}
                            onChange={(e) => setNewMethod({...newMethod, frequency: e.target.value})}
                            placeholder="เช่น รายเดือน, เมื่อสิ้นสุดการตรวจสอบ"
                          />
                        </div>
                        <div>
                          <Label htmlFor="template">แบบฟอร์ม/เทมเพลต</Label>
                          <Input
                            id="template"
                            value={newMethod.template}
                            onChange={(e) => setNewMethod({...newMethod, template: e.target.value})}
                            placeholder="เช่น แบบฟอร์ม ผต.01"
                          />
                        </div>
                      </div>

                      <div>
                        <Label>ผู้รับรายงาน</Label>
                        <div className="space-y-2 mt-2">
                          {newMethod.recipients.map((recipient, index) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                value={recipient}
                                onChange={(e) => updateRecipient(index, e.target.value)}
                                placeholder={`ผู้รับรายงานคนที่ ${index + 1}`}
                              />
                              {newMethod.recipients.length > 1 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeRecipient(index)}
                                >
                                  ลบ
                                </Button>
                              )}
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            onClick={addRecipient}
                            className="w-full"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            เพิ่มผู้รับรายงาน
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="deliveryMethod">วิธีการส่งรายงาน</Label>
                        <Textarea
                          id="deliveryMethod"
                          value={newMethod.deliveryMethod}
                          onChange={(e) => setNewMethod({...newMethod, deliveryMethod: e.target.value})}
                          placeholder="เช่น ส่งทางอีเมลและเอกสารต้นฉบับ"
                          rows={2}
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button onClick={handleAddMethod}>
                          เพิ่มวิธีการรายงาน
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowAddForm(false)}
                        >
                          ยกเลิก
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>แบบฟอร์มและเทมเพลต</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-500 py-8">
                <FileText className="h-12 w-12 mx-auto mb-3" />
                <p>แบบฟอร์มและเทมเพลตจะแสดงที่นี่</p>
                <p className="text-sm">รวบรวมแบบฟอร์มที่ใช้ในการรายงานผล</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>กำหนดเวลาการรายงาน</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-500 py-8">
                <BarChart3 className="h-12 w-12 mx-auto mb-3" />
                <p>ตารางเวลาการรายงานจะแสดงที่นี่</p>
                <p className="text-sm">กำหนดเวลาการส่งรายงานแต่ละประเภท</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Link href={`/audit-engagement-plan/${id}/step-3-audit-program`}>
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            ขั้นตอนก่อนหน้า: Audit Program
          </Button>
        </Link>
        <Link href={`/audit-engagement-plan/${id}`}>
          <Button>
            เสร็จสิ้น: กลับสู่รายละเอียดแผน
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}