// app/api/risk-assessment/[id]/copy/route.ts
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";

const noStore = { "Cache-Control": "no-store" };

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_req: Request, { params }: Ctx) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  
  if (!id || Number.isNaN(id)) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400, headers: noStore });
  }

  // TODO: Implement copy functionality
  return NextResponse.json({ 
    message: "Copy functionality not implemented yet",
    originalId: id 
  }, { 
    status: 501, 
    headers: noStore 
  });
}
