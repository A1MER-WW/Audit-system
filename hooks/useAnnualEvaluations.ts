// hooks/useAnnualEvaluations.ts
import useSWR from "swr";

/** ===== Types (ให้ตรงกับ /api/annual-evaluations mock ใหม่) ===== */
export type Grade = "E" | "H" | "M" | "L" | "N";
export type MaybeGrade = Grade | null;

export type EvaluationStatus = "IN_PROGRESS" | "DONE" | "PENDING";

export type AnnualStatus =
  | "ASSESSOR_IN_PROGRESS"
  | "AWAITING_DIRECTOR_REVIEW"
  | "DIRECTOR_REJECTED"
  | "DIRECTOR_APPROVED";

export type Department = {
  id: number;
  departmentName: string;
  composite_score: number | null; // ✅ mock ใหม่อนุญาต null
  grade: MaybeGrade;              // ✅ mock ใหม่อนุญาต null
};

export type DepartmentAssessmentScore = {
  department: Department;
};

export type AuditTopicType = {
  id: number;
  name: string;
  isActive: boolean;
};

export type Category = { id: number; name: string };

export type AuditTopic = {
  id: number;
  auditTopic: string;
  auditTopicType: AuditTopicType;
  DepartmentAssessmentScore: DepartmentAssessmentScore[];
  total_score: number | null;      // ✅ อนุญาต null
  composite_score: number | null;  // ✅ อนุญาต null
  grade: MaybeGrade;               // ✅ อนุญาต null
  order: number;
  order_by_user: number;
  reason_for_new_order: string;
  evaluation_status: EvaluationStatus;
};

export type RiskEvaluation = {
  id: number;
  category: Category;
  auditTopics: AuditTopic[];
};

export type ApiAnnualEvaluation = {
  id: number;
  fiscalYear: number;
  status: AnnualStatus;
  auditor_signature: string | null;
  director_signature: string | null;
  director_comment: string | null;
  version: number;
  RiskEvaluations: RiskEvaluation[];
};

/** ===== Hook options ===== */
type UseAnnualEvaluationsOptions = {
  fiscalYear?: number;  // 2568
  status?: AnnualStatus; // ตามชุดใหม่
  category?: string;    // "งาน" | "หน่วยงาน" | "IT/Non-IT" | ...
  search?: string;      // คำค้น
};

// ✅ SWR fetcher
const fetcher = async (url: string) => {
  const res = await fetch(url);
  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json?.message || "Failed to fetch annual evaluations");
  }

  // mock ปัจจุบันคืน { success, data, total, message }
  // แต่กันไว้ถ้าอนาคตคืนเป็น array ตรงๆ
  const payload = Array.isArray(json) ? json : (json?.data ?? []);
  return Array.isArray(payload) ? (payload as ApiAnnualEvaluation[]) : [];
};

export function useAnnualEvaluations(options: UseAnnualEvaluationsOptions = {}) {
  // ✅ สร้าง URL สำหรับ SWR
  const params = new URLSearchParams();
  if (options.fiscalYear) params.append("fiscalYear", String(options.fiscalYear));
  if (options.status) params.append("status", options.status);
  if (options.category) params.append("category", options.category);
  if (options.search) params.append("search", options.search.trim());

  const apiUrl = `/api/annual-evaluations?${params.toString()}`;

  // ✅ ใช้ SWR แทน manual state management
  const {
    data = [],
    error: swrError,
    isLoading,
    mutate: revalidate,
  } = useSWR<ApiAnnualEvaluation[]>(apiUrl, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const error = swrError ? String(swrError) : null;

  /** ===== POST: สร้าง Annual Evaluation =====
   * รองรับ 2 รูปแบบ:
   * - Minimal: { fiscalYear, status, version? }
   * - Full shape: ApiAnnualEvaluation (ไม่ต้องมี id)
   */
  type CreateMinimal = {
    fiscalYear: number;
    status: AnnualStatus;
    version?: number;
  };
  type CreateFull = Omit<ApiAnnualEvaluation, "id"> & { id?: number };

  async function createEvaluation(
    payload: CreateMinimal | CreateFull
  ): Promise<ApiAnnualEvaluation> {
    try {
      const res = await fetch("/api/annual-evaluations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.success === false) {
        throw new Error(json?.message || "Failed to create annual evaluation");
      }

      // ✅ Revalidate SWR cache
      await revalidate();
      return (json?.data ?? json) as ApiAnnualEvaluation;
    } catch (err) {
      throw err;
    }
  }

  return {
    annualEvaluations: data,
    loading: isLoading,
    error,
    refetch: revalidate,
    createEvaluation,
  };
}
