import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  FileText, 
  Building, 
  User, 
  CheckCircle, 
  AlertCircle 
} from "lucide-react";

interface EngagementPlan {
  id: number;
  auditTopic: string;
  departments: string[];
  fiscalYear: string;
  status: string;
  currentStep: number;
  createdDate: string;
  updatedDate: string;
  assignedTo: string;
}

interface EngagementPlanTableProps {
  data: EngagementPlan[];
}

export function EngagementPlanTable({ data }: EngagementPlanTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="secondary">ร่าง</Badge>;
      case "step1":
        return <Badge className="bg-blue-100 text-blue-700">ขั้นตอนที่ 1</Badge>;
      case "step2":
        return <Badge className="bg-yellow-100 text-yellow-700">ขั้นตอนที่ 2</Badge>;
      case "step3":
        return <Badge className="bg-orange-100 text-orange-700">ขั้นตอนที่ 3</Badge>;
      case "step4":
        return <Badge className="bg-purple-100 text-purple-700">ขั้นตอนที่ 4</Badge>;
      case "complete":
        return <Badge className="bg-green-100 text-green-700">เสร็จสิ้น</Badge>;
      default:
        return <Badge variant="secondary">ไม่ระบุ</Badge>;
    }
  };

  const getStepProgress = (currentStep: number) => {
    const steps = [
      "การประเมินความเสี่ยงระดับกิจกรรม",
      "แผนการปฏิบัติงานตรวจสอบ",
      "Audit Program", 
      "วิธีการสรุปผลการตรวจสอบ"
    ];
    
    return (
      <div className="space-y-1">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            {index < currentStep ? (
              <CheckCircle className="h-3 w-3 text-green-600" />
            ) : index === currentStep ? (
              <AlertCircle className="h-3 w-3 text-blue-600" />
            ) : (
              <div className="h-3 w-3 rounded-full border border-gray-300" />
            )}
            <span className={index <= currentStep ? "text-gray-900" : "text-gray-400"}>
              {step}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>รายการแผนการปฏิบัติงานตรวจสอบ</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>หัวข้อการตรวจสอบ</TableHead>
                <TableHead>หน่วยงาน</TableHead>
                <TableHead>ปีงบประมาณ</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>ความคืบหน้า</TableHead>
                <TableHead>ผู้รับผิดชอบ</TableHead>
                <TableHead>อัปเดทล่าสุด</TableHead>
                <TableHead className="w-20">การดำเนินการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((plan, index) => (
                <TableRow key={plan.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <div className="font-medium max-w-xs">
                      {plan.auditTopic}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {plan.departments.map((dept, idx) => (
                        <div key={idx} className="text-sm text-gray-600 flex items-center gap-1">
                          <Building className="h-3 w-3" />
                          {dept}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{plan.fiscalYear}</TableCell>
                  <TableCell>
                    {getStatusBadge(plan.status)}
                  </TableCell>
                  <TableCell>
                    <div className="min-w-[200px]">
                      {getStepProgress(plan.currentStep)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-3 w-3" />
                      {plan.assignedTo}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {plan.updatedDate}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/audit-engagement-plan/${plan.id}`}
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8"
                    >
                      <FileText className="h-4 w-4" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {data.length === 0 && (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">ไม่พบรายการแผนการปฏิบัติงานตรวจสอบ</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}