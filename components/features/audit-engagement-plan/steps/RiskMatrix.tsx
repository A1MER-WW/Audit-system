import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";

export function RiskMatrix() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>เมทริกซ์ความเสี่ยง</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center text-gray-500 py-8">
          <Target className="h-12 w-12 mx-auto mb-3" />
          <p>เมทริกซ์ความเสี่ยงจะแสดงที่นี่</p>
          <p className="text-sm">หลังจากที่มีการประเมินความเสี่ยงครบถ้วนแล้ว</p>
        </div>
      </CardContent>
    </Card>
  );
}