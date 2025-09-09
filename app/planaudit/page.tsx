"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, Users, FileText, Clock, Target } from 'lucide-react';
import Link from 'next/link';
// Sample data for charts - showing "no data" state
const auditProgressData = [
  { month: 'หน่วยงาน', year2567: 0, year2568: 0 },
  { month: 'งาน', year2567: 0, year2568: 0 },
  { month: 'โครงการ', year2567: 0, year2568: 0 },
  { month: 'โครงการลงทุนการสาธารณูปโภค', year2567: 0, year2568: 0 },
  { month: 'กิจกรรม', year2567: 0, year2568: 0 },
  { month: 'การบริการ', year2567: 0, year2568: 0 },
  { month: 'บริการประชาชน', year2567: 0, year2568: 0 }
];

const auditCategoryData = [
  { name: 'หน่วยงาน', value: 120, color: '#3b82f6' },
  { name: 'งาน', value: 85, color: '#10b981' },
  { name: 'โครงการ', value: 95, color: '#f59e0b' },
  { name: 'โครงการลงทุนการสาธารณูปโภค', value: 140, color: '#ef4444' },
  { name: 'กิจกรรม', value: 110, color: '#8b5cf6' },
  { name: 'การบริการ', value: 75, color: '#06b6d4' },
  { name: 'IT และ Non-IT', value: 65, color: '#84cc16' }
];

const departmentData = [
  { department: 'หน่วยงาน', year2567: 0, year2568: 0, isFirst: true },
  { department: 'งาน', year2567: 0, year2568: 0 },
  { department: 'โครงการ', year2567: 0, year2568: 0 },
  { department: 'โครงการลงทุนการสาธารณูปโภค', year2567: 0, year2568: 0 },
  { department: 'กิจกรรม', year2567: 0, year2568: 0 },
  { department: 'การบริการ', year2567: 0, year2568: 0 },
  { department: 'IT และ Non-IT', year2567: 0, year2568: 0 }
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

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Chart Section - Takes 2 columns on large screens, full width on smaller */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">การความดำเนินงานจำนวนหัวข้อของงานตรวจสอบภายใน (Audit Universe)</CardTitle>
            <div className="text-xs sm:text-sm text-muted-foreground">
              เปรียบเทียบปีงบประมาณ 2567 กับ ปีงบประมาณ 2568
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative h-[250px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={auditProgressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 10 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    domain={[0, 125]}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="year2567" 
                    stroke="#6b7280" 
                    strokeWidth={2}
                    dot={{ fill: '#6b7280', strokeWidth: 2, r: 3 }}
                    name="ปีงบประมาณ 2567"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="year2568" 
                    stroke="#f97316" 
                    strokeWidth={2}
                    dot={{ fill: '#f97316', strokeWidth: 2, r: 3 }}
                    name="ปีงบประมาณ 2568"
                  />
                </LineChart>
              </ResponsiveContainer>
              
              {/* No Data Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center bg-white px-3 py-2 rounded-lg shadow-sm border">
                  <div className="text-sm sm:text-lg text-gray-500">ไม่มีข้อมูล</div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                <span className="text-xs sm:text-sm">ปีงบประมาณ 2567</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-xs sm:text-sm">ปีงบประมาณ 2568</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Summary Card - Takes 1 column on large screens, full width on smaller */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">สรุปข้อมูลหัวข้องานตรวจสอบภายใน</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 flex">
            {/* Year 2567 Card */}
            <div className="p-3 sm:p-4 rounded-lg">
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
                <div className="text-2xl sm:text-4xl font-bold  mb-1">0</div>
                <div className="text-xs sm:text-sm ">หัวข้อ</div>
              </div>
            </div>

            {/* Year 2568 Card */}
            <div className="p-3 sm:p-4  rounded-lg">
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
                <div className="text-2xl sm:text-4xl font-bold  mb-1">0</div>
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
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-6 sm:py-8 text-gray-500 text-xs sm:text-sm">
                        ไม่มีข้อมูล
                      </TableCell>
                    </TableRow>
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
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 sm:py-8 text-gray-500 text-xs sm:text-sm">
                        ไม่มีข้อมูล
                      </TableCell>
                    </TableRow>
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
