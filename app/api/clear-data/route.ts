import { NextResponse } from "next/server";
import { db, refreshFormsMap } from "@/lib/mock-risk-db";

export async function POST() {
  try {
    console.log("🗑️ Starting data reset process...");

    // เคลียร์ข้อมูลการประเมิน (คะแนน, เกรด, สถานะ)
    const overridesBefore = Object.keys(db.overrides).length;
    db.overrides = {};
    console.log(`🗑️ Cleared ${overridesBefore} assessment overrides`);

    // เคลียร์ข้อมูลฟอร์มประเมิน
    const formsBefore = Object.keys(db.forms).length;
    db.forms = {};
    console.log(`🗑️ Cleared ${formsBefore} assessment forms`);

    // รีเฟรช formsMap
    refreshFormsMap();
    console.log("🔄 Refreshed forms map");

    console.log("✅ Data reset completed successfully");

    return NextResponse.json({
      success: true,
      message: "ข้อมูลถูกรีเซ็ตเรียบร้อยแล้ว",
      data: {
        clearedOverrides: overridesBefore,
        clearedForms: formsBefore,
      },
    });
  } catch (error) {
    console.error("Error in clear data API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to clear data",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}