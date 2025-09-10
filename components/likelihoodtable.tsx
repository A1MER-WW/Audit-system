"use client";

import React from "react";
import type { LikelihoodLevel } from "@/types/riskassessments";

type Props = {
  title?: string;
  columns: string[];
  levels: LikelihoodLevel[];
};

export default function LikelihoodTable({ title, columns, levels }: Props) {
  return (
    <section className="mt-4">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-4 py-3">
          <h3 className="text-sm font-medium text-gray-800">
            {title ?? "เกณฑ์การประเมินโอกาสเกิดเหตุการณ์ความเสี่ยง (Likelihood: L)"}
          </h3>
        </div>
        <div className="overflow-auto">
          <table className="min-w-[900px] w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-600">
                <th className="w-20 px-4 py-3 text-left">ระดับ</th>
                <th className="w-40 px-4 py-3 text-left">โอกาสเกิดเหตุ</th>
                {columns.map((c) => (
                  <th key={c} className="px-4 py-3 text-left whitespace-pre-line">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {levels.map((row, idx) => (
                <tr key={row.level} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-3 font-medium text-gray-700">{row.level}</td>
                  <td className="px-4 py-3 text-gray-700">{row.label}</td>
                  {columns.map((c) => (
                    <td key={c} className="px-4 py-3 text-gray-400">-</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}