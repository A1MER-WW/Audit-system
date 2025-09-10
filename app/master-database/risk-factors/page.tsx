"use client";
import React from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, ChevronLeft } from "lucide-react";

import type { RiskFactorRow } from "@/types/risk-factor";
import RiskFactorCreateModal from "@/components/riskfactorcreatemodel";
import RiskFactorEditModal from "@/components/riskfactoreditmodel";
import { nowThaiBuddhist } from "@/lib/datetime";

const initialRows: RiskFactorRow[] = [
  { id: 1, name: "ด้านกลยุทธ์", creator: "ปุณยวัฒน์ เออเอ", createdAt: "20/06/2568 14:00 น.", updatedBy: "ปุณยวัฒน์ เออเอ", updatedAt: "20/06/2568 14:00 น." },
  { id: 2, name: "ด้านการเงิน", creator: "ปุณยวัฒน์ เออเอ", createdAt: "20/06/2568 14:00 น.", updatedBy: "ปุณยวัฒน์ เออเอ", updatedAt: "20/06/2568 14:00 น." },
  { id: 3, name: "ด้านการดำเนินงาน", creator: "เศรษฐา จันทพักษร", createdAt: "22/06/2568 11:00 น.", updatedBy: "เศรษฐา จันทพักษร", updatedAt: "22/06/2568 11:00 น." },
  { id: 4, name: "ด้านภาพลักษณ์/ชื่อเสียง", creator: "อิสหาล วงศ์ทอง", createdAt: "23/06/2568 10:45 น.", updatedBy: "อิสหาล วงศ์ทอง", updatedAt: "23/06/2568 10:45 น." },
  { id: 5, name: "ด้านเทคโนโลยีสารสนเทศ", creator: "นฐกร คุรุยศ", createdAt: "24/06/2568 15:30 น.", updatedBy: "นฐกร คุรุยศ", updatedAt: "24/06/2568 15:30 น." },
  { id: 6, name: "ด้านการกำกับดูแล", creator: "เบญจพร รัตนาวงษ", createdAt: "25/06/2568 13:15 น.", updatedBy: "เบญจพร รัตนาวงษ", updatedAt: "25/06/2568 13:15 น." },
];

export default function RiskFactorsPage() {
  const [rows, setRows] = React.useState<RiskFactorRow[]>(initialRows);
  const [openCreate, setOpenCreate] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [selected, setSelected] = React.useState<RiskFactorRow | null>(null);

  const nextId = React.useMemo(
    () => (rows.length ? Math.max(...rows.map((r) => r.id)) + 1 : 1),
    [rows]
  );

  const currentUser = "คุณ (ปัจจุบัน)";

  const handleCreate = (name: string) => {
    const ts = nowThaiBuddhist();
    setRows((prev) => [
      { id: nextId, name, creator: currentUser, createdAt: ts, updatedBy: currentUser, updatedAt: ts },
      ...prev,
    ]);
    setOpenCreate(false);
  };

  const handleEdit = (row: RiskFactorRow) => {
    setSelected(row);
    setOpenEdit(true);
  };

  const handleEditSave = (name: string) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === selected!.id
          ? { ...r, name, updatedBy: currentUser, updatedAt: nowThaiBuddhist() }
          : r
      )
    );
    setOpenEdit(false);
    setSelected(null);
  };

  const handleDelete = (id: number) => {
    if (!confirm("ยืนยันการลบรายการนี้?")) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="p-6 md:p-8">
      {/* Breadcrumbs + Back */}
      <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
        <Link href="#" className="inline-flex items-center gap-1 hover:text-slate-700">
          <ChevronLeft className="h-4 w-4" /> กลับ
        </Link>
        <span className="mx-1">/</span>
        <Link href="#" className="hover:text-slate-700">ฐานข้อมูลหลัก</Link>
        <span className="mx-1">/</span>
        <Link href="#" className="hover:text-slate-700">ประเมินผลแผนการตรวจสอบประจำปี</Link>
        <span className="mx-1">/</span>
        <span className="text-slate-700">รายการปัจจัยเสี่ยง</span>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Header */}
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-lg font-semibold text-slate-800">รายการปัจจัยเสี่ยง</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpenCreate(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-white shadow hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" /> เพิ่มปัจจัยเสี่ยง
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead>
              <tr className="bg-slate-50/70 text-left text-sm text-slate-600">
                <th className="w-20 px-4 py-3 font-medium">ลำดับ</th>
                <th className="px-4 py-3 font-medium">ชื่อปัจจัยเสี่ยง</th>
                <th className="px-4 py-3 font-medium">ผู้สร้าง</th>
                <th className="px-4 py-3 font-medium">แก้ไขล่าสุด</th>
                <th className="w-28 px-4 py-3 text-right font-medium">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {rows.map((r, idx) => (
                <tr key={r.id} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3 text-slate-700">{idx + 1}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleEdit(r)} className="text-left text-indigo-600 hover:underline">
                      {r.name}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{r.creator}</td>
                  <td className="px-4 py-3 text-slate-700">{r.updatedAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        title="แก้ไข"
                        onClick={() => handleEdit(r)}
                        className="rounded-full border border-slate-200 p-1.5 hover:bg-slate-50"
                      >
                        <Pencil className="h-4 w-4 text-slate-700" />
                      </button>
                      <button
                        title="ลบ"
                        onClick={() => handleDelete(r.id)}
                        className="rounded-full border border-slate-200 p-1.5 hover:bg-slate-50"
                      >
                        <Trash2 className="h-4 w-4 text-slate-700" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-4 p-4 text-sm text-slate-500">
          <span>แสดง {rows.length} รายการ</span>
          <div className="flex items-center gap-2">
            <button className="rounded-lg border px-3 py-1.5 hover:bg-slate-50">ก่อนหน้า</button>
            <button className="rounded-lg border px-3 py-1.5 hover:bg-slate-50">ถัดไป</button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <RiskFactorCreateModal open={openCreate} onClose={() => setOpenCreate(false)} onSave={handleCreate} />
      <RiskFactorEditModal open={openEdit} record={selected} onClose={() => setOpenEdit(false)} onSave={handleEditSave} />
    </div>
  );
}