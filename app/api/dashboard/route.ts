import { NextRequest, NextResponse } from 'next/server'
import { 
  mockDashboardStats, 
  mockStatsSummaryData, 
  mockAuditTopicsChartData, 
  mockAuditUniverseBarData,
  mockBudgetChartData, 
  mockBudgetLineChartData 
} from '@/lib/mock-data'
import { ApiResponse } from '@/lib/types'

// GET /api/dashboard/stats - Get dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'all'

    let data

    switch (type) {
      case 'stats':
        data = mockDashboardStats
        break
      case 'summary':
        data = mockStatsSummaryData
        break
      case 'audit-topics':
        data = mockAuditTopicsChartData
        break
      case 'audit-universe-bar':
        data = mockAuditUniverseBarData
        break
      case 'budget':
        data = mockBudgetChartData
        break
      case 'budget-trend':
        data = mockBudgetLineChartData
        break
      default:
        data = {
          stats: mockDashboardStats,
          summary: mockStatsSummaryData,
          auditTopics: mockAuditTopicsChartData,
          auditUniverseBar: mockAuditUniverseBarData,
          budget: mockBudgetChartData,
          budgetTrend: mockBudgetLineChartData
        }
    }

    const response: ApiResponse<typeof data> = {
      success: true,
      data
    }

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}