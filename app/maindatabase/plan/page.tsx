"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Eye } from "lucide-react"

// ข้อมูลแผนการใช้จ่ายงบประมาณ
const budgetPlans = [
    {
        id: 1,
        planName: "แผนการใช้จ่ายงบประมาณสำหรับการปฏิบัติภารกิจหลัก ราชการปกติการจัดการ",
        year: "2568",
        lastModified: "20/06/2568 14:00 น."
    },
    {
        id: 2,
        planName: "แผนการใช้จ่ายงบประมาณสำหรับการพัฒนาบุคลากร",
        year: "2568", 
        lastModified: "15/06/2568 10:30 น."
    },
    {
        id: 3,
        planName: "แผนการใช้จ่ายงบประมาณสำหรับการบำรุงรักษาครุภัณฑ์",
        year: "2568",
        lastModified: "10/06/2568 16:45 น."
    },
    {
        id: 4,
        planName: "แผนการใช้จ่ายงบประมาณสำหรับการจัดซื้อวัสดุสำนักงาน",
        year: "2568",
        lastModified: "05/06/2568 09:20 น."
    },
    {
        id: 5,
        planName: "แผนการใช้จ่ายงบประมาณสำหรับกิจกรรมประชาสัมพันธ์",
        year: "2568",
        lastModified: "01/06/2568 11:15 น."
    }
]

export default function PlanPage() {
    const [plans, setPlans] = useState(budgetPlans)
    const router = useRouter()

    const handleView = (planId: number, planName: string) => {
        router.push(`/maindatabase/plan/budgetplan?id=${planId}&name=${encodeURIComponent(planName)}`)
    }

    const handleEdit = (id: number) => {
        console.log("แก้ไขแผน ID:", id)
    }

    const handleDelete = (id: number) => {
        setPlans(plans.filter(plan => plan.id !== id))
    }

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {/* Header */}
            <div className="flex justify-between items-center mt-4 mb-4">
                <h1 className="text-xl font-semibold text-gray-800">
                    รายการแผนการใช้จ่ายงบประมาณที่ได้รับจัดสรร
                </h1>
                <Button className="bg-[#3E52B9] hover:bg-[#2A3A8F] text-white">
                    เพิ่มแผนการใช้จ่ายงบประมาณ
                </Button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border shadow-sm">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead className="w-[80px] text-center font-medium text-gray-700">
                                ลำดับ
                            </TableHead>
                            <TableHead className="font-medium text-gray-700">
                                ชื่อแผนการใช้จ่ายงบประมาณ
                            </TableHead>
                            <TableHead className="w-[150px] text-center font-medium text-gray-700">
                                ปีงบประมาณ
                            </TableHead>
                            <TableHead className="w-[200px] text-center font-medium text-gray-700">
                                แก้ไขล่าสุด
                            </TableHead>
                            <TableHead className="w-[150px] text-center font-medium text-gray-700">
                                การดำเนินการ
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {plans.map((plan, index) => (
                            <TableRow 
                                key={plan.id} 
                                className="hover:bg-gray-50 cursor-pointer"
                                onClick={() => handleView(plan.id, plan.planName)}
                            >
                                <TableCell className="text-center font-medium">
                                    {index + 1}
                                </TableCell>
                                <TableCell className="max-w-[400px]">
                                    <div className="truncate" title={plan.planName}>
                                        {plan.planName}
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    {plan.year}
                                </TableCell>
                                <TableCell className="text-center text-sm text-gray-600">
                                    {plan.lastModified}
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleView(plan.id, plan.planName)
                                            }}
                                            title="ดูรายละเอียด"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleEdit(plan.id)
                                            }}
                                            title="แก้ไข"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleDelete(plan.id)
                                            }}
                                            title="ลบ"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Footer spacing */}
            <div className="h-4" />
        </div>
    )
}