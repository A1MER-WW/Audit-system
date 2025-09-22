import { 
  AuditItem, 
  AuditPlan, 
  DashboardStats, 
  AuditUniverse, 
  RiskFactor, 
  RiskCriteria, 
  BudgetData, 
  Department, 
  Report,
  ChartData,
  LineChartData 
} from './types'

// Mock Departments
export const mockDepartments: Department[] = [
  {
    id: 'dept-001',
    name: 'กองการเงินและบัญชี',
    shortName: 'กกบ.',
    contactPerson: 'นาย สมชาย ใจดี',
    email: 'somchai@example.com',
    phone: '02-123-4567'
  },
  {
    id: 'dept-002',
    name: 'กองบริหารงานบุคคล',
    shortName: 'กบบ.',
    contactPerson: 'นางสาว สมใส สวยงาม',
    email: 'somsai@example.com',
    phone: '02-123-4568'
  },
  {
    id: 'dept-003',
    name: 'กองพัสดุและทรัพย์สิน',
    shortName: 'กพท.',
    contactPerson: 'นาย วิชัย เก่งมาก',
    email: 'wichai@example.com',
    phone: '02-123-4569'
  },
  {
    id: 'dept-004',
    name: 'กองสารสนเทศและเทคโนโลยี',
    shortName: 'กสท.',
    contactPerson: 'นาง เทคโน โลยี',
    email: 'techno@example.com',
    phone: '02-123-4570'
  }
]

// Mock Audit Items
export const mockAuditItems: AuditItem[] = [
  {
    id: 'audit-001',
    auditTopic: 'การตรวจสอบระบบการจัดซื้อจัดจ้าง',
    department: 'กองพัสดุและทรัพย์สิน',
    fiscalYear: 2568,
    status: 'pending',
    riskLevel: 'high',
    score: 85,
    notes: 'ต้องตรวจสอบความโปร่งใสในกระบวนการ',
    createdAt: '2024-10-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  },
  {
    id: 'audit-002',
    auditTopic: 'การตรวจสอบระบบการเงินและบัญชี',
    department: 'กองการเงินและบัญชี',
    fiscalYear: 2568,
    status: 'approved',
    riskLevel: 'medium',
    score: 92,
    notes: 'ระบบมีความถูกต้องสูง',
    createdAt: '2024-09-15T00:00:00Z',
    updatedAt: '2024-11-20T00:00:00Z'
  },
  {
    id: 'audit-003',
    auditTopic: 'การตรวจสอบระบบบริหารงานบุคคล',
    department: 'กองบริหารงานบุคคล',
    fiscalYear: 2568,
    status: 'in-progress',
    riskLevel: 'low',
    score: 78,
    notes: 'กำลังดำเนินการตรวจสอบ',
    createdAt: '2024-11-01T00:00:00Z',
    updatedAt: '2024-12-10T00:00:00Z'
  },
  {
    id: 'audit-004',
    auditTopic: 'การตรวจสอบระบบเทคโนโลยีสารสนเทศ',
    department: 'กองสารสนเทศและเทคโนโลยี',
    fiscalYear: 2568,
    status: 'completed',
    riskLevel: 'medium',
    score: 88,
    notes: 'การตรวจสอบเสร็จสิ้นแล้ว',
    createdAt: '2024-08-01T00:00:00Z',
    updatedAt: '2024-10-30T00:00:00Z'
  },
  {
    id: 'audit-005',
    auditTopic: 'การตรวจสอบการบริหารความเสี่ยง',
    department: 'กองพัสดุและทรัพย์สิน',
    fiscalYear: 2567,
    status: 'completed',
    riskLevel: 'high',
    score: 75,
    notes: 'พบจุดอ่อนในการควบคุม',
    createdAt: '2023-10-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  }
]

// Mock Audit Plans
export const mockAuditPlans: AuditPlan[] = [
  {
    id: 'plan-001',
    title: 'แผนการตรวจสอบประจำปี 2568',
    description: 'แผนการตรวจสอบภายในสำหรับปีงบประมาณ 2568',
    fiscalYear: 2568,
    status: 'approved',
    totalBudget: 2500000,
    usedBudget: 1250000,
    auditItems: mockAuditItems.filter(item => item.fiscalYear === 2568),
    createdBy: 'ผู้จัดการฝ่ายตรวจสอบ',
    createdAt: '2024-09-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  },
  {
    id: 'plan-002',
    title: 'แผนการตรวจสอบประจำปี 2567',
    description: 'แผนการตรวจสอบภายในสำหรับปีงบประมาณ 2567',
    fiscalYear: 2567,
    status: 'completed',
    totalBudget: 2200000,
    usedBudget: 2150000,
    auditItems: mockAuditItems.filter(item => item.fiscalYear === 2567),
    createdBy: 'ผู้จัดการฝ่ายตรวจสอบ',
    createdAt: '2023-09-01T00:00:00Z',
    updatedAt: '2024-08-30T00:00:00Z'
  }
]

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  totalAuditItems: 24,
  pendingApproval: 6,
  inProgress: 8,
  completed: 10,
  totalBudget: 2500000,
  usedBudget: 1250000,
  remainingBudget: 1250000
}

// Mock Audit Universe
export const mockAuditUniverse: AuditUniverse[] = [
  {
    id: 'universe-001',
    topic: 'การจัดซื้อจัดจ้าง',
    department: 'กองพัสดุและทรัพย์สิน',
    riskLevel: 'high',
    lastAuditDate: '2023-12-15',
    nextAuditDate: '2024-12-15',
    frequency: 'annual',
    priority: 1
  },
  {
    id: 'universe-002',
    topic: 'การเงินและบัญชี',
    department: 'กองการเงินและบัญชี',
    riskLevel: 'medium',
    lastAuditDate: '2024-01-20',
    nextAuditDate: '2025-01-20',
    frequency: 'annual',
    priority: 2
  },
  {
    id: 'universe-003',
    topic: 'บริหารงานบุคคล',
    department: 'กองบริหารงานบุคคล',
    riskLevel: 'low',
    lastAuditDate: '2023-06-30',
    nextAuditDate: '2025-06-30',
    frequency: 'biannual',
    priority: 3
  }
]

// Mock Risk Factors
export const mockRiskFactors: RiskFactor[] = [
  {
    id: 'risk-001',
    name: 'ความเสี่ยงด้านการทุจริต',
    description: 'ความเสี่ยงที่เกิดจากการกระทำทุจริตของบุคลากร',
    category: 'compliance',
    impactLevel: 'high',
    probabilityLevel: 'medium',
    riskScore: 75,
    mitigationStrategies: [
      'จัดทำระบบควบคุมภายในที่มีประสิทธิภาพ',
      'อบรมจริยธรรมให้กับบุคลากร',
      'จัดให้มีช่องทางแจ้งเบาะแส'
    ]
  },
  {
    id: 'risk-002', 
    name: 'ความเสี่ยงด้านเทคโนโลยี',
    description: 'ความเสี่ยงจากการล้าสมัยของระบบเทคโนโลยี',
    category: 'operational',
    impactLevel: 'medium',
    probabilityLevel: 'high',
    riskScore: 80,
    mitigationStrategies: [
      'อัปเกรดระบบเทคโนโลยีอย่างสม่ำเสมอ',
      'จัดทำแผนสำรองข้อมูล',
      'อบรมเจ้าหน้าที่ด้านเทคโนโลยี'
    ]
  }
]

// Mock Risk Criteria
export const mockRiskCriteria: RiskCriteria[] = [
  {
    id: 'criteria-001',
    name: 'ผลกระทบทางการเงิน',
    description: 'ระดับความเสียหายทางการเงินที่อาจเกิดขึ้น',
    weightage: 40,
    scoring: {
      high: { min: 80, max: 100, description: 'ผลกระทบสูงมาก > 1 ล้านบาท' },
      medium: { min: 50, max: 79, description: 'ผลกระทบปานกลาง 100,000 - 1 ล้านบาท' },
      low: { min: 0, max: 49, description: 'ผลกระทบต่ำ < 100,000 บาท' }
    }
  },
  {
    id: 'criteria-002',
    name: 'ผลกระทบต่อชื่อเสียง',
    description: 'ระดับความเสียหายต่อชื่อเสียงองค์กร',
    weightage: 30,
    scoring: {
      high: { min: 80, max: 100, description: 'ส่งผลกระทบต่อชื่อเสียงอย่างรุนแรง' },
      medium: { min: 50, max: 79, description: 'ส่งผลกระทบต่อชื่อเสียงปานกลาง' },
      low: { min: 0, max: 49, description: 'ส่งผลกระทบต่อชื่อเสียงเล็กน้อย' }
    }
  }
]

// Mock Budget Data
export const mockBudgetData: BudgetData[] = [
  {
    fiscalYear: 2568,
    plannedBudget: 2500000,
    actualSpent: 1250000,
    remaining: 1250000,
    departmentBreakdown: [
      { department: 'กองพัสดุและทรัพย์สิน', allocated: 800000, spent: 400000 },
      { department: 'กองการเงินและบัญชี', allocated: 600000, spent: 350000 },
      { department: 'กองบริหารงานบุคคล', allocated: 500000, spent: 250000 },
      { department: 'กองสารสนเทศและเทคโนโลยี', allocated: 600000, spent: 250000 }
    ]
  },
  {
    fiscalYear: 2567,
    plannedBudget: 2200000,
    actualSpent: 2150000,
    remaining: 50000,
    departmentBreakdown: [
      { department: 'กองพัสดุและทรัพย์สิน', allocated: 700000, spent: 685000 },
      { department: 'กองการเงินและบัญชี', allocated: 550000, spent: 540000 },
      { department: 'กองบริหารงานบุคคล', allocated: 450000, spent: 445000 },
      { department: 'กองสารสนเทศและเทคโนโลยี', allocated: 500000, spent: 480000 }
    ]
  }
]

// Mock Reports
export const mockReports: Report[] = [
  {
    id: 'report-001',
    title: 'รายงานสรุปผลการตรวจสอบประจำปี 2567',
    type: 'summary',
    auditPlanId: 'plan-002',
    fiscalYear: 2567,
    status: 'published',
    findings: [
      'พบช่องโหว่ในระบบการควบคุมภายใน',
      'การจัดซื้อจัดจ้างยังไม่เป็นไปตามระเบียบ',
      'ระบบเทคโนโลยีสารสนเทศต้องการการปรับปรุง'
    ],
    recommendations: [
      'ควรปรับปรุงระบบการควบคุมภายใน',
      'จัดอบรมเจ้าหน้าที่เรื่องระเบียบการจัดซื้อจัดจ้าง',
      'จัดทำแผนปรับปรุงระบบเทคโนโลยี'
    ],
    managementResponse: 'ฝ่ายบริหารจะดำเนินการตามข้อเสนอแนะทุกประการ',
    createdBy: 'หัวหน้าผู้ตรวจสอบ',
    createdAt: '2024-08-15T00:00:00Z',
    publishedAt: '2024-09-01T00:00:00Z'
  }
]

// Chart Data for Dashboard
export const mockAuditTopicsChartData: ChartData[] = [
  { name: 'การจัดซื้อจัดจ้าง', value: 8, color: '#8b5cf6', percentage: '33.3%' },
  { name: 'การเงินและบัญชี', value: 6, color: '#f87171', percentage: '25.0%' },
  { name: 'บริหารงานบุคคล', value: 5, color: '#06b6d4', percentage: '20.8%' },
  { name: 'เทคโนโลยีสารสนเทศ', value: 5, color: '#10b981', percentage: '20.8%' }
]

// Bar Chart Data for Audit Universe
export const mockAuditUniverseBarData = [
  { name: 'การจัดซื้อจัดจ้าง', ปีงบประมาณ2567: 6, ปีงบประมาณ2568: 8 },
  { name: 'การเงินและบัญชี', ปีงบประมาณ2567: 4, ปีงบประมาณ2568: 6 },
  { name: 'บริหารงานบุคคล', ปีงบประมาณ2567: 3, ปีงบประมาณ2568: 5 },
  { name: 'เทคโนโลยีสารสนเทศ', ปีงบประมาณ2567: 4, ปีงบประมาณ2568: 5 }
]

export const mockBudgetChartData: ChartData[] = [
  { name: 'ใช้ไปแล้ว', value: 1250000, color: '#3b82f6', percentage: '50%' },
  { name: 'คงเหลือ', value: 1250000, color: '#e5e7eb', percentage: '50%' }
]

export const mockBudgetLineChartData: LineChartData[] = [
  { name: 'ต.ค.', planned: 200000, actual: 180000 },
  { name: 'พ.ย.', planned: 400000, actual: 420000 },
  { name: 'ธ.ค.', planned: 600000, actual: 580000 },
  { name: 'ม.ค.', planned: 800000, actual: 750000 },
  { name: 'ก.พ.', planned: 1000000, actual: 950000 },
  { name: 'มี.ค.', planned: 1200000, actual: 1250000 }
]

// Summary Stats for different pages
export const mockStatsSummaryData = [
  { 
    title: 'หัวข้อตรวจสอบทั้งหมด',
    value: '24',
    subtext: 'ปี 2568',
    icon: 'FileText' as const
  },
  {
    title: 'รอการอนุมัติ', 
    value: '6',
    subtext: 'รายการ',
    icon: 'Clock' as const
  },
  {
    title: 'กำลังดำเนินการ',
    value: '8', 
    subtext: 'รายการ',
    icon: 'PlayCircle' as const
  },
  {
    title: 'เสร็จสิ้นแล้ว',
    value: '10',
    subtext: 'รายการ', 
    icon: 'CheckCircle' as const
  }
]