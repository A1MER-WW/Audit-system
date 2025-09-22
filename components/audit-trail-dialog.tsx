"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { History } from 'lucide-react'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'

interface AuditTrailItem {
  id: number
  action: string
  user: string
  role: string
  timestamp: string
  description: string
}

interface AuditTrailDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  auditTrailData: AuditTrailItem[]
}

export function AuditTrailDialog({ isOpen, onOpenChange, auditTrailData }: AuditTrailDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg flex items-center gap-2">
            <History className="h-5 w-5" />
            Audit Trail - ประวัติการดำเนินการ
          </DialogTitle>
          <DialogDescription>
            ประวัติการดำเนินการทั้งหมดของแผนการตรวจสอบระยะยาว
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ลำดับ</TableHead>
                <TableHead>การดำเนินการ</TableHead>
                <TableHead>ผู้ดำเนินการ</TableHead>
                <TableHead>ตำแหน่ง</TableHead>
                <TableHead>วันที่และเวลา</TableHead>
                <TableHead>รายละเอียด</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditTrailData.map((trail, index) => (
                <TableRow key={trail.id}>
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {trail.action === 'อนุมัติแผน' && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                      {trail.action === 'ส่งขออนุมัติ' && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                      {(trail.action === 'สร้างแผนการตรวจสอบ' || trail.action === 'แก้ไขข้อมูลงบประมาณ') && (
                        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                      )}
                      <span className="font-medium">{trail.action}</span>
                    </div>
                  </TableCell>
                  <TableCell>{trail.user}</TableCell>
                  <TableCell>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {trail.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{trail.timestamp.split(' ')[0]}</div>
                      <div className="text-gray-500">{trail.timestamp.split(' ')[1]}</div>
                    </div>
                  </TableCell>
                  <TableCell>{trail.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">สรุปการดำเนินการ</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">สร้างเมื่อ:</span>
                <div className="font-medium">15 ก.ย. 2024 เวลา 09:30</div>
              </div>
              <div>
                <span className="text-gray-600">อนุมัติเมื่อ:</span>
                <div className="font-medium text-green-600">19 ก.ย. 2024 เวลา 16:20</div>
              </div>
              <div>
                <span className="text-gray-600">ระยะเวลาดำเนินการ:</span>
                <div className="font-medium">4 วัน</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            ปิด
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}