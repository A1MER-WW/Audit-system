"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Download, FileSpreadsheet, FileText, History } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ApprovalDialog } from '@/components/approval-dialog'
import { BudgetPieChart } from '@/components/budget-pie-chart'
import { BudgetLineChart } from '@/components/budget-line-chart'
import { AuditTrailDialog } from '@/components/audit-trail-dialog'
import { AuditPlanTable } from '@/components/audit-plan-table'
import { BudgetSummaryTable } from '@/components/budget-summary-table'

interface Props {
  params: Promise<{
    id: string
  }>
}

export default function InspectionPlanAgencyDetailPage({ params }: Props) {
  const router = useRouter()

  // Approval and signature states
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false)
  const [isAuditTrailDialogOpen, setIsAuditTrailDialogOpen] = useState(false)
  const [approvalStep, setApprovalStep] = useState(1)
  const [isOtpValid, setIsOtpValid] = useState<boolean>(false)
  const [signatureChoice, setSignatureChoice] = useState<'new' | 'saved' | null>(null)
  const [signatureData, setSignatureData] = useState<{ name: string; signature: string | null }>({
    name: '',
    signature: null
  })
  const [approvalStatus, setApprovalStatus] = useState<'pending' | 'approved' | 'rejected'>('pending')
  
  // Mock data for the dashboard metrics
  const dashboardData = {
    year2568: 989963,
    year2569: 841636,
    year2570: 708030,
    total: 2539629,
    pieChartData: [
      { name: '2568', value: 708030, color: '#8b5cf6', percentage: '27.88%' },
      { name: '2569', value: 841636, color: '#f87171', percentage: '33.14%' },
      { name: '2570', value: 989963, color: '#06b6d4', percentage: '38.98%' }
    ]
  }

  // Line chart data for budget comparison
  const lineChartData = [
    {
      year: '2568',
      'ค่าใช้จ่ายในการดำเนินงานปกติ': 270000,
      'ค่าใช้จ่ายในการจัดกิจกรรมให้คำปรึกษา': 85000,
      'ค่าจ่ายงานบริการ': 50000,
      'ค่าเดิน อุปกรณ์': 90000,
      'ค่าชองแผน': 25000,
      'ค่าทองแขก ใช้ขยอย่อื่นๆ': 32000,
      'ค่าสาธารณูปโภค': 40000,
      'ค่าใช้จ่ายในการพัฒนาผู้ตรวจสอบภายใน': 98000
    },
    {
      year: '2569',
      'ค่าใช้จ่ายในการดำเนินงานปกติ': 330000,
      'ค่าใช้จ่ายในการจัดกิจกรรมให้คำปรึกษา': 120000,
      'ค่าจ่ายงานบริการ': 65000,
      'ค่าเดิน อุปกรณ์': 95000,
      'ค่าชองแผน': 35000,
      'ค่าทองแขก ใช้ขยอย่อื่นๆ': 45000,
      'ค่าสาธารณูปโภค': 25000,
      'ค่าใช้จ่ายในการพัฒนาผู้ตรวจสอบภายใน': 110000
    },
    {
      year: '2570',
      'ค่าใช้จ่ายในการดำเนินงานปกติ': 400000,
      'ค่าใช้จ่ายในการจัดกิจกรรมให้คำปรึกษา': 145000,
      'ค่าจ่ายงานบริการ': 85000,
      'ค่าเดิน อุปกรณ์': 120000,
      'ค่าชองแผน': 55000,
      'ค่าทองแขก ใช้ขยอย่อื่นๆ': 80000,
      'ค่าสาธารณูปโภค': 60000,
      'ค่าใช้จ่ายในการพัฒนาผู้ตรวจสอบภายใน': 125000
    }
  ]

  // Colors for different lines
  const colors = [
    '#ef4444', // red
    '#f97316', // orange  
    '#eab308', // yellow
    '#22c55e', // green
    '#06b6d4', // cyan
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#f59e0b'  // amber
  ]

  // Mock data for audit plans
  const auditPlans = [
    {
      id: 1,
      topic: "ผลการดำเนินโครงการกลุ่มการผลิตรายใหญ่ในระดับเขต",
      unit: "กรุงเทพมหานคร",
      year2568: true,
      year2569: true,
      year2570: false,
      remark: ""
    },
    {
      id: 2,
      topic: "ผลการดำเนินงานการปฏิบัติตามเกณฑ์การประเมินคุณภาพการศึกษาของสถานศึกษา",
      unit: "กรุงเทพมหานคร",
      year2568: true,
      year2569: true,
      year2570: true,
      remark: "ปรับปรุงหลัก"
    },
    {
      id: 3,
      topic: "การบริหารจัดการงบเงินผลประโยชน์",
      unit: "กรุงเทพมหานคร",
      year2568: true,
      year2569: true,
      year2570: false,
      remark: "ปรับปรุงหลัก"
    },
    {
      id: 4,
      topic: "การบริหารจัดการงบลงทุนและการจัดซื้อจัดจ้าง",
      unit: "กรุงเทพมหานคร",
      year2568: true,
      year2569: true,
      year2570: false,
      remark: "ปรับปรุงหลัก"
    },
    {
      id: 5,
      topic: "การบริหารงานอุปกรณ์และการจัดซื้อที่ดินและการส่งเสริมการปกครอง",
      unit: "กรุงเทพมหานคร",
      year2568: true,
      year2569: false,
      year2570: true,
      remark: ""
    },
    {
      id: 6,
      topic: "การตัดสินใจเกี่ยวกับการจัดอบรมเพื่อเรียนรู้วิชาการพื้นฐาน",
      unit: "กรุงเทพมหานคร",
      year2568: false,
      year2569: false,
      year2570: false,
      remark: ""
    },
    {
      id: 7,
      topic: "ผลการดำเนินงานพื้นที่การศึกษาแรงงานการปราบปรามการขาย",
      unit: "กรุงเทพมหานคร",
      year2568: false,
      year2569: false,
      year2570: true,
      remark: ""
    },
    {
      id: 8,
      topic: "ติดตามความก้าวหน้าในการปฏิบัติตามข้อเสนอแนะการตรวจสอบนโยบาย",
      unit: "กรุงเทพมหานคร",
      year2568: true,
      year2569: false,
      year2570: false,
      remark: ""
    },
    {
      id: 9,
      topic: "ติดตามความก้าวหน้าเพื่อให้คำปรึกษา",
      unit: "กรุงเทพมหานคร",
      year2568: false,
      year2569: false,
      year2570: true,
      remark: ""
    },
    {
      id: 10,
      topic: "ติดตามการเตรียมข้อมูลเพื่อให้คำปรึกษา",
      unit: "กรุงเทพมหานคร",
      year2568: false,
      year2569: true,
      year2570: false,
      remark: ""
    }
  ]

  // Budget data
  const budgetData = [
    { item: "ค่าใช้จ่ายด้านการบริหาร", budget2568: 128000, budget2569: 133000, budget2570: 143000 },
    { item: "ค่าใช้จ่ายด้านค่าสาธารณูปโภค", budget2568: 64500, budget2569: 105000, budget2570: 175000, remark: "เพิ่มเติมหลัก" },
    { item: "ค่าใช้จ่ายอื่นๆ", budget2568: 175000, budget2569: 151000, budget2570: 401000, remark: "เพิ่มเติมหลัก" },
    { item: "ค่าง/ค่าธรรมเนียม", budget2568: 25500, budget2569: 36000, budget2570: 32500, remark: "เพิ่มเติมหลัก" },
    { item: "ค่าอบรมสัมมนา", budget2568: 16500, budget2569: 31000, budget2570: 45000 },
    { item: "ค่าระบบเทคโนโลยี", budget2568: 58500, budget2569: 44500, budget2570: 71000 },
    { item: "ค่าตรวจสอบ", budget2568: 1340, budget2569: 1400, budget2570: 4140 },
    { item: "ค่าใช้จ่ายด้านการสื่อความหมาย", budget2568: 58500, budget2569: 108000, budget2570: 168000 }
  ]

  const totalBudget2568 = budgetData.reduce((sum, item) => sum + item.budget2568, 0)
  const totalBudget2569 = budgetData.reduce((sum, item) => sum + item.budget2569, 0)
  const totalBudget2570 = budgetData.reduce((sum, item) => sum + item.budget2570, 0)

  // Mock audit trail data
  const auditTrailData = [
    {
      id: 1,
      action: 'สร้างแผนการตรวจสอบ',
      user: 'นายสมชาย ใจดี',
      role: 'ผู้จัดทำแผน',
      timestamp: '2024-09-15 09:30:00',
      description: 'สร้างแผนการตรวจสอบระยะยาวประจำปี 2568-2570'
    },
    {
      id: 2,
      action: 'แก้ไขข้อมูลงบประมาณ',
      user: 'นางสาวสุดา ขยันดี',
      role: 'เจ้าหน้าที่การเงิน',
      timestamp: '2024-09-16 14:15:30',
      description: 'ปรับปรุงงบประมาณค่าใช้จ่ายด้านการบริหาร'
    },
    {
      id: 3,
      action: 'ส่งขออนุมัติ',
      user: 'นายสมชาย ใจดี',
      role: 'ผู้จัดทำแผน',
      timestamp: '2024-09-17 10:45:00',
      description: 'ส่งแผนการตรวจสอบเพื่อขออนุมัติจากผู้บริหาร'
    },
    {
      id: 4,
      action: 'อนุมัติแผน',
      user: 'นายวิชัย ผู้บริหาร',
      role: 'ผู้อำนวยการ',
      timestamp: '2024-09-19 16:20:15',
      description: 'อนุมัติแผนการตรวจสอบระยะยาว พร้อมลายเซ็นดิจิทัล'
    }
  ]

  // Export functions
  const handleExportToPDF = () => {
    // Implementation for PDF export
    console.log('Exporting to PDF...')
    // You can implement actual PDF generation here
  }

  const handleExportToExcel = () => {
    // Implementation for Excel export
    console.log('Exporting to Excel...')
    // You can implement actual Excel generation here
  }

  const handleShowAuditTrail = () => {
    setIsAuditTrailDialogOpen(true)
  }


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

   const handleOTPChange = (value: string) => {
    console.log('OTP changed:', value);
    // Mock OTP validation (in real app, verify with backend)
    setIsOtpValid(value === "123456" || value.length === 6);
  };

  const handleApprovalComplete = () => {
    console.log('Approval completed')
    setApprovalStatus('approved') // เปลี่ยนสถานะเป็นอนุมัติแล้ว
    setIsApprovalDialogOpen(false) // ปิด dialog อนุมัติ
    setApprovalStep(1) // รีเซ็ต step กลับเป็น 1
    setSignatureData({name: "", signature: null}) // ล้างข้อมูลลายเซ็น
    setSignatureChoice(null) // ล้างการเลือกประเภทลายเซ็น
    setIsOtpValid(false) // รีเซ็ต OTP
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            กลับ
          </Button>
          <span className="text-sm font-semibold">แผนการตรวจสอบระยะยาวและแผนการบริหารทรัพยากร /</span>
        </div>

        <div className="flex items-center gap-2">
          {approvalStatus === 'approved' ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600 font-medium">อนุมัติแล้ว</span>
              </div>
              
              {/* Export and Audit Trail Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportToPDF}
                  className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                >
                  <FileText className="h-4 w-4" />
                  Export PDF
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportToExcel}
                  className="flex items-center gap-2 text-green-600 border-green-200 hover:bg-green-50"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  Export Excel
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShowAuditTrail}
                  className="flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <History className="h-4 w-4" />
                  Audit Trail
                </Button>
              </div>
            </div>
          ) : (
            <Button
              onClick={() => setIsApprovalDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              อนุมัติแผนการตรวจสอบ
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart Section */}
        <BudgetPieChart data={dashboardData} />

        {/* Line Chart Section */}
        <BudgetLineChart data={lineChartData} colors={colors} />
      </div>

      {/* Detailed Plan Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">แผนการตรวจสอบรายละเอียด</CardTitle>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Performance Audit Section */}
            <AuditPlanTable 
              title="ข้อมูลการตรวจสอบผลการปฏิบัติงาน"
              auditPlans={auditPlans}
              showSlice={true}
              sliceCount={10}
            />

            {/* Compliance Audit Section */}
            <div>
              <h3 className="font-medium mb-4">ข้อมูลการตรวจสอบการปฏิบัติตามกฎระเบียบ</h3>
              <AuditPlanTable 
                title=""
                auditPlans={[{
                  id: 1,
                  topic: "ผลการดำเนินโครงการกลุ่มการผลิตรายใหญ่ในระดับเขต",
                  unit: "กรุงเทพมหานคร",
                  year2568: true,
                  year2569: true,
                  year2570: false,
                  remark: ""
                }]}
              />
            </div>

            {/* Advisory Section */}
            <AuditPlanTable 
              title="ข้อมูลการตรวจสอบแบบให้คำปรึกษา"
              auditPlans={auditPlans}
              showSlice={true}
              sliceCount={10}
            />

            {/* Budget Summary Table */}
            <BudgetSummaryTable 
              budgetData={budgetData}
              totalBudget2568={totalBudget2568}
              totalBudget2569={totalBudget2569}
              totalBudget2570={totalBudget2570}
            />

            {/* Footer Note */}
            <div className="mt-6 text-sm text-gray-600">
              <p><strong>หมายเหตุ:</strong></p>
              <p>1. งบประมาณที่แสดงเป็นการประมาณการเบื้องต้น อาจมีการเปลี่ยนแปลงตามความเหมาะสม ความจำเป็น และงบประมาณที่ได้รับจัดสรร 1: อาจมีการปรับแผนการตรวจสอบตามความเหมาะสมและความจำเป็น</p>
              <p>2. การปฏิบัติงานตรวจสอบใน 1 ประเด็นอาจดำเนินการมากกว่า 1 หน่วยงาน ขึ้นอยู่กับลักษณะการดำเนินงานของแต่ละหน่วยงาน</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Approval Dialog */}
      <ApprovalDialog
        isOpen={isApprovalDialogOpen}
        onOpenChange={setIsApprovalDialogOpen}
        approvalStep={approvalStep}
        onApprovalComplete={handleApprovalComplete}
        onNextStep={handleNextApprovalStep}
        onPrevStep={handlePrevApprovalStep}
        signatureChoice={signatureChoice}
        onSignatureChoiceChange={setSignatureChoice}
        signatureData={signatureData}
        onSignatureDataChange={setSignatureData}
        isOtpValid={isOtpValid}
        onOTPChange={handleOTPChange}
      />

      {/* Audit Trail Dialog */}
      <AuditTrailDialog
        isOpen={isAuditTrailDialogOpen}
        onOpenChange={setIsAuditTrailDialogOpen}
        auditTrailData={auditTrailData}
      />
    </div>
  )
}