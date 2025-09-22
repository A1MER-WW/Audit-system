import { NextRequest, NextResponse } from 'next/server'
import { mockAuditItems } from '@/lib/mock-data'
import { ApiResponse, PaginatedResponse } from '@/lib/types'

// GET /api/audit-items - Get audit items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fiscalYear = searchParams.get('fiscalYear')
    const department = searchParams.get('department')
    const status = searchParams.get('status')
    const riskLevel = searchParams.get('riskLevel')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    let filteredItems = [...mockAuditItems]

    // Apply filters
    if (fiscalYear) {
      filteredItems = filteredItems.filter(item => 
        item.fiscalYear === parseInt(fiscalYear)
      )
    }

    if (department) {
      filteredItems = filteredItems.filter(item => 
        item.department.toLowerCase().includes(department.toLowerCase())
      )
    }

    if (status) {
      filteredItems = filteredItems.filter(item => item.status === status)
    }

    if (riskLevel) {
      filteredItems = filteredItems.filter(item => item.riskLevel === riskLevel)
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedItems = filteredItems.slice(startIndex, endIndex)

    const response: PaginatedResponse<typeof mockAuditItems[0]> = {
      success: true,
      data: paginatedItems,
      pagination: {
        page,
        limit,
        total: filteredItems.length,
        totalPages: Math.ceil(filteredItems.length / limit)
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch audit items' },
      { status: 500 }
    )
  }
}

// POST /api/audit-items - Create new audit item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const newItem = {
      id: `audit-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    mockAuditItems.push(newItem)

    const response: ApiResponse<typeof newItem> = {
      success: true,
      data: newItem,
      message: 'Audit item created successfully'
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create audit item' },
      { status: 500 }
    )
  }
}