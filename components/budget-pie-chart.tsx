"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DashboardData {
  year2568: number
  year2569: number
  year2570: number
  total: number
  pieChartData: Array<{
    name: string
    value: number
    color: string
    percentage: string
  }>
}

interface BudgetPieChartProps {
  data: DashboardData
}

export function BudgetPieChart({ data }: BudgetPieChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">แผนภูมิการแจกแจงงบประมาณตรวจสอบ 3 ปีย้อนหลัง</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.pieChartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                dataKey="value"
              >
                {data.pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [value.toLocaleString(), 'บาท']}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">2,539,629</div>
              <div className="text-sm text-gray-600">บาท</div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="absolute bottom-4 left-4 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-cyan-500 rounded"></div>
              <span className="text-sm">2570</span>
              <span className="text-sm font-medium">989,963</span>
              <span className="text-sm text-cyan-500">38.98%</span>
            </div>
          </div>
          
          <div className="absolute bottom-4 right-4 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded"></div>
              <span className="text-sm">2568</span>
              <span className="text-sm font-medium">708,030</span>
              <span className="text-sm text-purple-500">27.88%</span>
            </div>
          </div>
          
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-400 rounded"></div>
              <span className="text-sm">2569</span>
              <span className="text-sm font-medium">841,636</span>
              <span className="text-sm text-red-400">33.14%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}