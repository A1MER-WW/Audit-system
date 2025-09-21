import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function RiskAssessmentFormPage({ params }: Props) {
  const { id } = await params;

  if (!id || isNaN(Number(id))) {
    notFound();
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        แบบฟอร์มประเมินความเสี่ยง - ID: {id}
      </h1>
      <div className="bg-gray-100 p-8 rounded-lg text-center">
        <p className="text-gray-600">หน้านี้อยู่ระหว่างการพัฒนา</p>
      </div>
    </div>
  );
}