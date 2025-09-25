"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { engagementPlanStorage } from "@/lib/engagement-plan-storage";
import { EngagementPlanProgram } from "@/lib/mock-engagement-plan-programs";

interface EngagementPlanContextType {
  programs: EngagementPlanProgram[];
  isLoading: boolean;
  error: string | null;
  refreshPrograms: () => Promise<void>;
  addProgram: (program: Omit<EngagementPlanProgram, "id">) => Promise<EngagementPlanProgram>;
  updateProgram: (id: number, updates: Partial<Omit<EngagementPlanProgram, "id">>) => Promise<EngagementPlanProgram | null>;
  deleteProgram: (id: number) => Promise<boolean>;
  getProgram: (id: number) => EngagementPlanProgram | undefined;
  getProgramsByFiscalYear: (fiscalYear: number) => EngagementPlanProgram[];
  isStorageAvailable: boolean;
  storageStats: {
    used: number;
    available: number;
    percentage: number;
  };
}

const EngagementPlanContext = createContext<EngagementPlanContextType | undefined>(undefined);

interface EngagementPlanProviderProps {
  children: ReactNode;
}

const initialData: EngagementPlanProgram[] = [
  {
    id: 1,
    auditTopics: {
      id: 1,
      category: { id: 2, name: "งาน" },
      departments: [
        { id: 1, departmentName: "สลก.", isActive: true },
        { id: 2, departmentName: "ศสท.1", isActive: true },
      ],
      auditTopic:
        "ผลการดำเนินโครงการศูนย์เรียนรู้การเพิ่มประสิทธิภาพการผลิตสินค้าเกษตร",
    },
    fiscalYear: 2568,
    status: "AUDITOR_ASSESSING",
    auditor_signature: null,
    director_signature: null,
    director_comment: null,
    version: 1,
  },
  {
    id: 2,
    auditTopics: {
      id: 2,
      category: { id: 3, name: "โครงการ" },
      departments: [{ id: 3, departmentName: "กองทุน FTA", isActive: true }],
      auditTopic:
        "ผลการดำเนินงานของกองทุนปรับโครงสร้างการผลิตภาคเกษตรเพื่อเพิ่มขีดความสามารถการแข่งขัน",
    },
    fiscalYear: 2568,
    status: "AUDITOR_ASSESSING",
    auditor_signature: null,
    director_signature: null,
    director_comment: null,
    version: 1,
  },
  {
    id: 3,
    auditTopics: {
      id: 3,
      category: { id: 1, name: "หน่วยงาน" },
      departments: [
        { id: 4, departmentName: "สำนักการเงินและบัญชี", isActive: true },
      ],
      auditTopic: "งานด้านการเงินและบัญชี",
    },
    fiscalYear: 2568,
    status: "PENDING",
    auditor_signature: null,
    director_signature: null,
    director_comment: null,
    version: 1,
  },
  {
    id: 4,
    auditTopics: {
      id: 4,
      category: { id: 6, name: "กระบวนงาน" },
      departments: [
        { id: 5, departmentName: "สำนักกฎหมายและนโยบาย", isActive: true },
        { id: 6, departmentName: "ฝ่ายแผนงานและงบประมาณ", isActive: true },
      ],
      auditTopic: "การตรวจสอบและประเมินผลการควบคุมภายในและการบริหารความเสี่ยง",
    },
    fiscalYear: 2568,
    status: "PENDING",
    auditor_signature: null,
    director_signature: null,
    director_comment: null,
    version: 1,
  },
  {
    id: 5,
    auditTopics: {
      id: 5,
      category: { id: 5, name: "กิจกรรม" },
      departments: [{ id: 7, departmentName: "สำนักงบประมาณ", isActive: true }],
      auditTopic:
        "การตรวจสอบการปฏิบัติตามข้อเสนอแนะเพื่อป้องกันปัญหาที่เกิดซ้ำจากการปฏิบัติงาน",
    },
    fiscalYear: 2568,
    status: "PENDING",
    auditor_signature: null,
    director_signature: null,
    director_comment: null,
    version: 1,
  },
  {
    id: 6,
    auditTopics: {
      id: 6,
      category: { id: 7, name: "IT และ Non-IT" },
      departments: [
        { id: 8, departmentName: "หน่วยงานในสังกัด อตก.", isActive: true },
      ],
      auditTopic:
        "ติดตามความก้าวหน้าในการปฏิบัติตามข้อเสนอแนะในรายงานผลการตรวจสอบ",
    },
    fiscalYear: 2568,
    status: "PENDING",
    auditor_signature: null,
    director_signature: null,
    director_comment: null,
    version: 1,
  },
  {
    id: 7,
    auditTopics: {
      id: 7,
      category: { id: 4, name: "โครงการกันเงินเหลื่อมปี" },
      departments: [
        { id: 9, departmentName: "หน่วยงานในสังกัด อตก.", isActive: true },
      ],
      auditTopic:
        "ให้คำปรึกษาและแนะแนวทางในการปรับปรุงการดำเนินงานตามมาตรฐานวิชาการเกษตร",
    },
    fiscalYear: 2568,
    status: "PENDING",
    auditor_signature: null,
    director_signature: null,
    director_comment: null,
    version: 1,
  },
];

export function EngagementPlanProvider({ children }: EngagementPlanProviderProps) {
  const [programs, setPrograms] = useState<EngagementPlanProgram[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isStorageAvailable, setIsStorageAvailable] = useState(true);
  const [storageStats, setStorageStats] = useState({
    used: 0,
    available: 0,
    percentage: 0,
  });

  const checkStorageAvailability = () => {
    try {
      const testKey = "__storage_test__";
      localStorage.setItem(testKey, "test");
      localStorage.removeItem(testKey);
      setIsStorageAvailable(true);
      setError(null);
    } catch (err) {
      setIsStorageAvailable(false);
      setError("Local Storage ไม่พร้อมใช้งาน");
    }
  };

  const updateStorageStats = () => {
    const stats = engagementPlanStorage.getStorageStats();
    setStorageStats(stats);
  };

  const refreshPrograms = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Initialize default data if localStorage is empty
      engagementPlanStorage.initializeDefaultData(initialData);
      
      const allPrograms = engagementPlanStorage.getPrograms();
      setPrograms(allPrograms);
      updateStorageStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load programs");
      setPrograms([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addProgram = async (programData: Omit<EngagementPlanProgram, "id">): Promise<EngagementPlanProgram> => {
    try {
      const newProgram = engagementPlanStorage.addProgram(programData);
      await refreshPrograms();
      return newProgram;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add program");
      throw err;
    }
  };

  const updateProgram = async (
    id: number, 
    updates: Partial<Omit<EngagementPlanProgram, "id">>
  ): Promise<EngagementPlanProgram | null> => {
    try {
      const updatedProgram = engagementPlanStorage.updateProgram(id, updates);
      await refreshPrograms();
      return updatedProgram;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update program");
      throw err;
    }
  };

  const deleteProgram = async (id: number): Promise<boolean> => {
    try {
      const success = engagementPlanStorage.removeProgram(id);
      await refreshPrograms();
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete program");
      throw err;
    }
  };

  const getProgram = (id: number): EngagementPlanProgram | undefined => {
    return programs.find(program => program.id === id);
  };

  const getProgramsByFiscalYear = (fiscalYear: number): EngagementPlanProgram[] => {
    return programs.filter(program => program.fiscalYear === fiscalYear);
  };

  useEffect(() => {
    checkStorageAvailability();
    refreshPrograms();

    // Check storage availability periodically
    const interval = setInterval(checkStorageAvailability, 30000);
    return () => clearInterval(interval);
  }, []);

  const value: EngagementPlanContextType = {
    programs,
    isLoading,
    error,
    refreshPrograms,
    addProgram,
    updateProgram,
    deleteProgram,
    getProgram,
    getProgramsByFiscalYear,
    isStorageAvailable,
    storageStats,
  };

  return (
    <EngagementPlanContext.Provider value={value}>
      {children}
    </EngagementPlanContext.Provider>
  );
}

export function useEngagementPlan(): EngagementPlanContextType {
  const context = useContext(EngagementPlanContext);
  if (context === undefined) {
    throw new Error("useEngagementPlan must be used within an EngagementPlanProvider");
  }
  return context;
}