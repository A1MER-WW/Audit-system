export type RiskCriterion = {
  id: number;
  name: string;
  score: number;
  description?: string;
  creator: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt: string;
};