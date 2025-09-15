import { consultDocumentType } from '@/hooks/useConsultDocuments'
import { NextResponse } from 'next/server'


const consultdocuments:consultDocumentType[] = [
    {
        id: 1,
        department:"AAAA",
        title:"เกร็ดความรู้ การเบิกค่าใช้จ่ายในการเดินทางไปยังต่างประเทศ",
        detial: "ตามพระราชกฤษฎีกาค่าใชัจ่ายเดินทางไปราชการ พ.ศ.2526 และที่แก้ไขเพิ่มเติม า่ห้เกดา่หกา่ดา่ห้กดรหก้า่ดหากด้รหีกดาหก้ดรนหีกด้าห่กด้าห่กด้ากห่้ดาหก่้ด",
        status: "ยังไม่ได้ดำเนินการ",
        display:"Inactive",
    },
   {
        id: 2,
        department:"BBBBB",
        title:"โครงสร้างแผนงานตามยุทธศาสตร์",
        detial: "พระราชกฤษฎีกาค่าใชัจ่ายเดินทางไปราชการ พ.ศ.2526 และที่แก้ไขเพิ่มเติม า่ห้เกดา่หกา่ดา่ห้กดรหก้า่ดหากด้รหีกดาหก้ดรนหีกด้าห่กด้าห่กด้ากห่้ดาหก่้ด",
        status: "รออนุมัติ",
        display:"Inactive",
    },
    {
        id: 3,
        department:"CCCC",
        title:"ข้อกำหนดค่าใช้จ่ายสำหรับเดินทาง",
        detial: " และที่แก้ไขเพิ่มเติม า่ห้เกดา่หกา่ดา่ห้กดรหก้า่ดหากด้รหีกดาหก้ดรนหีกด้าห่กด้าห่กด้ากห่้ดาหก่้ด",
        status: "ดำเนินการแล้ว",
        display:"Active",
    },
    {
        id: 4,
        department:"DDDD",
        title:"แนวทางการขออนุมัติให้ข้าราชการเดินทางไปจ่างประเทศชั่วคราว",
        detial: "า่ห้เกดา่หกา่ดา่ห้กดรหก้า่ดหากด้รหีกดาหก้ดรนหีกด้าห่กด้าห่กด้ากห่้ดาหก่้ด",
        status: "ดำเนินการแล้ว",
        display:"Active",
    },
    {
        id: 5,
        department:"หน่วยงาน",
        title:"4หลักการ จัดซื้อจัดจ้างให้ถูกตามเกรฑ์ที่กำหนด",
        detial: "ตามพระราชกฤษฎีกาค่าใชัจ่ายเดินทางไปราชการ พ.ศ.2526 และที่แก้ไขเพิ่มเติม า่ห้เกดา่หกา่ดา่ห้กดรหก้า่ดหากด้รหีกดาหก้ดรนหีกด้าห่กด้าห่กด้ากห่้ดาหก่้ด",
        status: "ดำเนินการแล้ว",
        display:"Active",
    }
]

export async function GET(request: Request){
  try{
    const { searchParams } = new URL(request.url)
    
    // Support query parameters for filtering
    const department = searchParams.get('department')
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const display = searchParams.get('display')
    
    let filteredDocuments = [...consultdocuments]

    // Filter by search term
    if (search) {
      filteredDocuments = filteredDocuments.filter(doc => 
        doc.department.toLowerCase().includes(search.toLowerCase()) ||
        doc.title.toLowerCase().includes(search.toLowerCase()) ||
        doc.detial.toLowerCase().includes(search.toLowerCase()) ||
        doc.status.toLowerCase().includes(search.toLowerCase()) ||
        doc.display.toLowerCase().includes(search.toLowerCase())
      )
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