"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AuditBarChart } from '@/components/audit-bar-chart'
import { StatsSummaryCard } from '@/components/stats-summary-card'
import { YearSelector } from '@/components/year-selector'
import { AuditDataTable } from '@/components/audit-data-table'
import { TabNavigation } from '@/components/tab-navigation'
import { auditItemsAPI, dashboardAPI } from '@/lib/api'
import { AuditItem } from '@/lib/types'

export default function PlanauditPage() {
  const router = useRouter()
  const [selectedYear, setSelectedYear] = useState<string>("2568")
  const [activeTab, setActiveTab] = useState<string>("all")
  const [auditItems, setAuditItems] = useState<AuditItem[]>([])
  // TODO: Replace with proper chart and summary data types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [chartData, setChartData] = useState<any[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [summaryData, setSummaryData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch data when component mounts or year changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch audit items for the selected year
        const itemsResponse = await auditItemsAPI.getAll({
          fiscalYear: parseInt(selectedYear),
          limit: 50
        })
        setAuditItems(itemsResponse.data)

        // Fetch chart data
        const chartResponse = await dashboardAPI.getAuditUniverseBar()
        setChartData(chartResponse.data)

        // Fetch summary data
        const summaryResponse = await dashboardAPI.getSummary()
        setSummaryData(summaryResponse.data)

        setError(null)
      } catch (err) {
        setError('ไม่สามารถโหลดข้อมูลได้')
        console.error('PlanAudit API Error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedYear])

  // Filter audit items based on active tab
  const filteredAuditItems = React.useMemo(() => {
    if (activeTab === "all") return auditItems
    
    // Add filtering logic based on your tabs
    return auditItems.filter(item => {
      switch (activeTab) {
        case "หน่วยงาน":
          return item.department.includes("กอง")
        case "งาน":
          return item.auditTopic.includes("งาน")
        default:
          return true
      }
    })
  }, [auditItems, activeTab])

  const handleRowClick = (id: number) => {
    router.push(`/planaudit/${id}`)
  }

  const tabs = [
    { id: "all", label: "ทั้งหมด" },
    { id: "หน่วยงาน", label: "หน่วยงาน" },
    { id: "งาน", label: "งาน" },
    { id: "โครงการ", label: "โครงการ" },
    { id: "โครงการลงทุนสาธารณูปโภค", label: "โครงการลงทุนสาธารณูปโภค" },
    { id: "กิจกรรม", label: "กิจกรรม" },
    { id: "การบริหาร", label: "การบริหาร" },
    { id: "IT และ Non-IT", label: "IT และ Non-IT" }
  ]

  // Convert API data to table format
  const convertToTableData = (items: AuditItem[], showScoreAndNote: boolean) => {
    return items.map((item, index) => ({
      id: parseInt(item.id.split('-')[1]) || index + 1,
      agency: item.department.substring(0, 4) + ".",
      topic: item.auditTopic,
      score: showScoreAndNote ? `${item.score || 0}/100` : undefined,
      note: showScoreAndNote ? item.notes || "-" : undefined
    }))
  }

  // Get audit items for 2567 for comparison
  const [auditItems2567, setAuditItems2567] = useState<AuditItem[]>([])
  
  useEffect(() => {
    const fetchData2567 = async () => {
      try {
        const response = await auditItemsAPI.getAll({
          fiscalYear: 2567,
          limit: 50
        })
        setAuditItems2567(response.data)
      } catch (err) {
        console.error('Error fetching 2567 data:', err)
      }
    }

    fetchData2567()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">กำลังโหลดข้อมูล...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-2 sm:p-4 pt-0">
      {/* Year Selection */}
      <div className="mt-2 mb-4">
        <h1 className="text-lg sm:text-xl font-semibold">แผนการตรวจสอบภายใน</h1>
        <YearSelector
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Chart Section */}
        <AuditBarChart data={chartData} />

        {/* Statistics Summary Card */}
        <StatsSummaryCard 
          title="สรุปข้อมูลหัวข้องานตรวจสอบภายใน"
          data={summaryData}
        />
      </div>
      {/* Bottom Section - Full Width Table */}
      <Card className="col-span-full">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <CardTitle className="text-base sm:text-lg">ความครอบคลุมการปรับปรุงหัวข้อของงานตรวจสอบภายในหัวข้อต่างๆ</CardTitle>
          <Link href="/planaudit/audittopics">
            <Button size="sm" className="bg-[#3E52B9] hover:bg-[#2A3A8F] text-white">
              อัปเดตข้อมูลการสำรวจงานตรวจสอบ
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
            เปรียบเทียบปีงบประมาณ 2567 กับ ปีงบประมาณ {selectedYear}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
            สถานะ: <span className="text-blue-600 underline cursor-pointer">
              {filteredAuditItems.length > 0 ? 'มีข้อมูล' : 'ไม่มีข้อมูล'}
            </span>
          </div>

          {/* Tabs */}
          <TabNavigation
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Years comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
            {/* Year 2567 */}
            <AuditDataTable
              title="ปีงบประมาณ 2567"
              data={convertToTableData(auditItems2567, false)}
              onRowClick={handleRowClick}
              showScore={false}
              showNote={false}
            />

            {/* Current Year */}
            <AuditDataTable
              title={`ปีงบประมาณ ${selectedYear}`}
              data={convertToTableData(filteredAuditItems, true)}
              onRowClick={handleRowClick}
              showScore={true}
              showNote={true}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
