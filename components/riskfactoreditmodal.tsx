"use client";
import React from "react";
import { X } from "lucide-react";
import type { RiskFactorRow } from "@/types/risk-factor";

export interface RiskFactorEditModalProps {
  open: boolean;
  record: RiskFactorRow | null;
  onClose: () => void;
  onSave: (name: string) => void;
}

export default function RiskFactorEditModal({
  open,
  record,
  onClose,
  onSave,
}: RiskFactorEditModalProps) {
  const [name, setName] = React.useState(record?.name ?? "");

  React.useEffect(() => setName(record?.name ?? ""), [record, open]);

  if (!open || !record) return null;

  const disabled = name.trim().length === 0 || name.trim() === record.name;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl">
          <div className="relative border-b border-slate-100 p-6">
            <h2 className="text-2xl font-semibold text-slate-900">แก้ไขปัจจัยเสี่ยง</h2>
            <button
              onClick={onClose}
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100"
              aria-label="close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid gap-6 p-6">
            <div className="space-y-2">
              <label className="text-sm text-slate-600">ชื่อปัจจัยเสี่ยง</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-800 outline-none ring-indigo-200 focus:ring"
              />
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-semibold text-slate-900">รายละเอียด</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="ผู้สร้าง" value={record.creator} />
                <Field label="สร้างเมื่อ" value={record.createdAt} />
                <Field label="ผู้แก้ไข" value={record.updatedBy} />
                <Field label="อัปเดตล่าสุดเมื่อ" value={record.updatedAt} />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 p-6 pt-2">
            <button
              onClick={onClose}
              className="rounded-xl border-2 border-indigo-400 px-6 py-2.5 text-indigo-600 hover:bg-indigo-50"
            >
              ยกเลิก
            </button>
            <button
              onClick={() => !disabled && onSave(name.trim())}
              disabled={disabled}
              className="rounded-xl bg-indigo-600 px-6 py-2.5 text-white shadow disabled:cursor-not-allowed disabled:opacity-60 hover:bg-indigo-700"
            >
              บันทึก
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-slate-600">{label}</label>
      <input
        value={value ?? ""}
        readOnly
        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-700"
      />
    </div>
  );
}