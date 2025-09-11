"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FileText } from 'lucide-react';

export default function CommentPage() {
  const [selectedYear, setSelectedYear] = React.useState<string>("2568");
  const [checkedItems, setCheckedItems] = React.useState<Record<number, boolean>>({});
  const [showCheckboxes, setShowCheckboxes] = React.useState<boolean>(false);
  const [showConfirmDialog, setShowConfirmDialog] = React.useState<boolean>(false);

  // Chart data based on the image
  const chartData = [
    { name: 'หน่วยงาน', ปีงบประมาณ2567: 4, ปีงบประมาณ2568: 4 },
    { name: 'งาน', ปีงบประมาณ2567: 8, ปีงบประมาณ2568: 10 },
    { name: 'โครงการ', ปีงบประมาณ2567: 6, ปีงบประมาณ2568: 8 },
    { name: 'โครงการลงทุนสาธารณูปโภค', ปีงบประมาณ2567: 10, ปีงบประมาณ2568: 8 },
    { name: 'กิจกรรม', ปีงบประมาณ2567: 14, ปีงบประมาณ2568: 16 },
    { name: 'การบริหาร', ปีงบประมาณ2567: 16, ปีงบประมาณ2568: 18 },
    { name: 'IT และ Non-IT', ปีงบประมาณ2567: 18, ปีงบประมาณ2568: 20 }
  ];

  // Table data for 2568
  const tableData2568 = [
    { id: 1, agency: "สกท.", topic: "การตรวจสอบการปฏิบัติงานด้านการเงินการคลังของหน่วยงาน", score: "3/45", note: "การตรวจสอบการเงินคลังครบถ้วน" },
    { id: 2, agency: "สกท.", topic: "การตรวจสอบการปฏิบัติงานด้านบุคคลและการบริหารทรัพยากรบุคคล", score: "3/45", note: "การตรวจสอบการบริหารบุคคลครบถ้วน" },
    { id: 3, agency: "สกท.", topic: "ปฏิบัติการตรวจสอบด้านต่างๆ", score: "3/45", note: "" },
    { id: 4, agency: "สกท.", topic: "ปฏิบัติการตรวจสอบสำนักงาน", score: "3/45", note: "" },
    { id: 5, agency: "สกท.", topic: "ด้านริหารการเก็บรักษาเงินกำไรสะสมการพัฒนากิจการพลังงานนอกจากไฟฟ้า", score: "3/45", note: "" },
    { id: 6, agency: "สกท.", topic: "ด้านเงินช่วยเหลือ งบประมาณ และการเงิน โครงการ เพื่อสำคัญ", score: "3/45", note: "" },
    { id: 7, agency: "สกท.", topic: "ด้านเงินช่วยเหลือ ทุนสำคัญประจำการบริหารงาน ก่อสร้าง การคลังงบประมาณ", score: "3/45", note: "" },
    { id: 8, agency: "สกท.", topic: "ปฏิบัติการตรวจสอบการเตรียมความพร้อมและการตรวจสอบด้านต่างๆและการบริหารงานความปลอดภัย", score: "3/45", note: "" },
    { id: 9, agency: "สกท.", topic: "ด้านการติดตามการปฏิบัติงานที่ได้ให้ คำแนะนำข้อเสนอแนะจากการตรวจสอบภายใน", score: "3/45", note: "" },
    { id: 10, agency: "สกท.", topic: "ด้านการติดตามการปฏิบัติงานตามที่ได้ให้ข้อเสนอแนะจากหน่วยงานภายนอก", score: "3/45", note: "" },
    { id: 11, agency: "สกท.", topic: "งานพิจารณาหลักเกณฑ์การตรวจสอบด้านต่างๆ", score: "", note: "" },
    { id: 12, agency: "สกท.", topic: "ด้านเงินอุดหนุนที่ได้รับจากรัฐบาล งบประมาณแผ่นดินและเงินอุดหนุนที่ได้รับจากหน่วยงานอื่น", score: "3/45", note: "" },
    { id: 13, agency: "สกท.", topic: "ปฏิบัติการตรวจสอบการปฏิบัติงานตามอำนาจหน้าที่ จากข้อกฎหมายที่เกี่ยวข้อง", score: "", note: "" },
    { id: 14, agency: "กสน.", topic: "งาน โครงการ และงบประมาณการพัฒนากิจการพลังงาน ประจำปีงบประมาณ", score: "3/45", note: "" },
    { id: 15, agency: "กสน.", topic: "งาน โครงการ และงบประมาณที่ได้รับจากเงินกำไรสะสมพลังงาน งบประมาณแผ่นดิน", score: "3/45", note: "" },
    { id: 16, agency: "กสน.", topic: "งาน โครงการ และงบประมาณการพัฒนากิจการพลังงาน", score: "3/45", note: "" }
  ];

  // Handle checkbox changes
  const handleCheckboxChange = (id: number, checked: boolean) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: checked
    }));
  };

  // Handle confirm button click
  const handleConfirmClick = () => {
    setShowCheckboxes(true);
  };

  // Handle final confirmation
  const handleFinalConfirm = () => {
    setShowConfirmDialog(true);
  };

  // Check if user has made any selections
  const hasSelections = Object.keys(checkedItems).length > 0;

  // Get statistics
  const getStatistics = () => {
    const agreeCount = Object.values(checkedItems).filter(value => value === true).length;
    const disagreeCount = Object.values(checkedItems).filter(value => value === false).length;
    const totalSelections = agreeCount + disagreeCount;
    
    return {
      agreeCount,
      disagreeCount,
      totalSelections,
      totalItems: tableData2568.length
    };
  };

  const stats = getStatistics();

  return (
    <div className="flex flex-1 flex-col gap-4 p-2 sm:p-4 pt-0">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
            ความเห็นข้อสังเกตการตรวจสอบ (Audit Universe)
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            เปรียบเทียบข้อมูลปีงบประมาณ 2567 กับ ปีงบประมาณ 2568
          </p>

           <div className="flex items-center gap-2">
          <span className="text-sm font-medium">ปีงบประมาณ</span>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2567">2567</SelectItem>
              <SelectItem value="2568">2568</SelectItem>
            </SelectContent>
          </Select>
        </div>
        </div>
      </div>

      {/* Chart Section with Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">
                ความเห็นข้อสังเกตการตรวจสอบ (Audit Universe)
              </CardTitle>
              <p className="text-sm text-muted-foreground">เปรียบเทียบข้อมูลปีงบประมาณ 2567 กับ ปีงบประมาณ 2568</p>
            </CardHeader>
            <CardContent>
              <div className="w-full h-80">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={chartData} 
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                      barCategoryGap="20%"
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 10, fill: '#666' }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        axisLine={{ stroke: '#e0e0e0' }}
                        tickLine={{ stroke: '#e0e0e0' }}
                      />
                      <YAxis 
                        tick={{ fontSize: 12, fill: '#666' }}
                        axisLine={{ stroke: '#e0e0e0' }}
                        tickLine={{ stroke: '#e0e0e0' }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e0e0e0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Legend 
                        wrapperStyle={{ paddingTop: '20px' }}
                        iconType="circle"
                      />
                      <Bar 
                        dataKey="ปีงบประมาณ2567" 
                        fill="#FF8C42" 
                        name="ปีงบประมาณ 2567" 
                        radius={[2, 2, 0, 0]}
                        maxBarSize={40}
                      />
                      <Bar 
                        dataKey="ปีงบประมาณ2568" 
                        fill="#2F335D" 
                        name="ปีงบประมาณ 2568" 
                        radius={[2, 2, 0, 0]}
                        maxBarSize={40}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500">ไม่มีข้อมูล</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Cards */}
        <div className="space-y-4">
          <Card className="">
            <CardHeader className="text-center pb-4">
              <h3 className="text-sm font-medium text-blue-700">
                สรุปข้อมูลจำนวนความเห็นข้อสังเกตทั้งหมด
              </h3>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 2567 Summary */}
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-600">ข้อสังเกตการตรวจสอบทั้งหมด</p>
                    <p className="text-sm font-medium">ปีงบประมาณ 2567</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-6 border">
                  <p className="text-4xl font-bold text-gray-900">25</p>
                  <p className="text-sm text-gray-600 mt-1">ข้อสังเกต</p>
                </div>
              </div>

              {/* 2568 Summary */}
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-600">ข้อสังเกตการตรวจสอบทั้งหมด</p>
                    <p className="text-sm font-medium">ปีงบประมาณ 2568</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-6 border">
                  <p className="text-4xl font-bold text-gray-900">26</p>
                  <p className="text-sm text-gray-600 mt-1">ข้อสังเกต</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base sm:text-lg">
                ข้อตรวจของงานตรวจสอบที่พบข้อสังเกต สกท. ปีงบประมาณ 2568
              </CardTitle>
              <p className="text-sm text-blue-600 mt-1">
                การดำเนินการอนุมัติจำนวนข้อ 30 จาก 68 เรื่อง (23.95 น.)
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                สถานะ: หน่วยงานไม่ได้กรอกข้อมูลสถานะคืน
              </p>
            </div>
            
            <Button 
              className="bg-[#3E52B9] hover:bg-[#2A3A8F] text-white flex items-center gap-2"
              onClick={handleConfirmClick}
            >
              ยืนยันความคิดเห็น
            </Button>
          </div>
        </CardHeader>
        
        {/* Category Tabs */}
        <div className="px-6">
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
        </div>

        <CardContent>
          {/* Year Display */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">ปีงบประมาณ 2568</h3>
          </div>
          
          {/* Show confirm button when user has made selections */}
          {showCheckboxes && hasSelections && (
            <div className="mb-4 flex justify-end">
              <Button 
                onClick={handleFinalConfirm}
                className="bg-[#3E52B9] hover:bg-[#2A3A8F] text-white"
              >
                ยืนยันการเลือก
              </Button>
            </div>
          )}
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">ลำดับ</TableHead>
                  <TableHead className="text-xs sm:text-sm min-w-[100px]">หน่วยงาน/กิจกรรม/โครงการ</TableHead>
                  <TableHead className="text-xs sm:text-sm min-w-[300px]">หัวข้อความเห็นข้อสังเกต</TableHead>
                  {showCheckboxes && (
                    <>
                      <TableHead className="text-xs sm:text-sm text-center">เห็นด้วย</TableHead>
                      <TableHead className="text-xs sm:text-sm text-center">ไม่เห็นด้วย</TableHead>
                    </>
                  )}
                  <TableHead className="text-xs sm:text-sm text-center">คะแนน</TableHead>
                  <TableHead className="text-xs sm:text-sm min-w-[200px]">หมายเหตุ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData2568.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-xs sm:text-sm">{item.id}</TableCell>
                    <TableCell className="text-xs sm:text-sm font-medium">{item.agency}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{item.topic}</TableCell>
                    {showCheckboxes && (
                      <>
                        <TableCell className="text-xs sm:text-sm text-center">
                          <Checkbox
                            checked={checkedItems[item.id] === true}
                            onCheckedChange={(checked) => handleCheckboxChange(item.id, checked as boolean)}
                            className="mx-auto"
                          />
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm text-center">
                          <Checkbox
                            checked={checkedItems[item.id] === false}
                            onCheckedChange={(checked) => handleCheckboxChange(item.id, !(checked as boolean))}
                            className="mx-auto"
                          />
                        </TableCell>
                      </>
                    )}
                    <TableCell className="text-xs sm:text-sm text-center">
                      {item.score && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {item.score}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm text-gray-600">{item.note}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              ยืนยันความคิดเห็น
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-gray-600 mb-4">
              ยืนยันความคิดเห็นกับข้อของงานตรวจสอบ
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p className="text-sm">
                <strong>ข้อของงานตรวจสอบทั้งหมด (Audit Universe) ปีงบประมาณ 2568</strong>
              </p>
              <p className="text-sm">ได้ความเห็นรวมทั้งหมด {stats.totalSelections} ข้อของงานตรวจสอบ</p>
              <p className="text-sm">เห็นด้วย {stats.agreeCount} ข้อของงานตรวจสอบ</p>
              <p className="text-sm">ไม่เห็นด้วย {stats.disagreeCount} ข้อของงานตรวจสอบ</p>
            </div>
            
            <p className="text-sm text-gray-600 mt-4">
              คุณต้องการยืนยันความเห็นนี้หรือไม่
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
                // Handle confirmation logic here
                console.log('ยืนยันความคิดเห็น:', checkedItems);
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
