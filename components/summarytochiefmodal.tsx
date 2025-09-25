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

export default function SummaryToChiefModal({
  open,
  value,
  onChange,
  onClose,
  onConfirm,
}: Props) {
  const [comment, setComment] = React.useState("");

  // เปิดใหม่ให้เคลียร์ช่องความเห็น
  useEffect(() => {
    if (open) setComment("");
  }, [open]);

  if (!open) return null;

  const disabled = !value; // ต้องเลือกสถานะก่อนค่อยกด "ยืนยัน"

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
        {/* header */}
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
          คุณต้องการเสนอหัวหน้ากลุ่มตรวจสอบภายในใช่หรือไม่
        </p>


        {/* comment */}
        <div className="mt-5 space-y-2">
          <label htmlFor="comment" className="text-sm text-slate-600">
            ความเห็นเพิ่มเติม (ถ้ามี)
          </label>
          <textarea
            id="comment"
            rows={6}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="ระบุความเห็นหรือข้อสั่งการ"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-800 outline-none ring-indigo-200 focus:ring"
          />
        </div>

        {/* actions */}
        <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
          <button
            className="rounded-xl border border-gray-300 px-5 py-2 text-gray-700 hover:bg-gray-50"
            onClick={onClose}
          >
            ยกเลิก
          </button>

          <Link
            href="/"
            onClick={onConfirm}
            aria-disabled={disabled}
            className={`rounded-xl px-6 py-2 text-white ${
              disabled
                ? "bg-indigo-600/60 pointer-events-none opacity-60"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            ยืนยัน
          </Link>
        </div>
      </div>
    </div>
  );
}
