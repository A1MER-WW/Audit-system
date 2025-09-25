"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import ReminderModal from "@/components/reminder-modal";
import DashboardSummary from "@/components/dashboard-summary";

export default function SummaryOfOpinionsPage() {
  const router = useRouter();
  const fiscalYears = useMemo(() => [2568, 2567, 2566, 2565], []);
  const [year, setYear] = useState<number>(2568);
  const [tab, setTab] = useState<"status" | "summary">("status");
  const [selectedSubTab, setSelectedSubTab] = useState<"likelihood" | "impact">("likelihood");
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");

  // Mock data for opinions tracking
  const mockOpinionsData = [
    {
      id: "กษ1",
      department: "กองยุทธศาสตร์และแผนงาน",
      submissionDate: "25 ก.ค 68 เวลา 09.45 น.",
      status: "completed",
      statusText: "ส่งความคิดเห็นแล้ว"
    },
    {
      id: "กษ2",
      department: "กองยุทธศาสตร์และแผนงาน",
      submissionDate: "25 ก.ค 68 เวลา 09.45 น.",
      status: "completed",
      statusText: "ส่งความคิดเห็นแล้ว"
    },
    {
      id: "กษ3",
      department: "กองยุทธศาสตร์และแผนงาน",
      submissionDate: "25 ก.ค 68 เวลา 10.24 น.",
      status: "completed",
      statusText: "ส่งความคิดเห็นแล้ว"
    },
    {
      id: "กผ1",
      department: "กองยุทธศาสตร์และแผนงาน",
      submissionDate: "25 ก.ค 68 เวลา 10.24 น.",
      status: "completed",
      statusText: "ส่งความคิดเห็นแล้ว"
    },
    {
      id: "กผ2",
      department: "กองยุทธศาสตร์และแผนงาน",
      submissionDate: "25 ก.ค 68 เวลา 10.24 น.",
      status: "completed",
      statusText: "ส่งความคิดเห็นแล้ว"
    },
    {
      id: "กผ3",
      department: "กองยุทธศาสตร์และแผนงาน",
      submissionDate: "25 ก.ค 68 เวลา 10.24 น.",
      status: "pending",
      statusText: "ยังไม่ส่งความคิดเห็น"
    },
    {
      id: "กผ4",
      department: "กองยุทธศาสตร์และแผนงาน",
      submissionDate: "25 ก.ค 68 เวลา 10.24 น.",
      status: "pending",
      statusText: "ยังไม่ส่งความคิดเห็น"
    },
    {
      id: "กผ5",
      department: "กองยุทธศาสตร์และแผนงาน",
      submissionDate: "25 ก.ค 68 เวลา 10.24 น.",
      status: "pending",
      statusText: "ยังไม่ส่งความคิดเห็น"
    },
    {
      id: "สนย1",
      department: "กองยุทธศาสตร์และแผนงาน",
      submissionDate: "25 ก.ค 68 เวลา 10.24 น.",
      status: "completed",
      statusText: "ส่งความคิดเห็นแล้ว"
    },
    {
      id: "สนย2",
      department: "กองยุทธศาสตร์และแผนงาน",
      submissionDate: "25 ก.ค 68 เวลา 10.24 น.",
      status: "completed",
      statusText: "ส่งความคิดเห็นแล้ว"
    },
    {
      id: "สนย3",
      department: "กองยุทธศาสตร์และแผนงาน",
      submissionDate: "25 ก.ค 68 เวลา 10.24 น.",
      status: "completed",
      statusText: "ส่งความคิดเห็นแล้ว"
    },
    {
      id: "สนย4",
      department: "กองยุทธศาสตร์และแผนงาน",
      submissionDate: "25 ก.ค 68 เวลา 10.24 น.",
      status: "completed",
      statusText: "ส่งความคิดเห็นแล้ว"
    },
    {
      id: "สนย5",
      department: "กองยุทธศาสตร์และแผนงาน",
      submissionDate: "25 ก.ค 68 เวลา 10.24 น.",
      status: "completed",
      statusText: "ส่งความคิดเห็นแล้ว"
    },
    {
      id: "สนย6",
      department: "กองยุทธศาสตร์และแผนงาน",
      submissionDate: "25 ก.ค 68 เวลา 10.24 น.",
      status: "completed",
      statusText: "ส่งความคิดเห็นแล้ว"
    },
    {
      id: "สนย7",
      department: "กองยุทธศาสตร์และแผนงาน",
      submissionDate: "25 ก.ค 68 เวลา 10.24 น.",
      status: "completed",
      statusText: "ส่งความคิดเห็นแล้ว"
    },
    {
      id: "สนย8",
      department: "กองยุทธศาสตร์และแผนงาน",
      submissionDate: "25 ก.ค 68 เวลา 10.24 น.",
      status: "completed",
      statusText: "ส่งความคิดเห็นแล้ว"
    },
    {
      id: "สนย9",
      department: "กองยุทธศาสตร์และแผนงาน",
      submissionDate: "25 ก.ค 68 เวลา 10.24 น.",
      status: "completed",
      statusText: "ส่งความคิดเห็นแล้ว"
    },
    {
      id: "สนย10",
      department: "กองยุทธศาสตร์และแผนงาน",
      submissionDate: "25 ก.ค 68 เวลา 10.24 น.",
      status: "completed",
      statusText: "ส่งความคิดเห็นแล้ว"
    },
    {
      id: "สนย11",
      department: "กองยุทธศาสตร์และแผนงาน",
      submissionDate: "25 ก.ค 68 เวลา 10.24 น.",
      status: "completed",
      statusText: "ส่งความคิดเห็นแล้ว"
    },
    {
      id: "สนย12",
      department: "กองยุทธศาสตร์และแผนงาน",
      submissionDate: "25 ก.ค 68 เวลา 10.24 น.",
      status: "completed",
      statusText: "ส่งความคิดเห็นแล้ว"
    }
  ];

  // Calculate statistics
  const getStatistics = () => {
    const total = mockOpinionsData.length;
    const completed = mockOpinionsData.filter(item => item.status === "completed").length;
    const pending = mockOpinionsData.filter(item => item.status === "pending").length;
    
    return { total, completed, pending };
  };

  const stats = getStatistics();

  // Handle reminder modal submission
  const handleReminderSubmit = (data: { date: string; file?: File }) => {
    console.log("Reminder data submitted:", {
      department: selectedDepartment,
      date: data.date,
      file: data.file?.name
    });
    // Here you can add logic to send the reminder data to your API
  };

  return (
    <div className="w-full h-full bg-gray-50 text-gray-900 flex flex-col">
      <div className="w-full h-full px-6 py-4 flex flex-col">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-3 text-sm text-gray-500 mb-6">
          <button 
            onClick={() => router.back()}
            className="hover:underline"
          >
            กลับ
          </button>
          <span>›</span>
          <span className="text-gray-700">กำหนดปัจจัยเสี่ยงและเกณฑ์การจัดความเสี่ยง</span>
        </div>

        {/* Year Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ปีงบประมาณ
          </label>
          <div className="relative w-56">
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-2.5 pr-10 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              {fiscalYears.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 011.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" />
            </svg>
          </div>
        </div>

        {/* Status Info */}
        <div className="mb-4 text-sm text-gray-600">
          ขั้นตอนการประเมินความเสี่ยงปัจจัยด้วยเกณฑ์ความเสี่ยง ของหน่วยงานในสังกัด ปีงบประมาณ 2568
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="inline-flex rounded-xl bg-gray-100 p-1">
            <button
              onClick={() => setTab("status")}
              className={`px-4 py-2 text-sm rounded-lg transition ${
                tab === "status" 
                  ? "bg-white shadow text-indigo-700" 
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              ติดตามสถานะแสดงความเห็น
            </button>
            <button
              onClick={() => setTab("summary")}
              className={`px-4 py-2 text-sm rounded-lg transition ${
                tab === "summary" 
                  ? "bg-white shadow text-indigo-700" 
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              สรุปผลความคิดเห็น
            </button>
          </div>
        </div>



        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          {tab === "status" ? (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ลำดับ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        รหัสหน่วยงานภายใน
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ชื่อหน่วยงาน
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        สถานะการส่งความเห็น
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockOpinionsData.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {item.department}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex flex-col items-center">
                            <div className="flex items-center justify-center gap-4 w-full">
                              <span 
                                className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                                  item.status === 'completed' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {item.statusText}
                              </span>
                              {item.status === 'pending' && (
                                <button
                                  onClick={() => {
                                    setSelectedDepartment(item.department);
                                    setShowReminderModal(true);
                                  }}
                                  className="text-orange-500 hover:text-orange-700 transition-colors ml-2"
                                  title="ส่งการแจ้งเตือน"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </button>
                              )}
                            </div>
                            {item.status === 'completed' && (
                              <div className="text-xs text-gray-500 mt-1">
                                {item.submissionDate}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <DashboardSummary 
              year={year} 
              selectedTab={selectedSubTab} 
              onTabChange={setSelectedSubTab}
            />
          )}
        </div>
      </div>

      {/* Reminder Modal */}
      <ReminderModal
        isOpen={showReminderModal}
        onClose={() => setShowReminderModal(false)}
        departmentName={selectedDepartment}
        onSubmit={handleReminderSubmit}
      />
    </div>
  );
}
