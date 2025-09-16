"use client";

import { AuditProgram } from "@/lib/audit-programs-risk-evaluation/mock-audit-programs";
import { useEffect, useState } from "react";

// === types ตาม mock ของ endpoint รายละเอียด ===
export type RiskLevel = { grade_code: string; grade: string };
export type RiskAssessment = {
  id: number;
  risk_factor: string;
  likelihood_score: number;
  impact_score: number;
  total_score: number;
  risk_ranking: number;
  risk_ranking_by_user: number | null;
  reason_for_new_risk_ranking: string | null;
  risk_level: RiskLevel;
};
export type AuditActivityRisk = {
  id: number;
  processes: string;
  risk_factors: string;
  object: string;
  risks_assessment: RiskAssessment[];
};
export type AuditProgramRiskEvaluation = AuditProgram & {
  AuditActivityRisks: AuditActivityRisk[];
};
export type DetailResponse = {
  message: string;
  data: AuditProgramRiskEvaluation;
};

const RAW_BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const BASE = RAW_BASE.endsWith("/") ? RAW_BASE.slice(0, -1) : RAW_BASE;
const api = (p: string) => `${BASE}${p}`;

export function useAuditProgramRiskEvaluation(id?: number) {
  const [data, setData] = useState<AuditProgramRiskEvaluation | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [errorMsg, setError] = useState<string | null>(null);

  async function fetchDetail(signal?: AbortSignal) {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(api(`/api/audit-programs-risk-evaluations/${id}`), {
        credentials: "include",
        cache: "no-store",
        signal,
      });
      if (!res.ok) throw new Error(await res.text());
      const json = (await res.json()) as DetailResponse;
      setData(json.data);
    } catch (e: any) {
      if (e?.name !== "AbortError") setError(e?.message ?? "Fetch error");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const ac = new AbortController();
    fetchDetail(ac.signal);
    return () => ac.abort();
  }, [id]);

  return { data, isLoading, errorMsg: errorMsg, refetch: () => fetchDetail() };
}
