'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SignatureComponentProps {
  onSignatureChange: (signatureData: { name: string; signature: string | null }) => void;
  initialName?: string;
}

export function SignatureComponent({ onSignatureChange, initialName = '' }: SignatureComponentProps) {
  const [name, setName] = useState(initialName);
  const [signatureBase64, setSignatureBase64] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#3B82F6';
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const dataURL = canvas.toDataURL();
      setSignatureBase64(dataURL);
      onSignatureChange({
        name: name,
        signature: dataURL,
      });
    }
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    setName(newName);
    onSignatureChange({
      name: newName,
      signature: signatureBase64,
    });
  };

  const handleClearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    setSignatureBase64(null);
    onSignatureChange({
      name: name,
      signature: null,
    });
  };

  return (
    <div className="w-full space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signer-name">ชื่อผู้ลงนาม</Label>
        <Input
          id="signer-name"
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="กรุณากรอกชื่อของคุณ"
          className="w-full"
        />
      </div>
      
      <div className="space-y-2">
        <Label>ลายเซ็น</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white">
          <canvas
            ref={canvasRef}
            width={400}
            height={200}
            className="w-full h-48 border rounded cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            style={{ touchAction: 'none' }}
          />
          <p className="text-xs text-gray-500 text-center mt-2">
            ใช้เมาส์หรือนิ้วลากเพื่อวาดลายเซ็น
          </p>
        </div>
        
        {signatureBase64 && (
          <div className="flex justify-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClearSignature}
              className="mt-2"
            >
              ลบลายเซ็น
            </Button>
          </div>
        )}
      </div>

      {signatureBase64 && name && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-xs">✓</span>
            </div>
            <div>
              <p className="text-sm font-medium text-green-800">ลายเซ็นเรียบร้อย</p>
              <p className="text-xs text-green-600">ผู้ลงนาม: {name}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
