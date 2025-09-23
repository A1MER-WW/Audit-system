import { NextRequest, NextResponse } from 'next/server'
import { mockDepartments } from '@/lib/mock-data'
import { ApiResponse } from '@/lib/types'

// GET /api/departments - Get all departments
export async function GET() {
  try {
    const response: ApiResponse<typeof mockDepartments> = {
      success: true,
      data: mockDepartments
    }

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch departments' },
      { status: 500 }
    )
  }
}