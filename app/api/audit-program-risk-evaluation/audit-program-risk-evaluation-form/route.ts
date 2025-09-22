// app/api/audit-program-risk-evaluation/audit-program-risk-evaluation-form/route.ts
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";

const noStore = { "Cache-Control": "no-store" };

export async function GET() {
  return NextResponse.json({ message: "Audit Program Risk Evaluation Form API" }, { status: 200, headers: noStore });
}
