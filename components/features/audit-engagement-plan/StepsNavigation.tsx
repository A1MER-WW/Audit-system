import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Step {
  id: number;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "pending";
  url: string;
}

interface StepsNavigationProps {
  planId: string;
  steps: Step[];
}

export function StepsNavigation({ planId, steps }: StepsNavigationProps) {
  const getStepStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-700">เสร็จสิ้น</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-700">กำลังดำเนินการ</Badge>;
      case "pending":
        return <Badge variant="secondary">รอดำเนินการ</Badge>;
      default:
        return <Badge variant="secondary">ไม่ระบุ</Badge>;
    }
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-blue-600" />;
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>ขั้นตอนการดำเนินงาน</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.id} className="relative">
              {index < steps.length - 1 && (
                <div className="absolute left-6 top-12 w-px h-16 bg-gray-200" />
              )}
              <div className="flex gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0 mt-1">
                  {getStepIcon(step.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {step.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStepStatusBadge(step.status)}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Link
                      href={`/audit-engagement-plan/${planId}${step.url}`}
                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                    >
                      {step.status === "completed" ? "ดูรายละเอียด" : 
                       step.status === "in-progress" ? "ดำเนินการต่อ" : 
                       "เริ่มขั้นตอน"}
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}