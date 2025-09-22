import { NextRequest, NextResponse } from 'next/server'
import { mockRiskFactors } from '@/lib/mock-data'
import { ApiResponse, PaginatedResponse } from '@/lib/types'

// GET /api/risk-factors - Get risk factors
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const riskLevel = searchParams.get('riskLevel')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    let filteredFactors = [...mockRiskFactors]

    // Apply filters
    if (category) {
      filteredFactors = filteredFactors.filter(factor => 
        factor.category === category
      )
    }

    if (riskLevel) {
      filteredFactors = filteredFactors.filter(factor => 
        factor.impactLevel === riskLevel || factor.probabilityLevel === riskLevel
      )
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedFactors = filteredFactors.slice(startIndex, endIndex)

    const response: PaginatedResponse<typeof mockRiskFactors[0]> = {
      success: true,
      data: paginatedFactors,
      pagination: {
        page,
        limit,
        total: filteredFactors.length,
        totalPages: Math.ceil(filteredFactors.length / limit)
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch risk factors' },
      { status: 500 }
    )
  }
}

// POST /api/risk-factors - Create new risk factor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const newFactor = {
      id: `risk-${Date.now()}`,
      ...body
    }

    mockRiskFactors.push(newFactor)

    const response: ApiResponse<typeof newFactor> = {
      success: true,
      data: newFactor,
      message: 'Risk factor created successfully'
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create risk factor' },
      { status: 500 }
    )
  }
}