// Base interfaces for the audit system

export interface AuditItem {
  id: string
  auditTopic: string
  department: string
  fiscalYear: number
  status: 'pending' | 'approved' | 'rejected' | 'in-progress' | 'completed'
  riskLevel: 'high' | 'medium' | 'low'
  score?: number
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface AuditPlan {
  id: string
  title: string
  description: string
  fiscalYear: number
  status: 'draft' | 'pending_approval' | 'approved' | 'in_progress' | 'completed'
  totalBudget: number
  usedBudget: number
  auditItems: AuditItem[]
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface DashboardStats {
  totalAuditItems: number
  pendingApproval: number
  inProgress: number
  completed: number
  totalBudget: number
  usedBudget: number
  remainingBudget: number
}

export interface AuditUniverse {
  id: string
  topic: string
  department: string
  riskLevel: 'high' | 'medium' | 'low'
  lastAuditDate?: string
  nextAuditDate?: string
  frequency: 'annual' | 'biannual' | 'triannual'
  priority: number
}

export interface RiskFactor {
  id: string
  name: string
  description: string
  category: 'operational' | 'financial' | 'compliance' | 'strategic'
  impactLevel: 'high' | 'medium' | 'low'
  probabilityLevel: 'high' | 'medium' | 'low'
  riskScore: number
  mitigationStrategies: string[]
}

export interface RiskCriteria {
  id: string
  name: string
  description: string
  weightage: number
  scoring: {
    high: { min: number; max: number; description: string }
    medium: { min: number; max: number; description: string }
    low: { min: number; max: number; description: string }
  }
}

export interface BudgetData {
  fiscalYear: number
  plannedBudget: number
  actualSpent: number
  remaining: number
  departmentBreakdown: {
    department: string
    allocated: number
    spent: number
  }[]
}

export interface Department {
  id: string
  name: string
  shortName: string
  parentDepartment?: string
  contactPerson: string
  email: string
  phone: string
}

export interface DocumentFile {
  id: string
  name: string
  type: string
  size: number
  uploadedAt: string
  uploadedBy: string
  category: 'audit_plan' | 'report' | 'evidence' | 'other'
  tags: string[]
}

export interface Report {
  id: string
  title: string
  type: 'summary' | 'detailed' | 'executive'
  auditPlanId: string
  fiscalYear: number
  status: 'draft' | 'review' | 'approved' | 'published'
  findings: string[]
  recommendations: string[]
  managementResponse?: string
  createdBy: string
  createdAt: string
  publishedAt?: string
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  message?: string
}

// Chart data types
export interface ChartData {
  name: string
  value: number
  color?: string
  percentage?: string
}

export interface LineChartData {
  name: string
  [key: string]: string | number
}

// Dashboard specific types
export interface SummaryCardData {
  title: string
  value: number
  description: string
  trend?: {
    value: number
    isPositive: boolean
  }
}

export interface AuditTopicData {
  topic: string
  department: string
  status: string
  priority: number
  completion: number
}

export interface AuditUniverseBarData {
  department: string
  auditItems: number
  completed: number
  pending: number
}

export interface BudgetChartData {
  category: string
  allocated: number
  spent: number
  remaining: number
}

export interface BudgetTrendData {
  month: string
  planned: number
  actual: number
}

// Form and component types
export interface TableColumn<T = Record<string, unknown>> {
  key: keyof T
  label: string
  sortable?: boolean
  render?: (value: unknown, row: T) => React.ReactNode
}

export interface FilterParams {
  search?: string
  status?: string
  department?: string
  fiscalYear?: number
  riskLevel?: string
  category?: string
  page?: number
  limit?: number
}