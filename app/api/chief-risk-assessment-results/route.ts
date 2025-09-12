import { NextRequest, NextResponse } from "next/server";

// Import ข้อมูลจาก inspector API
import { GET as InspectorGET } from "../risk-assessment-results/route";

// เก็บข้อมูลที่ส่งมาจาก Inspector (ในระบบจริงจะเก็บในฐานข้อมูล)
let submittedData: any = null;
let submissionStatus = "รอหัวหน้าหน่วยตรวจสอบพิจารณา";

export async function GET(request: NextRequest) {
  try {
    // ถ้ามีข้อมูลที่ส่งมาจาก Inspector แล้ว ให้ใช้ข้อมูลนั้น
    if (submittedData) {
      console.log("📋 Using submitted data from Inspector", {
        action: submittedData.action,
        dataCount: submittedData.data?.length || 0,
        hasReorder: !!submittedData.newOrder
      });

      const responseData = {
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
      
      const dataMap = new Map(body.data.map((item: any) => [item.id, item]));
      orderedData = body.newOrder.map((id: string) => dataMap.get(id)).filter(Boolean);
      
      // เก็บ index เดิมไว้ เพื่อไม่ให้เกิดปัญหาในการ match ข้อมูล
      // orderedData จะถูกจัดลำดับตาม newOrder แล้ว
      // ไม่ต้องอัปเดต index เพราะจะทำให้เกิดปัญหาในการ match กับข้อมูลเดิม
      
      console.log("✅ Data reordered successfully:", {
        originalCount: body.data.length,
        reorderedCount: orderedData.length,
        newOrder: body.newOrder,
        orderedDataIds: orderedData.map((item: any) => item.id)
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
