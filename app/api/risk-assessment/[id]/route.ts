import { NextResponse } from "next/server";
import { findRowById } from "@/lib/risk-dataset";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const row = findRowById(params.id);
  if (!row) return NextResponse.json({ message: "Not found" }, { status: 404 });

  const topic =
    row.work !== "-" ? row.work :
    row.project !== "-" ? row.project :
    row.carry !== "-" ? row.carry :
    row.activity !== "-" ? row.activity :
    row.process !== "-" ? row.process :
    row.system !== "-" ? row.system : "-";

  const meta = {
    id: row.id,
    index: row.index,
    unit: row.unit,
    category: row.mission !== "-" ? "ภารกิจ" : "งาน",
    topic,
    status: row.status,
  };
  return NextResponse.json({ message: "OK", data: meta }, { status: 200 });
}
