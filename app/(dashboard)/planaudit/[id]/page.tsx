"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Calendar, User, Target, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

// Mock data
const getPlanAuditById = (id: string) => {
  const plans = {
    "1": {
      id: "1",
      title: "งานตรวจการใช้จ่ายเงินที่ได้รับการอุดหนุนจากรัฐบาลด้านงานพัฒนา",
      agency: "สกท.",
      description: "ตรวจสอบการใช้จ่ายเงินงบประมาณที่ได้รับการอุดหนุนจากรัฐบาลเพื่อการพัฒนาโครงการต่างๆ",
      status: "กำลังดำเนินการ",
      priority: "สูง",
      startDate: "01/10/2567",
      endDate: "31/03/2568",
      auditor: "นาย ส. ตรวจสอบ",
      team: ["นางสาว ป. วิเคราะห์", "นาย ค. ประเมิน"],
      budget: "2,500,000",
      progress: 45,
      riskLevel: "ปานกลาง",
      objectives: [
        "ตรวจสอบความถูกต้องของการใช้จ่ายงบประมาณ",
        "ประเมินประสิทธิภาพการดำเนินงาน",
        "ตรวจสอบการปฏิบัติตามระเบียบและข้อกำหนด"
      ],
      scope: "ครอบคลุมการตรวจสอบการใช้จ่ายงบประมาณทั้งหมดที่ได้รับการอุดหนุนจากรัฐบาล",
      findings: [
        {
          id: 1,
          type: "ข้อบกพร่อง",
          description: "พบการใช้จ่ายไม่เป็นไปตามแผนที่กำหนด",
          recommendation: "ปรับปรุงระบบการติดตามการใช้จ่าย",
          status: "รอการแก้ไข"
        },
        {
          id: 2,
          type: "จุดแข็ง", 
          description: "มีระบบการควบคุมการใช้จ่ายที่ดี",
          recommendation: "คงไว้ซึ่งการปฏิบัติที่ดี",
          status: "เสร็จสิ้น"
        }
      ],
      timeline: [
        { phase: "วางแผน", startDate: "01/10/2567", endDate: "15/10/2567", status: "เสร็จสิ้น" },
        { phase: "เก็บข้อมูล", startDate: "16/10/2567", endDate: "30/11/2567", status: "เสร็จสิ้น" },
        { phase: "วิเคราะห์", startDate: "01/12/2567", endDate: "31/01/2568", status: "กำลังดำเนินการ" },
        { phase: "รายงาน", startDate: "01/02/2568", endDate: "31/03/2568", status: "รอดำเนินการ" }
      ]
    },
    "2": {
      id: "2",
      title: "งานตรวจสอบการบริหารบุคคลในระดับข้อกำหนดเฉพาะตำแหน่ง", 
      agency: "สกท.",
      description: "ตรวจสอบการบริหารทรัพยากรบุคคลและการปฏิบัติตามข้อกำหนดเฉพาะตำแหน่ง",
      status: "วางแผน",
      priority: "ปานกลาง",
      startDate: "01/02/2568",
      endDate: "30/06/2568", 
      auditor: "นางสาว ป. วางแผน",
      team: ["นาย ก. ตรวจสอบ"],
      budget: "1,800,000",
      progress: 15,
      riskLevel: "ต่ำ",
      objectives: [
        "ตรวจสอบการจัดการทรัพยากรบุคคล",
        "ประเมินการปฏิบัติตามข้อกำหนดตำแหน่ง"
      ],
      scope: "ครอบคลุมการตรวจสอบระบบบริหารบุคคลทั้งหมด",
      findings: [],
      timeline: [
        { phase: "วางแผน", startDate: "01/02/2568", endDate: "15/02/2568", status: "กำลังดำเนินการ" },
        { phase: "เก็บข้อมูล", startDate: "16/02/2568", endDate: "31/03/2568", status: "รอดำเนินการ" },
        { phase: "วิเคราะห์", startDate: "01/04/2568", endDate: "31/05/2568", status: "รอดำเนินการ" },
        { phase: "รายงาน", startDate: "01/06/2568", endDate: "30/06/2568", status: "รอดำเนินการ" }
      ]
    }
  };
  
  return plans[id as keyof typeof plans] || null;
};

export default function PlanAuditDetailPage({ params }: Props) {
  const router = useRouter();
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlan = async () => {
      const resolvedParams = await params;
      const planData = getPlanAuditById(resolvedParams.id);
      setPlan(planData);
      setLoading(false);
    };
    
    loadPlan();
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

  if (!plan) {
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
            <p className="text-gray-600">แผนการตรวจสอบที่คุณต้องการหาไม่มีในระบบ</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'เสร็จสิ้น': return 'bg-green-100 text-green-800';
      case 'กำลังดำเนินการ': return 'bg-blue-100 text-blue-800';
      case 'วางแผน': return 'bg-yellow-100 text-yellow-800';
      case 'รอดำเนินการ': return 'bg-gray-100 text-gray-800';
      case 'รอการแก้ไข': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'สูง': return 'bg-red-100 text-red-800';
      case 'ปานกลาง': return 'bg-yellow-100 text-yellow-800';
      case 'ต่ำ': return 'bg-green-100 text-green-800';
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
      case 'ข้อเสนอแนะ': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
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
            <Target className="h-6 w-6 text-[#3E52B9]" />
            <h1 className="text-2xl font-bold">{plan.title}</h1>
            <Badge className={getStatusColor(plan.status)}>
              {plan.status}
            </Badge>
          </div>
          <p className="text-gray-600 mb-4">{plan.description}</p>
          
          {/* Plan Meta Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-500">หน่วยงาน:</span>
              <p className="font-medium">{plan.agency}</p>
            </div>
            <div>
              <span className="font-medium text-gray-500">ความสำคัญ:</span>
              <Badge className={getPriorityColor(plan.priority)}>
                {plan.priority}
              </Badge>
            </div>
            <div>
              <span className="font-medium text-gray-500">ระดับความเสี่ยง:</span>
              <Badge className={getRiskColor(plan.riskLevel)}>
                {plan.riskLevel}
              </Badge>
            </div>
            <div>
              <span className="font-medium text-gray-500">งบประมาณ:</span>
              <p className="font-medium">{plan.budget} บาท</p>
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
            <Calendar className="h-4 w-4 mr-2" />
            อัพเดตแผน
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                ข้อมูลแผนการตรวจสอบ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">วัตถุประสงค์</label>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  {plan.objectives.map((objective: string, index: number) => (
                    <li key={index} className="text-gray-700">{objective}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">ขอบเขตการตรวจสอบ</label>
                <p className="text-gray-700 mt-1">{plan.scope}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">ผู้ตรวจสอบหลัก</label>
                  <p className="font-medium">{plan.auditor}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">ทีมตรวจสอบ</label>
                  <div className="space-y-1">
                    {plan.team.map((member: string, index: number) => (
                      <p key={index} className="text-sm text-gray-700">{member}</p>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>แผนการดำเนินงาน</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {plan.timeline.map((phase: any, index: number) => (
                  <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className={`w-3 h-3 rounded-full ${
                      phase.status === 'เสร็จสิ้น' ? 'bg-green-500' :
                      phase.status === 'กำลังดำเนินการ' ? 'bg-blue-500' :
                      'bg-gray-300'
                    }`}></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{phase.phase}</h4>
                        <Badge className={getStatusColor(phase.status)} variant="outline">
                          {phase.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {phase.startDate} - {phase.endDate}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Findings */}
          {plan.findings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>ผลการตรวจสอบ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {plan.findings.map((finding: any) => (
                    <div key={finding.id} className="border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        {getFindingIcon(finding.type)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{finding.type}</Badge>
                            <Badge className={getStatusColor(finding.status)} variant="outline">
                              {finding.status}
                            </Badge>
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
          )}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Progress Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">ความคืบหน้า</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#3E52B9] mb-2">
                  {plan.progress}%
                </div>
                <div className="text-gray-500 mb-4">ความคืบหน้าโดยรวม</div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-[#3E52B9] h-3 rounded-full transition-all" 
                    style={{ width: `${plan.progress}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                กำหนดการ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">วันที่เริ่ม</label>
                <p className="font-medium">{plan.startDate}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">วันที่สิ้นสุด</label>
                <p className="font-medium">{plan.endDate}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">ระยะเวลา</label>
                <p className="font-medium">6 เดือน</p>
              </div>
            </CardContent>
          </Card>

          {/* Team Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                ทีมงาน
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">ผู้ตรวจสอบหลัก</label>
                  <p className="font-medium">{plan.auditor}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">สมาชิกทีม</label>
                  <div className="space-y-1">
                    {plan.team.map((member: string, index: number) => (
                      <p key={index} className="text-sm text-gray-700">• {member}</p>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}