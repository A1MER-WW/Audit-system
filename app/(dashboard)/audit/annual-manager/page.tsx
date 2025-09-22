"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, User } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// ข้อมูลตัวอย่างสำหรับแผนการบริหารจัดการ
const annualManagerData = [
  {
    id: "1",
    order: 1,
    year: "2567",
    description: "แผนการบริหารจัดการการตรวจสอบภายในและการพัฒนาทรัพยากรบุคคล (ปรับปรุงล่าสุด)",
    updateDate: "20/06/2568 14:00 น."
  },
  {
    id: "2",
    order: 1,
    year: "2568", 
    description: "แผนการบริหารจัดการการตรวจสอบภายในการประจำปี",
    updateDate: "20/06/2568 14:00 น."
  }
];

export default function AnnualManagerPage() {
  const router = useRouter();
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleRowClick = (id: string) => {
    router.push(`/audit/annual-manager/detail/${id}`);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">แผนการจัดการบองเเละแผนการใช้ระบบการทำงานการ</h1>
        
        </div>
        <Button className="bg-[#3E52B9] hover:bg-[#2A3B87]">
              <Plus className="h-4 w-4 mr-2" />
              เพิ่มแผนการบริหารจัดการประจำปี
            </Button>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader className="flex flex-row items-center justify-between">
              <DialogTitle className="text-lg font-semibold">
                เพิ่มแผนการบริหารจัดการประจำปี
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setIsDialogOpen(false)}
              >
              </Button>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="text-sm text-gray-600">
                กรุณาเลือกปีงบประมาณ
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  ปีงบประมาณ
                </label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="2568" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2567">2567</SelectItem>
                    <SelectItem value="2568">2568</SelectItem>
                    <SelectItem value="2569">2569</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setIsDialogOpen(false)}
              >
                ยกเลิก
              </Button>
              <Button 
                className="flex-1 bg-[#3E52B9] hover:bg-[#2A3B87]"
                onClick={() => {
                  // จะเพิ่มฟังก์ชันการบันทึกที่นี่
                  console.log("Selected year:", selectedYear);
                  // Navigate to the detail page with new plan
                  router.push(`/audit/annual-manager/detail/new?year=${selectedYear}`);
                  setIsDialogOpen(false);
                }}
              >
                เพิ่ม
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            แผนการจัดการสำชองและแผนการจัดสรรเวลาการทำงาน
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">ลำดับ</TableHead>
                  <TableHead>ประจำปีงบประมาณ</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead className="w-32">แก้ไขล่าสุด</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {annualManagerData.map((item, index) => (
                  <TableRow 
                    key={item.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleRowClick(item.id)}
                  >
                    <TableCell className="text-center font-medium ">
                      {item.order}
                    </TableCell>
                    <TableCell className="max-w-[300px] ">
                      <div className="font-medium">{item.year}</div>
                    </TableCell>
                    <TableCell className="max-w-[400px] text-yellow-600">
                      <div>{item.description}</div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span>{item.updateDate}</span>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
