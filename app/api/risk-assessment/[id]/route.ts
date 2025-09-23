import { NextResponse } from "next/server";
import { buildAllRowsRaw, findRowById } from "@/lib/risk-dataset"; // ⬅ ใช้ก้อนรวมที่มี audit_category_name
import type { Row } from "@/types/risk";

// เผื่อกรณีไม่มี audit_category_name (fallback)
function detectCategory(row: Row): string {
  if (row.work !== "-") return "งาน";
  if (row.project !== "-") return "โครงการ";
  if (row.carry !== "-") return "โครงการกันเงินเหลื่อมปี";
  if (row.activity !== "-") return "กิจกรรม";
  if (row.process !== "-") return "กระบวนงาน";

  // ✅ แก้ตรงนี้: ไม่ต้องเช็ค itType !== "" แล้ว
  if (row.system !== "-" || row.itType === "IT" || row.itType === "Non-IT") {
    return "IT และ Non-IT";
  }

  if (row.mission !== "-") return "หน่วยงาน";
  return "-";
}

function deriveTopic(row: Row): string {
  return row.work !== "-"
    ? row.work
    : row.project !== "-"
    ? row.project
    : row.carry !== "-"
    ? row.carry
    : row.activity !== "-"
    ? row.activity
    : row.process !== "-"
    ? row.process
    : row.system !== "-"
    ? row.system
    : row.mission !== "-"
    ? row.mission
    : "-";
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const row = findRowById(id);
  if (!row) return NextResponse.json({ message: "Not found" }, { status: 404 });

  // ดึงแถวจาก “ก้อนเดียว” เพื่ออ่าน audit_category_name ให้ตรงหมวดจริง
  const all = buildAllRowsRaw();
  const withCat = all.find((r) => r.id === row.id) as
    | (Row & { audit_category_name?: string })
    | undefined;

  const meta = {
    id: row.id,
    index: row.index,
    unit: row.unit,
    category: withCat?.audit_category_name ?? detectCategory(row), // ✅ ใช้หมวดจริง
    topic: deriveTopic(row),
    status: row.status,
  };

  return NextResponse.json({ message: "OK", data: meta }, { status: 200 });
}
