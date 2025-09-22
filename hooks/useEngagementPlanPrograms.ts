import { useState, useEffect } from "react";
import { 
  listPrograms, 
  addProgram, 
  removeProgram, 
  type EngagementPlanProgram 
} from "@/lib/mock-engagement-plan-programs";

export function useEngagementPlanPrograms(fiscalYear: number) {
  const [programs, setPrograms] = useState<EngagementPlanProgram[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPrograms = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Get programs by fiscal year
      const data = listPrograms(fiscalYear);
      setPrograms(data);
    } catch (error) {
      console.error('Error fetching engagement plan programs:', error);
      setPrograms([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, [fiscalYear]);

  const refetch = () => {
    return fetchPrograms();
  };

  return {
    programs,
    isLoading,
    refetch,
  };
}

export function createEngagementPlanProgram(input: Omit<EngagementPlanProgram, "id">) {
  return Promise.resolve(addProgram(input));
}

export function deleteEngagementPlanProgram(id: number) {
  removeProgram(id);
  return Promise.resolve();
}