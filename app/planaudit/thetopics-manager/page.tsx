"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { SignatureComponent } from '@/components/signature-component';
import { OTPVerification } from '@/components/otp-verification';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { FileText,  } from 'lucide-react';

export default function TopicsManagerPage() {
  const [selectedYear, setSelectedYear] = React.useState<string>("2568");
  const [selectedDepartment, setSelectedDepartment] = React.useState<string>("ทุกหน่วยงาน");
  const [showApprovalDialog, setShowApprovalDialog] = React.useState<boolean>(false);
  const [showSignatureDialog, setShowSignatureDialog] = React.useState<boolean>(false);
  const [showSubmitDialog, setShowSubmitDialog] = React.useState<boolean>(false);
  const [approvalStep, setApprovalStep] = React.useState<number>(1);
  const [comment, setComment] = React.useState<string>("");
  const [signatureChoice, setSignatureChoice] = React.useState<'new' | 'saved' | null>(null);
  const [signatureData, setSignatureData] = React.useState<{name: string; signature: string | null}>({name: "", signature: null});
  const [otpValue, setOtpValue] = React.useState<string>("");
  const [isOtpValid, setIsOtpValid] = React.useState<boolean>(false);

  // Handle submit to supervisor
  const handleSubmitToSupervisor = () => {
    setShowSubmitDialog(false);
    setShowSignatureDialog(true);
    setApprovalStep(1);
  };

  // Handle first approval step
  const handleFirstApproval = () => {
    setShowApprovalDialog(false);
    setShowSignatureDialog(true);
    setApprovalStep(1);
  };

  // Handle signature choice
  const handleSignatureChoice = (choice: 'new' | 'saved') => {
    setSignatureChoice(choice);
    if (choice === 'saved') {
      setApprovalStep(2); // Go to OTP step
    }
  };

  // Handle OTP verification
  const handleOTPChange = (value: string) => {
    setOtpValue(value);
    setIsOtpValid(value === "123456"); // Demo OTP validation
  };

  // Final approval with signature
  const handleFinalApproval = () => {
    if (signatureChoice === 'saved' && !isOtpValid) {
      alert('กรุณากรอกรหัส OTP ให้ถูกต้อง');
      return;
    }
    if (signatureChoice === 'new' && !signatureData.signature) {
      alert('กรุณาลงลายเซ็น');
      return;
    }
    
    setShowSignatureDialog(false);
    console.log('Final approval completed:', {
      comment,
      signatureChoice,
      signatureData,
      otpValue
    });
    
    // Reset all states
    setApprovalStep(1);
    setSignatureChoice(null);
    setSignatureData({name: "", signature: null});
    setOtpValue("");
    setIsOtpValid(false);
    setComment("");
  };

  // Chart data based on the image
  const chartData = [
    { name: 'หน่วยงาน', ปีงบประมาণ2567: 4, ปีงบประมาณ2568: 4 },
    { name: 'งาน', ปีงบประมาณ2567: 100, ปีงบประมาณ2568: 11 },
    { name: 'โครงการ', ปีงบประมาณ2567: 10, ปีงบประมาณ2568: 11 },
    { name: 'โครงการลงทุนสาธารณูปโภค', ปีงบประมาณ2567: 2, ปีงบประมาณ2568: 1 },
    { name: 'กิจกรรม', ปีงบประมาณ2567: 1, ปีงบประมาณ2568: 1 },
    { name: 'การบริหาร', ปีงบประมาณ2567: 2, ปีงบประมาณ2568: 2 },
    { name: 'IT และ Non-IT', ปีงบประมาณ2567: 100, ปีงบประมาณ2568: 85 }
  ];

  // Table data for year 2567
  const tableData2567 = [
    { id: 1, department: "สกท.", topic: "งานตรวจการใช้จ่ายเงินที่ได้รับการอุดหนุนจากรัฐบาลด้านงานพัฒนา" },
    { id: 2, department: "สกท.", topic: "งานตรวจสอบการบริหารบุคคลในระดับข้อกำหนดเฉพาะตำแหน่งนักพัฒนาการเฉพาะพื้นที่และการพิจารณาประเมินระบบบุคคล (FTA)" },
    { id: 3, department: "สกท.", topic: "ปฏิบัติงานตรวจสอบภายใน" },
    { id: 4, department: "สกท.", topic: "ปฏิบัติงานตรวจสอบภายใน" },
    { id: 5, department: "สกท.", topic: "ด้านการพิจารณาอนุมัติงานในงบประมาณประจำปีงบประมาณ" },
    { id: 6, department: "สกท.", topic: "ภัยจากวิสัยใหญ่และประกอบการทำงานออกแบบ โครงการงบประมาณสำนักงานในอีกสำนักงานภายในประเทศและลักษณะข้อแนะนำในประเทศงานตรวจสอบและเสนอบอร์ดมติความคืน ตรวจสอบ" },
    { id: 7, department: "สกท.", topic: "ด้านการพิจารณาการมาเทียบ การบริหารการจัดการและการบริการการบริหารงานของนิติบุคคล" },
    { id: 8, department: "สกท.", topic: "4. งานพิจารณาการชำระตรวจสอบของระบบงบรายงานงานของแต่ละประจำไตรมาสและการปฏิบัติการสำคัญในการก่อสร้างและระบบงาน" }
  ];

  // Table data for year 2568
  const tableData2568 = [
    { id: 1, department: "สกท.", topic: "งานตรวจการใช้จ่ายเงินที่ได้รับการอุดหนุนจากรัฐบาลด้านงานพัฒนา", score: "3/45", note: "เพื่อให้การตรวจเดียวกับการตรวจสอบ" },
    { id: 2, department: "สกท.", topic: "งานตรวจสอบการบริหารบุคคลในระดับข้อกำหนดเฉพาะตำแหน่งนักพัฒนาการเฉพาะพื้นที่และการพิจารณาประเมินระบบบุคคล (FTA)", score: "3/45", note: "เพื่อให้การตรวจเดียวกับการตรวจสอบ" },
    { id: 3, department: "สกท.", topic: "ปฏิบัติงานตรวจสอบภายใน", score: "3/45", note: "" },
    { id: 4, department: "สกท.", topic: "ปฏิบัติงานตรวจสอบภายใน", score: "3/45", note: "" },
    { id: 5, department: "สกท.", topic: "ด้านการพิจารณาอนุมัติงานในงบประมาณประจำปีงบประมาณ", score: "3/45", note: "สำหรับงานขนาดเล็กโดยเฉพาะงานบริหารงานประเภทขาย งานขาย" },
    { id: 6, department: "สกท.", topic: "ภัยจากวิสัยใหญ่และประกอบการทำงานออกแบบ โครงการงบประมาณสำนักงานในอีกสำนักงานภายในประเทศและลักษณะข้อแนะนำในประเทศงานตรวจสอบและเสนอบอร์ดมติความคืน ตรวจสอบ", score: "3/45", note: "งาน 5 ครั้งแซมซัน แต่ละงานหาเอาบิท งาน" },
    { id: 7, department: "สกท.", topic: "ด้านการพิจารณาการมาเทียบ การบริหารการจัดการและการบริการการบริหารงานของนิติบุคคล", score: "3/45", note: "เพิ่มการตรวจสอบให้ได้ตามลำดับขั้นอย่างถูก และอีกครั้งใช้การทำงานแผนงบประมาณจาก" },
    { id: 8, department: "สกท.", topic: "4. งานพิจารณาการชำระตรวจสอบของระบบงบรายงานงานของแต่ละประจำไตรมาสและการปฏิบัติการสำคัญในการก่อสร้างและระบบงาน", score: "3/45", note: "การตรวจสอบภาษาขิงรองออกแบบ และแต่ละการพิจารณาสำนักงานจากการออกแบบ" }
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 p-2 sm:p-4 pt-0">
         <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm">ปีงบประมาณ:</span>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2567">2567</SelectItem>
                <SelectItem value="2568">2568</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm">เลือกหน่วยงาน:</span>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ทุกหน่วยงาน">ทุกหน่วยงาน</SelectItem>
                <SelectItem value="ทุกหน่วยงานในสังกัด">ทุกหน่วยงานในสังกัด</SelectItem>
                <SelectItem value="กทพ.">กทพ.</SelectItem>
                <SelectItem value="สกก.">สกก.</SelectItem>
                <SelectItem value="สกษ.">สกษ.</SelectItem>
                <SelectItem value="กชม.">กชม.</SelectItem>
                <SelectItem value="สวท.">สวท.</SelectItem>
                <SelectItem value="สสส.">สสส.</SelectItem>
                <SelectItem value="สปม.">สปม.</SelectItem>
                <SelectItem value="สกท.">สกท.</SelectItem>
                <SelectItem value="สทพ.">สทพ.</SelectItem>
              </SelectContent>
            </Select>
          </div>
       <Button 
          className='bg-[#3E52B9] text-white ml-auto'
          onClick={() => setShowSubmitDialog(true)}
        >
          เสนอหัวหน้ากลุ่มตรวจสอบภายใน
        </Button>

        </div>
      {/* Header Section */}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
            ปีงบประมาณ 2568
          </h1>
          <div className="flex items-center gap-2 mt-2 ">
            <span className="text-sm text-muted-foreground">สถานะ:</span>
            <span className="text-sm text-blue-600 underline cursor-pointer">
              ข้อมูลสำรวจงานตรวจสอบภายใน
            </span>

          </div>

        </div>

       
      </div>

      {/* Chart and Summary Section */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Chart Section */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">
              ความเห็นข้อสังเกตการตรวจสอบ (Audit Universe)
            </CardTitle>
            <p className="text-sm text-muted-foreground">เปรียบเทียบข้อมูลปีงบประมาณ 2567 กับ ปีงบประมาณ 2568</p>
          </CardHeader>
          <CardContent>
            <div className="w-full h-80">
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
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">สรุปข้อมูลหัวข้องานตรวจสอบภายใน</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            {/* Year 2567 Card */}
            <div className="p-3 sm:p-4 rounded-lg w-full">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-medium">หัวข้อการตรวจสอบภายใน</div>
                  <div className="text-xs">ปีงบประมาณ 2567</div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-4xl font-bold mb-1">218</div>
                <div className="text-xs sm:text-sm text-gray-600">รายการ</div>
              </div>
            </div>

            {/* Year 2568 Card */}
            <div className="p-3 sm:p-4 rounded-lg w-full">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-medium">หัวข้อการตรวจสอบภายใน</div>
                  <div className="text-xs">ปีงบประมาณ 2568</div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-4xl font-bold mb-1">113</div>
                <div className="text-xs sm:text-sm text-gray-600">รายการ</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Button */}
      <div className="flex justify-between">
       <div>
         <h1>ตารางการเปรียบเทียบหัวข้อของงานตรวจสอบทั้งหมด</h1>
         <span>เปรียบเทียบปีงบประมาณ 2567 กับ ปีงบประมาณ 2568</span>
         <br/>
         <span>สถานะ: </span>
         <span className='text-yellow-500'>รอหัวหน้าหน่วยสอบทานพิจารณาอนุมัติ</span>

       </div>
        <Button 
          className="bg-[#3E52B9] hover:bg-[#2A3A8F] text-white"
          onClick={() => setShowApprovalDialog(true)}
        >
          พิจารณาอนุมัติ
        </Button>
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

      {/* Comparison Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
        {/* Year 2567 Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">
              ปีงบประมาณ 2567
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">ลำดับ</TableHead>
                    <TableHead className="text-xs sm:text-sm min-w-[120px]">หน่วยงาน/กิจกรรม/โครงการ</TableHead>
                    <TableHead className="text-xs sm:text-sm min-w-[200px]">หัวข้อของงานตรวจสอบ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData2567.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="text-xs sm:text-sm">{item.id}</TableCell>
                      <TableCell className="text-xs sm:text-sm font-medium">{item.department}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{item.topic}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Year 2568 Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">
              ปีงบประมาณ 2568
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">ลำดับ</TableHead>
                    <TableHead className="text-xs sm:text-sm min-w-[120px]">หน่วยงาน/กิจกรรม/โครงการ</TableHead>
                    <TableHead className="text-xs sm:text-sm min-w-[180px]">หัวข้อของงานตรวจสอบ</TableHead>
                    <TableHead className="text-xs sm:text-sm">คะแนน</TableHead>
                    <TableHead className="text-xs sm:text-sm">หมายเหตุ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData2568.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="text-xs sm:text-sm">{item.id}</TableCell>
                      <TableCell className="text-xs sm:text-sm font-medium">{item.department}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{item.topic}</TableCell>
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
      </div>

      {/* Submit Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              ยืนยันข้อมูลการสำรวจงานตรวจสอบภายในกับความเห็นข้อสังเกตการตรวจสอบ (Audit Universe) ปีงบประมาณ 2568
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <p className="text-sm text-gray-600">
              กรุณายืนยันการเสนอข้อมูลสำรวจงานตรวจสอบภายในให้หัวหน้ากลุ่มตรวจสอบภายใน
            </p>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">ข้อมูลที่จะส่ง:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• ข้อมูลสำรวจงานตรวจสอบภายใน ปีงบประมาณ 2568</li>
                <li>• ความเห็นข้อสังเกตการตรวจสอบ (Audit Universe)</li>
                <li>• ตารางการเปรียบเทียบหัวข้อของงานตรวจสอบทั้งหมด</li>
              </ul>
            </div>
            
            <p className="text-sm text-gray-600">
              ยืนยันข้อมูลการตรวจสอบงานตรวจสอบ
            </p>
          </div>

          <DialogFooter className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowSubmitDialog(false)}
              className="flex-1"
            >
              ยกเลิก
            </Button>
            <Button 
              onClick={handleSubmitToSupervisor}
              className="bg-[#3E52B9] hover:bg-[#2A3A8F] text-white flex-1"
            >
              ยืนยัน
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              พิจารณาหัวข้อของงานตรวจสอบ
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <p className="text-sm text-gray-600">
              กรุณาเลือกสถานะการพิจารณา
            </p>
            
            <div className="space-y-3">
             
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="include-attachment" 
                
                />
                <label 
                  htmlFor="include-attachment" 
                  className="text-sm text-gray-700"
                >
                  อนุมัติ
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="include-attachment" 


                />
                <label 
                  htmlFor="include-attachment" 
                  className="text-sm text-gray-700"
                >
                  ไม่อนุมัติ
                </label>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  ความเห็นหนังสือกิจการการ
                </label>
                <Textarea
                  placeholder="ไม่ระบุความเห็นหนังสือกิจการการ"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[150px] resize-none"
                />
              </div>
            </div>
            
            <p className="text-sm text-gray-600">
              ยินยันข้อมูลการการตัวจริงข้อมูลงานตรวจสอบ
            </p>
          </div>

          <DialogFooter className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowApprovalDialog(false)}
              className="flex-1"
            >
              ยกเลิก
            </Button>
            <Button 
              onClick={handleFirstApproval}
              className="bg-[#3E52B9] hover:bg-[#2A3A8F] text-white flex-1"
            >
              ยืนยัน
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Signature Selection Dialog */}
      <Dialog open={showSignatureDialog} onOpenChange={setShowSignatureDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              ลายเซ็นอิเล็กทรอนิกส์
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            {approvalStep === 1 && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  เลือกวิธีการลงลายเซ็น
                </p>
                
                <div className="space-y-3">
                  <button
                    onClick={() => handleSignatureChoice('new')}
                    className={`w-full p-4 border rounded-lg text-left hover:bg-gray-50 transition-colors ${
                      signatureChoice === 'new' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        signatureChoice === 'new' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                      }`}>
                        {signatureChoice === 'new' && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1"></div>}
                      </div>
                      <div>
                        <div className="font-medium">เซ็นชื่อใหม่</div>
                        <div className="text-sm text-gray-500">วาดลายเซ็นด้วยเมาส์หรือสัมผัส</div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSignatureChoice('saved')}
                    className={`w-full p-4 border rounded-lg text-left hover:bg-gray-50 transition-colors ${
                      signatureChoice === 'saved' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        signatureChoice === 'saved' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                      }`}>
                        {signatureChoice === 'saved' && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1"></div>}
                      </div>
                      <div>
                        <div className="font-medium">เลือกลายเซ็นที่เคยบันทึกไว้</div>
                        <div className="text-sm text-gray-500">ใช้ลายเซ็นที่บันทึกไว้แล้ว</div>
                      </div>
                    </div>
                  </button>
                </div>

                {signatureChoice === 'new' && (
                  <div className="mt-4">
                    <SignatureComponent
                      onSignatureChange={setSignatureData}
                      initialName="ผู้อนุมัติ"
                    />
                  </div>
                )}
              </div>
            )}

            {approvalStep === 2 && signatureChoice === 'saved' && (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="font-medium mb-2">ยืนยันตัวตนเพื่อใช้ลายเซ็น</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    กรุณากรอกรหัส OTP เพื่อปลดล็อคลายเซ็นที่บันทึกไว้
                  </p>
                </div>
                
                <OTPVerification 
                  onOTPChange={handleOTPChange}
                  isValid={isOtpValid}
                />
                
                {isOtpValid && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-xs">✓</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-800">ปลดล็อคลายเซ็นเรียบร้อย</p>
                        <p className="text-xs text-green-600">พร้อมใช้ลายเซ็นที่บันทึกไว้แล้ว</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowSignatureDialog(false);
                setApprovalStep(1);
                setSignatureChoice(null);
              }}
              className="flex-1"
            >
              ยกเลิก
            </Button>
            <Button 
              onClick={handleFinalApproval}
              disabled={
                (signatureChoice === 'new' && !signatureData.signature) ||
                (signatureChoice === 'saved' && !isOtpValid) ||
                !signatureChoice
              }
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
