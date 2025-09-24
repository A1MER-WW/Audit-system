"use client";

import React from 'react';
import { Button } from '../../../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../components/ui/card';
import { useEngagementPlan } from '../../../../../hooks/useEngagementPlan';

export default function TestDataLoader() {
  const { dispatch } = useEngagementPlan();

  const loadTestData = () => {
    // Load Step 1 test data
    dispatch({
      type: 'UPDATE_STEP1',
      payload: {
        basicInfo: {
          auditedUnit: "กรมทางหลวง",
          auditCategory: "การตรวจสอบประสิทธิผล",
          preparer: "นางสาวกุสุมา สุขสอน (ผู้ตรวจสอบภายใน)",
          reviewer: "นางสาวจิรวรรณ สมัคร (หัวหน้ากลุ่มตรวจสอบภายใน)",
          approver: "นางสาวจิรวรรณ สมัคร (หัวหน้ากลุ่มตรวจสอบภายใน)",
        },
        description: "การประเมินความเสี่ยงในแต่ละกิจกรรมของกระบวนการจัดทำและบริหารจัดการโครงการลงทุนภาครัฐ เพื่อระบุจุดอ่อนและความเสี่ยงที่อาจเกิดขึ้น",
        selectedActivities: [
          {
            id: 1,
            activity: "การจัดทำแผนงานโครงการ",
            riskDescription: "ความเสี่ยงด้านการวางแผน",
            riskLevel: "สูง",
          },
          {
            id: 2,
            activity: "การจัดซื้อจัดจ้าง",
            riskDescription: "ความเสี่ยงด้านการปฏิบัติตามระเบียบ",
            riskLevel: "กลาง",
          },
          {
            id: 3,
            activity: "การควบคุมคุณภาพงาน",
            riskDescription: "ความเสี่ยงด้านคุณภาพ",
            riskLevel: "กลาง",
          },
        ],
      }
    });

    // Load Step 2 test data
    dispatch({
      type: 'UPDATE_STEP2',
      payload: {
        objectives: [
          "ประเมินประสิทธิภาพ และประสิทธิผลของโครงการ/งาน/กิจกรรม",
          "ประเมินความรู้ ความเข้าใจ ของเจ้าหน้าที่ผู้ปฏิบัติงานงาน/กิจกรรม",
          "ตรวจสอบการปฏิบัติตามระเบียบและข้อกำหนด",
        ],
        scopes: [
          {
            id: 1,
            text: "การตรวจสอบกระบวนการจัดทำแผนงาน",
            subScopes: [
              { id: 1, text: "การวิเคราะห์ความเป็นไปได้ของโครงการ" },
              { id: 2, text: "การประเมินงบประมาณและทรัพยากร" },
            ],
          },
          {
            id: 2,
            text: "การตรวจสอบการดำเนินโครงการ",
            subScopes: [
              { id: 3, text: "การติดตามความคืบหน้า" },
              { id: 4, text: "การควบคุมคุณภาพ" },
            ],
          },
        ],
        auditDuration: "12 สัปดาห์ (3 เดือน) ตั้งแต่เดือนมกราคม ถึง มีนาคม 2568",
        auditMethodology: "การสัมภาษณ์ผู้เกี่ยวข้อง การตรวจสอบเอกสาร การทดสอบการควบคุมภายใน การสำรวจ และการวิเคราะห์ข้อมูล",
        auditResponsible: "นางสาวกุสุมา สุขสอน (ผู้ตรวจสอบภายใน)",
        supervisor: "นางสาวจิรวรรณ สมัคร (หัวหน้ากลุ่มตรวจสอบภายใน)",
      }
    });

    // Load Step 3 test data
    dispatch({
      type: 'UPDATE_STEP3',
      payload: {
        auditPrograms: [
          {
            objective: "ประเมินประสิทธิภาพ และประสิทธิผลของโครงการ/งาน/กิจกรรม",
            method: "การสัมภาษณ์ผู้บริหารและเจ้าหน้าที่ ตรวจสอบเอกสารการดำเนินงาน วิเคราะห์ข้อมูลประสิทธิภาพ",
            analysis: "เปรียบเทียบผลการดำเนินงานกับเป้าหมายที่กำหนด วิเคราะห์ต้นทุนประโยชน์",
            storage: "บันทึกในระบบ Working Paper และจัดเก็บเอกสารหลักฐาน",
            source: "รายงานการดำเนินงาน แผนงาน งบประมาณ ข้อมูลทางการเงิน",
            responsible: "นางสาวกุสุมา สุขสอน (ผู้ตรวจสอบภายใน)",
          },
          {
            objective: "ประเมินความรู้ ความเข้าใจ ของเจ้าหน้าที่ผู้ปฏิบัติงานงาน/กิจกรรม",
            method: "การสัมภาษณ์เจ้าหน้าที่ แบบสอบถาม การทดสอบความรู้",
            analysis: "วิเคราะห์ระดับความรู้ความเข้าใจ ระบุช่องว่างในการพัฒนา",
            storage: "บันทึกผลการสัมภาษณ์และแบบสอบถาม",
            source: "แบบสอบถาม บันทึกการสัมภาษณ์ เอกสารการฝึกอบรม",
            responsible: "นางสาวกุสุมา สุขสอน (ผู้ตรวจสอบภายใน)",
          },
        ],
      }
    });

    // Load Step 4 test data
    dispatch({
      type: 'UPDATE_STEP4',
      payload: {
        reportingObjective: "จัดทำรายงานผลการตรวจสอบที่มีคุณภาพ ครบถ้วน และเป็นประโยชน์ต่อการปรับปรุงระบบการควบคุมภายใน",
        reportingMethod: "รวบรวมข้อมูลจากการตรวจสอบ วิเคราะห์ผลการตรวจสอบ จัดทำข้อเสนอแนะเชิงสร้างสรรค์",
        analysisMethod: "การวิเคราะห์เปรียบเทียบ การวิเคราะห์สาเหตุและผลกระทบ การจัดลำดับความสำคัญของปัญหา",
        dataStorage: "จัดเก็บในระบบ Working Paper และฐานข้อมูลการตรวจสอบ",
        dataSources: "รายงานการตรวจสอบ Working Papers เอกสารหลักฐาน บันทึกการสัมภาษณ์",
        responsible: "นางสาวกุสุมา สุขสอน (ผู้ตรวจสอบภายใน)",
        remarks: "รายงานจะต้องได้รับการสอบทานและอนุมัติก่อนนำเสนอ",
      }
    });

    alert('✅ โหลดข้อมูลทดสอบเรียบร้อยแล้ว!\n\nตอนนี้สามารถไปดูหน้าสรุปผลได้ที่หน้า Summary');
  };

  const clearAllData = () => {
    if (confirm('⚠️ คุณต้องการลบข้อมูลทั้งหมด?')) {
      dispatch({ type: 'RESET_STATE' });
      alert('🗑️ ลบข้อมูลทั้งหมดเรียบร้อยแล้ว');
    }
  };

  return (
    <div className="px-6 py-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-blue-600">
            🧪 Test Data Loader
          </CardTitle>
          <p className="text-sm text-gray-600">
            เครื่องมือสำหรับทดสอบระบบ - โหลดข้อมูลตัวอย่างเพื่อดูการทำงานของหน้าสรุปผล
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={loadTestData}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              📊 โหลดข้อมูลทดสอบ (ครบทุก Step)
            </Button>
            
            <Button 
              onClick={clearAllData}
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              🗑️ ลบข้อมูลทั้งหมด
            </Button>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">📋 ข้อมูลที่จะโหลด:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Step 1:</strong> ข้อมูลพื้นฐาน + กิจกรรมเสี่ยง (3 กิจกรรม)</li>
              <li>• <strong>Step 2:</strong> วัตถุประสงค์ (3 ข้อ) + ขอบเขต (2 หัวข้อ)</li>
              <li>• <strong>Step 3:</strong> Audit Programs (2 โปรแกรม)</li>
              <li>• <strong>Step 4:</strong> การรายงานผล (ครบทุกฟิลด์)</li>
            </ul>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-medium text-yellow-900 mb-2">🔄 วิธีใช้:</h4>
            <ol className="text-sm text-yellow-800 space-y-1">
              <li>1. คลิก &quot;โหลดข้อมูลทดสอบ&quot; เพื่อเติมข้อมูลตัวอย่าง</li>
              <li>2. ไปที่หน้า &quot;Summary&quot; เพื่อดูผลลัพธ์</li>
              <li>3. หรือไปแก้ไขในแต่ละ Step เพื่อดูการอัปเดตแบบ Real-time</li>
              <li>4. ใช้ &quot;ลบข้อมูลทั้งหมด&quot; เมื่อต้องการเริ่มใหม่</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}