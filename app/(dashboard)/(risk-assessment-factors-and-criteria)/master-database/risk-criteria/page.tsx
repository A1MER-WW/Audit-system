"use client";

import React, { useMemo, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { nowThaiBuddhist } from "@/lib/datetime";
import type { RiskCriterion } from "@/types/risk-criteria";
import CreateModal from "@/components/createmodal";
import EditModal from "@/components/editmodal";

const initialRows: RiskCriterion[] = [
  { id: 1, name: "น้อยที่สุด", score: 1, description: "", creator: "ปุณยวัฒน์ เออเอ", createdAt: "20/06/2568 13:00 น.", updatedAt: "20/06/2568 14:00 น.", updatedBy: "ปุณยวัฒน์ เออเอ" },
  { id: 2, name: "น้อย",     score: 2, description: "", creator: "ปุณยวัฒน์ เออเอ", createdAt: "20/06/2568 13:05 น.", updatedAt: "20/06/2568 14:00 น.", updatedBy: "ปุณยวัฒน์ เออเอ" },
  { id: 3, name: "ปานกลาง",  score: 3, description: "", creator: "ปุณยวัฒน์ เออเอ", createdAt: "20/06/2568 13:10 น.", updatedAt: "20/06/2568 14:00 น.", updatedBy: "ปุณยวัฒน์ เออเอ" },
  { id: 4, name: "สูง",      score: 4, description: "", creator: "ปุณยวัฒน์ เออเอ", createdAt: "20/06/2568 13:15 น.", updatedAt: "20/06/2568 14:00 น.", updatedBy: "ปุณยวัฒน์ เออเอ" },
  { id: 5, name: "สูงมาก",    score: 5, description: "", creator: "ปุณยวัฒน์ เออเอ", createdAt: "20/06/2568 13:20 น.", updatedAt: "20/06/2568 14:00 น.", updatedBy: "ปุณยวัฒน์ เออเอ" },
];

export default function RiskCriteriaPage() {
  const [rows, setRows] = useState<RiskCriterion[]>(initialRows);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState<RiskCriterion | null>(null);

  const nextId = useMemo(
    () => (rows.length ? Math.max(...rows.map((r) => r.id)) + 1 : 1),
    [rows]
  );

  const handleCreate = (name: string, score: number, description: string) => {
    const ts = nowThaiBuddhist();
    setRows((prev) => [
      {
        id: nextId,
        name,
        score,
        description,
        creator: "คุณ (ปัจจุบัน)",
        createdAt: ts,
        updatedAt: ts,
        updatedBy: "คุณ (ปัจจุบัน)",
      },
      ...prev,
    ]);
    setOpenCreate(false);
  };

  const handleEditOpen = (row: RiskCriterion) => {
    setSelected(row);
    setOpenEdit(true);
  };

  const handleEditSave = (name: string, score: number, description: string) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === selected?.id
          ? { ...r, name, score, description, updatedAt: nowThaiBuddhist(), updatedBy: "คุณ (ปัจจุบัน)" }
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
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-lg font-semibold text-slate-800">รายการเกณฑ์ที่พิจารณาความเสี่ยง</h1>
          <button
            onClick={() => setOpenCreate(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-white shadow hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" /> เพิ่มเกณฑ์พิจารณาความเสี่ยง
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead>
              <tr className="bg-slate-50/70 text-left text-sm text-slate-600">
                <th className="w-20 px-4 py-3 font-medium">ลำดับ</th>
                <th className="px-4 py-3 font-medium">ชื่อเกณฑ์</th>
                <th className="px-4 py-3 font-medium">คะแนนความเสี่ยง</th>
                <th className="px-4 py-3 font-medium">ผู้สร้าง</th>
                <th className="px-4 py-3 font-medium">แก้ไขล่าสุด</th>
                <th className="w-28 px-4 py-3 font-medium text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {rows.map((r, idx) => (
                <tr key={r.id} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3 text-slate-700">{idx + 1}</td>
                  <td className="px-4 py-3 text-slate-700">{r.name}</td>
                  <td className="px-4 py-3 text-slate-700">{r.score}</td>
                  <td className="px-4 py-3 text-slate-700">{r.creator}</td>
                  <td className="px-4 py-3 text-slate-700">{r.updatedAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEditOpen(r)}
                        title="แก้ไข"
                        className="rounded-full border border-slate-200 p-1.5 hover:bg-slate-50"
                      >
                        <Pencil className="h-4 w-4 text-slate-700" />
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        title="ลบ"
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

        <div className="flex items-center justify-between gap-4 p-4 text-sm text-slate-500">
          <span>แสดง {rows.length} รายการ</span>
        </div>
      </div>

      <CreateModal open={openCreate} onClose={() => setOpenCreate(false)} onSave={handleCreate} />
      <EditModal open={openEdit} record={selected} onClose={() => setOpenEdit(false)} onSave={handleEditSave} />
    </div>
  );
}