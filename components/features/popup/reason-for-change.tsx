// app/components/ChangeOrderReasonDialog.tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  /** callback เมื่อกดยืนยัน */
  onConfirm?: (payload: {
    note: string;
    acknowledged: boolean;
  }) => Promise<void> | void;
  loading?: boolean;
  className?: string;
};

export default function ChangeOrderReasonDialog({
  open,
  onOpenChange,
  onConfirm,
  loading = false,
  className,
}: Props) {
  const [note, setNote] = useState("");
  const [ack, setAck] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = ack && !submitting && !loading;

  async function handleSubmit() {
    if (!canSubmit) return;
    try {
      setSubmitting(true);
      await onConfirm?.({ note: note.trim(), acknowledged: ack });
      onOpenChange(false);
      setNote("");
      setAck(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        // ขนาด/มุม/เงา/พื้นหลัง ให้เหมือนภาพ
        className={cn(
          "sm:max-w-[720px] rounded-2xl p-0 sm:p-0 bg-white shadow-xl",
          "border border-gray-200",
          className
        )}
      >
        <div className="p-6 sm:p-8">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-xl sm:text-2xl font-semibold text-gray-900">
              เหตุผลในการเปลี่ยนลำดับ
            </DialogTitle>
            <DialogDescription className="sr-only">
              โปรดระบุความคิดเห็นหรือข้อสั่งการ
              และยืนยันเพื่อนำไปพิจารณาหัวข้อของงานตรวจสอบ
            </DialogDescription>
          </DialogHeader>

          {/* ช่องข้อความ */}
          <div className="mt-6 space-y-2">
            <Label
              htmlFor="note"
              className="text-base font-medium text-gray-900"
            >
              ความคิดเห็นหรือข้อสั่งการ (ถ้ามี)
            </Label>
            <Textarea
              id="note"
              placeholder="ระบุความคิดเห็นหรือข้อสั่งการ"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className={cn(
                "min-h-[180px] resize-y rounded-xl",
                "bg-white",
                "placeholder:text-gray-400",
                "border border-gray-200",
                "focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
              )}
            />
          </div>

          {/* Checkbox ยืนยัน */}
          <div className="mt-6">
            <label className="flex items-start gap-3">
              <Checkbox
                checked={ack}
                onCheckedChange={(v) => setAck(Boolean(v))}
                className="mt-1"
              />
              <span className="text-sm sm:text-base leading-6 text-gray-900">
                ยืนยันเพื่อพิจารณาหัวข้อของงานตรวจสอบ
              </span>
            </label>
          </div>

          {/* ปุ่มล่าง: เต็มความกว้าง แบ่งซ้าย-ขวา */}
          <div className="mt-8 flex flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className={cn(
                "h-11 w-full flex-1 rounded-xl",
                "border-2",
                "border-indigo-600 text-indigo-700 hover:bg-indigo-50"
              )}
            >
              ยกเลิก
            </Button>

            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={cn(
                "h-11 w-full flex-1 rounded-xl",
                "bg-indigo-600 text-white hover:bg-indigo-700",
                "disabled:opacity-60 disabled:hover:bg-indigo-600"
              )}
            >
              {submitting || loading ? "กำลังบันทึก..." : "ยืนยัน"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
