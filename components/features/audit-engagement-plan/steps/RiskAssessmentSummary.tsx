import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { List } from "lucide-react";

// Mock data สำหรับสรุปผล
const mockActivityRisks = [
  { riskLevel: "สูงมาก", count: 1 },
  { riskLevel: "สูง", count: 1 },
  { riskLevel: "ปานกลาง", count: 1 },
  { riskLevel: "ต่ำ", count: 0 }
];

const riskLevels = [
  { value: "ต่ำ", color: "bg-green-100 text-green-700" },
  { value: "ปานกลาง", color: "bg-yellow-100 text-yellow-700" },
  { value: "สูง", color: "bg-orange-100 text-orange-700" },
  { value: "สูงมาก", color: "bg-red-100 text-red-700" }
];

export function RiskAssessmentSummary() {
  return (
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
            const riskData = mockActivityRisks.find(risk => risk.riskLevel === level.value);
            const count = riskData?.count || 0;
            return (
              <div key={level.value} className="text-center p-4 border rounded-lg">
                <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${level.color} mb-2`}>
                  {level.value}
                </div>
                <p className="text-2xl font-bold text-gray-900">{count}</p>
                <p className="text-sm text-gray-600">รายการ</p>
              </div>
            );
          })}
        </div>
        
        <div className="prose max-w-none">
          <h3>ข้อสรุปและข้อเสนอแนะ</h3>
          <ul>
            <li>พบความเสี่ยงระดับสูงมาก 1 รายการ ในด้านการวางแผนโครงการ</li>
            <li>ควรเพิ่มมาตรการควบคุมเพิ่มเติมสำหรับความเสี่ยงระดับสูง</li>
            <li>มาตรการควบคุมปัจจุบันสามารถลดความเสี่ยงได้อย่างมีประสิทธิภาพ</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}