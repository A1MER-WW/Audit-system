import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle } from "lucide-react";

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
    residualRisk: "ปานกลาง"
  },
  {
    id: 2,
    activity: "การจัดหาพัสดุ",
    riskDescription: "การจัดซื้อจัดจ้างไม่โปร่งใสหรือไม่เป็นไปตามระเบียบ",
    probability: "ปานกลาง",
    impact: "สูง",
    riskLevel: "สูง",
    controlMeasures: "มีระบบการควบคุมการจัดซื้อจัดจ้างและการตรวจสอบ",
    residualRisk: "ต่ำ"
  },
  {
    id: 3,
    activity: "การบริหารงบประมาณ",
    riskDescription: "การใช้งงบประมาณเกินกว่าที่อนุมัติหรือไม่มีประสิทธิภาพ",
    probability: "ต่ำ",
    impact: "สูง",
    riskLevel: "ปานกลาง",
    controlMeasures: "มีระบบการติดตามและควบคุมงบประมาณรายเดือน",
    residualRisk: "ต่ำ"
  }
];

const riskLevels = [
  { value: "ต่ำ", color: "bg-green-100 text-green-700" },
  { value: "ปานกลาง", color: "bg-yellow-100 text-yellow-700" },
  { value: "สูง", color: "bg-orange-100 text-orange-700" },
  { value: "สูงมาก", color: "bg-red-100 text-red-700" }
];

export function ActivityRiskAssessment() {
  const [editingRisk, setEditingRisk] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    activity: "",
    riskDescription: "",
    probability: "",
    impact: "",
    controlMeasures: "",
  });

  const getRiskBadge = (level: string) => {
    const riskLevel = riskLevels.find(r => r.value === level);
    return (
      <Badge className={riskLevel?.color || "bg-gray-100 text-gray-700"}>
        {level}
      </Badge>
    );
  };

  const handleSave = () => {
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
                        onChange={(e) => setFormData({...formData, activity: e.target.value})}
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
                        onChange={(e) => setFormData({...formData, riskDescription: e.target.value})}
                        placeholder="คำอธิบายความเสี่ยง"
                        rows={2}
                      />
                    ) : (
                      <span className="text-sm">{risk.riskDescription}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingRisk === risk.id ? (
                      <Select
                        value={formData.probability}
                        onValueChange={(value) => setFormData({...formData, probability: value})}
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
                        onValueChange={(value) => setFormData({...formData, impact: value})}
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
                  <TableCell>
                    {getRiskBadge(risk.riskLevel)}
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    {editingRisk === risk.id ? (
                      <Textarea
                        value={formData.controlMeasures}
                        onChange={(e) => setFormData({...formData, controlMeasures: e.target.value})}
                        placeholder="มาตรการควบคุม"
                        rows={2}
                      />
                    ) : (
                      <span className="text-sm">{risk.controlMeasures}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {getRiskBadge(risk.residualRisk)}
                  </TableCell>
                  <TableCell>
                    {editingRisk === risk.id ? (
                      <div className="flex gap-1">
                        <Button size="sm" onClick={handleSave}>
                          บันทึก
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancel}>
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
          <Button variant="outline">
            เพิ่มรายการความเสี่ยง
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}