import { NextRequest, NextResponse } from 'next/server'
import { mockAuditPlans } from '@/lib/mock-data'
import { ApiResponse, PaginatedResponse } from '@/lib/types'

// GET /api/audit-plans - Get all audit plans
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fiscalYear = searchParams.get('fiscalYear')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    let filteredPlans = [...mockAuditPlans]

    // Filter by fiscal year
    if (fiscalYear) {
      filteredPlans = filteredPlans.filter(plan => 
        plan.fiscalYear === parseInt(fiscalYear)
      )
    }

    // Filter by status
    if (status) {
      filteredPlans = filteredPlans.filter(plan => plan.status === status)
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedPlans = filteredPlans.slice(startIndex, endIndex)

    const response: PaginatedResponse<typeof mockAuditPlans[0]> = {
      success: true,
      data: paginatedPlans,
      pagination: {
        page,
        limit,
        total: filteredPlans.length,
        totalPages: Math.ceil(filteredPlans.length / limit)
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch audit plans' },
      { status: 500 }
    )
  }
}

// POST /api/audit-plans - Create new audit plan
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const newPlan = {
      id: `plan-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // In a real app, you would save to database
    mockAuditPlans.push(newPlan)

    const response: ApiResponse<typeof newPlan> = {
      success: true,
      data: newPlan,
      message: 'Audit plan created successfully'
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create audit plan' },
      { status: 500 }
    )
  }
}