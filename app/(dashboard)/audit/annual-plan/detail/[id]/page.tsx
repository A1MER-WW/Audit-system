

"use client"

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { SignatureComponent } from '@/components/signature-component';
import { OTPVerification } from '@/components/otp-verification';
import { ArrowLeft, Search, PenTool, FileText } from 'lucide-react';
import { useState, use } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  params: Promise<{
    id: string;
  }>;    
}

export default function AnnualPlanDetailPage({ params }: Props) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isResponsibleDialogOpen, setIsResponsibleDialogOpen] = useState(false);
  const [isSignatureDialogOpen, setIsSignatureDialogOpen] = useState(false);
  const [approvalStep, setApprovalStep] = useState(1);
  const [isOtpValid, setIsOtpValid] = useState<boolean>(false);
  const [signatureChoice, setSignatureChoice] = useState<'new' | 'saved' | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [responsibleSearchTerm, setResponsibleSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedResponsible, setSelectedResponsible] = useState<string[]>([]);
  const [signatureData, setSignatureData] = useState<{ name: string; signature: string | null }>({
    name: '',
    signature: null
  });
  
  const [formData, setFormData] = useState({
    objective: '',
    scope: '',
    riskAssessment: '',
    auditType: 'Performance Audit',
    timeline: '',
    q1Items: [] as string[],
    q2Items: [] as string[],
    manHours: '',
    auditTeam: '',
    techniques: ''
  });

  // Mock data for audit topics
  const auditTopics = [
    {
      id: '1',
      title: 'ผลการดำเนินโครงการศูนย์บริการรักษาพยาบาลกรุงเทพมหานคร',
      department: 'ศูนย์บริการตรวจ: ศูนย์การแพทย์กรุงเทพมหานคร',
      risk: 'สูงมาก'
    },
    {
      id: '2', 
      title: 'ผลการดำเนินงานกองทุนใครสร้างการผลิตภาคเกษตรเพื่อพัฒนาความสามารถ',
      department: 'หน่วยบริการตรวจ: กองทุน FTA',
      risk: 'สูงมาก'
    },
    {
      id: '3',
      title: 'งานด้านการเงินและงบการ',
      department: 'หน่วยบริการตรวจ: สำนักงานเลขาธิการกรรม/กรุงเทพมหานครในสำนักงานครอบครัวงาน',
      risk: 'สูงมาก'
    },
    {
      id: '4',
      title: 'การสอบทานและประเมินผลการควบคุมภายในและการบริหารความเสี่ยง',
      department: 'หน่วยบริการตรวจ: สำนักงานเลขาธิการกรรม/กรุงเทพมหานครในสำนักงานครอบครัว/สำนักบิการ วิทย์และเศรษฐกิจกรรม',
      risk: 'สูงมาก'
    },
    {
      id: '5',
      title: 'การตรวจสอบการปฏิบัติตามกฎหมายเพิ่มประสิทธิภาพคำสาธารณุปโภคคำง',
      department: 'สำนักงานเศรษฐกิจการงาน',
      risk: 'สูงมาก'
    },
    {
      id: '6',
      title: 'ติดตามความก้าวหน้าในการปฏิบัติตามข้อเสนอแนะในรายงานผลการตรวจสอบ',
      department: 'หน่วยงานในสำนักสำคัญ ศศค.',
      risk: 'สูงมาก'
    },
    {
      id: '7',
      title: 'ให้คำปรึกษาและความน้าหน่วยงานในสำนักความสำคัญทำงานเศรษฐกิจการ',
      department: 'หน่วยงานในสำนักสำคัญ ศศค.',
      risk: 'สูงมาก'
    }
  ];

  // Mock data for responsible persons
  const responsiblePersons = [
    {
      id: '1',
      name: 'กศน.',
      status: 'ผู้ตรวจสอบภายใน'
    },
    {
      id: '2',
      name: 'จิราพร',
      status: 'ผู้ตรวจสอบภายใน'
    },
    {
      id: '3',
      name: 'ภาสกร',
      status: 'ผู้ตรวจสอบภายใน'
    },
    {
      id: '4',
      name: 'ฐวดล',
      status: 'ผู้ตรวจสอบภายใน'
    },
    {
      id: '5',
      name: 'รัฐพล',
      status: 'ผู้ตรวจสอบภายใน'
    }
  ];

  // Mock data for Step 2 audit topics
  const step2Topics = [
    {
      id: 's2-1',
      title: 'รายงานสรุปผลการตรวจสอบภายใน ประจำปีงบประมาณ พ.ศ. 2567'
    },
    {
      id: 's2-2', 
      title: 'การจัดทำแผนบริหารความเสี่ยงและการติดตามผลการดำเนินการแผนบริหารความเสี่ยงของกลุ่มตรวจสอบภายใน'
    },
    {
      id: 's2-3',
      title: 'การจัดทำแผนการควบคุมภายใน (แนบ ปค.4 และ ปก.5) และการติดตามผลการดำเนินการแผนการควบคุมภายในของกลุ่มตรวจสอบภายใน'
    },
    {
      id: 's2-4',
      title: 'การทบทวนและแผนพร่างปปีการตรวจสอบภายใน'
    },
    {
      id: 's2-5',
      title: 'การสอบทานและประเมินผลการควบคุมภายในและจัดทำรายงานการสอบทานการประเมินผลการควบคุมภายใน (แนบ ปก.6)'
    },
    {
      id: 's2-6',
      title: 'การจัดทำอุปิการปฏิบัติงาน'
    },
    {
      id: 's2-7',
      title: 'รายงานความก้าวหน้าการดำเนินงานตามแผนพัฒนาศักยรักรพัฒนาคุณภาพการปฏิบัติงานตรวจสอบภายใน ของกระทรวงเกษตรและสหกรณ์'
    },
    {
      id: 's2-8',
      title: 'การประชุมมาตรการการให้คำแถลงและควบคุมเพื่อสนับสนุปให้เกิดการปรับปรุงกระบวนการบริหารความเสี่ยงของผลการตรวจสอบภายใน'
    },
    {
      id: 's2-9',
      title: 'การดำเนินการตามคำสั่งของปฏิบัติงาน'
    },
    {
      id: 's2-10',
      title: 'รายงานสรุปผลการปฏิบัติงานตรวจสอบภายใน (รายไตรมาส)'
    },
    {
      id: 's2-11',
      title: 'รายงานสรุปผลความก้าวหน้าการให้บริการของกลุ่มตรวจสอบภายใน'
    },
    {
      id: 's2-12',
      title: 'รายงานผลการติดตามความก้าวหน้าการดำเนินงานตามข้อเสนอแนะของหน่วยงานตรวจสอบการกรุ'
    },
    {
      id: 's2-13',
      title: 'รายงานการติดตามประเมินผลสนิทธิภาพขั้นปานต่ำหน่วยตัวราบวิมและการใช้จ่ายงบประมาณของกลุ่มตรวจสอบภายใน'
    },
    {
      id: 's2-14',
      title: 'การจัดการความรู้ (KM) ของกลุ่มตรวจสอบภายใน'
    },
    {
      id: 's2-15',
      title: 'การประเมินความเสี่ยงและจัดทำแผนการตรวจสอบประจำปี'
    },
    {
      id: 's2-16',
      title: 'การประเมินตนเอง (Self-Assessment) ของกลุ่มตรวจสอบภายใน'
    },
    {
      id: 's2-17',
      title: 'รายงานการเปิดผยความขัดแย้งทางผลประโยชน์ของผู้ตรวจสอบภายใน'
    },
    {
      id: 's2-18',
      title: 'รายงานผลการพัฒนาบุคลากรของกลุ่มตรวจสอบภายใน'
    },
    {
      id: 's2-19',
      title: 'การจัดทำแผนการพัฒนาบุคลากรและรายงานผลการพัฒนาบุคลากรรายงานการประเภทคุณภาพของกลุ่มตรวจสอบภายในจากหน่วยงานองค์กร'
    },
    {
      id: 's2-20',
      title: 'การจัดกิจกรรมการแลกเปลี่ยนเรียนรู้ของการองค์กร'
    },
    {
      id: 's2-21',
      title: 'การส่งเสริมและสนับสนุปให้เจ้าหน้าที่กลุ่มตรวจสอบภายในเข้ารึกการอบรม'
    }
  ];

  const filteredTopics = auditTopics.filter(topic =>
    topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    topic.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredResponsible = responsiblePersons.filter(person =>
    person.name.toLowerCase().includes(responsibleSearchTerm.toLowerCase()) ||
    person.status.toLowerCase().includes(responsibleSearchTerm.toLowerCase())
  );

  const handleTopicSelect = (topicId: string, checked: boolean) => {
    setSelectedItems(prev => 
      checked 
        ? [...prev, topicId]
        : prev.filter(id => id !== topicId)
    );
  };

  const handleResponsibleSelect = (personId: string, checked: boolean) => {
    setSelectedResponsible(prev => 
      checked 
        ? [...prev, personId]
        : prev.filter(id => id !== personId)
    );
  };

  const handleDialogSubmit = () => {
    // Handle submission logic here
    console.log('Selected topics:', selectedItems);
    setIsDialogOpen(false);
  };

  const handleResponsibleSubmit = () => {
    // Handle responsible person submission logic here
    console.log('Selected responsible persons:', selectedResponsible);
    setIsResponsibleDialogOpen(false);
  };

  const handleCheckboxChange = (quarter: 'q1Items' | 'q2Items', value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [quarter]: checked 
        ? [...prev[quarter], value]
        : prev[quarter].filter(item => item !== value)
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const handleNextApprovalStep = () => {
    if (approvalStep < 3) {
      setApprovalStep(approvalStep + 1);
    }
  };

  const handlePrevApprovalStep = () => {
    if (approvalStep > 1) {
      setApprovalStep(approvalStep - 1);
    }
  };

  const handleApprovalComplete = () => {
    console.log('Approval completed');
    setIsSignatureDialogOpen(false);
    setApprovalStep(1);
    setSignatureData({name: "", signature: null});
    setSignatureChoice(null);
    setIsOtpValid(false);
  };

  const handleOTPChange = (value: string) => {
    console.log('OTP changed:', value);
    // Mock OTP validation (in real app, verify with backend)
    setIsOtpValid(value === "123456" || value.length === 6);
  };

  const renderApprovalStep = () => {
    switch (approvalStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">ยืนยันการอนุมัติ</h3>
              <p className="text-sm text-gray-600">ตรวจสอบข้อมูลแผนการตรวจสอบภายใน</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">ข้อมูลที่จะพิจารณา</span>
              </div>
              <p className="text-xs text-gray-600">
                แผนการตรวจสอบระยะยาว ประจำปีงบประมาณ พ.ศ. 2568
              </p>
              <div className="mt-2 text-xs text-gray-500">
                กลุ่มตรวจสอบภายใน สำนักงานเลขาธิการวุฒิสภา
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">ลงลายเซ็น</h3>
              <p className="text-sm text-gray-600">เลือกวิธีการลงลายเซ็น</p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => setSignatureChoice('new')}
                className={`w-full p-4 border rounded-lg text-left transition-colors ${
                  signatureChoice === 'new' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    signatureChoice === 'new' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                  }`}>
                    {signatureChoice === 'new' && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1"></div>}
                  </div>
                  <div>
                    <div className="font-medium">เซ็นเอง</div>
                    <div className="text-sm text-gray-500">วาดลายเซ็นใหม่</div>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => setSignatureChoice('saved')}
                className={`w-full p-4 border rounded-lg text-left transition-colors ${
                  signatureChoice === 'saved' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    signatureChoice === 'saved' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                  }`}>
                    {signatureChoice === 'saved' && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1"></div>}
                  </div>
                  <div>
                    <div className="font-medium">เลือกลายเซ็นที่เคยบันทึกไว้</div>
                    <div className="text-sm text-gray-500">ใช้ลายเซ็นที่บันทึกไว้แล้ว</div>
                  </div>
                </div>
              </button>
            </div>

            {signatureChoice === 'new' && (
              <div className="mt-4">
                <SignatureComponent
                  onSignatureChange={setSignatureData}
                  initialName="ผู้อนุมัติ"
                />
              </div>
            )}
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">ยืนยันด้วย OTP</h3>
              <p className="text-sm text-gray-600">
                {signatureChoice === 'saved' 
                  ? 'ใช้รหัส OTP เพื่อยืนยันการใช้ลายเซ็นที่บันทึกไว้' 
                  : 'ยืนยันการอนุมัติด้วยรหัส OTP'
                }
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <FileText className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-green-800">ข้อมูลพร้อมอนุมัติ</h4>
                    <p className="text-xs text-green-600">ตรวจสอบข้อมูลเรียบร้อยแล้ว</p>
                  </div>
                </div>
              </div>
              
              {(signatureChoice === 'new' && signatureData.signature) || signatureChoice === 'saved' ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-xs">✓</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-blue-800">ลายเซ็นยืนยัน</h4>
                      <p className="text-xs text-blue-600">
                        {signatureChoice === 'saved' ? 'ใช้ลายเซ็นที่บันทึกไว้' : signatureData.name}
                      </p>
                    </div>
                  </div>
                  {signatureChoice === 'saved' && (
                    <div className="mt-3 p-2 bg-white rounded border-2 border-dashed border-gray-200">
                      <div className="text-center text-gray-500 text-sm">ลายเซ็นที่บันทึกไว้</div>
                      <div className="h-16 flex items-center justify-center">
                        <svg viewBox="0 0 200 60" className="w-32 h-12">
                          <path d="M10 40 Q 50 10 90 30 Q 130 50 170 20" stroke="black" strokeWidth="2" fill="none" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}

              {/* OTP Verification Section */}
              <div className="rounded-lg p-4">
                <OTPVerification 
                  onOTPChange={handleOTPChange}
                  isValid={isOtpValid}
                />
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4 md:space-y-6">
            {/* Step 1 Content */}
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 md:w-6 md:h-6 bg-[#3E52B9] text-white rounded-full flex items-center justify-center text-xs mt-0.5">1</div>
                <label className="font-medium text-sm md:text-base leading-tight">ผลการดำเนินโครงการศูนย์เรียนรู้การเพิ่มประสิทธิภาพการผลิตสินค้าเกษตร</label>
              </div>
              <div className="ml-6 md:ml-8 space-y-2">
                <p className="text-xs md:text-sm text-muted-foreground">หน่วยรับตรวจ: ศูนย์สารสนเทศการเกษตร</p>
                <p className="text-xs md:text-sm text-muted-foreground">แผนการเข้าตรวจสอบ</p>
              </div>
            </div>

            {/* Quarter Selection */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              <div>
                <h4 className="font-medium mb-3 text-sm md:text-base">ปี 2567</h4>
                <div className="space-y-2">
                  {['ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'].map((month) => (
                    <div key={month} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`q1-${month}`}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange('q1Items', month, checked as boolean)
                        }
                      />
                      <label htmlFor={`q1-${month}`} className="text-xs md:text-sm">{month}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3 text-sm md:text-base">ปี 2568</h4>
                <div className="space-y-2">
                  {['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน'].map((month) => (
                    <div key={month} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`q2-${month}`}
                        checked={['มกราคม', 'กุมภาพันธ์'].includes(month)}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange('q2Items', month, checked as boolean)
                        }
                      />
                      <label htmlFor={`q2-${month}`} className="text-xs md:text-sm">{month}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs md:text-sm font-medium block mb-1">จำนวนคน</label>
                  <Input 
                    value={formData.scope || "1"} 
                    onChange={(e) => handleInputChange('scope', e.target.value)}
                    className="text-sm" 
                  />
                </div>
                <div>
                  <label className="text-xs md:text-sm font-medium block mb-1">วันทำการ</label>
                  <Input 
                    value={formData.riskAssessment || "45"} 
                    onChange={(e) => handleInputChange('riskAssessment', e.target.value)}
                    className="text-sm" 
                  />
                </div>
              </div>

              <div>
                <label className="text-xs md:text-sm font-medium block mb-1">งบประมาณ (บาท)</label>
                <Input 
                  value={formData.auditType} 
                  onChange={(e) => handleInputChange('auditType', e.target.value)}
                  className="text-sm" 
                />
              </div>

              <div>
                <label className="text-xs md:text-sm font-medium block mb-1">ผู้รับผิดชอบ</label>
                <div className='flex flex-col sm:flex-row sm:items-start sm:gap-4'>
                  <Textarea 
                    value={formData.techniques || "ผู้ตรวจสอบ/คณะกรรมการ"} 
                    onChange={(e) => handleInputChange('techniques', e.target.value)}
                    className="text-sm min-h-[80px] mb-2 sm:mb-0" 
                  />
                  
                  <Dialog open={isResponsibleDialogOpen} onOpenChange={setIsResponsibleDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className='bg-[#3E52B9] text-white w-full sm:w-auto whitespace-nowrap'>
                        เลือกผู้รับผิดชอบ
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[95vw] sm:max-w-lg max-h-[90vh] overflow-hidden">
                      <DialogHeader>
                        <div className="flex items-center justify-between">
                          <DialogTitle className="text-base md:text-lg font-semibold">
                            เลือกผู้รับผิดชอบ
                          </DialogTitle>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-blue-600 hover:text-blue-700"
                            onClick={() => {
                              setSelectedResponsible([]);
                              setResponsibleSearchTerm('');
                            }}
                          >
                            Reset
                          </Button>
                        </div>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        {/* Search Box */}
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Search"
                            value={responsibleSearchTerm}
                            onChange={(e) => setResponsibleSearchTerm(e.target.value)}
                            className="pl-10 text-sm"
                          />
                        </div>

                        {/* Responsible Persons List */}
                        <div className="max-h-80 overflow-y-auto space-y-2">
                          {filteredResponsible.map((person) => (
                            <div key={person.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                              <Checkbox
                                id={`person-${person.id}`}
                                checked={selectedResponsible.includes(person.id)}
                                onCheckedChange={(checked) => 
                                  handleResponsibleSelect(person.id, checked as boolean)
                                }
                              />
                              <div className="flex-1">
                                <label 
                                  htmlFor={`person-${person.id}`}
                                  className="font-medium text-sm cursor-pointer"
                                >
                                  {person.name}
                                </label>
                                <p className="text-xs text-muted-foreground">
                                  {person.status}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
                        <Button 
                          variant="outline" 
                          onClick={() => setIsResponsibleDialogOpen(false)}
                          className="w-full sm:w-auto text-sm"
                        >
                          ยกเลิก
                        </Button>
                        <Button 
                          onClick={handleResponsibleSubmit}
                          className="bg-[#3E52B9] hover:bg-[#2A3B87] w-full sm:w-auto text-sm"
                        >
                          ตกลง
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4 md:space-y-6">
            {/* Step 2 Content */}
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 md:w-6 md:h-6 bg-[#3E52B9] text-white rounded-full flex items-center justify-center text-xs mt-0.5">2</div>
                <label className="font-medium text-sm md:text-base leading-tight">การตรวจสอบภายในระหว่างการดำเนินงานของบุคลากรเกี่ยวกับงานการดำเนินบุคลากรเพื่อระงงมึกรงการสองขายใน</label>
              </div>
              <p className="ml-6 md:ml-8 text-xs md:text-sm text-muted-foreground">หน่วยรับตรวจ</p>

              <div className="flex items-start gap-2">
                <div className="w-5 h-5 md:w-6 md:h-6 bg-[#3E52B9] text-white rounded-full flex items-center justify-center text-xs mt-0.5">3</div>
                <label className="font-medium text-sm md:text-base leading-tight">การตรวจสอบการครอบครุงทางยา (แนวง บส 4 และ บห-5) และการวักระตากเกษตรกคำนำการแบบรากาครอบครุงในโครงฯขักรงการสองขายใน</label>
              </div>
              <p className="ml-6 md:ml-8 text-xs md:text-sm text-muted-foreground">หน่วยรับตรวจ</p>

              <div className="flex items-start gap-2">
                <div className="w-5 h-5 md:w-6 md:h-6 bg-[#3E52B9] text-white rounded-full flex items-center justify-center text-xs mt-0.5">4</div>
                <label className="font-medium text-sm md:text-base leading-tight">การถามงบแสนอใแอมการปฏิบัติการดำเนินการปูคเกษใน</label>
              </div>
              <p className="ml-6 md:ml-8 text-xs md:text-sm text-muted-foreground">หน่วยรับตรวจ</p>

              <div className="flex items-start gap-2">
                <div className="w-5 h-5 md:w-6 md:h-6 bg-[#3E52B9] text-white rounded-full flex items-center justify-center text-xs mt-0.5">5</div>
                <label className="font-medium text-sm md:text-base leading-tight">การถามงบแสนและประกันผลกอมการครุงบร้องใบกษะให้ทางามำสามารกกะมการเวพรุ้มแอมการครุงบผู้งไชนข้ใน (แนนไง ลต 6)</label>
              </div>
              <p className="ml-6 md:ml-8 text-xs md:text-sm text-muted-foreground">หน่วยรับตรวจ</p>

              <div className="flex items-start gap-2">
                <div className="w-5 h-5 md:w-6 md:h-6 bg-[#3E52B9] text-white rounded-full flex items-center justify-center text-xs mt-0.5">6</div>
                <label className="font-medium text-sm md:text-base leading-tight">การตรวจสอผู้ตรวจการปฏิบัติการ</label>
              </div>
              <p className="ml-6 md:ml-8 text-xs md:text-sm text-muted-foreground">หน่วยรับตรวจ</p>
            </div>

            {/* Input Field for Unit Details */}
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-medium block">หน่วยงาน</label>
              <Textarea 
                value={formData.scope || "หน่วยการปฏิบัติในบีองการปฏิบัติงานตำแหน่ง = 332 รายการ/ ไข่เนื่องครูแพหงการกุ้างสถา ข้องแพ่ คำรณ้องไม้ องเอาย์การผลิตริ์ปลองอาผ คล/ ยางการซาคาผลั"} 
                onChange={(e) => handleInputChange('scope', e.target.value)}
                className="min-h-[80px] md:min-h-[100px] text-sm" 
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4 md:space-y-6">
            {/* Step 3 Content */}
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 md:w-6 md:h-6 bg-[#3E52B9] text-white rounded-full flex items-center justify-center text-xs mt-0.5">1</div>
                <label className="font-medium text-sm md:text-base leading-tight">คำใช้จ่ายในการดำเนินงานโครงการ</label>
              </div>
              <p className="ml-6 md:ml-8 text-xs md:text-sm text-muted-foreground">หน่วยรับตรวจ: -</p>

              <div className="flex items-start gap-2">
                <div className="w-5 h-5 md:w-6 md:h-6 bg-[#3E52B9] text-white rounded-full flex items-center justify-center text-xs mt-0.5">2</div>
                <label className="font-medium text-sm md:text-base leading-tight">คำใช้จ่ายในการจัดกิจกรรมให้กำปรึกษา</label>
              </div>
              <p className="ml-6 md:ml-8 text-xs md:text-sm text-muted-foreground">หน่วยรับตรวจ: -</p>

              <div className="flex items-start gap-2">
                <div className="w-5 h-5 md:w-6 md:h-6 bg-[#3E52B9] text-white rounded-full flex items-center justify-center text-xs mt-0.5">3</div>
                <label className="font-medium text-sm md:text-base leading-tight">คำจำแนกบริการ</label>
              </div>
              <p className="ml-6 md:ml-8 text-xs md:text-sm text-muted-foreground">หน่วยรับตรวจ: -</p>

              <div className="flex items-start gap-2">
                <div className="w-5 h-5 md:w-6 md:h-6 bg-[#3E52B9] text-white rounded-full flex items-center justify-center text-xs mt-0.5">4</div>
                <label className="font-medium text-sm md:text-base leading-tight">คำวิชิต อุปกรณ์</label>
              </div>
              <p className="ml-6 md:ml-8 text-xs md:text-sm text-muted-foreground">หน่วยรับตรวจ: -</p>

              <div className="flex items-start gap-2">
                <div className="w-5 h-5 md:w-6 md:h-6 bg-[#3E52B9] text-white rounded-full flex items-center justify-center text-xs mt-0.5">5</div>
                <label className="font-medium text-sm md:text-base leading-tight">คำซองแผน</label>
              </div>
              <p className="ml-6 md:ml-8 text-xs md:text-sm text-muted-foreground">หน่วยรับตรวจ: -</p>

              <div className="flex items-start gap-2">
                <div className="w-5 h-5 md:w-6 md:h-6 bg-[#3E52B9] text-white rounded-full flex items-center justify-center text-xs mt-0.5">6</div>
                <label className="font-medium text-sm md:text-base leading-tight">การจัดทำคู่มือการปฏิบัติงาน</label>
              </div>
              <p className="ml-6 md:ml-8 text-xs md:text-sm text-muted-foreground">หน่วยรับตรวจ: -</p>

              <div className="flex items-start gap-2">
                <div className="w-5 h-5 md:w-6 md:h-6 bg-[#3E52B9] text-white rounded-full flex items-center justify-center text-xs mt-0.5">7</div>
                <label className="font-medium text-sm md:text-base leading-tight">คำตอบแทน ได้สอยอื่นๆ</label>
              </div>
              <p className="ml-6 md:ml-8 text-xs md:text-sm text-muted-foreground">หน่วยรับตรวจ: -</p>

              <div className="flex items-start gap-2">
                <div className="w-5 h-5 md:w-6 md:h-6 bg-[#3E52B9] text-white rounded-full flex items-center justify-center text-xs mt-0.5">8</div>
                <label className="font-medium text-sm md:text-base leading-tight">คำสาธารณูปโภค</label>
              </div>
              <p className="ml-6 md:ml-8 text-xs md:text-sm text-muted-foreground">หน่วยรับตรวจ: -</p>

              <div className="flex items-start gap-2">
                <div className="w-5 h-5 md:w-6 md:h-6 bg-[#3E52B9] text-white rounded-full flex items-center justify-center text-xs mt-0.5">9</div>
                <label className="font-medium text-sm md:text-base leading-tight">คำใช้จ่ายในการพัฒนาผู้ตรวจสอบภายใน</label>
              </div>
              <p className="ml-6 md:ml-8 text-xs md:text-sm text-muted-foreground">หน่วยรับตรวจ: -</p>
            </div>

            {/* Input Field for Objective */}
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-medium block">วัตถุประสงค์</label>
              <Textarea 
                value={formData.objective || "เพื่อให้มั่นใจว่าการดำเนินงานเป็นไปตามแผนที่กำหนด และมีการใช้งบประมาณอย่างมีประสิทธิภาพ"} 
                onChange={(e) => handleInputChange('objective', e.target.value)}
                className="min-h-[80px] md:min-h-[100px] text-sm" 
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4 md:space-y-6">
            {/* Audit Plan Table */}
            <div className="space-y-4">
              <h3 className="text-base md:text-lg font-semibold">แผนการดำเนินการตรวจสอบและแผนการจัดสรรทรัพยากร</h3>
              
              {/* แผนการตรวจสอบภายในประจำปี Section */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm">แผนการตรวจสอบภายในประจำปี</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 text-xs">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 p-2 text-left">ลำดับ</th>
                        <th className="border border-gray-300 p-2 text-left">การปฏิบัติงานตรวจ</th>
                        <th className="border border-gray-300 p-2 text-left">หน่วยรับตรวจ</th>
                        <th className="border border-gray-300 p-2 text-left">ความยืดหยุ่น เดือน</th>
                        <th className="border border-gray-300 p-2 text-left">ช่วงเวลา ปีงบประมาณ</th>
                        <th className="border border-gray-300 p-2 text-left">ระยะเวลา วันทำการ</th>
                        <th className="border border-gray-300 p-2 text-left">จำนวน ผู้ตรวจ</th>
                        <th className="border border-gray-300 p-2 text-left">ค่าใช้จ่าย (บาท)</th>
                        <th className="border border-gray-300 p-2 text-left">วันที่เริ่มตรวจ</th>
                        <th className="border border-gray-300 p-2 text-left">ผู้รับผิดชอบ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 p-2">1</td>
                        <td className="border border-gray-300 p-2">การตรวจสอบการดูแลรักษาหนังสือฯและทรัพย์สินสำนักงาน</td>
                        <td className="border border-gray-300 p-2">ฝ่ายบริหารและกฎหมาย</td>
                        <td className="border border-gray-300 p-2">1 เดือน</td>
                        <td className="border border-gray-300 p-2">1 เดือน</td>
                        <td className="border border-gray-300 p-2">ตุลาคม-ธันวาคม 2567</td>
                        <td className="border border-gray-300 p-2">นส.5 ก.ค.-10</td>
                        <td className="border border-gray-300 p-2">3.00</td>
                        <td className="border border-gray-300 p-2">25,000</td>
                        <td className="border border-gray-300 p-2">ดร.นพบุริ ธนขำเจริญ</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-2">2</td>
                        <td className="border border-gray-300 p-2">การตรวจสอบการดำเนินงานการพิจารณาอนุมัติโครงการลงทุน</td>
                        <td className="border border-gray-300 p-2">กองการปรึก</td>
                        <td className="border border-gray-300 p-2">1 เดือน</td>
                        <td className="border border-gray-300 p-2">1 เดือน</td>
                        <td className="border border-gray-300 p-2">ตุลาคม-ธันวาคม 2567</td>
                        <td className="border border-gray-300 p-2">ธ.ค.5 ก.ค.-10</td>
                        <td className="border border-gray-300 p-2">3.00</td>
                        <td className="border border-gray-300 p-2">15,000</td>
                        <td className="border border-gray-300 p-2">พนง.ธารณี วงค์เฉลิม</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-2">3</td>
                        <td className="border border-gray-300 p-2">การตรวจสอบระบบคลัง</td>
                        <td className="border border-gray-300 p-2">ฝ่ายปฏิบัติการเงินและการคลัง;ฝ่ายบริหารงานการเงินการคลังงบลงทุน</td>
                        <td className="border border-gray-300 p-2">1 เดือน</td>
                        <td className="border border-gray-300 p-2">1 เดือน</td>
                        <td className="border border-gray-300 p-2">ม.ค.5 มี.ค.-68</td>
                        <td className="border border-gray-300 p-2">3.00</td>
                        <td className="border border-gray-300 p-2">6,000</td>
                        <td className="border border-gray-300 p-2">ผอ.ระบบ คุณครูที่ 1</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-2">4</td>
                        <td className="border border-gray-300 p-2">การตรวจสอบการปฏิบัติตามระเบียบการจัดซื้อจัดจ้างฯฯ</td>
                        <td className="border border-gray-300 p-2">ฝ่ายปฏิบัติการเงินและการคลัง; ฝ่ายบริหารงาน นสค.และผลิต.ฯ งบลงทุนฯดำเนินการ</td>
                        <td className="border border-gray-300 p-2">1 เดือน</td>
                        <td className="border border-gray-300 p-2">1 เดือน</td>
                        <td className="border border-gray-300 p-2">เม.ย.</td>
                        <td className="border border-gray-300 p-2">3.00</td>
                        <td className="border border-gray-300 p-2">3,000</td>
                        <td className="border border-gray-300 p-2">ราชการ ประเสริญ</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-2">5</td>
                        <td className="border border-gray-300 p-2">การตรวจสอบการดำเนินงานการจัดเก็บและค่า ที่ปรึกษาและกำกับและจัดการทรัพยากรบุคคล</td>
                        <td className="border border-gray-300 p-2">ฝ่ายปฏิบัติการเงิน</td>
                        <td className="border border-gray-300 p-2">1 เดือน</td>
                        <td className="border border-gray-300 p-2">1 เดือน</td>
                        <td className="border border-gray-300 p-2">พ.ค.68 ก.ค.-1 ส.ค.16 ก.ย.68</td>
                        <td className="border border-gray-300 p-2">5.00</td>
                        <td className="border border-gray-300 p-2">5,000</td>
                        <td className="border border-gray-300 p-2">ส่วนราชการ ส่วนกลาง</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-2">6</td>
                        <td className="border border-gray-300 p-2">รายงานการตรวจสอบการดำเนินงานสถานพยาบาล ในครอบครัวภายใน</td>
                        <td className="border border-gray-300 p-2">เนคเจอร์คลีนิกเซ็น</td>
                        <td className="border border-gray-300 p-2">1 เดือน</td>
                        <td className="border border-gray-300 p-2">5 เดือน</td>
                        <td className="border border-gray-300 p-2">ม.ย.5 ก.ค.-68</td>
                        <td className="border border-gray-300 p-2">1.00</td>
                        <td className="border border-gray-300 p-2">1,500</td>
                        <td className="border border-gray-300 p-2">ส ริน ฟ้อนรักโซ่ บำรุง</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Yellow Header Section */}
              <div className="bg-yellow-100 p-3 rounded border text-xs">
                <p>รายชื่อผู้ใช้ให้ในการปฏิบัติการตรวจสอบ = 733 วันทำการ โดยไม่นับวันหยุด ลาพัก 5 วัน ตั้งแต่ เฉลี่ยวันจั่วให้ถึงการตรวจสอบประมาณ 151 วันทำการ/คน/ปี</p>
              </div>

              {/* Second Table Section */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm">หมายเหตุ</h4>
                <p className="text-xs text-gray-600">
                  ง่ายแสดงการตรวจสอบการดำเนินงานเฉพาะที่เป็นปฏิบัติการตรวจสอบงานอาเขต ที่เป็นการเสนอแนะ การปรับปรุงการตรวจสอบ ยุทธการบริหารการตรวจสอบด้วยการปรึกษา ด้วยแป 1-3 การตรวจ
                  ชะนันอยากให้ถึงการปฏิบัติการตรวจสอบประมาณ = 753 วันทำการ โดยไม่นับวันหยุด ลาพัก 5 วัน ตั้งแต่ เฉลี่ยวันจั่วให้ถึงการตรวจสอบประมาณ 151 วันทำการ/คน/ปี
                </p>
              </div>

              {/* แผนการตรวจสอบภายใน แบบให้คำปรึกษาตรวจสอบ */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm">แผนการตรวจสอบภายใน แบบให้คำปรึกษาตรวจสอบ</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 text-xs">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 p-2 text-left">ลำดับ</th>
                        <th className="border border-gray-300 p-2 text-left">การปฏิบัติงานตรวจ</th>
                        <th className="border border-gray-300 p-2 text-left">หน่วยรับตรวจ</th>
                        <th className="border border-gray-300 p-2 text-left">ความยืดหยุ่น เดือน</th>
                        <th className="border border-gray-300 p-2 text-left">ช่วงเวลา ปีงบประมาณ</th>
                        <th className="border border-gray-300 p-2 text-left">ระยะเวลา วันทำการ</th>
                        <th className="border border-gray-300 p-2 text-left">จำนวน ผู้ตรวจ</th>
                        <th className="border border-gray-300 p-2 text-left">ค่าใช้จ่าย (บาท)</th>
                        <th className="border border-gray-300 p-2 text-left">วันที่เริ่มตรวจ</th>
                        <th className="border border-gray-300 p-2 text-left">ผู้รับผิดชอบ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 p-2">1</td>
                        <td className="border border-gray-300 p-2">การตรวจสอบการดูแลรักษาหนังสือฯและทรัพย์สินสำนักงาน</td>
                        <td className="border border-gray-300 p-2">ฝ่ายบริหารและกฎหมาย</td>
                        <td className="border border-gray-300 p-2">1 เดือน</td>
                        <td className="border border-gray-300 p-2">1 เดือน</td>
                        <td className="border border-gray-300 p-2">ม.ค.5 มี.ค.-68</td>
                        <td className="border border-gray-300 p-2">3.00</td>
                        <td className="border border-gray-300 p-2">80,000</td>
                        <td className="border border-gray-300 p-2">ดร.นพบุริ ธนขำเจริญ</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Additional Tables */}
              <div className="space-y-6">
                {/* แผนการตรวจสอบภายใน แบบมีค่าคลื่นไฟดำเนินการ */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">แผนการตรวจสอบภายใน แบบมีค่าคลื่นไฟดำเนินการ</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 text-xs">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 p-2 text-left">ลำดับ</th>
                          <th className="border border-gray-300 p-2 text-left">การปฏิบัติงานตรวจ</th>
                          <th className="border border-gray-300 p-2 text-left">หน่วยรับตรวจ</th>
                          <th className="border border-gray-300 p-2 text-left">ความยืดหยุ่น เดือน</th>
                          <th className="border border-gray-300 p-2 text-left">ช่วงเวลา ปีงบประมาณ</th>
                          <th className="border border-gray-300 p-2 text-left">ระยะเวลา วันทำการ</th>
                          <th className="border border-gray-300 p-2 text-left">จำนวน ผู้ตรวจ</th>
                          <th className="border border-gray-300 p-2 text-left">ค่าใช้จ่าย (บาท)</th>
                          <th className="border border-gray-300 p-2 text-left">วันที่เริ่มตรวจ</th>
                          <th className="border border-gray-300 p-2 text-left">ผู้รับผิดชอบ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { id: 1, task: "การตรวจสอบการดูแลรักษาหนังสือฯและทรัพย์สินสำนักงาน", unit: "ฝ่ายบริหารและกฎหมาย", period: "ม.ค.5 มี.ค.-68", budget: "TBD" },
                          { id: 2, task: "การตรวจสอบการดำเนินงานการพิจารณาอนุมัติโครงการลงทุน", unit: "กองการปรึก", period: "ธ.ค.5 ก.ค.-68", budget: "TBD" },
                          { id: 3, task: "การตรวจสอบระบบคลัง", unit: "ฝ่ายปฏิบัติการเงินและการคลัง", period: "ม.ค.5 มี.ค.-68", budget: "TBD" },
                          { id: 4, task: "การตรวจสอบการปฏิบัติตามระเบียบการจัดซื้อจัดจ้างฯฯ", unit: "ฝ่ายปฏิบัติการเงินและการคลัง", period: "เม.ย", budget: "TBD" },
                          { id: 5, task: "การตรวจสอบการดำเนินงานการจัดเก็บ", unit: "ฝ่ายปฏิบัติการเงิน", period: "พ.ค.68 ก.ค.-1 ส.ค.16 ก.ย.68", budget: "TBD" },
                          { id: 6, task: "รายงานการตรวจสอบการดำเนินงานสถานพยาบาล", unit: "เนคเจอร์คลีนิกเซ็น", period: "ม.ย.5 ก.ค.-68", budget: "TBD" },
                          { id: 7, task: "ให้คำปรึกษาครอบครัวด้านใน", unit: "เนคเจอร์คลีนิกเซ็น", period: "ก.ค.5 ก.ย.-68", budget: "TBD" },
                          { id: 8, task: "รับโอนตอบสนองการประจำปี", unit: "เนคเจอร์คลีนิกเซ็น", period: "ม.ค.5 เม.ย.-68", budget: "TBD" },
                          { id: 9, task: "อีกเฮอร์โนโรอินออนไลน์", unit: "เนคเจอร์คลีนิกเซ็น", period: "ม.ค.5 เม.ย.-68", budget: "TBD" },
                          { id: 10, task: "สื่อการเรียนการสอนเซียงค์", unit: "เนคเจอร์คลีนิกเซ็น", period: "ม.ค.5 เม.ย.-68", budget: "TBD" }
                        ].map((item) => (
                          <tr key={item.id}>
                            <td className="border border-gray-300 p-2">{item.id}</td>
                            <td className="border border-gray-300 p-2">{item.task}</td>
                            <td className="border border-gray-300 p-2">{item.unit}</td>
                            <td className="border border-gray-300 p-2">1 เดือน</td>
                            <td className="border border-gray-300 p-2">1 เดือน</td>
                            <td className="border border-gray-300 p-2">{item.period}</td>
                            <td className="border border-gray-300 p-2">3.00</td>
                            <td className="border border-gray-300 p-2">{item.budget}</td>
                            <td className="border border-gray-300 p-2">-</td>
                            <td className="border border-gray-300 p-2">TBD</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Yellow Summary */}
                <div className="bg-yellow-100 p-3 rounded border text-xs">
                  <p>รายชื่อผู้ใช้ให้ในการปฏิบัติการตรวจสอบ = 332 วันทำการ โดยไม่นับวันหยุด ลาพัก 5 วัน ตั้งแต่ เฉลี่ยวันจั่วให้ถึงการตรวจสอบประมาณ 151 วันทำการ/คน/ปี</p>
                </div>

                {/* Final Summary Section */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">หมายเหตุ</h4>
                    <p className="text-xs text-gray-600">
                      ข้อมูลการตรวจสอบการดำเนินงานเฉพาะที่เป็นปฏิบัติการตรวจสอบงานอาเขต ที่เป็นการเสนอแนะ การปรับปรุงการตรวจสอบ ยุทธการบริหารการตรวจสอบด้วยการปรึกษา ด้วยแป 1-3 การตรวจ
                      ชะนันอยากให้ถึงการปฏิบัติการตรวจสอบประมาณ = 1,085 วันทำการ โดยไม่นับวันหยุด ลาพัก 5 วัน ตั้งแต่ เฉลี่ยวันจั่วให้ถึงการตรวจสอบประมาณ 217 วันทำการ/คน/ปี
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">แผนงานตรวจสอบภายใน</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300 text-xs">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border border-gray-300 p-2 text-left">ลำดับ</th>
                            <th className="border border-gray-300 p-2 text-left">การปฏิบัติงานตรวจ</th>
                            <th className="border border-gray-300 p-2 text-left">หน่วยรับตรวจ</th>
                            <th className="border border-gray-300 p-2 text-left">ความยืดหยุ่น เดือน</th>
                            <th className="border border-gray-300 p-2 text-left">ช่วงเวลา ปีงบประมาณ</th>
                            <th className="border border-gray-300 p-2 text-left">ระยะเวลา วันทำการ</th>
                            <th className="border border-gray-300 p-2 text-left">จำนวน ผู้ตรวจ</th>
                            <th className="border border-gray-300 p-2 text-left">ค่าใช้จ่าย (บาท)</th>
                            <th className="border border-gray-300 p-2 text-left">วันที่เริ่มตรวจ</th>
                            <th className="border border-gray-300 p-2 text-left">ผู้รับผิดชอบ</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-gray-300 p-2">1</td>
                            <td className="border border-gray-300 p-2">สนไส่อนากมารเดียวที่การตรวจ</td>
                            <td className="border border-gray-300 p-2">-</td>
                            <td className="border border-gray-300 p-2">-</td>
                            <td className="border border-gray-300 p-2">-</td>
                            <td className="border border-gray-300 p-2">ม.ค.5 มี.ค.-68</td>
                            <td className="border border-gray-300 p-2">3.00</td>
                            <td className="border border-gray-300 p-2">300,000</td>
                            <td className="border border-gray-300 p-2">ดร.นพบุริ ธนขำเจริญ</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 p-2">2</td>
                            <td className="border border-gray-300 p-2">สนไส่อนากมารเดียวที่การประชาคม</td>
                            <td className="border border-gray-300 p-2">-</td>
                            <td className="border border-gray-300 p-2">-</td>
                            <td className="border border-gray-300 p-2">-</td>
                            <td className="border border-gray-300 p-2">ธ.ค.5 ก.ค.-68</td>
                            <td className="border border-gray-300 p-2">3.00</td>
                            <td className="border border-gray-300 p-2">-</td>
                            <td className="border border-gray-300 p-2">80,000</td>
                            <td className="border border-gray-300 p-2">พนง.ธารณี วงค์เฉลิม</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Additional sections following the same pattern */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">แผนการตรวจสอบภายใน แบบทุ่นรันบำรุงดำเนินการตรวจสอบ</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300 text-xs">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border border-gray-300 p-2 text-left">ลำดับ</th>
                            <th className="border border-gray-300 p-2 text-left">การปฏิบัติงานตรวจ</th>
                            <th className="border border-gray-300 p-2 text-left">หน่วยรับตรวจ</th>
                            <th className="border border-gray-300 p-2 text-left">ความยืดหยุ่น เดือน</th>
                            <th className="border border-gray-300 p-2 text-left">ช่วงเวลา ปีงบประมาณ</th>
                            <th className="border border-gray-300 p-2 text-left">ระยะเวลา วันทำการ</th>
                            <th className="border border-gray-300 p-2 text-left">จำนวน ผู้ตรวจ</th>
                            <th className="border border-gray-300 p-2 text-left">ค่าใช้จ่าย (บาท)</th>
                            <th className="border border-gray-300 p-2 text-left">วันที่เริ่มตรวจ</th>
                            <th className="border border-gray-300 p-2 text-left">ผู้รับผิดชอบ</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { id: 1, task: "สนไส่เร็วจนชัด", budget: "270,300", responsible: "TBD" },
                            { id: 2, task: "สนไส่ทุบทำ", budget: "TBD", responsible: "TBD" },
                            { id: 3, task: "สนไส่ธนณีด", budget: "30,000", responsible: "TBD" },
                            { id: 4, task: "ศตวารครีนิคใหม่นิจ", budget: "15,000", responsible: "TBD" },
                            { id: 5, task: "สนไส่ทุกเส่ด", budget: "TBD", responsible: "TBD" },
                            { id: 6, task: "สนไส่อนากมารเดียวที่การวิเตอร์เศรษ", budget: "60,000", responsible: "TBD" }
                          ].map((item) => (
                            <tr key={item.id}>
                              <td className="border border-gray-300 p-2">{item.id}</td>
                              <td className="border border-gray-300 p-2">{item.task}</td>
                              <td className="border border-gray-300 p-2">-</td>
                              <td className="border border-gray-300 p-2">-</td>
                              <td className="border border-gray-300 p-2">-</td>
                              <td className="border border-gray-300 p-2">ม.ค.5 มี.ค.-68</td>
                              <td className="border border-gray-300 p-2">3.00</td>
                              <td className="border border-gray-300 p-2">{item.budget}</td>
                              <td className="border border-gray-300 p-2">-</td>
                              <td className="border border-gray-300 p-2">{item.responsible}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Final Yellow Summary */}
                  <div className="bg-yellow-100 p-3 rounded border text-xs">
                    <p>รายชื่อผู้ใช้ให้ในการปฏิบัติการตรวจสอบ = 1,085 วันทำการ โดยไม่นับวันหยุด ลาพัก 5 วัน ตั้งแต่ เฉลี่ยวันจั่วให้ถึงการตรวจสอบประมาณ 217 วันทำการ/คน/ปี</p>
                  </div>

                  {/* Grand Total */}
                  <div className="text-right font-semibold text-sm">
                    <p>รวมงบประมาณทั้งหมด: 700,300</p>
                  </div>

                  {/* Final Note */}
                  <div className="bg-gray-50 p-3 rounded text-xs">
                    <p>หมายเหตุ:</p>
                    <p>ข้อมูลการตรวจสอบการดำเนินงานเฉพาะที่เป็นปฏิบัติการตรวจสอบงานอาเขต ที่เป็นการเสนอแนะ การปรับปรุงการตรวจสอบ ยุทธการบริหารการตรวจสอบด้วยการปรึกษา ด้วยแป ระบบ และบุคลากรและฉี่ว แผนกอื่นบุงการผลุกดำ ยุทธฯ แผ่นขยายตัวต้องการนี่ เพื่อมีสิษพรุส กแล.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 md:gap-6 p-4 md:p-6 pt-0">
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
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-xl md:text-2xl font-bold leading-tight">แผนการจัดทำรายงานแผนการจัดสรรทรัพยากร</h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            ประจำปีงบประมาณ พ.ศ. 2568 (1 ตุลาคม 2567 - 30 กันยายน 2568)
          </p>
          <p className="text-xs md:text-sm text-muted-foreground">
            กลุ่มงานตรวจสอบภายใน สำนักงานเลขาธิการวุฒิสภา
          </p>
          <p className="text-xs md:text-sm text-blue-600 cursor-pointer hover:underline mt-1">
            ดูตัวอย่าง: ผู้ตรวจสอบภายในได้นำเป็นวิธีการจัดทำในแผนการตรวจสอบ
          </p>
        </div>
        <Dialog open={isSignatureDialogOpen} onOpenChange={setIsSignatureDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#3E52B9] hover:bg-[#2A3B87] text-sm md:text-base w-full lg:w-auto">
              เสนอหัวหน้ากลุ่มตรวจสอบภายใน
            </Button>
          </DialogTrigger>
          
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-4 md:p-6">
          <h2 className="text-base md:text-lg font-semibold mb-4">แผนการจัดทำรายงานแผนการจัดสรรทรัพยากร</h2>
          
          {/* Progress Steps */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 lg:gap-8 mb-6 md:mb-8">
            <div 
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => goToStep(1)}
            >
              <div className={`w-6 h-6 md:w-8 md:h-8 ${currentStep === 1 ? 'bg-[#3E52B9] text-white' : 'bg-gray-300 text-gray-600'} rounded-full flex items-center justify-center text-xs md:text-sm font-medium`}>1</div>
              <span className={`text-xs md:text-sm ${currentStep === 1 ? 'text-black' : 'text-gray-500'}`}>ข้อมูลการเป็นผู้ดำเนินการตรวจสอบ</span>
            </div>
            <div 
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => goToStep(2)}
            >
              <div className={`w-6 h-6 md:w-8 md:h-8 ${currentStep === 2 ? 'bg-[#3E52B9] text-white' : 'bg-gray-300 text-gray-600'} rounded-full flex items-center justify-center text-xs md:text-sm font-medium`}>2</div>
              <span className={`text-xs md:text-sm ${currentStep === 2 ? 'text-black' : 'text-gray-500'}`}>ข้อมูลการผู้ปฏิบัติการสิ้น</span>
            </div>
            <div 
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => goToStep(3)}
            >
              <div className={`w-6 h-6 md:w-8 md:h-8 ${currentStep === 3 ? 'bg-[#3E52B9] text-white' : 'bg-gray-300 text-gray-600'} rounded-full flex items-center justify-center text-xs md:text-sm font-medium`}>3</div>
              <span className={`text-xs md:text-sm ${currentStep === 3 ? 'text-black' : 'text-gray-500'} hidden sm:block`}>ประมาณการงาน ได้ที่บุคลากรได้ในการปฏิบัติการและสนองต่างๆของหน่วยงาน</span>
              <span className={`text-xs md:text-sm ${currentStep === 3 ? 'text-black' : 'text-gray-500'} sm:hidden`}>ประมาณการงาน</span>
            </div>
            <div 
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => goToStep(4)}
            >
              <div className={`w-6 h-6 md:w-8 md:h-8 ${currentStep === 4 ? 'bg-[#3E52B9] text-white' : 'bg-gray-300 text-gray-600'} rounded-full flex items-center justify-center text-xs md:text-sm font-medium`}>4</div>
              <span className={`text-xs md:text-sm ${currentStep === 4 ? 'text-black' : 'text-gray-500'}`}>แผนที่</span>
            </div>
          </div>

          <h3 className="text-sm md:text-base font-medium mb-4">แผนการจัดทำรายงานแผนการจัดสรรทรัพยากร</h3>

          {/* Tabs */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-6">
            <Button variant="default" className="bg-[#3E52B9] text-white text-sm md:text-base">
              การบริการให้ความเชื่อมั่น
            </Button>
            <Button variant="outline" className="text-sm md:text-base">
              การบริการให้คำปรึกษา
            </Button>
          </div>

          <div className="text-right mb-4">
            {(currentStep === 2 || currentStep === 3) && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full sm:w-auto text-sm">
                    จัดการเรื่องที่ตรวจสอบ
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-hidden">
                  <DialogHeader>
                    <DialogTitle className="text-base md:text-lg font-semibold">
                      เลือกเรื่องที่ตรวจสอบ
                    </DialogTitle>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      ข้อมูลการปฏิบัติงานตรวจสอบ
                    </p>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    {/* Search Box */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="ค้นหาเรื่องที่ตรวจสอบ"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 text-sm"
                      />
                    </div>

                    {/* Topics List for Step 2 */}
                    <div className="max-h-80 overflow-y-auto space-y-2 border rounded-lg p-3">
                      {step2Topics.filter((topic: { id: string; title: string }) =>
                        topic.title.toLowerCase().includes(searchTerm.toLowerCase())
                      ).map((topic: { id: string; title: string }) => (
                        <div key={topic.id} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg">
                          <Checkbox
                            id={`step2-topic-${topic.id}`}
                            checked={selectedItems.includes(topic.id)}
                            onCheckedChange={(checked) => 
                              handleTopicSelect(topic.id, checked as boolean)
                            }
                          />
                          <div className="flex-1">
                            <label 
                              htmlFor={`step2-topic-${topic.id}`}
                              className="font-medium text-xs md:text-sm cursor-pointer leading-tight"
                            >
                              {topic.title}
                            </label>
                            <p className="text-xs text-muted-foreground mt-1">
                              หน่วยรับตรวจ: -
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                      className="w-full sm:w-auto text-sm"
                    >
                      ยกเลิก
                    </Button>
                    <Button 
                      onClick={handleDialogSubmit}
                      className="bg-[#3E52B9] hover:bg-[#2A3B87] w-full sm:w-auto text-sm"
                    >
                      เพิ่มรายการของการตรวจสอบ
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Step Content */}
          {renderStepContent()}

          {/* Fixed Schedule and Budget Table - Shows in all steps */}
          <div className="space-y-6 mt-8">
            {/* Schedule Section */}
            <div className="space-y-4">
              <h3 className="text-base md:text-lg font-semibold">แผนการดำเนินการตรวจสอบ</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Year 2567 */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">ปี 2567</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox defaultChecked />
                      ตุลาคม
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox defaultChecked />
                      พฤศจิกายน
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox defaultChecked />
                      ธันวาคม
                    </label>
                  </div>
                </div>

                {/* Year 2568 */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">ปี 2568</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox defaultChecked />
                      มกราคม
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox defaultChecked />
                      กุมภาพันธ์
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox defaultChecked />
                      มีนาคม
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox defaultChecked />
                      เมษายน
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox defaultChecked />
                      พฤษภาคม
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox defaultChecked />
                      มิถุนายน
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox defaultChecked />
                      กรกฎาคม
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox defaultChecked />
                      สิงหาคม
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox defaultChecked />
                      กันยายน
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Budget Section */}
            <div className="space-y-4">
              <h3 className="text-base md:text-lg font-semibold">แผนการดำเนินการตรวจสอบ</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">วันที่เริ่ม</label>
                  <Input type="text" className="text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">วันที่สิ้นสุด</label>
                  <Input type="text" className="text-sm" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">งบประมาณ (บาท)</label>
                <Input 
                  type="number" 
                  defaultValue="100000"
                  className="text-sm" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">ผู้รับผิดชอบ</label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                  <option>FBRL</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">หมายเหตุ</label>
                <Textarea className="min-h-[100px] text-sm" />
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-6 border-t mt-8">
            <Button 
              variant="outline" 
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              ก่อนหน้า
            </Button>

            <div className="flex gap-2">
              <Button 
                variant="outline"
                className="text-sm md:text-base"
              >
                บันทึกร่าง
              </Button>
              
              {currentStep < 4 ? (
                <Button 
                  onClick={nextStep}
                  className="bg-[#3E52B9] hover:bg-[#2A3B87] flex items-center gap-2"
                >
                  ถัดไป
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </Button>
              ) : (
                <div className="flex gap-2">
                  {/* Approval Dialog with Steps */}
                  <Dialog open={isSignatureDialogOpen} onOpenChange={setIsSignatureDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline"
                        className="text-sm md:text-base flex items-center gap-2"
                      >
                        <PenTool className="h-4 w-4" />
                        เสนอคำขออนุมัติ
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-base text-center">
                          เสนอคำขออนุมัติ
                        </DialogTitle>
                      </DialogHeader>
                      
                      {/* Step Indicator */}
                      <div className="flex justify-center items-center space-x-4 py-4">
                        {[1, 2, 3].map((step) => (
                          <div key={step} className="flex items-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                approvalStep >= step
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-200 text-gray-600'
                              }`}
                            >
                              {step}
                            </div>
                            {step < 3 && (
                              <div
                                className={`w-8 h-0.5 ${
                                  approvalStep > step ? 'bg-blue-600' : 'bg-gray-200'
                                }`}
                              />
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Step Content */}
                      <div className="min-h-[200px]">
                        {renderApprovalStep()}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-4">
                        {approvalStep > 1 && (
                          <Button 
                            variant="outline" 
                            onClick={handlePrevApprovalStep}
                            className="flex-1"
                          >
                            ย้อนกลับ
                          </Button>
                        )}
                        
                        {approvalStep < 3 ? (
                          <Button 
                            className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                            onClick={handleNextApprovalStep}
                            disabled={
                              (approvalStep === 2 && !signatureChoice) ||
                              (approvalStep === 2 && signatureChoice === 'new' && !signatureData.signature)
                            }
                          >
                            ถัดไป
                          </Button>
                        ) : (
                          <Button 
                            className="bg-green-600 hover:bg-green-700 text-white flex-1"
                            onClick={handleApprovalComplete}
                            disabled={!isOtpValid}
                          >
                            อนุมัติ
                          </Button>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button className="bg-[#3E52B9] hover:bg-[#2A3B87]">
                    บันทึกข้อมูล
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}