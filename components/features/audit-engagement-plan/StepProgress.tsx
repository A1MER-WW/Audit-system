import React from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, CheckCircle, Clock } from "lucide-react";

interface StepProgressProps {
  currentStep: number;
  steps: Array<{
    id: number;
    title: string;
    status: "completed" | "in-progress" | "pending";
  }>;
}

export function StepProgress({ steps }: StepProgressProps) {
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

  const completedSteps = steps.filter(step => step.status === "completed").length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          ความคืบหน้าโครงการ
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">ความคืบหน้าโดยรวม</span>
            <span className="text-sm text-gray-600">{completedSteps}/{steps.length} ขั้นตอน</span>
          </div>
          <Progress value={progressPercentage} className="w-full" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                {getStepIcon(step.status)}
                <div>
                  <p className="text-sm font-medium">ขั้นตอนที่ {step.id}</p>
                  <p className="text-xs text-gray-600">
                    {step.status === "completed" ? "เสร็จสิ้น" : 
                     step.status === "in-progress" ? "กำลังดำเนินการ" : "รอดำเนินการ"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}