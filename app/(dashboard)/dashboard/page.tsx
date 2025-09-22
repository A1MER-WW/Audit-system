"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AuditBarChart } from '@/components/audit-bar-chart'
import { StatsSummaryCard } from '@/components/stats-summary-card'
import { YearSelector } from '@/components/year-selector'
import { dashboardAPI } from '@/lib/api'

export default function DashboardPage() {
  const [selectedYear, setSelectedYear] = useState('2568')
  // TODO: Replace with proper dashboard data interface
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const response = await dashboardAPI.getAllData()
        
        if (response.success) {
          // Transform data to match component interfaces
          const transformedData = {
            ...response.data,
            // Transform summary data for StatsSummaryCard
            summary: response.data.summary.map((item, index) => ({
              year: selectedYear,
              count: item.value,
              label: item.title,
              icon: 'FileText', // Default icon
              iconColor: ['text-blue-600', 'text-green-600', 'text-yellow-600', 'text-red-600'][index % 4]
            })),
            // Transform audit universe data for AuditBarChart
            auditUniverseBar: response.data.auditUniverseBar.map(item => ({
              name: item.department,
              'ปีงบประมาณ2567': item.completed,
              'ปีงบประมาณ2568': item.pending
            }))
          }
          
          setDashboardData(transformedData)
        }
        setError(null)
      } catch (err) {
        setError('Failed to load dashboard data')
        console.error('Dashboard API Error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [selectedYear])

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

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">ไม่พบข้อมูล</div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Header with Year Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">แดชบอร์ดระบบตรวจสอบภายใน</h1>
        <YearSelector 
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsSummaryCard
          title="สถิติการตรวจสอบ"
          data={dashboardData.summary}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Audit Topics Chart */}
        <Card>
          <CardHeader>
            <CardTitle>หัวข้อการตรวจสอบตามหน่วยงาน</CardTitle>
          </CardHeader>
          <CardContent>
            <AuditBarChart data={dashboardData.auditUniverseBar} />
          </CardContent>
        </Card>

        {/* Budget Overview */}
        <Card>
          <CardHeader>
            <CardTitle>ภาพรวมงบประมาณ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">งบประมาณทั้งหมด</span>
                <span className="font-semibold">
                  {dashboardData.stats.totalBudget.toLocaleString()} บาท
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">ใช้ไปแล้ว</span>
                <span className="font-semibold text-blue-600">
                  {dashboardData.stats.usedBudget.toLocaleString()} บาท
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">คงเหลือ</span>
                <span className="font-semibold text-green-600">
                  {dashboardData.stats.remainingBudget.toLocaleString()} บาท
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full" 
                  style={{ 
                    width: `${(dashboardData.stats.usedBudget / dashboardData.stats.totalBudget) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>กิจกรรมล่าสุด</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <div>
                <p className="font-medium">การตรวจสอบระบบการจัดซื้อจัดจ้าง</p>
                <p className="text-sm text-gray-600">กองพัสดุและทรัพย์สิน</p>
              </div>
              <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                รอการอนุมัติ
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <div>
                <p className="font-medium">การตรวจสอบระบบการเงินและบัญชี</p>
                <p className="text-sm text-gray-600">กองการเงินและบัญชี</p>
              </div>
              <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                อนุมัติแล้ว
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <div>
                <p className="font-medium">การตรวจสอบระบบบริหารงานบุคคล</p>
                <p className="text-sm text-gray-600">กองบริหารงานบุคคล</p>
              </div>
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                กำลังดำเนินการ
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
