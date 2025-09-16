// app/api/audit-programs/route.ts
export const dynamic = "force-dynamic"; // กันแคชใน dev/edge
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import {
  addProgram,
  listPrograms,
  type AuditProgram,
  type ListResponse,
} from "@/lib/audit-programs-risk-evaluation/mock-audit-programs";

const noStore = { "Cache-Control": "no-store" };

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const fyParam = searchParams.get("fiscalYear");
    const fy = fyParam !== null ? Number(fyParam) : undefined;
    const data = listPrograms(
      fy !== undefined && !Number.isNaN(fy) ? fy : undefined
    );
    const res: ListResponse = {
      message: "Fetched Audit Program successfully",
      data,
    };
    return NextResponse.json(res, { status: 200, headers: noStore });
  } catch (e) {
    console.error("[GET /api/audit-programs] error:", e);
    return NextResponse.json(
      { message: "Failed to fetch" },
      { status: 500, headers: noStore }
    );
  }
}

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as Omit<AuditProgram, "id">;

    // เช็ค key หลักแบบเบา ๆ (ไม่เปลี่ยนโครงสร้าง)
    if (
      !payload?.auditTopics ||
      typeof payload.fiscalYear !== "number" ||
      typeof payload.status !== "string" ||
      typeof payload.version !== "number"
    ) {
      return NextResponse.json(
        { message: "Invalid payload structure" },
        { status: 400, headers: noStore }
      );
    }

    const created = addProgram(payload);
    const res: ListResponse = {
      message: "Created Audit Program successfully",
      data: [created],
    };
    return NextResponse.json(res, { status: 201, headers: noStore });
  } catch (e) {
    console.error("[POST /api/audit-programs] error:", e);
    return NextResponse.json(
      { message: "Failed to create" },
      { status: 500, headers: noStore }
    );
  }
}

// (ออปชัน) กัน method อื่น
export async function PUT() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405, headers: noStore });
}
export async function PATCH() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405, headers: noStore });
}
export async function DELETE() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405, headers: noStore });
}
