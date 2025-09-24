// Mock data for available activities to select from categorized by risk aspects
export const availableActivities = [
  // ด้านกลยุทธ์ (Strategic)
  {
    id: 1,
    activity: "การวางแผนกลยุทธ์และการกำหนดทิศทางขององค์กรไม่สอดคล้องกับสภาพแวดล้อมทางธุรกิจ",
    riskDescription: "ด้านกลยุทธ์ (S)",
    riskLevel: "สูงมาก",
    selected: false,
  },
  {
    id: 2,
    activity: "การบริหารความเสี่ยงในการลงทุนและการขยายธุรกิจไม่มีประสิทธิภาพ",
    riskDescription: "ด้านกลยุทธ์ (S)",
    riskLevel: "สูง",
    selected: false,
  },
  
  // ด้านการเงิน (Financial)
  {
    id: 3,
    activity: "การจัดทำรายงานทางการเงินไม่ถูกต้องหรือไม่ทันเวลา",
    riskDescription: "ด้านการเงิน (F)",
    riskLevel: "สูงมาก",
    selected: false,
  },
  {
    id: 4,
    activity: "ระบบการควบคุมภายในด้านการเงินและบัญชีไม่เพียงพอ",
    riskDescription: "ด้านการเงิน (F)",
    riskLevel: "สูง",
    selected: false,
  },
  {
    id: 5,
    activity: "การบริหารสภาพคล่องและกระแสเงินสดไม่มีประสิทธิภาพ",
    riskDescription: "ด้านการเงิน (F)",
    riskLevel: "ปานกลาง",
    selected: false,
  },

  // ด้านการดำเนินงาน (Operational)
  {
    id: 6,
    activity: "กระบวนการปฏิบัติงานไม่มีประสิทธิภาพและขาดการควบคุมที่เหมาะสม",
    riskDescription: "ด้านการดำเนินงาน (O)",
    riskLevel: "สูง",
    selected: false,
  },
  {
    id: 7,
    activity: "การบริหารทรัพยากรบุคคลและการพัฒนาศักยภาพบุคลากร",
    riskDescription: "ด้านการดำเนินงาน (O)",
    riskLevel: "ปานกลาง",
    selected: false,
  },
  {
    id: 8,
    activity: "ระบบการจัดเก็บและการบำรุงรักษาข้อมูลสำคัญขององค์กร",
    riskDescription: "ด้านการดำเนินงาน (O)",
    riskLevel: "น้อย",
    selected: false,
  },

  // ด้านการปฏิบัติตามกฎหมายระเบียบ (Compliance)
  {
    id: 9,
    activity: "การไม่ปฏิบัติตามกฎหมายและข้อบังคับที่เกี่ยวข้อง",
    riskDescription: "ด้านการปฏิบัติตามกฎหมายระเบียบ (C)",
    riskLevel: "สูงมาก",
    selected: false,
  },
  {
    id: 10,
    activity: "การตรวจสอบการปฏิบัติตามนโยบายและระเบียบภายในองค์กร",
    riskDescription: "ด้านการปฏิบัติตามกฎหมายระเบียบ (C)",
    riskLevel: "ปานกลาง",
    selected: false,
  },
  {
    id: 11,
    activity: "การควบคุมการปฏิบัติตามมาตรฐานการรายงานและการเปิดเผยข้อมูล",
    riskDescription: "ด้านการปฏิบัติตามกฎหมายระเบียบ (C)",
    riskLevel: "น้อย",
    selected: false,
  },

  // ด้านเทคโนโลยีสารสนเทศ (Information Technology)
  {
    id: 12,
    activity: "ความปลอดภัยของระบบสารสนเทศและการป้องกันการโจมตีทางไซเบอร์",
    riskDescription: "ด้านเทคโนโลยีสารสนเทศ (IT)",
    riskLevel: "สูงมาก",
    selected: false,
  },
  {
    id: 13,
    activity: "การสำรองข้อมูลและการกู้คืนระบบในกรณีเกิดเหตุการณ์ฉุกเฉิน",
    riskDescription: "ด้านเทคโนโลยีสารสนเทศ (IT)",
    riskLevel: "สูง",
    selected: false,
  },
  {
    id: 14,
    activity: "การควบคุมการเข้าถึงระบบข้อมูลและการจัดการสิทธิผู้ใช้งาน",
    riskDescription: "ด้านเทคโนโลยีสารสนเทศ (IT)",
    riskLevel: "น้อยมาก",
    selected: false,
  },

  // ด้านการเกิดทุจริต (Fraud)
  {
    id: 15,
    activity: "การทุจริตในการจัดซื้อจัดจ้างและการใช้จ่ายงบประมาณ",
    riskDescription: "ด้านการเกิดทุจริต (FR)",
    riskLevel: "สูงมาก",
    selected: false,
  },
  {
    id: 16,
    activity: "การปกปิดข้อมูลหรือการบิดเบือนรายงานเพื่อผลประโยชน์ส่วนตัว",
    riskDescription: "ด้านการเกิดทุจริต (FR)",
    riskLevel: "สูง",
    selected: false,
  },
  {
    id: 17,
    activity: "การตรวจสอบการมีผลประโยชน์ทับซ้อนในการปฏิบัติงาน",
    riskDescription: "ด้านการเกิดทุจริต (FR)",
    riskLevel: "ปานกลาง",
    selected: false,
  },
  {
    id: 18,
    activity: "ระบบการรายงานการทุจริตและการคุ้มครองผู้แจ้งเบาะแส",
    riskDescription: "ด้านการเกิดทุจริต (FR)",
    riskLevel: "น้อยมาก",
    selected: false,
  }
];

// Risk levels configuration
export const riskLevels = [
  { value: "น้อยมาก", color: "bg-green-50 text-green-700" },
  { value: "น้อย", color: "bg-green-100 text-green-700" },
  { value: "ปานกลาง", color: "bg-yellow-100 text-yellow-700" },
  { value: "สูง", color: "bg-orange-100 text-orange-700" },
  { value: "สูงมาก", color: "bg-red-100 text-red-700" },
];

// Mock data for people list
export const peopleList = [
  { id: "1", name: "กคม.", status: "ผู้ตรวจสอบภายใน" },
  {
    id: "2",
    name: "นางสาวจิรรวรรม สมัคร",
    status: "หัวหน้ากลุ่มตรวจสอบภายใน",
  },
  { id: "3", name: "นางสาวจิตติมา สุขสอบ", status: "ผู้ตรวจสอบภายใน" },
  { id: "4", name: "ภูวดล", status: "ผู้ตรวจสอบภายใน" },
  { id: "5", name: "รัฐพล", status: "ผู้ตรวจสอบภายใน" },
];

// Risk categories
export const riskCategories = [
  { code: "S", name: "ด้านกลยุทธ์", color: "bg-purple-100 text-purple-700" },
  { code: "F", name: "ด้านการเงิน", color: "bg-blue-100 text-blue-700" },
  { code: "O", name: "ด้านการดำเนินงาน", color: "bg-green-100 text-green-700" },
  { code: "C", name: "ด้านการปฏิบัติตามกฎหมายระเบียบ", color: "bg-orange-100 text-orange-700" },
  { code: "IT", name: "ด้านเทคโนโลยีสารสนเทศ", color: "bg-cyan-100 text-cyan-700" },
  { code: "FR", name: "ด้านการเกิดทุจริต", color: "bg-red-100 text-red-700" },
];

// Activity interface
export interface Activity {
  id: number;
  activity: string;
  riskDescription: string;
  riskLevel: string;
  selected: boolean;
}

// Person interface
export interface Person {
  id: string;
  name: string;
  status: string;
}