"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const PRIMARY = "#3F4FC6";

export default function ScreeningChoiceDialog({
  open,
  onOpenChange,
  initial = "need",
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: "need" | "none" | null;
  onConfirm: (value: "need" | "none") => void;
}) {
  const [choice, setChoice] = useState<"need" | "none">(initial ?? "need");

  useEffect(() => {
    if (open && initial) setChoice(initial);
  }, [open, initial]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden rounded-2xl">
        {/* Header */}
        <div className="px-7 pt-7 pb-2">
          <DialogHeader className="text-left space-y-1">
            <DialogTitle className="text-[22px] font-semibold leading-7">
              ประเมินหัวข้อถัดไป
            </DialogTitle>
            <DialogDescription className="text-[15px] text-muted-foreground">
              ท่านต้องการคัดลอกจากการประเมินเพื่อใช้กับหน่วยงานถัดไปหรือไม่
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Body */}
        <div className="px-7 pb-2 space-y-4">
          <label
            className="flex items-center gap-3 cursor-pointer select-none hover:bg-gray-50 rounded-lg p-2"
            onClick={() => setChoice("need")}
          >
            <Checkbox
              checked={choice === "need"}
              onCheckedChange={() => setChoice("need")}
              className="h-5 w-5 data-[state=checked]:bg-primary"
              style={{ ["--primary" as any]: PRIMARY }}
            />
            <span className="text-sm">ต้องการคัดลอก</span>
          </label>

          <label
            className="flex items-center gap-3 cursor-pointer select-none hover:bg-gray-50 rounded-lg p-2"
            onClick={() => setChoice("none")}
          >
            <Checkbox
              checked={choice === "none"}
              onCheckedChange={() => setChoice("none")}
              className="h-5 w-5 data-[state=checked]:bg-primary"
              style={{ ["--primary" as any]: PRIMARY }}
            />
            <span className="text-sm">ไม่ต้องการคัดลอก</span>
          </label>
        </div>

        {/* Footer */}
        <div className="px-7 pt-4 pb-6 flex items-center justify-between gap-4">
          <Button
            variant="outline"
            className="h-11 w-[160px] rounded-xl text-[15px] font-medium border-primary text-primary"
            onClick={() => onOpenChange(false)}
          >
            ยกเลิก
          </Button>
          <Button
            className="h-11 w-[160px] rounded-xl text-[15px] font-medium bg-primary text-white"
            onClick={() => {
              onConfirm(choice);
              onOpenChange(false);
            }}
          >
            ยืนยัน
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
