"use client";
import React, { useEffect, useState } from "react";
import ModalShell from "@/components/ui/modalshell";
import LabeledInput from "@/components/ui/labeledinput";
import type { RiskCriterion } from "@/types/risk-criteria";

type Props = {
  open: boolean;
  record: RiskCriterion | null;
  onClose: () => void;
  onSave: (name: string, score: number, description: string) => void;
};

export default function EditModal({ open, record, onClose, onSave }: Props) {
  const [name, setName] = useState(record?.name ?? "");
  const [score, setScore] = useState<number>(record?.score ?? 1);
  const [description, setDescription] = useState(record?.description ?? "");

  useEffect(() => {
    setName(record?.name ?? "");
    setScore(record?.score ?? 1);
    setDescription(record?.description ?? "");
  }, [record, open]);

  if (!open || !record) return null;

  const disabled =
    !name.trim() ||
    (name.trim() === record.name &&
      score === record.score &&
      description.trim() === (record.description ?? ""));

  return (
    <ModalShell open={open} onClose={onClose} maxW="max-w-3xl" title="แก้ไขเกณฑ์พิจารณาความเสี่ยง">
      <div className="grid gap-6">
        <LabeledInput label="ชื่อเกณฑ์" value={name} onChange={(e) => setName(e.target.value)} />
        <LabeledInput
          label="คะแนนความเสี่ยง"
          type="number"
          min={1}
          max={5}
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
        />

        <div className="space-y-3">
          <h3 className="text-base font-semibold text-slate-900">รายละเอียด</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <LabeledInput label="ผู้สร้าง" value={record.creator} readOnly className="bg-slate-50/50" />
            <LabeledInput label="สร้างเมื่อ" value={record.createdAt} readOnly className="bg-slate-50/50" />
            {!!record.updatedBy && (
              <LabeledInput label="ผู้แก้ไข" value={record.updatedBy!} readOnly className="bg-slate-50/50" />
            )}
            <LabeledInput label="อัปเดตล่าสุดเมื่อ" value={record.updatedAt} readOnly className="bg-slate-50/50" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 p-6 pt-2">
        <button
          onClick={onClose}
          className="rounded-xl border-2 border-indigo-400 px-6 py-2.5 text-indigo-600 hover:bg-indigo-50"
        >
          ยกเลิก
        </button>
        <button
          onClick={() => !disabled && onSave(name.trim(), score, description.trim())}
          disabled={disabled}
          className="rounded-xl bg-indigo-600 px-6 py-2.5 text-white shadow hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          บันทึก
        </button>
      </div>
    </ModalShell>
  );
}