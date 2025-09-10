"use client";
import React, { useEffect, useState } from "react";
import ModalShell from "@/components/ui/modalshell";
import LabeledInput from "@/components/ui/labeledinput";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (name: string, score: number, description: string) => void;
};

export default function CreateModal({ open, onClose, onSave }: Props) {
  const [name, setName] = useState("");
  const [score, setScore] = useState<number>(1);
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!open) return;
    setName("");
    setScore(1);
    setDescription("");
  }, [open]);

  const disabled = !name.trim() || score < 1 || score > 5;

  return (
    <ModalShell open={open} onClose={onClose} title="เพิ่มเกณฑ์พิจารณาความเสี่ยง">
      <div className="grid gap-4">
        <LabeledInput
          label="ชื่อเกณฑ์"
          placeholder="เช่น น้อย"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <LabeledInput
          label="คะแนนความเสี่ยง"
          type="number"
          min={1}
          max={5}
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
        />
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