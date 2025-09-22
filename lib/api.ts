// API utility functions for the Audit System

import { 
  ApiResponse, 
  PaginatedResponse, 
  AuditPlan, 
  AuditItem, 
  DashboardStats,
  SummaryCardData,
  AuditTopicData,
  AuditUniverseBarData,
  BudgetChartData,
  BudgetTrendData,
  RiskFactor,
  Department,
  BudgetData
} from './types'

const API_BASE_URL = '/api'

// Generic fetch function with error handling
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.error || 'API request failed')
    }

    return data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

// Audit Plans API
export const auditPlansAPI = {
  // Get all audit plans with optional filters
  getAll: async (params?: {
    fiscalYear?: number
    status?: string
    page?: number
    limit?: number
  }): Promise<PaginatedResponse<AuditPlan>> => {
    const searchParams = new URLSearchParams()
    
    if (params?.fiscalYear) searchParams.append('fiscalYear', params.fiscalYear.toString())
    if (params?.status) searchParams.append('status', params.status)
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())

    const queryString = searchParams.toString()
    return fetchAPI<PaginatedResponse<AuditPlan>>(
      `/audit-plans${queryString ? `?${queryString}` : ''}`
    )
  },

  // Get specific audit plan by ID
  getById: async (id: string): Promise<ApiResponse<AuditPlan>> => {
    return fetchAPI<ApiResponse<AuditPlan>>(`/audit-plans/${id}`)
  },

  // Create new audit plan
  create: async (data: Omit<AuditPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<AuditPlan>> => {
    return fetchAPI<ApiResponse<AuditPlan>>('/audit-plans', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Update audit plan
  update: async (id: string, data: Partial<AuditPlan>): Promise<ApiResponse<AuditPlan>> => {
    return fetchAPI<ApiResponse<AuditPlan>>(`/audit-plans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  // Delete audit plan
  delete: async (id: string): Promise<ApiResponse<null>> => {
    return fetchAPI<ApiResponse<null>>(`/audit-plans/${id}`, {
      method: 'DELETE',
    })
  }
}

// Audit Items API
export const auditItemsAPI = {
  // Get all audit items with optional filters
  getAll: async (params?: {
    fiscalYear?: number
    department?: string
    status?: string
    riskLevel?: string
    page?: number
    limit?: number
  }): Promise<PaginatedResponse<AuditItem>> => {
    const searchParams = new URLSearchParams()
    
    if (params?.fiscalYear) searchParams.append('fiscalYear', params.fiscalYear.toString())
    if (params?.department) searchParams.append('department', params.department)
    if (params?.status) searchParams.append('status', params.status)
    if (params?.riskLevel) searchParams.append('riskLevel', params.riskLevel)
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())

    const queryString = searchParams.toString()
    return fetchAPI<PaginatedResponse<AuditItem>>(
      `/audit-items${queryString ? `?${queryString}` : ''}`
    )
  },

  // Create new audit item
  create: async (data: Omit<AuditItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<AuditItem>> => {
    return fetchAPI<ApiResponse<AuditItem>>('/audit-items', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
}

// Dashboard API
export const dashboardAPI = {
  // Get dashboard statistics
  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    return fetchAPI<ApiResponse<DashboardStats>>('/dashboard?type=stats')
  },

  // Get summary data for cards
  getSummary: async (): Promise<ApiResponse<SummaryCardData[]>> => {
    return fetchAPI<ApiResponse<SummaryCardData[]>>('/dashboard?type=summary')
  },

  // Get audit universe bar chart data
  getAuditUniverseBar: async (): Promise<ApiResponse<AuditUniverseBarData[]>> => {
    return fetchAPI<ApiResponse<AuditUniverseBarData[]>>('/dashboard?type=audit-universe-bar')
  },

  // Get budget chart data
  getBudgetChart: async (): Promise<ApiResponse<BudgetChartData[]>> => {
    return fetchAPI<ApiResponse<BudgetChartData[]>>('/dashboard?type=budget')
  },

  // Get budget trend data
  getBudgetTrend: async (): Promise<ApiResponse<BudgetTrendData[]>> => {
    return fetchAPI<ApiResponse<BudgetTrendData[]>>('/dashboard?type=budget-trend')
  },

  // Get all dashboard data at once
  getAllData: async (): Promise<ApiResponse<{
    stats: DashboardStats
    summary: SummaryCardData[]
    auditTopics: AuditTopicData[]
    auditUniverseBar: AuditUniverseBarData[]
    budget: BudgetChartData[]
    budgetTrend: BudgetTrendData[]
  }>> => {
    return fetchAPI<ApiResponse<{
      stats: DashboardStats
      summary: SummaryCardData[]
      auditTopics: AuditTopicData[]
      auditUniverseBar: AuditUniverseBarData[]
      budget: BudgetChartData[]
      budgetTrend: BudgetTrendData[]
    }>>('/dashboard')
  }
}

// Risk Factors API
export const riskFactorsAPI = {
  // Get all risk factors with optional filters
  getAll: async (params?: {
    category?: string
    riskLevel?: string
    page?: number
    limit?: number
  }): Promise<PaginatedResponse<RiskFactor>> => {
    const searchParams = new URLSearchParams()
    
    if (params?.category) searchParams.append('category', params.category)
    if (params?.riskLevel) searchParams.append('riskLevel', params.riskLevel)
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())

    const queryString = searchParams.toString()
    return fetchAPI<PaginatedResponse<RiskFactor>>(
      `/risk-factors${queryString ? `?${queryString}` : ''}`
    )
  },

  // Create new risk factor
  create: async (data: Omit<RiskFactor, 'id'>): Promise<ApiResponse<RiskFactor>> => {
    return fetchAPI<ApiResponse<RiskFactor>>('/risk-factors', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
}

// Departments API
export const departmentsAPI = {
  // Get all departments
  getAll: async (): Promise<ApiResponse<Department[]>> => {
    return fetchAPI<ApiResponse<Department[]>>('/departments')
  }
}

// Budget API
export const budgetAPI = {
  // Get budget data with optional fiscal year filter
  getAll: async (fiscalYear?: number): Promise<ApiResponse<BudgetData[]>> => {
    const queryString = fiscalYear ? `?fiscalYear=${fiscalYear}` : ''
    return fetchAPI<ApiResponse<BudgetData[]>>(`/budget${queryString}`)
  }
}

// Custom hooks for React components
export const useAPI = {
  // Custom hook for audit plans
  useAuditPlans: (params?: Parameters<typeof auditPlansAPI.getAll>[0]) => {
    // This would typically use React Query or SWR for caching and state management
    // For now, we'll provide the API function
    return auditPlansAPI.getAll(params)
  },

  // Custom hook for dashboard data
  useDashboard: () => {
    return dashboardAPI.getAllData()
  },

  // Custom hook for audit items
  useAuditItems: (params?: Parameters<typeof auditItemsAPI.getAll>[0]) => {
    return auditItemsAPI.getAll(params)
  }
}