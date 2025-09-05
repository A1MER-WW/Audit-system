// components/risk/RiskSubmitConfirmDialog.tsx
"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onConfirm: () => void;
  onCancel?: () => void;
  assessmentTitle: string;
  loading?: boolean;
  className?: string;
};

export default function RiskSubmitConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  assessmentTitle,
  loading,
  className,
}: Props) {
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          // กรอบ/มุมโค้ง/เงา/ขนาด ให้เหมือนภาพ
          "sm:max-w-[720px] rounded-2xl p-0 shadow-lg",
          className
        )}
      >
        <div className="p-5 sm:p-6">
          <DialogHeader className="mb-3">
            <DialogTitle className="text-[20px] font-bold leading-7">
              ยืนยันข้อมูลเสนอหัวหน้าหน่วยตรวจสอบ
            </DialogTitle>
          </DialogHeader>

          {/* กล่องข้อความ: มุมโค้งใหญ่ ระยะห่างตามภาพ และจัดตัวอักษรกึ่งกลาง */}
          <Textarea
            readOnly
            value={assessmentTitle}
            className={cn(
              "min-h-[84px] resize-none rounded-xl border-[1px] px-4 py-4",
              "text-center text-[15px] leading-7"
            )}
          />

          <p className="mt-5 text-[15px] text-foreground">
            คุณต้องการเสนอหัวหน้าหน่วยตรวจสอบใช่หรือไม่
          </p>

          {/* ปุ่มล่าง: สองปุ่มกว้างเท่ากัน ช่องไฟ/สไตล์ตามภาพ */}
          <DialogFooter className="mt-5">
            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
              <Button
                type="button"
                variant="outline"
                className="h-12 w-full rounded-xl text-[15px]"
                onClick={handleCancel}
                disabled={loading}
              >
                ยกเลิก
              </Button>
              <Button
                type="button"
                className="h-12 w-full rounded-xl bg-indigo-600 text-[15px] hover:bg-indigo-700"
                onClick={onConfirm}
                disabled={loading}
              >
                ยืนยัน
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
