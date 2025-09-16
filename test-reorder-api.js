const testReorderData = {
  action: "submit_reorder",
  year: "2568", 
  tab: "all",
  data: [
    {
      id: "w2",
      index: "1", // ลำดับใหม่
      unit: "ชพน.",
      work: "งานพัสดุ",
      score: 46,
      grade: "M",
      status: "ประเมินแล้ว",
      mission: "-",
      project: "-",
      carry: "-", 
      activity: "-",
      process: "-",
      system: "-",
      itType: "-",
      hasDoc: true
    },
    {
      id: "w1",
      index: "2", // ลำดับใหม่
      unit: "สลก.",
      work: "มาตรการควบคุมการใช้งบประมาณ",
      score: 85,
      grade: "E", 
      status: "ประเมินแล้ว",
      mission: "-",
      project: "-",
      carry: "-",
      activity: "-", 
      process: "-",
      system: "-",
      itType: "-",
      hasDoc: true
    }
  ],
  originalOrder: ["w1", "w2"],
  newOrder: ["w2", "w1"], 
  changedItem: "w2",
  reason: "จัดลำดับความเสี่ยงใหม่เนื่องจากงานพัสดุมีความเสี่ยงสูงกว่า",
  hasChanges: true,
  reasonById: {
    "w2": "งานพัสดุมีความเสี่ยงสูงกว่าจึงต้องจัดลำดับให้เป็นอันดับ 1"
  },
  metadata: {
    pageTitle: "ผลการประเมิน",
    subtitle: "การประเมินความเสี่ยง", 
    assessmentName: "ผลการประเมินความเสี่ยง แผนการตรวจสอบประจำปี 2568",
    statusLine: {
      label: "สถานะ",
      value: "ประเมินแล้ว"
    },
    totalItems: 2,
    reorderTime: "2025-01-11T10:30:00Z"
  }
};

// ส่งข้อมูลไป API
fetch("http://localhost:3001/api/chief-risk-assessment-results?year=2568", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(testReorderData)
})
.then(response => response.json())
.then(data => {
  console.log("✅ Test data sent successfully:", data);
})
.catch(error => {
  console.error("❌ Error sending test data:", error);
});
