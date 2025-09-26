import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useEngagementPlan } from '@/hooks/useEngagementPlan';

interface SaveIndicatorProps {
  className?: string;
}

export default function SaveIndicator({ className = '' }: SaveIndicatorProps) {
  const { state } = useEngagementPlan();
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    // Show saving status when state changes
    setSaveStatus('saving');
    
    const timeoutId = setTimeout(() => {
      setSaveStatus('saved');
      setLastSaved(new Date());
    }, 2000); // Show "saving" for 2 seconds

    return () => clearTimeout(timeoutId);
  }, [state]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('th-TH', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (saveStatus === 'saving') {
    return (
      <div className={`flex items-center gap-2 text-blue-600 text-sm ${className}`}>
        <Clock className="h-4 w-4 animate-spin" />
        <span>กำลังบันทึก...</span>
      </div>
    );
  }

  if (saveStatus === 'error') {
    return (
      <div className={`flex items-center gap-2 text-red-600 text-sm ${className}`}>
        <AlertCircle className="h-4 w-4" />
        <span>เกิดข้อผิดพลาดในการบันทึก</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 text-green-600 text-sm ${className}`}>
      <CheckCircle className="h-4 w-4" />
      <span>
        บันทึกแล้ว
        {lastSaved && (
          <span className="text-gray-500 ml-1">
            ({formatTime(lastSaved)})
          </span>
        )}
      </span>
    </div>
  );
}