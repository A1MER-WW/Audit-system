import { lawRecordDocumentType } from '@/hooks/useLawRecordDocument'
import { NextResponse } from 'next/server'

const lowrecorddocument:lawRecordDocumentType[] =[
    {
        id: 1 ,
        category: "การบริหารควบคุมภายใน",
        type: "พระราชกฤษฎีกาค่าใชัจ่ายเดินทางไปราชการ",
        url: "หกดหกดหกดหกดกห",
        status: "Inactive",
        display: "",
    },
    {
        id: 2 ,
        category: "การบริหารควบคุมภายใน",
        type: "พระราชบัญญัติ",
        url: "www.fkdjsglsk.com",
        status: "Active",
        display: "",
    },
    {
        id: 3 ,
        category: "การบริหารควบคุมภายใน",
        type: "พระราชบัญญัติ",
        url: "www.fkdjsglsk.com",
        status: "Inactive",
        display: "",
    },
    {
        id: 4 ,
        category: "การบริหารควบคุมภายใน",
        type: "พระราชบัญญัติ",
        url: "www.fkdjsglsk.com",
        status: "Active",
        display: "",
    },
    {
        id: 5 ,
        category: "การบริหารควบคุมภายใน",
        type: "พระราชกฤษฎีกาค่าใชัจ่ายเดินทางไปราชการ",
        url: "www.fkdjsglsk.com",
        status: "Active",
        display: "",
    },
]

export async function GET(request:Request){
    try{

         const { searchParams } = new URL(request.url)
        
            // Support query parameters for filtering
            const id = searchParams.get('id')
            const category = searchParams.get('category')
            const type = searchParams.get('type')
            const search = searchParams.get('search')
            const status = searchParams.get('status')
            const display = searchParams.get('display')
    
            let filteredDocuments = [...lowrecorddocument]
    
            // Filter by search term
            if (search) {
            filteredDocuments = filteredDocuments.filter(doc => 
                doc.category.toLowerCase().includes(search.toLowerCase()) ||
                doc.type.toLowerCase().includes(search.toLowerCase()) ||
                doc.status.toLowerCase().includes(search.toLowerCase()) ||
                doc.display.toLowerCase().includes(search.toLowerCase())
            )
            }
            if(id) {
            filteredDocuments = filteredDocuments.filter(doc => doc.id === Number(id))
            }
    
            if(type) {
            filteredDocuments = filteredDocuments.filter(doc => doc.type === type)
            }
            
            // Filter by category
            if (category) {
            filteredDocuments = filteredDocuments.filter(doc => doc.category === category)
            }
            
            // Filter by status
            if (status) {
            filteredDocuments = filteredDocuments.filter(doc => doc.status === status)
            }
    
            // Filter by display
            if (display) {
            filteredDocuments = filteredDocuments.filter(doc => doc.display === display)
            }
            
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500))
            
            return NextResponse.json({
            success: true,
            data: filteredDocuments,
            total: filteredDocuments.length,
            message: "Documents retrieved successfully"
            })

    } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch documents",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}