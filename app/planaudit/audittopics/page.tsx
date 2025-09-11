"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { SignatureComponent } from '@/components/signature-component';
import { OTPVerification } from '@/components/otp-verification';
import { Edit, FileText } from 'lucide-react';

interface AuditData {
  id: number;
  department: string;
  topic: string;
  link?: string;
  score?: string;
  note?: string;
}

export default function AudittopicsPage() {
  const [selectedYear, ] = React.useState<string>("2568");
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = React.useState(false);
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = React.useState(false);
  const [approvalStep, setApprovalStep] = React.useState(1);
  const [signatureData, setSignatureData] = React.useState<{name: string; signature: string | null}>({name: "", signature: null});
  const [isOtpValid, setIsOtpValid] = React.useState<boolean>(false);
  const [signatureChoice, setSignatureChoice] = React.useState<'new' | 'saved' | null>(null);
  const [files, setFiles] = React.useState<File[] | undefined>();
  const [auditData2567, setAuditData2567] = React.useState<AuditData[]>([]);
  const [auditData2568, setAuditData2568] = React.useState<AuditData[]>([]);
  const [hasData, setHasData] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<AuditData | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  
 
    const chartData = [
    { name: 'หน่วยงาน', ปีงบประมาณ2567: 4, ปีงบประมาณ2568: 4 },
    { name: 'งาน', ปีงบประมาณ2567: 8, ปีงบประมาณ2568: 10 },
    { name: 'โครงการ', ปีงบประมาณ2567: 6, ปีงบประมาณ2568: 8 },
    { name: 'โครงการลงทุนสาธารณูปโภค', ปีงบประมาณ2567: 10, ปีงบประมาณ2568: 8 },
    { name: 'กิจกรรม', ปีงบประมาณ2567: 14, ปีงบประมาณ2568: 16 },
    { name: 'การบริหาร', ปีงบประมาณ2567: 16, ปีงบประมาณ2568: 18 },
    { name: 'IT และ Non-IT', ปีงบประมาณ2567: 18, ปีงบประมาณ2568: 20 }
  ];

  // Sample data for demonstration (will be populated from Excel file)
  const sampleData2567 = [
    { id: 1, department: "สกท.", topic: "งานหรการคณะกรรมการการคำนวณคะแนนราง งเบี้ยยังชีพผู้สูงอายุ", link: "รายการข้อมูลงานจากแอปพลิเคชันการประเมินและติดตาม" },
    { id: 2, department: "สกท.", topic: "ปฏิบัติงานตรวจสอบสำนักงาน", link: "" },
    { id: 3, department: "สกท.", topic: "ปฏิบัติงานตรวจสอบสำนักงาน", link: "" },
    { id: 4, department: "สกท.", topic: "ปฏิบัติงานตรวจสอบสำนักงาน", link: "" },
    { id: 5, department: "สกท.", topic: "ด้านริหารการเก็บรักษาเงินกำไรสะสมการพัฒนากิจการพลังงานนอกจากไฟฟ้า", link: "" },
  ];

  const sampleData2568 = [
    { id: 1, department: "สกท.", topic: "งานหรการคณะกรรมการการคำนวณคะแนนราง งเบี้ยยังชีพผู้สูงอายุ", score: "3/45", note: "ทำเสียบการหวยจับฉลากรางฮคุ้ม" },
    { id: 2, department: "สกท.", topic: "บการทำให้เป็นจนการตรวจรับเคลื่อนลำเคร วาารประกอบ ", score: "3/45", note: "ทำเสียบการหวยจับฉลากรางฮคุ้ม" },
    { id: 3, department: "สกท.", topic: "ปฏิบัติงานตรวจสอบสำนักงาน", score: "3/45", note: "" },
    { id: 4, department: "สกท.", topic: "ปฏิบัติงานตรวจสอบสำนักงาน", score: "", note: "" },
    { id: 5, department: "สกท.", topic: "ด้านริหารการเก็บรักษาเงินกำไรสะสมการพัฒนากิจการพลังงานนอกจากไฟฟ้า", score: "3/45", note: "" },
  ];

  // Simulate loading data from Excel file when files are uploaded
  React.useEffect(() => {
    if (files && files.length > 0) {
      setAuditData2567(sampleData2567);
      setAuditData2568(sampleData2568);
      setHasData(true);
    }
  }, [files]);

  const handleFileUpload = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      console.log('Files uploaded:', acceptedFiles);
      
      // Simulate loading data from Excel file
      setAuditData2567(sampleData2567);
      setAuditData2568(sampleData2568);
      setHasData(true);
    }
  };

  const handleNextStep = () => {
    if (approvalStep < 3) {
      setApprovalStep(approvalStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (approvalStep > 1) {
      setApprovalStep(approvalStep - 1);
    }
  };

  const handleApprovalComplete = () => {
    console.log('Approval completed');
    setIsApprovalDialogOpen(false);
    setApprovalStep(1);
    setSignatureData({name: "", signature: null});
    setSignatureChoice(null);
    setIsOtpValid(false);
  };

  const handleOTPChange = (value: string) => {
    console.log('OTP changed:', value);
    // Mock OTP validation (in real app, verify with backend)
    setIsOtpValid(value === "123456" || value.length === 6);
  };

   const handleEditItem = (item: AuditData) => {
    setEditingItem(item);
    setIsEditDialogOpen(true);
  };
  const handleSaveEdit = () => {
    if (editingItem) {
      console.log('Saving edited item:', editingItem);
      // Here you would typically update the data in your backend
      
      // Update the local state
      setAuditData2568(prev => 
        prev.map(item => 
          item.id === editingItem.id ? editingItem : item
        )
      );
      
      setIsEditDialogOpen(false);
      setEditingItem(null);
    }
  };

  const renderApprovalStep = () => {
    switch (approvalStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">ยืนยันการอนุมัติ</h3>
              <p className="text-sm text-gray-600">ตรวจสอบข้อมูลงานตรวจสอบภายใน</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">ข้อมูลที่จะพิจารณา</span>
              </div>
              <p className="text-xs text-gray-600">
                ห้วงของงานตรวจสอบทั้งหมด (Audit Universe) เปรียบเทียบปีงบประมาณ 2567 กับ ปีงบประมาณ 2568
              </p>
              <div className="mt-2 text-xs text-gray-500">
                จำนวนข้อมูล: {auditData2567.length + auditData2568.length} รายการ
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">ลงลายเซ็น</h3>
              <p className="text-sm text-gray-600">เลือกวิธีการลงลายเซ็น</p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => setSignatureChoice('new')}
                className={`w-full p-4 border rounded-lg text-left transition-colors ${
                  signatureChoice === 'new' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    signatureChoice === 'new' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                  }`}>
                    {signatureChoice === 'new' && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1"></div>}
                  </div>
                  <div>
                    <div className="font-medium">เซ็นเอง</div>
                    <div className="text-sm text-gray-500">วาดลายเซ็นใหม่</div>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => setSignatureChoice('saved')}
                className={`w-full p-4 border rounded-lg text-left transition-colors ${
                  signatureChoice === 'saved' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-gray-300'
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
        );
      
      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">ยืนยันด้วย OTP</h3>
              <p className="text-sm text-gray-600">
                {signatureChoice === 'saved' 
                  ? 'ใช้รหัส OTP เพื่อยืนยันการใช้ลายเซ็นที่บันทึกไว้' 
                  : 'ยืนยันการอนุมัติด้วยรหัส OTP'
                }
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <FileText className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-green-800">ข้อมูลพร้อมอนุมัติ</h4>
                    <p className="text-xs text-green-600">ตรวจสอบข้อมูลเรียบร้อยแล้ว</p>
                  </div>
                </div>
              </div>
              
              {(signatureChoice === 'new' && signatureData.signature) || signatureChoice === 'saved' ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-xs">✓</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-blue-800">ลายเซ็นยืนยัน</h4>
                      <p className="text-xs text-blue-600">
                        {signatureChoice === 'saved' ? 'ใช้ลายเซ็นที่บันทึกไว้' : signatureData.name}
                      </p>
                    </div>
                  </div>
                  {signatureChoice === 'saved' && (
                    <div className="mt-3 p-2 bg-white rounded border-2 border-dashed border-gray-200">
                      <div className="text-center text-gray-500 text-sm">ลายเซ็นที่บันทึกไว้</div>
                      <div className="h-16 flex items-center justify-center">
                        <svg viewBox="0 0 200 60" className="w-32 h-12">
                          <path d="M10 40 Q 50 10 90 30 Q 130 50 170 20" stroke="black" strokeWidth="2" fill="none" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}

              {/* OTP Verification Section */}
              <div className="rounded-lg p-4">
                <OTPVerification 
                  onOTPChange={handleOTPChange}
                  isValid={isOtpValid}
                />
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-2 sm:p-4 pt-0">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
            จัดการข้อมูลงานตรวจสอบ ปีงบประมาณ {selectedYear}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            เปรียบเทียบข้อมูลปีงบประมาณ 2567 กับ ปีงบประมาณ 2568
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-muted-foreground">สถานะ:</span>
            <span className="text-sm text-blue-600 underline cursor-pointer">
              {hasData ? "อัพเดทเรียบร้อยแล้ว จำนวนข้อมูลคัดแยกแล้ว" : "ไม่มีข้อมูล"}
            </span>
          </div>
          
        </div>

      
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#3E52B9] hover:bg-[#2A3A8F] text-white flex items-center gap-2">
                เสนอหัวหน้าหน่วยตรวจสอบ
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-base text-[#3E52B9] border-b border-[#3E52B9] pb-2">
                  ยืนยันข้อมูลเสนอหัวหน้าหน่วยตรวจสอบ 
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <p className="text-sm text-gray-700">
                    ห้วงของงานตรวจสอบทั้งหมด (Audit Universe) เปรียบเทียบปีงบประมาณ 2567 กับ ปีงบประมาณ 2568
                  </p>
                </div>
                
                <div className="text-sm text-gray-600">
                  คุณต้องการเสนอข้อมูลให้หัวหน้าของงานตรวจสอบใช่หรือไม่?
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsSubmitDialogOpen(false)}
                  className="flex-1"
                >
                  ยกเลิก
                </Button>
                <Button 
                  className="bg-[#3E52B9] hover:bg-[#2A3A8F] text-white flex-1"
                  onClick={() => {
                    console.log('Submitted to supervisor');
                    setIsSubmitDialogOpen(false);
                    
                  }}
                >
                  ยืนยัน
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 justify-end">
        {/* Approval Button - Show only when data exists */}
        {hasData && (
          <Dialog open={isApprovalDialogOpen} onOpenChange={setIsApprovalDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#3E52B9] hover:bg-[#2A3A8F] text-white flex items-center gap-2">
                <FileText className="w-4 h-4" />
                พิจารณาอนุมัติ
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-base text-center">
                  การพิจารณาอนุมัติงานตรวจสอบภายใน
                </DialogTitle>
              </DialogHeader>
              
              {/* Step Indicator */}
              <div className="flex justify-center items-center space-x-4 py-4">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        approvalStep >= step
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {step}
                    </div>
                    {step < 3 && (
                      <div
                        className={`w-8 h-0.5 ${
                          approvalStep > step ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Step Content */}
              <div className="min-h-[200px]">
                {renderApprovalStep()}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                {approvalStep > 1 && (
                  <Button 
                    variant="outline" 
                    onClick={handlePrevStep}
                    className="flex-1"
                  >
                    ย้อนกลับ
                  </Button>
                )}
                
                {approvalStep < 3 ? (
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                    onClick={handleNextStep}
                    disabled={
                      (approvalStep === 2 && !signatureChoice) ||
                      (approvalStep === 2 && signatureChoice === 'new' && !signatureData.signature)
                    }
                  >
                    ถัดไป
                  </Button>
                ) : (
                  <Button 
                    className="bg-green-600 hover:bg-green-700 text-white flex-1"
                    onClick={handleApprovalComplete}
                    disabled={!isOtpValid}
                  >
                    อนุมัติ
                  </Button>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
        
        {/* File Upload Button */}
        <div className="relative">
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={(e) => {
              const files = e.target.files;
              if (files && files.length > 0) {
                handleFileUpload(Array.from(files));
              }
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Button className="border border-[#3E52B9] hover:bg-[#2A3A8F] bg-white text-black hover:text-white flex items-center gap-2">
            <FileText className="w-4 h-4" />
            เพิ่มหัวข้องานตรวจสอบ
          </Button>
        </div>
      </div>

      {/* Comparison Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Year 2567 Table */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              ปีงบประมาณ 2567
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">ลำดับ</TableHead>
                    <TableHead className="text-xs sm:text-sm min-w-[150px]">หน่วยงาน/กิจกรรม/โครงการ</TableHead>
                    <TableHead className="text-xs sm:text-sm min-w-[200px]">หัวข้อของงานตรวจสอบ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hasData && auditData2567.length > 0 ? (
                    auditData2567.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-xs sm:text-sm">{item.id}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{item.department}</TableCell>
                        <TableCell className="text-xs sm:text-sm">
                          <div>
                            {item.topic}
                            {item.link && (
                              <div className="text-blue-600 underline text-xs mt-1 cursor-pointer">
                                {item.link}
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-12 text-gray-500">
                        <div className="flex flex-col items-center gap-2">
                          <FileText className="w-12 h-12 text-gray-300" />
                          <div className="text-lg font-medium">ไม่มีข้อมูล</div>
                          <div className="text-sm text-muted-foreground">ยังไม่มีข้อมูลงานตรวจสอบสำหรับปี 2567</div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Year 2568 Table */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-600" />
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
                    <TableHead className="text-xs sm:text-sm w-16">แก้ไข</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hasData && auditData2568.length > 0 ? (
                    auditData2568.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-xs sm:text-sm">{item.id}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{item.department}</TableCell>
                        <TableCell className="text-xs sm:text-sm">
                          <div>
                            {item.topic}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm text-center">
                          {item.score && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                              {item.score}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm">{item.note}</TableCell>
                        <TableCell className="text-xs sm:text-sm">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditItem(item)}
                            className="h-8 w-8 p-0 hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4 text-blue-600" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                        <div className="flex flex-col items-center gap-2">
                          <FileText className="w-12 h-12 text-gray-300" />
                          <div className="text-lg font-medium">ไม่มีข้อมูล</div>
                          <div className="text-sm text-muted-foreground">ยังไม่มีข้อมูลงานตรวจสอบสำหรับปี 2568</div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
