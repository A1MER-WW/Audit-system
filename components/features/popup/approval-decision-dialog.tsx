"use client";

import * as React from "react";
import { X, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// -----------------------------
// Reusable component
// -----------------------------
export type Decision = "APPROVE" | "REJECT";

export type ApprovalDecisionPayload = {
  decision: Decision;
  remark?: string;
};

interface ApprovalDecisionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (payload: ApprovalDecisionPayload) => void | Promise<void>;
  loading?: boolean;
}

export function ApprovalDecisionDialog(props: ApprovalDecisionDialogProps) {
  const { open, onOpenChange, onConfirm, loading } = props;

  const [approve, setApprove] = React.useState<boolean>(true);
  const [reject, setReject] = React.useState<boolean>(false);
  const [remark, setRemark] = React.useState<string>("");
  const [ack, setAck] = React.useState<boolean>(false);

  // keep the checkboxes mutually exclusive
  React.useEffect(() => {
    if (approve && reject) setReject(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [approve]);
  React.useEffect(() => {
    if (reject && approve) setApprove(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reject]);

  const canSubmit = (approve || reject) && ack && !loading;

  const handleConfirm = async () => {
    if (!canSubmit) return;
    await onConfirm({ decision: approve ? "APPROVE" : "REJECT", remark: remark?.trim() || undefined });
  };

  const reset = () => {
    setApprove(true);
    setReject(false);
    setRemark("");
    setAck(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) reset(); }}>
      <DialogContent className="max-w-3xl p-0 gap-0">
        <div className="flex items-start justify-between p-6 pb-0">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-2xl font-semibold">พิจารณาหัวข้อของงานตรวจสอบ</DialogTitle>
            <DialogDescription className="text-muted-foreground">กรุณาเลือกสถานะการพิจารณา</DialogDescription>
          </DialogHeader>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="shrink-0">
              <X className="h-5 w-5" />
            </Button>
          </DialogClose>
        </div>

        <div className="px-6 py-4 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Checkbox id="approve" checked={approve} onCheckedChange={(v) => setApprove(Boolean(v))} />
              <Label htmlFor="approve" className="font-medium">อนุมัติ</Label>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox id="reject" checked={reject} onCheckedChange={(v) => setReject(Boolean(v))} />
              <Label htmlFor="reject" className="font-medium">ไม่อนุมัติ</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="remark" className="font-medium">ความเห็นหรือข้อสั่งการ (ถ้ามี)</Label>
            <Textarea
              id="remark"
              placeholder="ระบุความเห็นหรือข้อสั่งการ"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              className="min-h-[160px] resize-y"
            />
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox id="ack" checked={ack} onCheckedChange={(v) => setAck(Boolean(v))} />
            <Label htmlFor="ack">ยืนยันเพื่อพิจารณาหัวข้อของงานตรวจสอบ</Label>
          </div>
        </div>

        <DialogFooter className="px-6 pt-2 pb-6 gap-3 sm:gap-2">
          <DialogClose asChild>
            <Button variant="outline" className="min-w-[140px]">ยกเลิก</Button>
          </DialogClose>
          <Button onClick={handleConfirm} disabled={!canSubmit} className="min-w-[180px]">
            {loading ? "กำลังยืนยัน..." : "ยืนยัน"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// -----------------------------
// Example usage (page or component)
// -----------------------------
export default function ExamplePage() {
  const [open, setOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  async function handleConfirm(payload: ApprovalDecisionPayload) {
    setSubmitting(true);
    try {
      // TODO: call your API here
      await new Promise((r) => setTimeout(r, 800));
      console.log("submit", payload);
      setOpen(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-6">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setOpen(true)}>เปิด popup พิจารณา</Button>
        </DialogTrigger>
      </Dialog>

      {/* The actual dialog */}
      <ApprovalDecisionDialog
        open={open}
        onOpenChange={setOpen}
        onConfirm={handleConfirm}
        loading={submitting}
      />
    </div>
  );
}
