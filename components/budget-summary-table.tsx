"use client"

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'

interface BudgetItem {
  item: string
  budget2568: number
  budget2569: number
  budget2570: number
  remark?: string
}

interface BudgetSummaryTableProps {
  budgetData: BudgetItem[]
  totalBudget2568: number
  totalBudget2569: number
  totalBudget2570: number
}

export function BudgetSummaryTable({ 
  budgetData, 
  totalBudget2568, 
  totalBudget2569, 
  totalBudget2570 
}: BudgetSummaryTableProps) {
  return (
    <div>
      <h3 className="font-medium mb-4">สรุปแผนการใช้งบประมาณและกำลังคน</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ลำดับ</TableHead>
            <TableHead>ประเด็นการตรวจสอบ</TableHead>
            <TableHead>หน่วยงานที่รับตรวจ</TableHead>
            <TableHead className="text-center">ปี 2568</TableHead>
            <TableHead className="text-center">ปี 2569</TableHead>
            <TableHead className="text-center">ปี 2570</TableHead>
            <TableHead>หมายเหตุ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {budgetData.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="text-center">{index + 1}</TableCell>
              <TableCell>{item.item}</TableCell>
              <TableCell>-</TableCell>
              <TableCell className="text-right">{item.budget2568.toLocaleString()}</TableCell>
              <TableCell className="text-right">{item.budget2569.toLocaleString()}</TableCell>
              <TableCell className="text-right">{item.budget2570.toLocaleString()}</TableCell>
              <TableCell>{item.remark || ''}</TableCell>
            </TableRow>
          ))}
          <TableRow className="bg-blue-50 font-medium">
            <TableCell colSpan={3} className="text-center">รวมทั้งหมด</TableCell>
            <TableCell className="text-right">{totalBudget2568.toLocaleString()}</TableCell>
            <TableCell className="text-right">{totalBudget2569.toLocaleString()}</TableCell>
            <TableCell className="text-right">{totalBudget2570.toLocaleString()}</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}