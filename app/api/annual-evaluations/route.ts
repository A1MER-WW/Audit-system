import { NextResponse } from "next/server";
import { db, formsMap } from "@/lib/mock-risk-db";

/** ========= Types ========= */

export type Grade = "E" | "H" | "M" | "L" | "N";
export type MaybeGrade = Grade | null;

export type EvaluationStatus = "IN_PROGRESS" | "DONE" | "PENDING";

export type AnnualStatus =
  | "ASSESSOR_IN_PROGRESS" // ผู้ตรวจสอบดำเนินการประเมินความเสี่ยง
  | "AWAITING_DIRECTOR_REVIEW" // รอหัวหน้าหน่วยตรวจสอบพิจารณาผลการประเมินความเสี่ยง
  | "DIRECTOR_REJECTED" // หัวหน้าหน่วยตรวจสอบพิจารณาไม่อนุมัติผลการประเมินความเสี่ยง
  | "DIRECTOR_APPROVED"; // หัวหน้าหน่วยตรวจสอบพิจารณาอนุมัติผลการประเมินความเสี่ยงเรียบร้อยแล้ว

export type Department = {
  id: number;
  departmentName: string;
  composite_score: number | null; // ✅
  grade: MaybeGrade; // ✅
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
  total_score: number | null; // ✅
  composite_score: number | null; // ✅
  grade: MaybeGrade; // ✅
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

/** ========= Mock Data ========= */

export const mockAnnualEvaluations: ApiAnnualEvaluation[] = [
  {
    id: 1,
    fiscalYear: 2568,
    status: "ASSESSOR_IN_PROGRESS",
    auditor_signature: null,
    director_signature: null,
    director_comment: null,
    version: 1,
    RiskEvaluations: [
      {
        id: 1,
        category: { id: 1, name: "งาน" },
        auditTopics: [
          {
            id: 101,
            auditTopic: "การควบคุมภายใน 1",
            auditTopicType: {
              id: 1,
              name: "หัวข้องานตรวจสอบ",
              isActive: true,
            },
            DepartmentAssessmentScore: [
              {
                department: {
                  id: 1,
                  departmentName: "สลก.",
                  composite_score: 16,
                  grade: "H",
                },
              },
            ],
            total_score: 16,
            composite_score: 16,
            grade: "H",
            order: 1,
            order_by_user: 1,
            reason_for_new_order: "ความเสี่ยงหลักขององค์กร",
            evaluation_status: "IN_PROGRESS",
          },
          {
            id: 102,
            auditTopic: "การควบคุมภายใน 2",
            auditTopicType: {
              id: 1,
              name: "หัวข้องานตรวจสอบ",
              isActive: true,
            },
            DepartmentAssessmentScore: [
              {
                department: {
                  id: 3,
                  departmentName: "ศกช.",
                  composite_score: 16,
                  grade: "H",
                },
              },
            ],
            total_score: 16,
            composite_score: 16,
            grade: "H",
            order: 2,
            order_by_user: 2,
            reason_for_new_order: "ทบทวนซ้ำคนละช่วงเวลา",
            evaluation_status: "IN_PROGRESS",
          },
          {
            id: 103,
            auditTopic: "การควบคุมภายใน 3",
            auditTopicType: {
              id: 1,
              name: "หัวข้องานตรวจสอบ",
              isActive: true,
            },
            DepartmentAssessmentScore: [
              {
                department: {
                  id: 5,
                  departmentName: "กพร.",
                  composite_score: 16,
                  grade: "H",
                },
              },
            ],
            total_score: 16,
            composite_score: 16,
            grade: "H",
            order: 3,
            order_by_user: 3,
            reason_for_new_order: "แยกเฟสการทำงาน",
            evaluation_status: "IN_PROGRESS",
          },
          {
            id: 104,
            auditTopic: "งานสารบรรณ",
            auditTopicType: {
              id: 1,
              name: "หัวข้องานตรวจสอบ",
              isActive: true,
            },
            DepartmentAssessmentScore: [
              {
                department: {
                  id: 1,
                  departmentName: "สลก.",
                  composite_score: 25,
                  grade: "L",
                },
              },
              {
                department: {
                  id: 9,
                  departmentName: "ศสส.",
                  composite_score: 16,
                  grade: "H",
                },
              },
            ],
            total_score: 25,
            composite_score: 25,
            grade: "L",
            order: 4,
            order_by_user: 4,
            reason_for_new_order: "รองรับงานบริการเอกสาร",
            evaluation_status: "DONE",
          },
          {
            id: 105,
            auditTopic: "ติดตามและประเมินผลภายใน",
            auditTopicType: {
              id: 1,
              name: "หัวข้องานตรวจสอบ",
              isActive: true,
            },
            DepartmentAssessmentScore: [
              {
                department: {
                  id: 6,
                  departmentName: "ศปผ.",
                  composite_score: 16,
                  grade: "H",
                },
              },
            ],
            total_score: 16,
            composite_score: 16,
            grade: "H",
            order: 5,
            order_by_user: 5,
            reason_for_new_order: "เพิ่มประสิทธิภาพการติดตาม",
            evaluation_status: "IN_PROGRESS",
          },
        ],
      },
      {
        id: 2,
        category: { id: 2, name: "หน่วยงาน" },
        auditTopics: [
          {
            id: 201,
            auditTopic: "การบริหารความเสี่ยงหน่วยงาน",
            auditTopicType: {
              id: 2,
              name: "หัวข้อจากแผนบริหารความเสี่ยง",
              isActive: true,
            },
            DepartmentAssessmentScore: [
              {
                department: {
                  id: 3,
                  departmentName: "ศกช.",
                  composite_score: 16,
                  grade: "H",
                },
              },
            ],
            total_score: 16,
            composite_score: 16,
            grade: "H",
            order: 1,
            order_by_user: 1,
            reason_for_new_order: "เน้นความเสี่ยงองค์กร",
            evaluation_status: "IN_PROGRESS",
          },
          {
            id: 202,
            auditTopic: "ควบคุมภายในระดับหน่วยงาน",
            auditTopicType: {
              id: 2,
              name: "หัวข้อจากแผนบริหารความเสี่ยง",
              isActive: true,
            },
            DepartmentAssessmentScore: [
              {
                department: {
                  id: 5,
                  departmentName: "กพร.",
                  composite_score: 16,
                  grade: "H",
                },
              },
            ],
            total_score: 16,
            composite_score: 16,
            grade: "H",
            order: 2,
            order_by_user: 2,
            reason_for_new_order: "ปรับมาตรการควบคุม",
            evaluation_status: "IN_PROGRESS",
          },
          {
            id: 203,
            auditTopic: "ธรรมาภิบาลและจริยธรรม",
            auditTopicType: {
              id: 2,
              name: "หัวข้อจากแผนบริหารความเสี่ยง",
              isActive: true,
            },
            DepartmentAssessmentScore: [
              {
                department: {
                  id: 7,
                  departmentName: "กศป.",
                  composite_score: 16,
                  grade: "H",
                },
              },
            ],
            total_score: 16,
            composite_score: 16,
            grade: "H",
            order: 3,
            order_by_user: 3,
            reason_for_new_order: "ยกระดับธรรมาภิบาล",
            evaluation_status: "IN_PROGRESS",
          },
        ],
      },
      {
        id: 3,
        category: { id: 3, name: "โครงการ" },
        auditTopics: [
          {
            id: 301,
            auditTopic: "พัฒนาระบบข้อมูลเศรษฐกิจการเกษตร",
            auditTopicType: {
              id: 3,
              name: "หัวข้อจากยุทธศาสตร์",
              isActive: true,
            },
            DepartmentAssessmentScore: [
              {
                department: {
                  id: 9,
                  departmentName: "ศสส.",
                  composite_score: 16,
                  grade: "H",
                },
              },
            ],
            total_score: 16,
            composite_score: 16,
            grade: "H",
            order: 1,
            order_by_user: 1,
            reason_for_new_order: "โครงการหลัก",
            evaluation_status: "IN_PROGRESS",
          },
          {
            id: 302,
            auditTopic: "ยกระดับการพยากรณ์ผลผลิต",
            auditTopicType: {
              id: 3,
              name: "หัวข้อจากยุทธศาสตร์",
              isActive: true,
            },
            DepartmentAssessmentScore: [
              {
                department: {
                  id: 3,
                  departmentName: "ศกช.",
                  composite_score: 16,
                  grade: "H",
                },
              },
            ],
            total_score: 16,
            composite_score: 16,
            grade: "H",
            order: 2,
            order_by_user: 2,
            reason_for_new_order: "โครงการสำคัญ",
            evaluation_status: "IN_PROGRESS",
          },
          {
            id: 303,
            auditTopic: "บูรณาการฐานข้อมูลพื้นที่เพาะปลูก",
            auditTopicType: {
              id: 3,
              name: "หัวข้อจากยุทธศาสตร์",
              isActive: true,
            },
            DepartmentAssessmentScore: [
              {
                department: {
                  id: 9,
                  departmentName: "ศสส.",
                  composite_score: 16,
                  grade: "H",
                },
              },
            ],
            total_score: 16,
            composite_score: 16,
            grade: "H",
            order: 3,
            order_by_user: 3,
            reason_for_new_order: "คุมคุณภาพข้อมูล",
            evaluation_status: "IN_PROGRESS",
          },
          {
            id: 304,
            auditTopic: "พัฒนาศูนย์เรียนรู้เกษตรสมัยใหม่",
            auditTopicType: {
              id: 3,
              name: "หัวข้อจากยุทธศาสตร์",
              isActive: true,
            },
            DepartmentAssessmentScore: [
              {
                department: {
                  id: 5,
                  departmentName: "กพร.",
                  composite_score: 16,
                  grade: "H",
                },
              },
            ],
            total_score: 16,
            composite_score: 16,
            grade: "H",
            order: 4,
            order_by_user: 4,
            reason_for_new_order: "ยกระดับทักษะบุคลากร",
            evaluation_status: "IN_PROGRESS",
          },
        ],
      },
      {
        id: 4,
        category: { id: 4, name: "โครงการกันเงินเหลื่อมปี" },
        auditTopics: [
          {
            id: 401,
            auditTopic: "กันเงิน: ปรับปรุงคลังข้อมูลกลาง",
            auditTopicType: {
              id: 4,
              name: "หัวข้อกันเงินเหลื่อมปี",
              isActive: true,
            },
            DepartmentAssessmentScore: [
              {
                department: {
                  id: 9,
                  departmentName: "ศสส.",
                  composite_score: 16,
                  grade: "H",
                },
              },
            ],
            total_score: 16,
            composite_score: 16,
            grade: "H",
            order: 1,
            order_by_user: 1,
            reason_for_new_order: "แผนกันเงิน",
            evaluation_status: "IN_PROGRESS",
          },
          {
            id: 402,
            auditTopic: "กันเงิน: จัดซื้ออุปกรณ์สำรวจภาคสนาม",
            auditTopicType: {
              id: 4,
              name: "หัวข้อกันเงินเหลื่อมปี",
              isActive: true,
            },
            DepartmentAssessmentScore: [
              {
                department: {
                  id: 2,
                  departmentName: "ศสท.1",
                  composite_score: 16,
                  grade: "H",
                },
              },
            ],
            total_score: 16,
            composite_score: 16,
            grade: "H",
            order: 2,
            order_by_user: 2,
            reason_for_new_order: "เร่งรัดการใช้จ่าย",
            evaluation_status: "IN_PROGRESS",
          },
          {
            id: 403,
            auditTopic: "กันเงิน: ปรับปรุงระบบบริหารจัดการพัสดุ",
            auditTopicType: {
              id: 4,
              name: "หัวข้อกันเงินเหลื่อมปี",
              isActive: true,
            },
            DepartmentAssessmentScore: [
              {
                department: {
                  id: 1,
                  departmentName: "สลก.",
                  composite_score: 16,
                  grade: "H",
                },
              },
            ],
            total_score: 16,
            composite_score: 16,
            grade: "H",
            order: 3,
            order_by_user: 3,
            reason_for_new_order: "ควบคุมสินทรัพย์",
            evaluation_status: "IN_PROGRESS",
          },
        ],
      },
      {
        id: 5,
        category: { id: 5, name: "กิจกรรม" },
        auditTopics: [
          {
            id: 501,
            auditTopic: "พัฒนาระบบและแพลตฟอร์มข้อมูล",
            auditTopicType: { id: 5, name: "กิจกรรมเชิงพัฒนา", isActive: true },
            DepartmentAssessmentScore: [
              {
                department: {
                  id: 9,
                  departmentName: "ศสส.",
                  composite_score: 16,
                  grade: "H",
                },
              },
            ],
            total_score: 16,
            composite_score: 16,
            grade: "H",
            order: 1,
            order_by_user: 1,
            reason_for_new_order: "ขยายบริการข้อมูล",
            evaluation_status: "IN_PROGRESS",
          },
          {
            id: 502,
            auditTopic: "ติดตามและประเมินผลโครงการ",
            auditTopicType: { id: 5, name: "กิจกรรมเชิงพัฒนา", isActive: true },
            DepartmentAssessmentScore: [
              {
                department: {
                  id: 6,
                  departmentName: "ศปผ.",
                  composite_score: 16,
                  grade: "H",
                },
              },
              {
                department: {
                  id: 5,
                  departmentName: "กพร.",
                  composite_score: 16,
                  grade: "H",
                },
              },
            ],
            total_score: 16,
            composite_score: 16,
            grade: "H",
            order: 2,
            order_by_user: 2,
            reason_for_new_order: "ปรับปรุงผลสัมฤทธิ์",
            evaluation_status: "IN_PROGRESS",
          },
          {
            id: 503,
            auditTopic: "อบรมและถ่ายทอดองค์ความรู้",
            auditTopicType: { id: 5, name: "กิจกรรมเชิงพัฒนา", isActive: true },
            DepartmentAssessmentScore: [
              {
                department: {
                  id: 7,
                  departmentName: "กศป.",
                  composite_score: 16,
                  grade: "H",
                },
              },
              {
                department: {
                  id: 1,
                  departmentName: "สลก.",
                  composite_score: 16,
                  grade: "H",
                },
              },
            ],
            total_score: 16,
            composite_score: 16,
            grade: "H",
            order: 3,
            order_by_user: 3,
            reason_for_new_order: "ยกระดับทักษะ",
            evaluation_status: "IN_PROGRESS",
          },
        ],
      },
      {
        id: 6,
        category: { id: 6, name: "กระบวนงาน" },
        auditTopics: [
          {
            id: 601,
            auditTopic: "กระบวนงานจัดซื้อจัดจ้าง",
            auditTopicType: { id: 6, name: "กระบวนงานหลัก", isActive: true },
            DepartmentAssessmentScore: [
              {
                department: {
                  id: 1,
                  departmentName: "สลก.",
                  composite_score: 16,
                  grade: "H",
                },
              },
            ],
            total_score: 16,
            composite_score: 16,
            grade: "H",
            order: 1,
            order_by_user: 1,
            reason_for_new_order: "ลดความเสี่ยงทุจริต",
            evaluation_status: "IN_PROGRESS",
          },
          {
            id: 602,
            auditTopic: "กระบวนงานควบคุมภายใน",
            auditTopicType: { id: 6, name: "กระบวนงานหลัก", isActive: true },
            DepartmentAssessmentScore: [
              {
                department: {
                  id: 5,
                  departmentName: "กพร.",
                  composite_score: 16,
                  grade: "H",
                },
              },
            ],
            total_score: 16,
            composite_score: 16,
            grade: "H",
            order: 2,
            order_by_user: 2,
            reason_for_new_order: "มาตรฐานควบคุม",
            evaluation_status: "IN_PROGRESS",
          },
          {
            id: 603,
            auditTopic: "กระบวนงานบริหารทรัพยากรบุคคล",
            auditTopicType: { id: 6, name: "กระบวนงานหลัก", isActive: true },
            DepartmentAssessmentScore: [
              {
                department: {
                  id: 1,
                  departmentName: "สลก.",
                  composite_score: 16,
                  grade: "H",
                },
              },
            ],
            total_score: 16,
            composite_score: 16,
            grade: "H",
            order: 3,
            order_by_user: 3,
            reason_for_new_order: "บริหารกำลังคน",
            evaluation_status: "IN_PROGRESS",
          },
          {
            id: 604,
            auditTopic: "กระบวนงานบริหารความต่อเนื่องทางธุรกิจ",
            auditTopicType: { id: 6, name: "กระบวนงานหลัก", isActive: true },
            DepartmentAssessmentScore: [
              {
                department: {
                  id: 9,
                  departmentName: "ศสส.",
                  composite_score: 16,
                  grade: "H",
                },
              },
            ],
            total_score: 16,
            composite_score: 16,
            grade: "H",
            order: 4,
            order_by_user: 4,
            reason_for_new_order: "BCM/DRP",
            evaluation_status: "IN_PROGRESS",
          },
        ],
      },
      {
        id: 7,
        category: { id: 7, name: "IT/Non-IT" },
        auditTopics: [
          {
            id: 701,
            auditTopic: "ระบบคลังข้อมูลเศรษฐกิจการเกษตร (IT)",
            auditTopicType: {
              id: 7,
              name: "งานเทคโนโลยีและไม่ใช่เทคโนโลยี",
              isActive: true,
            },
            DepartmentAssessmentScore: [
              {
                department: {
                  id: 9,
                  departmentName: "ศสส.",
                  composite_score: 16,
                  grade: "H",
                },
              },
            ],
            total_score: 16,
            composite_score: 16,
            grade: "H",
            order: 1,
            order_by_user: 1,
            reason_for_new_order: "ระบบหลัก IT",
            evaluation_status: "IN_PROGRESS",
          },
          {
            id: 702,
            auditTopic: "ระบบสารบรรณอิเล็กทรอนิกส์ (IT)",
            auditTopicType: {
              id: 7,
              name: "งานเทคโนโลยีและไม่ใช่เทคโนโลยี",
              isActive: true,
            },
            DepartmentAssessmentScore: [
              {
                department: {
                  id: 1,
                  departmentName: "สลก.",
                  composite_score: 16,
                  grade: "H",
                },
              },
            ],
            total_score: 16,
            composite_score: 16,
            grade: "H",
            order: 2,
            order_by_user: 2,
            reason_for_new_order: "สนับสนุนบริการ",
            evaluation_status: "IN_PROGRESS",
          },
          {
            id: 703,
            auditTopic: "การบริหารพัสดุและครุภัณฑ์ (Non-IT)",
            auditTopicType: {
              id: 7,
              name: "งานเทคโนโลยีและไม่ใช่เทคโนโลยี",
              isActive: true,
            },
            DepartmentAssessmentScore: [
              {
                department: {
                  id: 7,
                  departmentName: "กศป.",
                  composite_score: 16,
                  grade: "H",
                },
              },
            ],
            total_score: 16,
            composite_score: 16,
            grade: "H",
            order: 3,
            order_by_user: 3,
            reason_for_new_order: "คุมทรัพย์สิน",
            evaluation_status: "IN_PROGRESS",
          },
          {
            id: 704,
            auditTopic: "การเงินและบัญชีภายใน (Non-IT)",
            auditTopicType: {
              id: 7,
              name: "งานเทคโนโลยีและไม่ใช่เทคโนโลยี",
              isActive: true,
            },
            DepartmentAssessmentScore: [
              {
                department: {
                  id: 5,
                  departmentName: "กพร.",
                  composite_score: 16,
                  grade: "H",
                },
              },
            ],
            total_score: 16,
            composite_score: 16,
            grade: "H",
            order: 4,
            order_by_user: 4,
            reason_for_new_order: "เสถียรภาพการเงิน",
            evaluation_status: "IN_PROGRESS",
          },
        ],
      },
    ],
  },
  // ข้อมูลปี 2567 สำหรับการเปรียบเทียบ
  {
    id: 2,
    fiscalYear: 2567,
    status: "DIRECTOR_APPROVED",
    auditor_signature: "นางสาวสมหญิง ใจดี",
    director_signature: "นายสมชาย ใจกล้า", 
    director_comment: "อนุมัติผลการประเมินความเสี่ยงปี 2567",
    version: 1,
    RiskEvaluations: [
      {
        id: 1,
        category: { id: 1, name: "งาน" },
        auditTopics: [
          {
            id: 101,
            auditTopic: "การควบคุมภายใน",
            auditTopicType: {
              id: 1,
              name: "หัวข้องานตรวจสอบ",
              isActive: true,
            },
            DepartmentAssessmentScore: [
              {
                department: {
                  id: 1,
                  departmentName: "สลก.",
                  composite_score: 72,
                  grade: "H",
                },
              },
            ],
            total_score: 72,
            composite_score: 72,
            grade: "H",
            order: 1,
            order_by_user: 1,
            reason_for_new_order: "ความเสี่ยงหลักขององค์กร",
            evaluation_status: "DONE",
          },
          {
            id: 102,
            auditTopic: "สำรวจผลผลิตข้าว",
            auditTopicType: {
              id: 1,
              name: "หัวข้องานตรวจสอบ",
              isActive: true,
            },
            DepartmentAssessmentScore: [
              {
                department: {
                  id: 3,
                  departmentName: "ศกช.",
                  composite_score: 68,
                  grade: "H",
                },
              },
            ],
            total_score: 68,
            composite_score: 68,
            grade: "H",
            order: 2,
            order_by_user: 2,
            reason_for_new_order: "งานประจำสำคัญ",
            evaluation_status: "DONE",
          },
          {
            id: 103,
            auditTopic: "สำรวจพื้นที่เพาะปลูก",
            auditTopicType: {
              id: 1,
              name: "หัวข้องานตรวจสอบ",
              isActive: true,
            },
            DepartmentAssessmentScore: [
              {
                department: {
                  id: 5,
                  departmentName: "ศสท.1",
                  composite_score: 45,
                  grade: "M",
                },
              },
            ],
            total_score: 45,
            composite_score: 45,
            grade: "M",
            order: 3,
            order_by_user: 3,
            reason_for_new_order: "งานสำรวจประจำปี",
            evaluation_status: "DONE",
          },
        ],
      },
      {
        id: 2,
        category: { id: 2, name: "โครงการ" },
        auditTopics: [
          {
            id: 201,
            auditTopic: "พัฒนาระบบฐานข้อมูล",
            auditTopicType: {
              id: 2,
              name: "หัวข้อโครงการ",
              isActive: true,
            },
            DepartmentAssessmentScore: [
              {
                department: {
                  id: 6,
                  departmentName: "กพร.",
                  composite_score: 52,
                  grade: "M",
                },
              },
            ],
            total_score: 52,
            composite_score: 52,
            grade: "M",
            order: 1,
            order_by_user: 1,
            reason_for_new_order: "โครงการพัฒนาสำคัญ",
            evaluation_status: "DONE",
          },
        ],
      },
      {
        id: 3,
        category: { id: 3, name: "โครงการกันเงินเหลื่อมปี" },
        auditTopics: [
          {
            id: 301,
            auditTopic: "ปรับปรุงระบบเงินเดือน",
            auditTopicType: {
              id: 3,
              name: "หัวข้อโครงการกันเงิน",
              isActive: true,
            },
            DepartmentAssessmentScore: [
              {
                department: {
                  id: 6,
                  departmentName: "กพร.",
                  composite_score: 38,
                  grade: "L",
                },
              },
            ],
            total_score: 38,
            composite_score: 38,
            grade: "L",
            order: 1,
            order_by_user: 1,
            reason_for_new_order: "โครงการค้างจากปีก่อน",
            evaluation_status: "DONE",
          },
        ],
      },
      {
        id: 4,
        category: { id: 4, name: "กิจกรรม" },
        auditTopics: [
          {
            id: 401,
            auditTopic: "ประเมินโครงการ",
            auditTopicType: {
              id: 4,
              name: "หัวข้อกิจกรรม",
              isActive: true,
            },
            DepartmentAssessmentScore: [
              {
                department: {
                  id: 7,
                  departmentName: "ศปผ.",
                  composite_score: 58,
                  grade: "M",
                },
              },
            ],
            total_score: 58,
            composite_score: 58,
            grade: "M",
            order: 1,
            order_by_user: 1,
            reason_for_new_order: "กิจกรรมประจำปี",
            evaluation_status: "DONE",
          },
          {
            id: 402,
            auditTopic: "อบรมบุคลากร",
            auditTopicType: {
              id: 4,
              name: "หัวข้อกิจกรรม",
              isActive: true,
            },
            DepartmentAssessmentScore: [
              {
                department: {
                  id: 8,
                  departmentName: "กศป.",
                  composite_score: 35,
                  grade: "L",
                },
              },
            ],
            total_score: 35,
            composite_score: 35,
            grade: "L",
            order: 2,
            order_by_user: 2,
            reason_for_new_order: "พัฒนาทักษะ",
            evaluation_status: "DONE",
          },
        ],
      },
      {
        id: 5,
        category: { id: 5, name: "กระบวนงาน" },
        auditTopics: [
          {
            id: 501,
            auditTopic: "จัดซื้อจัดจ้าง",
            auditTopicType: {
              id: 5,
              name: "หัวข้อกระบวนงาน",
              isActive: true,
            },
            DepartmentAssessmentScore: [
              {
                department: {
                  id: 1,
                  departmentName: "สลก.",
                  composite_score: 48,
                  grade: "M",
                },
              },
            ],
            total_score: 48,
            composite_score: 48,
            grade: "M",
            order: 1,
            order_by_user: 1,
            reason_for_new_order: "กระบวนการสำคัญ",
            evaluation_status: "DONE",
          },
          {
            id: 502,
            auditTopic: "พัฒนาระบบฐานข้อมูล",
            auditTopicType: {
              id: 5,
              name: "หัวข้อกระบวนงาน",
              isActive: true,
            },
            DepartmentAssessmentScore: [
              {
                department: {
                  id: 9,
                  departmentName: "ศสส.",
                  composite_score: 75,
                  grade: "H",
                },
              },
            ],
            total_score: 75,
            composite_score: 75,
            grade: "H",
            order: 2,
            order_by_user: 2,
            reason_for_new_order: "ปรับปรุงระบบ",
            evaluation_status: "DONE",
          },
        ],
      },
      {
        id: 6,
        category: { id: 6, name: "IT/Non-IT" },
        auditTopics: [
          {
            id: 601,
            auditTopic: "ระบบคลังข้อมูลกลาง",
            auditTopicType: {
              id: 6,
              name: "หัวข้อระบบ IT",
              isActive: true,
            },
            DepartmentAssessmentScore: [
              {
                department: {
                  id: 9,
                  departmentName: "ศสส.",
                  composite_score: 82,
                  grade: "E",
                },
              },
            ],
            total_score: 82,
            composite_score: 82,
            grade: "E",
            order: 1,
            order_by_user: 1,
            reason_for_new_order: "ระบบหลักสำคัญ",
            evaluation_status: "DONE",
          },
          {
            id: 602,
            auditTopic: "ระบบสารบรรณ",
            auditTopicType: {
              id: 6,
              name: "หัวข้อระบบ IT",
              isActive: true,
            },
            DepartmentAssessmentScore: [
              {
                department: {
                  id: 1,
                  departmentName: "สลก.",
                  composite_score: 42,
                  grade: "M",
                },
              },
            ],
            total_score: 42,
            composite_score: 42,
            grade: "M",
            order: 2,
            order_by_user: 2,
            reason_for_new_order: "ระบบสนับสนุนงาน",
            evaluation_status: "DONE",
          },
          {
            id: 603,
            auditTopic: "ระบบบริหารงานบุคคล",
            auditTopicType: {
              id: 6,
              name: "หัวข้อระบบ Non-IT",
              isActive: true,
            },
            DepartmentAssessmentScore: [
              {
                department: {
                  id: 8,
                  departmentName: "กศป.",
                  composite_score: 28,
                  grade: "L",
                },
              },
            ],
            total_score: 28,
            composite_score: 28,
            grade: "L",
            order: 3,
            order_by_user: 3,
            reason_for_new_order: "ระบบบริหารงาน",
            evaluation_status: "DONE",
          },
          {
            id: 604,
            auditTopic: "ระบบติดตามโครงการ",
            auditTopicType: {
              id: 6,
              name: "หัวข้อระบบ IT",
              isActive: true,
            },
            DepartmentAssessmentScore: [
              {
                department: {
                  id: 7,
                  departmentName: "ศปผ.",
                  composite_score: 65,
                  grade: "H",
                },
              },
            ],
            total_score: 65,
            composite_score: 65,
            grade: "H",
            order: 4,
            order_by_user: 4,
            reason_for_new_order: "ติดตามผลงาน",
            evaluation_status: "DONE",
          },
          {
            id: 605,
            auditTopic: "ระบบจัดเก็บข้อมูลสำรวจ",
            auditTopicType: {
              id: 6,
              name: "หัวข้อระบบ IT",
              isActive: true,
            },
            DepartmentAssessmentScore: [
              {
                department: {
                  id: 3,
                  departmentName: "ศกช.",
                  composite_score: 55,
                  grade: "M",
                },
              },
            ],
            total_score: 55,
            composite_score: 55,
            grade: "M",
            order: 5,
            order_by_user: 5,
            reason_for_new_order: "จัดเก็บข้อมูล",
            evaluation_status: "DONE",
          },
          {
            id: 606,
            auditTopic: "ระบบรายงานผลสำรวจ",
            auditTopicType: {
              id: 6,
              name: "หัวข้อระบบ Non-IT",
              isActive: true,
            },
            DepartmentAssessmentScore: [
              {
                department: {
                  id: 5,
                  departmentName: "ศสท.1",
                  composite_score: 32,
                  grade: "L",
                },
              },
            ],
            total_score: 32,
            composite_score: 32,
            grade: "L",
            order: 6,
            order_by_user: 6,
            reason_for_new_order: "รายงานผล",
            evaluation_status: "DONE",
          },
        ],
      },
      {
        id: 7,
        category: { id: 7, name: "หน่วยงาน" },
        auditTopics: [
          {
            id: 701,
            auditTopic: "บริหารจัดการทั่วไป",
            auditTopicType: {
              id: 7,
              name: "หัวข้อหน่วยงาน",
              isActive: true,
            },
            DepartmentAssessmentScore: [
              {
                department: {
                  id: 1,
                  departmentName: "สลก.",
                  composite_score: 60,
                  grade: "H",
                },
              },
            ],
            total_score: 60,
            composite_score: 60,
            grade: "H",
            order: 1,
            order_by_user: 1,
            reason_for_new_order: "ภารกิจหลัก",
            evaluation_status: "DONE",
          },
        ],
      },
    ],
  },
];

/** ========= Helpers ========= */

/** ✅ Sync กับ mock database - อัพเดตข้อมูลจากฟอร์มที่บันทึกแล้ว */
function syncWithMockDatabase(
  data: ApiAnnualEvaluation[]
): ApiAnnualEvaluation[] {
  return data.map((a) => ({
    ...a,
    RiskEvaluations: a.RiskEvaluations.map((re) => ({
      ...re,
      auditTopics: re.auditTopics.map((t) => {
        // อัพเดต DepartmentAssessmentScore ก่อน
        const updatedDepartmentScores = t.DepartmentAssessmentScore.map(
          (ds) => {
            const compoundId = `a${a.id}-c${re.id}-t${t.id}-d${ds.department.id}`;
            const override = db.overrides[compoundId];
            const form = formsMap.get(compoundId);

            if (override || form) {
              console.log(
                `✅ Found data for ${compoundId} (${ds.department.departmentName}):`,
                {
                  score: override?.score ?? form?.composite,
                  grade: override?.grade ?? form?.grade,
                  status: override?.status ?? form?.status,
                  auditTopic: t.auditTopic,
                }
              );

              return {
                ...ds,
                department: {
                  ...ds.department,
                  composite_score: override?.score ?? form?.composite ?? null,
                  grade: (override?.grade ?? form?.grade ?? null) as MaybeGrade,
                },
              };
            } else {
              console.log(
                `❌ No data found for ${compoundId} (${ds.department.departmentName})`
              );
            }

            return {
              ...ds,
              department: {
                ...ds.department,
                composite_score: null,
                grade: null,
              },
            };
          }
        );

        // คำนวณ topic level scores จาก department scores ที่อัพเดตแล้ว
        const validScores = updatedDepartmentScores
          .map((ds) => ds.department.composite_score)
          .filter((score): score is number => score !== null);

        const hasScores = validScores.length > 0;
        // ✅ เปลี่ยนจากค่าเฉลี่ยเป็นผลรวม เพราะ parent score ควรเป็นผลรวมของ children
        const totalScore = hasScores
          ? validScores.reduce((sum, score) => sum + score, 0)
          : 0;

        // ✅ ตรวจสอบสถานะแต่ละ department แยกกัน - ไม่ควรอิงสถานะรวม
        const departmentStatuses = updatedDepartmentScores.map((ds) => {
          const compoundId = `a${a.id}-c${re.id}-t${t.id}-d${ds.department.id}`;
          const override = db.overrides[compoundId];
          const form = formsMap.get(compoundId);
          return {
            departmentId: ds.department.id,
            status: override?.status ?? form?.status ?? "ยังไม่ได้ประเมิน",
            hasScore: (ds.department.composite_score ?? 0) > 0,
          };
        });

        const evaluatedDepartments = departmentStatuses.filter(
          (d) => d.hasScore
        );
        const allDone =
          evaluatedDepartments.length > 0 &&
          evaluatedDepartments.every((d) => d.status === "ประเมินแล้ว");
        // const someDone = evaluatedDepartments.some(
        //   (d) => d.status === "ประเมินแล้ว"
        // );

        return {
          ...t,
          total_score: hasScores ? totalScore : null,
          composite_score: hasScores ? totalScore : null,
          grade: hasScores
            ? ((totalScore >= 80
                ? "E"
                : totalScore >= 60
                ? "H"
                : totalScore >= 40
                ? "M"
                : totalScore >= 20
                ? "L"
                : "N") as MaybeGrade)
            : null,
          evaluation_status:
            evaluatedDepartments.length === 0
              ? ("PENDING" as EvaluationStatus)
              : allDone
              ? ("DONE" as EvaluationStatus)
              : ("IN_PROGRESS" as EvaluationStatus),
          DepartmentAssessmentScore: updatedDepartmentScores,
        };
      }),
    })),
  }));
}

/** ========= GET /api/annual-evaluations =========
 * Query params (optional):
 * - year: number (เช่น 2568)
 * - status: AnnualStatus
 * - category: ชื่อหมวดหมู่ (เช่น "งาน", "หน่วยงาน", "IT", "Non-IT", ...)
 * - search: ค้นหาในชื่อหัวข้อ (auditTopic) และชื่อหน่วยงาน (departmentName)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    // ✅ รองรับทั้ง fiscalYear และ year
    const fiscalYear =
      searchParams.get("fiscalYear") ?? searchParams.get("year");
    const status = searchParams.get("status");
    const category = searchParams.get("category"); // "งาน" | "หน่วยงาน" | "IT/Non-IT" | ...
    const search = (searchParams.get("search") || "").trim();

    let data: ApiAnnualEvaluation[] = JSON.parse(
      JSON.stringify(mockAnnualEvaluations)
    );

    // ✅ Sync กับ mock database แทนการรีเซ็ต
    data = syncWithMockDatabase(data);

    // === กรองตามปี ===
    if (fiscalYear) {
      const y = Number(fiscalYear);
      data = data.filter((a) => a.fiscalYear === y);
    }

    // === กรองตามสถานะรายปี (AnnualStatus) ===
    if (status) {
      data = data.filter((a) => a.status === status);
    }

    // === กรองตามหมวด (category.name) ===
    if (category) {
      data = data.map((a) => ({
        ...a,
        RiskEvaluations: a.RiskEvaluations.filter(
          (re) => re.category?.name === category
        ),
      }));
    }

    // === ค้นหา (ใน auditTopic + departmentName) ===
    if (search) {
      const q = search.toLowerCase();
      data = data.map((a) => ({
        ...a,
        RiskEvaluations: a.RiskEvaluations.map((re) => ({
          ...re,
          auditTopics: re.auditTopics.filter((t) => {
            const inTopic = (t.auditTopic || "").toLowerCase().includes(q);
            const inDept = t.DepartmentAssessmentScore?.some((ds) =>
              (ds.department?.departmentName || "").toLowerCase().includes(q)
            );
            return inTopic || inDept;
          }),
        })).filter((re) => re.auditTopics.length > 0),
      }));
    }

    await new Promise((r) => setTimeout(r, 400));

    return NextResponse.json({
      success: true,
      data,
      total: data.length,
      message: "Annual evaluations retrieved successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch annual evaluations",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/** ========= POST /api/annual-evaluations =========
 * สร้างรายการใหม่
 * Body รองรับ 2 รูปแบบ:
 *  1) { fiscalYear, status, version } -> จะสร้างโครงว่าง RiskEvaluations=[]
 *  2) ทั้งก้อนแบบ ApiAnnualEvaluation (ไม่ต้องมี id) -> จะ push ตามที่ส่งมา
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // โหมดส่งก้อนเต็ม
    const isFullShape =
      typeof body === "object" &&
      ("RiskEvaluations" in body || "auditor_signature" in body);

    let created: ApiAnnualEvaluation;

    if (isFullShape) {
      const incoming = body as Omit<ApiAnnualEvaluation, "id"> & {
        id?: number;
      };
      created = {
        ...incoming,
        id: mockAnnualEvaluations.reduce((m, a) => Math.max(m, a.id), 0) + 1,
      };
    } else {
      // โหมดส่งค่า minimal
      const {
        fiscalYear,
        status,
        version = 1,
      }: {
        fiscalYear?: number;
        status?: AnnualStatus;
        version?: number;
      } = body || {};

      if (!fiscalYear || !status) {
        return NextResponse.json(
          {
            success: false,
            error: "Missing required fields",
            message: "fiscalYear and status are required",
          },
          { status: 400 }
        );
      }

      created = {
        id: mockAnnualEvaluations.reduce((m, a) => Math.max(m, a.id), 0) + 1,
        fiscalYear,
        status,
        auditor_signature: null,
        director_signature: null,
        director_comment: null,
        version,
        RiskEvaluations: [],
      };
    }

    mockAnnualEvaluations.push(created);

    return NextResponse.json(
      {
        success: true,
        data: created,
        message: "Annual evaluation created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create annual evaluation",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
