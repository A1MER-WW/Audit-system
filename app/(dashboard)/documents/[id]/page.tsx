"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, FileText, Calendar, User, Download, Eye, Edit, Share2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

// Mock data - ในอนาคตจะ fetch จาก API
const getDocumentById = (id: string) => {
  const documents = {
    "1": {
      id: "1",
      documentName: "รายงานการตรวจสอบงบประมาณประจำปี 2568",
      description: "รายงานการตรวจสอบการใช้งบประมาณประจำปี พ.ศ. 2568 ของสำนักงานเลขาธิการวุฒิสภา",
      year: "2568",
      dateUploaded: "15/03/2568",
      fileType: "PDF",
      fileSize: "2.5 MB",
      author: "นาย ส. ตรวจสอบ",
      department: "กลุ่มงานตรวจสอบภายใน",
      status: "อนุมัติแล้ว",
      version: "1.2",
      lastModified: "20/03/2568",
      downloadCount: 45,
      category: "รายงานการตรวจสอบ"
    },
    "2": {
      id: "2", 
      documentName: "แผนการตรวจสอบประจำปี 2569",
      description: "แผนการดำเนินการตรวจสอบภายในประจำปีงบประมาณ พ.ศ. 2569",
      year: "2569",
      dateUploaded: "10/02/2568",
      fileType: "DOCX",
      fileSize: "1.8 MB",
      author: "นางสาว ป. วางแผน",
      department: "กลุ่มงานตรวจสอบภายใน",
      status: "ร่าง",
      version: "0.9",
      lastModified: "18/03/2568",
      downloadCount: 23,
      category: "แผนการตรวจสอบ"
    }
  };
  
  return documents[id as keyof typeof documents] || null;
};

export default function DocumentDetailPage({ params }: Props) {
  const router = useRouter();
  const [document, setDocument] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDocument = async () => {
      const resolvedParams = await params;
      // Mock API call
      const doc = getDocumentById(resolvedParams.id);
      setDocument(doc);
      setLoading(false);
    };
    
    loadDocument();
  }, [params]);

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">กำลังโหลด...</div>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            กลับ
          </Button>
        </div>
        
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">ไม่พบเอกสาร</h2>
            <p className="text-gray-600">เอกสารที่คุณต้องการหาไม่มีในระบบ</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
      {/* Back Button */}
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          กลับ
        </Button>
      </div>
      
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="h-6 w-6 text-[#3E52B9]" />
            <h1 className="text-2xl font-bold">{document.documentName}</h1>
            <Badge variant={document.status === 'อนุมัติแล้ว' ? 'default' : 'secondary'}>
              {document.status}
            </Badge>
          </div>
          <p className="text-gray-600 mb-4">{document.description}</p>
          
          {/* Document Meta Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-500">ประเภทไฟล์:</span>
              <p className="font-medium">{document.fileType}</p>
            </div>
            <div>
              <span className="font-medium text-gray-500">ขนาดไฟล์:</span>
              <p className="font-medium">{document.fileSize}</p>
            </div>
            <div>
              <span className="font-medium text-gray-500">เวอร์ชัน:</span>
              <p className="font-medium">v{document.version}</p>
            </div>
            <div>
              <span className="font-medium text-gray-500">ดาวน์โหลด:</span>
              <p className="font-medium">{document.downloadCount} ครั้ง</p>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            ดูตัวอย่าง
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            แก้ไข
          </Button>
          <Button className="bg-[#3E52B9] hover:bg-[#2A3B87]" size="sm">
            <Download className="h-4 w-4 mr-2" />
            ดาวน์โหลด
          </Button>
        </div>
      </div>

      {/* Document Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                รายละเอียดเอกสาร
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">ชื่อเอกสาร</label>
                <p className="font-medium">{document.documentName}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">คำอธิบาย</label>
                <p className="text-gray-700">{document.description}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">หมวดหมู่</label>
                <p className="font-medium">{document.category}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">ปีงบประมาณ</label>
                  <p className="font-medium">{document.year}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">หน่วยงาน</label>
                  <p className="font-medium">{document.department}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Document Preview */}
          <Card>
            <CardHeader>
              <CardTitle>ตัวอย่างเอกสาร</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">ตัวอย่างเอกสาร {document.fileType}</p>
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    เปิดดูเอกสาร
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                ข้อมูลผู้สร้าง
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">ผู้สร้าง</label>
                <p className="font-medium">{document.author}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">วันที่อัพโหลด</label>
                <p className="font-medium">{document.dateUploaded}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">แก้ไขล่าสุด</label>
                <p className="font-medium">{document.lastModified}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                การแชร์
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Share2 className="h-4 w-4 mr-2" />
                  แชร์ลิงก์
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  ส่งออกเป็น PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}