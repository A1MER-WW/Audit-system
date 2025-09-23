"use client"

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'

interface AuditPlan {
  id: number
  topic: string
  unit: string
  year2568: boolean
  year2569: boolean
  year2570: boolean
  remark: string
}

interface AuditPlanTableProps {
  title: string
  auditPlans: AuditPlan[]
  showSlice?: boolean
  sliceCount?: number
}

export function AuditPlanTable({ title, auditPlans, showSlice = false, sliceCount = 10 }: AuditPlanTableProps) {
  const displayData = showSlice ? auditPlans.slice(0, sliceCount) : auditPlans

  return (
    <div>
      <h3 className="font-medium mb-4">{title}</h3>
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
          {displayData.map((plan, index) => (
            <TableRow key={plan.id}>
              <TableCell className="text-center">{index + 1}</TableCell>
              <TableCell>{plan.topic}</TableCell>
              <TableCell>{plan.unit}</TableCell>
              <TableCell className="text-center">
                {plan.year2568 && <span className="text-green-600">✓</span>}
              </TableCell>
              <TableCell className="text-center">
                {plan.year2569 && <span className="text-green-600">✓</span>}
              </TableCell>
              <TableCell className="text-center">
                {plan.year2570 && <span className="text-green-600">✓</span>}
              </TableCell>
              <TableCell>{plan.remark}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}