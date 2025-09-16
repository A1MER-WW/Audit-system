"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Bar, BarChart } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText } from 'lucide-react';
import Link from 'next/link';

// Sample data for charts - showing "no data" state
// const auditProgressData = [
//   { month: 'หน่วยงาน', year2567: 0, year2568: 0 },
//   { month: 'งาน', year2567: 0, year2568: 0 },
//   { month: 'โครงการ', year2567: 0, year2568: 0 },
//   { month: 'โครงการลงทุนการสาธารณูปโภค', year2567: 0, year2568: 0 },
//   { month: 'กิจกรรม', year2567: 0, year2568: 0 },
//   { month: 'การบริการ', year2567: 0, year2568: 0 },
//   { month: 'บริการประชาชน', year2567: 0, year2568: 0 }
// ];

const chartData = [
  { name: 'หน่วยงาน', ปีงบประมาณ2567: 4, ปีงบประมาณ2568: 4 },
  { name: 'งาน', ปีงบประมาณ2567: 8, ปีงบประมาณ2568: 10 },
  { name: 'โครงการ', ปีงบประมาณ2567: 6, ปีงบประมาณ2568: 8 },
  { name: 'โครงการลงทุนสาธารณูปโภค', ปีงบประมาณ2567: 10, ปีงบประมาณ2568: 8 },
  { name: 'กิจกรรม', ปีงบประมาณ2567: 14, ปีงบประมาณ2568: 16 },
  { name: 'การบริหาร', ปีงบประมาณ2567: 16, ปีงบประมาณ2568: 18 },
  { name: 'IT และ Non-IT', ปีงบประมาณ2567: 18, ปีงบประมาณ2568: 20 }
];

// Table data for 2567
const tableData2567 = [
  { id: 1, agency: "สกท.", topic: "งานตรวจการใช้จ่ายเงินที่ได้รับการอุดหนุนจากรัฐบาลด้านงานพัฒนา" },
  { id: 2, agency: "สกท.", topic: "งานตรวจสอบการบริหารบุคคลในระดับข้อกำหนดเฉพาะตำแหน่งนักพัฒนาการเฉพาะพื้นที่และการพิจารณาและระบบบุคคล (FTA)" },
  { id: 3, agency: "สกท.", topic: "ปฏิบัติงานตรวจสอบภายใน" },
  { id: 4, agency: "สกท.", topic: "ปฏิบัติงานตรวจสอบภายใน" },
  { id: 5, agency: "สกท.", topic: "ด้านการพิจารณาอนุมัติงานในงบประมาณประจำปีงบประมาณ 2567" },
  { id: 6, agency: "สกท.", topic: "ภัยจากวิสัยใหญ่และประกอบการทำงานออกแบบ โครงการงบประมาณสำนักงานในอีกสำนักงานภายในประเทศและลักษณะข้อแนะนำในประเทศงานตรวจสอบและเสนอบอร์ดมติความคืน ตรวจสอบ" },
  { id: 7, agency: "สกท.", topic: "ด้านการพิจารณาการมาเทียบ การบริหารการจัดการและการบริการการบริหารงานของนิติบุคคลที่มีการปฏิบัติต่อกำหนด" },
  { id: 8, agency: "สกท.", topic: "4. งานพิจารณาการชำระตรวจสอบของระบบงบรายงานงานของแต่ละประจำไตรมาสและการปฏิบัติการสำคัญในการก่อสร้างและระบบงาน" },
  { id: 9, agency: "สกท.", topic: "ด้านการพิจารณาเรื่องเสนอการพิจารณาติดตามการปฏิบัติงานนโยบายประจำปีงบ" },
  { id: 10, agency: "สกท.", topic: "ด้านการพิจารณาเรื่องการพิจารณาการบริหารและเสนอแผนปฏิบัติการด้านผลการดำเนินงานการปฏิบัติงานตามกรมเพื่อประกอบการติดตามข้อเสนอแนะกรอบการทำงานและประจำแนวการปฏิบัติแนวทาง" },
  { id: 11, agency: "สกท.", topic: "บรรจุนักเรียนฝึกงานและนักเรียนประเมินการปฏิบัติงาน" },
  { id: 12, agency: "สกท.", topic: "ด้านการบัณฑิตเฉพาะกิจการเรียนการสอนเข้าเหล็กปี้มากเกี่ยวการเหล็ก งามที่ชุกขสำหรับจากสำนักงาน" },
  { id: 13, agency: "สกท.", topic: "ปฏิบัติงานออกแบบจากการฝึกอบรมการบริหารเท่ากับการชุดแซม งานใจโดยให้ประกังไดรเวอร์ประจำนขาเนื่องเอน" },
  { id: 14, agency: "สกน.", topic: "ภัยจาก วิสัยใหญ่ และประกอบการควบคุมรองการต้องการการความงานรวมการดำเนินการเปิดประจำการอย่างงามเทา และที่เข้าใจข้อมูลไฟฟ้าการการรวบสังเกเต" }
];

// Table data for 2568
const tableData2568 = [
  { id: 1, agency: "สกท.", topic: "งานตรวจการใช้จ่ายเงินที่ได้รับการอุดหนุนจากรัฐบาลด้านงานพัฒนา", score: "3/45", note: "เพื่อให้การตรวจเดียวกับการตรวจสอบ" },
  { id: 2, agency: "สกท.", topic: "งานตรวจสอบการบริหารบุคคลในระดับข้อกำหนดเฉพาะตำแหน่งนักพัฒนาการเฉพาะพื้นที่และการพิจารณาประเมินระบบบุคคล (FTA)", score: "3/45", note: "เพื่อให้การตรวจเดียวกับการตรวจสอบ" },
  { id: 3, agency: "สกท.", topic: "", score: "-", note: "-" },
  { id: 4, agency: "สกท.", topic: "", score: "-", note: "-" },
  { id: 5, agency: "สกท.", topic: "", score: "-", note: "-" },
  { id: 6, agency: "สกท.", topic: "", score: "", note: "" },
  { id: 7, agency: "สกท.", topic: "", score: "", note: "" },
  { id: 8, agency: "สกท.", topic: "", score: "", note: "" },
  { id: 9, agency: "สกท.", topic: "", score: "", note: "" },
  { id: 10, agency: "สกท.", topic: "", score: "", note: "" },
  { id: 11, agency: "สกท.", topic: "", score: "-", note: "-" },
  { id: 12, agency: "สกท.", topic: "", score: "-", note: "-" },
  { id: 13, agency: "สกท.", topic: "", score: "-", note: "-" },
  { id: 14, agency: "สกน.", topic: "", score: "", note: "" }
];


export default function PlanauditPage() {
  const [selectedYear, setSelectedYear] = React.useState<string>("2568");

  return (
    <div className="flex flex-1 flex-col gap-4 p-2 sm:p-4 pt-0">
      {/* Year Selection */}
      <div className="mt-2 mb-4 ">
        <h1 className="text-lg sm:text-xl font-semibold">แผนการตรวจสอบภายใน</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">เลือกปีงบประมาณ:</span>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="เลือกปี" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2566">ปี 2566</SelectItem>
              <SelectItem value="2567">ปี 2567</SelectItem>
              <SelectItem value="2568">ปี 2568</SelectItem>
              <SelectItem value="2569">ปี 2569</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Chart Section - Takes 2 columns on large screens, full width on smaller */}
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

        {/* Statistics Summary Card - Takes 1 column on large screens, full width on smaller */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">สรุปข้อมูลหัวข้องานตรวจสอบภายใน</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 flex ">
            {/* Year 2567 Card */}
            <div className="p-3 sm:p-4 rounded-lg w-full">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm  font-medium">หัวข้อการตรวจสอบภายใน</div>
                  <div className="text-xs ">ปีงบประมาณ 2567</div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-4xl font-bold  mb-1">{tableData2567.length}</div>
                <div className="text-xs sm:text-sm ">หัวข้อ</div>
              </div>
            </div>

            {/* Year 2568 Card */}
            <div className="p-3 sm:p-4  rounded-lg w-full">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm  font-medium">หัวข้อการตรวจสอบภายใน</div>
                  <div className="text-xs ">ปีงบประมาณ 2568</div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-4xl font-bold  mb-1">{tableData2568.filter(item => item.topic.trim() !== "").length}</div>
                <div className="text-xs sm:text-sm ">หัวข้อ</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section - Full Width Table */}
      <Card className="col-span-full">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <CardTitle className="text-base sm:text-lg">ความครอบคลุมการปรับปรุงหัวข้อของงานตรวจสอบภายในหัวข้อต่างๆ</CardTitle>
          <Link href="/planaudit/audittopics">
            <Button size="sm" className="bg-[#3E52B9] hover:bg-[#2A3A8F] text-white">
              อัปเดตข้อมูลการสำรวจงานตรวจสอบ
            </Button>
          </Link>

        </CardHeader>
        <CardContent>
          <div className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
            เปรียบเทียบปีงบประมาณ 2567 กับ ปีงบประมาณ 2568
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
            สถานะ: <span className="text-blue-600 underline cursor-pointer">ไม่มีข้อมูล</span>
          </div>

          {/* Tabs - Scrollable on mobile */}
          <div className="flex gap-0 mb-4 border-b overflow-x-auto">
            <button className="px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-[#3E52B9] hover:bg-[#2A3A8F] text-white border-b-2 border-blue-600 whitespace-nowrap">
              ทั้งหมด
            </button>
            <button className="px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 whitespace-nowrap">
              หน่วยงาน
            </button>
            <button className="px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 whitespace-nowrap">
              งาน
            </button>
            <button className="px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 whitespace-nowrap">
              โครงการ
            </button>
            <button className="px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 whitespace-nowrap">
              โครงการลงทุนการสาธารณูปโภค
            </button>
            <button className="px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 whitespace-nowrap">
              กิจกรรม
            </button>
            <button className="px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 whitespace-nowrap">
              การบริการ
            </button>
            <button className="px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 whitespace-nowrap">
              IT และ Non-IT
            </button>
          </div>

          {/* Years comparison - Stack on mobile, side by side on larger screens */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
            {/* Year 2567 */}
            <div>
              <h3 className="font-medium mb-3 sm:mb-4 text-sm sm:text-base">ปีงบประมาณ 2567</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm">ลำดับ</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[150px]">หน่วยงาน/กิจกรรม/โครงการ</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[150px]">หัวข้อของงานตรวจสอบ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tableData2567.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-xs sm:text-sm">{item.id}</TableCell>
                        <TableCell className="text-xs sm:text-sm font-medium">{item.agency}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{item.topic}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Year 2568 */}
            <div>
              <h3 className="font-medium mb-3 sm:mb-4 text-sm sm:text-base">ปีงบประมาณ 2568</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm">ลำดับ</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[120px]">หน่วยงาน/กิจกรรม/โครงการ</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[120px]">หัวข้อของงานตรวจสอบ</TableHead>
                      <TableHead className="text-xs sm:text-sm">คะแนน</TableHead>
                      <TableHead className="text-xs sm:text-sm">หมายเหตุ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tableData2568.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-xs sm:text-sm">{item.id}</TableCell>
                        <TableCell className="text-xs sm:text-sm font-medium">{item.agency}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{item.topic}</TableCell>
                        <TableCell className="text-xs sm:text-sm text-center">
                          {item.score && item.score !== "-" && (
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
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
