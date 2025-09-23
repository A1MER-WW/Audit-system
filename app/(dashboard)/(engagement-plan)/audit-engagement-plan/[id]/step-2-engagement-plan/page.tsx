"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft,
  ArrowRight,
  FileText,
  Target,
  Clock,
  Users,
  Save,
  Eye,
  Plus,
  MapPin
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";


// Mock data for engagement plan
const mockEngagementPlan = {
  auditTopic: "การตรวจสอบการจัดทำและบริหารจัดการโครงการลงทุนภาครัฐ",
  objectives: [
    "ประเมินความมีประสิทธิภาพของการจัดทำแผนโครงการ",
    "ตรวจสอบความถูกต้องของการดำเนินโครงการ",
    "ประเมินผลสำเร็จของโครงการตามเป้าหมายที่กำหนด"
  ],
  scope: {
    activities: ["การวางแผน", "การดำเนินงาน", "การติดตามประเมินผล"],
    period: "มกราคม 2568 - มีนาคม 2568",
    locations: ["กรมทางหลวง", "กรมทางหลวงชนบท"],
    limitations: "ไม่รวมโครงการที่อยู่ระหว่างการพิจารณาอนุมัติ"
  },
  methodology: [
    "การสำรวจและสัมภาษณ์ผู้เกี่ยวข้อง",
    "การตรวจสอบเอกสารและหลักฐาน",
    "การทดสอบการควบคุมภายใน",
    "การวิเคราะห์ข้อมูลเชิงสถิติ"
  ],
  resources: {
    teamSize: 5,
    duration: "12 สัปดาห์",
    budget: "500,000 บาท"
  }
};

export default function Step2EngagementPlanPage() {
  const params = useParams();
  const id = params?.id as string;
  
  const [formData, setFormData] = useState({
    objectives: mockEngagementPlan.objectives,
    scope: mockEngagementPlan.scope,
    methodology: mockEngagementPlan.methodology,
    resources: mockEngagementPlan.resources
  });

  const [newObjective, setNewObjective] = useState("");
  const [newMethodology, setNewMethodology] = useState("");

  const addObjective = () => {
    if (newObjective.trim()) {
      setFormData({
        ...formData,
        objectives: [...formData.objectives, newObjective.trim()]
      });
      setNewObjective("");
    }
  };

  const removeObjective = (index: number) => {
    setFormData({
      ...formData,
      objectives: formData.objectives.filter((_, i) => i !== index)
    });
  };

  const addMethodology = () => {
    if (newMethodology.trim()) {
      setFormData({
        ...formData,
        methodology: [...formData.methodology, newMethodology.trim()]
      });
      setNewMethodology("");
    }
  };

  const removeMethodology = (index: number) => {
    setFormData({
      ...formData,
      methodology: formData.methodology.filter((_, i) => i !== index)
    });
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
          <span>ขั้นตอนที่ 2</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              ขั้นตอนที่ 2: แผนการปฏิบัติงานตรวจสอบ (Engagement Plan)
            </h1>
            <p className="text-gray-600">
              จัดทำแผนการปฏิบัติงานตรวจสอบที่ครอบคลุมวัตถุประสงค์ ขอบเขต และวิธีการตรวจสอบ
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

      <Tabs defaultValue="objectives" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="objectives">วัตถุประสงค์</TabsTrigger>
          <TabsTrigger value="scope">ขอบเขต</TabsTrigger>
          <TabsTrigger value="methodology">วิธีการ</TabsTrigger>
          <TabsTrigger value="resources">ทรัพยากร</TabsTrigger>
        </TabsList>

        <TabsContent value="objectives" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                วัตถุประสงค์การตรวจสอบ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="audit-topic">หัวข้อการตรวจสอบ</Label>
                <Input
                  id="audit-topic"
                  value={mockEngagementPlan.auditTopic}
                  className="mt-1"
                  readOnly
                />
              </div>

              <div>
                <Label>วัตถุประสงค์เฉพาะ</Label>
                <div className="space-y-2 mt-2">
                  {formData.objectives.map((objective, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                      <div className="flex-1">
                        <span className="text-sm">{objective}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeObjective(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        ลบ
                      </Button>
                    </div>
                  ))}
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="เพิ่มวัตถุประสงค์ใหม่..."
                      value={newObjective}
                      onChange={(e) => setNewObjective(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addObjective();
                        }
                      }}
                    />
                    <Button onClick={addObjective} disabled={!newObjective.trim()}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scope" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                ขอบเขตการตรวจสอบ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="activities">กิจกรรมที่ตรวจสอบ</Label>
                  <Textarea
                    id="activities"
                    value={formData.scope.activities.join(", ")}
                    onChange={(e) => setFormData({
                      ...formData,
                      scope: {
                        ...formData.scope,
                        activities: e.target.value.split(", ")
                      }
                    })}
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="period">ช่วงเวลาที่ตรวจสอบ</Label>
                  <Input
                    id="period"
                    value={formData.scope.period}
                    onChange={(e) => setFormData({
                      ...formData,
                      scope: {
                        ...formData.scope,
                        period: e.target.value
                      }
                    })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="locations">สถานที่/หน่วยงาน</Label>
                  <Textarea
                    id="locations"
                    value={formData.scope.locations.join("\n")}
                    onChange={(e) => setFormData({
                      ...formData,
                      scope: {
                        ...formData.scope,
                        locations: e.target.value.split("\n")
                      }
                    })}
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="limitations">ข้อจำกัดการตรวจสอบ</Label>
                  <Textarea
                    id="limitations"
                    value={formData.scope.limitations}
                    onChange={(e) => setFormData({
                      ...formData,
                      scope: {
                        ...formData.scope,
                        limitations: e.target.value
                      }
                    })}
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="methodology" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                วิธีการตรวจสอบ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>วิธีการและเทคนิคการตรวจสอบ</Label>
                <div className="space-y-2 mt-2">
                  {formData.methodology.map((method, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                      <div className="flex-1">
                        <span className="text-sm">{method}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeMethodology(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        ลบ
                      </Button>
                    </div>
                  ))}
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="เพิ่มวิธีการตรวจสอบใหม่..."
                      value={newMethodology}
                      onChange={(e) => setNewMethodology(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addMethodology();
                        }
                      }}
                    />
                    <Button onClick={addMethodology} disabled={!newMethodology.trim()}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <h3 className="font-semibold">การสัมภาษณ์</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        สัมภาษณ์ผู้เกี่ยวข้องทุกระดับ
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <FileText className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <h3 className="font-semibold">การตรวจสอบเอกสาร</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        ตรวจสอบเอกสารและหลักฐาน
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <h3 className="font-semibold">การทดสอบ</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        ทดสอบการควบคุมภายใน
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                ทรัพยากรและกำหนดเวลา
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="team-size">จำนวนทีมงาน</Label>
                  <Input
                    id="team-size"
                    type="number"
                    value={formData.resources.teamSize}
                    onChange={(e) => setFormData({
                      ...formData,
                      resources: {
                        ...formData.resources,
                        teamSize: parseInt(e.target.value) || 0
                      }
                    })}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">คน</p>
                </div>

                <div>
                  <Label htmlFor="duration">ระยะเวลาดำเนินการ</Label>
                  <Input
                    id="duration"
                    value={formData.resources.duration}
                    onChange={(e) => setFormData({
                      ...formData,
                      resources: {
                        ...formData.resources,
                        duration: e.target.value
                      }
                    })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="budget">งบประมาณ</Label>
                  <Input
                    id="budget"
                    value={formData.resources.budget}
                    onChange={(e) => setFormData({
                      ...formData,
                      resources: {
                        ...formData.resources,
                        budget: e.target.value
                      }
                    })}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">หมายเหตุ</h4>
                <p className="text-sm text-yellow-700">
                  ทรัพยากรและเวลาที่กำหนดนี้เป็นการประมาณการเบื้องต้น 
                  อาจมีการปรับเปลี่ยนตามความซับซ้อนของการตรวจสอบที่เพิ่มขึ้น
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Link href={`/audit-engagement-plan/${id}/step-1-activity-risk`}>
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            ขั้นตอนก่อนหน้า: การประเมินความเสี่ยง
          </Button>
        </Link>
        <Link href={`/audit-engagement-plan/${id}/step-3-audit-program`}>
          <Button>
            ขั้นตอนถัดไป: Audit Program
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}