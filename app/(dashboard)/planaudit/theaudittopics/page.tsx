"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { FileText, ChevronRight, ChevronLeft } from 'lucide-react';

export default function TheAuditTopicsPage() {
  const [selectedYear, setSelectedYear] = React.useState<string>("2569");
  const [checkedItems2568, setCheckedItems2568] = React.useState<Record<number, boolean>>({});
  const [checkedItems2569, setCheckedItems2569] = React.useState<Record<number, boolean>>({});
  const [showConfirmDialog, setShowConfirmDialog] = React.useState<boolean>(false);
  
  // State for dynamic table data
  const [data2568, setData2568] = React.useState(() => [
    { id: 1, agency: "สกท.", topic: "งานตรวจการใช้จ่ายเงินที่ได้รับการอุดหนุนจากรัฐบาลด้านงานพัฒนา" },
    { id: 2, agency: "สกท.", topic: "งานตรวจสอบการบริหารบุคคลในระดับข้อกำหนดเฉพาะตำแหน่งนักพัฒนาการเฉพาะพื้นที่และการพิจารณาประเมินระบบบุคคล (FTA)" },
    { id: 3, agency: "สกท.", topic: "ปฏิบัติงานตรวจสอบภายใน" },
    { id: 4, agency: "สกท.", topic: "ปฏิบัติงานตรวจสอบภายใน" },
    { id: 5, agency: "สกท.", topic: "ด้านการพิจารณาอนุมัติงานในงบประมาณประจำปีงบประมาณ" },
    { id: 6, agency: "สกท.", topic: "ภัยจากวิสัยใหญ่และประกอบการทำงานออกแบบ โครงการงบประมาณสำนักงานในอีกสำนักงานภายในประเทศและลักษณะข้อแนะนำในประเทศงานตรวจสอบและเสนอบอร์ดมติความคืน ตรวจสอบ" },
    { id: 7, agency: "สกท.", topic: "ด้านการพิจารณาการมาเทียบ การบริหารการจัดการและการบริการการบริหารงานของนิติบุคคล" },
    { id: 8, agency: "สกท.", topic: "4. งานพิจารณาการชำระตรวจสอบของระบบงบรายงานงานของแต่ละประจำไตรมาสและการปฏิบัติการสำคัญในการก่อสร้างและระบบงาน" },
    { id: 9, agency: "สกท.", topic: "ด้านการพิจารณาเรื่องเสนอการพิจารณาติดตามการปฏิบัติงานนโยบาย" },
    { id: 10, agency: "สกท.", topic: "ด้านการพิจารณาเรื่องการพิจารณาการบริหารและเสนอแผนปฏิบัติการด้านผลการดำเนินงานการปฏิบัติงานตามกรมเพื่อประกอบการติดตามข้อเสนอแนะกรอบการทำงานและประจำแนวการปฏิบัติแนวทาง" },
    { id: 11, agency: "สกท.", topic: "บรรจุนักเรียนฝึกงานและนักเรียนประเมินการปฏิบัติงาน" },
    { id: 12, agency: "สกท.", topic: "ด้านการบัณฑิตเฉพาะกิจการเรียนการสอนเข้าเหล็กปี้มากเกี่ยวการเหล็ก งามที่ชุกขสำหรับจากสำนักงาน" },
    { id: 13, agency: "สกท.", topic: "ปฏิบัติงานออกแบบจากการฝึกอบรมการบริหารเท่ากับการชุดแซม งานใจโดยให้ประกังไดรเวอร์ประจำนขาเนื่องเอน" },
    { id: 14, agency: "สกน.", topic: "ภัยจาก วิสัยใหญ่ และประกอบการควบคุมรองการต้องการการความงานรวมการดำเนินการเปิดประจำการอย่างงามเทา" }
  ]);

  const [data2569, setData2569] = React.useState(() => [
    { id: 1, agency: "สกท.", topic: "งานตรวจการใช้จ่ายเงินที่ได้รับการอุดหนุนจากรัฐบาลด้านงานพัฒนา", score: "3/45", note: "เพื่อให้การตรวจเดียวกับการตรวจสอบ" },
    { id: 2, agency: "สกท.", topic: "งานตรวจสอบการบริหารบุคคลในระดับข้อกำหนดเฉพาะตำแหน่งนักพัฒนาการเฉพาะพื้นที่และการพิจารณาประเมินระบบบุคคล (FTA)", score: "3/45", note: "เพื่อให้การตรวจเดียวกับการตรวจสอบ" }
  ]);

  // Counter for generating new IDs
  const [nextId, setNextId] = React.useState(15);

  // Handle moving items from 2568 to 2569
  const moveToRight = () => {
    const selectedItems = Object.keys(checkedItems2568)
      .filter(id => checkedItems2568[parseInt(id)])
      .map(id => data2568.find((item: { id: number; agency: string; topic: string }) => item.id === parseInt(id)))
      .filter((item): item is { id: number; agency: string; topic: string } => item !== undefined);

    if (selectedItems.length > 0) {
      // Add items to 2569 with new IDs and default score/note
      const newItems = selectedItems.map((item, index: number) => ({
        ...item,
        id: nextId + data2569.length + index,
        score: "",
        note: ""
      }));
      
      setData2569(prev => [...prev, ...newItems]);
      
      // Remove items from 2568
      const selectedIds = Object.keys(checkedItems2568)
        .filter(id => checkedItems2568[parseInt(id)])
        .map(id => parseInt(id));
      
      setData2568(prev => prev.filter(item => !selectedIds.includes(item.id)));
      
      // Clear selections and update next ID
      setCheckedItems2568({});
      setNextId(prev => prev + selectedItems.length);
      
      console.log('Moved items to 2569:', selectedItems);
    }
  };

  // Handle moving items from 2569 to 2568
  const moveToLeft = () => {
    const selectedItems = Object.keys(checkedItems2569)
      .filter(id => checkedItems2569[parseInt(id)])
      .map(id => data2569.find((item: { id: number; agency: string; topic: string; score: string; note: string }) => item.id === parseInt(id)))
      .filter((item): item is { id: number; agency: string; topic: string; score: string; note: string } => item !== undefined);

    if (selectedItems.length > 0) {
      // Add items to 2568 with new IDs (remove score and note)
      const newItems = selectedItems.map((item, index: number) => ({
        id: nextId + data2568.length + index,
        agency: item.agency,
        topic: item.topic
      }));
      
      setData2568(prev => [...prev, ...newItems]);
      
      // Remove items from 2569
      const selectedIds = Object.keys(checkedItems2569)
        .filter(id => checkedItems2569[parseInt(id)])
        .map(id => parseInt(id));
      
      setData2569(prev => prev.filter(item => !selectedIds.includes(item.id)));
      
      // Clear selections and update next ID
      setCheckedItems2569({});
      setNextId(prev => prev + selectedItems.length);
      
      console.log('Moved items to 2568:', selectedItems);
    }
  };

  // Handle checkbox changes for 2568
  const handleCheckboxChange2568 = (id: number, checked: boolean) => {
    setCheckedItems2568(prev => ({
      ...prev,
      [id]: checked
    }));
  };

  // Handle checkbox changes for 2569
  const handleCheckboxChange2569 = (id: number, checked: boolean) => {
    setCheckedItems2569(prev => ({
      ...prev,
      [id]: checked
    }));
  };

  // Handle confirm button click
  const handleConfirmClick = () => {
    setShowConfirmDialog(true);
  };

  // Get statistics
  const getStatistics = () => {
    const totalSelections2568 = Object.keys(checkedItems2568).length;
    const totalSelections2569 = Object.keys(checkedItems2569).length;
    
    return {
      total2568: totalSelections2568,
      total2569: totalSelections2569,
      totalItems2568: data2568.length,
      totalItems2569: data2569.filter((item: { topic: string }) => item.topic.trim() !== "").length
    };
  };

  const stats = getStatistics();

  return (
    <div className="flex flex-1 flex-col gap-4 p-2 sm:p-4 pt-0">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
            จัดการข้อมูลงานตรวจสอบ ปีงบประมาณ 2569
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            เปรียบเทียบปีงบประมาณ 2568 กับ ปีงบประมาณ 2569
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-muted-foreground">สถานะ:</span>
            <span className="text-sm text-blue-600 underline cursor-pointer">
              ข้อมูลสำรวจงานตรวจสอบภายใน
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Button className="bg-[#3E52B9] hover:bg-[#2A3A8F] text-white flex items-center gap-2">
            เสนอหัวหน้าหน่วยตรวจสอบ
          </Button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-0 border-b overflow-x-auto">
        <button className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-[#3E52B9] border-b-2 border-blue-600 whitespace-nowrap">
          ทั้งหมด
        </button>
        <button className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 whitespace-nowrap">
          หน่วยงาน
        </button>
        <button className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 whitespace-nowrap">
          งาน
        </button>
        <button className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 whitespace-nowrap">
          โครงการ
        </button>
        <button className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 whitespace-nowrap">
          โครงการลงทุนสาธารณูปโภค
        </button>
        <button className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 whitespace-nowrap">
          กิจกรรม
        </button>
        <button className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 whitespace-nowrap">
          การบริหาร
        </button>
        <button className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 whitespace-nowrap">
          IT และ Non-IT
        </button>
      </div>

      {/* Action Button */}
      <div className="flex justify-end">
        <Button 
          className="bg-[#3E52B9] hover:bg-[#2A3A8F] text-white flex items-center gap-2"
          onClick={handleConfirmClick}
        >
          เพิ่มข้อกำหนดตรวจสอบ
        </Button>
      </div>

      {/* Comparison Tables with Transfer Buttons */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 items-start">
        {/* Year 2568 Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              ปีงบประมาณ 2568
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm w-12"></TableHead>
                    <TableHead className="text-xs sm:text-sm">ลำดับ</TableHead>
                    <TableHead className="text-xs sm:text-sm min-w-[120px]">หน่วยงาน/กิจกรรม/โครงการ</TableHead>
                    <TableHead className="text-xs sm:text-sm min-w-[200px]">หัวข้อของงานตรวจสอบ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data2568.map((item: { id: number; agency: string; topic: string }) => (
                    <TableRow key={item.id}>
                      <TableCell className="text-xs sm:text-sm">
                        <Checkbox
                          checked={checkedItems2568[item.id] || false}
                          onCheckedChange={(checked) => handleCheckboxChange2568(item.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm">{item.id}</TableCell>
                      <TableCell className="text-xs sm:text-sm font-medium">{item.agency}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{item.topic}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Transfer Buttons */}
        <div className="lg:col-span-1 flex flex-col items-center justify-center gap-1  border">
          <Button
            onClick={moveToRight}
            disabled={Object.keys(checkedItems2568).length === 0}
            className="bg-[#3E52B9] hover:bg-[#2A3A8F] text-white p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            size="sm"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          
          <div className="text-xs text-gray-500 text-center">
            ย้าย
          </div>
          
          <Button
            onClick={moveToLeft}
            disabled={Object.keys(checkedItems2569).length === 0}
            className="bg-[#3E52B9] hover:bg-[#2A3A8F] text-white p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            size="sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </div>

        {/* Year 2569 Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              ปีงบประมาณ 2569
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm w-12"></TableHead>
                    <TableHead className="text-xs sm:text-sm">ลำดับ</TableHead>
                    <TableHead className="text-xs sm:text-sm min-w-[120px]">หน่วยงาน/กิจกรรม/โครงการ</TableHead>
                    <TableHead className="text-xs sm:text-sm min-w-[180px]">หัวข้อของงานตรวจสอบ</TableHead>
                    <TableHead className="text-xs sm:text-sm">คะแนน</TableHead>
                    <TableHead className="text-xs sm:text-sm">หมายเหตุ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data2569.map((item: { id: number; agency: string; topic: string; score: string; note: string }) => (
                    <TableRow key={item.id}>
                      <TableCell className="text-xs sm:text-sm">
                        <Checkbox
                          checked={checkedItems2569[item.id] || false}
                          onCheckedChange={(checked) => handleCheckboxChange2569(item.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm">{item.id}</TableCell>
                      <TableCell className="text-xs sm:text-sm font-medium">{item.agency}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{item.topic}</TableCell>
                      <TableCell className="text-xs sm:text-sm text-center">
                        {item.score && item.score !== "-" && item.score !== "" && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            {item.score}
                          </span>
                        )}
                        {item.score === "-" && <span className="text-gray-400">-</span>}
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm text-gray-600">
                        {item.note === "-" ? <span className="text-gray-400">-</span> : item.note}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              ยืนยันการเพิ่มข้อกำหนดตรวจสอบ
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-gray-600 mb-4">
              ยืนยันการเพิ่มข้อกำหนดตรวจสอบจากปี 2568 ไปยังปี 2569
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p className="text-sm">
                <strong>ข้อมูลที่เลือกจากปี 2568:</strong>
              </p>
              <p className="text-sm">จำนวนรายการที่เลือก: {stats.total2568} รายการ</p>
              <p className="text-sm">จาก {stats.totalItems2568} รายการทั้งหมด</p>
            </div>
            
            <p className="text-sm text-gray-600 mt-4">
              คุณต้องการดำเนินการต่อหรือไม่?
            </p>
          </div>

          <DialogFooter className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowConfirmDialog(false)}
              className="flex-1"
            >
              ยกเลิก
            </Button>
            <Button 
              onClick={() => {
                setShowConfirmDialog(false);
                console.log('Confirmed selections 2568:', checkedItems2568);
                console.log('Confirmed selections 2569:', checkedItems2569);
              }}
              className="bg-[#3E52B9] hover:bg-[#2A3A8F] text-white flex-1"
            >
              ยืนยัน
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
