"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { SignatureComponent } from '@/components/signature-component';
import { OTPVerification } from '@/components/otp-verification';
import { Loader2 } from 'lucide-react';

interface SignatureSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  approvalStep: number;
  signatureChoice: 'new' | 'saved' | null;
  signatureData: {name: string; signature: string | null};
  otpValue: string;
  isOtpValid: boolean;
  loading?: boolean;
  onSignatureChoice: (choice: 'new' | 'saved') => void;
  onSignatureDataChange: (data: {name: string; signature: string | null}) => void;
  onOTPChange: (value: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export function SignatureSelectionDialog({
  open,
  onOpenChange,
  approvalStep,
  signatureChoice,
  signatureData,
  otpValue,
  isOtpValid,
  loading = false,
  onSignatureChoice,
  onSignatureDataChange,
  onOTPChange,
  onCancel,
  onConfirm
}: SignatureSelectionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            ลายเซ็นอิเล็กทรอนิกส์
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {approvalStep === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                เลือกวิธีการลงลายเซ็น
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => onSignatureChoice('new')}
                  className={`w-full p-4 border rounded-lg text-left hover:bg-gray-50 transition-colors ${
                    signatureChoice === 'new' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      signatureChoice === 'new' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                    }`}>
                      {signatureChoice === 'new' && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1"></div>}
                    </div>
                    <div>
                      <div className="font-medium">เซ็นชื่อใหม่</div>
                      <div className="text-sm text-gray-500">วาดลายเซ็นด้วยเมาส์หรือสัมผัส</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => onSignatureChoice('saved')}
                  className={`w-full p-4 border rounded-lg text-left hover:bg-gray-50 transition-colors ${
                    signatureChoice === 'saved' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      signatureChoice === 'saved' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                    }`}>
                      {signatureChoice === 'saved' && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1"></div>}
                    </div>
                    <div>
                      <div className="font-medium">เลือกลายเซ็นที่เคยบันทึกไว้</div>
                      <div className="text-sm text-gray-500">ใช้ลายเซ็นที่บันทึกไว้แล้ว</div>
                    </div>
                  </div>
                </button>
              </div>

              {signatureChoice === 'new' && (
                <div className="mt-4">
                  <SignatureComponent
                    onSignatureChange={onSignatureDataChange}
                    initialName="ผู้อนุมัติ"
                  />
                </div>
              )}
            </div>
          )}

          {approvalStep === 2 && signatureChoice === 'saved' && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-medium mb-2">ยืนยันตัวตนเพื่อใช้ลายเซ็น</h3>
                <p className="text-sm text-gray-600 mb-4">
                  กรุณากรอกรหัส OTP เพื่อปลดล็อคลายเซ็นที่บันทึกไว้
                </p>
              </div>
              
              <OTPVerification 
                onOTPChange={onOTPChange}
                isValid={isOtpValid}
              />
              
              {isOtpValid && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-xs">✓</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-800">ปลดล็อคลายเซ็นเรียบร้อย</p>
                      <p className="text-xs text-green-600">พร้อมใช้ลายเซ็นที่บันทึกไว้แล้ว</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="flex-1"
            disabled={loading}
          >
            ยกเลิก
          </Button>
          <Button 
            onClick={onConfirm}
            disabled={
              loading ||
              (signatureChoice === 'new' && !signatureData.signature) ||
              (signatureChoice === 'saved' && !isOtpValid) ||
              !signatureChoice
            }
            className="bg-[#3E52B9] hover:bg-[#2A3A8F] text-white flex-1 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                กำลังดำเนินการ...
              </>
            ) : (
              "ยืนยัน"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}