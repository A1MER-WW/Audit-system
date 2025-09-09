"use client"

import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import { useState } from "react"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

interface OTPVerificationProps {
  onOTPChange: (value: string) => void;
  isValid?: boolean;
}

export function OTPVerification({ onOTPChange, isValid = false }: OTPVerificationProps) {
  const [value, setValue] = useState("")

  const handleChange = (newValue: string) => {
    setValue(newValue)
    onOTPChange(newValue)
  }

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <p className="text-xs ">
          กรุณากรอกรหัส 6 หลัก
        </p>
      </div>
      
      <div className="flex justify-center">
        <InputOTP 
          maxLength={6} 
          pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
          value={value}
          onChange={handleChange}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          {value.length}/6 หลัก
        </p>
        {isValid && (
          <div className="mt-2 flex items-center justify-center gap-2">
            <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-xs">✓</span>
            </div>
            <span className="text-xs text-green-600">รหัส ผ่านถูกต้อง</span>
          </div>
        )}
      </div>
    </div>
  )
}
