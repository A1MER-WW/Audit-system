import { NextResponse } from 'next/server'

export type Document = {
  id: string
  documentName: string
  description: string
  year: string
  dateUploaded: string
  fileType: string
}


const mockDocuments: Document[] = [
  {
    id: "1",
    documentName: "แผนการปฏิบัติงาน ปี 2568 องค์",
    description: "แผนการปฏิบัติงาน องค์.",
    year: "2568",
    dateUploaded: "20/06/2568 14:00 น.",
    fileType: "PDF",
  },
  {
    id: "2",
    documentName: "แผนผลงานปฏิบัติงานและแผนการวิจัยงานประจำ 2568",
    description: "แผนการการวิจัยงาน องค์.",
    year: "2568",
    dateUploaded: "20/06/2568 14:00 น.",
    fileType: "PDF",
  },
  {
    id: "3",
    documentName: "วารสารตรวจสอบภายในมหาวิทยาลัย (Audit Universe)",
    description: "วารสารตรวจสอบภายในมหาวิทยาลัย",
    year: "2568",
    dateUploaded: "15/07/2568 10:00 น.",
    fileType: "PDF",
  },
  {
    id: "4",
    documentName: "แนวแนวทางการปฏิบัติเพื่อการวิจัยตรวจสอบภายในที่มีคุณภาพ",
    description: "แนวแนวทางการปฏิบัติเพื่อการวิจัยตรวจสอบภายในมหาวิทยาลัย",
    year: "2568",
    dateUploaded: "01/08/2568 09:00 น.",
    fileType: "PDF",
  },
  {
    id: "5",
    documentName: "ปัญญาอันมีและการพิจารณาวิเคราะห์งานในการจัดหาและการบริหารจัดการที่",
    description: "ปัญญาอันมีและการพิจารณาวิเคราะห์งานที่งานการวิจัยที่สามารถปฏิบัติการวิจัยได้",
    year: "2568",
    dateUploaded: "05/09/2568 11:00 น.",
    fileType: "PDF",
  },
  {
    id: "6",
    documentName: "ปัญญาอันมีและการพิจารณาวิเคราะห์งานที่งานการวิจัยที่สามารถปฏิบัติการวิจัยได้อาจ",
    description: "ปัญญาอันมีและการพิจารณาวิเคราะห์งานที่งานการวิจัยที่สามารถปฏิบัติการวิจัยได้งาน",
    year: "2568",
    dateUploaded: "12/10/2568 13:30 น.",
    fileType: "PDF",
  },
  {
    id: "7",
    documentName: "นการประเมินภาวะแล้วการวิจัยตรวจสอบภายในที่มีคุณภาพ (Audit Universe)",
    description: "นการประเมินภาวะแล้วการวิจัยตรวจสอบตรวจสอบภายในมหาวิทยาลัย",
    year: "2568",
    dateUploaded: "20/11/2568 15:00 น.",
    fileType: "PDF",
  },
  {
    id: "8",
    documentName: "นการวิจัยที่การภายในแล้วการวิจัยตรวจสอบภายในที่มีคุณภาพ (Audit Universe)",
    description: "นการวิจัยที่การภายในแล้วการวิจัยตรวจสอบตรวจสอบภายในมหาวิทยาลัย",
    year: "2568",
    dateUploaded: "30/12/2568 09:00 น.",
    fileType: "PDF",
  },
  {
    id: "9",
    documentName: "นการประเมินภาวะแล้วและการจัดการที่การอย่างที่เป็นที่ปฏิบัติงานการวิจัยที่สามารถปฏิบัติการได้งาน",
    description: "นการประเมินภาวะแล้วและการจัดการที่การกิจกรรมที่เป็นที่ปฏิบัติงานการวิจัยที่สามารถปฏิบัติการได้งาน",
    year: "2568",
    dateUploaded: "20/01/2569 10:00 น.",
    fileType: "PDF",
  },
  {
    id: "10",
    documentName: "แผนการตรวจสอบประจำปี",
    description: "แผนการตรวจสอบประจำปี",
    year: "2568",
    dateUploaded: "28/02/2569 14:00 น.",
    fileType: "PDF",
  },
  {
    id: "11",
    documentName: "แผนการตรวจสอบยุทธศาสตร์",
    description: "แผนการตรวจสอบยุทธศาสตร์องค์กร",
    year: "2568",
    dateUploaded: "15/03/2569 11:00 น.",
    fileType: "PDF",
  },
  {
    id: "12",
    documentName: "รายงานการปฏิบัติงาน (Audit Program) / Engagement Plan",
    description: "แผนการปฏิบัติงาน (Audit Program) / Engagement Plan",
    year: "2568",
    dateUploaded: "10/04/2569 15:00 น.",
    fileType: "PDF",
  },
  {
    id: "13",
    documentName: "คู่มือการตรวจสอบภายในระบบคุณภาพ",
    description: "คู่มือการตรวจสอบภายในระบบคุณภาพการศึกษา",
    year: "2568",
    dateUploaded: "22/04/2569 09:30 น.",
    fileType: "PDF",
  },
  {
    id: "14",
    documentName: "รายงานการประเมินความเสี่ยงขององค์กร",
    description: "รายงานการประเมินความเสี่ยงและการบริหารความเสี่ยง",
    year: "2568",
    dateUploaded: "05/05/2569 16:45 น.",
    fileType: "PDF",
  },
  {
    id: "15",
    documentName: "มาตรฐานการตรวจสอบภายใน IIA Standards",
    description: "มาตรฐานสากลการตรวจสอบภายใน Institute of Internal Auditors",
    year: "2568",
    dateUploaded: "18/05/2569 13:15 น.",
    fileType: "PDF",
  },
  {
    id: "16",
    documentName: "รายงานผลการตรวจสอบการปฏิบัติตามกฎระเบียบ",
    description: "รายงานการตรวจสอบการปฏิบัติตามกฎระเบียบและข้อบังคับ",
    year: "2568",
    dateUploaded: "30/05/2569 14:20 น.",
    fileType: "PDF",
  },
  {
    id: "17",
    documentName: "รายงานการตรวจสอบระบบควบคุมภายใน",
    description: "รายงานการประเมินและตรวจสอบระบบควบคุมภายใน",
    year: "2568",
    dateUploaded: "15/06/2569 10:30 น.",
    fileType: "PDF",
  },
  {
    id: "18",
    documentName: "แผนการพัฒนาบุคลากรด้านการตรวจสอบ",
    description: "แผนการพัฒนาศักยภาพบุคลากรด้านการตรวจสอบภายใน",
    year: "2568",
    dateUploaded: "02/07/2569 16:15 น.",
    fileType: "PDF",
  },
  {
    id: "19",
    documentName: "คู่มือจรรยาบรรณสำหรับผู้ตรวจสอบภายใน",
    description: "คู่มือจรรยาบรรณและหลักการปฏิบัติสำหรับผู้ตรวจสอบภายใน",
    year: "2568",
    dateUploaded: "20/07/2569 09:45 น.",
    fileType: "PDF",
  },
  {
    id: "20",
    documentName: "รายงานการติดตามผลการปฏิบัติตามข้อเสนอแนะ",
    description: "รายงานการติดตามผลการปฏิบัติตามข้อเสนอแนะจากการตรวจสอบ",
    year: "2568",
    dateUploaded: "05/08/2569 13:50 น.",
    fileType: "PDF",
  },
  {
    id: "21",
    documentName: "แผนการตรวจสอบความปลอดภัยสารสนเทศ",
    description: "แผนการตรวจสอบความมั่นคงปลอดภัยระบบสารสนเทศ",
    year: "2568",
    dateUploaded: "18/08/2569 11:25 น.",
    fileType: "PDF",
  },
  {
    id: "22",
    documentName: "รายงานการตรวจสอบการบริหารความเสี่ยง",
    description: "รายงานการประเมินประสิทธิผลการบริหารความเสี่ยงองค์กร",
    year: "2568",
    dateUploaded: "30/08/2569 15:10 น.",
    fileType: "PDF",
  },
]

// GET /api/documents - ดึงข้อมูลเอกสารทั้งหมด
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Support query parameters for filtering
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const year = searchParams.get('year')
    
    let filteredDocuments = [...mockDocuments]
    
    // Filter by search term
    if (search) {
      filteredDocuments = filteredDocuments.filter(doc => 
        doc.documentName.toLowerCase().includes(search.toLowerCase()) ||
        doc.description.toLowerCase().includes(search.toLowerCase())
      )
    }
    
    // Filter by year
    if (year) {
      filteredDocuments = filteredDocuments.filter(doc => doc.year === year)
    }
    
    // Filter by category (สำหรับอนาคตถ้าต้องการแยกตาม tab)
    if (category) {
      // สามารถเพิ่ม logic filter ตาม category ได้ที่นี่
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

// POST /api/documents - เพิ่มเอกสารใหม่
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const { documentName, description, year, fileType } = body
    
    if (!documentName || !description || !year || !fileType) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Missing required fields",
          message: "documentName, description, year, and fileType are required"
        },
        { status: 400 }
      )
    }
    
    // Create new document
    const newDocument: Document = {
      id: (mockDocuments.length + 1).toString(),
      documentName,
      description,
      year,
      fileType,
      dateUploaded: new Date().toLocaleDateString('th-TH', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Bangkok'
      }) + ' น.'
    }
    
    // Add to mock data (in real app, this would save to database)
    mockDocuments.push(newDocument)
    
    return NextResponse.json({
      success: true,
      data: newDocument,
      message: "Document created successfully"
    }, { status: 201 })
    
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to create document",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
