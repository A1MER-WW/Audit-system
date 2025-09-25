"use client";

import React, { useMemo, useState } from "react";
import LikelihoodTable from "@/components/likelihoodtable";
import ManageRiskAssessmentsModal from "@/components/riskassessmentsmodal";
import ImpactTable, { ImpactRow } from "@/components/impacttable";
import type { LikelihoodLevel, ManageChoice } from "@/types/riskassessments";
import SubmitToInspectionModal from "@/components/submittoinspectionmodal";
import { useRouter } from "next/navigation";
import ApImpactTable from "@/components/(ap-risk-assessment)/ap-impacttable";

export default function ReportRiskAssessmentPage() {
  const router = useRouter();
  const fiscalYears = useMemo(() => [2568, 2567, 2566, 2565], []);
  const [year, setYear] = useState<number>(2568);
  const [tab, setTab] = useState<"likelihood" | "impact">("likelihood");
  const [comparePrev, setComparePrev] = useState<boolean>(false);

  // modal
  const [showManageModal, setShowManageModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [wantManage, setWantManage] = useState<ManageChoice>("want");

  const factorColumns = [
    "ด้านกลยุทธ์",
    "ด้านการเงิน",
    "ด้านการดำเนินงาน",
    "ด้านการปฏิบัติตามกฎหมาย ระเบียบ",
    "ด้านเทคโนโลยีสารสนเทศ",
    "ด้านการทุจริต",
  ];

  const likelihoodLevels: LikelihoodLevel[] = [
    { level: 5, label: "สูงมาก" },
    { level: 4, label: "สูง" },
    { level: 3, label: "ปานกลาง" },
    { level: 2, label: "น้อย" },
    { level: 1, label: "น้อยมาก" },
  ];

  /** Likelihood (คงเดิม) */
  const mockLikelihoodData = {
    "ด้านกลยุทธ์": {
      "5": "เหตุการณ์ที่มีโอกาสเกิดสูงมาก (มากกว่าร้อยละ 70 หรือเกิดขึ้นมากกว่า 7 ครั้งต่อปี)",
      "4": "เหตุการณ์ที่มีโอกาสเกิดสูง (มากกว่าร้อยละ 60 แต่ไม่เกิน 70 หรือ 6–7 ครั้งต่อปี)",
      "3": "เหตุการณ์ที่มีโอกาสเกิดปานกลาง (มากกว่าร้อยละ 40 แต่ไม่เกิน 60 หรือ 4–5 ครั้งต่อปี)",
      "2": "เหตุการณ์ที่มีโอกาสเกิดน้อย (มากกว่าร้อยละ 20 แต่ไม่เกิน 40 หรือ 2–3 ครั้งต่อปี)",
      "1": "เหตุการณ์ที่มีโอกาสเกิดน้อยมาก (ไม่เกินร้อยละ 20 หรือเกิดขึ้น 1 ครั้งต่อปี)",
    },
    "ด้านการเงิน": {
      "5": "เหตุการณ์ที่มีโอกาสเกิดสูงมาก (มากกว่าร้อยละ 70 หรือเกิดขึ้นมากกว่า 7 ครั้งต่อปี)",
      "4": "เหตุการณ์ที่มีโอกาสเกิดสูง (มากกว่าร้อยละ 60 แต่ไม่เกิน 70 หรือ 6–7 ครั้งต่อปี)",
      "3": "เหตุการณ์ที่มีโอกาสเกิดปานกลาง (มากกว่าร้อยละ 40 แต่ไม่เกิน 60 หรือ 4–5 ครั้งต่อปี)",
      "2": "เหตุการณ์ที่มีโอกาสเกิดน้อย (มากกว่าร้อยละ 20 แต่ไม่เกิน 40 หรือ 2–3 ครั้งต่อปี)",
      "1": "เหตุการณ์ที่มีโอกาสเกิดน้อยมาก (ไม่เกินร้อยละ 20 หรือเกิดขึ้น 1 ครั้งต่อปี)",
    },
    "ด้านการดำเนินงาน": {
      "5": "เหตุการณ์ที่มีโอกาสเกิดสูงมาก (มากกว่าร้อยละ 70 หรือเกิดขึ้นมากกว่า 7 ครั้งต่อปี)",
      "4": "เหตุการณ์ที่มีโอกาสเกิดสูง (มากกว่าร้อยละ 60 แต่ไม่เกิน 70 หรือ 6–7 ครั้งต่อปี)",
      "3": "เหตุการณ์ที่มีโอกาสเกิดปานกลาง (มากกว่าร้อยละ 40 แต่ไม่เกิน 60 หรือ 4–5 ครั้งต่อปี)",
      "2": "เหตุการณ์ที่มีโอกาสเกิดน้อย (มากกว่าร้อยละ 20 แต่ไม่เกิน 40 หรือ 2–3 ครั้งต่อปี)",
      "1": "เหตุการณ์ที่มีโอกาสเกิดน้อยมาก (ไม่เกินร้อยละ 20 หรือเกิดขึ้น 1 ครั้งต่อปี)",
    },
    "ด้านการปฏิบัติตามกฎหมาย ระเบียบ": {
      "5": "เหตุการณ์ที่มีโอกาสเกิดสูงมาก (มากกว่าร้อยละ 70 หรือเกิดขึ้นมากกว่า 7 ครั้งต่อปี)",
      "4": "เหตุการณ์ที่มีโอกาสเกิดสูง (มากกว่าร้อยละ 60 แต่ไม่เกิน 70 หรือ 6–7 ครั้งต่อปี)",
      "3": "เหตุการณ์ที่มีโอกาสเกิดปานกลาง (มากกว่าร้อยละ 40 แต่ไม่เกิน 60 หรือ 4–5 ครั้งต่อปี)",
      "2": "เหตุการณ์ที่มีโอกาสเกิดน้อย (มากกว่าร้อยละ 20 แต่ไม่เกิน 40 หรือ 2–3 ครั้งต่อปี)",
      "1": "เหตุการณ์ที่มีโอกาสเกิดน้อยมาก (ไม่เกินร้อยละ 20 หรือเกิดขึ้น 1 ครั้งต่อปี)",
    },
    "ด้านเทคโนโลยีสารสนเทศ": {
      "5": "เหตุการณ์ที่เกิดขึ้นมากกว่า 4 ครั้งต่อปี",
      "4": "เหตุการณ์ที่เกิดขึ้น 4 ครั้งต่อปี",
      "3": "เหตุการณ์ที่เกิดขึ้น 3 ครั้งต่อปี",
      "2": "เหตุการณ์ที่เกิดขึ้น 2 ครั้งต่อปี",
      "1": "เหตุการณ์ที่เกิดขึ้น 1 ครั้งต่อปี",
    },
    "ด้านการทุจริต": {
      "5": "ไม่มีแผนการบริหารความเสี่ยงด้านการทุจริต",
      "4": "มีแผนแต่ไม่มีการสื่อสารให้บุคลากร",
      "3": "มีแผนแต่ไม่ติดตามและรายงานผล",
      "2": "มีแผนและติดตามผลแต่ไม่ต่อเนื่อง",
      "1": "มีแผนการบริหารความเสี่ยงและติดตามผลอย่างน้อยทุก 3 เดือน",
    },
  };

  /** ---------- Impact mock จากภาพ ---------- */
  type ImpactSection = Record<string, ImpactRow[]>;
  const mockImpactData: ImpactSection = {
    "ด้านกลยุทธ์": [
      {
        id: 1,
        factor:
          "ขาดไม่มีเอกสารการบันทึก/โอน/ย้าย/ถอน ข้อมูลจากระบบฐานข้อมูล ชนิดปฏิบัติการ ตามบทบาทของบุคลากร (ตำแหน่งราชการ ลูกจ้างประจำ พนักงานราชการ)",
        category: "งาน",
        levels: {
          น้อยที่สุด:
            "ทำให้ความถูกต้องฐานข้อมูลที่ปฏิบัติการจริงมีความคลาดเคลื่อนสูงสุด มากกว่า 2 ปี",
          น้อย:
            "ทำให้ความถูกต้องฐานข้อมูลที่ปฏิบัติการจริงมีความคลาดเคลื่อนสูงสุด มากกว่า 1 ปี",
          ปานกลาง:
            "ทำให้ความถูกต้องฐานข้อมูลที่ปฏิบัติการจริงมีความคลาดเคลื่อนสูงสุด เกินกว่า 6 เดือน",
          มาก:
            "ทำให้ความถูกต้องฐานข้อมูลที่ปฏิบัติการจริงมีความคลาดเคลื่อนสูงสุด เกินกว่า 5 เดือน",
          มากที่สุด:
            "ทำให้ความถูกต้องฐานข้อมูลที่ปฏิบัติการจริงมีความคลาดเคลื่อนสูงสุด เกินกว่า 10 เดือน",
        },
      },
      {
        id: 2,
        factor:
          "ผลการพัฒนาผลสัมฤทธิ์/โครงการตามแผนปฏิบัติราชการของหน่วยงาน",
        category: "แผนงาน/โครงการ",
        levels: {
          น้อยที่สุด:
            "ผลการดำเนินงานตามปฏิบัติราชการสำเร็จ 100% โดยไม่มีเหตุให้ถูกปรับปรุงแก้ไขหรือทบทวนแผนงานโครงการ",
          น้อย:
            "ผลการดำเนินงานตามปฏิบัติราชการสำเร็จ แต่มีเหตุให้ถูกปรับปรุงแก้ไขในรายละเอียดเล็กน้อย",
          ปานกลาง:
            "ผลการดำเนินงานสำเร็จ แต่ไม่เป็นไปตามแผนงาน/กรอบเวลาและมีความจำเป็นต้องปรับแผน",
          มาก:
            "ผลการดำเนินงานมีความล่าช้า/ขาดตอน ส่งผลกระทบต่อเป้าหมายสำคัญของหน่วยงาน",
          มากที่สุด:
            "ผลการดำเนินงานไม่บรรลุเป้าหมายหลัก ทำให้แผน/ภารกิจสำคัญไม่บรรลุและต้องทบทวนแผน",
        },
      },
    ],

    "ด้านการเงิน": [
      {
        id: 1,
        factor:
          "จำนวนแผนงาน/โครงการรายจ่ายปีงบประมาณ พ.ศ. 2567 ที่การเบิกจ่ายเงินไม่เป็นไปตามแผนของหน่วยงาน",
        category: "หน่วยงาน",
        levels: {
          น้อยที่สุด: "เป็นจำนวนเงินน้อยกว่า 10% ของวงเงินแผนงาน/โครงการ",
          น้อย: "เป็นจำนวนเงินมากกว่า 10% แต่ไม่เกิน 20% ของวงเงิน",
          ปานกลาง: "เป็นจำนวนเงินมากกว่า 21% – 30% ของวงเงิน",
          มาก: "เป็นจำนวนเงินมากกว่า 31% – 40% ของวงเงิน",
          มากที่สุด: "เป็นจำนวนเงินมากกว่า 41% ของวงเงินขึ้นไป",
        },
      },
      {
        id: 2,
        factor:
          "มีการมอบหมายอำนาจ หน้าที่ตามทักษะความรู้ความสามารถของบุคลากรอย่างเหมาะสม",
        category: "หน่วยงาน",
        levels: {
          น้อยที่สุด: "อัตราเบิกจ่ายรวม 91–100% ของงบประมาณ",
          น้อย: "อัตราเบิกจ่ายรวม 81–90% ของงบประมาณ",
          ปานกลาง: "อัตราเบิกจ่ายรวม 71–80% ของงบประมาณ",
          มาก: "อัตราเบิกจ่ายรวม 61–70% ของงบประมาณ",
          มากที่สุด: "อัตราเบิกจ่ายรวม ต่ำกว่า 60% ของงบประมาณ",
        },
      },
      {
        id: 3,
        factor:
          "คู่มือหรือแนวทางการปฏิบัติงาน",
        category: "หน่วยงาน",
        levels: {
          น้อยที่สุด: "หน่วยงานมีการกำหนดขั้นตอนกระบวนการ แนวทางหรือคู่มือการปฏิบัติงาน ร้อยละ 91-100 และแจ้งเวียนให้บุคลากรทราบอย่างทั่วถึง",
          น้อย: "อัตราเบิกจ่ายรวม 81–90% ของงบประมาณ",
          ปานกลาง: "อัตราเบิกจ่ายรวม 71–80% ของงบประมาณ",
          มาก: "อัตราเบิกจ่ายรวม 61–70% ของงบประมาณ",
          มากที่สุด: "อัตราเบิกจ่ายรวม ต่ำกว่า 60% ของงบประมาณ",
        },
      },
      {
        id: 4,
        factor:
          "คู่มือหรือแนวทางการปฏิบัติงาน",
        category: "หน่วยงาน",
        levels: {
          น้อยที่สุด: "หน่วยงานมีการกำหนดขั้นตอนกระบวนการ แนวทางหรือคู่มือการปฏิบัติงาน ร้อยละ 91-100 และแจ้งเวียนให้บุคลากรทราบอย่างทั่วถึง",
          น้อย: "อัตราเบิกจ่ายรวม 81–90% ของงบประมาณ",
          ปานกลาง: "อัตราเบิกจ่ายรวม 71–80% ของงบประมาณ",
          มาก: "อัตราเบิกจ่ายรวม 61–70% ของงบประมาณ",
          มากที่สุด: "อัตราเบิกจ่ายรวม ต่ำกว่า 60% ของงบประมาณ",
        },
      },
    ],

    "ด้านการดำเนินงาน": [
      {
        id: 1,
        factor:
          "มีจำนวนแผนงาน/โครงการรายจ่ายปีงบประมาณ พ.ศ. 2567 ที่การเบิกจ่ายเงินไม่เป็นไปตามแผนของหน่วยงาน",
        category: "หน่วยงาน",
        levels: {
          น้อยที่สุด: "เป็นจำนวนเงินน้อยกว่า 10% ของวงเงินแผนงาน/โครงการ",
          น้อย: "เป็นจำนวนเงินมากกว่า 10% แต่ไม่เกิน 20% ของวงเงิน",
          ปานกลาง: "เป็นจำนวนเงินมากกว่า 21% – 30% ของวงเงิน",
          มาก: "เป็นจำนวนเงินมากกว่า 31% – 40% ของวงเงิน",
          มากที่สุด: "เป็นจำนวนเงินมากกว่า 41% ของวงเงินขึ้นไป",
        },
      },
      {
        id: 2,
        factor:
          "อัตรารวมของผลการเบิกจ่ายงบประมาณ รวมทั้งหนี้คงค้างของบุคลากรตามหน่วยงานของสำนัก/กอง",
        category: "หน่วยงาน",
        levels: {
          น้อยที่สุด: "อัตราเบิกจ่ายรวม 91–100% ของงบประมาณ",
          น้อย: "อัตราเบิกจ่ายรวม 81–90% ของงบประมาณ",
          ปานกลาง: "อัตราเบิกจ่ายรวม 71–80% ของงบประมาณ",
          มาก: "อัตราเบิกจ่ายรวม 61–70% ของงบประมาณ",
          มากที่สุด: "อัตราเบิกจ่ายรวม ต่ำกว่า 60% ของงบประมาณ",
        },
      },
      // TODO: เติมแถวที่ 3, 4 จากภาพได้ในออบเจ็กต์นี้แบบเดียวกัน
    ],

    "ด้านการปฏิบัติตามกฏหมาย/ระเบียบ": [
      {
        id: 1,
        factor:
          "มีจำนวนแผนงาน/โครงการรายจ่ายปีงบประมาณ พ.ศ. 2567 ที่การเบิกจ่ายเงินไม่เป็นไปตามแผนของหน่วยงาน",
        category: "หน่วยงาน",
        levels: {
          น้อยที่สุด: "เป็นจำนวนเงินน้อยกว่า 10% ของวงเงินแผนงาน/โครงการ",
          น้อย: "เป็นจำนวนเงินมากกว่า 10% แต่ไม่เกิน 20% ของวงเงิน",
          ปานกลาง: "เป็นจำนวนเงินมากกว่า 21% – 30% ของวงเงิน",
          มาก: "เป็นจำนวนเงินมากกว่า 31% – 40% ของวงเงิน",
          มากที่สุด: "เป็นจำนวนเงินมากกว่า 41% ของวงเงินขึ้นไป",
        },
      },
      {
        id: 2,
        factor:
          "อัตรารวมของผลการเบิกจ่ายงบประมาณ รวมทั้งหนี้คงค้างของบุคลากรตามหน่วยงานของสำนัก/กอง",
        category: "หน่วยงาน",
        levels: {
          น้อยที่สุด: "อัตราเบิกจ่ายรวม 91–100% ของงบประมาณ",
          น้อย: "อัตราเบิกจ่ายรวม 81–90% ของงบประมาณ",
          ปานกลาง: "อัตราเบิกจ่ายรวม 71–80% ของงบประมาณ",
          มาก: "อัตราเบิกจ่ายรวม 61–70% ของงบประมาณ",
          มากที่สุด: "อัตราเบิกจ่ายรวม ต่ำกว่า 60% ของงบประมาณ",
        },
      },
      // TODO: เติมแถวที่ 3, 4 จากภาพได้ในออบเจ็กต์นี้แบบเดียวกันฃ
    ],

    "ด้านเทคโนโลยีสารสนเทศ": [
      {
        id: 1,
        factor:
          "มีจำนวนแผนงาน/โครงการรายจ่ายปีงบประมาณ พ.ศ. 2567 ที่การเบิกจ่ายเงินไม่เป็นไปตามแผนของหน่วยงาน",
        category: "หน่วยงาน",
        levels: {
          น้อยที่สุด: "เป็นจำนวนเงินน้อยกว่า 10% ของวงเงินแผนงาน/โครงการ",
          น้อย: "เป็นจำนวนเงินมากกว่า 10% แต่ไม่เกิน 20% ของวงเงิน",
          ปานกลาง: "เป็นจำนวนเงินมากกว่า 21% – 30% ของวงเงิน",
          มาก: "เป็นจำนวนเงินมากกว่า 31% – 40% ของวงเงิน",
          มากที่สุด: "เป็นจำนวนเงินมากกว่า 41% ของวงเงินขึ้นไป",
        },
      },
      {
        id: 2,
        factor:
          "อัตรารวมของผลการเบิกจ่ายงบประมาณ รวมทั้งหนี้คงค้างของบุคลากรตามหน่วยงานของสำนัก/กอง",
        category: "หน่วยงาน",
        levels: {
          น้อยที่สุด: "อัตราเบิกจ่ายรวม 91–100% ของงบประมาณ",
          น้อย: "อัตราเบิกจ่ายรวม 81–90% ของงบประมาณ",
          ปานกลาง: "อัตราเบิกจ่ายรวม 71–80% ของงบประมาณ",
          มาก: "อัตราเบิกจ่ายรวม 61–70% ของงบประมาณ",
          มากที่สุด: "อัตราเบิกจ่ายรวม ต่ำกว่า 60% ของงบประมาณ",
        },
      },
      // TODO: เติมแถวที่ 3, 4 จากภาพได้ในออบเจ็กต์นี้แบบเดียวกัน
    ],

    "ด้านการเกิดทุจริต": [
      {
        id: 1,
        factor:
          "มีจำนวนแผนงาน/โครงการรายจ่ายปีงบประมาณ พ.ศ. 2567 ที่การเบิกจ่ายเงินไม่เป็นไปตามแผนของหน่วยงาน",
        category: "หน่วยงาน",
        levels: {
          น้อยที่สุด: "เป็นจำนวนเงินน้อยกว่า 10% ของวงเงินแผนงาน/โครงการ",
          น้อย: "เป็นจำนวนเงินมากกว่า 10% แต่ไม่เกิน 20% ของวงเงิน",
          ปานกลาง: "เป็นจำนวนเงินมากกว่า 21% – 30% ของวงเงิน",
          มาก: "เป็นจำนวนเงินมากกว่า 31% – 40% ของวงเงิน",
          มากที่สุด: "เป็นจำนวนเงินมากกว่า 41% ของวงเงินขึ้นไป",
        },
      },
      {
        id: 2,
        factor:
          "อัตรารวมของผลการเบิกจ่ายงบประมาณ รวมทั้งหนี้คงค้างของบุคลากรตามหน่วยงานของสำนัก/กอง",
        category: "หน่วยงาน",
        levels: {
          น้อยที่สุด: "อัตราเบิกจ่ายรวม 91–100% ของงบประมาณ",
          น้อย: "อัตราเบิกจ่ายรวม 81–90% ของงบประมาณ",
          ปานกลาง: "อัตราเบิกจ่ายรวม 71–80% ของงบประมาณ",
          มาก: "อัตราเบิกจ่ายรวม 61–70% ของงบประมาณ",
          มากที่สุด: "อัตราเบิกจ่ายรวม ต่ำกว่า 60% ของงบประมาณ",
        },
      },
      // TODO: เติมแถวที่ 3, 4 จากภาพได้ในออบเจ็กต์นี้แบบเดียวกัน
    ],
  };

  return (
    <div className="w-full h-full bg-gray-50 text-gray-900 flex flex-col">
      <div className="w-full h-full px-6 py-4 flex flex-col">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <button className="hover:underline">กลับ</button>
          <span>›</span>
          <span className="text-gray-700">กำหนดปัจจัยเสี่ยงและเกณฑ์การจัดความเสี่ยง</span>
        </div>

        {/* Top controls */}
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-5">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">ปีงบประมาณ</label>
            <div className="relative w-56">
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-2.5 pr-10 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              >
                {fiscalYears.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 011.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" />
              </svg>
            </div>
          </div>


        </div>



        {/* Information Card - Overview */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  ปัจจัยและเกณฑ์พิจารณาความเสี่ยง สำหรับใช้ในการประเมินและจัดลำดับความเสี่ยงแผนการตรวจสอบประจำปี {year}
                </h3>
                <div className="flex gap-3">
                  <button   
                    onClick={() => setShowSubmitModal(true)}
                    className="rounded-xl bg-indigo-600 px-4 py-2 text-white shadow hover:bg-indigo-700 text-sm">
                    Export to PDF/Excel
                  </button>
                  <button
                    onClick={() => setShowManageModal(true)}
                    className="rounded-xl bg-indigo-600 px-4 py-2 text-white shadow hover:bg-indigo-700 text-sm"
                  >
                    Audit Trail
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                ปัจจัยและเกณฑ์พิจารณาความเสี่ยง
              </p>
              <div className="mt-3 inline-flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <span>สถานะ: การประเมินปัจจัยความเสี่ยงและเกณฑ์การจัดความเสี่ยงครบถ้วนแล้ว</span>
              </div>
            </div>
          </div>
        </div>
        
                {/* Dashboard Statistics */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-1 text-left">
                ภาพรวมการประเมินปัจจัยความเสี่ยงและเกณฑ์ความเสี่ยงผลกระทบจากความเสี่ยง
            </h2>
            <p className="text-xs text-gray-500 mb-6 text-left">
                ปีงบประมาณ {year}
            </p>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

            {/* ================== RIGHT : DONUT ================== */}
        <div className="rounded-lg border bg-gray-50 p-6 relative xl:col-span-2">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 text-left">
            จำนวนปัจจัยในแต่ละด้าน
        </h3>

        {/* 6 ด้าน boxes */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
            <div className="text-lg font-bold text-blue-600">2</div>
            <div className="text-xs text-gray-600">ด้านกลยุทธ์</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
            <div className="text-lg font-bold text-green-600">4</div>
            <div className="text-xs text-gray-600">ด้านการเงิน</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
            <div className="text-lg font-bold text-orange-600">4</div>
            <div className="text-xs text-gray-600">ด้านการดำเนินงาน</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
            <div className="text-lg font-bold text-red-600">2</div>
            <div className="text-xs text-gray-600">ด้านกฎหมาย/ระเบียบ</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
            <div className="text-lg font-bold text-purple-600">2</div>
            <div className="text-xs text-gray-600">ด้านเทคโนโลยีสารสนเทศ</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
            <div className="text-lg font-bold text-pink-600">2</div>
            <div className="text-xs text-gray-600">ด้านการทุจริต</div>
          </div>
        </div>

        {/*
        ชุดข้อมูลตามภาพ: รวม 16 ปัจจัย แบ่งเป็น 20%/20%/20%/15%/15% (4,4,4,2,2)
        พร้อม labels รอบวง
        */}
        <div className="flex items-center justify-center">
            <div className="relative w-[280px] max-w-full">
            {/* Donut */}
            <svg viewBox="0 0 200 200" className="-rotate-90 mx-auto block">
                {/* พาย 5 ส่วน: เริ่มจากน้อยมาก -> น้อย -> ปานกลาง -> สูง -> สูงมาก */}
                {(() => {
                const total = 16;
                const parts = [
                    { value: 4, color:"#2563EB", key:"น้อยมาก" }, // 20%
                    { value: 4, color:"#059669", key:"น้อย" },     // 20%
                    { value: 4, color:"#D97706", key:"ปานกลาง" }, // 20%
                    { value: 2, color:"#EA580C", key:"สูง" },     // 15%
                    { value: 2, color:"#DC2626", key:"สูงมาก" },  // 15%
                ];
                const r = 65;
                const c = 100;
                const stroke = 24;
                const circ = 2 * Math.PI * r;

                let offset = 0;
                return parts.map((p, i) => {
                    const len = (p.value / total) * circ;
                    const dasharray = `${len} ${circ - len}`;
                    const el = (
                    <circle
                        key={i}
                        cx={c}
                        cy={c}
                        r={r}
                        fill="none"
                        stroke={p.color}
                        strokeWidth={stroke}
                        strokeDasharray={dasharray}
                        strokeDashoffset={-offset}
                        strokeLinecap="butt"
                    />
                    );
                    offset += len;
                    return el;
                });
                })()}
            </svg>

            {/* Center total */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                <div className="text-xl font-bold text-gray-900">16</div>
              <div className="text-xs text-gray-600">ปัจจัย</div>
            </div>
          </div>

          {/* Labels + leader lines เหมือนภาพ */}
          {/* น้อยมาก (20%) ขวาบน */}
          <div className="absolute left-[68%] top-[14%] translate-x-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-px bg-blue-300" />
              <div className="text-right">
                <div className="text-xs text-gray-700">ด้านการปฏิบัติงาน</div>
                <div className="text-[11px] text-gray-500">
                  <span className="font-bold">4</span> <span>20%</span>
                </div>
              </div>
            </div>
          </div>

          {/* เทคโนโลยีสารสนเทศ (15%) ขวากลาง */}
          <div className="absolute left-[78%] top-[42%] translate-x-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-px bg-green-300" />
              <div className="text-right">
                <div className="text-xs text-gray-700">ด้านเทคโนโลยีสารสนเทศ</div>
                <div className="text-[11px] text-gray-500">
                  <span className="font-bold">2</span> <span>15%</span>
                </div>
              </div>
            </div>
          </div>

          {/* กลยุทธ์ (15%) ขวาล่าง */}
          <div className="absolute left-[78%] top-[68%] translate-x-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-px bg-yellow-300" />
              <div className="text-right">
                <div className="text-xs text-gray-700">ด้านกลยุทธ์</div>
                <div className="text-[11px] text-gray-500">
                  <span className="font-bold">2</span> <span>15%</span>
                </div>
              </div>
            </div>
          </div>

          {/* การเงิน (15%) ซ้ายล่าง */}
          <div className="absolute right-[78%] top-[68%] -translate-x-2">
            <div className="flex items-center gap-2">
              <div className="text-left">
                <div className="text-xs text-gray-700">ด้านการเงิน</div>
                <div className="text-[11px] text-gray-500">
                  <span className="font-bold">2</span> <span>15%</span>
                </div>
              </div>
              <div className="w-10 h-px bg-pink-300" />
            </div>
          </div>

          {/* กฎหมาย/ระเบียบ (20%) ซ้ายบน */}
          <div className="absolute right-[68%] top-[14%] -translate-x-2">
            <div className="flex items-center gap-2">
              <div className="text-left">
                <div className="text-xs text-gray-700">ด้านกฎหมาย/ระเบียบ</div>
                <div className="text-[11px] text-gray-500">
                  <span className="font-bold">4</span> <span>20%</span>
                </div>
              </div>
              <div className="w-10 h-px bg-sky-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

        {/* Tabs + compare */}
        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="inline-flex rounded-xl bg-gray-100 p-1">
            <button
              onClick={() => setTab("likelihood")}
              className={`px-4 py-2 text-sm rounded-lg transition ${tab === "likelihood" ? "bg-white shadow text-indigo-700" : "text-gray-600 hover:text-gray-800"}`}
            >
              โอกาส (Likelihood)
            </button>
            <button
              onClick={() => setTab("impact")}
              className={`px-4 py-2 text-sm rounded-lg transition ${tab === "impact" ? "bg-white shadow text-indigo-700" : "text-gray-600 hover:text-gray-800"}`}
            >
              ผลกระทบ (Impact)
            </button>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">เปรียบเทียบกับปีงบประมาณก่อนหน้า</span>
            <label className="inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={comparePrev}
                onChange={(e) => setComparePrev(e.target.checked)}
              />
              <span className="h-5 w-10 rounded-full bg-gray-300 transition-all peer-checked:bg-indigo-600 relative after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-5" />
            </label>
            {tab === "impact" && (
              <>
                <button className="rounded-lg border px-3 py-1.5 text-gray-700 hover:bg-gray-100">กรอง</button>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {tab === "likelihood" ? (
            <LikelihoodTable
              columns={factorColumns}
              levels={likelihoodLevels}
              data={mockLikelihoodData}
              comparePrev={comparePrev}
              prevData={comparePrev ? mockLikelihoodData : undefined}
            />
          ) : (
            <div className="mt-4 space-y-8">
              {Object.entries(mockImpactData).map(([title, rows]) => (
                <ApImpactTable key={title} title={title} rows={rows} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <ManageRiskAssessmentsModal
        open={showManageModal}
        value={wantManage}
        onChange={setWantManage}
        onClose={() => setShowManageModal(false)}
        onConfirm={() => setShowManageModal(false)}
      />
      <SubmitToInspectionModal
        open={showSubmitModal}
        value={wantManage}
        onChange={setWantManage}
        onClose={() => setShowSubmitModal(false)}
        onConfirm={() => setShowSubmitModal(false)}
      />
    </div>
  );
}

