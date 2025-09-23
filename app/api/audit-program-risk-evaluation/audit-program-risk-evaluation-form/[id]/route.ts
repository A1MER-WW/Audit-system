// app/api/audit-programs-risk-evaluations/[id]/route.ts
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { DetailResponse, getRiskEvaluationById } from "@/lib/audit-programs-risk-evaluation/mock-audit-programs-risk-evalouation-form";
import { NextResponse } from "next/server";

const noStore = { "Cache-Control": "no-store" };

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!id || Number.isNaN(id)) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400, headers: noStore });
  }

  const data = getRiskEvaluationById(id);
  if (!data) {
    return NextResponse.json({ message: "Not found" }, { status: 404, headers: noStore });
  }

  const res: DetailResponse = {
    message: "Fetched Audit Program by id successfully",
    data,
  };
  return NextResponse.json(res, { status: 200, headers: noStore });
}
