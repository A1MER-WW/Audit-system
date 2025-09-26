# การปรับปรุงระบบ Persistence สำหรับ Audit Engagement Plan

## สรุปการปรับปรุง

ระบบได้รับการปรับปรุงให้ข้อมูลที่ผู้ใช้กรอกไม่หายไปเมื่อ refresh หน้าเว็บ โดยใช้ localStorage เป็นที่เก็บข้อมูลถาวร

## คุณสมบัติใหม่

### 1. Auto-Save (บันทึกอัตโนมัติ)
- ระบบจะบันทึกข้อมูลอัตโนมัติหลังจากผู้ใช้หยุดพิมพ์ 1 วินาที
- ไม่ต้องกดปุ่มบันทึกทุกครั้ง
- ข้อมูลจะถูกเก็บใน localStorage ตาม ID ของแผนงาน

### 2. Persistence หลัง Refresh
- ข้อมูลทั้งหมดจะคงอยู่หลัง refresh หน้าเว็บ
- โหลดข้อมูลจาก localStorage เมื่อเปิดหน้าใหม่
- รักษาสถานะการทำงานให้สมบูรณ์

### 3. Save Indicator
- แสดงสถานะการบันทึกข้อมูลด้วย icon และข้อความ
- สถานะ: กำลังบันทึก / บันทึกแล้ว / เกิดข้อผิดพลาด
- แสดงเวลาที่บันทึกล่าสุด

### 4. Debug Logging
- มี console.log เพื่อติดตามการทำงานของระบบ
- ช่วยในการแก้ไขปัญหาและ debugging

## การทำงานของระบบ

### useEngagementPlan Hook
```typescript
// Auto-load จาก localStorage เมื่อเริ่มต้น
const savedState = localStorage.getItem(`engagement-plan-${planId}`);

// Auto-save ทุกครั้งที่ state เปลี่ยน (debounced 500ms)
useEffect(() => {
  const timeoutId = setTimeout(() => {
    localStorage.setItem(`engagement-plan-${planId}`, JSON.stringify(state));
  }, 500);
  return () => clearTimeout(timeoutId);
}, [state, planId]);
```

### Auto-Save ใน Components
```typescript
// บันทึกข้อมูลหลังจากผู้ใช้หยุดพิมพ์ 1 วินาที
useEffect(() => {
  const timeoutId = setTimeout(() => {
    dispatch({
      type: "UPDATE_STEP1",
      payload: { /* ข้อมูลปัจจุบัน */ }
    });
  }, 1000);
  return () => clearTimeout(timeoutId);
}, [/* dependencies */]);
```

## ไฟล์ที่ได้รับการปรับปรุง

1. **hooks/useEngagementPlan.tsx**
   - ปรับปรุงระบบ localStorage
   - เพิ่ม debouncing
   - เพิ่ม error handling

2. **Step Components**
   - step-1-activity-risk/page.tsx
   - step-2-engagement-plan/page.tsx  
   - step-3-audit-program/page.tsx
   - step-4-audit-reporting/page.tsx

3. **SaveIndicator Component**
   - components/features/engagement-plan/SaveIndicator.tsx
   - แสดงสถานะการบันทึก

## การใช้งาน

1. **เปิดหน้า Engagement Plan**: ข้อมูลจะโหลดจาก localStorage อัตโนมัติ
2. **กรอกข้อมูล**: ระบบจะบันทึกทุก 1 วินาทีหลังจากหยุดพิมพ์
3. **Refresh หน้า**: ข้อมูลจะยังคงอยู่ครบถ้วน
4. **ตรวจสอบสถานะ**: ดูได้จาก SaveIndicator ที่มุมขวาบน

## คุณสมบัติเพิ่มเติม

- **Cross-Step Sync**: การเปลี่ยนแปลงข้อมูลผู้รับผิดชอบใน step ใดจะ sync ไปทุก step
- **Default Values**: ค่าเริ่มต้นจะถูกตั้งอัตโนมัติ
- **Error Recovery**: หากเกิดข้อผิดพลาดในการโหลด/บันทึก จะใช้ค่าเริ่มต้น

## Debug และ Troubleshooting

หากพบปัญหา สามารถตรวจสอบใน Browser Console:
- "Saved state to localStorage: [planId]" - การบันทึกสำเร็จ  
- "Reducer action: [type]" - การอัปเดต state
- "Updated Step X state: [data]" - ข้อมูลที่อัปเดต

สามารถตรวจสอบข้อมูลใน localStorage ได้ที่:
- Application Tab > Local Storage > engagement-plan-[id]