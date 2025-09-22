"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface AuditDataItem {
  id: number
  agency: string
  topic: string
  score?: string
  note?: string
}

interface AuditDataTableProps {
  title: string
  data: AuditDataItem[]
  onRowClick?: (id: number) => void
  showScore?: boolean
  showNote?: boolean
  className?: string
}

export function AuditDataTable({
  title,
  data,
  onRowClick,
  showScore = false,
  showNote = false,
  className = ""
}: AuditDataTableProps) {
  return (
    <div className={className}>
      <h3 className="font-medium mb-3 sm:mb-4 text-sm sm:text-base">{title}</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs sm:text-sm">ลำดับ</TableHead>
              <TableHead className="text-xs sm:text-sm min-w-[120px]">หน่วยงาน/กิจกรรม/โครงการ</TableHead>
              <TableHead className="text-xs sm:text-sm min-w-[150px]">หัวข้อของงานตรวจสอบ</TableHead>
              {showScore && <TableHead className="text-xs sm:text-sm">คะแนน</TableHead>}
              {showNote && <TableHead className="text-xs sm:text-sm">หมายเหตุ</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow 
                key={item.id}
                className={`${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                onClick={() => onRowClick?.(item.id)}
              >
                <TableCell className="text-xs sm:text-sm">{item.id}</TableCell>
                <TableCell className="text-xs sm:text-sm font-medium">{item.agency}</TableCell>
                <TableCell className="text-xs sm:text-sm">{item.topic}</TableCell>
                {showScore && (
                  <TableCell className="text-xs sm:text-sm text-center">
                    {item.score && item.score !== "-" && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {item.score}
                      </span>
                    )}
                    {item.score === "-" && <span className="text-gray-400">-</span>}
                  </TableCell>
                )}
                {showNote && (
                  <TableCell className="text-xs sm:text-sm text-gray-600">
                    {item.note === "-" ? <span className="text-gray-400">-</span> : item.note}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}