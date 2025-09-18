import { useState, useEffect } from "react";

export function useRiskAssessmentData(id: number) {
  const [assessmentData, setAssessmentData] = useState<any>(null);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    // ตรวจสอบข้อมูลจาก localStorage
    const savedAssessments = localStorage.getItem(`risk-assessments-${id}`);
    const savedRisks = localStorage.getItem(`audit-risks-${id}`);
    
    console.log('=== HOOK: Checking localStorage ===');
    console.log('savedAssessments:', savedAssessments);
    console.log('savedRisks:', savedRisks);
    
    if (savedAssessments && savedRisks) {
      try {
        const assessments = JSON.parse(savedAssessments);
        const risks = JSON.parse(savedRisks);
        
        console.log('Parsed assessments:', assessments);
        console.log('Parsed risks:', risks);
        
        setAssessmentData({ assessments, risks });
        setHasData(assessments.length > 0);
      } catch (error) {
        console.error('Error parsing localStorage data:', error);
        setHasData(false);
      }
    } else {
      setHasData(false);
    }
  }, [id]);

  return { assessmentData, hasData };
}