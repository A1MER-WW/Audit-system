import { NextRequest, NextResponse } from 'next/server'
import { mockAuditPlans } from '@/lib/mock-data'
import { ApiResponse } from '@/lib/types'

// GET /api/audit-plans/[id] - Get specific audit plan
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const plan = mockAuditPlans.find(p => p.id === id)

    if (!plan) {
      return NextResponse.json(
        { success: false, error: 'Audit plan not found' },
        { status: 404 }
      )
    }

    const response: ApiResponse<typeof plan> = {
      success: true,
      data: plan
    }

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch audit plan' },
      { status: 500 }
    )
  }
}

// PUT /api/audit-plans/[id] - Update audit plan
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const planIndex = mockAuditPlans.findIndex(p => p.id === id)
    
    if (planIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Audit plan not found' },
        { status: 404 }
      )
    }

    const updatedPlan = {
      ...mockAuditPlans[planIndex],
      ...body,
      updatedAt: new Date().toISOString()
    }

    mockAuditPlans[planIndex] = updatedPlan

    const response: ApiResponse<typeof updatedPlan> = {
      success: true,
      data: updatedPlan,
      message: 'Audit plan updated successfully'
    }

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update audit plan' },
      { status: 500 }
    )
  }
}

// DELETE /api/audit-plans/[id] - Delete audit plan
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const planIndex = mockAuditPlans.findIndex(p => p.id === id)
    
    if (planIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Audit plan not found' },
        { status: 404 }
      )
    }

    mockAuditPlans.splice(planIndex, 1)

    const response: ApiResponse<null> = {
      success: true,
      data: null,
      message: 'Audit plan deleted successfully'
    }

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete audit plan' },
      { status: 500 }
    )
  }
}