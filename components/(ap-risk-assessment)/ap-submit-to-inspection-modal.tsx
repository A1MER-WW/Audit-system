"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import type { ManageChoice } from "@/types/riskassessments";

type Props = {
  open: boolean;
  value: ManageChoice;
  onChange: (v: ManageChoice) => void;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ApSubmitToInspectionModal({
  open,
  value,
  onChange,
  onClose,
  onConfirm,
}: Props) {
  if (!open) return null;

  // ปิดด้วยปุ่ม Esc
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="manage-risk-title"
      aria-describedby="manage-risk-desc"
    >
      {/* overlay */}
      <button
        className="absolute inset-0 bg-black/40"
        aria-label="close"
        onClick={onClose}
      />

      {/* modal */}
      <div className="relative z-10 w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <h2 id="manage-risk-title" className="text-xl font-semibold text-gray-900">
            เสนอหัวหน้ากลุ่มตรวจสอบภายใน
          </h2>
          <button
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
            onClick={onClose}
            aria-label="close"
          >
            ✕
          </button>
        </div>

        <p id="manage-risk-desc" className="mt-1 text-sm text-gray-500">
          ท่านต้องการส่งเสนอหัวหน้าพิจารณาความเสี่ยงหรือไม่
        </p>

        {/* radio group */}
        <div className="mt-5 space-y-3" role="radiogroup" aria-label="คัดลอกข้อมูลปีที่แล้วหรือไม่">
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

        {/* actions */}
        <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
          <button
            className="rounded-xl border border-gray-300 px-5 py-2 text-gray-700 hover:bg-gray-50"
            onClick={onClose}
          >
            ยกเลิก
          </button>

          <div 
            className="rounded-xl bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700"
            onClick={onConfirm}
          >
            ยืนยัน
          </div>
        </div>
      </div>
    </div>
  );
}