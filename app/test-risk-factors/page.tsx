"use client";

import { useState } from "react";

// ทดสอบการแยกปัจจัยเสี่ยง
const testRiskText = `แนวโน้มของการปรับเปลี่ยน/โอน/ย้าย/ลาออก ของบุคลากรที่ปฏิบัติงาน ตามภารกิจขององค์กรและนโยบายของผู้บริหาร (จำนวนข้าราชการ ลูกจ้างประจำ พนักงานราชการ)

ผลการขับเคลื่อนแผนงาน/โครงการตามแผนปฏิบัติราชการของหน่วยงาน`;

export default function TestPage() {
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  
  // แยกปัจจัยเสี่ยงออกเป็นข้อๆ
  const riskFactors = testRiskText.split('\n\n').filter(factor => factor.trim().length > 0);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">ทดสอบการแยกปัจจัยเสี่ยง</h1>
      
      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-medium mb-2">ข้อความเดิม:</h3>
          <pre className="text-sm text-gray-600 whitespace-pre-wrap">{testRiskText}</pre>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">แยกเป็น {riskFactors.length} ข้อ:</h3>
          <div className="space-y-3">
            {riskFactors.map((factor, index) => (
              <div key={index} className="bg-white p-3 rounded border">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-medium text-blue-600 mb-1">
                      ปัจจัยที่ {index + 1}:
                    </div>
                    <div className="text-sm text-gray-700">{factor.trim()}</div>
                  </div>
                  <button
                    onClick={() => setSelectedItem(selectedItem === index ? null : index)}
                    className="ml-4 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    {selectedItem === index ? 'ซ่อน' : 'ประเมิน'}
                  </button>
                </div>
                
                {selectedItem === index && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">โอกาส</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded text-sm">
                          <option value="">เลือกระดับโอกาส</option>
                          <option value="1">น้อยที่สุด</option>
                          <option value="2">น้อย</option>
                          <option value="3">ปานกลาง</option>
                          <option value="4">มาก</option>
                          <option value="5">มากที่สุด</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">ผลกระทบ</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded text-sm">
                          <option value="">เลือกระดับผลกระทบ</option>
                          <option value="1">น้อยที่สุด</option>
                          <option value="2">น้อย</option>
                          <option value="3">ปานกลาง</option>
                          <option value="4">มาก</option>
                          <option value="5">มากที่สุด</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}