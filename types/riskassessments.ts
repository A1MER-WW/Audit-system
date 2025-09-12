import React from "react";

type Props = {
  columns: string[];
  levels: LikelihoodLevel[];
  data: Record<string, Record<string, string>>;
  prevData?: Record<string, Record<string, string>>;
  comparePrev?: boolean;
};

export type LikelihoodLevel = { level: number; label: string };
export type ManageChoice = "want" | "not_want";