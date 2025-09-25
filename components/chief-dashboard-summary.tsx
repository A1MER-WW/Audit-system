"use client";

import { ManageChoice } from "@/types/riskassessments";
import React, { useState } from "react";
import ChiefConfirmSummaryModal from "./chiefconfirmsummarymodal";

interface DashboardSummaryProps {
  year: number;
  selectedTab: "likelihood" | "impact";
  onTabChange: (tab: "likelihood" | "impact") => void;
}

// Types for opinion data
interface OpinionData {
  agree: boolean | null;
  disagree: boolean | null;
  comment: string;
}

export default function ChiefDashboardSummary({ year, selectedTab, onTabChange }: DashboardSummaryProps) {

  // modal
  const [showManageModal, setChiefConfirmSummaryModal] = useState(false);
  const [wantManage, setWantManage] = useState<ManageChoice>("want");

  // Mock opinion data from departments (simulating submitted feedback)
  const mockLikelihoodOpinions: Record<string, Record<number, OpinionData>> = {
    "likelihood": {
      0: { agree: true, disagree: null, comment: "เห็นด้วยกับเกณฑ์การประเมินโอกาสสำหรับด้านกลยุทธ์" },
      1: { agree: null, disagree: true, comment: "ควรปรับปรุงเกณฑ์ให้เหมาะสมกับบริบทองค์กร" },
      2: { agree: true, disagree: null, comment: "" },
      3: { agree: true, disagree: null, comment: "เกณฑ์นี้เหมาะสมและสามารถนำไปใช้ได้" },
      4: { agree: null, disagree: true, comment: "ควรเพิ่มรายละเอียดในการอธิบายเกณฑ์" },
    }
  };

  const mockImpactOpinions: Record<string, Record<number, OpinionData>> = {
    "ด้านกลยุทธ์": {
      0: { agree: true, disagree: null, comment: "เห็นด้วยกับปัจจัยความเสี่ยงด้านการบันทึกข้อมูล" },
      1: { agree: null, disagree: true, comment: "ควรปรับปรุงกรอบเวลาในการประเมิน" },
    },
  };

  // Calculate statistics based on opinion data
  const getOpinionStats = () => {
    let totalItems = 0;
    let agreedItems = 0;
    let disagreedItems = 0;
    let commentedItems = 0;

    if (selectedTab === "likelihood") {
      // Count likelihood opinions
      Object.entries(mockLikelihoodOpinions).forEach(([section, opinions]) => {
        Object.entries(opinions).forEach(([_, opinion]) => {
          totalItems++;
          if (opinion.agree === true) agreedItems++;
          if (opinion.disagree === true) disagreedItems++;
          if (opinion.comment.trim() !== '') commentedItems++;
        });
      });
    } else {
      // Count impact opinions
      Object.entries(mockImpactOpinions).forEach(([section, opinions]) => {
        Object.entries(opinions).forEach(([_, opinion]) => {
          totalItems++;
          if (opinion.agree === true) agreedItems++;
          if (opinion.disagree === true) disagreedItems++;
          if (opinion.comment.trim() !== '') commentedItems++;
        });
      });
    }

    return { totalItems, agreedItems, disagreedItems, commentedItems };
  };

  const stats = getOpinionStats();

  return (
    <div className="space-y-8">
      {/* Card - Overview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  ปัจจัยและเกณฑ์พิจารณาความเสี่ยง สำหรับใช้ในการประเมินและจัดลำดับความเสี่ยงแผนการตรวจสอบประจำปี {year}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  ปัจจัยและเกณฑ์พิจารณาความเสี่ยง
                </p>
                <div className="mt-3 inline-flex items-center text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                  <span>สถานะ: รอหัวหน้ากลุ่มตรวจสอบภายในพิจารณาปัจจัยและเกณฑ์พิจารณาความเสี่ยง</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <button 
                    onClick={() => setChiefConfirmSummaryModal(true)}
                    className="rounded-xl bg-indigo-600 px-6 py-3 text-white shadow hover:bg-indigo-700 font-medium transition-all whitespace-nowrap">
                  พิจารณาอนุมัติ
                </button>
              </div>
            </div>
          </div>

      {/* Main Container */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        


        {/* Opinion Details Section */}
        <div>
          {/* Sub Tabs for Likelihood and Impact */}
          <div className="mb-6">
            <div className="inline-flex rounded-xl bg-blue-100 p-1">
              <button
                onClick={() => onTabChange("likelihood")}
                className={`px-6 py-3 text-sm font-medium rounded-lg border-2 transition-all ${
                  selectedTab === "likelihood"
                    ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50"
                }`}
              >
                โอกาส (Likelihood)
              </button>
              <button
                onClick={() => onTabChange("impact")}
                className={`px-6 py-3 text-sm font-medium rounded-lg border-2 transition-all ${
                  selectedTab === "impact"
                    ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50"
                }`}
              >
                ผลกระทบ (Impact)
              </button>
            </div>
          </div>
          
          {selectedTab === "likelihood" ? (
            <div className="space-y-8">
              {/* Likelihood Assessment Table - 9 rows x 8 columns */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-white px-4 py-2 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-blue-600">เกณฑ์การประเมินโอกาสเกิดของความเสี่ยง ระดับ 5 สูงมาก</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-300">
                    <thead className="bg-blue-50 text-black">
                      <tr>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">ระดับ</th>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">โอกาสเกิดขึ้น</th>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">ด้านกลยุทธ์</th>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">ด้านการเงิน</th>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">ด้านการดำเนินงาน</th>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">ด้านการปฏิบัติตามกฎหมาย/ระเบียบ</th>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">ด้านเทคโนโลยีสารสนเทศ</th>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">ด้านการเกิดทุจริต</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white text-xs">
                      {/* Row 1: Level 5 */}
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-2 py-3 text-center font-medium bg-white">5</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">
                          สูงมาก
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-center">
                          บุคลากรขุดมงกฎการบริหารครอบครัวไม่ได้ 70 ขอผู้ตรวจสอบยืน 3 ครั้งต่อปี
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-center">
                          บุคลากรขุดมงกฎการบริหารครอบครัวไม่ได้ 70 ขอผู้ตรวจสอบยืน 3 ครั้งต่อปี
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-center">
                          บุคลากรขุดมงกฎการบริหารครอบครัวไม่ได้ 70 ขอผู้ตรวจสอบยืน 3 ครั้งต่อปี
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-center">
                          บุคลากรขุดมงกฎการบริหารครอบครัวไม่ได้ 70 ขอผู้ตรวจสอบยืน 3 ครั้งต่อปี
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-center">
                          บุคลากรขุดมงกฎการบริหารครอบครัวอย่างอีกแบบหึญั 3 รครื่องข่ม
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-center">
                          บุคลากรชั่วไม่อำนาจหน้าที่ ละดำเนินงานอย่างโปร่งใสไม่ยามกฎหมาย
                        </td>
                      </tr>

                      {/* Row 2: งคราว ดพท./สทค./หตม./ทม./คสป./ฝฒท./ฮคพง./คศน./ทบท./พม./เนข./พบ./พษ./ลม./คม.8/คม.5/คษ./ยวท./คข.9/คข.5/พท.10/พท.11 */}
                      <tr className="bg-white">
                        <td className="border border-gray-300 px-2 py-3 text-center bg-white">
                          งคราว<br/>
                          ดพท./สทค./หตม./ทม./คสป./ฝฒท./<br/>
                          ฮคพง./คศน./ทบท./พม./เนข./พบ./<br/>
                          พษ./ลม./คม.8/คม.5<br/>
                          คษ./ยวท./คข.9/คข.5/<br/>
                          พท.10/พท.11
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                      </tr>

                      {/* Row 3: หน่วยงาน อกท. */}
                      <tr className="hover:bg-white">
                        <td className="border border-gray-300 px-2 py-3 text-center bg-white">
                          หน่วยงาน อกท.<br/>
                          ไม่มีแนวคิดการประเนทบิเปลี่ยนเคอลารบำ
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                      </tr>

                      {/* Row 4: หน่วยงาน อคท.3 */}
                      <tr className="bg-white">
                        <td className="border border-gray-300 px-2 py-3 text-center bg-white">
                          หน่วยงาน อคท.3<br/>
                          ไม่มีแนวคิดการประเนทบิการประเนทบิเคอลารบำ
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                      </tr>

                      {/* Row 5: หน่วยงาน อคท.4 */}
                      <tr className="hover:bg-white">
                        <td className="border border-gray-300 px-2 py-3 text-center bg-white">
                          หน่วยงาน อคท.4<br/>
                          ไม่มีแนวคิดการประเนทบิ เคอลารบำโครงการประเนทบิเคอลารบำ
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-center">
                          ไม่มีแนวคิดการประเนทบิ เคอลารบำโครงการประเนทบิเคอลารบำ
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                      </tr>

                      {/* Row 6: รายสถิติ - จำนวน */}
                      <tr className="bg-blue-50">
                        <td className="border border-gray-300 px-2 py-2 text-center font-medium">รายสถิติ<br/>จำนวน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                      </tr>

                      {/* Row 7: เห็นด้วย */}
                      <tr className="bg-blue-50">
                        <td className="border border-gray-300 px-2 py-2 text-center font-medium">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">18 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                      </tr>

                      {/* Row 8: ไม่เห็นด้วย */}
                      <tr className="bg-blue-50">
                        <td className="border border-gray-300 px-2 py-2 text-center font-medium">ไม่เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">2 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">0 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">0 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">0 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">0 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">0 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">0 หน่วยงาน</td>
                      </tr>

                      {/* Row 9: ความเห็นของผู้ตรวจสอบภายใน */}
                      <tr className="bg-yellow-50">
                        <td className="border border-gray-300 px-2 py-2 text-center font-medium">
                          ความเห็นที่ปรึกษาด้านการตรวจสอบภายใน
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                      </tr>

                      {/* Row 10: ความเห็นของหัวหน้ากลุ่มตรวจสอบภายใน */}
                      <tr className="bg-yellow-50">
                        <td className="border border-gray-300 px-2 py-2 text-center font-medium">
                          ความเห็นที่ปรึกษาด้านการตรวจสอบภายใน
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของหัวหน้ากลุ่มตรวจสอบภายในต่อความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของหัวหน้ากลุ่มตรวจสอบภายในต่อความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของหัวหน้ากลุ่มตรวจสอบภายในต่อความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของหัวหน้ากลุ่มตรวจสอบภายในต่อความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของหัวหน้ากลุ่มตรวจสอบภายในต่อความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของหัวหน้ากลุ่มตรวจสอบภายในต่อความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของหัวหน้ากลุ่มตรวจสอบภายในต่อความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-bg-white px-4 py-2 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-blue-600">เกณฑ์การประเมินโอกาสเกิดของความเสี่ยง ระดับ 4 สูง</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-300">
                    <thead className="bg-blue-50 text-black">
                      <tr>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">ระดับ</th>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">โอกาสเกิดขึ้น</th>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">ด้านกลยุทธ์</th>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">ด้านการเงิน</th>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">ด้านการดำเนินงาน</th>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">ด้านการปฏิบัติตามกฎหมาย/ระเบียบ</th>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">ด้านเทคโนโลยีสารสนเทศ</th>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">ด้านการเกิดทุจริต</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white text-xs">
                      {/* Row 1: Level 5 */}
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-2 py-3 text-center font-medium bg-white">4</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">
                          สูง
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-center">
                          บุคลากรขุดมงกฎการบริหารครอบครัวไม่ได้ 70 ขอผู้ตรวจสอบยืน 3 ครั้งต่อปี
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-center">
                          บุคลากรขุดมงกฎการบริหารครอบครัวไม่ได้ 70 ขอผู้ตรวจสอบยืน 3 ครั้งต่อปี
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-center">
                          บุคลากรขุดมงกฎการบริหารครอบครัวไม่ได้ 70 ขอผู้ตรวจสอบยืน 3 ครั้งต่อปี
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-center">
                          บุคลากรขุดมงกฎการบริหารครอบครัวไม่ได้ 70 ขอผู้ตรวจสอบยืน 3 ครั้งต่อปี
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-center">
                          บุคลากรขุดมงกฎการบริหารครอบครัวอย่างอีกแบบหึญั 3 รครื่องข่ม
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-center">
                          บุคลากรชั่วไม่อำนาจหน้าที่ ละดำเนินงานอย่างโปร่งใสไม่ยามกฎหมาย
                        </td>
                      </tr>

                      {/* Row 2: งคราว ดพท./สทค./หตม./ทม./คสป./ฝฒท./ฮคพง./คศน./ทบท./พม./เนข./พบ./พษ./ลม./คม.8/คม.5/คษ./ยวท./คข.9/คข.5/พท.10/พท.11 */}
                      <tr className="bg-white">
                        <td className="border border-gray-300 px-2 py-3 text-center bg-white">
                          งคราว<br/>
                          ดพท./สทค./หตม./ทม./คสป./ฝฒท./<br/>
                          ฮคพง./คศน./ทบท./พม./เนข./พบ./<br/>
                          พษ./ลม./คม.8/คม.5<br/>
                          คษ./ยวท./คข.9/คข.5/<br/>
                          พท.10/พท.11
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                      </tr>

                      {/* Row 3: หน่วยงาน อกท. */}
                      <tr className="hover:bg-white">
                        <td className="border border-gray-300 px-2 py-3 text-center bg-white">
                          หน่วยงาน อกท.<br/>
                          ไม่มีแนวคิดการประเนทบิเปลี่ยนเคอลารบำ
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                      </tr>

                      {/* Row 4: หน่วยงาน อคท.3 */}
                      <tr className="bg-white">
                        <td className="border border-gray-300 px-2 py-3 text-center bg-white">
                          หน่วยงาน อคท.3<br/>
                          ไม่มีแนวคิดการประเนทบิการประเนทบิเคอลารบำ
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                      </tr>

                      {/* Row 5: หน่วยงาน อคท.4 */}
                      <tr className="hover:bg-white">
                        <td className="border border-gray-300 px-2 py-3 text-center bg-white">
                          หน่วยงาน อคท.4<br/>
                          ไม่มีแนวคิดการประเนทบิ เคอลารบำโครงการประเนทบิเคอลารบำ
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-center">
                          ไม่มีแนวคิดการประเนทบิ เคอลารบำโครงการประเนทบิเคอลารบำ
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                      </tr>

                      {/* Row 6: รายสถิติ - จำนวน */}
                      <tr className="bg-blue-50">
                        <td className="border border-gray-300 px-2 py-2 text-center font-medium">รายสถิติ<br/>จำนวน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                      </tr>

                      {/* Row 7: เห็นด้วย */}
                      <tr className="bg-blue-50">
                        <td className="border border-gray-300 px-2 py-2 text-center font-medium">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">18 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                      </tr>

                      {/* Row 8: ไม่เห็นด้วย */}
                      <tr className="bg-blue-50">
                        <td className="border border-gray-300 px-2 py-2 text-center font-medium">ไม่เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">2 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">0 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">0 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">0 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">0 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">0 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">0 หน่วยงาน</td>
                      </tr>

                      {/* Row 9: ความเห็นของผู้ตรวจสอบภายใน */}
                      <tr className="bg-yellow-50">
                        <td className="border border-gray-300 px-2 py-2 text-center font-medium">
                          ความเห็นที่ปรึกษาด้านการตรวจสอบภายใน
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                      </tr>

                      {/* Row 10: ความเห็นของหัวหน้ากลุ่มตรวจสอบภายใน */}
                      <tr className="bg-yellow-50">
                        <td className="border border-gray-300 px-2 py-2 text-center font-medium">
                          ความเห็นที่ปรึกษาด้านการตรวจสอบภายใน
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของหัวหน้ากลุ่มตรวจสอบภายในต่อความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของหัวหน้ากลุ่มตรวจสอบภายในต่อความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของหัวหน้ากลุ่มตรวจสอบภายในต่อความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของหัวหน้ากลุ่มตรวจสอบภายในต่อความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของหัวหน้ากลุ่มตรวจสอบภายในต่อความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของหัวหน้ากลุ่มตรวจสอบภายในต่อความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของหัวหน้ากลุ่มตรวจสอบภายในต่อความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-white px-4 py-2 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-blue-600">เกณฑ์การประเมินโอกาสเกิดของความเสี่ยง ระดับ 3 ปานกลาง</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-300">
                    <thead className="bg-blue-50 text-black">
                      <tr>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">ระดับ</th>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">โอกาสเกิดขึ้น</th>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">ด้านกลยุทธ์</th>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">ด้านการเงิน</th>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">ด้านการดำเนินงาน</th>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">ด้านการปฏิบัติตามกฎหมาย/ระเบียบ</th>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">ด้านเทคโนโลยีสารสนเทศ</th>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">ด้านการเกิดทุจริต</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white text-xs">
                      {/* Row 1: Level 5 */}
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-2 py-3 text-center font-medium bg-white">3</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">
                          ปานกลาง
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-center">
                          บุคลากรขุดมงกฎการบริหารครอบครัวไม่ได้ 70 ขอผู้ตรวจสอบยืน 3 ครั้งต่อปี
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-center">
                          บุคลากรขุดมงกฎการบริหารครอบครัวไม่ได้ 70 ขอผู้ตรวจสอบยืน 3 ครั้งต่อปี
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-center">
                          บุคลากรขุดมงกฎการบริหารครอบครัวไม่ได้ 70 ขอผู้ตรวจสอบยืน 3 ครั้งต่อปี
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-center">
                          บุคลากรขุดมงกฎการบริหารครอบครัวไม่ได้ 70 ขอผู้ตรวจสอบยืน 3 ครั้งต่อปี
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-center">
                          บุคลากรขุดมงกฎการบริหารครอบครัวอย่างอีกแบบหึญั 3 รครื่องข่ม
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-center">
                          บุคลากรชั่วไม่อำนาจหน้าที่ ละดำเนินงานอย่างโปร่งใสไม่ยามกฎหมาย
                        </td>
                      </tr>

                      {/* Row 2: งคราว ดพท./สทค./หตม./ทม./คสป./ฝฒท./ฮคพง./คศน./ทบท./พม./เนข./พบ./พษ./ลม./คม.8/คม.5/คษ./ยวท./คข.9/คข.5/พท.10/พท.11 */}
                      <tr className="bg-white">
                        <td className="border border-gray-300 px-2 py-3 text-center bg-white">
                          งคราว<br/>
                          ดพท./สทค./หตม./ทม./คสป./ฝฒท./<br/>
                          ฮคพง./คศน./ทบท./พม./เนข./พบ./<br/>
                          พษ./ลม./คม.8/คม.5<br/>
                          คษ./ยวท./คข.9/คข.5/<br/>
                          พท.10/พท.11
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                      </tr>

                      {/* Row 3: หน่วยงาน อกท. */}
                      <tr className="hover:bg-white">
                        <td className="border border-gray-300 px-2 py-3 text-center bg-white">
                          หน่วยงาน อกท.<br/>
                          ไม่มีแนวคิดการประเนทบิเปลี่ยนเคอลารบำ
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                      </tr>

                      {/* Row 4: หน่วยงาน อคท.3 */}
                      <tr className="bg-white">
                        <td className="border border-gray-300 px-2 py-3 text-center bg-white">
                          หน่วยงาน อคท.3<br/>
                          ไม่มีแนวคิดการประเนทบิการประเนทบิเคอลารบำ
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                      </tr>

                      {/* Row 5: หน่วยงาน อคท.4 */}
                      <tr className="hover:bg-white">
                        <td className="border border-gray-300 px-2 py-3 text-center bg-white">
                          หน่วยงาน อคท.4<br/>
                          ไม่มีแนวคิดการประเนทบิ เคอลารบำโครงการประเนทบิเคอลารบำ
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-center">
                          ไม่มีแนวคิดการประเนทบิ เคอลารบำโครงการประเนทบิเคอลารบำ
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                      </tr>

                      {/* Row 6: รายสถิติ - จำนวน */}
                      <tr className="bg-blue-50">
                        <td className="border border-gray-300 px-2 py-2 text-center font-medium">รายสถิติ<br/>จำนวน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                      </tr>

                      {/* Row 7: เห็นด้วย */}
                      <tr className="bg-blue-50">
                        <td className="border border-gray-300 px-2 py-2 text-center font-medium">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">18 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                      </tr>

                      {/* Row 8: ไม่เห็นด้วย */}
                      <tr className="bg-blue-50">
                        <td className="border border-gray-300 px-2 py-2 text-center font-medium">ไม่เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">2 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">0 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">0 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">0 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">0 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">0 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">0 หน่วยงาน</td>
                      </tr>

                      {/* Row 9: ความเห็นของผู้ตรวจสอบภายใน */}
                      <tr className="bg-yellow-50">
                        <td className="border border-gray-300 px-2 py-2 text-center font-medium">
                          ความเห็นที่ปรึกษาด้านการตรวจสอบภายใน
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                      </tr>

                      {/* Row 10: ความเห็นของหัวหน้ากลุ่มตรวจสอบภายใน */}
                      <tr className="bg-yellow-50">
                        <td className="border border-gray-300 px-2 py-2 text-center font-medium">
                          ความเห็นที่ปรึกษาด้านการตรวจสอบภายใน
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของหัวหน้ากลุ่มตรวจสอบภายในต่อความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของหัวหน้ากลุ่มตรวจสอบภายในต่อความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของหัวหน้ากลุ่มตรวจสอบภายในต่อความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของหัวหน้ากลุ่มตรวจสอบภายในต่อความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของหัวหน้ากลุ่มตรวจสอบภายในต่อความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของหัวหน้ากลุ่มตรวจสอบภายในต่อความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของหัวหน้ากลุ่มตรวจสอบภายในต่อความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-white px-4 py-2 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-blue-600">เกณฑ์การประเมินโอกาสเกิดของความเสี่ยง ระดับ 2 น้อย</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-300">
                    <thead className="bg-blue-50 text-black">
                      <tr>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">ระดับ</th>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">โอกาสเกิดขึ้น</th>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">ด้านกลยุทธ์</th>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">ด้านการเงิน</th>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">ด้านการดำเนินงาน</th>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">ด้านการปฏิบัติตามกฎหมาย/ระเบียบ</th>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">ด้านเทคโนโลยีสารสนเทศ</th>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">ด้านการเกิดทุจริต</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white text-xs">
                      {/* Row 1: Level 5 */}
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-2 py-3 text-center font-medium bg-white">2</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">
                          น้อย
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-center">
                          บุคลากรขุดมงกฎการบริหารครอบครัวไม่ได้ 70 ขอผู้ตรวจสอบยืน 3 ครั้งต่อปี
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-center">
                          บุคลากรขุดมงกฎการบริหารครอบครัวไม่ได้ 70 ขอผู้ตรวจสอบยืน 3 ครั้งต่อปี
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-center">
                          บุคลากรขุดมงกฎการบริหารครอบครัวไม่ได้ 70 ขอผู้ตรวจสอบยืน 3 ครั้งต่อปี
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-center">
                          บุคลากรขุดมงกฎการบริหารครอบครัวไม่ได้ 70 ขอผู้ตรวจสอบยืน 3 ครั้งต่อปี
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-center">
                          บุคลากรขุดมงกฎการบริหารครอบครัวอย่างอีกแบบหึญั 3 รครื่องข่ม
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-center">
                          บุคลากรชั่วไม่อำนาจหน้าที่ ละดำเนินงานอย่างโปร่งใสไม่ยามกฎหมาย
                        </td>
                      </tr>

                      {/* Row 2: งคราว ดพท./สทค./หตม./ทม./คสป./ฝฒท./ฮคพง./คศน./ทบท./พม./เนข./พบ./พษ./ลม./คม.8/คม.5/คษ./ยวท./คข.9/คข.5/พท.10/พท.11 */}
                      <tr className="bg-white">
                        <td className="border border-gray-300 px-2 py-3 text-center bg-white">
                          งคราว<br/>
                          ดพท./สทค./หตม./ทม./คสป./ฝฒท./<br/>
                          ฮคพง./คศน./ทบท./พม./เนข./พบ./<br/>
                          พษ./ลม./คม.8/คม.5<br/>
                          คษ./ยวท./คข.9/คข.5/<br/>
                          พท.10/พท.11
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                      </tr>

                      {/* Row 3: หน่วยงาน อกท. */}
                      <tr className="hover:bg-white">
                        <td className="border border-gray-300 px-2 py-3 text-center bg-white">
                          หน่วยงาน อกท.<br/>
                          ไม่มีแนวคิดการประเนทบิเปลี่ยนเคอลารบำ
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                      </tr>

                      {/* Row 4: หน่วยงาน อคท.3 */}
                      <tr className="bg-white">
                        <td className="border border-gray-300 px-2 py-3 text-center bg-white">
                          หน่วยงาน อคท.3<br/>
                          ไม่มีแนวคิดการประเนทบิการประเนทบิเคอลารบำ
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                      </tr>

                      {/* Row 5: หน่วยงาน อคท.4 */}
                      <tr className="hover:bg-white">
                        <td className="border border-gray-300 px-2 py-3 text-center bg-white">
                          หน่วยงาน อคท.4<br/>
                          ไม่มีแนวคิดการประเนทบิ เคอลารบำโครงการประเนทบิเคอลารบำ
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-center">
                          ไม่มีแนวคิดการประเนทบิ เคอลารบำโครงการประเนทบิเคอลารบำ
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                      </tr>

                      {/* Row 6: รายสถิติ - จำนวน */}
                      <tr className="bg-blue-50">
                        <td className="border border-gray-300 px-2 py-2 text-center font-medium">รายสถิติ<br/>จำนวน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                      </tr>

                      {/* Row 7: เห็นด้วย */}
                      <tr className="bg-blue-50">
                        <td className="border border-gray-300 px-2 py-2 text-center font-medium">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">18 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                      </tr>

                      {/* Row 8: ไม่เห็นด้วย */}
                      <tr className="bg-blue-50">
                        <td className="border border-gray-300 px-2 py-2 text-center font-medium">ไม่เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">2 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">0 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">0 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">0 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">0 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">0 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">0 หน่วยงาน</td>
                      </tr>

                      {/* Row 9: ความเห็นของผู้ตรวจสอบภายใน */}
                      <tr className="bg-yellow-50">
                        <td className="border border-gray-300 px-2 py-2 text-center font-medium">
                          ความเห็นที่ปรึกษาด้านการตรวจสอบภายใน
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                      </tr>

                      {/* Row 10: ความเห็นของหัวหน้ากลุ่มตรวจสอบภายใน */}
                      <tr className="bg-yellow-50">
                        <td className="border border-gray-300 px-2 py-2 text-center font-medium">
                          ความเห็นที่ปรึกษาด้านการตรวจสอบภายใน
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของหัวหน้ากลุ่มตรวจสอบภายในต่อความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของหัวหน้ากลุ่มตรวจสอบภายในต่อความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของหัวหน้ากลุ่มตรวจสอบภายในต่อความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของหัวหน้ากลุ่มตรวจสอบภายในต่อความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของหัวหน้ากลุ่มตรวจสอบภายในต่อความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของหัวหน้ากลุ่มตรวจสอบภายในต่อความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของหัวหน้ากลุ่มตรวจสอบภายในต่อความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-white px-4 py-2 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-blue-600">เกณฑ์การประเมินโอกาสเกิดของความเสี่ยง ระดับ 1 น้อยมาก</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-300">
                    <thead className="bg-blue-50 text-black">
                      <tr>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">ระดับ</th>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">โอกาสเกิดขึ้น</th>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">ด้านกลยุทธ์</th>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">ด้านการเงิน</th>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">ด้านการดำเนินงาน</th>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">ด้านการปฏิบัติตามกฎหมาย/ระเบียบ</th>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">ด้านเทคโนโลยีสารสนเทศ</th>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">ด้านการเกิดทุจริต</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white text-xs">
                      {/* Row 1: Level 5 */}
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-2 py-3 text-center font-medium bg-white">1</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">
                          น้อยมาก
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-center">
                          บุคลากรขุดมงกฎการบริหารครอบครัวไม่ได้ 70 ขอผู้ตรวจสอบยืน 3 ครั้งต่อปี
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-center">
                          บุคลากรขุดมงกฎการบริหารครอบครัวไม่ได้ 70 ขอผู้ตรวจสอบยืน 3 ครั้งต่อปี
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-center">
                          บุคลากรขุดมงกฎการบริหารครอบครัวไม่ได้ 70 ขอผู้ตรวจสอบยืน 3 ครั้งต่อปี
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-center">
                          บุคลากรขุดมงกฎการบริหารครอบครัวไม่ได้ 70 ขอผู้ตรวจสอบยืน 3 ครั้งต่อปี
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-center">
                          บุคลากรขุดมงกฎการบริหารครอบครัวอย่างอีกแบบหึญั 3 รครื่องข่ม
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-center">
                          บุคลากรชั่วไม่อำนาจหน้าที่ ละดำเนินงานอย่างโปร่งใสไม่ยามกฎหมาย
                        </td>
                      </tr>

                      {/* Row 2: งคราว ดพท./สทค./หตม./ทม./คสป./ฝฒท./ฮคพง./คศน./ทบท./พม./เนข./พบ./พษ./ลม./คม.8/คม.5/คษ./ยวท./คข.9/คข.5/พท.10/พท.11 */}
                      <tr className="bg-white">
                        <td className="border border-gray-300 px-2 py-3 text-center bg-white">
                          งคราว<br/>
                          ดพท./สทค./หตม./ทม./คสป./ฝฒท./<br/>
                          ฮคพง./คศน./ทบท./พม./เนข./พบ./<br/>
                          พษ./ลม./คม.8/คม.5<br/>
                          คษ./ยวท./คข.9/คข.5/<br/>
                          พท.10/พท.11
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                      </tr>

                      {/* Row 3: หน่วยงาน อกท. */}
                      <tr className="hover:bg-white">
                        <td className="border border-gray-300 px-2 py-3 text-center bg-white">
                          หน่วยงาน อกท.<br/>
                          ไม่มีแนวคิดการประเนทบิเปลี่ยนเคอลารบำ
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                      </tr>

                      {/* Row 4: หน่วยงาน อคท.3 */}
                      <tr className="bg-white">
                        <td className="border border-gray-300 px-2 py-3 text-center bg-white">
                          หน่วยงาน อคท.3<br/>
                          ไม่มีแนวคิดการประเนทบิการประเนทบิเคอลารบำ
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                      </tr>

                      {/* Row 5: หน่วยงาน อคท.4 */}
                      <tr className="hover:bg-white">
                        <td className="border border-gray-300 px-2 py-3 text-center bg-white">
                          หน่วยงาน อคท.4<br/>
                          ไม่มีแนวคิดการประเนทบิ เคอลารบำโครงการประเนทบิเคอลารบำ
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-center">
                          ไม่มีแนวคิดการประเนทบิ เคอลารบำโครงการประเนทบิเคอลารบำ
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                      </tr>

                      {/* Row 6: รายสถิติ - จำนวน */}
                      <tr className="bg-blue-50">
                        <td className="border border-gray-300 px-2 py-2 text-center font-medium">รายสถิติ<br/>จำนวน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                      </tr>

                      {/* Row 7: เห็นด้วย */}
                      <tr className="bg-blue-50">
                        <td className="border border-gray-300 px-2 py-2 text-center font-medium">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">18 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                      </tr>

                      {/* Row 8: ไม่เห็นด้วย */}
                      <tr className="bg-blue-50">
                        <td className="border border-gray-300 px-2 py-2 text-center font-medium">ไม่เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">2 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">0 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">0 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">0 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">0 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">0 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">0 หน่วยงาน</td>
                      </tr>

                      {/* Row 9: ความเห็นของผู้ตรวจสอบภายใน */}
                      <tr className="bg-yellow-50">
                        <td className="border border-gray-300 px-2 py-2 text-center font-medium">
                          ความเห็นที่ปรึกษาด้านการตรวจสอบภายใน
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                      </tr>

                      {/* Row 10: ความเห็นของหัวหน้ากลุ่มตรวจสอบภายใน */}
                      <tr className="bg-yellow-50">
                        <td className="border border-gray-300 px-2 py-2 text-center font-medium">
                          ความเห็นที่ปรึกษาด้านการตรวจสอบภายใน
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของหัวหน้ากลุ่มตรวจสอบภายในต่อความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของหัวหน้ากลุ่มตรวจสอบภายในต่อความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของหัวหน้ากลุ่มตรวจสอบภายในต่อความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของหัวหน้ากลุ่มตรวจสอบภายในต่อความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของหัวหน้ากลุ่มตรวจสอบภายในต่อความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของหัวหน้ากลุ่มตรวจสอบภายในต่อความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของหัวหน้ากลุ่มตรวจสอบภายในต่อความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Impact Assessment Table - Similar structure to likelihood */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-white px-4 py-2 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-blue-600">ด้านกลยุทธ์</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-300">
                    <thead className="bg-blue-50 text-black">
                      <tr>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">รายละเอียด</th>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">ปัจจัย ๑ แนวโน้มของการปรับเปลี่ยน/โอน/ย้าย/ลาออก ของบุคลากรที่ปฏิบัติงานตามภารกิจขององค์กรและนโยบายองผู้ริหาร จำนวนข้าราชการ ลูกจ้างประจำ พนักงานราชการ</th>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">ปัจจัย ๒ 1.2 ผลการขับเคลื่อนแผนงาน/โครงการตามแผนปฏิบัติราชการของหน่วยงาน</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white text-xs">
                      {/* Impact rows similar to likelihood */}
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-2 py-3 text-center">หน่วยงาน กพร./สลก./ศกช./กนผ./ศสส./ศปผ./กศป./สศท.1/สศท.2/สศท.4/สศท.5/สศท.7/สศท.8/สศท.9/สศท.10/สศท.11/สศท.11</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-2 py-3 text-center">หน่วยงาน สวศ.</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">ไม่เห็นด้วยเพราะ ปัจจัยยังครบถ้วน</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">ไม่เห็นด้วยเพราะ ปัจจัยยังครบถ้วน</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-2 py-3 text-center">หน่วยงาน สศท.3</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">ไม่เห็นด้วยเพราะ ปัจจัยยังครบถ้วน</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-2 py-3 text-center">หน่วยงาน  สศท.6</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">ไม่เห็นด้วยเพราะ ปัจจัยยังครบถ้วน</td>
                      </tr>

                      {/* Row 6: รายสถิติ - จำนวน */}
                      <tr className="bg-blue-50">
                        <td className="border border-gray-300 px-2 py-2 text-center font-medium">รายสถิติ<br/>จำนวน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                      </tr>

                      {/* Row 7: เห็นด้วย */}
                      <tr className="bg-blue-50">
                        <td className="border border-gray-300 px-2 py-2 text-center font-medium">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">18 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                      </tr>

                      {/* Row 8: ไม่เห็นด้วย */}
                      <tr className="bg-blue-50">
                        <td className="border border-gray-300 px-2 py-2 text-center font-medium">ไม่เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">2 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">0 หน่วยงาน</td>
                      </tr>

                      {/* Row 9: ความเห็นของผู้ตรวจสอบภายใน */}
                      <tr className="bg-yellow-50">
                        <td className="border border-gray-300 px-2 py-2 text-center font-medium">
                          ความเห็นที่ปรึกษาด้านการตรวจสอบภายใน
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                      </tr>

                      {/* Row 10: ความเห็นของหัวหน้ากลุ่มตรวจสอบภายใน */}
                      <tr className="bg-yellow-50">
                        <td className="border border-gray-300 px-2 py-2 text-center font-medium">
                          ความเห็นที่ปรึกษาด้านการตรวจสอบภายใน
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของหัวหน้ากลุ่มตรวจสอบภายในต่อความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของหัวหน้ากลุ่มตรวจสอบภายในต่อความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-white px-4 py-2 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-blue-600">ด้านการเงิน</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-300">
                    <thead className="bg-blue-50 text-black">
                      <tr>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">รายละเอียด</th>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">ปัจจัย ๑ จำนวนแผนงาน/โครงการประจำปีงบประมาณ พ.ศ. 2567 ที่หน่วยงานเป็นผู้รับผิดชอบในการดำเนินการ</th>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">ปัจจัย ๒ มีการมอบหมายอำนาจ หน้าที่ ตามทักษะ ความรู้ความสามารถของบุคลากรอย่างเหมาะสม</th>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">ปัจจัย ๓ คู่มือหรือแนวทางการปฏิบัติงาน</th>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">ปัจจัย ๔ การติดตาม และประเมินผลการปฏิบัติงาน</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white text-xs">
                      {/* Impact rows similar to likelihood */}
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-2 py-3 text-center">หน่วยงาน กพร./สลก./ศกช./กนผ./ศสส./ศปผ./กศป./สศท.1/สศท.2/สศท.4/สศท.5/สศท.7/สศท.8/สศท.9/สศท.10/สศท.11/สศท.11</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-2 py-3 text-center">หน่วยงาน สวศ.</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">ไม่เห็นด้วยเพราะ ปัจจัยยังครบถ้วน</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">ไม่เห็นด้วยเพราะ ปัจจัยยังครบถ้วน</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-2 py-3 text-center">หน่วยงาน สศท.3</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">ไม่เห็นด้วยเพราะ ปัจจัยยังครบถ้วน</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-2 py-3 text-center">หน่วยงาน  สศท.6</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">ไม่เห็นด้วยเพราะ ปัจจัยยังครบถ้วน</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                      </tr>

                      {/* Row 6: รายสถิติ - จำนวน */}
                      <tr className="bg-blue-50">
                        <td className="border border-gray-300 px-2 py-2 text-center font-medium">รายสถิติ<br/>จำนวน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                      </tr>

                      {/* Row 7: เห็นด้วย */}
                      <tr className="bg-blue-50">
                        <td className="border border-gray-300 px-2 py-2 text-center font-medium">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">18 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">18 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                      </tr>

                      {/* Row 8: ไม่เห็นด้วย */}
                      <tr className="bg-blue-50">
                        <td className="border border-gray-300 px-2 py-2 text-center font-medium">ไม่เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">2 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">2 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">0 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">0 หน่วยงาน</td>
                      </tr>

                      {/* Row 9: ความเห็นของผู้ตรวจสอบภายใน */}
                      <tr className="bg-yellow-50">
                        <td className="border border-gray-300 px-2 py-2 text-center font-medium">
                          ความเห็นที่ปรึกษาด้านการตรวจสอบภายใน
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                      </tr>

                      {/* Row 10: ความเห็นของหัวหน้ากลุ่มตรวจสอบภายใน */}
                      <tr className="bg-yellow-50">
                        <td className="border border-gray-300 px-2 py-2 text-center font-medium">
                          ความเห็นที่ปรึกษาด้านการตรวจสอบภายใน
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของหัวหน้ากลุ่มตรวจสอบภายในต่อความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของหัวหน้ากลุ่มตรวจสอบภายในต่อความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของหัวหน้ากลุ่มตรวจสอบภายในต่อความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของหัวหน้ากลุ่มตรวจสอบภายในต่อความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-white px-4 py-2 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-blue-600">ด้านการดำเนินงาน</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-300">
                    <thead className="bg-blue-50 text-black">
                      <tr>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">รายละเอียด</th>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">ปัจจัย ๑ จำนวนเงินงบประมาณที่ได้รับการจัดสรรประจำปีงบประมาณ พ.ศ. 2567 (งบดำเนินงาน งบลงทุน งบอุดหนุน งบรายจ่ายอื่น และเงินนอกงบประมาณ)</th>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">ปัจจัย ๒ ความสำเร็จในการดำเนินการตามแผนที่กำหนด</th>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">ปัจจัย ๓ ผลการใช้จ่ายงบประมาณในภาพรวม ณ วันที่ 26 สิงหาคม 2567</th>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">ปัจจัย ๔ ผลการใช้จ่ายงบลงทุน ณ วันที่ 26 สิงหาคม 2567</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white text-xs">
                      {/* Impact rows similar to likelihood */}
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-2 py-3 text-center">หน่วยงาน กพร./สลก./ศกช./กนผ./ศสส./ศปผ./กศป./สศท.1/สศท.2/สศท.4/สศท.5/สศท.7/สศท.8/สศท.9/สศท.10/สศท.11/สศท.11</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-2 py-3 text-center">หน่วยงาน สวศ.</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">ไม่เห็นด้วยเพราะ ปัจจัยยังครบถ้วน</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">ไม่เห็นด้วยเพราะ ปัจจัยยังครบถ้วน</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-2 py-3 text-center">หน่วยงาน สศท.3</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">ไม่เห็นด้วยเพราะ ปัจจัยยังครบถ้วน</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-2 py-3 text-center">หน่วยงาน  สศท.6</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">ไม่เห็นด้วยเพราะ ปัจจัยยังครบถ้วน</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                      </tr>

                      {/* Row 6: รายสถิติ - จำนวน */}
                      <tr className="bg-blue-50">
                        <td className="border border-gray-300 px-2 py-2 text-center font-medium">รายสถิติ<br/>จำนวน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                      </tr>

                      {/* Row 7: เห็นด้วย */}
                      <tr className="bg-blue-50">
                        <td className="border border-gray-300 px-2 py-2 text-center font-medium">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">18 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">18 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                      </tr>

                      {/* Row 8: ไม่เห็นด้วย */}
                      <tr className="bg-blue-50">
                        <td className="border border-gray-300 px-2 py-2 text-center font-medium">ไม่เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">2 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">2 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">0 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">0 หน่วยงาน</td>
                      </tr>

                      {/* Row 9: ความเห็นของผู้ตรวจสอบภายใน */}
                      <tr className="bg-yellow-50">
                        <td className="border border-gray-300 px-2 py-2 text-center font-medium">
                          ความเห็นที่ปรึกษาด้านการตรวจสอบภายใน
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                      </tr>

                      {/* Row 10: ความเห็นของหัวหน้ากลุ่มตรวจสอบภายใน */}
                      <tr className="bg-yellow-50">
                        <td className="border border-gray-300 px-2 py-2 text-center font-medium">
                          ความเห็นที่ปรึกษาด้านการตรวจสอบภายใน
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของหัวหน้ากลุ่มตรวจสอบภายในต่อความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของหัวหน้ากลุ่มตรวจสอบภายในต่อความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของหัวหน้ากลุ่มตรวจสอบภายในต่อความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของหัวหน้ากลุ่มตรวจสอบภายในต่อความเห็นของผู้ตรวจสอบภายในต่อเกณฑ์การประเมินผลโอกาส
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-white px-4 py-2 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-blue-600">ด้านการปฏิบัติตามกฎหมาย/ระเบียบ</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-300">
                    <thead className="bg-blue-50 text-black">
                      <tr>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">รายละเอียด</th>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">ปัจจัย ๑ ด้านการปฏิบัติตามกฎหมาย ระเบียบ</th>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">ปัจจัย ๒ การถูกทักท้วงจากหน่วยตรวจสอบภายใน และหรือหน่วยตรวจสอบภายนอก ประจำปีงบประมาณ พ.ศ. 2567</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white text-xs">
                      {/* Impact rows similar to likelihood */}
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-2 py-3 text-center">หน่วยงาน กพร./สลก./ศกช./กนผ./ศสส./ศปผ./กศป./สศท.1/สศท.2/สศท.4/สศท.5/สศท.7/สศท.8/สศท.9/สศท.10/สศท.11/สศท.11</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-2 py-3 text-center">หน่วยงาน สวศ.</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">ไม่เห็นด้วยเพราะ ปัจจัยยังครบถ้วน</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">ไม่เห็นด้วยเพราะ ปัจจัยยังครบถ้วน</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-2 py-3 text-center">หน่วยงาน สศท.3</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">ไม่เห็นด้วยเพราะ ปัจจัยยังครบถ้วน</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-2 py-3 text-center">หน่วยงาน  สศท.6</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">ไม่เห็นด้วยเพราะ ปัจจัยยังครบถ้วน</td>
                      </tr>

                      {/* Row 6: รายสถิติ - จำนวน */}
                      <tr className="bg-blue-50">
                        <td className="border border-gray-300 px-2 py-2 text-center font-medium">รายสถิติ<br/>จำนวน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                      </tr>

                      {/* Row 7: เห็นด้วย */}
                      <tr className="bg-blue-50">
                        <td className="border border-gray-300 px-2 py-2 text-center font-medium">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">18 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                      </tr>

                      {/* Row 8: ไม่เห็นด้วย */}
                      <tr className="bg-blue-50">
                        <td className="border border-gray-300 px-2 py-2 text-center font-medium">ไม่เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">2 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">0 หน่วยงาน</td>
                      </tr>

                      {/* Row 9: ความเห็นของผู้ตรวจสอบภายใน */}
                      <tr className="bg-yellow-50">
                        <td className="border border-gray-300 px-2 py-2 text-center font-medium">
                          ความเห็นที่ปรึกษาด้านการตรวจสอบภายใน
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของผู้ตรวจสอบภายในต่อปัจจัย 1
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของผู้ตรวจสอบภายในต่อปัจจัย 2
                        </td>
                      </tr>

                      {/* Row 10: ความเห็นของหัวหน้ากลุ่มตรวจสอบภายใน */}
                      <tr className="bg-yellow-50">
                        <td className="border border-gray-300 px-2 py-2 text-center font-medium">
                          ความเห็นที่ปรึกษาด้านการตรวจสอบภายใน
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของหัวหน้ากลุ่มตรวจสอบภายในต่อปัจจัย 1
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของหัวหน้ากลุ่มตรวจสอบภายในต่อปัจจัย 2
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-white px-4 py-2 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-blue-600">ด้านเทคโนโลยีสารสนเทศ</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-300">
                    <thead className="bg-blue-50 text-black">
                      <tr>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">รายละเอียด</th>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">ปัจจัย ๑ การป้องกันการถูกคุกคามทางไซเบอร์ของระบบเทคโนโลยีสารสนเทศ</th>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">ปัจจัย ๒ การใช้ประโยชน์ของระบบงานที่พัฒนา</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white text-xs">
                      {/* Impact rows similar to likelihood */}
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-2 py-3 text-center">หน่วยงาน กพร./สลก./ศกช./กนผ./ศสส./ศปผ./กศป./สศท.1/สศท.2/สศท.4/สศท.5/สศท.7/สศท.8/สศท.9/สศท.10/สศท.11/สศท.11</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-2 py-3 text-center">หน่วยงาน สวศ.</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">ไม่เห็นด้วยเพราะ ปัจจัยยังครบถ้วน</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">ไม่เห็นด้วยเพราะ ปัจจัยยังครบถ้วน</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-2 py-3 text-center">หน่วยงาน สศท.3</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">ไม่เห็นด้วยเพราะ ปัจจัยยังครบถ้วน</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-2 py-3 text-center">หน่วยงาน  สศท.6</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">ไม่เห็นด้วยเพราะ ปัจจัยยังครบถ้วน</td>
                      </tr>

                      {/* Row 6: รายสถิติ - จำนวน */}
                      <tr className="bg-blue-50">
                        <td className="border border-gray-300 px-2 py-2 text-center font-medium">รายสถิติ<br/>จำนวน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                      </tr>

                      {/* Row 7: เห็นด้วย */}
                      <tr className="bg-blue-50">
                        <td className="border border-gray-300 px-2 py-2 text-center font-medium">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">18 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                      </tr>

                      {/* Row 8: ไม่เห็นด้วย */}
                      <tr className="bg-blue-50">
                        <td className="border border-gray-300 px-2 py-2 text-center font-medium">ไม่เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">2 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">0 หน่วยงาน</td>
                      </tr>

                      {/* Row 9: ความเห็นของผู้ตรวจสอบภายใน */}
                      <tr className="bg-yellow-50">
                        <td className="border border-gray-300 px-2 py-2 text-center font-medium">
                          ความเห็นที่ปรึกษาด้านการตรวจสอบภายใน
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของผู้ตรวจสอบภายในต่อปัจจัย 1
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของผู้ตรวจสอบภายในต่อปัจจัย 2
                        </td>
                      </tr>

                      {/* Row 10: ความเห็นของหัวหน้ากลุ่มตรวจสอบภายใน */}
                      <tr className="bg-yellow-50">
                        <td className="border border-gray-300 px-2 py-2 text-center font-medium">
                          ความเห็นที่ปรึกษาด้านการตรวจสอบภายใน
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของหัวหน้ากลุ่มตรวจสอบภายในต่อปัจจัย 1
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของหัวหน้ากลุ่มตรวจสอบภายในต่อปัจจัย 2
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-white px-4 py-2 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-blue-600">ด้านการเกิดทุจริต</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-300">
                    <thead className="bg-blue-50 text-black">
                      <tr>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">รายละเอียด</th>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">ปัจจัย ๑ การป้องกันการถูกคุกคามทางไซเบอร์ของระบบเทคโนโลยีสารสนเทศ</th>
                        <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-center">ปัจจัย ๒ การใช้ประโยชน์ของระบบงานที่พัฒนา</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white text-xs">
                      {/* Impact rows similar to likelihood */}
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-2 py-3 text-center">หน่วยงาน กพร./สลก./ศกช./กนผ./ศสส./ศปผ./กศป./สศท.1/สศท.2/สศท.4/สศท.5/สศท.7/สศท.8/สศท.9/สศท.10/สศท.11/สศท.11</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-2 py-3 text-center">หน่วยงาน สวศ.</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">ไม่เห็นด้วยเพราะ ปัจจัยยังครบถ้วน</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">ไม่เห็นด้วยเพราะ ปัจจัยยังครบถ้วน</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-2 py-3 text-center">หน่วยงาน สศท.3</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">ไม่เห็นด้วยเพราะ ปัจจัยยังครบถ้วน</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-2 py-3 text-center">หน่วยงาน  สศท.6</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-3 text-center">ไม่เห็นด้วยเพราะ ปัจจัยยังครบถ้วน</td>
                      </tr>

                      {/* Row 6: รายสถิติ - จำนวน */}
                      <tr className="bg-blue-50">
                        <td className="border border-gray-300 px-2 py-2 text-center font-medium">รายสถิติ<br/>จำนวน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                      </tr>

                      {/* Row 7: เห็นด้วย */}
                      <tr className="bg-blue-50">
                        <td className="border border-gray-300 px-2 py-2 text-center font-medium">เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">18 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">20 หน่วยงาน</td>
                      </tr>

                      {/* Row 8: ไม่เห็นด้วย */}
                      <tr className="bg-blue-50">
                        <td className="border border-gray-300 px-2 py-2 text-center font-medium">ไม่เห็นด้วย</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">2 หน่วยงาน</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">0 หน่วยงาน</td>
                      </tr>

                      {/* Row 9: ความเห็นของผู้ตรวจสอบภายใน */}
                      <tr className="bg-yellow-50">
                        <td className="border border-gray-300 px-2 py-2 text-center font-medium">
                          ความเห็นที่ปรึกษาด้านการตรวจสอบภายใน
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของผู้ตรวจสอบภายในต่อปัจจัย 1
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของผู้ตรวจสอบภายในต่อปัจจัย 2
                        </td>
                      </tr>

                      {/* Row 10: ความเห็นของหัวหน้ากลุ่มตรวจสอบภายใน */}
                      <tr className="bg-yellow-50">
                        <td className="border border-gray-300 px-2 py-2 text-center font-medium">
                          ความเห็นที่ปรึกษาด้านการตรวจสอบภายใน
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของหัวหน้ากลุ่มตรวจสอบภายในต่อปัจจัย 1
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                          ความเห็นของหัวหน้ากลุ่มตรวจสอบภายในต่อปัจจัย 2
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Modal */}
            <ChiefConfirmSummaryModal
              open={showManageModal}
              value={wantManage}
              onChange={setWantManage}
              onClose={() => setChiefConfirmSummaryModal(false)}
              onConfirm={() => setChiefConfirmSummaryModal(false)}
            />
    </div>
  );
}