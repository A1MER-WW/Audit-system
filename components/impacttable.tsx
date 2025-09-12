"use client";

import * as React from "react";

export type ImpactLevel = "น้อยที่สุด" | "น้อย" | "ปานกลาง" | "มาก" | "มากที่สุด";

export type ImpactRow = {
  id: number;
  factor: string;       // ปัจจัย
  category: string;     // หมวดหมู่ (เช่น งาน / แผนงาน/โครงการ / หน่วยงาน)
  group?: string;       // กลุ่มย่อย (เช่น งาน / แผนงาน/โครงการ / หน่วยงาน / โครงการกันเงินเหลื่อมปี / กิจกรรม / กระบวนงาน / IT และ Non-IT)
  levels: Record<ImpactLevel, string>;
};

const IMPACT_LEVELS: ImpactLevel[] = [
  "น้อยที่สุด",
  "น้อย",
  "ปานกลาง",
  "มาก",
  "มากที่สุด",
];

export default function ImpactTable({
  title,
  rows,
}: {
  title: string;
  rows: ImpactRow[];
}) {
  return (
    <section className="mt-6">
      <h2 className="mb-2 text-base font-semibold text-gray-800">{title}</h2>

      <div className="overflow-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-[1200px] w-full table-fixed border-separate border-spacing-0 text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-700">
              <th className="w-14 border-b border-gray-200 px-3 py-2 text-center font-semibold">
                ลำดับ
              </th>
              <th className="w-[420px] border-b border-l border-gray-200 px-3 py-2 text-left font-semibold">
                ปัจจัย
              </th>
              <th className="w-40 border-b border-l border-gray-200 px-3 py-2 text-center font-semibold">
                หมวดหมู่
              </th>
              {IMPACT_LEVELS.map((lvl) => (
                <th
                  key={lvl}
                  className="border-b border-l border-gray-200 px-3 py-2 text-center font-semibold"
                >
                  {lvl}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="text-gray-800">
            {rows.map((row) => (
              <tr key={row.id} className="align-top">
                <td className="border-t border-gray-200 px-3 py-3 text-center">
                  {row.id}
                </td>

                <td className="border-t border-l border-gray-200 px-3 py-3 leading-6">
                  {row.factor}
                </td>

                <td className="border-t border-l border-gray-200 px-3 py-3 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <span>{row.category}</span>
                    {row.group ? (
                      <span className="mt-1 rounded-full bg-indigo-50 px-2 text-xs text-indigo-600">
                        {row.group}
                      </span>
                    ) : null}
                  </div>
                </td>

                {IMPACT_LEVELS.map((lvl) => (
                  <td
                    key={lvl}
                    className="border-t border-l border-gray-200 px-3 py-3 leading-6"
                  >
                    {row.levels[lvl]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}