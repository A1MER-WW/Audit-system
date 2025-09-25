"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useEngagementPlanStorage,
  useEngagementPlanStorageMonitor,
} from "@/hooks/useEngagementPlanStorage";
import {
  Download,
  Upload,
  Trash2,
  RefreshCw,
  Database,
  AlertTriangle,
  CheckCircle,
  FileText,
} from "lucide-react";

export default function EngagementPlanStorageSettings() {
  const {
    storageStats,
    updateStorageStats,
    clearAllData,
    downloadBackup,
    restoreFromFile,
    resetToDefaults,
  } = useEngagementPlanStorage();
  
  const { isStorageAvailable, lastError } = useEngagementPlanStorageMonitor();
  
  const [isClearing, setIsClearing] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleClearData = async () => {
    setIsClearing(true);
    try {
      await clearAllData();
      updateStorageStats();
    } catch (error) {
      console.error("Failed to clear data:", error);
    } finally {
      setIsClearing(false);
    }
  };

  const handleResetToDefaults = async () => {
    setIsResetting(true);
    try {
      await resetToDefaults();
      updateStorageStats();
    } catch (error) {
      console.error("Failed to reset data:", error);
    } finally {
      setIsResetting(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploadSuccess(false);

    try {
      await restoreFromFile(file);
      setUploadSuccess(true);
      updateStorageStats();
      
      // Clear success message after 3 seconds
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Failed to restore backup");
    }

    // Reset file input
    event.target.value = "";
  };

  const getStorageStatusColor = () => {
    if (storageStats.percentage < 50) return "bg-green-500";
    if (storageStats.percentage < 80) return "bg-yellow-500";
    return "bg-red-500";
  };

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">การจัดการข้อมูล Local Storage</h2>
          <p className="text-muted-foreground">
            จัดการข้อมูลแผนงานตรวจสอบที่เก็บในเครื่องของคุณ
          </p>
        </div>
      </div>

      {/* Storage Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            สถานะ Storage
            {getStorageStatusBadge()}
          </CardTitle>
          <CardDescription>
            ข้อมูลการใช้งาน Local Storage สำหรับแผนงานตรวจสอบ
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isStorageAvailable && lastError && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Local Storage ไม่พร้อมใช้งาน: {lastError}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>ข้อมูลที่ใช้:</span>
              <span>{storageStats.formattedUsed} / {storageStats.formattedAvailable}</span>
            </div>
            <Progress 
              value={storageStats.percentage} 
              className="h-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{storageStats.percentage.toFixed(1)}% ที่ใช้</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={updateStorageStats}
                className="h-auto p-0 text-xs"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                อัปเดต
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Backup & Restore */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            สำรองข้อมูลและกู้คืน
          </CardTitle>
          <CardDescription>
            สำรองข้อมูลหรือกู้คืนข้อมูลจากไฟล์สำรอง
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {uploadSuccess && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                กู้คืนข้อมูลสำเร็จแล้ว!
              </AlertDescription>
            </Alert>
          )}
          
          {uploadError && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {uploadError}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={downloadBackup}
              variant="outline"
              className="flex items-center gap-2"
              disabled={!isStorageAvailable}
            >
              <Download className="h-4 w-4" />
              ดาวน์โหลดสำรองข้อมูล
            </Button>
            
            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={!isStorageAvailable}
              />
              <Button
                variant="outline"
                className="flex items-center gap-2 w-full"
                disabled={!isStorageAvailable}
              >
                <Upload className="h-4 w-4" />
                กู้คืนจากไฟล์สำรอง
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            การจัดการข้อมูล
          </CardTitle>
          <CardDescription>
            ลบหรือรีเซ็ตข้อมูลทั้งหมด
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  disabled={!isStorageAvailable || isResetting}
                >
                  <RefreshCw className="h-4 w-4" />
                  รีเซ็ตเป็นค่าเริ่มต้น
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>รีเซ็ตข้อมูลเป็นค่าเริ่มต้น</DialogTitle>
                  <DialogDescription>
                    การดำเนินการนี้จะลบข้อมูลทั้งหมดและคืนค่าเป็นข้อมูลเริ่มต้น
                    การกระทำนี้ไม่สามารถยกเลิกได้
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    onClick={handleResetToDefaults}
                    disabled={isResetting}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isResetting ? "กำลังรีเซ็ต..." : "ยืนยันรีเซ็ต"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="flex items-center gap-2"
                  disabled={!isStorageAvailable || isClearing}
                >
                  <Trash2 className="h-4 w-4" />
                  ลบข้อมูลทั้งหมด
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>ลบข้อมูลทั้งหมด</DialogTitle>
                  <DialogDescription>
                    การดำเนินการนี้จะลบข้อมูลแผนงานตรวจสอบทั้งหมดอย่างถาวร
                    การกระทำนี้ไม่สามารถยกเลิกได้
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="destructive"
                    onClick={handleClearData}
                    disabled={isClearing}
                  >
                    {isClearing ? "กำลังลบ..." : "ยืนยันลบ"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      <Separator />
      
      <div className="text-sm text-muted-foreground">
        <p>
          <strong>หมายเหตุ:</strong> ข้อมูลใน Local Storage จะถูกเก็บไว้ในเบราว์เซอร์ของคุณเท่านั้น
          หากคุณล้างข้อมูลเบราว์เซอร์หรือใช้งานในเครื่องอื่น ข้อมูลจะไม่สามารถเข้าถึงได้
        </p>
      </div>
    </div>
  );
}