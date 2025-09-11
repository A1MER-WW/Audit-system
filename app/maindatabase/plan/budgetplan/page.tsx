"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/ui/shadcn-io/dropzone";

// Types for budget data
type BudgetData = {
  [quarter: string]: {
    [month: string]: {
      [category: string]: number;
    };
  };
};

// Budget categories and data based on the image
const budgetCategories = [
  "ค่าไฟฟ้า",
  "ค่าน้ำประปา", 
  "ค่าโทรศัพท์",
  "ค่าโทรสื่อสาร",
  "ค่าอินเทอร์เน็ต"
];

const quarters = ["Q1", "Q2", "Q3", "Q4"];
const months = {
  Q1: ["ตุลาคม", "พฤศจิกายน", "ธันวาคม"],
  Q2: ["มกราคม", "กุมภาพันธ์", "มีนาคม"],
  Q3: ["เมษายน", "พฤษภาคม", "มิถุนายน"],
  Q4: ["กรกฎาคม", "สิงหาคม", "กันยายน"]
};

// Sample budget data matching the image
const generateBudgetData = (): BudgetData => {
  return {
    Q1: {
      "ตุลาคม": {
        "ค่าไฟฟ้า": 893900,
        "ค่าน้ำประปา": 45700,
        "ค่าโทรศัพท์": 71900,
        "ค่าโทรสื่อสาร": 89200,
        "ค่าอินเทอร์เน็ต": 0
      },
      "พฤศจิกายน": {
        "ค่าไฟฟ้า": 894400,
        "ค่าน้ำประปา": 35900,
        "ค่าโทรศัพท์": 74000,
        "ค่าโทรสื่อสาร": 90000,
        "ค่าอินเทอร์เน็ต": 100000
      },
      "ธันวาคม": {
        "ค่าไฟฟ้า": 894400,
        "ค่าน้ำประปา": 35900,
        "ค่าโทรศัพท์": 75600,
        "ค่าโทรสื่อสาร": 12345,
        "ค่าอินเทอร์เน็ต": 3900000
      }
    },
    Q2: {
      "มกราคม": {
        "ค่าไฟฟ้า": 850000,
        "ค่าน้ำประปา": 40000,
        "ค่าโทรศัพท์": 70000,
        "ค่าโทรสื่อสาร": 85000,
        "ค่าอินเทอร์เน็ต": 95000
      },
      "กุมภาพันธ์": {
        "ค่าไฟฟ้า": 860000,
        "ค่าน้ำประปา": 42000,
        "ค่าโทรศัพท์": 72000,
        "ค่าโทรสื่อสาร": 87000,
        "ค่าอินเทอร์เน็ต": 97000
      },
      "มีนาคม": {
        "ค่าไฟฟ้า": 870000,
        "ค่าน้ำประปา": 44000,
        "ค่าโทรศัพท์": 74000,
        "ค่าโทรสื่อสาร": 89000,
        "ค่าอินเทอร์เน็ต": 99000
      }
    },
    Q3: {
      "เมษายน": {
        "ค่าไฟฟ้า": 900000,
        "ค่าน้ำประปา": 46000,
        "ค่าโทรศัพท์": 76000,
        "ค่าโทรสื่อสาร": 91000,
        "ค่าอินเทอร์เน็ต": 101000
      },
      "พฤษภาคม": {
        "ค่าไฟฟ้า": 910000,
        "ค่าน้ำประปา": 48000,
        "ค่าโทรศัพท์": 78000,
        "ค่าโทรสื่อสาร": 93000,
        "ค่าอินเทอร์เน็ต": 103000
      },
      "มิถุนายน": {
        "ค่าไฟฟ้า": 920000,
        "ค่าน้ำประปา": 50000,
        "ค่าโทรศัพท์": 80000,
        "ค่าโทรสื่อสาร": 95000,
        "ค่าอินเทอร์เน็ต": 105000
      }
    },
    Q4: {
      "กรกฎาคม": {
        "ค่าไฟฟ้า": 930000,
        "ค่าน้ำประปา": 52000,
        "ค่าโทรศัพท์": 82000,
        "ค่าโทรสื่อสาร": 97000,
        "ค่าอินเทอร์เน็ต": 107000
      },
      "สิงหาคม": {
        "ค่าไฟฟ้า": 940000,
        "ค่าน้ำประปา": 54000,
        "ค่าโทรศัพท์": 84000,
        "ค่าโทรสื่อสาร": 99000,
        "ค่าอินเทอร์เน็ต": 109000
      },
      "กันยายน": {
        "ค่าไฟฟ้า": 950000,
        "ค่าน้ำประปา": 56000,
        "ค่าโทรศัพท์": 86000,
        "ค่าโทรสื่อสาร": 101000,
        "ค่าอินเทอร์เน็ต": 111000
      }
    }
  };
};

export default function BudgetPlanDetail() {
  const [budgetData, setBudgetData] = useState<BudgetData>(generateBudgetData());
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleEditStart = (quarter: string, month: string, category: string) => {
    const cellKey = `${quarter}-${month}-${category}`;
    setEditingCell(cellKey);
    setEditValue(budgetData[quarter][month][category].toString());
  };

  const handleEditSave = (quarter: string, month: string, category: string) => {
    const newValue = parseInt(editValue) || 0;
    
    setBudgetData((prev: BudgetData) => ({
      ...prev,
      [quarter]: {
        ...prev[quarter],
        [month]: {
          ...prev[quarter][month],
          [category]: newValue
        }
      }
    }));
    
    setEditingCell(null);
    setEditValue('');
  };

  const handleEditCancel = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString();
  };

  const calculateQuarterTotal = (quarter: string, category: string) => {
    return months[quarter as keyof typeof months].reduce((total, month) => {
      return total + (budgetData[quarter][month][category] || 0);
    }, 0);
  };

  const calculateMonthTotal = (quarter: string, month: string) => {
    return budgetCategories.reduce((total, category) => {
      return total + (budgetData[quarter][month][category] || 0);
    }, 0);
  };

  const calculateGrandTotal = (quarter: string) => {
    return months[quarter as keyof typeof months].reduce((total, month) => {
      return total + calculateMonthTotal(quarter, month);
    }, 0);
  };

  const handleFileUpload = (acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => {
      const isExcelFile = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                         file.type === 'application/vnd.ms-excel' ||
                         file.type === 'text/csv' ||
                         file.name.toLowerCase().endsWith('.xlsx') ||
                         file.name.toLowerCase().endsWith('.xls') ||
                         file.name.toLowerCase().endsWith('.csv');
      
      if (!isExcelFile) {
        console.error(`ไฟล์ ${file.name} ไม่ใช่ไฟล์ Excel ที่รองรับ`);
        return false;
      }
      
      return true;
    });

    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const handleUploadComplete = () => {
    if (uploadedFiles.length > 0) {
      // Process the uploaded files here
      console.log('Processing uploaded files:', uploadedFiles);
      
      // Example: You could read and parse the Excel files here
      uploadedFiles.forEach(file => {
        console.log(`Processing file: ${file.name}, Size: ${file.size} bytes`);
        // Add your Excel processing logic here
      });

      // Reset and close dialog
      setUploadedFiles([]);
      setIsUploadDialogOpen(false);
      
      // You could show a success message here
      alert('นำเข้าไฟล์สำเร็จ');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="bg-white border-b shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">แผนงบประมาณรายไตรมาส</h1>
              <p className="text-sm text-gray-600 mt-1">
                ประจำปีงบประมาณ พ.ศ. 2568
              </p>
            </div>
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  นำเข้าแผน
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>นำเข้าแผนการใช้จ่ายงบประมาณค่าสาธารณูปโภคของส่วนราชการ ที่ได้รับจัดสรร</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      เพิ่มไฟล์ของคุณที่นี่
                    </label>
                    
                    <Dropzone
                      accept={{ 
                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
                        'application/vnd.ms-excel': ['.xls'],
                        'text/csv': ['.csv']
                      }}
                      maxFiles={5}
                      maxSize={1024 * 1024 * 10} // 10MB
                      onDrop={handleFileUpload}
                      onError={(error) => console.error('Upload error:', error)}
                      src={uploadedFiles}
                      className="min-h-[200px]"
                    >
                      <DropzoneEmptyState />
                      <DropzoneContent />
                    </Dropzone>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-3 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
                      </span>
                      <span>รองรับเฉพาะไฟล์: Excel</span>
                    </div>
                  </div>

                  <div className="flex justify-center  gap-3 pt-4">
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700 w-full"
                      onClick={handleUploadComplete}
                      disabled={uploadedFiles.length === 0}
                    >
                      อัปโหลด
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className=" space-y-6">
        {/* แสดงแต่ละไตรมาสเป็นตารางแยกกัน */}
        {quarters.map(quarter => (
          <Card key={quarter}>
            <div className="p border-b bg-gradient-to-r from-blue-50 to-indigo-50">
              <h3 className="text-lg font-semibold text-gray-800 text-center flex items-center justify-center gap-2">
                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                  Q{quarter.slice(-1)}
                </Badge>
                ไตรมาสที่ {quarter.slice(-1)}
              </h3>
            </div>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-center font-medium text-gray-700">
                      ประเภทค่าใช้จ่าย
                    </TableHead>
                    {months[quarter as keyof typeof months].map(month => (
                      <TableHead key={month} className="text-center font-medium text-gray-700 min-w-[120px]">
                        {month}
                      </TableHead>
                    ))}
                    <TableHead className="text-center font-medium text-gray-700 bg-blue-50 min-w-[120px]">
                      รวม {quarter}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {budgetCategories.map(category => (
                    <TableRow key={`${quarter}-${category}`}>
                      <TableCell className="font-medium text-center">
                        {category}
                      </TableCell>
                      
                      {/* Monthly columns */}
                      {months[quarter as keyof typeof months].map(month => {
                        const cellKey = `${quarter}-${month}-${category}`;
                        const amount = budgetData[quarter][month][category];
                        const isEditing = editingCell === cellKey;
                        
                        return (
                          <TableCell key={month} className="text-center">
                            {isEditing ? (
                              <div className="flex items-center gap-1">
                                <Input
                                  type="number"
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  className="w-24 h-8 text-sm"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      handleEditSave(quarter, month, category);
                                    } else if (e.key === 'Escape') {
                                      handleEditCancel();
                                    }
                                  }}
                                  autoFocus
                                />
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0 text-green-600 hover:bg-green-50"
                                  onClick={() => handleEditSave(quarter, month, category)}
                                >
                                  ✓
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0 text-red-600 hover:bg-red-50"
                                  onClick={handleEditCancel}
                                >
                                  ✕
                                </Button>
                              </div>
                            ) : (
                              <div 
                                className="cursor-pointer hover:bg-blue-50 rounded px-2 py-1 transition-colors"
                                onClick={() => handleEditStart(quarter, month, category)}
                              >
                                {amount === 0 ? (
                                  <span className="text-gray-400">-</span>
                                ) : (
                                  <span className="font-mono">{formatCurrency(amount)}</span>
                                )}
                              </div>
                            )}
                          </TableCell>
                        );
                      })}
                      
                      {/* Quarter total */}
                      <TableCell className="text-center bg-blue-50 font-semibold">
                        <span className="font-mono text-blue-700">
                          {formatCurrency(calculateQuarterTotal(quarter, category))}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {/* Quarter total row */}
                  <TableRow className="bg-gray-50 font-bold border-t-2">
                    <TableCell className="font-bold text-center text-gray-800">
                      รวม
                    </TableCell>
                    {months[quarter as keyof typeof months].map(month => (
                      <TableCell key={month} className="text-center font-semibold">
                        <span className="font-mono">
                          {formatCurrency(calculateMonthTotal(quarter, month))}
                        </span>
                      </TableCell>
                    ))}
                    <TableCell className="text-center bg-blue-100 font-bold">
                      <span className="font-mono text-blue-900">
                        {formatCurrency(calculateGrandTotal(quarter))}
                      </span>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
        
        {/* สรุปรวมทั้งปี */}
        <Card className="shadow-lg ">
          <div className="">
            <h3 className="text-lg font-semibold text-blue-800 text-center flex items-center justify-center gap-2">
              <Badge className=" text-white">
                สรุป
              </Badge>
              สรุปรวมทั้งปี งบประมาณ พ.ศ. 2568
            </h3>
          </div>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-50">
                  <TableHead className="text-left font-medium text-gray-700">
                    ประเภทค่าใช้จ่าย
                  </TableHead>
                  <TableHead className="text-center font-medium text-gray-700 bg-blue-100 min-w-[150px]">
                    รวมทั้งปี
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {budgetCategories.map(category => (
                  <TableRow key={`summary-${category}`}>
                    <TableCell className="font-medium">
                      {category}
                    </TableCell>
                    <TableCell className="text-center bg-blue-50 font-semibold text-lg">
                      <span className="font-mono text-blue-700">
                        {formatCurrency(
                          quarters.reduce((total, quarter) => 
                            total + calculateQuarterTotal(quarter, category), 0
                          )
                        )}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
                
                {/* Grand total row */}
                <TableRow className="bg-blue-100 font-bold border-t-2">
                  <TableCell className="font-bold text-blue-800 text-lg">
                    รวมทั้งหมด
                  </TableCell>
                  <TableCell className="text-center bg-blue-200 font-bold text-xl">
                    <span className="font-mono text-blue-900">
                      {formatCurrency(
                        quarters.reduce((total, quarter) => 
                          total + calculateGrandTotal(quarter), 0
                        )
                      )}
                    </span>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
