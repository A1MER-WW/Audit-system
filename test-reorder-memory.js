// test-reorder-memory.js - ทดสอบการจำค่าการจัดลำดับความเสี่ยง

console.log("🧪 เริ่มทดสอบการจำค่าการจัดลำดับความเสี่ยง...\n");

// กำหนดค่าเซิร์ฟเวอร์
const BASE_URL = "http://localhost:3000";

async function testReorderMemory() {
  try {
    console.log("📋 ขั้นตอนที่ 1: ดึงข้อมูลเริ่มต้นจาก Inspector API");
    
    // 1. ดึงข้อมูลเริ่มต้น
    const initialResponse = await fetch(`${BASE_URL}/api/risk-assessment-results?year=2568`);
    const initialData = await initialResponse.json();
    
    console.log("✅ ได้ข้อมูลเริ่มต้น:", {
      tabs: Object.keys(initialData.rowsByTab),
      workTabCount: initialData.rowsByTab.work?.length || 0,
    });
    
    // เอาข้อมูลแท็บ "work" มาทดสอบ
    const workData = initialData.rowsByTab.work || [];
    if (workData.length === 0) {
      console.log("❌ ไม่มีข้อมูลในแท็บ 'work' ให้ทดสอบ");
      return;
    }
    
    const originalOrder = workData.map(item => item.id);
    console.log("📝 ลำดับเดิม:", originalOrder.slice(0, 4).map(id => 
      workData.find(item => item.id === id)?.work || id
    ));
    
    // 2. สร้างลำดับใหม่ (สลับตำแหน่งแรกกับที่สาม)
    const newOrder = [...originalOrder];
    [newOrder[0], newOrder[2]] = [newOrder[2], newOrder[0]];
    
    console.log("\n🔄 ขั้นตอนที่ 2: ส่งข้อมูลการจัดลำดับใหม่ไปยัง Chief API");
    
    const reorderPayload = {
      action: "submit_reorder",
      year: "2568",
      tab: "work",
      data: workData,
      originalOrder: originalOrder,
      newOrder: newOrder,
      changedItem: newOrder[0],
      reason: "ทดสอบการจำค่าการจัดลำดับ",
      hasChanges: true,
      reasonById: {
        [newOrder[0]]: "ทดสอบการจำค่า - ลำดับที่ 1",
        [newOrder[1]]: "ทดสอบการจำค่า - ลำดับที่ 2",
        [newOrder[2]]: "ทดสอบการจำค่า - ลำดับที่ 3"
      },
      metadata: {
        allTabsData: initialData.rowsByTab
      }
    };
    
    // ส่งข้อมูลไปยัง Chief API
    const submitResponse = await fetch(`${BASE_URL}/api/chief-risk-assessment-results?year=2568`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reorderPayload)
    });
    
    const submitResult = await submitResponse.json();
    console.log("✅ ส่งข้อมูลเรียบร้อย:", submitResult.success);
    
    // รอสักครู่ให้ระบบประมวลผล
    console.log("\n⏳ รอ 2 วินาที ให้ระบบประมวลผล...");
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log("\n📋 ขั้นตอนที่ 3: ดึงข้อมูลจาก Inspector API อีกครั้ง (จำลองการย้อนกลับ)");
    
    // 3. ดึงข้อมูลจาก Inspector API อีกครั้ง
    const afterResponse = await fetch(`${BASE_URL}/api/risk-assessment-results?year=2568`);
    const afterData = await afterResponse.json();
    
    const afterWorkData = afterData.rowsByTab.work || [];
    const afterOrder = afterWorkData.map(item => item.id);
    
    console.log("📝 ลำดับที่ได้กลับมา:", afterOrder.slice(0, 4).map(id => 
      afterWorkData.find(item => item.id === id)?.work || id
    ));
    
    console.log("\n🔍 ขั้นตอนที่ 4: ตรวจสอบผลลัพธ์");
    
    // ตรวจสอบว่าลำดับตรงกับที่จัดใหม่หรือไม่
    const isOrderCorrect = JSON.stringify(afterOrder) === JSON.stringify(newOrder);
    
    console.log("🆚 เปรียบเทียบลำดับ:");
    console.log("   ลำดับที่ส่งไป:", newOrder.slice(0, 3));
    console.log("   ลำดับที่ได้กลับ:", afterOrder.slice(0, 3));
    console.log("   ตรงกันหรือไม่:", isOrderCorrect ? "✅ ตรงกัน" : "❌ ไม่ตรงกัน");
    
    // ตรวจสอบเหตุผล
    let hasReasons = false;
    afterWorkData.slice(0, 3).forEach((item, index) => {
      if (item.reorderReason) {
        console.log(`   📝 เหตุผล ${index + 1}: ${item.reorderReason}`);
        hasReasons = true;
      }
    });
    
    if (!hasReasons) {
      console.log("   📝 เหตุผล: ไม่พบเหตุผลที่บันทึกไว้");
    }
    
    console.log("\n🎯 สรุปผลการทดสอบ:");
    if (isOrderCorrect) {
      console.log("✅ ระบบจำค่าการจัดลำดับทำงานได้ถูกต้อง!");
      console.log("   - ลำดับที่แก้ไขถูกบันทึกและแสดงผลได้ถูกต้อง");
      console.log("   - พอย้อนกลับจากหน้า Chief มาหน้า Inspector ลำดับยังคงอยู่");
    } else {
      console.log("❌ ระบบจำค่าการจัดลำดับยังมีปัญหา!");
      console.log("   - ลำดับที่แก้ไขไม่ได้ถูกบันทึกหรือแสดงผลไม่ถูกต้อง");
    }
    
  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาดในการทดสอบ:", error.message);
  }
}

// เรียกใช้งานการทดสอบ
testReorderMemory();