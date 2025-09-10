"use client";

import React from "react";

export default function ImpactCategoryCard({ category }: { category: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <h3 className="text-sm font-medium text-gray-800">{category}</h3>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>ตัวอย่าง/หลักฐาน</span>
          <span className="rounded-full bg-gray-100 px-2 py-0.5">ไม่มีข้อมูล</span>
        </div>
      </div>
      <div className="overflow-auto">
        <table className="min-w-[900px] w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-600">
              <th className="w-20 px-4 py-3 text-left">ระดับ</th>
              <th className="px-4 py-3 text-left">นิยาม</th>
              <th className="px-4 py-3 text-left">หมวดหมู่</th>
              <th className="px-4 py-3 text-left">ตัวอย่าง/หลักฐาน</th>
              <th className="px-4 py-3 text-left">มูลค่า</th>
              <th className="px-4 py-3 text-left">จำนวนราย</th>
              <th className="px-4 py-3 text-left">บท</th>
              <th className="px-4 py-3 text-left">เหตุผล</th>
            </tr>
          </thead>
          <tbody>
            {[5, 4, 3, 2, 1].map((lvl, rIdx) => (
              <tr key={lvl} className={rIdx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-3 font-medium text-gray-700">{lvl}</td>
                <td className="px-4 py-3 text-gray-400">—</td>
                <td className="px-4 py-3 text-gray-400">—</td>
                <td className="px-4 py-3 text-gray-400">ไม่มีข้อมูล</td>
                <td className="px-4 py-3 text-gray-400">—</td>
                <td className="px-4 py-3 text-gray-400">—</td>
                <td className="px-4 py-3 text-gray-400">—</td>
                <td className="px-4 py-3 text-gray-400">—</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}