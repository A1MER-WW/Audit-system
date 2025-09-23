"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface LineChartData {
  year: string
  [key: string]: string | number
}

interface BudgetLineChartProps {
  data: LineChartData[]
  colors: string[]
}

export function BudgetLineChart({ data, colors }: BudgetLineChartProps) {
  const lineKeys = Object.keys(data[0] || {}).filter(key => key !== 'year')

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">เปรียบเทียบงบประมาณการตรวจสอบ 3 ปีย้อนหลัง (จำนวนชั่วโมงที่ดำการ)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 60,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="year" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10 }}
                tickFormatter={(value) => `${(value / 1000)}k`}
              />
              <Tooltip 
                formatter={(value: number, name: string) => [value.toLocaleString(), name]}
                labelFormatter={(label) => `ปี ${label}`}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}
              />
              {lineKeys.map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  dot={{ fill: colors[index % colors.length], strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: colors[index % colors.length], strokeWidth: 2 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}