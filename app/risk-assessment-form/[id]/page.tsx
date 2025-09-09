// app/risk-assessment-form/[id]/page.tsx
import RiskAssessmentFormPage from "@/components/features/inspector/risk-assessment/risk-assessment-form";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-svh">
      <RiskAssessmentFormPage id={params.id} />
    </div>
  );
}
