'use client';

import { useNavigationHistory } from "@/hooks/navigation-history";

export  function NavigationHandler() {
  useNavigationHistory({
    defaultPath: '/home', 
    resetOnExternalReferrer: true
  });
  
  return null;
}