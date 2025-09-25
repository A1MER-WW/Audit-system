"use client";

import React, { useMemo, useState } from "react";
import ManageRiskAssessmentsModal from "@/components/riskassessmentsmodal";
import ImpactTable, { ImpactRow } from "@/components/impacttable";
import type { LikelihoodLevel, ManageChoice } from "@/types/riskassessments";
import SubmitToInspectionModal from "@/components/submittoinspectionmodal";
import { useRouter } from "next/navigation";
import CommentByAgencyModal from "@/components/commentbyagencymodal";

export default function RiskAssessmentsPage() {
  const router = useRouter();
  const fiscalYears = useMemo(() => [2568, 2567, 2566, 2565], []);
  const [year, setYear] = useState<number>(2568);
  const [tab, setTab] = useState<"likelihood" | "impact">("likelihood");
  const [comparePrev, setComparePrev] = useState<boolean>(false);

  // modal
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [wantManage, setWantManage] = useState<ManageChoice>("want");

  // State for tracking comments and agreement status
  const [impactComments, setImpactComments] = useState<Record<string, Record<number, { 
    agree: boolean | null; 
    disagree: boolean | null; 
    comment: string 
  }>>>({});

  // State for tracking likelihood comments and agreement status
  const [likelihoodComments, setLikelihoodComments] = useState<Record<string, Record<number, { 
    agree: boolean | null; 
    disagree: boolean | null; 
    comment: string 
  }>>>({});

  // Function to update comment data
  const updateImpactComment = (sectionTitle: string, rowIndex: number, field: 'agree' | 'disagree' | 'comment', value: boolean | string) => {
    setImpactComments((prev: Record<string, Record<number, { agree: boolean | null; disagree: boolean | null; comment: string }>>) => {
      const sectionData = prev[sectionTitle] || {};
      const rowData = sectionData[rowIndex] || { agree: null, disagree: null, comment: '' };
      
      if (field === 'agree') {
        rowData.agree = value as boolean;
        rowData.disagree = null; // Clear disagree when agree is selected
      } else if (field === 'disagree') {
        rowData.disagree = value as boolean;
        rowData.agree = null; // Clear agree when disagree is selected
      } else {
        rowData.comment = value as string;
      }
      
      return {
        ...prev,
        [sectionTitle]: {
          ...sectionData,
          [rowIndex]: rowData
        }
      };
    });
  };

  const getImpactComment = (sectionTitle: string, rowIndex: number) => {
    return impactComments[sectionTitle]?.[rowIndex] || { agree: null, disagree: null, comment: '' };
  };

  // Function to update likelihood comment data
  const updateLikelihoodComment = (sectionTitle: string, rowIndex: number, field: 'agree' | 'disagree' | 'comment', value: boolean | string) => {
    setLikelihoodComments((prev: Record<string, Record<number, { agree: boolean | null; disagree: boolean | null; comment: string }>>) => {
      const sectionData = prev[sectionTitle] || {};
      const rowData = sectionData[rowIndex] || { agree: null, disagree: null, comment: '' };
      
      if (field === 'agree') {
        rowData.agree = value as boolean;
        rowData.disagree = null; // Clear disagree when agree is selected
      } else if (field === 'disagree') {
        rowData.disagree = value as boolean;
        rowData.agree = null; // Clear agree when disagree is selected
      } else {
        rowData.comment = value as string;
      }
      
      return {
        ...prev,
        [sectionTitle]: {
          ...sectionData,
          [rowIndex]: rowData
        }
      };
    });
  };

  const getLikelihoodComment = (sectionTitle: string, rowIndex: number) => {
    return likelihoodComments[sectionTitle]?.[rowIndex] || { agree: null, disagree: null, comment: '' };
  };

  // Calculate statistics
  const getCommentStats = () => {
    let totalRows = 0;
    let agreedRows = 0;
    let disagreedRows = 0;
    let commentedRows = 0;

    if (tab === "impact") {
      Object.entries(mockImpactData).forEach(([title, rows]) => {
        rows.forEach((_, rowIndex) => {
          totalRows++;
          const comment = getImpactComment(title, rowIndex);
          if (comment.agree === true) agreedRows++;
          if (comment.disagree === true) disagreedRows++;
          if (comment.comment.trim() !== '') commentedRows++;
        });
      });
    } else {
      // For likelihood tab - now using single table with 5 rows
      likelihoodLevels.forEach((_, rowIndex) => {
        totalRows++;
        const comment = getLikelihoodComment("likelihood", rowIndex);
        if (comment.agree === true) agreedRows++;
        if (comment.disagree === true) disagreedRows++;
        if (comment.comment.trim() !== '') commentedRows++;
      });
    }

    return { totalRows, agreedRows, disagreedRows, commentedRows };
  };

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
        group: "หน่วยงาน",
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
        group: "หน่วยงาน",
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
        group: "โครงการ",
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
        group: "หน่วยงาน",
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
        group: "หน่วยงาน",
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
        group: "หน่วยงาน",
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
        group: "โครงการ",
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
        group: "หน่วยงาน",
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
        group: "โครงการ",
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
        group: "หน่วยงาน",
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
        group: "โครงการ",
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
        group: "หน่วยงาน",
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
        group: "โครงการ",
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
        group: "หน่วยงาน",
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
                    onClick={() => setShowCommentModal(true)}
                    className="rounded-xl bg-indigo-600 px-4 py-2 text-white shadow hover:bg-indigo-700 text-sm">
                    ยืนยันความคิดเห็น
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                ปัจจัยและเกณฑ์พิจารณาความเสี่ยง
              </p>
              <div className="mt-3 space-y-2">
                <p className="text-sm text-yellow-600">
                  กรุณาให้ความเห็นก่อนวันที่ <span className="font-semibold">30 ก.ค 68 เวลา 23.55 น.</span>
                </p>
                <div className="inline-flex items-center text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                  <span>สถานะ: หน่วยงานในสังกัดยังไม่ให้ความเห็น</span>
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
            <div className="mt-4 space-y-8">
              {/* Statistics for likelihood tab */}
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h4 className="text-sm font-medium text-green-900 mb-2">สถิติการตอบกลับ (โอกาส)</h4>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{getCommentStats().totalRows}</div>
                    <div className="text-gray-600">รายการทั้งหมด</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{getCommentStats().agreedRows}</div>
                    <div className="text-gray-600">เห็นด้วย</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-600">{getCommentStats().disagreedRows}</div>
                    <div className="text-gray-600">ไม่เห็นด้วย</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{getCommentStats().commentedRows}</div>
                    <div className="text-gray-600">มีความคิดเห็น</div>
                  </div>
                </div>
              </div>

              {/* Single Likelihood Table */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">เกณฑ์การประเมินโอกาสเกิดเหตุการณ์ความเสี่ยง (Likelihood: L)</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ระดับ
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          โอกาสที่จะเกิด
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ด้านกลยุทธ์
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ด้านการเงิน
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ด้านการดำเนินงาน
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ด้านการปฏิบัติตามกฏหมาย/ระเบียบ
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ด้านเทคโนโลยีสารสนเทศ
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ด้านการทุจริต
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          เห็นด้วย
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ไม่เห็นด้วย
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ความคิดเห็น
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {likelihoodLevels.map((levelInfo, rowIndex) => {
                        const level = levelInfo.level.toString();
                        const levelLabel = levelInfo.label;
                        
                        const commentData = getLikelihoodComment("likelihood", rowIndex);
                        return (
                          <tr key={level} className="hover:bg-gray-50">
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                              {level}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-700">
                              <div>
                                <div className="font-medium">{levelLabel}</div>
                                <div className="text-xs text-gray-500">{mockLikelihoodData["ด้านกลยุทธ์"][level as keyof typeof mockLikelihoodData["ด้านกลยุทธ์"]]}</div>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-500">
                              {mockLikelihoodData["ด้านกลยุทธ์"][level as keyof typeof mockLikelihoodData["ด้านกลยุทธ์"]]}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-500">
                              {mockLikelihoodData["ด้านการเงิน"][level as keyof typeof mockLikelihoodData["ด้านการเงิน"]]}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-500">
                              {mockLikelihoodData["ด้านการดำเนินงาน"][level as keyof typeof mockLikelihoodData["ด้านการดำเนินงาน"]]}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-500">
                              {mockLikelihoodData["ด้านการปฏิบัติตามกฎหมาย ระเบียบ"][level as keyof typeof mockLikelihoodData["ด้านการปฏิบัติตามกฎหมาย ระเบียบ"]]}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-500">
                              {mockLikelihoodData["ด้านเทคโนโลยีสารสนเทศ"][level as keyof typeof mockLikelihoodData["ด้านเทคโนโลยีสารสนเทศ"]]}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-500">
                              {mockLikelihoodData["ด้านการทุจริต"][level as keyof typeof mockLikelihoodData["ด้านการทุจริต"]]}
                            </td>
                            <td className="px-4 py-4 text-center">
                              <input
                                type="checkbox"
                                checked={commentData.agree === true}
                                onChange={(e) => 
                                  updateLikelihoodComment("likelihood", rowIndex, 'agree', e.target.checked)
                                }
                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                              />
                            </td>
                            <td className="px-4 py-4 text-center">
                              <input
                                type="checkbox"
                                checked={commentData.disagree === true}
                                onChange={(e) => 
                                  updateLikelihoodComment("likelihood", rowIndex, 'disagree', e.target.checked)
                                }
                                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                              />
                            </td>
                            <td className="px-4 py-4">
                              <textarea
                                value={commentData.comment}
                                onChange={(e) => 
                                  updateLikelihoodComment("likelihood", rowIndex, 'comment', e.target.value)
                                }
                                placeholder="ความคิดเห็น..."
                                className="w-full px-2 py-1 border border-gray-300 rounded text-xs resize-none"
                                rows={2}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 space-y-8">
              {/* Statistics for impact tab */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="text-sm font-medium text-blue-900 mb-2">สถิติการตอบกลับ</h4>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{getCommentStats().totalRows}</div>
                    <div className="text-gray-600">รายการทั้งหมด</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{getCommentStats().agreedRows}</div>
                    <div className="text-gray-600">เห็นด้วย</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-600">{getCommentStats().disagreedRows}</div>
                    <div className="text-gray-600">ไม่เห็นด้วย</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{getCommentStats().commentedRows}</div>
                    <div className="text-gray-600">มีความคิดเห็น</div>
                  </div>
                </div>
              </div>

              {Object.entries(mockImpactData).map(([title, rows]) => (
                <div key={title} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ระดับ
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ปัจจัย
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            หมวดหมู่
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            น้อยที่สุด
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            น้อย
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ปานกลาง
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            มาก
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            มากที่สุด
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            เห็นด้วย
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ไม่เห็นด้วย
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ความคิดเห็น
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {rows.map((row, rowIndex) => {
                          const commentData = getImpactComment(title, rowIndex);
                          return (
                            <tr key={row.id} className="hover:bg-gray-50">
                              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                                {5 - rowIndex}
                              </td>
                              <td className="px-4 py-4 text-sm text-gray-700">
                                <div>
                                  <div className="font-medium">{row.factor}</div>
                                  <div className="text-xs text-gray-500">{row.category} - {row.group}</div>
                                </div>
                              </td>
                              <td className="px-4 py-4 text-sm text-gray-500">
                                {row.category}
                              </td>
                              <td className="px-4 py-4 text-sm text-gray-500">
                                {row.levels.น้อยที่สุด}
                              </td>
                              <td className="px-4 py-4 text-sm text-gray-500">
                                {row.levels.น้อย}
                              </td>
                              <td className="px-4 py-4 text-sm text-gray-500">
                                {row.levels.ปานกลาง}
                              </td>
                              <td className="px-4 py-4 text-sm text-gray-500">
                                {row.levels.มาก}
                              </td>
                              <td className="px-4 py-4 text-sm text-gray-500">
                                {row.levels.มากที่สุด}
                              </td>
                              <td className="px-4 py-4 text-center">
                                <input
                                  type="checkbox"
                                  checked={commentData.agree === true}
                                  onChange={(e) => 
                                    updateImpactComment(title, rowIndex, 'agree', e.target.checked)
                                  }
                                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                />
                              </td>
                              <td className="px-4 py-4 text-center">
                                <input
                                  type="checkbox"
                                  checked={commentData.disagree === true}
                                  onChange={(e) => 
                                    updateImpactComment(title, rowIndex, 'disagree', e.target.checked)
                                  }
                                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                />
                              </td>
                              <td className="px-4 py-4">
                                <textarea
                                  value={commentData.comment}
                                  onChange={(e) => 
                                    updateImpactComment(title, rowIndex, 'comment', e.target.value)
                                  }
                                  placeholder="ความคิดเห็น..."
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs resize-none"
                                  rows={2}
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <CommentByAgencyModal
        open={showCommentModal}
        value={wantManage}
        onChange={setWantManage}
        onClose={() => setShowCommentModal(false)}
        onConfirm={() => setShowCommentModal(false)}
      />
    </div>
  );
}
