"use client";

import { useEffect, useState } from "react";
import type { AuditProgram, ListResponse } from "@/lib/audit-programs-risk-evaluation/mock-audit-programs";

const RAW_BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const BASE = RAW_BASE.endsWith("/") ? RAW_BASE.slice(0, -1) : RAW_BASE; // กัน // ซ้ำ
const api = (path: string) => `${BASE}${path}`;                          // join path ชัวร์ๆ

export function useAuditPrograms(fiscalYear?: number) {
  const [programs, setPrograms] = useState<AuditProgram[]>([]);
  const [message, setMessage] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  async function fetchPrograms(signal?: AbortSignal): Promise<void> {
    try {
      setIsLoading(true);
      setIsError(false);

      const url = fiscalYear
        ? api(`/api/audit-programs?fiscalYear=${Number(fiscalYear)}`)
        : api(`/api/audit-programs`);

      const res = await fetch(url, {
        credentials: "include",
        cache: "no-store",
        signal,                     // ✅ ใส่ signal ให้ AbortController ทำงาน
      });
      if (!res.ok) throw new Error(await res.text());

      const json = (await res.json()) as ListResponse;
      setPrograms(json.data);
      setMessage(json.message);
    } catch (e: any) {
      if (e?.name === "AbortError") return;
      console.error("[useAuditPrograms] fetch error:", e);
      setPrograms([]);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const ac = new AbortController();
    fetchPrograms(ac.signal);
    return () => ac.abort();
  }, [fiscalYear]);

  return {
    programs,
    message,
    isLoading,
    isError,
    refetch: () => fetchPrograms(), // manual reload
  };
}

// POST: สร้างใหม่
export async function createAuditProgram(
  input: Omit<AuditProgram, "id">
): Promise<ListResponse> {
  const res = await fetch(api(`/api/audit-programs`), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as ListResponse;
}

// PATCH: อัปเดตข้อมูลบางส่วน (เช่น สถานะ)
export async function updateAuditProgram(
  id: number,
  updates: Partial<Omit<AuditProgram, "id">>
): Promise<ListResponse> {
  const res = await fetch(api(`/api/audit-programs/${id}`), {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as ListResponse;
}

// Helper function สำหรับอัปเดตสถานะ
export async function updateProgramStatus(
  id: number,
  status: string
): Promise<ListResponse> {
  return updateAuditProgram(id, { status });
}

// DELETE: ลบตาม id
export async function deleteAuditProgram(id: number): Promise<ListResponse> {
  const res = await fetch(api(`/api/audit-programs/${id}`), {
    method: "DELETE",
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as ListResponse;
}
