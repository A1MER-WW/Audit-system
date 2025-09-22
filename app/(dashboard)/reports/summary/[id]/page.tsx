"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, FileText, Calendar, User, MessageSquare, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

// Mock data - ในอนาคตจะ fetch จาก API
const getSummaryById = (id: string) => {
  const summaries = {
    "1": {
      id: "1",
      title: "การจัดการงบประมาณประจำปี 2568",
      description: "สรุปความเห็นการตรวจสอบการจัดการงบประมาณประจำปี พ.ศ. 2568",
      code: "AUD-2568-001",
      department: "กลุ่มงานตรวจสอบภายใน",
      auditor: "นาย ส. ตรวจสอบ",
      status: "เห็นด้วย",
      score: "85",
      auditDate: "15/03/2568",
      completedDate: "20/03/2568",
      lastModified: "22/03/2568",
      riskLevel: "ปานกลาง",
      findings: [
        {
          id: 1,
          title: "การควบคุมการใช้จ่ายงบประมาณ",
          description: "พบว่าการควบคุมการใช้จ่ายงบประมาณมีประสิทธิภาพ มีการติดตามและรายงานอย่างสม่ำเสมอ",
          type: "จุดแข็ง",
          recommendation: "ควรคงการปฏิบัติที่ดีนี้ไว้"
        },
        {
          id: 2,
          title: "ระบบการอนุมัติค่าใช้จ่าย",
          description: "ระบบการอนุมัติยังไม่เป็นระบบอิเล็กทรอนิกส์ อาจทำให้เกิดความล่าช้า",
          type: "ข้อเสนอแนะ", 
          recommendation: "ควรพัฒนาระบบการอนุมัติออนไลน์เพื่อเพิ่มประสิทธิภาพ"
        }
      ],
      comments: [
        {
          id: 1,
          author: "หัวหน้ากลุ่มตรวจสอบ",
          date: "23/03/2568",
          comment: "เห็นด้วยกับผลการตรวจสอบ ควรดำเนินการตามข้อเสนอแนะ",
          type: "approve"
        }
      ]
    },
    "2": {
      id: "2",
      title: "การจัดการทรัพยากรบุคคล",
      description: "สรุปความเห็นการตรวจสอบการจัดการทรัพยากรบุคคลประจำปี 2568",
      code: "AUD-2568-002", 
      department: "กลุ่มงานตรวจสอบภายใน",
      auditor: "นางสาว ป. วิเคราะห์",
      status: "มีข้อสังเกต",
      score: "75",
      auditDate: "10/02/2568",
      completedDate: "18/02/2568", 
      lastModified: "20/02/2568",
      riskLevel: "สูง",
      findings: [
        {
          id: 1,
          title: "การพัฒนาบุคลากร",
          description: "พบว่าการพัฒนาบุคลากรยังไม่เป็นระบบ ขาดแผนการพัฒนาที่ชัดเจน",
          type: "ข้อบกพร่อง",
          recommendation: "ควรจัดทำแผนการพัฒนาบุคลากรระยะยาว"
        }
      ],
      comments: []
    }
  };
  
  return summaries[id as keyof typeof summaries] || null;
};

export default function SummaryDetailPage({ params }: Props) {
  const router = useRouter();
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSummary = async () => {
      const resolvedParams = await params;
      // Mock API call
      const summaryData = getSummaryById(resolvedParams.id);
      setSummary(summaryData);
      setLoading(false);
    };
    
    loadSummary();
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

  if (!summary) {
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
            <h2 className="text-xl font-semibold text-gray-900 mb-2">ไม่พบข้อมูล</h2>
            <p className="text-gray-600">รายงานสรุปที่คุณต้องการหาไม่มีในระบบ</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'เห็นด้วย': return 'bg-green-100 text-green-800';
      case 'มีข้อสังเกต': return 'bg-yellow-100 text-yellow-800';
      case 'ไม่เห็นด้วย': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'สูง': return 'bg-red-100 text-red-800';
      case 'ปานกลาง': return 'bg-yellow-100 text-yellow-800';
      case 'ต่ำ': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFindingIcon = (type: string) => {
    switch (type) {
      case 'จุดแข็ง': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'ข้อบกพร่อง': return <XCircle className="h-5 w-5 text-red-600" />;
      case 'ข้อเสนอแนะ': return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      default: return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

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
            <h1 className="text-2xl font-bold">{summary.title}</h1>
            <Badge className={getStatusColor(summary.status)}>
              {summary.status}
            </Badge>
          </div>
          <p className="text-gray-600 mb-4">{summary.description}</p>
          
          {/* Summary Meta Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-500">รหัสงาน:</span>
              <p className="font-medium">{summary.code}</p>
            </div>
            <div>
              <span className="font-medium text-gray-500">คะแนน:</span>
              <p className="font-medium">{summary.score}/100</p>
            </div>
            <div>
              <span className="font-medium text-gray-500">ระดับความเสี่ยง:</span>
              <Badge className={getRiskColor(summary.riskLevel)}>
                {summary.riskLevel}
              </Badge>
            </div>
            <div>
              <span className="font-medium text-gray-500">วันที่เสร็จสิ้น:</span>
              <p className="font-medium">{summary.completedDate}</p>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            ส่งออกรายงาน
          </Button>
          <Button className="bg-[#3E52B9] hover:bg-[#2A3B87]" size="sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            แสดงความคิดเห็น
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Audit Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                ข้อมูลการตรวจสอบ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">ผู้ตรวจสอบ</label>
                  <p className="font-medium">{summary.auditor}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">หน่วยงาน</label>
                  <p className="font-medium">{summary.department}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">วันที่ตรวจสอบ</label>
                  <p className="font-medium">{summary.auditDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">แก้ไขล่าสุด</label>
                  <p className="font-medium">{summary.lastModified}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Findings */}
          <Card>
            <CardHeader>
              <CardTitle>ผลการตรวจสอบ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {summary.findings.map((finding: any) => (
                  <div key={finding.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      {getFindingIcon(finding.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{finding.title}</h4>
                          <Badge variant="outline">{finding.type}</Badge>
                        </div>
                        <p className="text-gray-700 mb-2">{finding.description}</p>
                        <div className="bg-blue-50 p-3 rounded">
                          <p className="text-sm"><strong>ข้อเสนอแนะ:</strong> {finding.recommendation}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Score Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">คะแนนรวม</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#3E52B9] mb-2">
                  {summary.score}
                </div>
                <div className="text-gray-500">จาก 100 คะแนน</div>
                <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#3E52B9] h-2 rounded-full" 
                    style={{ width: `${summary.score}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                ความคิดเห็น
              </CardTitle>
            </CardHeader>
            <CardContent>
              {summary.comments.length > 0 ? (
                <div className="space-y-3">
                  {summary.comments.map((comment: any) => (
                    <div key={comment.id} className="border-l-4 border-[#3E52B9] pl-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{comment.author}</span>
                        <span className="text-xs text-gray-500">{comment.date}</span>
                      </div>
                      <p className="text-sm text-gray-700">{comment.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  ยังไม่มีความคิดเห็น
                </div>
              )}
              
              <div className="mt-4">
                <Textarea 
                  placeholder="เพิ่มความคิดเห็น..."
                  className="mb-2"
                />
                <Button size="sm" className="w-full bg-[#3E52B9] hover:bg-[#2A3B87]">
                  เพิ่มความคิดเห็น
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}