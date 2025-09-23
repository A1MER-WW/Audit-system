// app/api/audit-programs/[id]/route.ts
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getProgram, updateProgram, removeProgram, type ListResponse, type AuditProgram } from "@/lib/audit-programs-risk-evaluation/mock-audit-programs";

const noStore = { "Cache-Control": "no-store" };

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  try {
    const { id: idParam } = await params;
    const id = Number(idParam);
    if (Number.isNaN(id) || id <= 0) {
      return NextResponse.json({ message: "Invalid id" }, { status: 400, headers: noStore });
    }

    const found = getProgram(id);
    if (!found) {
      return NextResponse.json({ message: "Not found" }, { status: 404, headers: noStore });
    }

    const res: ListResponse = { message: "Fetched Audit Program successfully", data: [found] };
    return NextResponse.json(res, { status: 200, headers: noStore });
  } catch (e) {
    console.error("[GET /api/audit-programs/:id] error:", e);
    return NextResponse.json({ message: "Failed to fetch" }, { status: 500, headers: noStore });
  }
}

// PATCH - อัปเดตข้อมูลบางส่วน (รวมสถานะ)
export async function PATCH(req: Request, { params }: Ctx) {
  try {
    const { id: idParam } = await params;
    const id = Number(idParam);
    if (Number.isNaN(id) || id <= 0) {
      return NextResponse.json({ message: "Invalid id" }, { status: 400, headers: noStore });
    }

    const payload = await req.json() as Partial<Omit<AuditProgram, "id">>;
    
    // ตรวจสอบว่ามีข้อมูลที่จะอัปเดต
    if (Object.keys(payload).length === 0) {
      return NextResponse.json({ message: "No update data provided" }, { status: 400, headers: noStore });
    }

    const updated = updateProgram(id, payload);
    if (!updated) {
      return NextResponse.json({ message: "Not found" }, { status: 404, headers: noStore });
    }

    const res: ListResponse = { message: "Updated Audit Program successfully", data: [updated] };
    return NextResponse.json(res, { status: 200, headers: noStore });
  } catch (e) {
    console.error("[PATCH /api/audit-programs/:id] error:", e);
    return NextResponse.json({ message: "Failed to update" }, { status: 500, headers: noStore });
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  try {
    const { id: idParam } = await params;
    const id = Number(idParam);
    if (Number.isNaN(id) || id <= 0) {
      return NextResponse.json({ message: "Invalid id" }, { status: 400, headers: noStore });
    }

    const removed = removeProgram(id);
    if (!removed) {
      return NextResponse.json({ message: "Not found" }, { status: 404, headers: noStore });
    }

    const res: ListResponse = { message: "Deleted Audit Program successfully", data: [removed] };
    return NextResponse.json(res, { status: 200, headers: noStore });
  } catch (e) {
    console.error("[DELETE /api/audit-programs/:id] error:", e);
    return NextResponse.json({ message: "Failed to delete" }, { status: 500, headers: noStore });
  }
}