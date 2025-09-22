import { NextResponse } from "next/server";
import { db } from "@/lib/mock-risk-db";

export async function POST(request: Request) {
  try {
    const { updates } = await request.json();

    if (!Array.isArray(updates)) {
      return NextResponse.json(
        { success: false, error: "Invalid updates format" },
        { status: 400 }
      );
    }

    // อัพเดตข้อมูลใน mock database
    const results = [];
    for (const update of updates) {
      const { id, score, grade } = update;
      
      // อัพเดตใน db.overrides
      db.overrides[id] = {
        score: score,
        grade: grade as "E" | "H" | "M" | "L" | "N" | "-",
        status: "ประเมินแล้ว"
      };

      results.push({ id, score, grade, status: "ประเมินแล้ว" });
      console.log(`✅ Auto assessment updated: ${id} = ${score} (${grade})`);
    }

    return NextResponse.json({
      success: true,
      data: results,
      message: `Auto assessment completed for ${updates.length} items`,
    });
  } catch (error) {
    console.error("Error in auto assessment API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process auto assessment",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}