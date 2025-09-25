"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useEngagementPlan } from "@/contexts/EngagementPlanContext";
import { Database, Settings, RefreshCw, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function EngagementPlanStorageStatus() {
  const { 
    programs, 
    isStorageAvailable, 
    storageStats, 
    refreshPrograms, 
    error 
  } = useEngagementPlan();

  const getStorageStatusBadge = () => {
    if (!isStorageAvailable) {
      return <Badge variant="destructive">ไม่พร้อมใช้งาน</Badge>;
    }
    if (storageStats.percentage < 50) {
      return <Badge variant="default" className="bg-green-100 text-green-800">ปกติ</Badge>;
    }
    if (storageStats.percentage < 80) {
      return <Badge variant="secondary">เตือน</Badge>;
    }
    return <Badge variant="destructive">เกือบเต็ม</Badge>;
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Local Storage
            {getStorageStatusBadge()}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshPrograms}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Link href="/dashboard/engagement-plan/settings" passHref>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertTriangle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">รายการทั้งหมด</div>
            <div className="font-semibold">{programs.length} รายการ</div>
          </div>
          <div>
            <div className="text-muted-foreground">ข้อมูลที่ใช้</div>
            <div className="font-semibold">
              {formatBytes(storageStats.used)}
            </div>
          </div>
        </div>

        {isStorageAvailable && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>การใช้งาน Storage</span>
              <span>{storageStats.percentage.toFixed(1)}%</span>
            </div>
            <Progress value={storageStats.percentage} className="h-2" />
          </div>
        )}

        {!isStorageAvailable && (
          <div className="text-sm text-red-600">
            Local Storage ไม่สามารถใช้งานได้ กรุณาตรวจสอบการตั้งค่าเบราว์เซอร์
          </div>
        )}
      </CardContent>
    </Card>
  );
}