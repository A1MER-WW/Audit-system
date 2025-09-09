"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Edit, Trash2, Calculator, ArrowLeft } from "lucide-react";

interface BudgetLineItem {
  id: string;
  category: string;
  subCategory: string;
  description: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  quarter: "Q1" | "Q2" | "Q3" | "Q4";
  month: string;
  remarks?: string;
}

interface BudgetPlan {
  id: string;
  planName: string;
  totalBudget: number;
  status: "Draft" | "Submitted" | "Approved" | "Rejected";
  createdDate: string;
  lastModified: string;
  description?: string;
}

const categories = [
  "ค่าใช้จ่ายด้านบุคลากร",
  "ค่าใช้จ่ายด้านวัสดุ",
  "ค่าใช้จ่ายด้านครุภัณฑ์",
  "ค่าสาธารณูปโภค",
  "ค่าใช้จ่ายอื่นๆ"
];

const subCategories: Record<string, string[]> = {
  "ค่าใช้จ่ายด้านบุคลากร": ["เงินเดือน", "โบนัส", "ค่าล่วงเวลา", "ประกันสังคม", "ค่าเบี้ยเลี้ยง"],
  "ค่าใช้จ่ายด้านวัสดุ": ["วัสดุสำนักงาน", "วัสดุการแพทย์", "วัสดุก่อสร้าง", "วัสดุคอมพิวเตอร์"],
  "ค่าใช้จ่ายด้านครุภัณฑ์": ["เครื่องใช้สำนักงาน", "อุปกรณ์คอมพิวเตอร์", "เครื่องจักร", "ยานพาหนะ"],
  "ค่าสาธารณูปโภค": ["ค่าไฟฟ้า", "ค่าน้ำประปา", "ค่าโทรศัพท์", "ค่าอินเทอร์เน็ต"],
  "ค่าใช้จ่ายอื่นๆ": ["ค่าซ่อมแซม", "ค่าเบ็ดเตล็ด", "ค่าฝึกอบรม", "ค่าประชาสัมพันธ์"]
};

const quarters = ["Q1", "Q2", "Q3", "Q4"];
const months = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
];

export default function BudgetPlanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get("id");
  
  const [budgetPlan, setBudgetPlan] = useState<BudgetPlan | null>(null);
  const [lineItems, setLineItems] = useState<BudgetLineItem[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BudgetLineItem | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [formData, setFormData] = useState({
    category: "",
    subCategory: "",
    description: "",
    unit: "",
    quantity: 0,
    unitPrice: 0,
    quarter: "Q1" as "Q1" | "Q2" | "Q3" | "Q4",
    month: "",
    remarks: ""
  });

  useEffect(() => {
    // Mock data load
    setTimeout(() => {
      setBudgetPlan({
        id: planId || "1",
        planName: "แผนงบประมาณประจำปี 2567",
        totalBudget: 2850000,
        status: "Draft",
        createdDate: "2024-01-15",
        lastModified: "2024-01-20",
        description: "แผนงบประมาณสำหรับการดำเนินงานประจำปี 2567"
      });

      setLineItems([
        {
          id: "1",
          category: "ค่าใช้จ่ายด้านบุคลากร",
          subCategory: "เงินเดือน",
          description: "เงินเดือนพนักงานประจำ",
          unit: "คน",
          quantity: 20,
          unitPrice: 35000,
          totalPrice: 700000,
          quarter: "Q1",
          month: "มกราคม",
          remarks: "เงินเดือนเต็มเดือน"
        },
        {
          id: "2",
          category: "ค่าใช้จ่ายด้านวัสดุ",
          subCategory: "วัสดุสำนักงาน",
          description: "กระดาษ A4 และอุปกรณ์สำนักงาน",
          unit: "ชุด",
          quantity: 50,
          unitPrice: 1500,
          totalPrice: 75000,
          quarter: "Q1",
          month: "มกราคม",
          remarks: ""
        },
        {
          id: "3",
          category: "ค่าสาธารณูปโภค",
          subCategory: "ค่าไฟฟ้า",
          description: "ค่าไฟฟ้าอาคารสำนักงาน",
          unit: "เดือน",
          quantity: 1,
          unitPrice: 45000,
          totalPrice: 45000,
          quarter: "Q1",
          month: "มกราคม",
          remarks: "ประมาณการจากปีที่แล้ว"
        }
      ]);
      setLoading(false);
    }, 1000);
  }, [planId]);

  const getTotalBudget = () => {
    return lineItems.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const getTotalByCategory = (category: string) => {
    return lineItems
      .filter(item => item.category === category)
      .reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const handleAddItem = () => {
    const newItem: BudgetLineItem = {
      id: Date.now().toString(),
      category: formData.category,
      subCategory: formData.subCategory,
      description: formData.description,
      unit: formData.unit,
      quantity: formData.quantity,
      unitPrice: formData.unitPrice,
      totalPrice: formData.quantity * formData.unitPrice,
      quarter: formData.quarter,
      month: formData.month,
      remarks: formData.remarks
    };

    setLineItems([...lineItems, newItem]);
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditItem = () => {
    if (!editingItem) return;

    const updatedItem: BudgetLineItem = {
      ...editingItem,
      category: formData.category,
      subCategory: formData.subCategory,
      description: formData.description,
      unit: formData.unit,
      quantity: formData.quantity,
      unitPrice: formData.unitPrice,
      totalPrice: formData.quantity * formData.unitPrice,
      quarter: formData.quarter,
      month: formData.month,
      remarks: formData.remarks
    };

    setLineItems(lineItems.map(item => 
      item.id === editingItem.id ? updatedItem : item
    ));
    setIsEditDialogOpen(false);
    setEditingItem(null);
    resetForm();
  };

  const handleDeleteItem = (id: string) => {
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  const openEditDialog = (item: BudgetLineItem) => {
    setEditingItem(item);
    setFormData({
      category: item.category,
      subCategory: item.subCategory,
      description: item.description,
      unit: item.unit,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      quarter: item.quarter,
      month: item.month,
      remarks: item.remarks || ""
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      category: "",
      subCategory: "",
      description: "",
      unit: "",
      quantity: 0,
      unitPrice: 0,
      quarter: "Q1",
      month: "",
      remarks: ""
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft": return "bg-gray-100 text-gray-800";
      case "Submitted": return "bg-blue-100 text-blue-800";
      case "Approved": return "bg-green-100 text-green-800";
      case "Rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">กำลังโหลด...</div>
        </div>
      </div>
    );
  }

  if (!budgetPlan) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">ไม่พบข้อมูลแผนงบประมาณ</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            กลับ
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{budgetPlan.planName}</h1>
            <p className="text-sm text-gray-600">
              สร้างเมื่อ: {new Date(budgetPlan.createdDate).toLocaleDateString('th-TH')} | 
              แก้ไขล่าสุด: {new Date(budgetPlan.lastModified).toLocaleDateString('th-TH')}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Badge className={getStatusColor(budgetPlan.status)}>
            {budgetPlan.status}
          </Badge>
          <Button size="sm">
            <Calculator className="h-4 w-4 mr-2" />
            บันทึก
          </Button>
        </div>
      </div>

      {/* Budget Summary */}
      <Card>
        <CardHeader>
          <CardTitle>สรุปงบประมาณ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                ฿{getTotalBudget().toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">งบประมาณรวม</div>
            </div>
            {categories.map(category => (
              <div key={category} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-lg font-semibold">
                  ฿{getTotalByCategory(category).toLocaleString()}
                </div>
                <div className="text-xs text-gray-600">{category}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Budget Line Items */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>รายการงบประมาณ</CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  เพิ่มรายการ
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>เพิ่มรายการงบประมาณ</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">หมวดหมู่</Label>
                    <Select value={formData.category} onValueChange={(value) => {
                      setFormData({...formData, category: value, subCategory: ""});
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกหมวดหมู่" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="subCategory">หมวดหมู่ย่อย</Label>
                    <Select 
                      value={formData.subCategory} 
                      onValueChange={(value) => setFormData({...formData, subCategory: value})}
                      disabled={!formData.category}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกหมวดหมู่ย่อย" />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.category && subCategories[formData.category]?.map(subCat => (
                          <SelectItem key={subCat} value={subCat}>{subCat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="description">รายละเอียด</Label>
                    <Textarea 
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="อธิบายรายละเอียดของรายการ"
                    />
                  </div>
                  <div>
                    <Label htmlFor="unit">หน่วย</Label>
                    <Input 
                      value={formData.unit}
                      onChange={(e) => setFormData({...formData, unit: e.target.value})}
                      placeholder="เช่น คน, ชุด, เดือน"
                    />
                  </div>
                  <div>
                    <Label htmlFor="quantity">จำนวน</Label>
                    <Input 
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="unitPrice">ราคาต่อหน่วย</Label>
                    <Input 
                      type="number"
                      value={formData.unitPrice}
                      onChange={(e) => setFormData({...formData, unitPrice: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="totalPrice">ราคารวม</Label>
                    <Input 
                      type="number"
                      value={formData.quantity * formData.unitPrice}
                      disabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="quarter">ไตรมาส</Label>
                    <Select value={formData.quarter} onValueChange={(value: any) => setFormData({...formData, quarter: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {quarters.map(q => (
                          <SelectItem key={q} value={q}>{q}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="month">เดือน</Label>
                    <Select value={formData.month} onValueChange={(value) => setFormData({...formData, month: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกเดือน" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map(month => (
                          <SelectItem key={month} value={month}>{month}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="remarks">หมายเหตุ</Label>
                    <Input 
                      value={formData.remarks}
                      onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                      placeholder="หมายเหตุเพิ่มเติม (ถ้ามี)"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    ยกเลิก
                  </Button>
                  <Button onClick={handleAddItem}>เพิ่มรายการ</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">ลำดับ</TableHead>
                <TableHead>หมวดหมู่</TableHead>
                <TableHead>หมวดหมู่ย่อย</TableHead>
                <TableHead>รายละเอียด</TableHead>
                <TableHead className="text-center">หน่วย</TableHead>
                <TableHead className="text-center">จำนวน</TableHead>
                <TableHead className="text-right">ราคาต่อหน่วย</TableHead>
                <TableHead className="text-right">ราคารวม</TableHead>
                <TableHead className="text-center">ไตรมาส</TableHead>
                <TableHead className="text-center">เดือน</TableHead>
                <TableHead className="text-center">การดำเนินการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lineItems.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.subCategory}</TableCell>
                  <TableCell className="max-w-xs truncate" title={item.description}>
                    {item.description}
                  </TableCell>
                  <TableCell className="text-center">{item.unit}</TableCell>
                  <TableCell className="text-center">{item.quantity.toLocaleString()}</TableCell>
                  <TableCell className="text-right">฿{item.unitPrice.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-semibold">฿{item.totalPrice.toLocaleString()}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{item.quarter}</Badge>
                  </TableCell>
                  <TableCell className="text-center">{item.month}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(item)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {lineItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-8 text-gray-500">
                    ยังไม่มีรายการงบประมาณ
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>แก้ไขรายการงบประมาณ</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">หมวดหมู่</Label>
              <Select value={formData.category} onValueChange={(value) => {
                setFormData({...formData, category: value, subCategory: ""});
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกหมวดหมู่" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="subCategory">หมวดหมู่ย่อย</Label>
              <Select 
                value={formData.subCategory} 
                onValueChange={(value) => setFormData({...formData, subCategory: value})}
                disabled={!formData.category}
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกหมวดหมู่ย่อย" />
                </SelectTrigger>
                <SelectContent>
                  {formData.category && subCategories[formData.category]?.map(subCat => (
                    <SelectItem key={subCat} value={subCat}>{subCat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label htmlFor="description">รายละเอียด</Label>
              <Textarea 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="อธิบายรายละเอียดของรายการ"
              />
            </div>
            <div>
              <Label htmlFor="unit">หน่วย</Label>
              <Input 
                value={formData.unit}
                onChange={(e) => setFormData({...formData, unit: e.target.value})}
                placeholder="เช่น คน, ชุด, เดือน"
              />
            </div>
            <div>
              <Label htmlFor="quantity">จำนวน</Label>
              <Input 
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: Number(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="unitPrice">ราคาต่อหน่วย</Label>
              <Input 
                type="number"
                value={formData.unitPrice}
                onChange={(e) => setFormData({...formData, unitPrice: Number(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="totalPrice">ราคารวม</Label>
              <Input 
                type="number"
                value={formData.quantity * formData.unitPrice}
                disabled
              />
            </div>
            <div>
              <Label htmlFor="quarter">ไตรมาส</Label>
              <Select value={formData.quarter} onValueChange={(value: any) => setFormData({...formData, quarter: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {quarters.map(q => (
                    <SelectItem key={q} value={q}>{q}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="month">เดือน</Label>
              <Select value={formData.month} onValueChange={(value) => setFormData({...formData, month: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกเดือน" />
                </SelectTrigger>
                <SelectContent>
                  {months.map(month => (
                    <SelectItem key={month} value={month}>{month}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label htmlFor="remarks">หมายเหตุ</Label>
              <Input 
                value={formData.remarks}
                onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                placeholder="หมายเหตุเพิ่มเติม (ถ้ามี)"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              ยกเลิก
            </Button>
            <Button onClick={handleEditItem}>บันทึกการแก้ไข</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}