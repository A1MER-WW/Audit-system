"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

interface ApprovalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  comment: string;
  onCommentChange: (comment: string) => void;
  onConfirm: () => void;
  loading?: boolean;
}

export function ApprovalDialog({
  open,
  onOpenChange,
  comment,
  onCommentChange,
  onConfirm,
  loading = false
}: ApprovalDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-semibold">
            พิจารณาหัวข้อของงานตรวจสอบ
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <p className="text-sm text-gray-600">
            กรุณาเลือกสถานะการพิจารณา
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="approve" 
                disabled={loading}
              />
              <label 
                htmlFor="approve" 
                className="text-sm text-gray-700"
              >
                อนุมัติ
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="reject"
                disabled={loading}
              />
              <label 
                htmlFor="reject" 
                className="text-sm text-gray-700"
              >
                ไม่อนุมัติ
              </label>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                ความเห็นหนังสือกิจการการ
              </label>
              <Textarea
                placeholder="ไม่ระบุความเห็นหนังสือกิจการการ"
                value={comment}
                onChange={(e) => onCommentChange(e.target.value)}
                className="min-h-[150px] resize-none"
                disabled={loading}
              />
            </div>
          </div>
          
          <p className="text-sm text-gray-600">
            ยินยันข้อมูลการการตัวจริงข้อมูลงานตรวจสอบ
          </p>
        </div>

        <DialogFooter className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="flex-1"
            disabled={loading}
          >
            ยกเลิก
          </Button>
          <Button 
            onClick={onConfirm}
            className="bg-[#3E52B9] hover:bg-[#2A3A8F] text-white flex-1"
            disabled={loading}
          >
            {loading ? "กำลังดำเนินการ..." : "ยืนยัน"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}