import { NextRequest, NextResponse } from 'next/server'
import { mockBudgetData } from '@/lib/mock-data'
import { ApiResponse } from '@/lib/types'

// GET /api/budget - Get budget data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fiscalYear = searchParams.get('fiscalYear')

    let data = mockBudgetData

    // Filter by fiscal year if provided
    if (fiscalYear) {
      data = mockBudgetData.filter(budget => 
        budget.fiscalYear === parseInt(fiscalYear)
      )
    }

    const response: ApiResponse<typeof data> = {
      success: true,
      data
    }

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch budget data' },
      { status: 500 }
    )
  }
}