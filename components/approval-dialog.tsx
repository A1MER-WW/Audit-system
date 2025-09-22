"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { SignatureComponent } from '@/components/signature-component'
import { OTPVerification } from '@/components/otp-verification'
import { PenTool, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react'

interface ApprovalDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  approvalStep: number
  onApprovalComplete: () => void
  onNextStep: () => void
  onPrevStep: () => void
  signatureChoice: 'new' | 'saved' | null
  onSignatureChoiceChange: (choice: 'new' | 'saved' | null) => void
  signatureData: { name: string; signature: string | null }
  onSignatureDataChange: (data: { name: string; signature: string | null }) => void
  isOtpValid: boolean
  onOTPChange: (value: string) => void
}

export function ApprovalDialog({
  isOpen,
  onOpenChange,
  approvalStep,
  onApprovalComplete,
  onNextStep,
  onPrevStep,
  signatureChoice,
  onSignatureChoiceChange,
  signatureData,
  onSignatureDataChange,
  isOtpValid,
  onOTPChange
}: ApprovalDialogProps) {
  const renderApprovalStep = () => {
    switch (approvalStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">ยืนยันการอนุมัติ</h3>
              <p className="text-sm text-gray-600">ตรวจสอบข้อมูลแผนการตรวจสอบภายใน</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">แผนการตรวจสอบระยะยาว 2568-2570</span>
              </div>
              <p className="text-xs text-gray-600 ml-6">
                รวมงบประมาณ 2,539,629 บาท | จำนวนหัวข้อตรวจสอบ 10 รายการ
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                ยกเลิก
              </Button>
              <Button onClick={onNextStep} className="gap-2">
                ดำเนินการต่อ
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">ลายเซ็นดิจิทัล</h3>
              <p className="text-sm text-gray-600">เลือกประเภทลายเซ็นที่ต้องการใช้</p>
            </div>

            <div className="space-y-3">
              <div 
                className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                  signatureChoice === 'new' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => onSignatureChoiceChange('new')}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    signatureChoice === 'new' 
                      ? 'border-blue-500 bg-blue-500' 
                      : 'border-gray-300'
                  }`}>
                    {signatureChoice === 'new' && (
                      <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <PenTool className="w-4 h-4" />
                      <span className="font-medium">วาดลายเซ็นใหม่</span>
                    </div>
                    <p className="text-xs text-gray-600">สร้างลายเซ็นใหม่สำหรับการอนุมัติครั้งนี้</p>
                  </div>
                </div>
              </div>

              <div 
                className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                  signatureChoice === 'saved' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => onSignatureChoiceChange('saved')}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    signatureChoice === 'saved' 
                      ? 'border-blue-500 bg-blue-500' 
                      : 'border-gray-300'
                  }`}>
                    {signatureChoice === 'saved' && (
                      <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span className="font-medium">ใช้ลายเซ็นที่บันทึกไว้</span>
                    </div>
                    <p className="text-xs text-gray-600">ใช้ลายเซ็นที่เคยบันทึกไว้ในระบบ</p>
                  </div>
                </div>
              </div>
            </div>

            {signatureChoice === 'new' && (
              <div className="mt-4">
                <SignatureComponent
                  onSignatureChange={onSignatureDataChange}
                  initialName={signatureData.name}
                />
              </div>
            )}

            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={onPrevStep}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                กลับ
              </Button>
              <Button 
                onClick={onNextStep}
                disabled={!signatureChoice || (signatureChoice === 'new' && (!signatureData.signature || !signatureData.name))}
                className="gap-2"
              >
                ดำเนินการต่อ
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">ยืนยันด้วย OTP</h3>
              <p className="text-sm text-gray-600">กรุณากรอกรหัส OTP เพื่อยืนยันการอนุมัติ</p>
            </div>

            {/* Signature Confirmation */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">ข้อมูลการลงนาม</span>
              </div>
              
              {(signatureChoice === 'new' && signatureData.signature) || signatureChoice === 'saved' ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-xs">✓</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-blue-800">ลายเซ็นยืนยัน</h4>
                      <p className="text-xs text-blue-600">
                        {signatureChoice === 'saved' ? 'ใช้ลายเซ็นที่บันทึกไว้' : signatureData.name}
                      </p>
                    </div>
                  </div>
                  {signatureChoice === 'saved' && (
                    <div className="mt-3 p-2 bg-white rounded border-2 border-dashed border-gray-200">
                      <div className="text-center text-gray-500 text-sm">ลายเซ็นที่บันทึกไว้</div>
                      <div className="h-16 flex items-center justify-center">
                        <svg viewBox="0 0 200 60" className="w-32 h-12">
                          <path d="M10 40 Q 50 10 90 30 Q 130 50 170 20" stroke="black" strokeWidth="2" fill="none" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}

              {/* OTP Verification Section */}
              <div className="rounded-lg p-4">
                <OTPVerification 
                  onOTPChange={onOTPChange}
                  isValid={isOtpValid}
                />
              </div>
            </div>

            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={onPrevStep}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                กลับ
              </Button>
              <Button 
                onClick={onApprovalComplete}
                disabled={!isOtpValid}
                className="gap-2"
              >
                อนุมัติ
                <CheckCircle className="w-4 h-4" />
              </Button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg flex items-center gap-2">
            <PenTool className="h-5 w-5" />
            อนุมัติแผนการตรวจสอบ
          </DialogTitle>
          <DialogDescription>
            กระบวนการอนุมัติแผนการตรวจสอบด้วยลายเซ็นดิจิทัลและ OTP
          </DialogDescription>
        </DialogHeader>
        
        {/* Step indicator */}
        <div className="flex items-center justify-center space-x-4 py-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= approvalStep 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {step}
              </div>
              {step < 3 && (
                <div className={`w-12 h-0.5 ${
                  step < approvalStep ? 'bg-blue-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        
        {renderApprovalStep()}
      </DialogContent>
    </Dialog>
  );
}