"use client";

import React from "react";
import type { ManageChoice } from "@/types/riskassessments";

type Props = {
  open: boolean;
  value: ManageChoice;
  onChange: (v: ManageChoice) => void;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ManageRiskAssessmentsModal({
  open,
  value,
  onChange,
  onClose,
  onConfirm,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            จัดการปัจจัยและเกณฑ์พิจารณาความเสี่ยง
          </h2>
          <button
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
            onClick={onClose}
            aria-label="close"
          >
            ✕
          </button>
        </div>

        <p className="mt-1 text-sm text-gray-500">
          ท่านต้องการคัดลอกปัจจัยและเกณฑ์พิจารณาความเสี่ยงของปีงบก่อนหน้าหรือไม่
        </p>

        <div className="mt-5 space-y-3">
          <label className="flex items-center gap-3 text-gray-800">
            <input
              type="radio"
              className="h-5 w-5 accent-indigo-600"
              checked={value === "want"}
              onChange={() => onChange("want")}
            />
            ต้องการ
          </label>
          <label className="flex items-center gap-3 text-gray-800">
            <input
              type="radio"
              className="h-5 w-5 accent-indigo-600"
              checked={value === "not_want"}
              onChange={() => onChange("not_want")}
            />
            ไม่ต้องการ
          </label>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            className="rounded-xl border border-indigo-200 px-5 py-2 text-indigo-700 hover:bg-indigo-50"
            onClick={onClose}
          >
            ยกเลิก
          </button>
          <button
            className="rounded-xl bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700"
            onClick={onConfirm}
          >
            ยืนยัน
          </button>
        </div>
      </div>
    </div>
  );
}