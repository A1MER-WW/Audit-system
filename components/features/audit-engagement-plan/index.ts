// Main listing page components
export { SummaryCards } from "./SummaryCards";
export { FilterBar } from "./FilterBar";
export { EngagementPlanTable } from "./EngagementPlanTable";

// Detail page components
export { StepProgress } from "./StepProgress";
export { StepsNavigation } from "./StepsNavigation";

// Step components
export { 
  ActivityRiskAssessment,
  RiskMatrix,
  RiskAssessmentSummary 
} from "./steps";

// Types
export interface EngagementPlan {
  id: number;
  auditTopic: string;
  departments: string[];
  fiscalYear: string;
  status: string;
  currentStep: number;
  createdDate: string;
  updatedDate: string;
  assignedTo: string;
}

export interface Step {
  id: number;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "pending";
  url: string;
}