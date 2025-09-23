"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Eye } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function LongTermPlanPage() {
  // Mock data for long-term inspection plans
  const inspectionPlans = [
    {
      id: 1,
      fiscalYear: "2567",
      period: "2568 - 2570",
      status: "ผู้ตรวจสอบภายในดำเนินการจัดทำแผนการตรวจสอบ",
      lastUpdate: "20/06/2568 14:00 น.",
      statusColor: "blue"
    },
    {
      id: 2,
      fiscalYear: "2568", 
      period: "2568 - 2571",
      status: "ผู้ตรวจสอบภายในดำเนินการจัดทำแผนการตรวจสอบ",
      lastUpdate: "20/06/2568 14:00 น.",
      statusColor: "blue"
    }
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">รายการแผนการตรวจสอบระยะยาว</h1>
          <p className="text-sm text-gray-600 mt-1">จัดการและติดตามแผนการตรวจสอบระยะยาว</p>
        </div>
        <Button className="bg-[#3E52B9] hover:bg-[#2A3B87] flex items-center gap-2">
          <Plus className="h-4 w-4" />
          เพิ่มแผนการตรวจสอบระยะยาว
        </Button>
      </div>

      {/* Main Content */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-center font-medium">ลำดับ</TableHead>
                <TableHead className="font-medium">ประจำปีงบประมาณ</TableHead>
                <TableHead className="font-medium">ระยะเวลา</TableHead>
                <TableHead className="font-medium">สถานะ</TableHead>
                <TableHead className="font-medium">วัน/เวลา แก้ไขล่าสุด</TableHead>
                <TableHead className="text-center font-medium">การดำเนินการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inspectionPlans.map((plan) => (
                <TableRow key={plan.id} className="hover:bg-gray-50">
                  <TableCell className="text-center font-medium">{plan.id}</TableCell>
                  <TableCell className="font-medium">{plan.fiscalYear}</TableCell>
                  <TableCell>{plan.period}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary" 
                      className={`
                        ${plan.statusColor === 'blue' ? 'bg-blue-100 text-blue-800 border-blue-200' : ''}
                        ${plan.statusColor === 'green' ? 'bg-green-100 text-green-800 border-green-200' : ''}
                        ${plan.statusColor === 'yellow' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : ''}
                        max-w-[250px] text-xs leading-tight
                      `}
                    >
                      {plan.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{plan.lastUpdate}</TableCell>
                  <TableCell className="text-center">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => {
                        // Navigate to detail page
                        window.location.href = `/audit/inspection-plan/detail/${plan.id}`;
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Summary Stats */}
   
    </div>
  );
}