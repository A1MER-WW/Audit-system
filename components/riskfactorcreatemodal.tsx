"use client";
import React from "react";
import { X } from "lucide-react";

export interface RiskFactorCreateModalProps {
  open: boolean;
  initialName?: string;
  onClose: () => void;
  onSave: (name: string) => void;
}

export default function RiskFactorCreateModal({
  open,
  initialName = "",
  onClose,
  onSave,
}: RiskFactorCreateModalProps) {
  const [name, setName] = React.useState(initialName);
  const disabled = name.trim().length === 0;

  React.useEffect(() => {
    if (open) setName(initialName);
  }, [open, initialName]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
          <div className="relative border-b border-slate-100 p-6">
            <h2 className="text-2xl font-semibold text-slate-900">เพิ่มปัจจัยเสี่ยง</h2>
            <button
              onClick={onClose}
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100"
              aria-label="close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-2 p-6">
            <label className="text-sm text-slate-600">ชื่อปัจจัยเสี่ยง</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="โปรดระบุชื่อปัจจัย"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-800 outline-none ring-indigo-200 focus:ring"
            />
          </div>

          <div className="flex items-center justify-end gap-4 p-6 pt-2">
            <button
              onClick={onClose}
              className="rounded-xl border-2 border-indigo-400 px-6 py-2.5 text-indigo-600 hover:bg-indigo-50"
            >
              ยกเลิก
            </button>
            <button
              onClick={() => name.trim() && onSave(name.trim())}
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