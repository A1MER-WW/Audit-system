import { NextRequest, NextResponse } from "next/server";

// Import ข้อมูลจาก inspector API
import { GET as InspectorGET } from "../risk-assessment-results/route";

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

    // สำหรับ reorder: จัดเรียงข้อมูลตามลำดับใหม่
    let orderedData = body.data;
    if (body.action === "submit_reorder" && body.newOrder && Array.isArray(body.data)) {
      console.log("🔄 Reordering data according to new order:", {
        originalOrder: body.originalOrder,
        newOrder: body.newOrder,
        changedItem: body.changedItem,
        reason: body.reason
      });
      
      const dataMap = new Map(body.data.map((item: { id: string }) => [item.id, item]));
      orderedData = body.newOrder.map((id: string) => dataMap.get(id)).filter(Boolean);
      
      // เก็บ index เดิมไว้ เพื่อไม่ให้เกิดปัญหาในการ match ข้อมูล
      // orderedData จะถูกจัดลำดับตาม newOrder แล้ว
      // ไม่ต้องอัปเดต index เพราะจะทำให้เกิดปัญหาในการ match กับข้อมูลเดิม
      
      console.log("✅ Data reordered successfully:", {
        originalCount: body.data.length,
        reorderedCount: orderedData.length,
        newOrder: body.newOrder,
        orderedDataIds: orderedData.map((item: { id: string }) => item.id)
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
      // แปลงข้อมูลให้อยู่ในรูปแบบที่ dashboard ต้องการ
      rowsByTab: orderedData ? { [body.tab]: orderedData } : {}
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
  return {
    fiscalYears: [2567, 2566, 2565],
    pageTitle: "ภาพรวมผลการประเมิน ปี 2567",
    subtitle: "การประเมินความเสี่ยงและการจัดลำดับความเสี่ยง ปีงบประมาณ 2567",
    assessmentName: "ผลการประเมินความเสี่ยง แผนการตรวจสอบประจำปี 2567",
    statusLine: {
      label: "สถานะ",
      value: "ข้อมูลปีที่แล้ว - เพื่อการเปรียบเทียบ"
    },
    rowsByTab: {
      all: [
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
          hasDoc: false
        },
        {
          id: "2567-004",
          index: "4",
          unit: "กพร.",
          mission: "พัฒนาทรัพยากรบุคคล",
          work: "-",
          project: "พัฒนาระบบฐานข้อมูล",
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
          id: "2567-005",
          index: "5",
          unit: "กพร.",
          mission: "พัฒนาทรัพยากรบุคคล",
          work: "-",
          project: "-",
          carry: "ปรับปรุงระบบเงินเดือน",
          activity: "-",
          process: "-",
          system: "-",
          itType: "IT",
          score: 38,
          maxScore: 100,
          grade: "M",
          status: "ประเมินแล้ว",
          hasDoc: false
        },
        {
          id: "2567-006",
          index: "6",
          unit: "ศปผ.",
          mission: "วางแผนและประเมินโครงการ",
          work: "-",
          project: "-",
          carry: "-",
          activity: "ประเมินโครงการ",
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
          index: "7",
          unit: "กศป.",
          mission: "พัฒนาศักยภาพบุคลากร",
          work: "-",
          project: "-",
          carry: "-",
          activity: "อบรมบุคลากร",
          process: "-",
          system: "-",
          itType: "-",
          score: 35,
          maxScore: 100,
          grade: "L",
          status: "ประเมินแล้ว",
          hasDoc: false
        },
        {
          id: "2567-008",
          index: "8",
          unit: "สลก.",
          mission: "บริหารจัดการทั่วไป",
          work: "-",
          project: "-",
          carry: "-",
          activity: "-",
          process: "จัดซื้อจัดจ้าง",
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
          index: "9",
          unit: "ศสส.",
          mission: "พัฒนาระบบสารสนเทศ",
          work: "-",
          project: "-",
          carry: "-",
          activity: "-",
          process: "พัฒนาระบบฐานข้อมูล",
          system: "-",
          itType: "IT",
          score: 75,
          maxScore: 100,
          grade: "H",
          status: "ประเมินแล้ว",
          hasDoc: true
        },
        {
          id: "2567-010",
          index: "10",
          unit: "ศสส.",
          mission: "พัฒนาระบบสารสนเทศ",
          work: "-",
          project: "-",
          carry: "-",
          activity: "-",
          process: "-",
          system: "ระบบคลังข้อมูลกลาง",
          itType: "IT",
          score: 82,
          maxScore: 100,
          grade: "E",
          status: "ประเมินแล้ว",
          hasDoc: true
        },
        {
          id: "2567-011",
          index: "11",
          unit: "สลก.",
          mission: "บริหารจัดการทั่วไป",
          work: "-",
          project: "-",
          carry: "-",
          activity: "-",
          process: "-",
          system: "ระบบสารบรรณ",
          itType: "IT",
          score: 42,
          maxScore: 100,
          grade: "M",
          status: "ประเมินแล้ว",
          hasDoc: false
        },
        {
          id: "2567-012",
          index: "12",
          unit: "กศป.",
          mission: "พัฒนาศักยภาพบุคลากร",
          work: "-",
          project: "-",
          carry: "-",
          activity: "-",
          process: "-",
          system: "ระบบบริหารงานบุคคล",
          itType: "Non-IT",
          score: 28,
          maxScore: 100,
          grade: "L",
          status: "ประเมินแล้ว",
          hasDoc: false
        },
        {
          id: "2567-013",
          index: "13",
          unit: "ศปผ.",
          mission: "วางแผนและประเมินโครงการ",
          work: "-",
          project: "-",
          carry: "-",
          activity: "-",
          process: "-",
          system: "ระบบติดตามโครงการ",
          itType: "IT",
          score: 65,
          maxScore: 100,
          grade: "H",
          status: "ประเมินแล้ว",
          hasDoc: true
        },
        {
          id: "2567-014",
          index: "14",
          unit: "ศกช.",
          mission: "สำรวจเศรษฐกิจการเกษตร",
          work: "-",
          project: "-",
          carry: "-",
          activity: "-",
          process: "-",
          system: "ระบบจัดเก็บข้อมูลสำรวจ",
          itType: "IT",
          score: 55,
          maxScore: 100,
          grade: "M",
          status: "ประเมินแล้ว",
          hasDoc: true
        },
        {
          id: "2567-015",
          index: "15",
          unit: "ศสท.1",
          mission: "สำรวจท้องถิ่น",
          work: "-",
          project: "-",
          carry: "-",
          activity: "-",
          process: "-",
          system: "ระบบรายงานผลสำรวจ",
          itType: "Non-IT",
          score: 32,
          maxScore: 100,
          grade: "L",
          status: "ประเมินแล้ว",
          hasDoc: false
        }
      ],
      unit: [
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
          hasDoc: false
        }
      ],
      work: [
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
          hasDoc: false
        }
      ],
      project: [
        {
          id: "2567-004",
          index: "4",
          unit: "กพร.",
          mission: "พัฒนาทรัพยากรบุคคล",
          work: "-",
          project: "พัฒนาระบบฐานข้อมูล",
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
        }
      ],
      carry: [
        {
          id: "2567-005",
          index: "5",
          unit: "กพร.",
          mission: "พัฒนาทรัพยากรบุคคล",
          work: "-",
          project: "-",
          carry: "ปรับปรุงระบบเงินเดือน",
          activity: "-",
          process: "-",
          system: "-",
          itType: "IT",
          score: 38,
          maxScore: 100,
          grade: "M",
          status: "ประเมินแล้ว",
          hasDoc: false
        }
      ],
      activity: [
        {
          id: "2567-006",
          index: "6",
          unit: "ศปผ.",
          mission: "วางแผนและประเมินโครงการ",
          work: "-",
          project: "-",
          carry: "-",
          activity: "ประเมินโครงการ",
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
          index: "7",
          unit: "กศป.",
          mission: "พัฒนาศักยภาพบุคลากร",
          work: "-",
          project: "-",
          carry: "-",
          activity: "อบรมบุคลากร",
          process: "-",
          system: "-",
          itType: "-",
          score: 35,
          maxScore: 100,
          grade: "L",
          status: "ประเมินแล้ว",
          hasDoc: false
        }
      ],
      process: [
        {
          id: "2567-008",
          index: "8",
          unit: "สลก.",
          mission: "บริหารจัดการทั่วไป",
          work: "-",
          project: "-",
          carry: "-",
          activity: "-",
          process: "จัดซื้อจัดจ้าง",
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
          index: "9",
          unit: "ศสส.",
          mission: "พัฒนาระบบสารสนเทศ",
          work: "-",
          project: "-",
          carry: "-",
          activity: "-",
          process: "พัฒนาระบบฐานข้อมูล",
          system: "-",
          itType: "IT",
          score: 75,
          maxScore: 100,
          grade: "H",
          status: "ประเมินแล้ว",
          hasDoc: true
        }
      ],
      it: [
        {
          id: "2567-004",
          index: "4",
          unit: "กพร.",
          mission: "พัฒนาทรัพยากรบุคคล",
          work: "-",
          project: "พัฒนาระบบฐานข้อมูล",
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
          id: "2567-005",
          index: "5",
          unit: "กพร.",
          mission: "พัฒนาทรัพยากรบุคคล",
          work: "-",
          project: "-",
          carry: "ปรับปรุงระบบเงินเดือน",
          activity: "-",
          process: "-",
          system: "-",
          itType: "IT",
          score: 38,
          maxScore: 100,
          grade: "M",
          status: "ประเมินแล้ว",
          hasDoc: false
        },
        {
          id: "2567-009",
          index: "9",
          unit: "ศสส.",
          mission: "พัฒนาระบบสารสนเทศ",
          work: "-",
          project: "-",
          carry: "-",
          activity: "-",
          process: "พัฒนาระบบฐานข้อมูล",
          system: "-",
          itType: "IT",
          score: 75,
          maxScore: 100,
          grade: "H",
          status: "ประเมินแล้ว",
          hasDoc: true
        },
        {
          id: "2567-010",
          index: "10",
          unit: "ศสส.",
          mission: "พัฒนาระบบสารสนเทศ",
          work: "-",
          project: "-",
          carry: "-",
          activity: "-",
          process: "-",
          system: "ระบบคลังข้อมูลกลาง",
          itType: "IT",
          score: 82,
          maxScore: 100,
          grade: "E",
          status: "ประเมินแล้ว",
          hasDoc: true
        },
        {
          id: "2567-011",
          index: "11",
          unit: "สลก.",
          mission: "บริหารจัดการทั่วไป",
          work: "-",
          project: "-",
          carry: "-",
          activity: "-",
          process: "-",
          system: "ระบบสารบรรณ",
          itType: "IT",
          score: 42,
          maxScore: 100,
          grade: "M",
          status: "ประเมินแล้ว",
          hasDoc: false
        },
        {
          id: "2567-008",
          index: "8",
          unit: "สลก.",
          mission: "บริหารจัดการทั่วไป",
          work: "-",
          project: "-",
          carry: "-",
          activity: "-",
          process: "จัดซื้อจัดจ้าง",
          system: "-",
          itType: "Non-IT",
          score: 48,
          maxScore: 100,
          grade: "M",
          status: "ประเมินแล้ว",
          hasDoc: true
        },
        {
          id: "2567-012",
          index: "12",
          unit: "กศป.",
          mission: "พัฒนาศักยภาพบุคลากร",
          work: "-",
          project: "-",
          carry: "-",
          activity: "-",
          process: "-",
          system: "ระบบบริหารงานบุคคล",
          itType: "Non-IT",
          score: 28,
          maxScore: 100,
          grade: "L",
          status: "ประเมินแล้ว",
          hasDoc: false
        },
        {
          id: "2567-013",
          index: "13",
          unit: "ศปผ.",
          mission: "วางแผนและประเมินโครงการ",
          work: "-",
          project: "-",
          carry: "-",
          activity: "-",
          process: "-",
          system: "ระบบติดตามโครงการ",
          itType: "IT",
          score: 65,
          maxScore: 100,
          grade: "H",
          status: "ประเมินแล้ว",
          hasDoc: true
        },
        {
          id: "2567-014",
          index: "14",
          unit: "ศกช.",
          mission: "สำรวจเศรษฐกิจการเกษตร",
          work: "-",
          project: "-",
          carry: "-",
          activity: "-",
          process: "-",
          system: "ระบบจัดเก็บข้อมูลสำรวจ",
          itType: "IT",
          score: 55,
          maxScore: 100,
          grade: "M",
          status: "ประเมินแล้ว",
          hasDoc: true
        },
        {
          id: "2567-015",
          index: "15",
          unit: "ศสท.1",
          mission: "สำรวจท้องถิ่น",
          work: "-",
          project: "-",
          carry: "-",
          activity: "-",
          process: "-",
          system: "ระบบรายงานผลสำรวจ",
          itType: "Non-IT",
          score: 32,
          maxScore: 100,
          grade: "L",
          status: "ประเมินแล้ว",
          hasDoc: false
        }
      ]
    },
    submissionInfo: {
      action: "historical_data",
      submissionTime: "2567-09-30T23:59:59.999Z",
      itemCount: 15
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
