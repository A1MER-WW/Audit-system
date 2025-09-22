"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { TabNavigation } from '@/components/tab-navigation';

import { Edit } from 'lucide-react';

interface AuditItem {
    id: string | number;
    displayId: string | number;
    department: string;
    auditTopic: string;
    result: string;
    status: string;
    action?: string;
}

export default function SummaryManagerPage() {
    const [selectedYear, setSelectedYear] = React.useState<string>("2568");
    const [activeTab, setActiveTab] = React.useState<string>("หน่วยงาน");
    const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = React.useState(false);
    const [editingItem, setEditingItem] = React.useState<AuditItem | null>(null);
    const [files, setFiles] = React.useState<File[] | undefined>();

    // Sample audit data matching the image exactly
    const auditData: AuditItem[] = [
        {
            id: "audit-1",
            displayId: 1,
            department: "กพท. และอีก 19 หน่วยงาน",
            auditTopic: "งานตรวจงาน",
            result: "เห็นด้วย",
            status: "completed"
        },
        {
            id: "audit-1-1",
            displayId: 1.1,
            department: "กพท./สคก./กพช./สตก.1-12",
            auditTopic: "งานตรวจงาน",
            result: "เห็นด้วย",
            status: "pending"
        },
        {
            id: "audit-1-4",
            displayId: 1.4,
            department: "กบม.",
            auditTopic: "งานตรวจงาน",
            result: "เห็นด้วย",
            status: "pending"
        },
        {
            id: "audit-1-6",
            displayId: 1.6,
            department: "สวช.",
            auditTopic: "งานตรวจงาน",
            result: "เห็นด้วย",
            status: "pending"
        },
        {
            id: "audit-1-7",
            displayId: 1.7,
            department: "สคก.",
            auditTopic: "งานตรวจงาน",
            result: "เห็นด้วย",
            status: "pending"
        },
        {
            id: "audit-1-8",
            displayId: 1.8,
            department: "คปม.",
            auditTopic: "งานตรวจงาน",
            result: "ไม่เห็นด้วย",
            status: "pending"
        },
        {
            id: "audit-1-9",
            displayId: 1.9,
            department: "กคป.",
            auditTopic: "งานตรวจงาน",
            result: "ไม่เห็นด้วย",
            status: "pending"
        }
    ];

    const tabs = [
        { id: "ทั้งหมด", label: "ทั้งหมด" },
        { id: "หน่วยงาน", label: "หน่วยงาน" },
        { id: "งาน", label: "งาน" },
        { id: "โครงการ", label: "โครงการ" },
        { id: "โครงการลงทุนสาธารณูปโภค", label: "โครงการลงทุนสาธารณูปโภค" },
        { id: "กิจกรรม", label: "กิจกรรม" },
        { id: "การบริหาร", label: "การบริหาร" },
        { id: "IT และ Non-IT", label: "IT และ Non-IT" }
    ];

    const handleEditItem = (item: AuditItem) => {
        setEditingItem(item);
        setIsEditDialogOpen(true);
    };

    const handleSaveEdit = () => {
        if (editingItem) {
            setIsEditDialogOpen(false);
            setIsConfirmDialogOpen(true);
        }
    };

    const handleConfirmSave = () => {
        if (editingItem) {
            // Here you would typically save to backend
            console.log('Saving edited item:', editingItem);
            setIsConfirmDialogOpen(false);
            setEditingItem(null);
            setFiles(undefined);
        }
    };

    const handleCancelConfirm = () => {
        setIsConfirmDialogOpen(false);
        setIsEditDialogOpen(true); // Go back to edit dialog
    };

    const handleDrop = (acceptedFiles: File[]) => {
        console.log('Files uploaded:', acceptedFiles);
        setFiles(acceptedFiles);
    };

    return (
        <div className="flex flex-1 flex-col gap-4 p-2 sm:p-4 pt-0">
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">ปีงบประมาณ:</span>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-24">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="2566">2566</SelectItem>
                        <SelectItem value="2567">2567</SelectItem>
                        <SelectItem value="2568">2568</SelectItem>
                        <SelectItem value="2569">2569</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className='flex items-center gap-2'>
                <span>ติดตามสถานะแสดงความเห็น</span>
                <Button className="bg-[#3E52B9] hover:bg-[#2C3E50] text-white px-6">
                    สรุปผลความคิดเห็น
                </Button>
            </div>
            {/* Header Section */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                            สรุปความคิดเห็นหัวข้อของงานตรวจสอบ ปีงบประมาณ 2568
                        </h1>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-sm ">สถานะ:</span>
                            <span className="text-sm text-[#3E52B9] underline cursor-pointer">
                                ผู้ตรวจสอบประจำหน่วยงานขั้นหัวข้อของงานตรวจสอบภายในส่งให้ควรให้
                            </span>
                        </div>
                    </div>

                    <Button className="bg-[#3E52B9] text-white px-6">
                        เสนอหัวหน้ากลุ่มตรวจสอบภายใน
                    </Button>
                </div>

                {/* Step Indicator */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-[#6366F1] text-white rounded-full flex items-center justify-center text-sm font-medium">
                            1
                        </div>
                        <span className="text-sm text-[#3E52B9] font-medium">
                            กำหนดหัวข้อของงานตรวจสอบตามความเสี่ยง
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                            2
                        </div>
                        <span className="text-sm text-gray-500">
                            ผลการพิจารณา
                        </span>
                    </div>
                </div>

                {/* Filter Button */}
                <div className="flex justify-end items-center">

                    <Button variant="outline" className="text-[#3E52B9] border-[#3E52B9]">
                        กรอง
                    </Button>
                </div>
            </div>

            {/* Category Tabs */}
            <TabNavigation 
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            {/* Data Table */}
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead className="text-xs sm:text-sm font-medium w-16 text-center">ลำดับ</TableHead>
                                    <TableHead className="text-xs sm:text-sm font-medium w-48 text-center">หน่วยงานที่ต้องตรวจสอบ</TableHead>
                                    <TableHead className="text-xs sm:text-sm font-medium text-center">หัวข้อของงานที่เกี่ยวข้อง</TableHead>
                                    <TableHead className="text-xs sm:text-sm font-medium w-32 text-center">ผลการประเมิน</TableHead>
                                    <TableHead className="text-xs sm:text-sm font-medium w-20 text-center">ความเห็น</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {auditData.map((item, index) => (
                                    <TableRow key={item.id} className="hover:bg-gray-50">
                                        <TableCell className="text-xs sm:text-sm text-center">
                                            {item.displayId === 1 ? (
                                                <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center mx-auto">
                                                    ✓
                                                </div>
                                            ) : (
                                                item.displayId
                                            )}
                                        </TableCell>
                                        <TableCell className="text-xs sm:text-sm font-medium text-left px-4">
                                            {item.department}
                                        </TableCell>
                                        <TableCell className="text-xs sm:text-sm text-center">
                                            {item.auditTopic}
                                        </TableCell>
                                        <TableCell className="text-xs sm:text-sm text-center">
                                            {item.result === "ไม่เห็นด้วย" ? (
                                                <span className="text-red-600">{item.result}</span>
                                            ) : item.result === "เห็นด้วย" ? (
                                                <span>{item.result}</span>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-xs sm:text-sm text-center">
                                            <span className="text-blue-600">ข้อสังเกตในข้อร้องเรียนการตรวจสอบเพิ่มเติม</span>

                                        </TableCell>
                                        <TableCell className="text-xs sm:text-sm text-center">
                                           <div className="flex items-center justify-center">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0"
                                                        onClick={() => handleEditItem(item)}
                                                    >
                                                        <Edit className="h-3 w-3 text-gray-500" />
                                                    </Button>
                                                </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-base text-gray-900">
                            แก้ไขชื่อหัวข้อรายการตรวจสอบ
                        </DialogTitle>
                    </DialogHeader>

                    {editingItem && (
                        <div className="space-y-4 py-4">
                            <div className="text-sm text-gray-600">
                                การวิเคราะห์การตรวจสอบเป็นปีงบประมาณ 2568
                            </div>
                            <div className="text-sm text-gray-600">
                                หน่วยงาน : {editingItem.department}
                            </div>
                            <div className="text-sm text-gray-600">
                                การจัดทำหัวข้อการตรวจสอบ :
                            </div>
                            <div className="text-sm text-gray-800 font-medium">
                                {editingItem.displayId}. {editingItem.auditTopic}
                            </div>

                            {/* Red button for special action */}
                            <Button 
                                variant="outline" 
                                className="w-full text-red-600 border-red-600 hover:bg-red-50"
                            >
                                หาข้อมูลจากการสนทนารายการตรวจสอบ
                            </Button>
                        </div>
                    )}

                    <DialogFooter className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsEditDialogOpen(false)}
                            className="flex-1"
                        >
                            ยกเลิก
                        </Button>
                        <Button
                            className="bg-[#3E52B9] hover:bg-[#2A3A8F] text-white flex-1"
                            onClick={handleSaveEdit}
                        >
                            บันทึก
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Confirmation Dialog */}
            <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-base text-gray-900">
                            ยืนยันเสนอหัวข้อรายการตรวจสอบนี้
                        </DialogTitle>
                    </DialogHeader>

                    {editingItem && (
                        <div className="space-y-4 py-4">
                            <div className="text-sm text-gray-600">
                                การวิเคราะห์การตรวจสอบเป็นปีงบประมาณ 2568
                            </div>
                            <div className="text-sm text-gray-600">
                                หน่วยงาน : {editingItem.department}
                            </div>
                            <div className="text-sm text-gray-600">
                                การจัดทำหัวข้อการตรวจสอบ :
                            </div>
                            <div className="text-sm text-gray-800 font-medium">
                                {editingItem.displayId}. {editingItem.auditTopic}
                            </div>

                            <div className="text-sm text-gray-600">
                                ยืนยันการแสดงความเห็นรายการตรวจสอบ
                            </div>
                            <div className="bg-gray-50 p-3 rounded">
                                <span className="text-green-600">✓ ไม่ตรวจสอบ</span>
                            </div>

                            <div className="text-sm text-gray-600">
                                ความคิดเห็นเพิ่มเติมของหน่วยงานที่เกี่ยวข้อง
                            </div>
                        </div>
                    )}

                    <DialogFooter className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={handleCancelConfirm}
                            className="flex-1"
                        >
                            แก้ไข
                        </Button>
                        <Button
                            className="bg-red-600 hover:bg-red-700 text-white flex-1"
                            onClick={handleConfirmSave}
                        >
                            ยืนยัน
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
