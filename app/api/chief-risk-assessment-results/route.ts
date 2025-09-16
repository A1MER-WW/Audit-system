import { NextRequest, NextResponse } from "next/server";

// Import ข้อมูลจาก inspector API
import { GET as InspectorGET } from "../risk-assessment-results/route";
import { setReorderData, type ReorderData } from "@/lib/mock-risk-db";

// เก็บข้อมูลที่ส่งมาจาก Inspector (ในระบบจริงจะเก็บในฐานข้อมูล)
interface SubmittedData {
  action: string;
  year: string;
  tab: string;
  data: unknown[];
  originalOrder?: string[];
  newOrder?: string[];
  changedItem?: string;
  reason?: string;
  hasChanges?: boolean;
  reasonById?: Record<string, string>;
  metadata?: Record<string, unknown>;
  rowsByTab?: Record<string, unknown[]>;
  submissionTime?: string; // เพิ่มเวลาที่ส่ง
}

let submittedData: SubmittedData | null = null;
let submissionStatus = "รอหัวหน้าหน่วยตรวจสอบพิจารณา";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get("year") || "2568";
    
    // ถ้าขอข้อมูลปีที่ผ่านมา ให้ใช้ mock data สำหรับการเปรียบเทียบ
    if (year === "2567") {
      return NextResponse.json(getMockDataForYear2567());
    }
    if (year === "2566") {
      return NextResponse.json(getMockDataForYear2566());
    }
    if (year === "2565") {
      return NextResponse.json(getMockDataForYear2565());
    }
    
    // ถ้ามีข้อมูลที่ส่งมาจาก Inspector แล้ว ให้ใช้ข้อมูลนั้น
    if (submittedData) {
      console.log("📋 Using submitted data from Inspector", {
        action: submittedData.action,
        dataCount: submittedData.data?.length || 0,
        hasReorder: !!submittedData.newOrder
      });

      const responseData: Record<string, unknown> = {
        ...submittedData.metadata,
        rowsByTab: submittedData.rowsByTab || {},
        statusLine: {
          label: "สถานะ",
          value: submissionStatus
        },
        submissionInfo: {
          action: submittedData.action,
          submissionTime: submittedData.metadata?.submissionTime || submittedData.metadata?.reorderTime,
          itemCount: submittedData.metadata?.totalItems || submittedData.data?.length
        }
      };

      // ถ้าเป็น reorder ให้เพิ่มข้อมูลการจัดลำดับ
      if (submittedData.action === "submit_reorder") {
        responseData.reorderInfo = {
          originalOrder: submittedData.originalOrder,
          newOrder: submittedData.newOrder,
          changedItem: submittedData.changedItem,
          reason: submittedData.reason,
          hasChanges: submittedData.hasChanges ?? (
            submittedData.originalOrder && submittedData.newOrder && 
            JSON.stringify(submittedData.originalOrder) !== JSON.stringify(submittedData.newOrder)
          ),
          reasonById: submittedData.reasonById || {}
        };
      }

      console.log("📤 Sending response data:", {
        hasRowsByTab: !!responseData.rowsByTab,
        rowsByTabKeys: responseData.rowsByTab ? Object.keys(responseData.rowsByTab as Record<string, unknown>) : [],
        hasReorderInfo: !!responseData.reorderInfo,
        submissionAction: responseData.submissionInfo && typeof responseData.submissionInfo === 'object' && 'action' in responseData.submissionInfo ? responseData.submissionInfo.action : 'unknown'
      });

      return NextResponse.json(responseData);
    }

    // ถ้ายังไม่มีข้อมูลส่งมา ให้ใช้ข้อมูลจาก inspector API
    const inspectorResponse = await InspectorGET(request);
    const inspectorData = await inspectorResponse.json();

    // ปรับสถานะเป็น "อนุมัติแล้ว" หรือ "รอการอนุมัติ" สำหรับ Chief Inspector
    const chiefData = {
      ...inspectorData,
      statusLine: {
        label: "สถานะ",
        value: "ยังไม่ได้ส่งข้อมูลจาก Inspector"
      },
      pageTitle: "ภาพรวมผลการประเมิน",
      subtitle: "การประเมินความเสี่ยงและการจัดลำดับความเสี่ยง (Chief Inspector View)",
      assessmentName: `ผลการประเมินความเสี่ยง แผนการตรวจสอบประจำปี ${new URLSearchParams(request.url.split('?')[1] || '').get('year') || new Date().getFullYear() + 543}`
    };

    return NextResponse.json(chiefData);
  } catch (error) {
    console.error("Chief Risk Assessment Results API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch chief risk assessment results" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get("year") || "2568";
    const body = await request.json();
    
    console.log("📨 Chief Risk Assessment - Received submission:", {
      year,
      action: body.action,
      dataLength: body.data?.length || 0,
      timestamp: new Date().toISOString()
    });

    // สร้าง rowsByTab ที่ครบถ้วนจากข้อมูลที่ส่งมา
    let rowsByTab: Record<string, unknown[]> = {};
    let orderedData = body.data;

    // ถ้ามีข้อมูล allTabsData ให้ใช้เป็นข้อมูลพื้นฐาน
    if (body.metadata?.allTabsData && typeof body.metadata.allTabsData === 'object') {
      const allTabsData = body.metadata.allTabsData as Record<string, unknown[]>;
      console.log("📋 Using allTabsData from metadata:", {
        availableTabs: Object.keys(allTabsData),
        tabCounts: Object.entries(allTabsData).map(([key, value]) => ({
          tab: key,
          count: Array.isArray(value) ? value.length : 0
        }))
      });
      
      // ใช้ข้อมูลจาก allTabsData เป็นข้อมูลพื้นฐาน
      rowsByTab = { ...allTabsData };
    }

    // สำหรับ reorder: จัดเรียงข้อมูลตามลำดับใหม่
    if (body.action === "submit_reorder" && body.newOrder && Array.isArray(body.data)) {
      console.log("🔄 Reordering data according to new order:", {
        originalOrder: body.originalOrder,
        newOrder: body.newOrder,
        changedItem: body.changedItem,
        reason: body.reason,
        reasonById: body.reasonById
      });
      
      // จัดเรียงข้อมูลตาม newOrder
      const dataMap = new Map(body.data.map((item: { id: string }) => [item.id, item]));
      orderedData = body.newOrder.map((id: string) => dataMap.get(id)).filter(Boolean);
      
      console.log("✅ Data reordered successfully:", {
        originalCount: body.data.length,
        reorderedCount: orderedData.length,
        newOrder: body.newOrder,
        orderedDataIds: orderedData.map((item: { id: string }) => item.id)
      });

      // อัพเดท rowsByTab สำหรับแท็บ reorder
      if (body.tab && rowsByTab[body.tab]) {
        // จัดเรียงข้อมูลในแท็บนี้ตาม newOrder
        const tabDataMap = new Map((rowsByTab[body.tab] as Record<string, unknown>[]).map((item: Record<string, unknown>) => [item.id as string, item]));
        const reorderedTabData = body.newOrder.map((id: string) => tabDataMap.get(id)).filter(Boolean);
        rowsByTab[body.tab] = reorderedTabData;
        
        console.log("📋 Updated tab data for reorder:", {
          tab: body.tab,
          originalCount: (rowsByTab[body.tab] || []).length,
          reorderedCount: reorderedTabData.length
        });
      }

      // อัพเดท "all" tab ด้วยข้อมูลที่จัดลำดับใหม่
      if (rowsByTab["all"]) {
        const allDataMap = new Map((rowsByTab["all"] as Record<string, unknown>[]).map((item: Record<string, unknown>) => [item.id as string, item]));
        const reorderedAllData = body.newOrder.map((id: string) => allDataMap.get(id)).filter(Boolean);
        
        // เติมข้อมูลที่เหลือที่ไม่ได้อยู่ใน newOrder
        const newOrderSet = new Set(body.newOrder);
        const remainingData = (rowsByTab["all"] as Record<string, unknown>[]).filter((item: Record<string, unknown>) => !newOrderSet.has(item.id as string));
        
        rowsByTab["all"] = [...reorderedAllData, ...remainingData];
        
        console.log("📋 Updated 'all' tab data for reorder:", {
          reorderedCount: reorderedAllData.length,
          remainingCount: remainingData.length,
          totalCount: rowsByTab["all"].length
        });
      }
    } else if (orderedData && Array.isArray(orderedData)) {
      // สำหรับ action อื่นๆ (summary, unitRanking)
      rowsByTab[body.tab] = orderedData;
      if (!rowsByTab["all"] || rowsByTab["all"].length === 0) {
        rowsByTab["all"] = orderedData;
      }
    }

    // บันทึกข้อมูลการจัดลำดับใน mock database สำหรับให้ Inspector อ่านกลับได้
    if (body.action === "submit_reorder" && body.newOrder && body.tab) {
      const reorderData: ReorderData = {
        year,
        tab: body.tab,
        newOrder: body.newOrder,
        originalOrder: body.originalOrder || [],
        reasonById: body.reasonById || {},
        timestamp: new Date().toISOString()
      };
      
      setReorderData(reorderData);
      console.log("💾 Saved reorder data to mock database:", {
        year,
        tab: body.tab,
        orderLength: body.newOrder.length,
        reasonCount: Object.keys(body.reasonById || {}).length
      });
    }

    // เก็บข้อมูลที่ส่งมาจาก Inspector
    submittedData = {
      action: body.action,
      year,
      tab: body.tab,
      data: orderedData, // ใช้ข้อมูลที่จัดลำดับแล้ว
      originalOrder: body.originalOrder,
      newOrder: body.newOrder,
      changedItem: body.changedItem,
      reason: body.reason,
      hasChanges: body.hasChanges,
      reasonById: body.reasonById || {},
      metadata: body.metadata,
      // ใช้ rowsByTab ที่สร้างขึ้นใหม่
      rowsByTab: rowsByTab,
      submissionTime: new Date().toISOString() // เพิ่มเวลาที่ส่ง
    };

    // อัปเดตสถานะ
    if (body.action === "submit_reorder") {
      submissionStatus = "ได้รับการจัดลำดับความเสี่ยงใหม่แล้ว - รอพิจารณา";
    } else {
      submissionStatus = "ได้รับผลการประเมินแล้ว - รอพิจารณา";
    }

    console.log("✅ Data stored successfully with status:", submissionStatus);
    
    return NextResponse.json({
      success: true,
      message: "ได้รับข้อมูลการประเมินความเสี่ยงเรียบร้อยแล้ว",
      timestamp: new Date().toISOString(),
      receivedData: {
        year,
        action: body.action,
        itemCount: orderedData?.length || 0,
        status: submissionStatus,
        reorderInfo: body.action === "submit_reorder" ? {
          changedItems: body.changedItem ? 1 : 0,
          reason: body.reason || "ไม่ระบุเหตุผล"
        } : null
      }
    });
    
  } catch (error) {
    console.error("Error processing chief risk assessment submission:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "เกิดข้อผิดพลาดในการรับข้อมูล" 
      },
      { status: 500 }
    );
  }
}

// ฟังก์ชันสร้าง mock data สำหรับปี 2567 เพื่อการเปรียบเทียบ
function getMockDataForYear2567() {
  // ข้อมูลพื้นฐานทั้งหมด
  const allData = [
    // งานหลัก (work) - 4 เรื่อง
    {
      id: "2567-001",
      index: "1",
      unit: "สลก.",
      mission: "บริหารจัดการทั่วไป",
      work: "การควบคุมภายใน",
      project: "-",
      carry: "-",
      activity: "-",
      process: "-",
      system: "-",
      itType: "-",
      score: 72,
      maxScore: 100,
      grade: "H",
      status: "ประเมินแล้ว",
      hasDoc: true
    },
    {
      id: "2567-002",
      index: "2",
      unit: "ศกช.",
      mission: "สำรวจเศรษฐกิจการเกษตร",
      work: "สำรวจผลผลิตข้าว",
      project: "-",
      carry: "-",
      activity: "-",
      process: "-",
      system: "-",
      itType: "-",
      score: 68,
      maxScore: 100,
      grade: "H",
      status: "ประเมินแล้ว",
      hasDoc: true
    },
    {
      id: "2567-003",
      index: "3",
      unit: "ศสท.1",
      mission: "สำรวจท้องถิ่น",
      work: "สำรวจพื้นที่เพาะปลูก",
      project: "-",
      carry: "-",
      activity: "-",
      process: "-",
      system: "-",
      itType: "-",
      score: 45,
      maxScore: 100,
      grade: "M",
      status: "ประเมินแล้ว",
      hasDoc: true
    },
    {
      id: "2567-018",
      index: "4",
      unit: "กพน.",
      mission: "การเงินและงบประมาณ",
      work: "บริหารงบประมาณ",
      project: "-",
      carry: "-",
      activity: "-",
      process: "-",
      system: "-",
      itType: "-",
      score: 54,
      maxScore: 100,
      grade: "M",
      status: "ประเมินแล้ว",
      hasDoc: true
    },

    // โครงการ (project) - 3 เรื่อง
    {
      id: "2567-004",
      index: "5",
      unit: "กพร.",
      mission: "พัฒนาทรัพยากรบุคคล",
      work: "-",
      project: "โครงการพัฒนาระบบฐานข้อมูลบุคลากร",
      carry: "-",
      activity: "-",
      process: "-",
      system: "-",
      itType: "IT",
      score: 52,
      maxScore: 100,
      grade: "M",
      status: "ประเมินแล้ว",
      hasDoc: true
    },
    {
      id: "2567-020",
      index: "6",
      unit: "ศวส.",
      mission: "พัฒนาเทคโนโลยี",
      work: "-",
      project: "โครงการพัฒนาระบบ Smart Analytics",
      carry: "-",
      activity: "-",
      process: "-",
      system: "-",
      itType: "IT",
      score: 78,
      maxScore: 100,
      grade: "H",
      status: "ประเมินแล้ว",
      hasDoc: true
    },
    {
      id: "2567-021",
      index: "7",
      unit: "กศป.",
      mission: "พัฒนาศักยภาพบุคลากร",
      work: "-",
      project: "โครงการยกระดับทักษะดิจิทัล",
      carry: "-",
      activity: "-",
      process: "-",
      system: "-",
      itType: "IT",
      score: 41,
      maxScore: 100,
      grade: "M",
      status: "ประเมินแล้ว",
      hasDoc: false
    },

    // โครงการกันเงินเหลื่อมปี (carry) - 2 เรื่อง
    {
      id: "2567-005",
      index: "8",
      unit: "กพร.",
      mission: "พัฒนาทรัพยากรบุคคล",
      work: "-",
      project: "-",
      carry: "ปรับปรุงระบบเงินเดือนและสวัสดิการ",
      activity: "-",
      process: "-",
      system: "-",
      itType: "IT",
      score: 38,
      maxScore: 100,
      grade: "L",
      status: "ประเมินแล้ว",
      hasDoc: true
    },
    {
      id: "2567-022",
      index: "9",
      unit: "ศสส.",
      mission: "พัฒนาระบบสารสนเทศ",
      work: "-",
      project: "-",
      carry: "โครงการอัพเกรดเซิร์ฟเวอร์หลัก",
      activity: "-",
      process: "-",
      system: "-",
      itType: "IT",
      score: 67,
      maxScore: 100,
      grade: "H",
      status: "ประเมินแล้ว",
      hasDoc: true
    },

    // กิจกรรม (activity) - 4 เรื่อง
    {
      id: "2567-006",
      index: "10",
      unit: "ศปผ.",
      mission: "วางแผนและประเมินโครงการ",
      work: "-",
      project: "-",
      carry: "-",
      activity: "ประเมินผลโครงการประจำปี",
      process: "-",
      system: "-",
      itType: "-",
      score: 58,
      maxScore: 100,
      grade: "M",
      status: "ประเมินแล้ว",
      hasDoc: true
    },
    {
      id: "2567-007",
      index: "11",
      unit: "กศป.",
      mission: "พัฒนาศักยภาพบุคลากร",
      work: "-",
      project: "-",
      carry: "-",
      activity: "อบรมพัฒนาทักษะเจ้าหน้าที่",
      process: "-",
      system: "-",
      itType: "-",
      score: 35,
      maxScore: 100,
      grade: "L",
      status: "ประเมินแล้ว",
      hasDoc: true
    },
    {
      id: "2567-023",
      index: "12",
      unit: "ศวส.",
      mission: "พัฒนาเทคโนโลยี",
      work: "-",
      project: "-",
      carry: "-",
      activity: "กิจกรรมวิจัยและพัฒนานวัตกรรม",
      process: "-",
      system: "-",
      itType: "-",
      score: 71,
      maxScore: 100,
      grade: "H",
      status: "ประเมินแล้ว",
      hasDoc: true
    },
    {
      id: "2567-024",
      index: "13",
      unit: "กพน.",
      mission: "การเงินและงบประมาณ",
      work: "-",
      project: "-",
      carry: "-",
      activity: "ตรวจสอบการใช้งบประมาณ",
      process: "-",
      system: "-",
      itType: "-",
      score: 49,
      maxScore: 100,
      grade: "M",
      status: "ประเมินแล้ว",
      hasDoc: false
    },

    // กระบวนงาน (process) - 3 เรื่อง
    {
      id: "2567-008",
      index: "14",
      unit: "สลก.",
      mission: "บริหารจัดการทั่วไป",
      work: "-",
      project: "-",
      carry: "-",
      activity: "-",
      process: "กระบวนการจัดซื้อจัดจ้าง",
      system: "-",
      itType: "Non-IT",
      score: 48,
      maxScore: 100,
      grade: "M",
      status: "ประเมินแล้ว",
      hasDoc: true
    },
    {
      id: "2567-009",
      index: "15",
      unit: "ศสส.",
      mission: "พัฒนาระบบสารสนเทศ",
      work: "-",
      project: "-",
      carry: "-",
      activity: "-",
      process: "กระบวนการพัฒนาระบบฐานข้อมูล",
      system: "-",
      itType: "IT",
      score: 75,
      maxScore: 100,
      grade: "H",
      status: "ประเมินแล้ว",
      hasDoc: true
    },
    {
      id: "2567-025",
      index: "16",
      unit: "กพร.",
      mission: "พัฒนาทรัพยากรบุคคล",
      work: "-",
      project: "-",
      carry: "-",
      activity: "-",
      process: "กระบวนการสรรหาและคัดเลือกบุคลากร",
      system: "-",
      itType: "Non-IT",
      score: 56,
      maxScore: 100,
      grade: "M",
      status: "ประเมินแล้ว",
      hasDoc: true
    },

    // ระบบ IT และ Non-IT (it) - 5 เรื่อง
    {
      id: "2567-010",
      index: "17",
      unit: "ศสส.",
      mission: "พัฒนาระบบสารสนเทศ",
      work: "-",
      project: "-",
      carry: "-",
      activity: "-",
      process: "-",
      system: "ระบบคลังข้อมูลกลาง (Data Warehouse)",
      itType: "IT",
      score: 82,
      maxScore: 100,
      grade: "E",
      status: "ประเมินแล้ว",
      hasDoc: true
    },
    {
      id: "2567-011",
      index: "18",
      unit: "สลก.",
      mission: "บริหารจัดการทั่วไป",
      work: "-",
      project: "-",
      carry: "-",
      activity: "-",
      process: "-",
      system: "ระบบสารบรรณอิเล็กทรอนิกส์",
      itType: "IT",
      score: 42,
      maxScore: 100,
      grade: "M",
      status: "ประเมินแล้ว",
      hasDoc: true
    },
    {
      id: "2567-013",
      index: "19",
      unit: "ศปผ.",
      mission: "วางแผนและประเมินโครงการ",
      work: "-",
      project: "-",
      carry: "-",
      activity: "-",
      process: "-",
      system: "ระบบติดตามและควบคุมโครงการ",
      itType: "IT",
      score: 65,
      maxScore: 100,
      grade: "H",
      status: "ประเมินแล้ว",
      hasDoc: true
    },
    {
      id: "2567-014",
      index: "20",
      unit: "ศกช.",
      mission: "สำรวจเศรษฐกิจการเกษตร",
      work: "-",
      project: "-",
      carry: "-",
      activity: "-",
      process: "-",
      system: "ระบบจัดเก็บและประมวลผลข้อมูลสำรวจ",
      itType: "IT",
      score: 55,
      maxScore: 100,
      grade: "M",
      status: "ประเมินแล้ว",
      hasDoc: true
    },
    {
      id: "2567-015",
      index: "21",
      unit: "ศสท.1",
      mission: "สำรวจท้องถิ่น",
      work: "-",
      project: "-",
      carry: "-",
      activity: "-",
      process: "-",
      system: "ระบบรายงานผลสำรวจท้องถิ่น",
      itType: "Non-IT",
      score: 32,
      maxScore: 100,
      grade: "L",
      status: "ประเมินแล้ว",
      hasDoc: false
    }
  ];

  // แยกข้อมูลตามแต่ละแท็บ
  const rowsByTab = {
    all: allData,
    unit: allData.filter(item => item.work !== "-" && item.work !== ""),
    work: allData.filter(item => item.work !== "-" && item.work !== ""),
    project: allData.filter(item => item.project !== "-" && item.project !== ""),
    carry: allData.filter(item => item.carry !== "-" && item.carry !== ""),
    activity: allData.filter(item => item.activity !== "-" && item.activity !== ""),
    process: allData.filter(item => item.process !== "-" && item.process !== ""),
    it: allData.filter(item => item.system !== "-" && item.system !== "" || item.itType === "IT" || item.itType === "Non-IT")
  };

  return {
    fiscalYears: [2567, 2566, 2565],
    pageTitle: "ภาพรวมผลการประเมิน ปี 2567",
    subtitle: "การประเมินความเสี่ยงและการจัดลำดับความเสี่ยง ปีงบประมาณ 2567",
    assessmentName: "ผลการประเมินความเสี่ยง แผนการตรวจสอบประจำปี 2567",
    statusLine: {
      label: "สถานะ",
      value: "ข้อมูลปีที่แล้ว - เพื่อการเปรียบเทียบ"
    },
    rowsByTab,
    submissionInfo: {
      action: "historical_data",
      submissionTime: "2567-09-30T23:59:59.999Z",
      itemCount: 21
    }
  };
}

// ฟังก์ชันสร้าง mock data สำหรับปี 2566
function getMockDataForYear2566() {
  return {
    fiscalYears: [2566, 2565, 2564],
    pageTitle: "ภาพรวมผลการประเมิน ปี 2566",
    subtitle: "การประเมินความเสี่ยงและการจัดลำดับความเสี่ยง ปีงบประมาณ 2566",
    assessmentName: "ผลการประเมินความเสี่ยง แผนการตรวจสอบประจำปี 2566",
    statusLine: {
      label: "สถานะ",
      value: "ข้อมูลปีที่แล้ว - เพื่อการเปรียบเทียบ"
    },
    rowsByTab: {
      all: [
        {
          id: "2566-001",
          index: "1",
          unit: "สลก.",
          mission: "บริหารจัดการทั่วไป",
          work: "การควบคุมภายใน",
          project: "-",
          carry: "-",
          activity: "-",
          process: "-",
          system: "-",
          itType: "-",
          score: 78,
          maxScore: 100,
          grade: "H",
          status: "ประเมินแล้ว",
          hasDoc: true
        },
        {
          id: "2566-002",
          index: "2",
          unit: "ศกช.",
          mission: "สำรวจเศรษฐกิจการเกษตร",
          work: "สำรวจผลผลิตข้าว",
          project: "-",
          carry: "-",
          activity: "-",
          process: "-",
          system: "-",
          itType: "-",
          score: 62,
          maxScore: 100,
          grade: "H",
          status: "ประเมินแล้ว",
          hasDoc: true
        },
        {
          id: "2566-003",
          index: "3",
          unit: "ศสท.1",
          mission: "สำรวจท้องถิ่น",
          work: "-",
          project: "โครงการพัฒนาเกษตรอัจฉริยะ",
          carry: "-",
          activity: "-",
          process: "-",
          system: "-",
          itType: "IT",
          score: 42,
          maxScore: 100,
          grade: "M",
          status: "ประเมินแล้ว",
          hasDoc: false
        },
        {
          id: "2566-004",
          index: "4",
          unit: "กพร.",
          mission: "พัฒนาทรัพยากรบุคคล",
          work: "-",
          project: "-",
          carry: "ปรับปรุงระบบ HR",
          activity: "-",
          process: "-",
          system: "-",
          itType: "IT",
          score: 35,
          maxScore: 100,
          grade: "L",
          status: "ประเมินแล้ว",
          hasDoc: true
        },
        {
          id: "2566-005",
          index: "5",
          unit: "ศปผ.",
          mission: "วางแผนและประเมินโครงการ",
          work: "-",
          project: "-",
          carry: "-",
          activity: "ประเมินผลโครงการ",
          process: "-",
          system: "-",
          itType: "-",
          score: 55,
          maxScore: 100,
          grade: "M",
          status: "ประเมินแล้ว",
          hasDoc: true
        },
        {
          id: "2566-006",
          index: "6",
          unit: "ศสส.",
          mission: "พัฒนาระบบสารสนเทศ",
          work: "-",
          project: "-",
          carry: "-",
          activity: "-",
          process: "-",
          system: "ระบบฐานข้อมูลหลัก",
          itType: "IT",
          score: 88,
          maxScore: 100,
          grade: "E",
          status: "ประเมินแล้ว",
          hasDoc: true
        },
      ],
      unit: [
        {
          id: "2566-001",
          index: "1",
          unit: "สลก.",
          mission: "บริหารจัดการทั่วไป",
          work: "การควบคุมภายใน",
          project: "-",
          carry: "-",
          activity: "-",
          process: "-",
          system: "-",
          itType: "-",
          score: 78,
          grade: "H",
          status: "ประเมินแล้ว",
          hasDoc: true
        }
      ],
      work: [
        {
          id: "2566-001",
          index: "1",
          unit: "สลก.",
          mission: "บริหารจัดการทั่วไป",
          work: "การควบคุมภายใน",
          project: "-",
          carry: "-",
          activity: "-",
          process: "-",
          system: "-",
          itType: "-",
          score: 78,
          grade: "H",
          status: "ประเมินแล้ว",
          hasDoc: true
        }
      ],
      project: [
        {
          id: "2566-003",
          index: "3",
          unit: "ศสท.1",
          mission: "สำรวจท้องถิ่น",
          work: "-",
          project: "โครงการพัฒนาเกษตรอัจฉริยะ",
          carry: "-",
          activity: "-",
          process: "-",
          system: "-",
          itType: "IT",
          score: 42,
          grade: "M",
          status: "ประเมินแล้ว",
          hasDoc: false
        }
      ],
      carry: [
        {
          id: "2566-004",
          index: "4",
          unit: "กพร.",
          mission: "พัฒนาทรัพยากรบุคคล",
          work: "-",
          project: "-",
          carry: "ปรับปรุงระบบ HR",
          activity: "-",
          process: "-",
          system: "-",
          itType: "IT",
          score: 35,
          grade: "L",
          status: "ประเมินแล้ว",
          hasDoc: true
        }
      ],
      activity: [
        {
          id: "2566-005",
          index: "5",
          unit: "ศปผ.",
          mission: "วางแผนและประเมินโครงการ",
          work: "-",
          project: "-",
          carry: "-",
          activity: "ประเมินผลโครงการ",
          process: "-",
          system: "-",
          itType: "-",
          score: 55,
          grade: "M",
          status: "ประเมินแล้ว",
          hasDoc: true
        }
      ],
      process: [],
      it: [
        {
          id: "2566-003",
          index: "3",
          unit: "ศสท.1",
          mission: "สำรวจท้องถิ่น",
          work: "-",
          project: "โครงการพัฒนาเกษตรอัจฉริยะ",
          carry: "-",
          activity: "-",
          process: "-",
          system: "-",
          itType: "IT",
          score: 42,
          grade: "M",
          status: "ประเมินแล้ว",
          hasDoc: false
        },
        {
          id: "2566-004",
          index: "4",
          unit: "กพร.",
          mission: "พัฒนาทรัพยากรบุคคล",
          work: "-",
          project: "-",
          carry: "ปรับปรุงระบบ HR",
          activity: "-",
          process: "-",
          system: "-",
          itType: "IT",
          score: 35,
          grade: "L",
          status: "ประเมินแล้ว",
          hasDoc: true
        },
        {
          id: "2566-006",
          index: "6",
          unit: "ศสส.",
          mission: "พัฒนาระบบสารสนเทศ",
          work: "-",
          project: "-",
          carry: "-",
          activity: "-",
          process: "-",
          system: "ระบบฐานข้อมูลหลัก",
          itType: "IT",
          score: 88,
          grade: "E",
          status: "ประเมินแล้ว",
          hasDoc: true
        }
      ]
    },
    submissionInfo: {
      action: "historical_data",
      submissionTime: "2566-09-30T23:59:59.999Z",
      itemCount: 6
    }
  };
}

// ฟังก์ชันสร้าง mock data สำหรับปี 2565
function getMockDataForYear2565() {
  return {
    fiscalYears: [2565, 2564, 2563],
    pageTitle: "ภาพรวมผลการประเมิน ปี 2565",
    subtitle: "การประเมินความเสี่ยงและการจัดลำดับความเสี่ยง ปีงบประมาณ 2565",
    assessmentName: "ผลการประเมินความเสี่ยง แผนการตรวจสอบประจำปี 2565",
    statusLine: {
      label: "สถานะ",
      value: "ข้อมูลปีที่แล้ว - เพื่อการเปรียบเทียบ"
    },
    rowsByTab: {
      all: [
        {
          id: "2565-001",
          index: "1",
          unit: "สลก.",
          mission: "บริหารจัดการทั่วไป",
          work: "การควบคุมภายใน",
          project: "-",
          carry: "-",
          activity: "-",
          process: "-",
          system: "-",
          itType: "-",
          score: 65,
          maxScore: 100,
          grade: "H",
          status: "ประเมินแล้ว",
          hasDoc: true
        },
        {
          id: "2565-002",
          index: "2",
          unit: "ศกช.",
          mission: "สำรวจเศรษฐกิจการเกษตร",
          work: "สำรวจผลผลิต",
          project: "-",
          carry: "-",
          activity: "-",
          process: "-",
          system: "-",
          itType: "-",
          score: 58,
          maxScore: 100,
          grade: "M",
          status: "ประเมินแล้ว",
          hasDoc: true
        },
        {
          id: "2565-003",
          index: "3",
          unit: "ศสส.",
          mission: "พัฒนาระบบสารสนเทศ",
          work: "-",
          project: "-",
          carry: "-",
          activity: "-",
          process: "-",
          system: "ระบบข้อมูลพื้นฐาน",
          itType: "IT",
          score: 45,
          maxScore: 100,
          grade: "M",
          status: "ประเมินแล้ว",
          hasDoc: false
        },
        {
          id: "2565-004",
          index: "4",
          unit: "กพร.",
          mission: "พัฒนาทรัพยากรบุคคล",
          work: "-",
          project: "-",
          carry: "-",
          activity: "พัฒนาบุคลากร",
          process: "-",
          system: "-",
          itType: "-",
          score: 38,
          maxScore: 100,
          grade: "L",
          status: "ประเมินแล้ว",
          hasDoc: false
        }
      ],
      unit: [
        {
          id: "2565-001",
          index: "1",
          unit: "สลก.",
          mission: "บริหารจัดการทั่วไป",
          work: "การควบคุมภายใน",
          project: "-",
          carry: "-",
          activity: "-",
          process: "-",
          system: "-",
          itType: "-",
          score: 65,
          maxScore: 100,
          grade: "M",
          status: "ประเมินแล้ว",
          hasDoc: true
        }
      ],
      work: [
        {
          id: "2565-001",
          index: "1",
          unit: "สลก.",
          mission: "บริหารจัดการทั่วไป",
          work: "การควบคุมภายใน",
          project: "-",
          carry: "-",
          activity: "-",
          process: "-",
          system: "-",
          itType: "-",
          score: 65,
          maxScore: 100,
          grade: "M",
          status: "ประเมินแล้ว",
          hasDoc: true
        }
      ],
      project: [
        {
          id: "2565-002",
          index: "2",
          unit: "กพร.",
          mission: "พัฒนาทรัพยากรบุคคล",
          work: "-",
          project: "โครงการพัฒนาบุคลากร",
          carry: "-",
          activity: "-",
          process: "-",
          system: "-",
          itType: "-",
          score: 52,
          maxScore: 100,
          grade: "M",
          status: "ประเมินแล้ว",
          hasDoc: false
        }
      ],
      carry: [],
      activity: [
        {
          id: "2565-004",
          index: "4",
          unit: "ศสส.",
          mission: "พัฒนาระบบสารสนเทศ",
          work: "-",
          project: "-",
          carry: "-",
          activity: "พัฒนาเว็บไซต์",
          process: "-",
          system: "-",
          itType: "IT",
          score: 75,
          maxScore: 100,
          grade: "H",
          status: "ประเมินแล้ว",
          hasDoc: true
        }
      ],
      process: [],
      it: [
        {
          id: "2565-004",
          index: "4",
          unit: "ศสส.",
          mission: "พัฒนาระบบสารสนเทศ",
          work: "-",
          project: "-",
          carry: "-",
          activity: "พัฒนาเว็บไซต์",
          process: "-",
          system: "-",
          itType: "IT",
          score: 75,
          maxScore: 100,
          grade: "H",
          status: "ประเมินแล้ว",
          hasDoc: true
        }
      ]
    },
    submissionInfo: {
      action: "historical_data",
      submissionTime: "2565-09-30T23:59:59.999Z",
      itemCount: 4
    }
  };
}
