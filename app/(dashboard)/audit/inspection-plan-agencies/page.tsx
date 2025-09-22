"use client"

import { Card, CardContent, CardHeader, CardTitle,  } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

export default function LongTermPlanPage() {
  const router = useRouter();
  
  // Mock data for long-term audit plans
  const auditPlans = [
    {
      id: 1,
      startYear: 2567,
      endYear: 2567,
      title: 'ทำฟ้าที่กลุ่มการผลิตรายใดเฉพิ่อเขียนร้อน',
      status: 'active',
      lastModified: 1
    },
    {
      id: 2,
      startYear: 2567,
      endYear: 2567,
      title: 'ทำฟ้าที่กลุ่มการผลิตรายใดเฉพิ่อเขียนร้อน',
      status: 'active',
      lastModified: 1
    }
  ];

  const handleViewDetails = (id: number) => {
    router.push(`/audit/inspection-plan-agencies/${id}`);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">รายการแผนการตรวจสอบระยะยาว</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>รายการแผนการตรวจสอบระยะยาว</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>รายการแผนการตรวจสอบทั้งหมด {auditPlans.length} รายการ</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>ลำดับ</TableHead>
                  <TableHead>ปีเริ่มต้น</TableHead>
                  <TableHead>ปีสิ้นสุด</TableHead>
                  <TableHead>รายละเอียดแผน</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead>การดำเนินการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditPlans.map((plan, index) => (
                  <TableRow key={plan.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{plan.startYear}</TableCell>
                    <TableCell>{plan.endYear}</TableCell>
                    <TableCell>{plan.title}</TableCell>
                    <TableCell>
                      {plan.status === 'active' ? 'ใช้งานอยู่' : 'ไม่ใช้งาน'}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(plan.id)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        ดูรายละเอียด
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}