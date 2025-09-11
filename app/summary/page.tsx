"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@/components/ui/shadcn-io/dropzone';
import { FileText, Download, Settings} from 'lucide-react';

export default function SummaryPage() {
  const [selectedYear, setSelectedYear] = React.useState<string>("2568");
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<{
    id: number;
    code: string;
    score: string;
    status: string;
    action: string;
    hasIssue: boolean;
  } | null>(null);
  const [files, setFiles] = React.useState<File[] | undefined>();

  // Summary data
  const summaryData = {
    totalOpinions: 17,
    totalAgreements: 3,
    totalItems: 20
  };

  // Table data for audit items
  const [auditItems, setAuditItems] = React.useState([
    { id: 1, code: "กสต.", score: "30 ห.ค 68 เวลา 23.55 น.", status: "อนุมัติงบประมาณที่ได้รับการเสนอ", action: "download", hasIssue: false },
    { id: 2, code: "สกท.", score: "30 ห.ค 68 เวลา 23.55 น.", status: "อนุมัติงบประมาณที่ได้รับการเสนอ", action: "download", hasIssue: false },
    { id: 3, code: "สทช.", score: "30 ห.ค 68 เวลา 23.55 น.", status: "อนุมัติงบประมาณที่ได้รับการเสนอ", action: "download", hasIssue: false },
    { id: 4, code: "กนส.", score: "30 ห.ค 68 เวลา 23.55 น.", status: "อนุมัติงบประมาณที่ไม่ได้รับการเสนอ", action: "settings", hasIssue: true },
    { id: 5, code: "สาทษ.", score: "30 ห.ค 68 เวลา 23.55 น.", status: "อนุมัติงบประมาณที่ไม่ได้รับการเสนอ", action: "settings", hasIssue: true },
    { id: 6, code: "ศกษ.", score: "30 ห.ค 68 เวลา 23.55 น.", status: "อนุมัติงบประมาณที่ไม่ได้รับการเสนอ", action: "settings", hasIssue: true },
    { id: 7, code: "สปน.", score: "30 ห.ค 68 เวลา 23.55 น.", status: "อนุมัติงบประมาณที่ได้รับการเสนอ", action: "download", hasIssue: false },
    { id: 8, code: "กศน.", score: "30 ห.ค 68 เวลา 23.55 น.", status: "อนุมัติงบประมาณที่ได้รับการเสนอ", action: "download", hasIssue: false },
    { id: 9, code: "สพท.1", score: "30 ห.ค 68 เวลา 23.55 น.", status: "อนุมัติงบประมาณที่ได้รับการเสนอ", action: "download", hasIssue: false },
    { id: 10, code: "สพท.2", score: "30 ห.ค 68 เวลา 23.55 น.", status: "อนุมัติงบประมาณที่ได้รับการเสนอ", action: "download", hasIssue: false },
    { id: 11, code: "สพท.3", score: "30 ห.ค 68 เวลา 23.55 น.", status: "อนุมัติงบประมาณที่ได้รับการเสนอ", action: "download", hasIssue: false },
    { id: 12, code: "สพท.4", score: "30 ห.ค 68 เวลา 23.55 น.", status: "อนุมัติงบประมาณที่ได้รับการเสนอ", action: "download", hasIssue: false },
    { id: 13, code: "สพท.5.5", score: "30 ห.ค 68 เวลา 23.55 น.", status: "อนุมัติงบประมาณที่ได้รับการเสนอ", action: "download", hasIssue: false },
    { id: 14, code: "สพท.6", score: "30 ห.ค 68 เวลา 23.55 น.", status: "อนุมัติงบประมาณที่ได้รับการเสนอ", action: "download", hasIssue: false },
    { id: 15, code: "สพท.7", score: "30 ห.ค 68 เวลา 23.55 น.", status: "อนุมัติงบประมาณที่ได้รับการเสนอ", action: "download", hasIssue: false },
    { id: 16, code: "สพท.8", score: "30 ห.ค 68 เวลา 23.55 น.", status: "อนุมัติงบประมาณที่ได้รับการเสนอ", action: "download", hasIssue: false },
    { id: 17, code: "สพท.9", score: "30 ห.ค 68 เวลา 23.55 น.", status: "อนุมัติงบประมาณที่ได้รับการเสนอ", action: "download", hasIssue: false },
    { id: 18, code: "สพท.10", score: "30 ห.ค 68 เวลา 23.55 น.", status: "อนุมัติงบประมาณที่ได้รับการเสนอ", action: "download", hasIssue: false },
    { id: 19, code: "สพท.11", score: "30 ห.ค 68 เวลา 23.55 น.", status: "อนุมัติงบประมาณที่ได้รับการเสนอ", action: "download", hasIssue: false },
    { id: 20, code: "สพท.12", score: "30 ห.ค 68 เวลา 23.55 น.", status: "อนุมัติงบประมาณที่ได้รับการเสนอ", action: "download", hasIssue: false }
  ]);

  const handleEditItem = (item: {
    id: number;
    code: string;
    score: string;
    status: string;
    action: string;
    hasIssue: boolean;
  }) => {
    setEditingItem(item);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingItem) {
      setAuditItems(prev => 
        prev.map(item => 
          item.id === editingItem.id ? editingItem : item
        )
      );
      setIsEditDialogOpen(false);
      setEditingItem(null);
      setFiles(undefined);
    }
  };

  const handleDrop = (acceptedFiles: File[]) => {
    console.log('Files uploaded:', acceptedFiles);
    setFiles(acceptedFiles);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-2 sm:p-4 pt-0">
      {/* Header Section */}
       
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">ปีงบประมาณ</span>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2567">2567</SelectItem>
              <SelectItem value="2568">2568</SelectItem>
            </SelectContent>
          </Select>
        </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
            สรุปความเห็นหัวข้อของงานตรวจสอบทั้งหมด
          </h1>
        </div>
       
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button className="bg-[#3E52B9] hover:bg-[#2A3A8F] text-white">
          ติดตามสถานะแสดงความเห็น
        </Button>
        <Button variant="outline">
          สรุปผลความคิดเห็น
        </Button>
      </div>

      {/* Summary Title */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          ความเห็นหัวข้อของงานตรวจสอบทั้งหมดขึ้นรายงาน ปีงบประมาณ 2568
        </h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Total Opinions Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12  flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">ขึ้นรายงานได้รับการพิจารณา</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900">{summaryData.totalOpinions}</span>
                  <span className="text-sm text-gray-600">หน่วยงาน</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Agreements Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12   flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">ขึ้นรายงานไม่ได้รับการพิจารณา</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900">{summaryData.totalAgreements}</span>
                  <span className="text-sm text-gray-600">หน่วยงาน</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      

      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-xs sm:text-sm font-medium">หน่วยงาน</TableHead>
                  <TableHead className="text-xs sm:text-sm font-medium">วันเวลาที่ส่งความเห็นคืน</TableHead>
                  <TableHead className="text-xs sm:text-sm font-medium">สถานะ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditItems.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50">
                    <TableCell className={`text-xs sm:text-sm font-medium ${item.hasIssue ? 'text-red-600' : ''}`}>
                      {item.code}
                    </TableCell>
                    <TableCell className={`text-xs sm:text-sm ${item.hasIssue ? 'text-red-600' : 'text-gray-600'}`}>
                      {item.score}
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          item.status.includes('ได้รับการเสนอ') 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        } ${item.hasIssue ? 'text-red-800' : ''}`}>
                          {item.status}
                        </span>
                        {item.action === 'download' ? (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 hover:bg-gray-100"
                          >
                            <Download className="h-4 w-4 text-gray-600" />
                          </Button>
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 hover:bg-gray-100"
                            onClick={() => handleEditItem(item)}
                          >
                            <Settings className="h-4 w-4 text-gray-600" />
                          </Button>
                        )}
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
            <DialogTitle className="text-base text-[#3E52B9]">
              ขอขยายเวลาการแสดงความเห็นหัวข้อตรวจสอบ
            </DialogTitle>
            <div className="text-sm text-gray-600 mt-2">
              ขอขยายเวลาส่งไฟล์เอกสารในการดำเนินงานขยายความเห็นทั้งหมดก่อนดำเนินกิจกรรมที่เกี่ยวข้อง
            </div>
          </DialogHeader>
          
          {editingItem && (
            <div className="space-y-4 py-4">
              {/* Department Code */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  หน่วยงาน: {editingItem.code}
                </label>
              </div>

              {/* New Deadline */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  ขอขยายเวลาถึงวันที่
                </label>
                <Input
                  type="date"
                  defaultValue="2568-05-07"
                  className="w-full"
                />
              </div>

              {/* File Upload Section */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  แนบหลักฐานการขอขยายเวลา
                </label>
                
                <Dropzone
                  accept={{ 
                    'application/pdf': ['.pdf'],
                    'application/msword': ['.doc'],
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                    'application/vnd.ms-excel': ['.xls'],
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
                  }}
                  maxFiles={10}
                  maxSize={1024 * 1024 * 10}
                  onDrop={handleDrop}
                  src={files}
                  className="border-2 border-dashed border-blue-300 bg-blue-50"
                >
                  <DropzoneEmptyState />
                  <DropzoneContent />
                </Dropzone>
              </div>
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
              ส่งคำขอ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
