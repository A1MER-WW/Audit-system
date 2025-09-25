# Engagement Plan Local Storage System

ระบบจัดการข้อมูล Local Storage สำหรับแผนงานตรวจสอบ (Engagement Plan) ใน Audit System

## 🚀 คุณสมบัติ

### ✨ การจัดการข้อมูล
- **เก็บข้อมูลในเครื่อง**: ข้อมูลทั้งหमดถูกเก็บใn localStorage ของเบราว์เซอร์
- **การซิงค์อัตโนมัติ**: ข้อมูลอัปเดตแบบ real-time ทั่วทั้งแอป
- **การจัดการ ID อัตโนมัติ**: ระบบสร้าง ID ใหม่อัตโนมัติสำหรับรายการใหม่
- **การกรองตามปีงบประมาณ**: แสดงข้อมูลตามปีงบประมาณที่เลือก

### 🔧 เครื่องมือจัดการ
- **สำรองข้อมูล**: ดาวน์โหลดข้อมูลเป็นไฟล์ JSON
- **กู้คืนข้อมูล**: อัปโหลดไฟล์สำรองเพื่อกู้คืนข้อมูล
- **รีเซ็ตข้อมูล**: คืนค่าเป็นข้อมูลเริ่มต้น
- **ลบข้อมูลทั้งหมด**: ล้างข้อมูลทั้งหมดอย่างถาวร

### 📊 การตรวจสอบสถานะ
- **การใช้งาน Storage**: แสดงข้อมูลการใช้งาน localStorage
- **สถานะการเชื่อมต่อ**: ตรวจสอบว่า localStorage พร้อมใช้งานหรือไม่
- **สถิติการใช้งาน**: แสดงจำนวนรายการและขนาดข้อมูล

## 📁 โครงสร้างไฟล์

```
lib/
├── engagement-plan-storage.ts          # หลัก localStorage utility
└── mock-engagement-plan-programs.ts    # Type definitions

hooks/
├── useEngagementPlanPrograms.ts        # Hook สำหรับจัดการ programs
└── useEngagementPlanStorage.ts         # Hook สำหรับจัดการ storage

contexts/
└── EngagementPlanContext.tsx           # Context provider สำหรับ state management

components/features/engagement-plan/
├── EngagementPlanStorageSettings.tsx   # หน้าตั้งค่า storage
└── EngagementPlanStorageStatus.tsx     # แสดงสถานะ storage

app/(dashboard)/(engagement-plan)/
├── settings/page.tsx                   # หน้าตั้งค่า
└── audit-engagement-plan/page.tsx      # หน้าหลัก
```

## 🔨 การใช้งาน

### 1. การใช้งาน Hook

```tsx
import { useEngagementPlan } from "@/contexts/EngagementPlanContext";

function MyComponent() {
  const {
    programs,                           // รายการ programs ทั้งหมด
    isLoading,                         // สถานะการโหลด
    error,                             // ข้อผิดพลาด
    addProgram,                        // เพิ่ม program ใหม่
    updateProgram,                     // อัปเดต program
    deleteProgram,                     // ลบ program
    getProgramsByFiscalYear,           // กรองตามปีงบประมาณ
    refreshPrograms,                   // รีเฟรชข้อมูล
    isStorageAvailable,                // สถานะ localStorage
    storageStats,                      // สถิติการใช้งาน
  } = useEngagementPlan();

  // ใช้งานตามต้องการ...
}
```

### 2. การใช้งาน Storage Utility โดยตรง

```tsx
import { engagementPlanStorage } from "@/lib/engagement-plan-storage";

// เพิ่มข้อมูลใหม่
const newProgram = engagementPlanStorage.addProgram({
  auditTopics: { /* ... */ },
  fiscalYear: 2568,
  status: "PENDING",
  // ...
});

// อัปเดตข้อมูล
const updated = engagementPlanStorage.updateProgram(1, {
  status: "APPROVED"
});

// ลบข้อมูล
engagementPlanStorage.removeProgram(1);

// กรองตามปีงบประมาณ
const programs2568 = engagementPlanStorage.getProgramsByFiscalYear(2568);
```

### 3. การจัดการ Storage

```tsx
import { useEngagementPlanStorage } from "@/hooks/useEngagementPlanStorage";

function StorageManager() {
  const {
    storageStats,
    downloadBackup,
    restoreFromFile,
    clearAllData,
    resetToDefaults,
  } = useEngagementPlanStorage();

  const handleBackup = async () => {
    downloadBackup(); // ดาวน์โหลดไฟล์สำรอง
  };

  const handleRestore = async (file: File) => {
    await restoreFromFile(file); // กู้คืนจากไฟล์
  };

  // ...
}
```

## 🔐 ความปลอดภัยข้อมูล

### การเข้ารหัส
- ข้อมูลถูกเก็บในรูปแบบ JSON ธรรมดาใน localStorage
- ไม่มีข้อมูลส่วนตัวหรือข้อมูลลับถูกเก็บไว้

### ข้อจำกัด
- ข้อมูลจะหายไปหากผู้ใช้ล้างข้อมูลเบราว์เซอร์
- ข้อมูลไม่สามารถเข้าถึงได้จากเครื่องอื่น
- ขนาดจำกัดประมาณ 5-10MB ตาม browser

### คำแนะนำ
- สำรองข้อมูลเป็นประจำ
- ใช้ไฟล์สำรองสำหรับการย้ายข้อมูลระหว่างเครื่อง

## 🧪 การทดสอบ

### ทดสอบการทำงานของ Storage

```tsx
// ทดสอบการเพิ่มข้อมูล
const program = await addProgram({ /* ... */ });
console.log("Added:", program);

// ทดสอบการอัปเดต
const updated = await updateProgram(program.id, { status: "APPROVED" });
console.log("Updated:", updated);

// ทดสอบการลบ
const deleted = await deleteProgram(program.id);
console.log("Deleted:", deleted);
```

### ทดสอบการสำรองและกู้คืน

```tsx
// สำรองข้อมูล
const backup = await exportData();
console.log("Backup created:", backup);

// กู้คืนข้อมูล
await importData(backup);
console.log("Data restored");
```

## 🐛 Troubleshooting

### localStorage ไม่พร้อมใช้งาน
```tsx
if (!isStorageAvailable) {
  console.error("localStorage is not available");
  // แสดงข้อความแจ้งเตือนให้ผู้ใช้
}
```

### ข้อมูลหาย
1. ตรวจสอบว่าไม่ได้ล้างข้อมูลเบราว์เซอร์
2. ใช้ไฟล์สำรองเพื่อกู้คืนข้อมูล
3. รีเซ็ตเป็นข้อมูลเริ่มต้น

### Storage เต็ม
1. ลบข้อมูลที่ไม่จำเป็น
2. สำรองข้อมูลและล้าง storage
3. ตรวจสอบข้อมูลซ้ำซ้อน

## 📈 การพัฒนาต่อ

### คุณสมบัติที่วางแผนไว้
- [ ] การเข้ารหัสข้อมuล
- [ ] การซิงค์กับ cloud storage
- [ ] การจัดการ version ของข้อมูล
- [ ] การ compress ข้อมูลเพื่อประหยัดพื้นที่

### การปรับปรุง
- [ ] เพิ่ม unit tests
- [ ] เพิ่ม error boundaries
- [ ] ปรับปรุง performance
- [ ] เพิ่ม accessibility features

## 📞 การสนับสนุน

หากพบปัญหาหรือต้องการความช่วยเหลือ:
1. ตรวจสอบ console logs
2. ทดสอบใน browser อื่น
3. ลองรีเซ็ตข้อมูลเป็นค่าเริ่มต้น
4. ติดต่อทีมพัฒนา