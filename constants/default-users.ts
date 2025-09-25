// Default users for audit engagement plan
export const DEFAULT_USERS = {
  preparer: 'นางสาวกุสุมา สุขสอน (ผู้ตรวจสอบภายใน)',
  reviewer: 'นางสาวจิรวรรณ สมัคร (หัวหน้ากลุ่มตรวจสอบภายใน)',
  approver: 'นางสาวจิรวรรณ สมัคร (หัวหน้ากลุ่มตรวจสอบภายใน)',
  auditResponsible: 'นางสาวกุสุมา สุขสอน (ผู้ตรวจสอบภายใน)',
  supervisor: 'นางสาวจิรวรรณ สมัคร (หัวหน้ากลุ่มตรวจสอบภายใน)',
} as const;

export type DefaultUserKeys = keyof typeof DEFAULT_USERS;