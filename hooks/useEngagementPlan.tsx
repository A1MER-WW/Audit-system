"use client";

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { DEFAULT_USERS } from '@/constants/default-users';

// Types
export interface Activity {
  id: number;
  activity: string;
  riskDescription: string;
  riskLevel: string;
}

export interface Scope {
  id: number;
  text: string;
  subScopes: { id: number; text: string }[];
}

export interface AuditProgramData {
  objective: string;
  method: string;
  analysis: string;
  storage: string;
  source: string;
  responsible: string;
}

export interface EngagementPlanState {
  // Step 1: การประเมินความเสี่ยงระดับกิจกรรม
  step1: {
    basicInfo: {
      auditedUnit: string;
      auditCategory: string;
      preparer: string;
      reviewer: string;
      approver: string;
    };
    description: string;
    selectedActivities: Activity[];
  };

  // Step 2: แผนการปฏิบัติงาน (Engagement Plan)
  step2: {
    auditIssues: string;
    objectives: string[];
    scopes: Scope[];
    auditDuration: string;
    auditMethodology: string;
    auditResponsible: string;
    supervisor: string;
  };

  // Step 3: Audit Program
  step3: {
    auditPrograms: AuditProgramData[];
  };

  // Step 4: การรายงานผลการตรวจสอบ
  step4: {
    reportingObjective: string;
    reportingMethod: string;
    analysisMethod: string;
    dataStorage: string;
    dataSources: string;
    responsible: string;
    remarks: string;
  };

  // Step completion status
  completedSteps: number[];
}

// Initial state
const initialState: EngagementPlanState = {
  step1: {
    basicInfo: {
      auditedUnit: '',
      auditCategory: '',
      preparer: DEFAULT_USERS.preparer,
      reviewer: DEFAULT_USERS.reviewer,
      approver: DEFAULT_USERS.approver,
    },
    description: '',
    selectedActivities: [],
  },
  step2: {
    auditIssues: '',
    objectives: [],
    scopes: [],
    auditDuration: '',
    auditMethodology: '',
    auditResponsible: DEFAULT_USERS.auditResponsible,
    supervisor: DEFAULT_USERS.supervisor,
  },
  step3: {
    auditPrograms: [],
  },
  step4: {
    reportingObjective: '',
    reportingMethod: '',
    analysisMethod: '',
    dataStorage: '',
    dataSources: '',
    responsible: DEFAULT_USERS.auditResponsible,
    remarks: '',
  },
  completedSteps: [],
};

// Action types
type EngagementPlanAction = 
  | { type: 'UPDATE_STEP1'; payload: Partial<EngagementPlanState['step1']> }
  | { type: 'UPDATE_STEP2'; payload: Partial<EngagementPlanState['step2']> }
  | { type: 'UPDATE_STEP3'; payload: Partial<EngagementPlanState['step3']> }
  | { type: 'UPDATE_STEP4'; payload: Partial<EngagementPlanState['step4']> }
  | { type: 'COMPLETE_STEP'; payload: number }
  | { type: 'RESET_STATE' }
  | { type: 'LOAD_STATE'; payload: EngagementPlanState };

// Reducer
function engagementPlanReducer(
  state: EngagementPlanState, 
  action: EngagementPlanAction
): EngagementPlanState {
  switch (action.type) {
    case 'UPDATE_STEP1':
      const updatedStep1 = { ...state.step1, ...action.payload };
      // Ensure basic info always has defaults if not provided
      if (updatedStep1.basicInfo) {
        updatedStep1.basicInfo = {
          ...updatedStep1.basicInfo,
          preparer: updatedStep1.basicInfo.preparer || DEFAULT_USERS.preparer,
          reviewer: updatedStep1.basicInfo.reviewer || DEFAULT_USERS.reviewer,
          approver: updatedStep1.basicInfo.approver || DEFAULT_USERS.approver,
        };
      }
      return {
        ...state,
        step1: updatedStep1,
      };
    case 'UPDATE_STEP2':
      const updatedStep2 = { ...state.step2, ...action.payload };
      // Ensure audit responsible and supervisor have defaults if not provided
      updatedStep2.auditResponsible = updatedStep2.auditResponsible || DEFAULT_USERS.auditResponsible;
      updatedStep2.supervisor = updatedStep2.supervisor || DEFAULT_USERS.supervisor;
      return {
        ...state,
        step2: updatedStep2,
      };
    case 'UPDATE_STEP3':
      return {
        ...state,
        step3: { ...state.step3, ...action.payload },
      };
    case 'UPDATE_STEP4':
      const updatedStep4 = { ...state.step4, ...action.payload };
      // Ensure responsible has default if not provided
      updatedStep4.responsible = updatedStep4.responsible || DEFAULT_USERS.auditResponsible;
      return {
        ...state,
        step4: updatedStep4,
      };
    case 'COMPLETE_STEP':
      return {
        ...state,
        completedSteps: state.completedSteps.includes(action.payload)
          ? state.completedSteps
          : [...state.completedSteps, action.payload],
      };
    case 'RESET_STATE':
      return initialState;
    case 'LOAD_STATE':
      return action.payload;
    default:
      return state;
  }
}

// Context
interface EngagementPlanContextType {
  state: EngagementPlanState;
  dispatch: React.Dispatch<EngagementPlanAction>;
  saveProgress: (step: number) => void;
  isStepCompleted: (step: number) => boolean;
  getAllStepsCompleted: () => boolean;
}

const EngagementPlanContext = createContext<EngagementPlanContextType | undefined>(undefined);

// Provider
interface EngagementPlanProviderProps {
  children: ReactNode;
  planId: string;
}

export function EngagementPlanProvider({ children, planId }: EngagementPlanProviderProps) {
  const [state, dispatch] = useReducer(engagementPlanReducer, initialState);

  // Load state from localStorage on mount
  React.useEffect(() => {
    const savedState = localStorage.getItem(`engagement-plan-${planId}`);
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: 'LOAD_STATE', payload: parsedState });
      } catch (error) {
        console.error('Error loading saved state:', error);
      }
    }
  }, [planId]);

  // Save state to localStorage whenever state changes
  React.useEffect(() => {
    localStorage.setItem(`engagement-plan-${planId}`, JSON.stringify(state));
  }, [state, planId]);

  const saveProgress = (step: number) => {
    dispatch({ type: 'COMPLETE_STEP', payload: step });
  };

  const isStepCompleted = (step: number) => {
    return state.completedSteps.includes(step);
  };

  const getAllStepsCompleted = () => {
    return state.completedSteps.length >= 4; // 4 main steps
  };

  const value: EngagementPlanContextType = {
    state,
    dispatch,
    saveProgress,
    isStepCompleted,
    getAllStepsCompleted,
  };

  return (
    <EngagementPlanContext.Provider value={value}>
      {children}
    </EngagementPlanContext.Provider>
  );
}

// Hook
export function useEngagementPlan() {
  const context = useContext(EngagementPlanContext);
  if (!context) {
    throw new Error('useEngagementPlan must be used within an EngagementPlanProvider');
  }
  return context;
}