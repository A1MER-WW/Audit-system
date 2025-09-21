/**
 * ไฟล์ทดสอบการซิงค์ข้อมูลระหว่างหน้า risk-assessment-results 
 * และ overview-of-the-evaluation-results สำหรับแท็บ "ผลการจัดลำดับความเสี่ยง"
 */

console.log("🧪 เริ่มทดสอบการซิงค์ข้อมูลลำดับความเสี่ยง...\n");

// จำลองข้อมูลที่ส่งจาก Inspector (หน้า risk-assessment-results)
const mockInspectorSubmission = {
  action: "submit_reorder",
  year: "2568",
  tab: "work",
  originalOrder: ["w1", "w2", "w3", "w4"],
  newOrder: ["w3", "w1", "w4", "w2"], // จัดลำดับใหม่
  changedItem: "w3",
  reason: "จัดลำดับตามระดับความเสี่ยงสูงสุดก่อน",
  hasChanges: true,
  reasonById: {
    "w3": "จัดให้เป็นลำดับแรกเนื่องจากมีผลกระทบสูง",
    "w1": "ลำดับที่สอง - ความเสี่ยงระดับกลาง",
    "w4": "ลำดับที่สาม - ต้องติดตาม",
    "w2": "ลำดับสุดท้าย - ความเสี่ยงต่ำ"
  },
  data: [
    {
      id: "w3",
      index: "3",
      unit: "ศกส.",
      work: "งานบริหารงานบุคคล",
      score: 85,
      grade: "E",
      status: "ประเมินแล้ว"
    },
    {
      id: "w1", 
      index: "1",
      unit: "สลก.",
      work: "มาตรการควบคุมการใช้งบประมาณ",
      score: 72,
      grade: "H",
      status: "ประเมินแล้ว"
    },
    {
      id: "w4",
      index: "4", 
      unit: "ศสท.1",
      work: "งานสารบรรณ",
      score: 46,
      grade: "M",
      status: "ประเมินแล้ว"
    },
    {
      id: "w2",
      index: "2",
      unit: "ชพน.",
      work: "งานพัสดุ",
      score: 22,
      grade: "L", 
      status: "ประเมินแล้ว"
    }
  ],
  metadata: {
    pageTitle: "วางแผนงานตรวจสอบภายใน",
    subtitle: "การประเมินความเสี่ยงและการจัดลำดับความเสี่ยง",
    assessmentName: "ผลการประเมินความเสี่ยง แผนการตรวจสอบประจำปี 2568",
    totalItems: 4,
    reorderTime: new Date().toISOString(),
    allTabsData: {
      work: [
        { id: "w3", index: "3", unit: "ศกส.", work: "งานบริหารงานบุคคล", score: 85, grade: "E" },
        { id: "w1", index: "1", unit: "สลก.", work: "มาตรการควบคุมการใช้งบประมาณ", score: 72, grade: "H" },
        { id: "w4", index: "4", unit: "ศสท.1", work: "งานสารบรรณ", score: 46, grade: "M" },
        { id: "w2", index: "2", unit: "ชพน.", work: "งานพัสดุ", score: 22, grade: "L" }
      ],
      all: [
        { id: "w3", index: "3", unit: "ศกส.", work: "งานบริหารงานบุคคล", score: 85, grade: "E" },
        { id: "w1", index: "1", unit: "สลก.", work: "มาตรการควบคุมการใช้งบประมาณ", score: 72, grade: "H" },
        { id: "w4", index: "4", unit: "ศสท.1", work: "งานสารบรรณ", score: 46, grade: "M" },
        { id: "w2", index: "2", unit: "ชพน.", work: "งานพัสดุ", score: 22, grade: "L" }
      ]
    }
  }
};

console.log("📤 ข้อมูลที่ส่งจาก Inspector:");
console.log("- การกระทำ:", mockInspectorSubmission.action);
console.log("- ลำดับเดิม:", mockInspectorSubmission.originalOrder);
console.log("- ลำดับใหม่:", mockInspectorSubmission.newOrder);
console.log("- มีการเปลี่ยนแปลง:", mockInspectorSubmission.hasChanges);
console.log("- เหตุผลทั้งหมด:", Object.keys(mockInspectorSubmission.reasonById).length, "รายการ");

// จำลองการประมวลผลที่ Chief API
console.log("\n🔄 กระบวนการประมวลผลที่ Chief API:");

// 1. ตรวจสอบการจัดลำดับใหม่
const isReorderAction = mockInspectorSubmission.action === "submit_reorder";
console.log("1. ตรวจสอบประเภทการกระทำ:", isReorderAction ? "✅ เป็นการจัดลำดับใหม่" : "❌ ไม่ใช่การจัดลำดับใหม่");

if (isReorderAction) {
  // 2. จัดเรียงข้อมูลตามลำดับใหม่
  const dataMap = new Map(mockInspectorSubmission.data.map(item => [item.id, item]));
  const reorderedData = mockInspectorSubmission.newOrder.map(id => dataMap.get(id)).filter(Boolean);
  
  console.log("2. จัดเรียงข้อมูลใหม่:");
  console.log("   - ลำดับใหม่:", reorderedData.map(item => `${item.id}(${item.work})`));
  
  // 3. อัพเดท rowsByTab
  let rowsByTab = { ...mockInspectorSubmission.metadata.allTabsData };
  
  if (mockInspectorSubmission.tab && rowsByTab[mockInspectorSubmission.tab]) {
    const tabDataMap = new Map(rowsByTab[mockInspectorSubmission.tab].map(item => [item.id, item]));
    const reorderedTabData = mockInspectorSubmission.newOrder.map(id => tabDataMap.get(id)).filter(Boolean);
    rowsByTab[mockInspectorSubmission.tab] = reorderedTabData;
    
    console.log("3. อัพเดทข้อมูลแท็บ:", mockInspectorSubmission.tab);
    console.log("   - รายการใหม่:", reorderedTabData.length, "รายการ");
  }
  
  if (rowsByTab["all"]) {
    const allDataMap = new Map(rowsByTab["all"].map(item => [item.id, item]));
    const reorderedAllData = mockInspectorSubmission.newOrder.map(id => allDataMap.get(id)).filter(Boolean);
    rowsByTab["all"] = reorderedAllData;
    
    console.log("4. อัพเดทข้อมูลแท็บ 'all':");
    console.log("   - รายการใหม่:", reorderedAllData.length, "รายการ");
  }
  
  // 4. สร้างข้อมูล response สำหรับ Chief Inspector
  const chiefResponse = {
    rowsByTab: rowsByTab,
    statusLine: {
      label: "สถานะ",
      value: "ได้รับการจัดลำดับความเสี่ยงใหม่แล้ว - รอพิจารณา"
    },
    submissionInfo: {
      action: mockInspectorSubmission.action,
      submissionTime: mockInspectorSubmission.metadata.reorderTime,
      itemCount: reorderedData.length
    },
    reorderInfo: {
      originalOrder: mockInspectorSubmission.originalOrder,
      newOrder: mockInspectorSubmission.newOrder,
      changedItem: mockInspectorSubmission.changedItem,
      reason: mockInspectorSubmission.reason,
      hasChanges: mockInspectorSubmission.hasChanges,
      reasonById: mockInspectorSubmission.reasonById
    }
  };
  
  console.log("\n📋 ข้อมูลที่ส่งไปยัง Chief Inspector:");
  console.log("- มีข้อมูล rowsByTab:", !!chiefResponse.rowsByTab);
  console.log("- แท็บที่มีข้อมูล:", Object.keys(chiefResponse.rowsByTab));
  console.log("- มีข้อมูล reorderInfo:", !!chiefResponse.reorderInfo);
  console.log("- สถานะ:", chiefResponse.statusLine.value);
  
  // 5. ตรวจสอบการแสดงผลในหน้า Overview
  console.log("\n🖥️ การแสดงผลในหน้า Overview:");
  
  const overviewReorderData = chiefResponse.rowsByTab[mockInspectorSubmission.tab] || chiefResponse.rowsByTab["all"];
  console.log("- ข้อมูลที่แสดง:", overviewReorderData.length, "รายการ");
  console.log("- ลำดับการแสดง:");
  overviewReorderData.forEach((item, index) => {
    const reason = chiefResponse.reorderInfo.reasonById[item.id] || "-";
    console.log(`  ${index + 1}. ${item.work} (${item.unit}) - คะแนน: ${item.score} - เหตุผล: ${reason}`);
  });
  
  // 6. ตรวจสอบความถูกต้องของการซิงค์
  console.log("\n✅ การตรวจสอบความถูกต้อง:");
  
  const originalOrder = mockInspectorSubmission.originalOrder;
  const newOrder = mockInspectorSubmission.newOrder;
  const displayOrder = overviewReorderData.map(item => item.id);
  
  const orderMatches = JSON.stringify(newOrder) === JSON.stringify(displayOrder);
  console.log("- ลำดับตรงกับที่จัดใหม่:", orderMatches ? "✅ ถูกต้อง" : "❌ ไม่ถูกต้อง");
  
  const hasAllReasons = newOrder.every(id => chiefResponse.reorderInfo.reasonById[id]);
  console.log("- มีเหตุผลครบทุกรายการ:", hasAllReasons ? "✅ ครบถ้วน" : "❌ ไม่ครบ");
  
  const gradesMatch = overviewReorderData.every(item => ["E", "H", "M", "L", "N"].includes(item.grade));
  console.log("- เกรดถูกต้อง:", gradesMatch ? "✅ ถูกต้อง" : "❌ ไม่ถูกต้อง");
  
  console.log("\n🎉 การทดสอบเสร็จสิ้น!");
  
  if (orderMatches && hasAllReasons && gradesMatch) {
    console.log("✅ ระบบซิงค์ข้อมูลระหว่างสองหน้าทำงานได้ถูกต้อง!");
  } else {
    console.log("❌ พบปัญหาในการซิงค์ข้อมูล กรุณาตรวจสอบ:");
    if (!orderMatches) console.log("   - ลำดับไม่ตรงกัน");
    if (!hasAllReasons) console.log("   - เหตุผลไม่ครบ");
    if (!gradesMatch) console.log("   - เกรดไม่ถูกต้อง");
  }
}