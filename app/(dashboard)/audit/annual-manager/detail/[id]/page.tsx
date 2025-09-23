"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { SignatureComponent } from '@/components/signature-component';
import { OTPVerification } from '@/components/otp-verification';
import { ArrowLeft, Download, FileText, TrendingUp, Users, Clock, DollarSign, PenTool, CheckCircle, Eye, BarChart3 } from 'lucide-react';
import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Props {
  params: Promise<{
    id: string;
  }>;    
}

export default function AnnualManagerDetailPage({ params }: Props) {
  const router = useRouter();
  const { id } = use(params);
  
  // State for signature functionality
  const [isSignatureDialogOpen, setIsSignatureDialogOpen] = useState(false);
  const [approvalStep, setApprovalStep] = useState(1);
  const [isOtpValid, setIsOtpValid] = useState<boolean>(false);
  const [signatureChoice, setSignatureChoice] = useState<'new' | 'saved' | null>(null);
  const [signatureData, setSignatureData] = useState<{ name: string; signature: string | null }>({
    name: '',
    signature: null
  });

  // State for new features
  const [showAuditTrail, setShowAuditTrail] = useState(false);
  const [compareWithPreviousYear, setCompareWithPreviousYear] = useState(false);
  
  // State for approval status - initially not approved
  const [approvalStatus, setApprovalStatus] = useState("รอการอนุมัติ");
  const [approvedBy, setApprovedBy] = useState("");
  const [approvedDate, setApprovedDate] = useState("");

  // Mock data for annual management plan
  const managementData = {
    year: "2568",
    title: "แผนการจัดการบองและแผนการใช้ระบบการทำงานการ",
    lastUpdate: "20/06/2568 14:00 น.",
    status: approvalStatus, // ใช้ state แทน hardcode
    approvedBy: approvedBy,
    approvedDate: approvedDate,
    stats: {
      totalItems: 900,
      completed: 160,
      pending: 0,
      budget: 53000,
      overtime: 0,
      totalBudget: 655030
    }
  };

  // Mock audit trail data
  const auditTrail = [
    {
      id: 1,
      action: "สร้างแผนการตรวจสอบประจำปี",
      user: "นายวิชาญ สมบูรณ์",
      timestamp: "15/06/2568 09:00 น.",
      status: "เสร็จสิ้น"
    },
    {
      id: 2,
      action: "เสนอต่อหัวหน้ากลุ่มตรวจสอบภายใน",
      user: "นายวิชาญ สมบูรณ์",
      timestamp: "17/06/2568 14:30 น.",
      status: "เสร็จสิ้น"
    },
    {
      id: 3,
      action: "หัวหน้ากลุ่มตรวจสอบภายในพิจารณาอนุมัติ",
      user: "นายสมชาย ใจดี",
      timestamp: "18/06/2568 16:30 น.",
      status: "อนุมัติ"
    }
  ];

  // Mock previous year data for comparison
  const previousYearData = {
    year: "2567",
    stats: {
      totalItems: 850,
      completed: 140,
      pending: 10,
      budget: 48000,
      overtime: 5,
      totalBudget: 620000
    }
  };

  // Check if plan is approved
  const isApproved = managementData.status === "หัวหน้ากลุ่มตรวจสอบภายในพิจารณาอนุมัติแผนการตรวจสอบเรียบร้อยแล้ว";

  // กิจกรรมการตรวจสอบภายในประจำปี 2568
  const auditActivities = [
    {
      id: 1,
      activity: "งานตรวจสอบ กลุ่มตรวจสอบนุุบำรุงแผนงานบำรุงบุคลากร",
      auditUnit: "กองการนินการฉนต์",
      quarter: "ไตรมาส 4",
      duration: "3 คนวัน",
      auditType: "การตรวจสอบปฏิบัติ",
      period: "ม.ค-มี.ค.69",
      cost: 300,
      startDate: "2/2/69",
      responsible: "นายก.แดงสุขา"
    },
    {
      id: 2,
      activity: "งานตรวจสอบยื่นใหม่สำหรับสำนักงานผู้เก็บเงินร",
      auditUnit: "กองการบำชื่อ",
      quarter: "ไตรมาส 4", 
      duration: "3 คนวัน",
      auditType: "การตรวจสอบปฏิบัติ",
      period: "ก.ย.-มุ.ก.69",
      cost: 300,
      startDate: "1/3/69",
      responsible: "สำนักงานวัชชาร"
    },
    {
      id: 3,
      activity: "งานตรวจสอบแอปติลุกชีต",
      auditUnit: "กองความช่วยเหลืองานการน และสำนักงานพั่ฒนาติจจรรมำแสมควรมรี้",
      quarter: "ไตรมาส 4",
      duration: "3 คนวัน", 
      auditType: "การตรวจสอบปฏิบัติ",
      period: "ก.ย.-มี.ก.69",
      cost: 300,
      startDate: "2/2/69",
      responsible: "นายจศึกษาตัตีศำ กรรมการ"
    },
    {
      id: 4,
      activity: "การตรวจสอบกระบวนการจีบำชื่อกษาพิจารขำติติงลบาลสถาเ่",
      auditUnit: "กองความช่วยเหลืองานการน และสำนักงานพั่ฒนาติจจรรมำแสมควร",
      quarter: "ไตรมาส 4",
      duration: "3 คนวัน",
      auditType: "การตรวจสอบปฏิบัติ",
      period: "ก.ค",
      cost: 300,
      startDate: "1498",
      responsible: "นายธานีสำคัวราติ"
    },
    {
      id: 5,
      activity: "การจาจารให้สำนับงานให้มาการณทารูปาขขิิ่นิ่ปีสำนรา้า สรุป",
      auditUnit: "กองความช่วยเหลืองานการน",
      quarter: "ไตรมาส 4", 
      duration: "3 คนวัน",
      auditType: "การติดตาม สุ.น พ.ค.-ส.ค.",
      period: "งก.6ย",
      cost: 1498,
      startDate: "",
      responsible: "นายธานี่ข่งครศลำไหาและ"
    },
    {
      id: 6,
      activity: "ร่วมระบายงข่ขชฝูงิ่ามามำมิีนาที่ยุการรผลการ",
      auditUnit: "จงาน/สังมืุบิลลิครั่นิ",
      quarter: "ไตรมาส 4",
      duration: "3 คนวัน",
      auditType: "",
      period: "ก.ป.-ก.ส.-ม.ย.69",
      cost: 300,
      startDate: "1498",
      responsible: "นายธานีสำคัวราติปังขอแผ่่ราศขคำขนาธาธา"
    }
  ];

  // แผนการประจำปี Quarter 1
  const quarterPlan = [
    {
      id: 1,
      activity: "งานตรวจสอบ กลุ่มตรวจสอบนุุบำรุงแผนงานบำรุงบุคลากร",
      auditUnit: "กองการนินการฉนต์",
      quarter: "ไตรมาส 4",
      duration: "3 คนวัน",
      auditType: "การตรวจสอบปฏิบัติ",
      period: "ม.ค-มี.ค.69",
      cost: "84.99 บ.",
      responsible: "นายก.แดงสุขา",
      status: "กำลังดำเนิน"
    }
  ];

  // แผนงาน
  const workPlan = [
    {
      id: 1,
      activity: "การติดตามความก้าวหน้า",
      period: "ม.ค-มี.ค.69",
      cost: 159850,
      responsible: "นายก.แดงสุขา"
    },
    {
      id: 2,
      activity: "การประจำปีกบวนชฟี่",
      period: "ก.ค-ส.ค.69",
      cost: 30000,
      responsible: "สำนักงานวัชชาร"
    },
    {
      id: 3,
      activity: "รายงาน",
      period: "ก.ย-ส.ค.69",
      cost: 35000,
      responsible: "ชั่น"
    },
    {
      id: 4,
      activity: "เทสมากทุกความส",
      period: "ต.ค",
      cost: 53450,
      responsible: "ชั่น"
    },
    {
      id: 5,
      activity: "การทรุดใน",
      period: "ต.ย-มุ.ก-ส.ย.89",
      cost: 4893,
      responsible: "ชั่น"
    },
    {
      id: 6,
      activity: "การใชภาหนต์พิ",
      period: "ต.ย-ป.ม.69",
      cost: 39300,
      responsible: "ชั่น"
    }
  ];

  // Signature approval handlers
  const handleNextApprovalStep = () => {
    if (approvalStep < 3) {
      setApprovalStep(approvalStep + 1);
    }
  };

  const handlePrevApprovalStep = () => {
    if (approvalStep > 1) {
      setApprovalStep(approvalStep - 1);
    }
  };

  const handleApprovalComplete = () => {
    if (isOtpValid && ((signatureChoice === 'new' && signatureData.signature) || signatureChoice === 'saved')) {
      // Process approval completion
      console.log('Approval completed:', {
        step: approvalStep,
        signatureChoice,
        signatureData,
        isOtpValid
      });
      
      // Update approval status
      setApprovalStatus("หัวหน้ากลุ่มตรวจสอบภายในพิจารณาอนุมัติแผนการตรวจสอบเรียบร้อยแล้ว");
      setApprovedBy("นายสมชาย ใจดี");
      const currentDate = new Date();
      setApprovedDate(`${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear() + 543} ${currentDate.getHours()}:${String(currentDate.getMinutes()).padStart(2, '0')} น.`);
      
      // Reset dialog state
      setIsSignatureDialogOpen(false);
      setApprovalStep(1);
      setSignatureChoice(null);
      setIsOtpValid(false);
      
      // Show success message
      alert('เสนอเอกสารสำเร็จ! สถานะเปลี่ยนเป็นอนุมัติแล้ว');
    }
  };

  const handleOTPChange = (value: string) => {
    console.log('OTP changed:', value);
    // Mock OTP validation (in real app, verify with backend)
    setIsOtpValid(value === "123456" || value.length === 6);
  };

  const renderApprovalStep = () => {
    switch (approvalStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">ยืนยันการเสนอ</h3>
              <p className="text-sm text-gray-600">ตรวจสอบข้อมูลแผนการบริหารจัดการ</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">ข้อมูลที่จะเสนอ</span>
              </div>
              <p className="text-xs text-gray-600">
                แผนการบริหารจัดการการตรวจสอบภายใน ประจำปีงบประมาณ พ.ศ. 2568
              </p>
              <div className="mt-2 text-xs text-gray-500">
                กลุ่มงานตรวจสอบภายใน สำนักงานเลขาธิการวุฒิสภา
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
                  initialName="ผู้จัดการ"
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
                  : 'ยืนยันการเสนอเอกสารด้วยรหัส OTP'
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
                    <h4 className="text-sm font-medium text-green-800">เอกสารพร้อมเสนอ</h4>
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
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-6">
      <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              กลับ
            </Button>
      <div className="max-w-auto mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                {managementData.title}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                ประจำปีงบประมาณ พ.ศ. {managementData.year} (ID: {id})
              </p>
              {/* Status Badge */}
              <div className="flex items-center gap-2 mt-2">
                {isApproved ? (
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    อนุมัติแล้ว
                  </Badge>
                ) : (
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    <Clock className="w-3 h-3 mr-1" />
                    รออนุมัติ
                  </Badge>
                )}
                {isApproved && (
                  <span className="text-xs text-gray-500">
                    อนุมัติโดย: {managementData.approvedBy} | {managementData.approvedDate}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Export PDF Button - Only visible when approved */}
            {isApproved && (
              <Button className="bg-[#3E52B9]  flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export PDF
              </Button>
            )}
            
            {/* Audit Trail Button */}
            {isApproved && (
              <Button 
                variant="outline"
                onClick={() => setShowAuditTrail(!showAuditTrail)}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                {showAuditTrail ? 'ซ่อน' : 'แสดง'} Audit Trail
              </Button>
            )}
            
            {/* Compare Toggle */}
            <Button 
              variant="outline"
              onClick={() => setCompareWithPreviousYear(!compareWithPreviousYear)}
              className="flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              {compareWithPreviousYear ? 'ซ่อน' : 'แสดง'}การเปรียบเทียบ
            </Button>

            {/* Signature Dialog - Only visible when not approved */}
            {!isApproved && (
              <Dialog open={isSignatureDialogOpen} onOpenChange={setIsSignatureDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#3E52B9] hover:bg-[#2A3B87] flex items-center gap-2">
                <PenTool className="h-4 w-4" />
                เสนอต่อหัวหน้ากลุ่มตรวจสอบภายใน
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-center">
                  เสนอหัวหน้ากลุ่มตรวจสอบภายใน
                </DialogTitle>
                
                {/* Step Indicator */}
                <div className="flex justify-center items-center space-x-4 mt-4">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                        step === approvalStep 
                          ? 'bg-blue-600 text-white' 
                          : step < approvalStep 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-200 text-gray-600'
                      }`}>
                        {step < approvalStep ? '✓' : step}
                      </div>
                      {step < 3 && (
                        <div className={`w-8 h-1 mx-2 transition-colors ${
                          step < approvalStep ? 'bg-green-500' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Step Labels */}
                <div className="flex justify-between text-xs text-gray-500 mt-2 px-4">
                  <span>ยืนยันข้อมูล</span>
                  <span>ลงลายเซ็น</span>
                  <span>ยืนยัน OTP</span>
                </div>
              </DialogHeader>
              
              <div className="py-6">
                {renderApprovalStep()}
              </div>
              
              <DialogFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={handlePrevApprovalStep}
                  disabled={approvalStep === 1}
                >
                  ย้อนกลับ
                </Button>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setIsSignatureDialogOpen(false);
                      setApprovalStep(1);
                      setSignatureChoice(null);
                      setIsOtpValid(false);
                    }}
                  >
                    ยกเลิก
                  </Button>
                  
                  {approvalStep < 3 ? (
                    <Button 
                      onClick={handleNextApprovalStep}
                      disabled={
                        (approvalStep === 2 && (!signatureChoice || (signatureChoice === 'new' && !signatureData.signature)))
                      }
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      ถัดไป
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleApprovalComplete}
                      disabled={!isOtpValid || (signatureChoice === 'new' && !signatureData.signature)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      เสนอเอกสาร
                    </Button>
                  )}
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
            )}
          </div>
        </div>

        {/* Audit Trail Section */}
        {showAuditTrail && isApproved && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Audit Trail - ประวัติการดำเนินการ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditTrail.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        item.status === 'อนุมัติ' ? 'bg-green-500' : 'bg-blue-500'
                      }`}></div>
                      <div>
                        <div className="font-medium text-sm">{item.action}</div>
                        <div className="text-xs text-gray-600">{item.user}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-600">{item.timestamp}</div>
                      <Badge className={`text-xs ${
                        item.status === 'อนุมัติ' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">สดิบจักเเสดงความพยารากรรสำสำคัญยภาษปากี(เเแาสย ณน )</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-48 h-48 mx-auto">
                {/* Mock Pie Chart */}
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <circle cx="100" cy="100" r="80" fill="#4F46E5" stroke="white" strokeWidth="2" />
                  <path d="M 100 20 A 80 80 0 0 1 180 100 L 100 100 Z" fill="#10B981" stroke="white" strokeWidth="2" />
                  <path d="M 180 100 A 80 80 0 0 1 100 180 L 100 100 Z" fill="#F59E0B" stroke="white" strokeWidth="2" />
                  <text x="100" y="100" textAnchor="middle" dy=".3em" className="text-white font-bold">1000</text>
                  <text x="100" y="115" textAnchor="middle" dy=".3em" className="text-white text-xs">ชิ้น</text>
                </svg>
               
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">งบประมาณการบริหารงาน</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-48 h-48 mx-auto">
                {/* Mock Pie Chart */}
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <circle cx="100" cy="100" r="80" fill="#F59E0B" stroke="white" strokeWidth="2" />
                  <path d="M 100 20 A 80 80 0 0 1 160 60 L 100 100 Z" fill="#3B82F6" stroke="white" strokeWidth="2" />
                  <text x="100" y="100" textAnchor="middle" dy=".3em" className="text-white font-bold">655,030</text>
                  <text x="100" y="115" textAnchor="middle" dy=".3em" className="text-white text-xs">บาท</text>
                </svg>
               
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              กิจกรรมการตรวจสอบภายในประจำปี 2568 โครงการประจีากติการตรวจสอบ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600 mb-4">
              ขย้อมลการตรวจสอบภายในประจำปี โครงการประจีากติการตรวจสอบ ข้าง โ วพ การเสริมสำรวกครุครรมเลชุชม การต่าง โ วพ การกำหนด
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-xs">ลำดับ</TableHead>
                    <TableHead className="text-xs">โครงการตรวจสอบ</TableHead>
                    <TableHead className="text-xs">หน่วยงูบิรร</TableHead>
                    <TableHead className="text-xs">ไตรมาสการแปน้อ</TableHead>
                    <TableHead className="text-xs">เวารเหอื วันกรา</TableHead>
                    <TableHead className="text-xs">ประเภทการตรวจสอบ</TableHead>
                    <TableHead className="text-xs">ทั้างเวลา</TableHead>
                    <TableHead className="text-xs">งบประมาณ</TableHead>
                    <TableHead className="text-xs">วันตุ้เรำิตรวจ</TableHead>
                    <TableHead className="text-xs">ผู้รับผิดชอบ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditActivities.map((item) => (
                    <TableRow key={item.id} className="hover:bg-gray-50">
                      <TableCell className="text-xs text-center">{item.id}</TableCell>
                      <TableCell className="text-xs max-w-[200px]">{item.activity}</TableCell>
                      <TableCell className="text-xs">{item.auditUnit}</TableCell>
                      <TableCell className="text-xs text-center">{item.quarter}</TableCell>
                      <TableCell className="text-xs text-center">{item.duration}</TableCell>
                      <TableCell className="text-xs">{item.auditType}</TableCell>
                      <TableCell className="text-xs text-center">{item.period}</TableCell>
                      <TableCell className="text-xs text-center">{item.cost}</TableCell>
                      <TableCell className="text-xs text-center">{item.startDate}</TableCell>
                      <TableCell className="text-xs">{item.responsible}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Summary Section */}
        <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4">
          <div className="text-sm font-medium text-yellow-800">
            รายงานการบำรุงรำทั้างำใน = 755 โครงการ โตมารการกำรูมกาง ข้าง โ วพ เอื่ยให้ยพอให้กำที่เแปุทำเเทันครเฮารักาเราะิต 144 โตหาางมาีิ
          </div>
        </div>

        {/* Additional Tables */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">แรำมรการตรวจสอบภาวงส่วกโครำการกิจกรรม</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600 mb-4">
              ใิ่นเายงการตรวจสอบดงาะายม่ตำการกมีาระ ีกั่นใงาคารยาเสแพะยทาเเลเขบีไรษอำการจนเฮา ข้าง โ วพ งงารเน
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="text-xs">ลำดับ</TableHead>
                    <TableHead className="text-xs">โครงการตรวจสอบ</TableHead>
                    <TableHead className="text-xs">หน่วยงูบิรร</TableHead>
                    <TableHead className="text-xs">ไตรมาสการแปน้อ</TableHead>
                    <TableHead className="text-xs">เวารเหอื วันกรา</TableHead>
                    <TableHead className="text-xs">ประเภทการตรวจสอบ</TableHead>
                    <TableHead className="text-xs">ทั้างเวลา</TableHead>
                    <TableHead className="text-xs">งบประมาณ</TableHead>
                    <TableHead className="text-xs">วันตุ้เรำิตรวจ</TableHead>
                    <TableHead className="text-xs">ผู้รับผิดชอบ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quarterPlan.map((item) => (
                    <TableRow key={item.id} className="hover:bg-gray-50">
                      <TableCell className="text-xs text-center">{item.id}</TableCell>
                      <TableCell className="text-xs max-w-[200px]">{item.activity}</TableCell>
                      <TableCell className="text-xs">{item.auditUnit}</TableCell>
                      <TableCell className="text-xs text-center">{item.quarter}</TableCell>
                      <TableCell className="text-xs text-center">{item.duration}</TableCell>
                      <TableCell className="text-xs">{item.auditType}</TableCell>
                      <TableCell className="text-xs text-center">{item.period}</TableCell>
                      <TableCell className="text-xs text-center">{item.cost}</TableCell>
                      <TableCell className="text-xs text-center">-</TableCell>
                      <TableCell className="text-xs">{item.responsible}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Work Plan Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">แรำมรการบำำะดีจีขิาำมาจัก่กรรมการคา</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="text-xs">ลำดับ</TableHead>
                      <TableHead className="text-xs">โครงการตรวจสอบ</TableHead>
                      <TableHead className="text-xs">ทั้างเวลา</TableHead>
                      <TableHead className="text-xs">งบประมาณ</TableHead>
                      <TableHead className="text-xs">ผู้รับผิดชอบ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workPlan.slice(0, 2).map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-xs text-center">{item.id}</TableCell>
                        <TableCell className="text-xs">{item.activity}</TableCell>
                        <TableCell className="text-xs text-center">{item.period}</TableCell>
                        <TableCell className="text-xs text-center">{item.cost.toLocaleString()}</TableCell>
                        <TableCell className="text-xs">{item.responsible}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">งารใฉ็ณตษาข์ี</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="text-xs">ลำดับ</TableHead>
                      <TableHead className="text-xs">โครงการตรวจสอบ</TableHead>
                      <TableHead className="text-xs">ทั้างเวลา</TableHead>
                      <TableHead className="text-xs">งบประมาณ</TableHead>
                      <TableHead className="text-xs">ผู้รับผิดชอบ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workPlan.slice(2).map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-xs text-center">{item.id}</TableCell>
                        <TableCell className="text-xs">{item.activity}</TableCell>
                        <TableCell className="text-xs text-center">{item.period}</TableCell>
                        <TableCell className="text-xs text-center">{item.cost.toLocaleString()}</TableCell>
                        <TableCell className="text-xs">{item.responsible}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Summary */}
        <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4">
          <div className="text-sm font-medium text-yellow-800">
            รายงานการบำรุงรำทั้างำใน = 1,088 โครงการ โตมารการกำรูมกาง ข้าง โ วพ เอื่ยให้ยพอให้กำที่เแปุทำเเทันครเฮารักา = 217 โตหาางมาีิ
          </div>
        </div>

        <div className="text-center py-4">
          <div className="text-sm text-gray-600">รายงาดถูกิอร</div>
          <div className="text-xs text-gray-500 mt-2">
            การรรำรการรำทรมก้ายมกิกิ = 755 โตยำการโรูารูำราดข้าลง โ วพ การก่ารเแยอครขำเ้ลิงก่ารไำากทั่ำำจั่วยำำกข
            สำเรีมรำสำเร็งสำเจำฟันรำพูริเมาตำกเขมีไขรำประากริการแำมาการำดเาะากราะราะรนกรอยำเำกำราคำความงามเลมสิิการากำ
            จัดระกำรำกรรมก้ยผงครขลียปีที่ = 1,099 โตมารการูรียา ข้าง โ วพ จรำิยแแเิยก่ารียการดเ่ารึกีาร่ำการาการำเรียก็เรียก่ารฟำดัดดากครรคี = 217 โตหาางมาีิ
          </div>
        </div>
      </div>
    </div>
  );
}