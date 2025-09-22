import React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle 
} from "lucide-react";

interface SummaryCardsProps {
  data: Array<{
    status: string;
    currentStep: number;
  }>;
}

export function SummaryCards({ data }: SummaryCardsProps) {
  const totalCount = data.length;
  const inProgressCount = data.filter(item => !["draft", "complete"].includes(item.status)).length;
  const completedCount = data.filter(item => item.status === "complete").length;
  const draftCount = data.filter(item => item.status === "draft").length;

  const summaryItems = [
    {
      icon: FileText,
      label: "ทั้งหมด",
      count: totalCount,
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: Clock,
      label: "กำลังดำเนินการ",
      count: inProgressCount,
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      icon: CheckCircle,
      label: "เสร็จสิ้น",
      count: completedCount,
      color: "bg-green-100 text-green-600"
    },
    {
      icon: AlertCircle,
      label: "ร่าง",
      count: draftCount,
      color: "bg-gray-100 text-gray-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {summaryItems.map((item, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${item.color}`}>
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{item.label}</p>
                <p className="text-2xl font-bold text-gray-900">{item.count}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}