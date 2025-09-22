"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface StatsSummaryData {
  year: string
  count: number
  label: string
  icon: LucideIcon
  iconColor: string
}

interface StatsSummaryCardProps {
  title: string
  data: StatsSummaryData[]
  className?: string
}

export function StatsSummaryCard({ 
  title, 
  data,
  className = ""
}: StatsSummaryCardProps) {
  return (
    <Card className={`lg:col-span-1 ${className}`}>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 flex">
        {data.map((item, index) => (
          <div key={index} className="p-3 sm:p-4 rounded-lg w-full">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className={`w-6 h-6 sm:w-8 sm:h-8 ${item.iconColor} rounded-full flex items-center justify-center`}>
                <item.icon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-medium">{item.label}</div>
                <div className="text-xs">{item.year}</div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-4xl font-bold mb-1">{item.count}</div>
              <div className="text-xs sm:text-sm">หัวข้อ</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}