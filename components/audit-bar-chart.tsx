"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { FileText } from 'lucide-react'

interface AuditBarChartData {
  name: string
  ปีงบประมาณ2567: number
  ปีงบประมาณ2568: number
}

interface AuditBarChartProps {
  data: AuditBarChartData[]
  title?: string
  description?: string
  year1Label?: string
  year2Label?: string
  year1Color?: string
  year2Color?: string
}

export function AuditBarChart({
  data,
  title = "ความเห็นข้อสังเกตการตรวจสอบ (Audit Universe)",
  description = "เปรียบเทียบข้อมูลปีงบประมาณ 2567 กับ ปีงบประมาณ 2568",
  year1Label = "ปีงบประมาณ 2567",
  year2Label = "ปีงบประมาณ 2568",
  year1Color = "#FF8C42",
  year2Color = "#2F335D"
}: AuditBarChartProps) {
  const hasData = data && data.length > 0 && data.some(item => item.ปีงบประมาณ2567 > 0 || item.ปีงบประมาณ2568 > 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">
          {title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="w-full h-80">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                barCategoryGap="20%"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: '#666' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  axisLine={{ stroke: '#e0e0e0' }}
                  tickLine={{ stroke: '#e0e0e0' }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#666' }}
                  axisLine={{ stroke: '#e0e0e0' }}
                  tickLine={{ stroke: '#e0e0e0' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                />
                <Bar
                  dataKey="ปีงบประมาณ2567"
                  fill={year1Color}
                  name={year1Label}
                  radius={[2, 2, 0, 0]}
                  maxBarSize={40}
                />
                <Bar
                  dataKey="ปีงบประมาณ2568"
                  fill={year2Color}
                  name={year2Label}
                  radius={[2, 2, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">ไม่มีข้อมูล</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}