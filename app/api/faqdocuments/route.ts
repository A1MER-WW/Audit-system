import { faqDocumentType } from '@/hooks/useFaqDocument'
import { NextResponse } from 'next/server'

const faqdocuments:faqDocumentType[] =[
    {
        id: 1,
        type:"consult",
        notificationdate: "0",
        department: "0",
        category: "1",
        title: "test1",
        issue_question:"1",
        issue_answer:"1",
        phonenumber:"1",
        email:"1",
        responsible_person:"1",
        status:"1",
        display:"1",
        craetedate:"1",
    },
    {
        id: 2,
        type:"assurance",
        notificationdate: "ttttt",
        department: "0",
        category: "1",
        title: "test2",
        issue_question:"1",
        issue_answer:"1",
        phonenumber:"1",
        email:"1",
        responsible_person:"1",
        status:"1",
        display:"1",
        craetedate:"1",
    },
]

export async function GET(request:Request){
    try{
        const { searchParams } = new URL(request.url)

        // Support query parameters for filtering
        const id = searchParams.get('id')
        const type = searchParams.get('type')
        const department = searchParams.get('department')
        const search = searchParams.get('search')
        const status = searchParams.get('status')
        const display = searchParams.get('display')

        let filteredDocuments = [...faqdocuments]

        // Filter by search term
        if (search) {
        filteredDocuments = filteredDocuments.filter(doc => 
            doc.department.toLowerCase().includes(search.toLowerCase()) ||
            doc.title.toLowerCase().includes(search.toLowerCase()) ||
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
        
        // Filter by department
        if (department) {
        filteredDocuments = filteredDocuments.filter(doc => doc.department === department)
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